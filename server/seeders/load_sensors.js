import fs from 'fs'; // allows reading files
import path from 'path'; // shows the current route
import csv from 'csv-parser'; // parses csv files
import { pool } from '../conexiondb.js'; // import the database connection
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function loaddatabasesensors() {
    const routearchive = path.resolve(__dirname, '../data/sensors.csv'); // save the absolute path of the file within server/data
    const sensors = [];

    let farmIdCounter = 1; // Inicializa el contador en 1

    return new Promise((resolve, reject) => {
        fs.createReadStream(routearchive)
        .pipe(csv({
            separator: ',', // 👈 CSV separated by ,
            mapHeaders: ({ header }) => header.trim().toLowerCase(), // clears spaces and lowercases
            skipLines: 0,
            strict: false
        }))


        .on("data", (row) => {
            // Cambié el valor para convertir la coma en punto y que MySQL reconozca el DECIMAL
            const sensorCoder = row.sensor_coder ? row.sensor_coder : '*'; // Usa un valor predeterminado si sensor_coder está vacío
            const valueFormatted = row.value ? row.value.replace(',', '.') : '0';
            const sensorType = row.sensor_type ? row.sensor_type : '*'; // Usa un valor predeterminado si sensor_type está vacío
            const dateTime = row.date_time ? row.date_time : '1970-01-01 00:00:00'; // Usa un valor predeterminado si date_time está vacío
            const farmId = farmIdCounter; // Asigna el valor actual del contador y luego lo incrementa
            sensors.push([
                sensorCoder,
                sensorType,
                valueFormatted,
                dateTime,
                farmId
            ]);

            farmIdCounter = farmIdCounter < 14 ? farmIdCounter + 1 : 1; // Incrementa el contador y reinicia a 1 si supera 5
        })

        .on('end', async () => {
            try {
                const sql = 'INSERT INTO Sensors (sensor_coder,sensor_type, value, date_time, farm_id) VALUES ?';
                const [result] = await pool.query(sql, [sensors]);

                console.log(`✅ Were inserted ${result.affectedRows} sensors`);
                resolve(); // ends successfully

            } catch (error) {
                console.error('❌ Error inserting sensors:', error.message);
                reject(error);
            }
        })

        .on('error', (error) => {
            console.error('❌ Error reading sensors csv file:', error.message);
            reject(error);
        })
    });
}
