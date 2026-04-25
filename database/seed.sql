-- Smart University Campus Network Management System
-- Sample Data / Seed File

-- Insert default admin user (password: admin123)
-- Password hash generated using bcrypt
INSERT INTO admins (username, password, full_name, email) VALUES 
('admin', '$2a$10$rPQvGJqKZKQN8iQD3q5X8OvQwPqEQ5xVk0cZlXfqRdZ1Pw5JWXX.K', 'System Administrator', 'admin@smartcampus.edu');

-- Insert Departments
INSERT INTO departments (name, code, building, floor, head_name, contact_email) VALUES 
('Administration', 'ADMIN', 'Main Building', 1, 'Dr. Rajesh Kumar', 'admin@smartcampus.edu'),
('IT Department', 'IT', 'Tech Center', 2, 'Prof. Anil Sharma', 'it@smartcampus.edu'),
('Computer Laboratory', 'COMLAB', 'Tech Center', 1, 'Dr. Priya Patel', 'lab@smartcampus.edu'),
('Library', 'LIB', 'Knowledge Center', 1, 'Mrs. Sunita Verma', 'library@smartcampus.edu'),
('Examination Cell', 'EXAM', 'Main Building', 2, 'Dr. Vikram Singh', 'exam@smartcampus.edu'),
('Faculty Block', 'FACULTY', 'Academic Building', 1, 'Prof. Deepak Gupta', 'faculty@smartcampus.edu');

-- Insert VLANs
INSERT INTO vlans (id, name, department_id, ip_range, gateway, subnet_mask, description, is_active) VALUES 
(10, 'VLAN_ADMIN', 1, '192.168.10.0/24', '192.168.10.1', '255.255.255.0', 'Administration Network - Secure access for admin staff', 1),
(20, 'VLAN_IT', 2, '192.168.20.0/24', '192.168.20.1', '255.255.255.0', 'IT Department Network - Network management and support', 1),
(30, 'VLAN_LAB', 3, '192.168.30.0/24', '192.168.30.1', '255.255.255.0', 'Computer Lab Network - Student practical sessions', 1),
(40, 'VLAN_LIBRARY', 4, '192.168.40.0/24', '192.168.40.1', '255.255.255.0', 'Library Network - Digital library access', 1),
(50, 'VLAN_EXAM', 5, '192.168.50.0/24', '192.168.50.1', '255.255.255.0', 'Examination Network - Secure exam server access', 1),
(60, 'VLAN_FACULTY', 6, '192.168.60.0/24', '192.168.60.1', '255.255.255.0', 'Faculty Network - Teaching staff access', 1),
(100, 'VLAN_SERVERS', NULL, '192.168.100.0/24', '192.168.100.1', '255.255.255.0', 'Server VLAN - All campus servers', 1),
(200, 'VLAN_WIFI', NULL, '10.0.0.0/16', '10.0.0.1', '255.255.0.0', 'Student Wi-Fi Network - Separate from main campus', 1);

-- Insert Servers
INSERT INTO servers (name, type, ip_address, mac_address, vlan_id, status, cpu_usage, memory_usage, disk_usage, uptime_hours, os_type) VALUES 
('LIB-SERVER-01', 'Library', '192.168.100.10', 'AA:BB:CC:DD:EE:01', 100, 'online', 35, 48, 62, 720, 'Ubuntu Server 22.04'),
('EXAM-SERVER-01', 'Exam', '192.168.100.20', 'AA:BB:CC:DD:EE:02', 100, 'online', 22, 35, 45, 480, 'Windows Server 2022'),
('WEB-SERVER-01', 'Web', '192.168.100.30', 'AA:BB:CC:DD:EE:03', 100, 'online', 45, 55, 38, 1440, 'Ubuntu Server 22.04'),
('DHCP-SERVER-01', 'DHCP', '192.168.100.40', 'AA:BB:CC:DD:EE:04', 100, 'online', 12, 25, 15, 2160, 'Windows Server 2022'),
('DNS-SERVER-01', 'DNS', '192.168.100.50', 'AA:BB:CC:DD:EE:05', 100, 'online', 18, 30, 20, 2160, 'Ubuntu Server 22.04');

