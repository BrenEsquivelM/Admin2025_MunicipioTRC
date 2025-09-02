// db/conexion.js
const oracledb = require('oracledb');
const os = require('os');
require('dotenv').config();

class OracleDB {
    constructor() {
        this.connection = null;
        this.clientInitialized = false;
    }

    async conectar() {
        try {
            // Solo inicializa el cliente una vez por instancia
            if (!this.clientInitialized) {
                const instantClientDir =
                    os.platform() === 'win32'
                        ? 'C:\\oracle\\instantclient_11_2'
                        : os.platform() === 'linux'
                        ? '/usr/local/instantclient_11_2'
                        : null;

                if (!instantClientDir) {
                    throw new Error('Sistema operativo no compatible');
                }

                await oracledb.initOracleClient({
                    libDir: instantClientDir,
                    version: '11.2',
                });

                this.clientInitialized = true;
            }

            this.connection = await oracledb.getConnection({
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                connectionString: process.env.DB_CONNECTION_STRING,
            });

            console.log('✅ Conexión a OracleDB exitosa');
            return this.connection;
        } catch (error) {
            console.error('❌ Error al conectar a OracleDB:', error);
            throw error;
        }
    }

    async cerrar() {
        try {
            if (this.connection) {
                await this.connection.close();
                console.log('✅ Conexión cerrada correctamente');
            }
        } catch (error) {
            console.error('❌ Error al cerrar la conexión:', error);
        } finally {
            this.connection = null; // Siempre aseguramos que se limpie la instancia
        }
    }
}

module.exports = OracleDB;
