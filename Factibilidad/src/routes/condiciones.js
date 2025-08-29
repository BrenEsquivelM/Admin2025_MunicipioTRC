const express = require('express');
const router = express.Router();
const oracledb = require('../db/conexion');
const os = require('os');
const { error } = require('console');

//Obtener los datos de condiciones ✅
router.get('/', async (req, res) => {
    const connection = new oracledb();
    try {
        const pool = await connection.conectar();
           const result = await pool.execute(`SELECT * FROM USO_SUELO.CONDICIONES`);
           console.log(result)
           await pool.close();
           res.json(result['rows']);
    }   catch (err){
        console.log(err);
        res.status(500).json({ error: 'Error al obtener los datos de condiones'});
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

//buscar por uno ✅
router.get('/:id', async (req, res) => {
    const id = req.params.id
    const connection = new oracledb();

    try{
        const pool = await connection.conectar();
        const result = await pool.execute(`SELECT * FROM USO_SUELO.CONDICIONES WHERE ID= ${id}`);
        await connection.cerrar();
        res.json(result['rows']);
    }catch (err){
        console.log(err);
        res.status(500).json({ error: 'Error en la busqueda del dato'});
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

//Insertar datos a la tabla condiciones, NO ERA AUTOINCREMNTABLE PERO SE HIZO ✅
router.post('/', async (req, res) => {
    const connection = new oracledb();
    const {  descripcion } = req.body;
    console.log(req.body)
    try{
        const pool = await connection.conectar();
        
        const total = await pool.execute('SELECT * FROM USO_SUELO.CONDICIONES')

        // console.log(res['rows'].length)
        const new_id = total['rows'].length + 1
        const av = `C${new_id}`
        //return console.log(new_id);
        const result = await pool.execute(
            `INSERT INTO USO_SUELO.CONDICIONES(ABREVIADO, DESCRIPCION, ID) VALUES (:ABREVIADO, :DESCRIPCION, :ID)`,
            [av, descripcion, new_id],
            {autoCommit: true}
        );
        await connection.cerrar();
        if(result){
            res.status(201).json({ mensaje: 'Datos insertados con exito'});
        }else{
            res.status(401).json({ mensaje: 'Error al insertar dato'});
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

//Actualizar datos ✅
router.put('/:id', async (req, res) => {
    const connection = new oracledb();
    const {abreviado, descripcion} = req.body;
    const id = req.params.id;

    try{
        const pool = await connection.conectar();
        const result = await pool.execute(
        `UPDATE USO_SUELO.CONDICIONES SET ABREVIADO= :abreviado, DESCRIPCION= :descripcion WHERE ID= :id`,
        [abreviado, descripcion, id],
        {autoCommit: true}
        );
        await connection.cerrar();
        if(result){
            res.status(201).json({ mensaje: 'Actualizacion de datos con exito'});
        }else{
            res.status(401).json({mensaje: 'Error en actualizar los datos'});
        }
    }catch (err){
        console.error(err);
        res.status(500).json({ mensaje: 'Error al cerrar la conesion'});
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

//Eliminar datos
router.delete('/:id', async (req, res) => {
    const connection = new oracledb();
    const id = req.params.id;

    try{
        const pool = await connection.conectar();
        const result = await pool.execute(
        `DELETE FROM USO_SUELO.CONDICIONES WHERE ID= ${id}`,
        [],
        {autoCommit: true}
        );
        await connection.cerrar();
        if(result){
            res.status(201).json({ mensaje: 'Datos eliminados con exito'});
        }else{
            res.status(401).json({mensaje: 'Error al eliminar datos'});
        }
    }catch (err){
        console.error(err);
        res.status(500).json({mensaje: 'Error al cerrar la conexion', cerrarErr});
    }finally {
        if (connection) {
            try {
                await connection.cerrar(); // liberas la conexión
            } catch (cerrarErr) {
                console.error('Error al cerrar conexión:', cerrarErr);
            }
        }
    }s
});


module.exports = router;