-- Insert Network Devices
-- Administration devices
INSERT INTO devices (name, type, mac_address, ip_address, vlan_id, department_id, location, status, connected_port) VALUES 
('ADMIN-PC-01', 'PC', '00:11:22:33:44:01', '192.168.10.10', 10, 1, 'Admin Office - Room 101', 'active', 'SW1-Fa0/1'),
('ADMIN-PC-02', 'PC', '00:11:22:33:44:02', '192.168.10.11', 10, 1, 'Admin Office - Room 101', 'active', 'SW1-Fa0/2'),
('ADMIN-PRINTER-01', 'Printer', '00:11:22:33:44:03', '192.168.10.50', 10, 1, 'Admin Office - Room 102', 'active', 'SW1-Fa0/10'),

-- IT Department devices
('IT-PC-01', 'PC', '00:11:22:33:44:11', '192.168.20.10', 20, 2, 'IT Office - Room 201', 'active', 'SW2-Fa0/1'),
('IT-PC-02', 'PC', '00:11:22:33:44:12', '192.168.20.11', 20, 2, 'IT Office - Room 201', 'active', 'SW2-Fa0/2'),
('IT-LAPTOP-01', 'Laptop', '00:11:22:33:44:13', '192.168.20.20', 20, 2, 'IT Office - Mobile', 'active', 'SW2-Fa0/3'),
('IT-SERVER-RACK-SW', 'Switch', '00:11:22:33:44:14', '192.168.20.250', 20, 2, 'Server Room', 'active', 'Core-Gi0/1'),

-- Computer Lab devices
('LAB-PC-01', 'PC', '00:11:22:33:44:21', '192.168.30.10', 30, 3, 'Lab 1 - Workstation 1', 'active', 'SW3-Fa0/1'),
('LAB-PC-02', 'PC', '00:11:22:33:44:22', '192.168.30.11', 30, 3, 'Lab 1 - Workstation 2', 'active', 'SW3-Fa0/2'),
('LAB-PC-03', 'PC', '00:11:22:33:44:23', '192.168.30.12', 30, 3, 'Lab 1 - Workstation 3', 'active', 'SW3-Fa0/3'),
('LAB-PC-04', 'PC', '00:11:22:33:44:24', '192.168.30.13', 30, 3, 'Lab 1 - Workstation 4', 'inactive', 'SW3-Fa0/4'),
('LAB-PC-05', 'PC', '00:11:22:33:44:25', '192.168.30.14', 30, 3, 'Lab 1 - Workstation 5', 'active', 'SW3-Fa0/5'),
('LAB-PRINTER-01', 'Printer', '00:11:22:33:44:26', '192.168.30.50', 30, 3, 'Lab 1 - Printer Station', 'active', 'SW3-Fa0/20'),

-- Library devices
('LIB-PC-01', 'PC', '00:11:22:33:44:31', '192.168.40.10', 40, 4, 'Library - Catalog Station 1', 'active', 'SW4-Fa0/1'),
('LIB-PC-02', 'PC', '00:11:22:33:44:32', '192.168.40.11', 40, 4, 'Library - Catalog Station 2', 'active', 'SW4-Fa0/2'),
('LIB-PC-03', 'PC', '00:11:22:33:44:33', '192.168.40.12', 40, 4, 'Library - Staff PC', 'active', 'SW4-Fa0/3'),

-- Exam Cell devices
('EXAM-PC-01', 'PC', '00:11:22:33:44:41', '192.168.50.10', 50, 5, 'Exam Cell - Room 201', 'active', 'SW5-Fa0/1'),
('EXAM-PC-02', 'PC', '00:11:22:33:44:42', '192.168.50.11', 50, 5, 'Exam Cell - Room 201', 'active', 'SW5-Fa0/2'),
('EXAM-PRINTER-01', 'Printer', '00:11:22:33:44:43', '192.168.50.50', 50, 5, 'Exam Cell - Secure Printer', 'active', 'SW5-Fa0/10'),

-- Faculty devices
('FACULTY-PC-01', 'PC', '00:11:22:33:44:51', '192.168.60.10', 60, 6, 'Faculty Room 1', 'active', 'SW6-Fa0/1'),
('FACULTY-PC-02', 'PC', '00:11:22:33:44:52', '192.168.60.11', 60, 6, 'Faculty Room 2', 'active', 'SW6-Fa0/2'),
('FACULTY-LAPTOP-01', 'Laptop', '00:11:22:33:44:53', '192.168.60.20', 60, 6, 'Faculty - Mobile', 'active', 'SW6-Fa0/3'),
('FACULTY-PRINTER-01', 'Printer', '00:11:22:33:44:54', '192.168.60.50', 60, 6, 'Faculty Common Area', 'active', 'SW6-Fa0/20'),

