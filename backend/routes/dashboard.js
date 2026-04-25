/**
 * Smart University Campus Network Management System
 * Dashboard Routes
 */

const express = require('express');
const router = express.Router();
const { runQuery } = require('../models/database');

// GET /api/dashboard/stats - Get overall dashboard statistics
router.get('/stats', (req, res) => {
    try {
        // Device statistics
        const totalDevices = runQuery('SELECT COUNT(*) as count FROM devices')[0].count;
        const activeDevices = runQuery('SELECT COUNT(*) as count FROM devices WHERE status = "active"')[0].count;
        
        // VLAN statistics
        const totalVlans = runQuery('SELECT COUNT(*) as count FROM vlans')[0].count;
        const activeVlans = runQuery('SELECT COUNT(*) as count FROM vlans WHERE is_active = 1')[0].count;
        
        // Server statistics
        const totalServers = runQuery('SELECT COUNT(*) as count FROM servers')[0].count;
        const onlineServers = runQuery('SELECT COUNT(*) as count FROM servers WHERE status = "online"')[0].count;
        
        // Wi-Fi statistics
        const connectedStudents = runQuery('SELECT COUNT(*) as count FROM wifi_clients WHERE status = "connected"')[0].count;
        const totalBandwidth = runQuery('SELECT SUM(bandwidth_usage) as total FROM wifi_clients WHERE status = "connected"')[0].total || 0;
        
        // Department statistics
        const totalDepartments = runQuery('SELECT COUNT(*) as count FROM departments')[0].count;
        
        // Recent activity (simulated)
        const recentDevices = runQuery(`
            SELECT name, type, status, ip_address, last_seen 
            FROM devices 
            ORDER BY last_seen DESC 
            LIMIT 5
        `);
        
        res.json({
            success: true,
            data: {
                devices: {
                    total: totalDevices,
                    active: activeDevices,
                    inactive: totalDevices - activeDevices
                },
                vlans: {
                    total: totalVlans,
                    active: activeVlans
                },
                servers: {
                    total: totalServers,
                    online: onlineServers,
                    offline: totalServers - onlineServers
                },
                wifi: {
                    connected_students: connectedStudents,
                    total_bandwidth: Math.round(totalBandwidth * 100) / 100
                },
                departments: totalDepartments,
                recent_devices: recentDevices
            }
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching dashboard statistics'
        });
    }
});

// GET /api/dashboard/departments - Get departments with VLAN info
router.get('/departments', (req, res) => {
    try {
        const departments = runQuery(`
            SELECT 
                d.id, d.name, d.code, d.building, d.floor, d.head_name, d.contact_email,
                v.id as vlan_id, v.name as vlan_name, v.ip_range, v.gateway,
                (SELECT COUNT(*) FROM devices WHERE department_id = d.id) as device_count,
                (SELECT COUNT(*) FROM devices WHERE department_id = d.id AND status = 'active') as active_devices
            FROM departments d
            LEFT JOIN vlans v ON v.department_id = d.id
            ORDER BY d.id
        `);
        
        res.json({
            success: true,
            data: departments
        });
    } catch (error) {
        console.error('Error fetching departments:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching departments'
        });
    }
});

// GET /api/dashboard/topology - Get network topology data
router.get('/topology', (req, res) => {
    try {
        // Get all VLANs
        const vlans = runQuery(`
            SELECT id, name, ip_range, gateway, 
                   (SELECT COUNT(*) FROM devices WHERE vlan_id = vlans.id) as device_count
            FROM vlans 
            WHERE is_active = 1
            ORDER BY id
        `);
        
        // Get servers
        const servers = runQuery(`
            SELECT id, name, type, ip_address, status, vlan_id
            FROM servers
            ORDER BY name
        `);
        
        // Get network infrastructure devices
        const infrastructure = runQuery(`
            SELECT id, name, type, ip_address, status, vlan_id
            FROM devices 
            WHERE type IN ('Router', 'Switch', 'Access Point')
            ORDER BY type, name
        `);
        
        // Get device counts by department
        const departmentDevices = runQuery(`
            SELECT d.id, d.name, d.code, COUNT(dev.id) as device_count
            FROM departments d
            LEFT JOIN devices dev ON dev.department_id = d.id
            GROUP BY d.id
            ORDER BY d.id
        `);
        
        // Build topology structure
        const topology = {
            core: {
                router: infrastructure.find(d => d.type === 'Router') || { name: 'CORE-ROUTER-01', ip_address: '192.168.1.1' },
                switches: infrastructure.filter(d => d.type === 'Switch'),
                access_points: infrastructure.filter(d => d.type === 'Access Point')
            },
            vlans: vlans.map(vlan => ({
                ...vlan,
                servers: servers.filter(s => s.vlan_id === vlan.id),
                department: departmentDevices.find(d => {
                    const deptVlan = runQuery('SELECT id FROM vlans WHERE department_id = ?', [d.id]);
                    return deptVlan.length > 0 && deptVlan[0].id === vlan.id;
                })
            })),
            servers,
            total_devices: runQuery('SELECT COUNT(*) as count FROM devices')[0].count,
            wifi_clients: runQuery('SELECT COUNT(*) as count FROM wifi_clients WHERE status = "connected"')[0].count
        };
        
        res.json({
            success: true,
            data: topology
        });
    } catch (error) {
        console.error('Error fetching topology:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching network topology'
        });
    }
});

// GET /api/departments - Get all departments
router.get('/all-departments', (req, res) => {
    try {
        const departments = runQuery('SELECT * FROM departments ORDER BY name');
        
        res.json({
            success: true,
            data: departments
        });
    } catch (error) {
        console.error('Error fetching departments:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching departments'
        });
    }
});

module.exports = router;
