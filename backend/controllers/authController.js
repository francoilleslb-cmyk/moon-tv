const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

// Generar JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// @desc    Registrar usuario
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    // Validar errores
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { username, email, password } = req.body;

    // Verificar si el usuario ya existe
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'El usuario o email ya está registrado'
      });
    }

    // Crear usuario
    const user = await User.create({
      username,
      email,
      password
    });

    // Generar token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        subscription: user.subscription
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login usuario
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Verificar si el usuario existe
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Verificar contraseña
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Verificar si el usuario está activo
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Usuario inactivo. Contacta al administrador'
      });
    }

    // Generar token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login exitoso',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        subscription: user.subscription,
        avatar: user.avatar
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtener usuario actual
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('favorites.channels', 'name logo category')
      .populate('favorites.movies', 'title poster genres')
      .populate('favorites.series', 'title poster genres');

    res.json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Actualizar perfil
// @route   PUT /api/auth/update-profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const { username, email, avatar } = req.body;

    const fieldsToUpdate = {};
    if (username) fieldsToUpdate.username = username;
    if (email) fieldsToUpdate.email = email;
    if (avatar) fieldsToUpdate.avatar = avatar;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      fieldsToUpdate,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Perfil actualizado exitosamente',
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Actualizar contraseña
// @route   PUT /api/auth/update-password
// @access  Private
exports.updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Debes proporcionar la contraseña actual y la nueva'
      });
    }

    const user = await User.findById(req.user._id).select('+password');

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Contraseña actual incorrecta'
      });
    }

    user.password = newPassword;
    await user.save();

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Contraseña actualizada exitosamente',
      token
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
  try {
    // En una implementación real, podrías invalidar el token en una blacklist
    res.json({
      success: true,
      message: 'Logout exitoso'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  try {
    // Implementar lógica de recuperación de contraseña
    res.json({
      success: true,
      message: 'Email de recuperación enviado (función no implementada aún)'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password/:token
// @access  Public
// @desc    Reset password (TEMPORAL)
// @route   GET /api/auth/reset-franco
// @access  Public
exports.resetFrancoPassword = async (req, res, next) => {
  try {
    const email = 'francoilleslb@gmail.com';
    const newPassword = 'algoasi';

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: `Contraseña restablecida correctamente para ${email} a: ${newPassword}`
    });
  } catch (error) {
    next(error);
  }
};