-- Network Infrastructure
('CORE-ROUTER-01', 'Router', '00:11:22:33:44:F1', '192.168.1.1', NULL, 2, 'Server Room - Main Rack', 'active', 'Internet'),
('CORE-SWITCH-01', 'Switch', '00:11:22:33:44:F2', '192.168.1.2', NULL, 2, 'Server Room - Main Rack', 'active', 'Router-Gi0/0'),
('WIFI-CONTROLLER-01', 'Access Point', '00:11:22:33:44:F3', '10.0.0.2', 200, 2, 'Server Room', 'active', 'Core-Gi0/2'),
('AP-BUILDING-A', 'Access Point', '00:11:22:33:44:F4', '10.0.0.10', 200, NULL, 'Main Building - Lobby', 'active', 'SW1-Fa0/24'),
('AP-BUILDING-B', 'Access Point', '00:11:22:33:44:F5', '10.0.0.11', 200, NULL, 'Tech Center - Corridor', 'active', 'SW2-Fa0/24'),
('AP-LIBRARY', 'Access Point', '00:11:22:33:44:F6', '10.0.0.12', 200, NULL, 'Library - Reading Hall', 'active', 'SW4-Fa0/24');

-- Insert Wi-Fi Clients (Students)
INSERT INTO wifi_clients (student_id, student_name, device_name, device_type, mac_address, ip_address, signal_strength, bandwidth_usage, status) VALUES 
('STU001', 'Rahul Sharma', 'Rahul-iPhone', 'Phone', 'AA:11:22:33:44:01', '10.0.1.10', -45, 2.5, 'connected'),
('STU002', 'Priya Patel', 'Priya-Laptop', 'Laptop', 'AA:11:22:33:44:02', '10.0.1.11', -52, 15.2, 'connected'),
('STU003', 'Amit Kumar', 'Amit-Phone', 'Phone', 'AA:11:22:33:44:03', '10.0.1.12', -48, 3.8, 'connected'),
('STU004', 'Sneha Gupta', 'Sneha-iPad', 'Tablet', 'AA:11:22:33:44:04', '10.0.1.13', -55, 8.5, 'connected'),
('STU005', 'Vikram Singh', 'Vikram-Laptop', 'Laptop', 'AA:11:22:33:44:05', '10.0.1.14', -42, 25.0, 'connected'),
('STU006', 'Anjali Verma', 'Anjali-Phone', 'Phone', 'AA:11:22:33:44:06', '10.0.1.15', -60, 1.2, 'connected'),
('STU007', 'Ravi Krishnan', 'Ravi-Laptop', 'Laptop', 'AA:11:22:33:44:07', '10.0.1.16', -50, 12.8, 'connected'),
('STU008', 'Meera Nair', 'Meera-Phone', 'Phone', 'AA:11:22:33:44:08', '10.0.1.17', -58, 2.0, 'disconnected'),
('STU009', 'Karthik Iyer', 'Karthik-Tablet', 'Tablet', 'AA:11:22:33:44:09', '10.0.1.18', -47, 6.5, 'connected'),
('STU010', 'Divya Reddy', 'Divya-Laptop', 'Laptop', 'AA:11:22:33:44:10', '10.0.1.19', -53, 18.3, 'connected'),
('STU011', 'Arjun Menon', 'Arjun-Phone', 'Phone', 'AA:11:22:33:44:11', '10.0.1.20', -65, 0.8, 'disconnected'),
('STU012', 'Kavya Prasad', 'Kavya-Laptop', 'Laptop', 'AA:11:22:33:44:12', '10.0.1.21', -44, 22.1, 'connected');

-- Insert some network logs
INSERT INTO network_logs (event_type, device_id, description, ip_address) VALUES 
('device_connected', 1, 'ADMIN-PC-01 connected to network', '192.168.10.10'),
('device_connected', 4, 'IT-PC-01 connected to network', '192.168.20.10'),
('server_status_change', NULL, 'LIB-SERVER-01 status changed to online', '192.168.100.10'),
('device_connected', 8, 'LAB-PC-01 connected to network', '192.168.30.10'),
('wifi_client_connected', NULL, 'Student STU001 connected to Wi-Fi', '10.0.1.10');
