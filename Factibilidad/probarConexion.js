// probarConexion.js
const conectarOracle = require('./conexiones');

async function main() {
  const connection = await conectarOracle();

  const result = await connection.execute(`
    SELECT owner, table_name 
    FROM all_tables 
    WHERE owner = 'BESQUIVELM'
  `);
  console.log(result.rows);

  await connection.close();
}

main();