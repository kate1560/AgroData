// server/index.js
import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Servir archivos estáticos de /app
app.use("/app", express.static(path.join(__dirname, "../app")));

// Servir index.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../index.html"));
});

// Conexión a MySQL
const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "Qwe.123*",
    database: "database_agrodata_kateryn_malecon",
    port: 3306,
});

// -------- CRUD FARM --------

// Listar todas las granjas
app.get("/api/farms", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM Farms");
        res.json(rows);
    } catch (err) {
        console.error("Error fetching farms:", err);
        res.status(500).json({ error: err.message });
    }
});

// Obtener una granja por ID
app.get("/api/farms/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.query("SELECT * FROM Farms WHERE farm_id = ?", [id]);
        if (rows.length === 0) return res.status(404).json({ error: "Farm not found" });
        res.json(rows[0]);
    } catch (err) {
        console.error(`Error fetching farm ID ${id}:`, err);
        res.status(500).json({ error: err.message });
    }
});

// Crear granja
app.post("/api/farms", async (req, res) => {
    const { farm_name, crop_type, region, responsible_technician } = req.body;
    if (!farm_name || !crop_type || !region || !responsible_technician) {
        return res.status(400).json({ error: "Required fields: farm_name, crop_type, region, responsible_technician" });
    }
    try {
        const [result] = await pool.query(
            "INSERT INTO Farms (farm_name, crop_type, region, responsible_technician) VALUES (?, ?, ?, ?)",
            [farm_name, crop_type, region, responsible_technician]
        );
        res.json({ message: "Farm created", farm_id: result.insertId });
    } catch (err) {
        console.error("Error creating farm:", err);
        res.status(500).json({ error: err.message });
    }
});

// Actualizar granja
app.put("/api/farms/:id", async (req, res) => {
    const { id } = req.params;
    const { farm_name, crop_type, region, responsible_technician } = req.body;
    if (!farm_name || !crop_type || !region || !responsible_technician) {
        return res.status(400).json({ error: "Required fields: farm_name, crop_type, region, responsible_technician" });
    }
    try {
        const [result] = await pool.query(
            "UPDATE Farms SET farm_name=?, crop_type=?, region=?, responsible_technician=? WHERE farm_id=?",
            [farm_name, crop_type, region, responsible_technician, id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ error: "Farm not found" });
        res.json({ message: "Farm updated" });
    } catch (err) {
        console.error(`Error updating farm ID ${id}:`, err);
        res.status(500).json({ error: err.message });
    }
});

// Eliminar granja
app.delete("/api/farms/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query("DELETE FROM Farms WHERE farm_id=?", [id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: "Farm not found" });
        res.json({ message: "Farm deleted" });
    } catch (err) {
        console.error(`Error deleting farm ID ${id}:`, err);
        res.status(500).json({ error: err.message });
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
