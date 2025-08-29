const oracledb = require('oracledb');
const oci = require("oracledb");
const os = require('os')

class OracleDB {
  public connection;

  constructor() {
    this.connection = null;
  }

  async connect(): Promise<void> {
    try {
      let instantClientDir: string;

      // Determinar la ruta del directorio Instant Client según el sistema operativo

      if (os.platform() === "win32") {
        instantClientDir = "C:\\instantclient_11_2";
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
      
      this.connection = await oracledb.getConnection({
        user: 'besquivelm',
        password: 'Brenda.2025',
        connectString: '192.168.4.164:1521/dbcoah',
      });
      console.log("Conexión a Oracle establecida");
      oci.autoCommit = true;
    } catch (error) {
      console.error("Error al conectar a Oracle", error);
      throw error;
    }
  }

  async close(): Promise<void> {
    try {
      if (this.connection) {
        await this.connection.close();
        console.log("Conexión a Oracle cerrada");
      }
    } catch (error) {
      console.error("Error al cerrar la conexión a Oracle", error);
    }
  }

  async executeQuery({
    sql,
    binds = [],
  }: {
    sql: string;
    binds?: any[];
  }): Promise<any[]> {
    try {
      if (!this.connection) {
        throw new Error("No hay conexión a la base de datos");
      }

      const result = await this.connection.execute(sql, binds, {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
      });
      return result.rows;
    } catch (error) {
      console.error("Error al ejecutar la consulta", error);
      throw error;
    }
  }
}

module.exports = OracleDB;
