// conexiones.js
const oracledb = require('oracledb');
const os = require('os')

async function conectarOracle() {
  try {

    let instantClientDir;

      // Determinar la ruta del directorio Instant Client según el sistema operativo

      if (os.platform() === "win32") {
        instantClientDir = "C:\\oracle\instantclient_11_2";
      } else if (os.platform() === "linux") {
        instantClientDir = "/usr/local/instantclient_11_2";
      } else {
        throw new Error("Sistema operativo no compatible");
      }

      // Inicializar el cliente Oracle
      await oracledb.initOracleClient({
        libDir: instantClientDir,
        version: "11.2",
      });

    const connection = await oracledb.getConnection({
      user: 'besquivelm',
      password: 'Brenda.2025',
      connectString: '192.168.4.164:1521/dbcoah'
    });
    console.log('✅ Conexión exitosa a Oracle');
    return connection;
  } catch (error) {
    console.error('❌ Error al conectar:', error);
    throw error;
  }
}

module.exports = conectarOracle;