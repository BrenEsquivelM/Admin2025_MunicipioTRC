const express = require('express');
const router = express.Router();
const oracledb = require('../db/conexion');
const os = require('os');
const { error } = require('console');

//Obtener los datos de tramite_inspecciones ✅
router.get('/', async (req, res) => {
    const connection = new oracledb();
    try{
        const pool = await connection.conectar();
           const result = await pool.execute(`SELECT * FROM USO_SUELO.TRAMITE_INSPECCIONES`);
           console.log(result)
            await pool.close();
             res.json(result['rows']);
    }catch (err){
        console.log(err);
        res.status(500).json({ error: 'Error al obtener las condiciones'});
    }finally{
        if(connection){
            try{
                await connection.close();
            }catch (cerrarErr) {
                console.error('Error cerrando conexión:', cerrarErr);
            }
        }
    }

});
 
//BUSCAR POR UNO ✅
router.get('/:tramite_id/:inspeccion_id', async(req, res) => {
  const connection = new oracledb();
  const { tramite_id, inspeccion_id} = req.params;

  //return console.log(tramite_id, inspeccion_id)
  

  try{
    const pool = await connection.conectar();
    const result = await pool.execute(`SELECT * FROM USO_SUELO.TRAMITE_INSPECCIONES WHERE TRAMITE_ID= :tramite_id AND INSPECCION_ID= :inspeccion_id`,
        [tramite_id, inspeccion_id],
        {autoCommit: true}
    );
    await connection.cerrar();
    if(result.rows.length > 0 ){
        res.json(result.rows[0]);
    }else{
        res.status(400).json({mensaje: 'No encontrado'});
    }
    
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


//INSERTAR DATOS ✅
router.post('/', async (req, res) => {
    const connection = new oracledb();
    const {
            tramite_id, 
            inspeccion_id,
            estatus
        } = req.body;

    try {
        const pool = await connection.conectar();

        //  Validar si el tramitE existe en la tabla TRAMITES
        const tramite = await pool.execute(
            `SELECT * FROM USO_SUELO.TRAMITE_INSPECCIONES WHERE TRAMITE_ID= :tramite_id`,
            {tramite_id},
            {autoCommit: true}
        );

        //const TRAMITE_ID = tramite.rows[0][0]
        //return console.log()

       if(tramite.rows.length === 0 ){
            //'insert
            console.log('insert')
        //return res.status(400).json({ error: "El tramite_id no existe en usos suelos"});
            const result = await pool.execute(
                `INSERT INTO USO_SUELO.TRAMITE_INSPECCIONES( TRAMITE_ID, INSPECCION_ID, ESTATUS)
                VALUES (:tramite_id, :inspecciones_id, :estatus)`,
                [
                    tramite_id,
                    inspeccion_id,
                    estatus,
                    
                ],
                { autoCommit: true }
            );
    
            if (result) {
                res.status(201).json({ mensaje: 'Insertado con éxito' });
            } else {
                res.status(401).json({ mensaje: 'Error al insertar' });
            }
       }
       else{ 
            //update
            console.log('update')
            const result = await pool.execute(
                `UPDATE USO_SUELO.TRAMITE_INSPECCIONES SET TRAMITE_ID= :tramiteid, INSPECCION_ID= : inspeccion_id, ESTATUS= :estatus WHERE TRAMITE_ID = ${tramite_id}
                `,
                [
                    tramite_id,
                    inspeccion_id,
                    estatus,
                    
                ],
                { autoCommit: true }
            );
    
            if (result) {
                res.status(201).json({ mensaje: 'Actualizado con éxito' });
            } else {
                res.status(401).json({ mensaje: 'Error al insertar' });
            }
       }
       

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al insertar datos' });
    } finally {
        if (connection) {
            try {
                await connection.cerrar();
            } catch (cerrarErr) {
                console.error('Error al cerrar conexión:', cerrarErr);
            }
        }
    }
});


//ACTUALIZAR DATOS ✅
router.put('/:tramite_id/:inspeccion_id', async(req, res) => {
    const connection = new oracledb();
    const {tramite_id, inspeccion_id} = req.params;
    

    try{
        const pool = await connection.conectar();
        const result = await pool.execute(
            `UPDATE USO_SUELO.TRAMITE_INSPECCIONES SET INSPECCION_ID = 1 
            WHERE TRAMITE_ID= :tramite_id AND INSPECCION_ID= :inspeccion_id `,
            [tramite_id, inspeccion_id],
            {autoCommit: true}
        );
        await connection.cerrar();
        if(result){
            res.status(201).json({ mensaje: 'Actualizacion de datos con exito'});
        }else {
            res.status(401).json({ mensaje: 'Error al actualizar datos'});
        }
    }catch (err){
        console.error(err);
        res.status(500).json({ error: 'Error del servidor'});
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

//ELIMINAR DATOS ✅
router.delete('/:tramite_id/:inspeccion_id', async(req, res) =>{
    const connection = new oracledb();
    const {tramite_id, inspeccion_id} = req.params;

    try{
        const pool = await connection.conectar();
        const result = await pool.execute(
            `DELETE FROM USO_SUELO.TRAMITE_INSPECCIONES WHERE TRAMITE_ID= :tramite_id AND INSPECCION_ID= :inspeccion_id`,
            {tramite_id, inspeccion_id},
            {autoCommit: true}
        );
        await connection.cerrar();
        if(result){
            res.status(201).json({ mensaje: 'Eliminado correctamente'});
        }else {
            res.status(401).json({ mensaje: 'Error al eliminar'});
        }
    }catch (err){
        console.error(err);
        res.status(500).json({ error: 'Error en el servidor'});
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