import { loaddatabasefarms } from "./load_farms.js";   
import { loaddatabasesensors } from "./load_sensors.js";
import { loaddatabasecropproductions } from "./load_cropproductions.js";
import { pool } from "../conexiondb.js";

(async () => {
    try {
        console.log('⏳ Start of seeders..');

        // ⚠️ Desactiva temporalmente las FK
        await pool.query('SET FOREIGN_KEY_CHECKS = 0');

        // 🔹 Limpiar todas las tablas y reiniciar IDs
        await pool.query('TRUNCATE TABLE CropProductions');
        await pool.query('TRUNCATE TABLE Farms');
        await pool.query('TRUNCATE TABLE Sensors');

        // ⚠️ Reactiva las FK
        await pool.query('SET FOREIGN_KEY_CHECKS = 1');

        await loaddatabasefarms();
        await loaddatabasesensors();
        await loaddatabasecropproductions();

        console.log('✅ Seeders executed correctly');
    } catch (error) {
        console.error('❌ Error running seeders:', error.message);
    } finally {
        process.exit(); // closes the process
    }
})();
