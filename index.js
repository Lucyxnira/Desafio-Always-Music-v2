const { Pool } = require('pg');
const args = process.argv.slice(2);

const pool = new Pool({
    user: 'katherine-medina',          // Reemplaza 'tu_usuario' con tu usuario de PostgreSQL
    host: 'localhost',           // Usualmente es 'localhost' si estás ejecutando PostgreSQL en tu máquina local
    database: 'estudiantes_db',  // Asegúrate de que el nombre de la base de datos sea correcto
    password: 'hola',   // Reemplaza 'tu_contraseña' con la contraseña de tu usuario de PostgreSQL
    port: 5432,                  // El puerto por defecto de PostgreSQL es 5432
});

pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

const agregarEstudiante = async (nombre, rut, curso, nivel) => {
    const query = 'INSERT INTO estudiantes (nombre, rut, curso, nivel) VALUES ($1, $2, $3, $4)';
    const values = [nombre, rut, curso, nivel];
    try {
        await pool.query(query, values);
        console.log(`Estudiante ${nombre} agregado con éxito`);
    } catch (err) {
        console.error('Error agregando estudiante:', err);
    }
};

const consultarEstudiantes = async () => {
    const query = 'SELECT * FROM estudiantes';
    try {
        const res = await pool.query(query);
        console.log('Estudiantes registrados:', res.rows);
    } catch (err) {
        console.error('Error consultando estudiantes:', err);
    }
};

const consultarEstudiantePorRut = async (rut) => {
    const query = 'SELECT * FROM estudiantes WHERE rut = $1';
    const values = [rut];
    try {
        const res = await pool.query(query, values);
        console.log('Estudiante encontrado:', res.rows[0]);
    } catch (err) {
        console.error('Error consultando estudiante:', err);
    }
};

const actualizarEstudiante = async (nombre, rut, curso, nivel) => {
    const query = 'UPDATE estudiantes SET nombre = $1, curso = $2, nivel = $3 WHERE rut = $4';
    const values = [nombre, curso, nivel, rut];
    try {
        await pool.query(query, values);
        console.log(`Estudiante con rut ${rut} actualizado con éxito`);
    } catch (err) {
        console.error('Error actualizando estudiante:', err);
    }
};

const eliminarEstudiante = async (rut) => {
    const query = 'DELETE FROM estudiantes WHERE rut = $1';
    const values = [rut];
    try {
        await pool.query(query, values);
        console.log(`Estudiante con rut ${rut} eliminado con éxito`);
    } catch (err) {
        console.error('Error eliminando estudiante:', err);
    }
};

const comando = args[0];

switch (comando) {
    case 'agregar':
        agregarEstudiante(args[1], args[2], args[3], args[4]);
        break;
    case 'consultar':
        consultarEstudiantes();
        break;
    case 'consultarRut':
        consultarEstudiantePorRut(args[1]);
        break;
    case 'actualizar':
        actualizarEstudiante(args[1], args[2], args[3], args[4]);
        break;
    case 'eliminar':
        eliminarEstudiante(args[1]);
        break;
    default:
        console.log('Comando no reconocido');
        break;
}
