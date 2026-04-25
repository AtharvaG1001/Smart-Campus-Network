# API Documentation

## Smart University Campus Network Management System

### Base URL
```
http://localhost:3000/api
```

### Authentication

All protected routes require a valid session. First authenticate using the login endpoint.

---

## Authentication Endpoints

### POST /auth/login

Login to the system.

**Request Body:**
```json
{
    "username": "admin",
    "password": "admin123"
}
```

**Response (Success):**
```json
{
    "success": true,
    "message": "Login successful",
    "user": {
        "id": 1,
        "username": "admin",
        "full_name": "System Administrator",
        "email": "admin@smartcampus.edu"
    }
}
```

**Response (Error):**
```json
{
    "success": false,
    "message": "Invalid username or password"
}
```

### POST /auth/logout

Logout from the system.

**Response:**
```json
{
    "success": true,
    "message": "Logged out successfully"
}
```

### GET /auth/verify

Verify current session.

**Response:**
```json
{
    "success": true,
    "authenticated": true,
    "user": {
        "id": 1,
        "username": "admin",
        "full_name": "System Administrator",
        "role": "admin"
    }
}
```

---

## VLAN Endpoints

### GET /vlans

Get all VLANs with device counts.

**Response:**
```json
{
    "success": true,
    "data": [
        {
            "id": 10,
            "name": "VLAN_ADMIN",
            "department_id": 1,
            "department_name": "Administration",
            "ip_range": "192.168.10.0/24",
            "gateway": "192.168.10.1",
            "subnet_mask": "255.255.255.0",
            "description": "Administration Network",
            "is_active": 1,
            "device_count": 3
        }
    ]
}
```

### GET /vlans/:id

Get a specific VLAN with its devices.

**Response:**
```json
{
    "success": true,
    "data": {
        "id": 10,
        "name": "VLAN_ADMIN",
        "ip_range": "192.168.10.0/24",
        "devices": [
            {
                "id": 1,
                "name": "ADMIN-PC-01",
                "ip_address": "192.168.10.10"
            }
        ]
    }
}
```

### POST /vlans (Protected)

Create a new VLAN.

**Request Body:**
```json
{
    "id": 70,
    "name": "VLAN_NEW",
    "department_id": 1,
    "ip_range": "192.168.70.0/24",
    "gateway": "192.168.70.1",
    "subnet_mask": "255.255.255.0",
    "description": "New VLAN"
}
```

### PUT /vlans/:id (Protected)

Update a VLAN.

### DELETE /vlans/:id (Protected)

Delete a VLAN (only if no devices connected).

---

## Device Endpoints

### GET /devices

Get all devices with optional filters.

**Query Parameters:**
- `vlan_id` - Filter by VLAN
- `department_id` - Filter by department
- `type` - Filter by device type (PC, Laptop, Printer, etc.)
- `status` - Filter by status (active, inactive)

**Response:**
```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "name": "ADMIN-PC-01",
            "type": "PC",
            "mac_address": "00:11:22:33:44:01",
            "ip_address": "192.168.10.10",
            "vlan_id": 10,
            "vlan_name": "VLAN_ADMIN",
            "department_id": 1,
            "department_name": "Administration",
            "location": "Admin Office - Room 101",
            "status": "active",
            "connected_port": "SW1-Fa0/1"
        }
    ],
    "count": 23
}
```

### GET /devices/stats

Get device statistics.

**Response:**
```json
{
    "success": true,
    "data": {
        "total": 23,
        "active": 21,
        "inactive": 2,
        "by_type": [
            { "type": "PC", "count": 15 },
            { "type": "Laptop", "count": 3 }
        ],
        "by_vlan": [
            { "vlan_id": 30, "vlan_name": "VLAN_LAB", "device_count": 6 }
        ]
    }
}
```

### GET /devices/:id

Get a specific device.

### POST /devices (Protected)

Add a new device.

**Request Body:**
```json
{
    "name": "NEW-PC-01",
    "type": "PC",
    "mac_address": "00:11:22:33:44:FF",
    "ip_address": "192.168.10.50",
    "vlan_id": 10,
    "department_id": 1,
    "location": "Room 105",
    "status": "active",
    "connected_port": "SW1-Fa0/15"
}
```

### PUT /devices/:id (Protected)

Update a device.

### DELETE /devices/:id (Protected)

Delete a device.

---

## Server Endpoints

### GET /servers

Get all servers.

**Response:**
```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "name": "LIB-SERVER-01",
            "type": "Library",
            "ip_address": "192.168.100.10",
            "mac_address": "AA:BB:CC:DD:EE:01",
            "vlan_id": 100,
            "status": "online",
            "cpu_usage": 35,
            "memory_usage": 48,
            "disk_usage": 62,
            "uptime_hours": 720,
            "os_type": "Ubuntu Server 22.04"
        }
    ]
}
```

### GET /servers/stats

Get server statistics.

**Response:**
```json
{
    "success": true,
    "data": {
        "total": 5,
        "online": 5,
        "offline": 0,
        "maintenance": 0,
        "avg_cpu": 26,
        "avg_memory": 39,
        "avg_disk": 36
    }
}
```

### PUT /servers/:id/status (Protected)

Update server status.

**Request Body:**
```json
{
    "status": "offline"
}
```

**Valid status values:** `online`, `offline`, `maintenance`

### POST /servers/:id/simulate (Protected)

Simulate server metric changes (for demo purposes).

---

## Wi-Fi Endpoints

### GET /wifi/clients

Get Wi-Fi clients.

**Query Parameters:**
- `status` - Filter by status (connected, disconnected)

**Response:**
```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "student_id": "STU001",
            "student_name": "Rahul Sharma",
            "device_name": "Rahul-iPhone",
            "device_type": "Phone",
            "mac_address": "AA:11:22:33:44:01",
            "ip_address": "10.0.1.10",
            "signal_strength": -45,
            "bandwidth_usage": 2.5,
            "status": "connected"
        }
    ],
    "count": 12
}
```

### GET /wifi/stats

Get Wi-Fi statistics.

**Response:**
```json
{
    "success": true,
    "data": {
        "total_clients": 12,
        "connected": 10,
        "disconnected": 2,
        "total_bandwidth": 95.8,
        "avg_bandwidth": 9.58,
        "avg_signal": -51,
        "by_device_type": [
            { "device_type": "Phone", "count": 5, "bandwidth": 12.3 },
            { "device_type": "Laptop", "count": 4, "bandwidth": 78.2 }
        ],
        "top_bandwidth_users": []
    }
}
```

### POST /wifi/disconnect/:id (Protected)

Disconnect a Wi-Fi client.

### POST /wifi/reconnect/:id (Protected)

Reconnect a Wi-Fi client.

---

## Dashboard Endpoints

### GET /dashboard/stats

Get overall dashboard statistics.

**Response:**
```json
{
    "success": true,
    "data": {
        "devices": { "total": 23, "active": 21, "inactive": 2 },
        "vlans": { "total": 8, "active": 8 },
        "servers": { "total": 5, "online": 5, "offline": 0 },
        "wifi": { "connected_students": 10, "total_bandwidth": 95.8 },
        "departments": 6,
        "recent_devices": []
    }
}
```

### GET /dashboard/departments

Get departments with VLAN information.

### GET /dashboard/topology

Get network topology data.

---

## Error Responses

All endpoints return errors in this format:

```json
{
    "success": false,
    "message": "Error description"
}
```

### HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Server Error |
