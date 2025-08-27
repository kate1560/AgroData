import fs from 'fs'; // allows reading files
import path from 'path'; // shows the current route
import csv from 'csv-parser'; // parses csv files
import { pool } from '../conexiondb.js'; // import the database connection

export async function loaddatabasefarms() {
    const routearchive = path.resolve('../data/farms.csv'); // save the absolute path of the file within server/data
    const farms = [];

    return new Promise((resolve, reject) => {
        fs.createReadStream(routearchive)
        .pipe(csv({
            separator: ',', // 👈 CSV separated by ,
            mapHeaders: ({ header }) => header.trim().toLowerCase(), // clears spaces and lowercases
            skipLines: 0,
            strict: false
        }))

        .on("data", (row) => {
            farms.push([
                row.farm_name,
                row.crop_type,
                row.region,
                row.responsible_technician
            ]);
        })

        .on('end', async () => {
            try {
                const sql = 'INSERT INTO farms (farm_name, crop_type, region, responsible_technician) VALUES ?';
                const [result] = await pool.query(sql, [farms]);

                console.log(`✅ Were inserted ${result.affectedRows} farms`);
                resolve(); // ends successfully

            } catch (error) {
                console.error('❌ Error inserting farms:', error.message);
                reject(error);
            }
        })

        .on('error', (error) => {
            console.error('❌ Error reading farms csv file:', error.message);
            reject(error);
        })
    });
}
