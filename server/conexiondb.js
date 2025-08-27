import mysql from "mysql2/promise" //imports the library with which the database connects

export const pool = mysql.createPool({ //Creates a database connection pool and makes it available for import.
    host: "localhost",
    database: "database_agrodata_kateryn_malecon",
    port: "3306",
    user: "root",
    password: "Qwe.123*",
    connectionLimit: 10, // maximum number of connections at the same time
    waitForConnections: true,  //New connections wait their turn when the limit is reached
    queueLimit: 0 //maximum number of pending requests, unlimited
})

async function databaseconnection() {
    try{
        const connection = await pool.getConnection();
        console.log('✅ successful connection to the database');
        connection.release();

    }catch(error){
        console.error('❌ error connecting to the database:', error.message);
    }
    
}

databaseconnection();