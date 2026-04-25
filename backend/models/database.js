/**
 * Smart University Campus Network Management System
 * Database Model using sql.js (Pure JavaScript SQLite)
 */

const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_PATH = path.join(__dirname, '../../database/campus_network.db');

let db = null;

/**
 * Initialize and get database instance
 */
async function getDatabase() {
    if (db) return db;
    
    const SQL = await initSqlJs();
    
    // Try to load existing database
    if (fs.existsSync(DB_PATH)) {
        const fileBuffer = fs.readFileSync(DB_PATH);
        db = new SQL.Database(fileBuffer);
    } else {
        db = new SQL.Database();
        await initializeSchema();
        await seedData();
        saveDatabase();
    }
    
    return db;
}

/**
 * Save database to file
 */
function saveDatabase() {
    if (db) {
        const data = db.export();
        const buffer = Buffer.from(data);
        fs.writeFileSync(DB_PATH, buffer);
    }
}

/**
 * Initialize database schema
 */
async function initializeSchema() {
    const schemaSQL = `
        -- Admins table for authentication
        CREATE TABLE IF NOT EXISTS admins (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            full_name TEXT,
            email TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            last_login DATETIME
        );

        -- Departments table
        CREATE TABLE IF NOT EXISTS departments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            code TEXT UNIQUE NOT NULL,
            building TEXT,
            floor INTEGER,
            head_name TEXT,
            contact_email TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        -- VLANs table
        CREATE TABLE IF NOT EXISTS vlans (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            department_id INTEGER,
            ip_range TEXT NOT NULL,
            gateway TEXT NOT NULL,
            subnet_mask TEXT DEFAULT '255.255.255.0',
            description TEXT,
            is_active INTEGER DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (department_id) REFERENCES departments(id)
        );

        -- Servers table
        CREATE TABLE IF NOT EXISTS servers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            type TEXT NOT NULL,
            ip_address TEXT UNIQUE NOT NULL,
            mac_address TEXT,
            vlan_id INTEGER,
            status TEXT DEFAULT 'online',
            cpu_usage INTEGER DEFAULT 0,
            memory_usage INTEGER DEFAULT 0,
            disk_usage INTEGER DEFAULT 0,
            uptime_hours INTEGER DEFAULT 0,
            os_type TEXT,
            last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (vlan_id) REFERENCES vlans(id)
        );

        -- Network devices table
        CREATE TABLE IF NOT EXISTS devices (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            type TEXT NOT NULL,
            mac_address TEXT UNIQUE,
            ip_address TEXT,
            vlan_id INTEGER,
            department_id INTEGER,
            location TEXT,
            status TEXT DEFAULT 'active',
            connected_port TEXT,
            connected_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            last_seen DATETIME DEFAULT CURRENT_TIMESTAMP,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (vlan_id) REFERENCES vlans(id),
            FOREIGN KEY (department_id) REFERENCES departments(id)
        );

        -- Wi-Fi connected clients
        CREATE TABLE IF NOT EXISTS wifi_clients (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id TEXT,
            student_name TEXT,
            device_name TEXT,
            device_type TEXT,
            mac_address TEXT,
            ip_address TEXT,
            signal_strength INTEGER,
            bandwidth_usage REAL,
            connected_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            last_activity DATETIME DEFAULT CURRENT_TIMESTAMP,
            status TEXT DEFAULT 'connected'
        );

        -- Network activity log
        CREATE TABLE IF NOT EXISTS network_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            event_type TEXT NOT NULL,
            device_id INTEGER,
            server_id INTEGER,
            description TEXT,
            ip_address TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `;
    
    db.run(schemaSQL);
    console.log('Database schema initialized');
}

/**
 * Seed database with sample data
 */
