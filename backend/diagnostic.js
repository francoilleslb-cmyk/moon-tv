require('dotenv').config();
const mongoose = require('mongoose');

console.log('\n🔍 DIAGNÓSTICO DE CONEXIÓN');
console.log('='.repeat(50));

// 1. Verificar .env
console.log('\n1️⃣ ARCHIVO .ENV:');
console.log('   Existe:', !!process.env.MONGODB_URI ? '✅' : '❌');

if (process.env.MONGODB_URI) {
  const uri = process.env.MONGODB_URI;
  
  // Ocultar password
  const safeUri = uri.replace(/(:\/\/)([^:]+):([^@]+)@/, '$1$2:****@');
  console.log('   URI:', safeUri);
  
  // 2. Verificar formato
  console.log('\n2️⃣ FORMATO DEL STRING:');
  if (uri.startsWith('mongodb+srv://')) {
    console.log('   ✅ mongodb+srv:// (Correcto)');
  } else if (uri.startsWith('mongodb://')) {
    console.log('   ⚠️  mongodb:// (Funciona pero es más complejo)');
  } else {
    console.log('   ❌ Formato inválido');
    process.exit(1);
  }
  
  // 3. Verificar componentes
  console.log('\n3️⃣ COMPONENTES:');
  const hasCredentials = uri.includes('@');
  const hasDatabase = uri.split('/')[3]?.split('?')[0];
  
  console.log('   Usuario/Password:', hasCredentials ? '✅' : '❌');
  console.log('   Base de datos:', hasDatabase || '❌');
  
  // 4. Intentar conexión
  console.log('\n4️⃣ INTENTANDO CONECTAR...');
  console.log('   (Timeout: 10 segundos)\n');
  
  mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000
  })
    .then(() => {
      console.log('✅ ¡CONEXIÓN EXITOSA!\n');
      console.log('📊 Información:');
      console.log('   Base de datos:', mongoose.connection.name);
      console.log('   Host:', mongoose.connection.host);
      console.log('   Estado:', 'Conectado');
      console.log('\n🎉 MongoDB funcionando correctamente!\n');
      process.exit(0);
    })
    .catch(err => {
      console.log('❌ ERROR DE CONEXIÓN\n');
      console.log('📝 Mensaje:', err.message);
      console.log('\n🔧 POSIBLES CAUSAS:');
      
      if (err.message.includes('IP')) {
        console.log('   • IP no permitida en Atlas');
      }
      if (err.message.includes('authentication')) {
        console.log('   • Usuario o password incorrectos');
      }
      if (err.message.includes('timeout') || err.message.includes('ENOTFOUND')) {
        console.log('   • Cloudflare Warp bloqueando conexión');
        console.log('   • Firewall o antivirus bloqueando');
        console.log('   • Problema de red');
      }
      
      console.log('\n💡 SOLUCIONES:');
      console.log('   1. Desactiva Cloudflare Warp');
      console.log('   2. Desactiva antivirus temporalmente');
      console.log('   3. Prueba con datos móviles');
      console.log('   4. Verifica usuario/password en Atlas\n');
      
      process.exit(1);
    });
    
} else {
  console.log('\n❌ MONGODB_URI no encontrada');
  console.log('\n💡 SOLUCIÓN:');
  console.log('   1. Verifica que el archivo se llame .env (con punto)');
  console.log('   2. Verifica que esté en backend/.env');
  console.log('   3. Reinicia la terminal\n');
  process.exit(1);
}

setTimeout(() => {
  console.log('\n⏱️  Timeout - La conexión está tardando demasiado');
  console.log('💡 Desactiva Cloudflare Warp y reinicia\n');
  process.exit(1);
}, 15000);