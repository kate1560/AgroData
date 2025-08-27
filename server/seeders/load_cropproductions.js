import fs from 'fs'; // allows reading files
import path from 'path'; // shows the current route
import csv from 'csv-parser'; // parses csv files
import { pool } from '../conexiondb.js'; // import the database connection
import { fileURLToPath } from 'url'; // necesario para definir __dirname

// Define __dirname manualmente
const __dirname = path.dirname(fileURLToPath(import.meta.url));


export async function loaddatabasecropproductions() {
    const routearchive = path.resolve(__dirname, '../data/cropproducts.csv'); // CSV dentro de server/data
    const productions = [];

    return new Promise((resolve, reject) => {
        fs.createReadStream(routearchive)
        .pipe(csv({
            separator: ',', // 👈 CSV separado por ,
            mapHeaders: ({ header }) => header.trim().toLowerCase(), // limpia espacios y pasa a minúsculas
            skipLines: 0,
            strict: false
        }))

        .on("data", (row) => {
            // Formatear el valor de DECIMAL si es necesario
            const productionTons = row.production_tons.replace(',', '.');

            productions.push([
                productionTons,
                row.crop_variety,
                row.soil_type,
                row.irrigation_system,
                row.fertilizer_used,
                row.sensor_status,
                row.maintenance_date,
                row.is_organic,
                row.farm_id,
                row.sensor_id
            ]);
        })

        .on('end', async () => {
            try {
                const sql = `
                    INSERT INTO CropProductions 
                    (production_tons, crop_variety, soil_type, irrigation_system, fertilizer_used, sensor_status, maintenance_date, is_organic, farm_id, sensor_id) 
                    VALUES ?
                `;
                const [result] = await pool.query(sql, [productions]);

                console.log(`✅ Were inserted ${result.affectedRows} crop productions`);
                resolve();

            } catch (error) {
                console.error('❌ Error inserting crop productions:', error.message);
                reject(error);
            }
        })

        .on('error', (error) => {
            console.error('❌ Error reading crop productions CSV file:', error.message);
            reject(error);
        })
    });
}
