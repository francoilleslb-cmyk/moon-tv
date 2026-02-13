require('dotenv').config();
const mongoose = require('mongoose');

console.log('🔍 Moon TV - Test de Conexión a MongoDB');
console.log('=========================================\n');

// Mostrar configuración (ocultando password)
console.log('📋 Configuración:');
console.log(`   PORT: ${process.env.PORT || '5000'}`);
console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'development'}`);

if (process.env.MONGODB_URI) {
  // Ocultar password en el log
  const safeURI = process.env.MONGODB_URI.replace(/:([^@]+)@/, ':****@');
  console.log(`   MONGODB_URI: ${safeURI}`);
} else {
  console.log('   ❌ MONGODB_URI: NO ENCONTRADA');
  console.log('\n⚠️  ERROR: No hay MONGODB_URI en el archivo .env\n');
  process.exit(1);
}

console.log('\n🔄 Intentando conectar...\n');

// Intentar conexión
mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 10000, // 10 segundos timeout
})
  .then(() => {
    console.log('✅ ¡CONEXIÓN EXITOSA!\n');
    console.log('📊 Información de la conexión:');
    console.log(`   Base de datos: ${mongoose.connection.name}`);
    console.log(`   Host: ${mongoose.connection.host}`);
    console.log(`   Puerto: ${mongoose.connection.port}`);
    console.log(`   Estado: ${mongoose.connection.readyState === 1 ? 'Conectado' : 'Desconectado'}`);
    console.log('\n🎉 MongoDB Atlas está funcionando correctamente!\n');
    
    // Cerrar conexión
    mongoose.connection.close();
    process.exit(0);
  })
  .catch(err => {
    console.log('❌ ERROR DE CONEXIÓN\n');
    console.log(`📝 Mensaje: ${err.message}\n`);
    
    // Diagnosticar el error
    if (err.message.includes('IP')) {
      console.log('🔧 PROBLEMA: Tu IP no está permitida');
      console.log('\n💡 SOLUCIÓN:');
      console.log('   1. Ve a https://cloud.mongodb.com');
      console.log('   2. Network Access → Add IP Address');
      console.log('   3. Add Current IP Address (o 0.0.0.0/0 para todas)');
      console.log('   4. Espera 1-2 minutos');
      console.log('   5. Ejecuta este test de nuevo: node test-db.js\n');
    } else if (err.message.includes('authentication')) {
      console.log('🔧 PROBLEMA: Usuario o password incorrectos');
      console.log('\n💡 SOLUCIÓN:');
      console.log('   1. Ve a https://cloud.mongodb.com');
      console.log('   2. Database Access → Verifica el usuario');
      console.log('   3. Verifica que el password en .env sea correcto');
      console.log('   4. Si es necesario, crea nuevo usuario\n');
    } else if (err.message.includes('timeout')) {
      console.log('🔧 PROBLEMA: Timeout de conexión');
      console.log('\n💡 SOLUCIÓN:');
      console.log('   1. Verifica tu conexión a Internet');
      console.log('   2. Prueba con datos móviles si estás en WiFi público');
      console.log('   3. Desactiva firewall temporalmente');
      console.log('   4. Verifica que el string de MongoDB sea correcto\n');
    } else {
      console.log('🔧 PROBLEMA: Error desconocido');
      console.log('\n💡 SOLUCIÓN:');
      console.log('   1. Verifica que el string de MongoDB sea correcto');
      console.log('   2. Lee la guía completa: SOLUCION_MONGODB.md');
      console.log('   3. Intenta crear un nuevo cluster en Atlas\n');
    }
    
    console.log('📖 Para más ayuda, lee: SOLUCION_MONGODB.md\n');
    process.exit(1);
  });

// Timeout de seguridad
setTimeout(() => {
  console.log('\n⏱️  Timeout: La conexión está tardando mucho');
  console.log('💡 Esto puede indicar problemas de red o firewall\n');
  process.exit(1);
}, 15000);