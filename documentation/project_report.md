# Smart University Campus Network Management System
## Mini Project Report

---

### 1. INTRODUCTION

#### 1.1 Project Overview
The Smart University Campus Network Management System is a web-based application designed to manage and monitor a university campus network infrastructure. The system provides a centralized dashboard for network administrators to manage VLANs, devices, servers, and student Wi-Fi connectivity.

#### 1.2 Objectives
- Demonstrate understanding of VLAN concepts and network segmentation
- Implement proper IP addressing schemes for different departments
- Create a visual representation of network topology
- Develop a full-stack web application for network management
- Provide real-time monitoring of network devices and servers

#### 1.3 Scope
This project covers:
- Department-wise VLAN configuration
- Device management with VLAN assignment
- Server monitoring and management
- Student Wi-Fi network management
- Network topology visualization

---

### 2. SYSTEM REQUIREMENTS

#### 2.1 Hardware Requirements
- Computer with minimum 4GB RAM
- 500MB free disk space
- Internet connection (for development)

#### 2.2 Software Requirements
- Node.js v14 or higher
- npm (Node Package Manager)
- Modern web browser (Chrome, Firefox, Edge)
- Text editor or IDE (VS Code recommended)

#### 2.3 Technologies Used
| Component | Technology |
|-----------|------------|
| Frontend | HTML5, CSS3, JavaScript |
| Backend | Node.js, Express.js |
| Database | SQLite |
| Authentication | bcrypt, express-session |

---

### 3. NETWORK DESIGN

#### 3.1 Network Architecture
The campus network follows a hierarchical three-tier architecture:

```
                    [INTERNET]
                        │
                   [CORE ROUTER]
                   192.168.1.1
                        │
              ┌─────────┼─────────┐
              │         │         │
        [L3 SWITCH]  [SERVER SW] [WIFI CTRL]
              │         │              │
    ┌────┬────┼────┬────┤         [ACCESS POINTS]
    │    │    │    │    │              │
   V10  V20  V30  V40  V50        [STUDENT WIFI]
  Admin  IT  Lab  Lib  Exam        VLAN 200
```

#### 3.2 VLAN Configuration

| VLAN ID | Name | IP Range | Subnet Mask | Gateway | Purpose |
|---------|------|----------|-------------|---------|---------|
| 10 | VLAN_ADMIN | 192.168.10.0/24 | 255.255.255.0 | 192.168.10.1 | Administration |
| 20 | VLAN_IT | 192.168.20.0/24 | 255.255.255.0 | 192.168.20.1 | IT Department |
| 30 | VLAN_LAB | 192.168.30.0/24 | 255.255.255.0 | 192.168.30.1 | Computer Lab |
| 40 | VLAN_LIBRARY | 192.168.40.0/24 | 255.255.255.0 | 192.168.40.1 | Library |
| 50 | VLAN_EXAM | 192.168.50.0/24 | 255.255.255.0 | 192.168.50.1 | Exam Cell |
| 60 | VLAN_FACULTY | 192.168.60.0/24 | 255.255.255.0 | 192.168.60.1 | Faculty |
| 100 | VLAN_SERVERS | 192.168.100.0/24 | 255.255.255.0 | 192.168.100.1 | Servers |
| 200 | VLAN_WIFI | 10.0.0.0/16 | 255.255.0.0 | 10.0.0.1 | Student Wi-Fi |

#### 3.3 Server Configuration

| Server Name | Type | IP Address | VLAN | Purpose |
|-------------|------|------------|------|---------|
| LIB-SERVER-01 | Library | 192.168.100.10 | 100 | Digital library resources |
| EXAM-SERVER-01 | Exam | 192.168.100.20 | 100 | Online examination system |
| WEB-SERVER-01 | Web | 192.168.100.30 | 100 | University website |
| DHCP-SERVER-01 | DHCP | 192.168.100.40 | 100 | IP address assignment |
| DNS-SERVER-01 | DNS | 192.168.100.50 | 100 | Domain name resolution |

#### 3.4 Benefits of VLAN Segmentation
1. **Security**: Isolates sensitive data between departments
2. **Performance**: Reduces broadcast traffic
3. **Management**: Easier network administration
4. **Flexibility**: Logical grouping of users

