### AgroData Farms Management

## System Description

Este proyecto es un Sistema de Gestión de Fincas desarrollado para AgroData Solutions, empresa especializada en soluciones tecnológicas para el sector agroindustrial en Latinoamérica.

## Instructions to Run the Project

* Clone the repository:

git clone : 
cd AgroData-Farms


* Install dependencies:

npm install

## Relation Model 


## Set up the database:

* Ensure MySQL is installed and running.

* Execute the SQL script located at database/pd_Kateryn_Martinez_Malecon.sql to create the database and tables.

* Start the backend server:

npm run server


## Open the frontend:

Open index.html from the app folder in your browser.

The frontend communicates with the backend at http://localhost:3000.

Technologies Used

Frontend: HTML, CSS, JavaScript

Backend: Node.js, Express.js

Database: MySQL

Other Libraries:

mysql2
 (MySQL connection)

cors
 (API permission control)

body-parser
 (parsing JSON requests)

## Database Normalization

The database is normalized into three levels:

1NF: Ensures all tables have unique rows and atomic values.

2NF: Ensures non-key attributes fully depend on primary keys.

3NF: Removes transitive dependencies to prevent data redundancy.

Entities include:

Farms: Information about farm name, crop type, region, and responsible technician.

Sensors: Data collected from monitoring devices linked to specific farms.

Production Reports: Production amounts, dates, and farm references.

Bulk CSV Upload Instructions

Convert the original Excel files (.xlsx) to CSV.

Use the backend API or the frontend button to upload CSV files.

The system will parse and insert the data into the corresponding database tables.

Ensure the database exists before executing the upload.

## CRUD and Dashboard

The CRUD interface manages the Farms entity:

Create, Read, Update, Delete operations are available.

Validates data before inserting or updating.

The dashboard shows total farms and dynamically updates the table.




Developer Information
* Name: Kateryn Martinez
* Clan: Malecon
* Email: katemartinez1507@gmail.com