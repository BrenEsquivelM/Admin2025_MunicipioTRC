const express = require('express');
const router = express.Router();
const oracledb = require('../db/conexion');
const os = require('os');
const { autoCommit } = require('oracledb');
const { error } = require('console');

//Obtener los datos de UsoS_Suelos ✅
router.get('/', async (req, res) => {
    const connection = new oracledb();
    try {

        const pool = await connection.conectar();
        const result = await pool.execute(`SELECT * FROM USO_SUELO.USOS_SUELO`);
       console.log(result)
        await pool.close();
        res.json(result['rows']);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Error al obtener las condicones de usos suelos' });
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
        const result = await pool.execute(`SELECT * FROM USO_SUELO.USOS_SUELO WHERE ID= ${id}`);

        await connection.cerrar();
        res.json(result['rows']);
    }catch (err){
        console.log(err);
        res.status(500).json({ error: 'Error al obtener los datos'})
    }finally{
        if (connection){
            try{
                await connection.cerrar();
            }catch (cerrarErr){
                console.error('Error al cerrar conexion', cerrarErr)
            }
        }
    }
});


//INSERTAR ✅
router.post('/', async(req, res) => {
    const connection = new oracledb();
    const {abreviatura, descripcion} = req.body;
    console.log(req.body)

    try{
        const pool = await connection.conectar();

        const total = await  pool.execute("select * from uso_suelo.usos_suelo");

        const new_id = total.rows.length + 1

        const result = await pool.execute(
            `INSERT INTO USO_SUELO.USOS_SUELO(ID, ABREVIATURA, DESCRIPCION) VALUES (:new_id, :abreviatura, :descripcion)`,
            [new_id, abreviatura, descripcion],
            {autoCommit: true}
        );
        await connection.cerrar();
        if (result){
            res.status(201).json({ mensaje: 'Insertado con exito'});
        }else{
            res.status(401).json({mensaje: 'Error al insertar'});
        }
    }catch (err){
        console.error(err);
        res.status(500).json({ error: 'Error al insertar datos'});
    }finally{ 
        if(connection){
            try{
                await connection.cerrar();
            }catch (cerrarErr){
                console.error('Error al cerrar conexion:', cerrarErr)
            }
        }
    }
});


//ACTUALIZAR DATOS ✅
router.put('/:id',  async(req, res) => {
    const connection = new oracledb();
    const {abreviatura, descripcion} = req.body
    const id = req.params.id;

    try{
        const pool = await connection.conectar();
        const result = await pool.execute(
            `UPDATE USO_SUELO.USOS_SUELO SET ABREVIATURA= :abreviatura, DESCRIPCION= :descripcion WHERE ID= :id `,
            [abreviatura, descripcion, id],
            {autoCommit: true}
        );
        await connection.cerrar();
        if(result){
            res.status(201).json({ mensaje: 'Datos actualizados con exito'});
        }else{
            res.status(401).json({ mensaje: 'Error al insertar datos'});
        }
    }catch (err){
        console.error(err);
        res.status(500).json({ error: 'Error al actualizar'});
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


//ELIMINAR ✅
router.delete('/:id', async(req, res) => {
    const connection = new oracledb();
    const id = req.params.id;

    try{
        const pool = await connection.conectar();
        const result = await pool.execute(
        `DELETE FROM USO_SUELO.USOS_SUELO WHERE ID= ${id}`,
        [],
        {autoCommit: true}
        );
        await connection.cerrar();
        if(result){
            res.status(201).json({ mensaje: 'Eliminado correctamente'});
        }else{
            res.status({mensaje: 'Error al eliminar'});
        }
    }catch (err){
        console.error(err);
        res.status(500).json({error: 'Error al eliminar dato'});
    }finally{
        if(connection){
            try{
                await connection.cerrar();
            }catch (cerrarErr){
                console.error('Error al cerrar conexio:', cerrarErr);
            }
        }
    }
})
module.exports = router;