---

### 4. SYSTEM DESIGN

#### 4.1 Database Schema

**Departments Table**
```sql
CREATE TABLE departments (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    code TEXT UNIQUE,
    building TEXT,
    floor INTEGER
);
```

**VLANs Table**
```sql
CREATE TABLE vlans (
    id INTEGER PRIMARY KEY,  -- VLAN ID
    name TEXT NOT NULL,
    department_id INTEGER,
    ip_range TEXT,
    gateway TEXT,
    subnet_mask TEXT
);
```

**Devices Table**
```sql
CREATE TABLE devices (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT,
    mac_address TEXT UNIQUE,
    ip_address TEXT,
    vlan_id INTEGER,
    department_id INTEGER,
    status TEXT DEFAULT 'active'
);
```

**Servers Table**
```sql
CREATE TABLE servers (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT,
    ip_address TEXT,
    status TEXT,
    cpu_usage INTEGER,
    memory_usage INTEGER
);
```

#### 4.2 API Architecture

The system follows RESTful API design principles:

| Endpoint | Method | Description |
|----------|--------|-------------|
| /api/auth/login | POST | User authentication |
| /api/vlans | GET | Retrieve VLANs |
| /api/devices | GET, POST | Manage devices |
| /api/servers | GET | Monitor servers |
| /api/wifi/clients | GET | View Wi-Fi clients |
| /api/dashboard/stats | GET | Get statistics |

---

### 5. IMPLEMENTATION

#### 5.1 Project Structure
```
smart-campus-network/
├── frontend/          # Web interface
│   ├── *.html         # HTML pages
│   ├── css/           # Stylesheets
│   └── js/            # JavaScript files
├── backend/           # API server
│   ├── server.js      # Main server file
│   ├── routes/        # API routes
│   ├── models/        # Database models
│   └── middleware/    # Auth middleware
├── database/          # Database files
└── documentation/     # Project docs
```

#### 5.2 Key Features Implemented

1. **Admin Authentication**
   - Secure login with password hashing
   - Session management

2. **Dashboard**
   - Real-time statistics
   - Department overview with VLAN info

3. **Device Management**
   - CRUD operations for devices
   - VLAN assignment
   - Filtering and search

4. **Server Monitoring**
   - CPU, Memory, Disk usage
   - Start/Stop functionality
   - Status monitoring

5. **Wi-Fi Management**
   - Connected student tracking
   - Bandwidth monitoring
   - Disconnect capability

6. **Network Topology**
   - Visual diagram
   - Interactive elements
   - Real-time updates

---

### 6. SCREENSHOTS

The system includes the following pages:
1. Login Page - Secure admin authentication
2. Dashboard - Overview with statistics
3. Servers Page - Server monitoring
4. Devices Page - Device management
5. Wi-Fi Page - Student connectivity
6. Topology Page - Network diagram

---

### 7. TESTING

#### 7.1 Test Cases

| Test Case | Input | Expected Output | Result |
|-----------|-------|-----------------|--------|
| Login with valid credentials | admin/admin123 | Redirect to dashboard | Pass |
| Login with invalid password | admin/wrong | Error message | Pass |
| Add new device | Device details | Device added | Pass |
| Delete device | Device ID | Device removed | Pass |
| View VLANs | - | List of VLANs | Pass |
| Toggle server status | Server ID | Status changed | Pass |

---

### 8. CONCLUSION

#### 8.1 Summary
The Smart University Campus Network Management System successfully demonstrates:
- Effective network segmentation using VLANs
- Proper IP addressing for campus infrastructure
- Full-stack web development skills
- Database design and implementation

#### 8.2 Future Enhancements
- Real-time network monitoring with SNMP
- Integration with actual network equipment
- Bandwidth allocation controls
- Advanced security features
- Mobile application

---

### 9. REFERENCES

1. Cisco VLAN Configuration Guide
2. Node.js Documentation (nodejs.org)
3. Express.js Documentation
4. SQLite Documentation
5. Computer Networks by Andrew S. Tanenbaum

---

### APPENDIX

#### A. Installation Guide
See README.md for installation instructions.

#### B. Default Credentials
- Username: admin
- Password: admin123

#### C. API Documentation
See documentation/api_documentation.md
