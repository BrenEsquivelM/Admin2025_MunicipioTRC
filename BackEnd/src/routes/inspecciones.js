const express = require('express');
const router = express.Router();
const oracledb = require('../db/conexion');
const os = require('os');
const { error } = require('console');

//Obtener los datos de Inspecciones ✅
router.get('/', async(req, res) => {
    const connection = new oracledb();

    try {
        const pool = await connection.conectar();
           const result = await pool.execute(`SELECT * FROM USO_SUELO.INSPECCIONES`);
           console.log(result)
             await pool.close();
            res.json(result['rows']);
    }catch (err){
        console.log(err);
        res.status(500).json({ error: 'Error al obtener las condiciones '});
    }finally{
        if(connection){
            try{
                await connection.close();
            }catch(err){
                console.log(err);
            }
        }
    }
});

//Buscar un dato ✅
router.get('/:id', async (req, res) => {
    const connection = new oracledb();
    const id = req.params.id;

    try{
        const pool = await connection.conectar();
        const result = await pool.execute(`SELECT * FROM USO_SUELO.INSPECCIONES WHERE ID= ${id}`);

        await connection.cerrar();
        res.json(result['rows']);
    }catch (err){
        console.log(err);
        res.status(500).json({ error: 'Error al servidor'});
    }finally{
        if(connection){
            try{
                await connection.cerrar();
            }catch (cerrarErr){
                console.error('Error al cerrar conexion', cerrarErr);
            }
        }
    }
});

//INSERTAR DATO ✅
router.post('/', async (req, res) => {
    const connection = new oracledb();
    const {nombre} = req.body;
    console.log(req.body)
    try{
        const pool = await connection.conectar();
        const total = await pool.execute('SELECT * FROM USO_SUELO.INSPECCIONES')

        // console.log(res['rows'].length)
        const new_id = total['rows'].length + 1
       
        //return console.log(new_id);
        const result = await pool.execute(
            `INSERT INTO USO_SUELO.INSPECCIONES(NOMBRE, ID) VALUES (:nombre, :ID)`,
            [nombre, new_id],
            {autoCommit: true}
        );


        await connection.cerrar();
        if(result){
            res.status(201).json({ mensaje: 'Datos insertados con exito'});
        }else{
            res.status(401).json({ mensaje: 'Error al insertar datos'});
        }
    }catch (err){
        console.error(err);
        res.status(500).json({ error: 'Error en el servidor', err});
    }finally{
        if(connection){
            try{
                await connection.cerrar();
            }catch (cerrarErr){
                console.error('Error al cerrar la conexion', cerrarErr);
            }
        }
    }
});

//ACTUALIZAR DATO ✅
//Se realizo id incrementable 
router.put('/:id', async (req, res) => {
    const connection = new oracledb();
    const {nombre} = req.body;
    const id = req.params.id;

    try{
        const pool = await connection.conectar();
        const result = await pool.execute(
            `UPDATE USO_SUELO.INSPECCIONES SET NOMBRE= :nombre WHERE ID= :id`,
            [nombre, id],
            {autoCommit: true}
        );
        await connection.cerrar();
        if(result){
            res.status(201).json({mensaje: 'Actualizacion del dato con éxito'});
        }else{
            res.status(401).json({mensaje: 'Error al actualizar dato'});
        }
    }catch (err){
        console.error(err);
        res.status(500).json({error: 'Error en actualizacion de datos'})
    }finally {
        if (connection) {
            try {
                await connection.cerrar(); // liberas la conexión
            } catch (cerrarErr) {
                console.error('Error cerrando conexión:', cerrarErr);
            }
        }
    }
});
//ELIMINAR DATO ✅
router.delete('/:id', async(req, res) => {
    const connection = new oracledb();
    const id = req.params.id;

    try{
        const pool = await connection.conectar();
        const result = await pool.execute(
            `DELETE FROM USO_SUELO.INSPECCIONES WHERE ID= ${id}`,
            [],
            {autoCommit: true}
        );
        await connection.cerrar();
        if(result){
            res.status(201).json({mensaje: 'Eliminado correctamente'});
        }else{
            res.status(401).json({ mensaje: 'Eliminado incorrectamente' });
        }
    }catch (err) {
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
})

module.exports = router;