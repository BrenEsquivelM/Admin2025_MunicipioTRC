const express = require('express');
const router = express.Router();
const oracledb = require('../db/conexion');
const os = require('os')

//Obtener datos de la tabla Factibilidad ✅
router.get('/', async (req, res) => {

    const connection = new oracledb();

    try {
        const pool = await connection.conectar();
        const result = await pool.execute(`SELECT * FROM USO_SUELO.FACTIBILIDADES`);
        console.log(result)
        await pool.close();
        res.json(result['rows']);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Error al obtener las condiciones' });
    }
    finally{
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
router.get('/:id', async(req, res) => {
    const connection = new oracledb();
    const id = req.params.id;

    try{
        const pool = await connection.conectar();
        const result = await pool.execute(`SELECT * FROM USO_SUELO.FACTIBILIDADES WHERE ID= ${id}`);
        await connection.cerrar();
        res.json(result[`rows`]);
    }catch (err){
        console.log(err);
        res.status(500).json({ error: 'Error al obtener factibilidad'});
    }finally{
        if (connection){
            try{
                await connection.cerrar();
            }catch (cerrarErr){
                console.log('Error al cerrar la conexion', cerrarErr);
            }
        }
    }
});

//Insertar dato ✅
router.post('/', async(req, res) => {
    const connection = new oracledb();
    const {id, tamite_id, uso_suelo_id, factibilidad, anio, estatus} = req.body;
    console.log(req.body)
    try{
        const pool = await connection.conectar();
        const result = await pool.execute(
            `INSERT INTO USO_SUELO.FACTIBILIDADES(TRAMITE_ID, USO_SUELO_ID, FACTIBILIDAD, ANIO, ESTATUS) VALUES (:tamite_id, :uso_suelo_id, :factibilidad, :anio, :estatus)`,
            [tamite_id, uso_suelo_id, factibilidad, anio, estatus],
            {autoCommit: true}
        );
        await connection.cerrar();
        if(result){
            res.status(201).json({mesaje: 'Dato Insertado'});
        }else{
            res.status(401).json({ mensaje: 'Error al insertar dato'});
        }
    }catch (err) {
        console.error(err);
        res.status(500).json({error: 'Error al insertar datos en el registro'});
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

//Actualizar dato ✅
router.put('/:id', async(req, res) => {
    const connection = new oracledb();
    const {tramite_id, uso_suelo_id, factibilidad, anio, estatus} = req.body;
    const id = req.params.id;

    try{
        const pool = await connection.conectar();
        const result = await pool.execute(
        `UPDATE USO_SUELO.FACTIBILIDADES SET TRAMITE_ID= :tramite_id, USO_SUELO_ID= :uso_suelo_id, FACTIBILIDAD= :factibilidad, ANIO= :anio, ESTATUS= :estatus WHERE ID= :id`,
        [tramite_id, uso_suelo_id, factibilidad, anio, estatus, id],
        {autoCommit: true}
        );
        await connection.cerrar();
        if (result) {
            res.status(201).json({ mensaje: 'Actualizacion de datos con exito' });
        } else {
            res.status(401).json({ mensaje: 'Error en actualizacion de datos con exito' });
        }

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al actualizar datos' })
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
//Eliminar dato ✅
router.delete('/:id', async(req, res) => {
    const connection = new oracledb();
    const id = req.params.id;

    try{
        const pool = await connection.conectar();
        const result = await pool.execute(
        `DELETE USO_SUELO.FACTIBILIDADES WHERE ID= ${id}`,
        [],
        {autoCommit: true}
        );
        await connection.cerrar();
        if(result){
            res.status(201).json({mensaje: 'Eliminado correctamente'});
        }else{
            res.status(401).json({mensaje: 'Error al eliminar'});
        }
    }catch (err){
        console.log(err);
        res.status(500).json({mensaje: 'Error al cerrar conexion'});
    }finally{
        if (connection){
            try{
                await connection.cerrar();
            }catch (cerrarErr){
                console.error('Error al cerrar conexion:', cerrarErr);
            }
        }
    }
});

module.exports = router;