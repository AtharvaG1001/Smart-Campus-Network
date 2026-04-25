# Smart University Campus Network Management System

## 🎨 **NEW: Futuristic Modern UI!**
This project now features a **cutting-edge cyberpunk-inspired interface** with:
- 🌌 Animated grid backgrounds and scanline effects
- ✨ Neon glow effects throughout
- 🎭 Glassmorphism design with backdrop blur
- 🚀 Smooth animations on all interactions
- 💫 Floating icons and pulsing status indicators

See [UI Enhancement Guide](documentation/UI_ENHANCEMENT.md) for details!

---

A web-based dashboard system for managing a Smart University Campus Network with VLAN separation, server management, device tracking, and network topology visualization.

## 🎯 Project Overview

This project demonstrates Computer Networks concepts including:
- **VLAN Configuration** - Network segmentation for different departments
- **IP Addressing** - Proper IP address planning and assignment
- **Server Management** - Monitoring and managing campus servers
- **Wi-Fi Network** - Separate student Wi-Fi network management
- **Network Topology** - Visual representation of network architecture

## 📁 Project Structure

```
smart-campus-network/
│
├── frontend/                    # Frontend web application
│   ├── index.html              # Login page
│   ├── dashboard.html          # Main dashboard
│   ├── servers.html            # Server management
│   ├── devices.html            # Device management
│   ├── wifi.html               # Student Wi-Fi
│   ├── topology.html           # Network topology
│   ├── css/
│   │   └── style.css           # Stylesheet
│   └── js/
│       ├── auth.js             # Authentication
│       ├── dashboard.js        # Dashboard logic
│       ├── servers.js          # Server management
│       ├── devices.js          # Device management
│       ├── wifi.js             # Wi-Fi management
│       └── topology.js         # Topology visualization
│
├── backend/                     # Backend API server
│   ├── server.js               # Express server
│   ├── package.json            # Dependencies
│   ├── routes/                 # API routes
│   │   ├── auth.js
│   │   ├── vlans.js
│   │   ├── devices.js
│   │   ├── servers.js
│   │   ├── wifi.js
│   │   └── dashboard.js
│   ├── models/
│   │   └── database.js         # SQLite database
│   └── middleware/
│       └── auth.js             # Auth middleware
│
├── database/                    # Database files
│   ├── schema.sql              # Database schema
│   └── seed.sql                # Sample data
│
├── documentation/              # Project documentation
│   ├── project_report.md       # Full project report
│   └── api_documentation.md    # API documentation
│
├── packet-tracer/              # Cisco Packet Tracer guide
│   └── campus_network_guide.md
│
└── README.md                   # This file
```

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Node.js, Express.js
- **Database**: SQLite (using sql.js)
- **Authentication**: Session-based with bcrypt

## 🎓 VIVA DEMO GUIDE (How to Present)

**Follow these exact steps to successfully demonstrate your project during the viva:**

### 1. How to start the server
Open your terminal/command prompt and run:
```bash
cd backend
npm install
npm run dev
```
Wait to see the message: `Server running on http://localhost:3000`

### 2. How to login
1. Open your web browser and go to: `http://localhost:3000`
2. You will see the futuristic login screen.
3. Enter the default credentials:
   - **Username**: `admin`
   - **Password**: `admin123`
4. Click "Sign In" to access the dashboard.

### 3. How this connects to Packet Tracer (VIVA EXPLANATION)
When the examiner asks how this relates to Computer Networks, explain:
> *"This dashboard simulates the physical hardware we designed in Cisco Packet Tracer. In PT, we created the topology with switches, routers, and PCs. This web portal acts like a network controller software (similar to Cisco DNA Center) where we can monitor those same VLANs, IP addresses, and manage the connected End Systems in real-time."*

- **VLANs** map to your Department blocks in Packet Tracer.
- **Devices** (PC-1, Laptop-1) match the End Systems connected to your switches.
- **Servers** are your configured network services (DHCP, DNS) providing features to the network.

