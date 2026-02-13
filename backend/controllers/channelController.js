const Channel = require('../models/Channel');
const User = require('../models/User');

// @desc    Obtener todos los canales
// @route   GET /api/channels
// @access  Public
exports.getAllChannels = async (req, res, next) => {
  try {
    const { page = 1, limit = 50, category, country, quality, isActive = true } = req.query;
    
    const query = { isActive };
    if (category) query.category = category;
    if (country) query.country = country;
    if (quality) query.quality = quality;

    const channels = await Channel.find(query)
      .sort({ viewCount: -1, name: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Channel.countDocuments(query);

    res.json({
      success: true,
      count: channels.length,
      total: count,
      pages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      channels
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtener categorías disponibles
// @route   GET /api/channels/categories
// @access  Public
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Channel.distinct('category', { isActive: true });
    
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const count = await Channel.countDocuments({ category, isActive: true });
        return { name: category, count };
      })
    );

    res.json({
      success: true,
      categories: categoriesWithCount.sort((a, b) => b.count - a.count)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtener canales por categoría
// @route   GET /api/channels/category/:category
// @access  Public
exports.getChannelsByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const channels = await Channel.find({ 
      category, 
      isActive: true 
    })
      .sort({ viewCount: -1, name: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Channel.countDocuments({ category, isActive: true });

    res.json({
      success: true,
      category,
      count: channels.length,
      total: count,
      channels
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Buscar canales
// @route   GET /api/channels/search?q=
// @access  Public
exports.searchChannels = async (req, res, next) => {
  try {
    const { q, page = 1, limit = 20 } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Se requiere un término de búsqueda'
      });
    }

    const channels = await Channel.find({
      $and: [
        { isActive: true },
        {
          $or: [
            { name: { $regex: q, $options: 'i' } },
            { description: { $regex: q, $options: 'i' } },
            { tags: { $regex: q, $options: 'i' } },
            { category: { $regex: q, $options: 'i' } }
          ]
        }
      ]
    })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    res.json({
      success: true,
      query: q,
      count: channels.length,
      channels
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtener canal por ID
// @route   GET /api/channels/:id
// @access  Public
exports.getChannelById = async (req, res, next) => {
  try {
    const channel = await Channel.findById(req.params.id);

    if (!channel) {
      return res.status(404).json({
        success: false,
        message: 'Canal no encontrado'
      });
    }

    res.json({
      success: true,
      channel
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Incrementar contador de vistas
// @route   POST /api/channels/:id/view
// @access  Private
exports.incrementViews = async (req, res, next) => {
  try {
    const channel = await Channel.findById(req.params.id);

    if (!channel) {
      return res.status(404).json({
        success: false,
        message: 'Canal no encontrado'
      });
    }

    await channel.incrementViews();

    // Agregar al historial del usuario
    await User.findByIdAndUpdate(req.user._id, {
      $push: {
        watchHistory: {
          $each: [{
            contentType: 'channel',
            contentId: channel._id,
            watchedAt: new Date()
          }],
          $slice: -100 // Mantener solo las últimas 100 entradas
        }
      }
    });

    res.json({
      success: true,
      message: 'Vista registrada'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Alternar favorito
// @route   POST /api/channels/:id/favorite
// @access  Private
exports.toggleFavorite = async (req, res, next) => {
  try {
    const channel = await Channel.findById(req.params.id);

    if (!channel) {
      return res.status(404).json({
        success: false,
        message: 'Canal no encontrado'
      });
    }

    const user = await User.findById(req.user._id);
    const index = user.favorites.channels.indexOf(channel._id);

    if (index > -1) {
      // Remover de favoritos
      user.favorites.channels.splice(index, 1);
      await user.save();
      
      return res.json({
        success: true,
        message: 'Canal removido de favoritos',
        isFavorite: false
      });
    } else {
      // Agregar a favoritos
      user.favorites.channels.push(channel._id);
      await user.save();
      
      return res.json({
        success: true,
        message: 'Canal agregado a favoritos',
        isFavorite: true
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Calificar canal
// @route   POST /api/channels/:id/rate
// @access  Private
exports.rateChannel = async (req, res, next) => {
  try {
    const { rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'La calificación debe ser entre 1 y 5'
      });
    }

    const channel = await Channel.findById(req.params.id);

    if (!channel) {
      return res.status(404).json({
        success: false,
        message: 'Canal no encontrado'
      });
    }

    // Calcular nuevo promedio
    const totalRating = (channel.rating.average * channel.rating.count) + rating;
    channel.rating.count += 1;
    channel.rating.average = totalRating / channel.rating.count;

    await channel.save();

    res.json({
      success: true,
      message: 'Calificación registrada',
      rating: {
        average: channel.rating.average,
        count: channel.rating.count
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Crear nuevo canal (Admin)
// @route   POST /api/channels
// @access  Private/Admin
exports.createChannel = async (req, res, next) => {
  try {
    const channel = await Channel.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Canal creado exitosamente',
      channel
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Actualizar canal (Admin)
// @route   PUT /api/channels/:id
// @access  Private/Admin
exports.updateChannel = async (req, res, next) => {
  try {
    const channel = await Channel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!channel) {
      return res.status(404).json({
        success: false,
        message: 'Canal no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Canal actualizado exitosamente',
      channel
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Eliminar canal (Admin)
// @route   DELETE /api/channels/:id
// @access  Private/Admin
exports.deleteChannel = async (req, res, next) => {
  try {
    const channel = await Channel.findByIdAndDelete(req.params.id);

    if (!channel) {
      return res.status(404).json({
        success: false,
        message: 'Canal no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Canal eliminado exitosamente'
    });
  } catch (error) {
    next(error);
  }
};
