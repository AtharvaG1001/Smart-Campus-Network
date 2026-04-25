/**
 * Smart University Campus Network Management System
 * Server Routes
 */

const express = require('express');
const router = express.Router();
const { runQuery, runStatement } = require('../models/database');
const { isAuthenticated } = require('../middleware/auth');

// GET /api/servers - Get all servers
router.get('/', (req, res) => {
    try {
        const servers = runQuery(`
            SELECT s.*, v.name as vlan_name
            FROM servers s
            LEFT JOIN vlans v ON s.vlan_id = v.id
            ORDER BY s.name
        `);
        
        res.json({
            success: true,
            data: servers
        });
    } catch (error) {
        console.error('Error fetching servers:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching servers'
        });
    }
});

// GET /api/servers/stats - Get server statistics
router.get('/stats', (req, res) => {
    try {
        const totalServers = runQuery('SELECT COUNT(*) as count FROM servers')[0].count;
        const onlineServers = runQuery('SELECT COUNT(*) as count FROM servers WHERE status = "online"')[0].count;
        const offlineServers = runQuery('SELECT COUNT(*) as count FROM servers WHERE status = "offline"')[0].count;
        const maintenanceServers = runQuery('SELECT COUNT(*) as count FROM servers WHERE status = "maintenance"')[0].count;
        
        const avgCpu = runQuery('SELECT AVG(cpu_usage) as avg FROM servers WHERE status = "online"')[0].avg || 0;
        const avgMemory = runQuery('SELECT AVG(memory_usage) as avg FROM servers WHERE status = "online"')[0].avg || 0;
        const avgDisk = runQuery('SELECT AVG(disk_usage) as avg FROM servers WHERE status = "online"')[0].avg || 0;
        
        const byType = runQuery(`
            SELECT type, COUNT(*) as count, 
                   AVG(cpu_usage) as avg_cpu, 
                   AVG(memory_usage) as avg_memory
            FROM servers 
            GROUP BY type
        `);
        
        res.json({
            success: true,
            data: {
                total: totalServers,
                online: onlineServers,
                offline: offlineServers,
                maintenance: maintenanceServers,
                avg_cpu: Math.round(avgCpu),
                avg_memory: Math.round(avgMemory),
                avg_disk: Math.round(avgDisk),
                by_type: byType
            }
        });
    } catch (error) {
        console.error('Error fetching server stats:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching server statistics'
        });
    }
});

// GET /api/servers/:id - Get server by ID
router.get('/:id', (req, res) => {
    try {
        const servers = runQuery(`
            SELECT s.*, v.name as vlan_name, v.ip_range as vlan_ip_range
            FROM servers s
            LEFT JOIN vlans v ON s.vlan_id = v.id
            WHERE s.id = ?
        `, [req.params.id]);
        
        if (servers.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Server not found'
            });
        }
        
        res.json({
            success: true,
            data: servers[0]
        });
    } catch (error) {
        console.error('Error fetching server:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching server'
        });
    }
});

// PUT /api/servers/:id/status - Update server status
router.put('/:id/status', isAuthenticated, (req, res) => {
    try {
        const { status } = req.body;
        
        if (!['online', 'offline', 'maintenance'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Must be online, offline, or maintenance'
            });
        }
        
        const existing = runQuery('SELECT id FROM servers WHERE id = ?', [req.params.id]);
        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Server not found'
            });
        }
        
        runStatement(`
            UPDATE servers 
            SET status = ?, last_updated = datetime("now")
            WHERE id = ?
        `, [status, req.params.id]);
        
        res.json({
            success: true,
            message: `Server status updated to ${status}`
        });
    } catch (error) {
        console.error('Error updating server status:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating server status'
        });
    }
});

// PUT /api/servers/:id - Update server details
router.put('/:id', isAuthenticated, (req, res) => {
    try {
        const { name, type, ip_address, mac_address, vlan_id, status, cpu_usage, memory_usage, disk_usage, os_type } = req.body;
        
        const existing = runQuery('SELECT id FROM servers WHERE id = ?', [req.params.id]);
        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Server not found'
            });
        }
        
        runStatement(`
            UPDATE servers 
            SET name = COALESCE(?, name),
                type = COALESCE(?, type),
                ip_address = COALESCE(?, ip_address),
                mac_address = COALESCE(?, mac_address),
                vlan_id = COALESCE(?, vlan_id),
                status = COALESCE(?, status),
                cpu_usage = COALESCE(?, cpu_usage),
                memory_usage = COALESCE(?, memory_usage),
                disk_usage = COALESCE(?, disk_usage),
                os_type = COALESCE(?, os_type),
                last_updated = datetime("now")
            WHERE id = ?
        `, [name, type, ip_address, mac_address, vlan_id, status, cpu_usage, memory_usage, disk_usage, os_type, req.params.id]);
        
        res.json({
            success: true,
            message: 'Server updated successfully'
        });
    } catch (error) {
        console.error('Error updating server:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating server'
        });
    }
});

// POST /api/servers/:id/simulate - Simulate server metrics update
router.post('/:id/simulate', isAuthenticated, (req, res) => {
    try {
        const existing = runQuery('SELECT * FROM servers WHERE id = ?', [req.params.id]);
        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Server not found'
            });
        }
        
        // Simulate random metric changes
        const server = existing[0];
        if (server.status === 'online') {
            const newCpu = Math.min(100, Math.max(5, server.cpu_usage + (Math.random() * 20 - 10)));
            const newMemory = Math.min(100, Math.max(10, server.memory_usage + (Math.random() * 10 - 5)));
            const newUptime = server.uptime_hours + 1;
            
            runStatement(`
                UPDATE servers 
                SET cpu_usage = ?, memory_usage = ?, uptime_hours = ?, last_updated = datetime("now")
                WHERE id = ?
            `, [Math.round(newCpu), Math.round(newMemory), newUptime, req.params.id]);
        }
        
        const updated = runQuery('SELECT * FROM servers WHERE id = ?', [req.params.id]);
        
        res.json({
            success: true,
            message: 'Server metrics simulated',
            data: updated[0]
        });
    } catch (error) {
        console.error('Error simulating server:', error);
        res.status(500).json({
            success: false,
            message: 'Error simulating server metrics'
        });
    }
});

module.exports = router;
