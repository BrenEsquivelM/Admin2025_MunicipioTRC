const express = require('express');
const router = express.Router();
const oracledb = require('../db/conexion');
const os = require('os');
const { error } = require('console');
const { autoCommit } = require('oracledb');


// Obtener todos los usuarios ✅
router.get('/', async (req, res) => {
    const connection = new oracledb();
  try {
      
    const pool = await connection.conectar();
    const result = await pool.execute(`SELECT * FROM USO_SUELO.USUARIOS`);
       console.log(result)
        await pool.close();
        res.json(result['rows']);
} catch (err){
    console.log(err);
    res.status(500).json({ error: 'Error al obtener usuarios '});   
    }
});


//BUSCAR POR UNO ✅
router.get('/:id', async(req, res) => {
  const connection = new oracledb();
  const id = req.params.id;

  try{
    const pool = await connection.conectar();
    const result = await pool.execute(`SELECT * FROM USO_SUELO.USUARIOS WHERE ID= ${id}`);
    await connection.cerrar();
    res.json(result['rows']);
  }catch (err){
    console.log(err);
    res.status(500).json({error: 'Error al obtener el dato'});
  }finally{
    if(connection){
       try {
                await connection.cerrar(); // liberas la conexión
            } catch (cerrarErr) {
                console.error('Error al cerrar conexión:', cerrarErr);
            }
          }
  }
});


 const bcrypt = require('bcrypt');
 const saltRound = 10;

//INSERTAR ✅
router.post('/', async(req, res) => {
  const connection = new oracledb();
  const {username, password} = req.body;
  //console.log(req.body)

  //ENCRYPTAR PASSWORD
  const hashedPassword = await bcrypt.hash(password, saltRound); 
  
 

  try{
    const pool = await connection.conectar();
    
    const total = await pool.execute(`SELECT * FROM USO_SUELO.USUARIOS  `)
    const new_id = total['rows'].length + 1
    const result = await pool.execute(
      `INSERT INTO USO_SUELO.USUARIOS(USERNAME, PASSWORD, ID) VALUES ( :username, :password, :id)`,
      [ username, hashedPassword, new_id ],
      {autoCommit: true}
    );
    await connection.cerrar();
    if(result){
      res.status(201).json({ mensaje: 'Insertado con exito'})
    }else{
      res.status(401).json({ mensaje: 'Error al insertar'})
    }
  }catch (err){
    console.error(err);
    res.status(500).json({ error: 'Error al insertar datos en el registro'})
  }finally{
    if(connection){
      try{
        await connection.cerrar();
      }catch (cerrarErr){
        console.error('Error al cerrar conexion: ', cerrarErr);
      }
    }
  }
});


//ACTUALIZAR DATOS ✅
router.put('/:id', async(req, res) => {
  const connection = new oracledb();
  const {username, password} = req.body;
  const id = req.params.id

  try{
    const pool = await connection.conectar();
    const result = await pool.execute(
      `UPDATE USO_SUELO.USUARIOS SET USERNAME= :username, PASSWORD= :password WHERE ID= :id`,
      [username, password, id],
      {autoCommit: true}
    );
    await connection.cerrar();
    if(result){
      res.status(201).json({mensaje: 'Actualizacion de datos con exito'})
    }else{
      res.status(401).json({ mensaje: 'Error al insertar'});
    }
  }catch (err){
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar datos'})
  }finally{
    if(connection){
      try{
        await connection.cerrar();
      } catch (cerrarErr){
        console.error('Error al cerrar conexion:', cerrarErr);
      }
    }
  }
});


//ELIMINAR ✅
router.delete('/:id', async (req, res) => {
    const connection = new oracledb();
    const id = req.params.id;

    try {
        const pool = await connection.conectar();
        const result = await pool.execute(
            `DELETE FROM USO_SUELO.USUARIOS WHERE ID = ${id}`,
            [],
            { autoCommit: true }
        );
        await connection.cerrar();
        if (result) {
            res.status(201).json({ mensaje: 'Eliminado correctamente' });
        } else {
            res.status(401).json({ mensaje: 'Eliminado incorrectamente' });
        }

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error en eliminar dato' });
    } finally {
        if (connection) {
            try {
                await connection.cerrar(); // liberas la conexión
            } catch (cerrarErr) {
                console.error('Error al cerrar conexión:', cerrarErr);
            }
        }
    }
});
module.exports = router;