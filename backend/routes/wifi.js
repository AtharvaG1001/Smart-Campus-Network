/**
 * Smart University Campus Network Management System
 * Wi-Fi Routes
 */

const express = require('express');
const router = express.Router();
const { runQuery, runStatement } = require('../models/database');
const { isAuthenticated } = require('../middleware/auth');

// GET /api/wifi/clients - Get all Wi-Fi clients
router.get('/clients', (req, res) => {
    try {
        const { status } = req.query;
        
        let sql = 'SELECT * FROM wifi_clients';
        const params = [];
        
        if (status) {
            sql += ' WHERE status = ?';
            params.push(status);
        }
        
        sql += ' ORDER BY connected_at DESC';
        
        const clients = runQuery(sql, params);
        
        res.json({
            success: true,
            data: clients,
            count: clients.length
        });
    } catch (error) {
        console.error('Error fetching Wi-Fi clients:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching Wi-Fi clients'
        });
    }
});

// GET /api/wifi/stats - Get Wi-Fi statistics
router.get('/stats', (req, res) => {
    try {
        const totalClients = runQuery('SELECT COUNT(*) as count FROM wifi_clients')[0].count;
        const connectedClients = runQuery('SELECT COUNT(*) as count FROM wifi_clients WHERE status = "connected"')[0].count;
        const disconnectedClients = runQuery('SELECT COUNT(*) as count FROM wifi_clients WHERE status = "disconnected"')[0].count;
        
        const totalBandwidth = runQuery('SELECT SUM(bandwidth_usage) as total FROM wifi_clients WHERE status = "connected"')[0].total || 0;
        const avgBandwidth = runQuery('SELECT AVG(bandwidth_usage) as avg FROM wifi_clients WHERE status = "connected"')[0].avg || 0;
        const avgSignal = runQuery('SELECT AVG(signal_strength) as avg FROM wifi_clients WHERE status = "connected"')[0].avg || 0;
        
        const byDeviceType = runQuery(`
            SELECT device_type, COUNT(*) as count, SUM(bandwidth_usage) as bandwidth
            FROM wifi_clients 
            WHERE status = "connected"
            GROUP BY device_type
            ORDER BY count DESC
        `);
        
        const topBandwidth = runQuery(`
            SELECT student_id, student_name, device_type, bandwidth_usage
            FROM wifi_clients 
            WHERE status = "connected"
            ORDER BY bandwidth_usage DESC
            LIMIT 5
        `);
        
        res.json({
            success: true,
            data: {
                total_clients: totalClients,
                connected: connectedClients,
                disconnected: disconnectedClients,
                total_bandwidth: Math.round(totalBandwidth * 100) / 100,
                avg_bandwidth: Math.round(avgBandwidth * 100) / 100,
                avg_signal: Math.round(avgSignal),
                by_device_type: byDeviceType,
                top_bandwidth_users: topBandwidth
            }
        });
    } catch (error) {
        console.error('Error fetching Wi-Fi stats:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching Wi-Fi statistics'
        });
    }
});

// GET /api/wifi/clients/:id - Get client by ID
router.get('/clients/:id', (req, res) => {
    try {
        const clients = runQuery('SELECT * FROM wifi_clients WHERE id = ?', [req.params.id]);
        
        if (clients.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Client not found'
            });
        }
        
        res.json({
            success: true,
            data: clients[0]
        });
    } catch (error) {
        console.error('Error fetching Wi-Fi client:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching client'
        });
    }
});

// POST /api/wifi/disconnect/:id - Disconnect a client
router.post('/disconnect/:id', isAuthenticated, (req, res) => {
    try {
        const existing = runQuery('SELECT * FROM wifi_clients WHERE id = ?', [req.params.id]);
        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Client not found'
            });
        }
        
        if (existing[0].status === 'disconnected') {
            return res.status(400).json({
                success: false,
                message: 'Client is already disconnected'
            });
        }
        
        runStatement(`
            UPDATE wifi_clients 
            SET status = "disconnected", last_activity = datetime("now")
            WHERE id = ?
        `, [req.params.id]);
        
        res.json({
            success: true,
            message: `Client ${existing[0].student_name} disconnected successfully`
        });
    } catch (error) {
        console.error('Error disconnecting client:', error);
        res.status(500).json({
            success: false,
            message: 'Error disconnecting client'
        });
    }
});

// POST /api/wifi/reconnect/:id - Reconnect a client
router.post('/reconnect/:id', isAuthenticated, (req, res) => {
    try {
        const existing = runQuery('SELECT * FROM wifi_clients WHERE id = ?', [req.params.id]);
        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Client not found'
            });
        }
        
        if (existing[0].status === 'connected') {
            return res.status(400).json({
                success: false,
                message: 'Client is already connected'
            });
        }
        
        runStatement(`
            UPDATE wifi_clients 
            SET status = "connected", connected_at = datetime("now"), last_activity = datetime("now")
            WHERE id = ?
        `, [req.params.id]);
        
        res.json({
            success: true,
            message: `Client ${existing[0].student_name} reconnected successfully`
        });
    } catch (error) {
        console.error('Error reconnecting client:', error);
        res.status(500).json({
            success: false,
            message: 'Error reconnecting client'
        });
    }
});

// POST /api/wifi/simulate - Simulate Wi-Fi activity
router.post('/simulate', isAuthenticated, (req, res) => {
    try {
        // Update bandwidth for connected clients randomly
        const clients = runQuery('SELECT id, bandwidth_usage FROM wifi_clients WHERE status = "connected"');
        
        clients.forEach(client => {
            const newBandwidth = Math.max(0.5, client.bandwidth_usage + (Math.random() * 4 - 2));
            runStatement('UPDATE wifi_clients SET bandwidth_usage = ?, last_activity = datetime("now") WHERE id = ?', 
                [Math.round(newBandwidth * 10) / 10, client.id]);
        });
        
        res.json({
            success: true,
            message: 'Wi-Fi activity simulated',
            updated_clients: clients.length
        });
    } catch (error) {
        console.error('Error simulating Wi-Fi:', error);
        res.status(500).json({
            success: false,
            message: 'Error simulating Wi-Fi activity'
        });
    }
});

module.exports = router;
