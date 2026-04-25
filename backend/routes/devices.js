/**
 * Smart University Campus Network Management System
 * Device Routes
 */

const express = require('express');
const router = express.Router();
const { runQuery, runStatement, getLastInsertId } = require('../models/database');
const { isAuthenticated } = require('../middleware/auth');

// GET /api/devices - Get all devices
router.get('/', (req, res) => {
    try {
        const { vlan_id, department_id, type, status } = req.query;
        
        let sql = `
            SELECT d.*, v.name as vlan_name, v.ip_range as vlan_ip_range,
                   dept.name as department_name, dept.code as department_code
            FROM devices d
            LEFT JOIN vlans v ON d.vlan_id = v.id
            LEFT JOIN departments dept ON d.department_id = dept.id
            WHERE 1=1
        `;
        const params = [];
        
        if (vlan_id) {
            sql += ' AND d.vlan_id = ?';
            params.push(vlan_id);
        }
        if (department_id) {
            sql += ' AND d.department_id = ?';
            params.push(department_id);
        }
        if (type) {
            sql += ' AND d.type = ?';
            params.push(type);
        }
        if (status) {
            sql += ' AND d.status = ?';
            params.push(status);
        }
        
        sql += ' ORDER BY d.name';
        
        const devices = runQuery(sql, params);
        
        res.json({
            success: true,
            data: devices,
            count: devices.length
        });
    } catch (error) {
        console.error('Error fetching devices:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching devices'
        });
    }
});

// GET /api/devices/stats - Get device statistics
router.get('/stats', (req, res) => {
    try {
        const totalDevices = runQuery('SELECT COUNT(*) as count FROM devices')[0].count;
        const activeDevices = runQuery('SELECT COUNT(*) as count FROM devices WHERE status = "active"')[0].count;
        const inactiveDevices = runQuery('SELECT COUNT(*) as count FROM devices WHERE status = "inactive"')[0].count;
        
        const byType = runQuery(`
            SELECT type, COUNT(*) as count 
            FROM devices 
            GROUP BY type 
            ORDER BY count DESC
        `);
        
        const byVlan = runQuery(`
            SELECT v.id as vlan_id, v.name as vlan_name, COUNT(d.id) as device_count
            FROM vlans v
            LEFT JOIN devices d ON v.id = d.vlan_id
            GROUP BY v.id
            ORDER BY device_count DESC
        `);
        
        res.json({
            success: true,
            data: {
                total: totalDevices,
                active: activeDevices,
                inactive: inactiveDevices,
                by_type: byType,
                by_vlan: byVlan
            }
        });
    } catch (error) {
        console.error('Error fetching device stats:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching device statistics'
        });
    }
});

// GET /api/devices/vlan/:vlanId - Get devices by VLAN
router.get('/vlan/:vlanId', (req, res) => {
    try {
        const devices = runQuery(`
            SELECT d.*, dept.name as department_name
            FROM devices d
            LEFT JOIN departments dept ON d.department_id = dept.id
            WHERE d.vlan_id = ?
            ORDER BY d.name
        `, [req.params.vlanId]);
        
        res.json({
            success: true,
            data: devices,
            count: devices.length
        });
    } catch (error) {
        console.error('Error fetching devices by VLAN:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching devices'
        });
    }
});

// GET /api/devices/:id - Get device by ID
router.get('/:id', (req, res) => {
    try {
        const devices = runQuery(`
            SELECT d.*, v.name as vlan_name, v.ip_range as vlan_ip_range,
                   dept.name as department_name, dept.code as department_code
            FROM devices d
            LEFT JOIN vlans v ON d.vlan_id = v.id
            LEFT JOIN departments dept ON d.department_id = dept.id
            WHERE d.id = ?
        `, [req.params.id]);
        
        if (devices.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Device not found'
            });
        }
        
        res.json({
            success: true,
            data: devices[0]
        });
    } catch (error) {
        console.error('Error fetching device:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching device'
        });
    }
});

// POST /api/devices - Add new device
router.post('/', isAuthenticated, (req, res) => {
    try {
        const { name, type, mac_address, ip_address, vlan_id, department_id, location, status, connected_port } = req.body;
        
        if (!name || !type) {
            return res.status(400).json({
                success: false,
                message: 'Device name and type are required'
            });
        }
        
        // Check for duplicate MAC address
        if (mac_address) {
            const existing = runQuery('SELECT id FROM devices WHERE mac_address = ?', [mac_address]);
            if (existing.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'MAC address already exists'
                });
            }
        }
        
        runStatement(`
            INSERT INTO devices (name, type, mac_address, ip_address, vlan_id, department_id, location, status, connected_port)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [name, type, mac_address || null, ip_address || null, vlan_id || null, department_id || null, location || null, status || 'active', connected_port || null]);
        
        const newId = getLastInsertId();
        
        res.status(201).json({
            success: true,
            message: 'Device added successfully',
            data: { id: newId }
        });
    } catch (error) {
        console.error('Error adding device:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding device'
        });
    }
});

// PUT /api/devices/:id - Update device
router.put('/:id', isAuthenticated, (req, res) => {
    try {
        const { name, type, mac_address, ip_address, vlan_id, department_id, location, status, connected_port } = req.body;
        
        const existing = runQuery('SELECT id FROM devices WHERE id = ?', [req.params.id]);
        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Device not found'
            });
        }
        
        // Check for duplicate MAC address (excluding current device)
        if (mac_address) {
            const duplicate = runQuery('SELECT id FROM devices WHERE mac_address = ? AND id != ?', [mac_address, req.params.id]);
            if (duplicate.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'MAC address already exists'
                });
            }
        }
        
        runStatement(`
            UPDATE devices 
            SET name = COALESCE(?, name),
                type = COALESCE(?, type),
                mac_address = COALESCE(?, mac_address),
                ip_address = COALESCE(?, ip_address),
                vlan_id = ?,
                department_id = ?,
                location = COALESCE(?, location),
                status = COALESCE(?, status),
                connected_port = COALESCE(?, connected_port),
                last_seen = datetime("now")
            WHERE id = ?
        `, [name, type, mac_address, ip_address, vlan_id, department_id, location, status, connected_port, req.params.id]);
        
        res.json({
            success: true,
            message: 'Device updated successfully'
        });
    } catch (error) {
        console.error('Error updating device:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating device'
        });
    }
});

// DELETE /api/devices/:id - Delete device
router.delete('/:id', isAuthenticated, (req, res) => {
    try {
        const result = runStatement('DELETE FROM devices WHERE id = ?', [req.params.id]);
        
        if (result === 0) {
            return res.status(404).json({
                success: false,
                message: 'Device not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Device deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting device:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting device'
        });
    }
});

module.exports = router;
