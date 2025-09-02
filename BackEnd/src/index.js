const express = require('express');
const cors = require ("cors");
const OracleDB = require('./db/conexion'); // Tu clase personalizada
const oracledb = require('oracledb'); // Librería oficial para formatos, etc.
const bcrypt = require('bcrypt');
const { generateToken } = require('./controllers/tokenController');
const cookieParser = require('cookie-parser');
const checkToken = require('./middlewareToken');

const app = express();
const puerto = 3000;

// Middleware
app.use(cors({origin: '*', credentials: true})); //LA IP DE PROD EN VEZ DEL *
app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Servidor funcionando");
});

app.listen(puerto, () => {
    console.log(`Backend corriendo en http://localhost:$(puerto)`);
})

// Rutas
app.use('/usuarios', require('./routes/usuarios'));
app.use('/condiciones', require('./routes/condiciones'));
app.use('/condicion_factibilidad', require('./routes/condicion_factibilidad'));
app.use('/factibilidades', checkToken, require('./routes/factibilidades'));
app.use('/inspecciones', require('./routes/inspecciones'));
app.use('/tramite_inspecciones',checkToken, require('./routes/tramite_inspecciones'));
app.use('/tramites_mercantiles', checkToken, require('./routes/tramites_mercantiles'));
app.use('/usos_suelo', require('./routes/usos_suelo'));

// LOGIN
app.get('/login/:username/:password', async (req, res) => {
    //const { username, password } = req.body;
    const { username, password } = req.params;
    console.log(req.params)

    if (!username || !password) {
        return res.status(400).json({ error: 'Usuario y contraseña requeridos' });
    }

    const db = new OracleDB(); // Instancia de tu clase de conexión
    let conn;

    try {
        conn = await db.conectar();

        const result = await conn.execute(
            `SELECT * FROM USO_SUELO.USUARIOS WHERE USERNAME = :username`,
            [username],
            { outFormat: oracledb.OBJECT }
        );

        if (result.rows.length === 0) {
            console.log('error')
            return res.status(401).json({ correcto: false, msg: 'Usuario no encontrado' });
        }

        const hashpass = result.rows[0].PASSWORD;
        const valid = await bcrypt.compare(password, hashpass);

        //console.log(valid)
        const token = await generateToken(username, hashpass);
        if (valid) {
            //Produccion cambiar a secure:true 
            return res.cookie('token', token, { maxAge: 28800000, secure: false, httpOnly: true, sameSite: 'Lax' }).json({ correcto: true, msg: 'Login correcto' });
        } else {
            return res.status(401).json({ correcto: false, msg: 'Contraseña incorrecta' });
        }

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error al iniciar sesión' });
    } finally {
        await db.cerrar();
    }
});

app.get('/logout', async (req, res) =>{
  res.status(200).clearCookie('token').json({msg: 'logout correcto'})
})

// Puerto
app.listen(puerto, () => {
    console.log(`Servidor corriendo en http://localhost:${puerto}`);
});
