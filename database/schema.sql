-- Smart University Campus Network Management System
-- Database Schema

-- Drop existing tables if they exist
DROP TABLE IF EXISTS wifi_clients;
DROP TABLE IF EXISTS devices;
DROP TABLE IF EXISTS servers;
DROP TABLE IF EXISTS vlans;
DROP TABLE IF EXISTS departments;
DROP TABLE IF EXISTS admins;

-- Admins table for authentication
CREATE TABLE admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    full_name TEXT,
    email TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME
);

-- Departments table
CREATE TABLE departments (
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
CREATE TABLE vlans (
    id INTEGER PRIMARY KEY,  -- VLAN ID (10, 20, 30, etc.)
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
CREATE TABLE servers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type TEXT NOT NULL,  -- Library, Exam, Web, DHCP, DNS
    ip_address TEXT UNIQUE NOT NULL,
    mac_address TEXT,
    vlan_id INTEGER,
    status TEXT DEFAULT 'online',  -- online, offline, maintenance
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
CREATE TABLE devices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type TEXT NOT NULL,  -- PC, Laptop, Printer, Switch, Router, Access Point
    mac_address TEXT UNIQUE,
    ip_address TEXT,
    vlan_id INTEGER,
    department_id INTEGER,
    location TEXT,
    status TEXT DEFAULT 'active',  -- active, inactive, maintenance
    connected_port TEXT,
    connected_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_seen DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vlan_id) REFERENCES vlans(id),
    FOREIGN KEY (department_id) REFERENCES departments(id)
);

-- Wi-Fi connected clients (students)
CREATE TABLE wifi_clients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id TEXT,
    student_name TEXT,
    device_name TEXT,
    device_type TEXT,  -- Phone, Laptop, Tablet
    mac_address TEXT,
    ip_address TEXT,
    signal_strength INTEGER,  -- in dBm
    bandwidth_usage REAL,  -- in Mbps
    connected_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_activity DATETIME DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'connected'  -- connected, disconnected
);

-- Network activity log
CREATE TABLE network_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_type TEXT NOT NULL,  -- device_connected, device_disconnected, server_status_change, etc.
    device_id INTEGER,
    server_id INTEGER,
    description TEXT,
    ip_address TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_devices_vlan ON devices(vlan_id);
CREATE INDEX idx_devices_department ON devices(department_id);
CREATE INDEX idx_devices_status ON devices(status);
CREATE INDEX idx_servers_status ON servers(status);
CREATE INDEX idx_wifi_clients_status ON wifi_clients(status);
CREATE INDEX idx_network_logs_timestamp ON network_logs(timestamp);
