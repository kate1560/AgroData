-- CREATE DATABASE
DROP DATABASE IF EXISTS database_agrodata_kateryn_malecon;
CREATE DATABASE database_agrodata_kateryn_malecon;
USE database_agrodata_kateryn_malecon;

-- Table: Farm
CREATE TABLE Farms (
    farm_id INT AUTO_INCREMENT PRIMARY KEY,
    farm_name VARCHAR(100) NOT NULL,
    crop_type VARCHAR(100) NOT NULL,
    region VARCHAR(100) NOT NULL,
    responsible_technician VARCHAR(100)
);

-- Table: Sensor
CREATE TABLE Sensors (
    sensor_id INT AUTO_INCREMENT PRIMARY KEY,
    sensor_coder varchar(100) not null,
    sensor_type VARCHAR(100) NOT NULL,
    value DECIMAL(10,2) NOT NULL ,
    date_time DATETIME NOT NULL,
    farm_id INT NOT NULL,
    FOREIGN KEY (farm_id) REFERENCES Farms(farm_id)
);

-- Table: CropProduction
CREATE TABLE CropProductions (
    production_id INT AUTO_INCREMENT PRIMARY KEY,
    production_tons DECIMAL(10,2) NOT NULL,
    crop_variety VARCHAR(50) NOT NULL,
    soil_type VARCHAR(50) NOT NULL,
    irrigation_system VARCHAR(50) NOT NULL,
    fertilizer_used VARCHAR(50) NOT NULL,
    sensor_status VARCHAR(20) NOT NULL,
    maintenance_date DATE NOT NULL,
    is_organic ENUM('Yes','No') NOT NULL ,
    farm_id INT NOT NULL ,
    sensor_id INT NOT NULL,
    FOREIGN KEY (farm_id) REFERENCES Farms(farm_id),
    FOREIGN KEY (sensor_id) REFERENCES Sensors(sensor_id)
);
 