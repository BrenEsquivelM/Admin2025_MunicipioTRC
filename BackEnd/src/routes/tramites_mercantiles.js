const express = require('express');
const router = express.Router();
const oracledb = require('../db/conexion');
const os = require('os')

// Obtener los datos de tramite_mercantiles ✅
router.get('/', async (req, res) => {
    const connection = new oracledb();
    try {
       const pool = await connection.conectar();
           const result = await pool.execute(`SELECT * FROM USO_SUELO.TRAMITES_MERCANTILES`);
            console.log(result)
            await pool.close();
             res.json(result['rows']);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Error al obtener los trámites mercantiles' });
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.log(err);
            }
        }
    }
});


//BUSCAR POR UNO ✅
router.get('/:id', async (req, res) => {
    const connection = new oracledb();
    const id = req.params.id;

    try{

        

        const pool = await connection.conectar();

        const result = await pool.execute(
            `SELECT * FROM USO_SUELO.TRAMITES_MERCANTILES WHERE ID= ${id}`
        );
        await connection.cerrar();
        res.json(result['rows']);
    }catch (err){
        console.log(err);
        res.status(500).json({ error: 'Error al obtener datos'});
    }finally{
        if(connection){
            try{
                await connection.cerrar();
            }catch (cerrarErr){
                console.error('Error al cerrar conexión:', cerrarErr);
            }
        }
    }
});


//INSERTAR DATOS A LA TABLA ✅
//Se realialzó ID incrementable 
router.post('/', async(req, res) => {
    const connection = new oracledb();
    const {
            id,
            tipo,
            descripcion, 
            medio_ambiente, 
            proteccion_civil, 
            salud_municipal, 
            estatus, 
            tipo_riesgo
        } = req.body;

    console.log(req.body)

    try{
        const pool = await connection.conectar();
        //Creando el ID incrementable 
        const total = await pool.execute( 'SELECT * FROM USO_SUELO.TRAMITES_MERCANTILES');
        const new_id = total['rows'].length + 1

        const result = await pool.execute(
            `INSERT INTO USO_SUELO.TRAMITES_MERCANTILES(ID, TIPO, DESCRIPCION, MEDIO_AMBIENTE, PROTECCION_CIVIL, SALUD_MUNICIPAL, ESTATUS, TIPO_RIESGO) VALUES (:ID, :tipo, :descripcion, :medio_ambiente, :proteccion_civil, :salud_municipal, :estatus, :tipo_riesgo)`,
        [
            new_id,
            tipo,
            descripcion, 
            medio_ambiente, 
            proteccion_civil, 
            salud_municipal, 
            estatus, 
            tipo_riesgo
            
        ],
        {autoCommit: true}
        );
        await connection.cerrar();
        if(result){
            res.status(201).json({ mensaje: 'El dato es insertado con éxito'});
        }else {
            res.status(401).json({ mensaje: 'Error al insertar'})
        }
    }catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al insertar datos'});
    }finally {
        if (connection) {
            try {
                await connection.cerrar(); // liberas la conexión
            } catch (cerrarErr) {
                console.error('Error al cerrar conexión:', cerrarErr);
            }
        }
    }
});


//ACTUALIZAR DATOS
router.put('/:id', async(req, res) => {

    const connection = new oracledb();
    const {
        tipo, 
        descripcion, 
        medio_ambiente, 
        proteccion_civil, 
        salud_municipal, 
        estatus, 
        tipo_riesgo
        } = req.body;
    const id = req.params.id;

    console.log(req.body)

    try{
        const pool = await connection.conectar();
        const result = await pool.execute(
            `UPDATE USO_SUELO.TRAMITES_MERCANTILES SET TIPO= :tipo,
                DESCRIPCION= :descripcion, MEDIO_AMBIENTE= :medio_ambiente,
                PROTECCION_CIVIL= :proteccion_civil,
                SALUD_MUNICIPAL= :salud_municipal,
                ESTATUS= :estatus, TIPO_RIESGO= :tipo_riesgo WHERE ID= :id`,
            [
                
                tipo, 
                descripcion, 
                medio_ambiente, 
                proteccion_civil, 
                salud_municipal, 
                estatus, 
                tipo_riesgo,
                id
                
            ],
            {autoCommit: true}
        );

        await connection.cerrar();
        if(result){
            res.status(201).json({mensaje: 'Actualizacion de datos con éxito'});
        }else{
            res.status(401).json({mensaje: 'Error al insertar'});
        }
    }catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al actualizar', err})
    }finally{
        if (connection){
            try{
                await connection.cerrar();
            }catch (cerrarErr){
                console.error('Error al cerrar conexion', cerrarErr);
            }
        }
    }
});


//ELIMINAR ✅
router.delete('/:id', async(req, res) => {
    const connection = new oracledb();
    const id = req.params.id;

    try{
        const pool = connection.conectar();
        const result = (await pool).execute(
            `DELETE FROM USO_SUELO.TRAMITES_MERCANTILES WHERE ID= ${id}`,
            [],
            {autoCommit: true}
        );
        await connection.cerrar();
        if(result) {
            res.status(201).json({ mensaje: 'Eliminado correctamente'});
        }else{
            res.status(401).json({ mensaje: 'Eliminado incorrecto'})
        }
    }catch (err){
        res.status(500).json({ error: 'Error al elimina dato'});
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
module.exports = router;