async function seedData() {
    // Hash password for admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    // Insert admin user
    db.run(`INSERT INTO admins (username, password, full_name, email) VALUES (?, ?, ?, ?)`,
        ['admin', hashedPassword, 'System Administrator', 'admin@smartcampus.edu']);
    
    // Insert departments
    const departments = [
        ['Administration', 'ADMIN', 'Main Building', 1, 'Dr. Rajesh Kumar', 'admin@smartcampus.edu'],
        ['IT Department', 'IT', 'Tech Center', 2, 'Prof. Anil Sharma', 'it@smartcampus.edu'],
        ['Computer Laboratory', 'COMLAB', 'Tech Center', 1, 'Dr. Priya Patel', 'lab@smartcampus.edu'],
        ['Library', 'LIB', 'Knowledge Center', 1, 'Mrs. Sunita Verma', 'library@smartcampus.edu'],
        ['Examination Cell', 'EXAM', 'Main Building', 2, 'Dr. Vikram Singh', 'exam@smartcampus.edu'],
        ['Faculty Block', 'FACULTY', 'Academic Building', 1, 'Prof. Deepak Gupta', 'faculty@smartcampus.edu']
    ];
    
    departments.forEach(dept => {
        db.run(`INSERT INTO departments (name, code, building, floor, head_name, contact_email) VALUES (?, ?, ?, ?, ?, ?)`, dept);
    });
    
    // Insert VLANs
    const vlans = [
        [10, 'VLAN_ADMIN', 1, '192.168.10.0/24', '192.168.10.1', '255.255.255.0', 'Administration Network', 1],
        [20, 'VLAN_IT', 2, '192.168.20.0/24', '192.168.20.1', '255.255.255.0', 'IT Department Network', 1],
        [30, 'VLAN_LAB', 3, '192.168.30.0/24', '192.168.30.1', '255.255.255.0', 'Computer Lab Network', 1],
        [40, 'VLAN_LIBRARY', 4, '192.168.40.0/24', '192.168.40.1', '255.255.255.0', 'Library Network', 1],
        [50, 'VLAN_EXAM', 5, '192.168.50.0/24', '192.168.50.1', '255.255.255.0', 'Examination Network', 1],
        [60, 'VLAN_FACULTY', 6, '192.168.60.0/24', '192.168.60.1', '255.255.255.0', 'Faculty Network', 1],
        [100, 'VLAN_SERVERS', null, '192.168.100.0/24', '192.168.100.1', '255.255.255.0', 'Server VLAN', 1],
        [200, 'VLAN_WIFI', null, '10.0.0.0/16', '10.0.0.1', '255.255.0.0', 'Student Wi-Fi Network', 1]
    ];
    
    vlans.forEach(vlan => {
        db.run(`INSERT INTO vlans (id, name, department_id, ip_range, gateway, subnet_mask, description, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, vlan);
    });
    
    // Insert Servers
    const servers = [
        ['Library Server', 'Library', '192.168.100.10', 'AA:BB:CC:DD:EE:01', 100, 'online', 35, 48, 62, 720, 'Ubuntu Server 22.04'],
        ['Exam Server', 'Exam', '192.168.100.20', 'AA:BB:CC:DD:EE:02', 100, 'online', 22, 35, 45, 480, 'Windows Server 2022'],
        ['DHCP Server', 'DHCP', '192.168.100.40', 'AA:BB:CC:DD:EE:04', 100, 'online', 12, 25, 15, 2160, 'Windows Server 2022'],
        ['DNS Server', 'DNS', '192.168.100.50', 'AA:BB:CC:DD:EE:05', 100, 'online', 18, 30, 20, 2160, 'Ubuntu Server 22.04'],
        ['Web Server', 'Web', '192.168.100.30', 'AA:BB:CC:DD:EE:03', 100, 'online', 45, 55, 38, 1440, 'Ubuntu Server 22.04']
    ];
    
    servers.forEach(server => {
        db.run(`INSERT INTO servers (name, type, ip_address, mac_address, vlan_id, status, cpu_usage, memory_usage, disk_usage, uptime_hours, os_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, server);
    });
    
    // Insert Devices
    const devices = [
        // Admin devices (User requested specifics)
        ['PC-1', 'PC', '00:11:22:33:44:01', '192.168.10.10', 10, 1, 'Admin Office - Room 101', 'active', 'SW1-Fa0/1'],
        ['PC-2', 'PC', '00:11:22:33:44:11', '192.168.20.10', 20, 2, 'IT Office - Room 201', 'active', 'SW2-Fa0/1'],
        ['Laptop-1', 'Laptop', '00:11:22:33:44:21', '192.168.30.15', 30, 3, 'Lab 1 - Mobile', 'active', 'SW3-Wi0'],
        
        // Other filler devices to make dashboard look populated
        ['ADMIN-PRINTER-01', 'Printer', '00:11:22:33:44:03', '192.168.10.50', 10, 1, 'Admin Office - Room 102', 'active', 'SW1-Fa0/10'],
        ['IT-PC-02', 'PC', '00:11:22:33:44:12', '192.168.20.11', 20, 2, 'IT Office - Room 201', 'active', 'SW2-Fa0/2'],
        ['IT-LAPTOP-01', 'Laptop', '00:11:22:33:44:13', '192.168.20.20', 20, 2, 'IT Office - Mobile', 'active', 'SW2-Fa0/3'],
        ['LAB-PC-02', 'PC', '00:11:22:33:44:22', '192.168.30.11', 30, 3, 'Lab 1 - Workstation 2', 'active', 'SW3-Fa0/2'],
        ['LAB-PC-03', 'PC', '00:11:22:33:44:23', '192.168.30.12', 30, 3, 'Lab 1 - Workstation 3', 'active', 'SW3-Fa0/3'],
        ['LAB-PC-04', 'PC', '00:11:22:33:44:24', '192.168.30.13', 30, 3, 'Lab 1 - Workstation 4', 'inactive', 'SW3-Fa0/4'],
        
        // Network Infrastructure
        ['CORE-ROUTER', 'Router', '00:11:22:33:44:F1', '192.168.1.1', null, 2, 'Server Room', 'active', 'Internet'],
        ['CORE-SWITCH', 'Switch', '00:11:22:33:44:F2', '192.168.1.2', null, 2, 'Server Room', 'active', 'Router-Gi0/0'],
        ['WLC-CONTROLLER', 'Router', '00:11:22:33:44:F3', '10.0.0.5', 200, null, 'Server Room', 'active', 'SW1-Gi0/1'],
        ['AP-LIBRARY', 'Access Point', '00:11:22:33:44:F6', '10.0.0.12', 200, null, 'Library', 'active', 'SW4-Fa0/24']
    ];
    
    devices.forEach(device => {
        db.run(`INSERT INTO devices (name, type, mac_address, ip_address, vlan_id, department_id, location, status, connected_port) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, device);
    });
    
    // Insert Wi-Fi Clients
    const wifiClients = [
        ['STU001', 'Rahul Sharma', 'Rahul-iPhone', 'Phone', 'AA:11:22:33:44:01', '10.0.1.10', -45, 2.5, 'connected'],
        ['STU002', 'Priya Patel', 'Priya-Laptop', 'Laptop', 'AA:11:22:33:44:02', '10.0.1.11', -52, 15.2, 'connected'],
        ['STU003', 'Amit Kumar', 'Amit-Phone', 'Phone', 'AA:11:22:33:44:03', '10.0.1.12', -48, 3.8, 'connected'],
        ['STU004', 'Sneha Gupta', 'Sneha-iPad', 'Tablet', 'AA:11:22:33:44:04', '10.0.1.13', -55, 8.5, 'connected'],
        ['STU005', 'Vikram Singh', 'Vikram-Laptop', 'Laptop', 'AA:11:22:33:44:05', '10.0.1.14', -42, 25.0, 'connected'],
        ['STU006', 'Anjali Verma', 'Anjali-Phone', 'Phone', 'AA:11:22:33:44:06', '10.0.1.15', -60, 1.2, 'connected'],
        ['STU007', 'Ravi Krishnan', 'Ravi-Laptop', 'Laptop', 'AA:11:22:33:44:07', '10.0.1.16', -50, 12.8, 'connected'],
        ['STU008', 'Meera Nair', 'Meera-Phone', 'Phone', 'AA:11:22:33:44:08', '10.0.1.17', -58, 2.0, 'disconnected'],
        ['STU009', 'Karthik Iyer', 'Karthik-Tablet', 'Tablet', 'AA:11:22:33:44:09', '10.0.1.18', -47, 6.5, 'connected'],
        ['STU010', 'Divya Reddy', 'Divya-Laptop', 'Laptop', 'AA:11:22:33:44:10', '10.0.1.19', -53, 18.3, 'connected'],
        ['STU011', 'Arjun Menon', 'Arjun-Phone', 'Phone', 'AA:11:22:33:44:11', '10.0.1.20', -65, 0.8, 'disconnected'],
        ['STU012', 'Kavya Prasad', 'Kavya-Laptop', 'Laptop', 'AA:11:22:33:44:12', '10.0.1.21', -44, 22.1, 'connected']
    ];
    
    wifiClients.forEach(client => {
        db.run(`INSERT INTO wifi_clients (student_id, student_name, device_name, device_type, mac_address, ip_address, signal_strength, bandwidth_usage, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, client);
    });
    
    console.log('Sample data inserted');
}

/**
 * Helper function to run queries and get results
 */
function runQuery(sql, params = []) {
    const stmt = db.prepare(sql);
    if (params.length > 0) {
        stmt.bind(params);
    }
    const results = [];
    while (stmt.step()) {
        results.push(stmt.getAsObject());
    }
    stmt.free();
    return results;
}

/**
 * Helper function to run insert/update/delete
 */
function runStatement(sql, params = []) {
    db.run(sql, params);
    saveDatabase();
    return db.getRowsModified();
}

/**
 * Get last inserted row ID
 */
function getLastInsertId() {
    const result = db.exec("SELECT last_insert_rowid() as id");
    return result[0]?.values[0]?.[0] || null;
}

module.exports = {
    getDatabase,
    saveDatabase,
    runQuery,
    runStatement,
    getLastInsertId
};