### 4. How to show data in dashboard
1. Point out the **Dashboard Stats** showing live active devices and VLANs.
2. Show the **"Cisco Packet Tracer Integration"** panel at the top to reinforce the concept.
3. Navigate to the **Servers Tab** to show that standard network services (DHCP, DNS, Library Database) are running.

### 5. How to add devices (Live Demo)
Show the "Add Device" functionality working live:
1. Go to the **Devices** tab from the left sidebar.
2. Click the bright blue **"Add Device"** button at the top right.
3. Fill in the requested details (e.g., Name: `LAB-PC-99`, Type: `PC`, Status: `Active`).
4. Click **Save Device**.
5. You will see a successful toast notification popup, and the new device will instantly appear in the devices table.

## 📊 Features

### 1. Dashboard
- Overview statistics (devices, VLANs, servers, Wi-Fi clients)
- Department cards with VLAN information
- Recent network activity

### 2. Server Management
- Monitor 5 campus servers (Library, Exam, Web, DHCP, DNS)
- View CPU, Memory, and Disk usage
- Start/Stop servers
- Simulate server metrics

### 3. Device Management
- View all network devices
- Add, edit, delete devices
- Assign VLANs and IP addresses
- Filter by VLAN, type, or status

### 4. Student Wi-Fi
- View connected students
- Monitor bandwidth usage
- Disconnect/reconnect clients
- Device type breakdown

### 5. Network Topology
- Visual diagram of campus network
- VLANs, servers, switches, access points
- Real-time device counts

## 🌐 Network Configuration

### VLANs

| VLAN ID | Name | IP Range | Department |
|---------|------|----------|------------|
| 10 | VLAN_ADMIN | 192.168.10.0/24 | Administration |
| 20 | VLAN_IT | 192.168.20.0/24 | IT Department |
| 30 | VLAN_LAB | 192.168.30.0/24 | Computer Lab |
| 40 | VLAN_LIBRARY | 192.168.40.0/24 | Library |
| 50 | VLAN_EXAM | 192.168.50.0/24 | Exam Cell |
| 60 | VLAN_FACULTY | 192.168.60.0/24 | Faculty Block |
| 100 | VLAN_SERVERS | 192.168.100.0/24 | Server Room |
| 200 | VLAN_WIFI | 10.0.0.0/16 | Student Wi-Fi |

### Servers

| Server | Type | IP Address |
|--------|------|------------|
| LIB-SERVER-01 | Library | 192.168.100.10 |
| EXAM-SERVER-01 | Exam | 192.168.100.20 |
| WEB-SERVER-01 | Web | 192.168.100.30 |
| DHCP-SERVER-01 | DHCP | 192.168.100.40 |
| DNS-SERVER-01 | DNS | 192.168.100.50 |

## 📚 API Endpoints

See [API Documentation](documentation/api_documentation.md) for complete API reference.

### Quick Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/login | Admin login |
| GET | /api/vlans | Get all VLANs |
| GET | /api/devices | Get all devices |
| POST | /api/devices | Add new device |
| GET | /api/servers | Get all servers |
| GET | /api/wifi/clients | Get Wi-Fi clients |
| GET | /api/dashboard/stats | Get dashboard stats |

## 🎓 Learning Outcomes

This project demonstrates understanding of:

1. **Network Segmentation using VLANs**
   - Separating network traffic by department
   - Improved security and performance

2. **IP Address Planning**
   - Subnet design and allocation
   - Gateway configuration

3. **Network Services**
   - DHCP for automatic IP assignment
   - DNS for name resolution

4. **Network Architecture**
   - Core, distribution, and access layers
   - Server placement and management

5. **Full-Stack Development**
   - RESTful API design
   - Database management
   - Frontend development

## 📄 License

This project is created for educational purposes as part of a Computer Networks mini project.

## 👨‍💻 Author

Atharva Gaikwad 

THANK YOU
