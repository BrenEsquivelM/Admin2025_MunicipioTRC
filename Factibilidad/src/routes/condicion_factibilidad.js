const { create } = require('domain');
const express = require('express');
const router = express.Router();
const oracledb = require('../db/conexion');
const os = require('os');
const { autoCommit } = require('oracledb');
const { error } = require('console');
const { finished } = require('stream');


//Obtener datos de Condicion_Factibilidad
router.get('/', async (req, res) => {
    const connection = new oracledb();
    try {
        const pool = await connection.conectar();
        const result = await pool.execute(`SELECT * FROM USO_SUELO.CONDICION_FACTIBILIDADES`);
        //console.log(result)
        await connection.cerrar();
        res.json(result['rows']);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Error al obtner las condiciones de factibilidad' });
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


//buscar por uno 
router.get('/:id', async (req, res) => {
    const connection = new oracledb();
    const id = req.params.id;

    
    try {
        const pool = await connection.conectar();
        const result = await pool.execute(`SELECT * FROM USO_SUELO.CONDICION_FACTIBILIDADES WHERE ID= ${id}`);
        //console.log(result)
        await connection.cerrar();
        res.json(result['rows']);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Error al obtner las condiciones de factibilidad' });
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

//Insertar datos a la tabla condiciones_factibilidad 
router.post('/', async (req, res) => {
    const connection = new oracledb();
    const { factibilidad_id, condicion_id } = req.body;
    console.log(req.body)
    try {
        const pool = await connection.conectar();
        const result = await pool.execute(
            `INSERT INTO USO_SUELO.CONDICION_FACTIBILIDADES(FACTIBILIDAD_ID, CONDICION_ID) VALUES ( :FACTIBILIDAD_ID, :CONDICION_ID)`,
            [factibilidad_id, condicion_id],
            { autoCommit: true }
        );
        await connection.cerrar();
        if (result) {
            res.status(201).json({ mensaje: 'Registro del dato insertado con exito' });
        } else {
            res.status(401).json({ mesaje: 'Error al insertar dato' });
        }

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al insertar datos en el registro', err });
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


//Actualizaciones de datos
router.put('/:id', async (req, res) => {

    //return console.log('llegamos')
    const connection = new oracledb();
    const { factibilidad_id, condicion_id } = req.body;
    const id = req.params.id;

    try {
        const pool = await connection.conectar();
        const result = await pool.execute(
            `UPDATE USO_SUELO.CONDICION_FACTIBILIDADES SET FACTIBILIDAD_ID= :factibilidad_id, CONDICION_ID= :condicion_id WHERE ID = : id`,
            [
                factibilidad_id, 
                condicion_id, 
                id
            ],
            { autoCommit: true }
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

//Eliminar Datos
router.delete('/:id', async (req, res) => {
    const connection = new oracledb();
    const id = req.params.id;

    try {
        const pool = await connection.conectar();
        const result = await pool.execute(
            `DELETE FROM USO_SUELO.CONDICION_FACTIBILIDADES WHERE ID = ${id}`,
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


//oracledb.STMT_TYPE_UPDATE:id ACTUALIZAR DATO ✅

//get/:id INSERTAR DATO ✅

//delete/:id ELIMINAR DATO ✅

