/**
 * Smart University Campus Network Management System
 * VLAN Routes
 */

const express = require('express');
const router = express.Router();
const { runQuery, runStatement, getLastInsertId } = require('../models/database');
const { isAuthenticated } = require('../middleware/auth');

// GET /api/vlans - Get all VLANs
router.get('/', (req, res) => {
    try {
        const vlans = runQuery(`
            SELECT v.*, d.name as department_name, d.code as department_code,
                   (SELECT COUNT(*) FROM devices WHERE vlan_id = v.id) as device_count
            FROM vlans v
            LEFT JOIN departments d ON v.department_id = d.id
            ORDER BY v.id
        `);
        
        res.json({
            success: true,
            data: vlans
        });
    } catch (error) {
        console.error('Error fetching VLANs:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching VLANs'
        });
    }
});

// GET /api/vlans/:id - Get VLAN by ID
router.get('/:id', (req, res) => {
    try {
        const vlans = runQuery(`
            SELECT v.*, d.name as department_name, d.code as department_code
            FROM vlans v
            LEFT JOIN departments d ON v.department_id = d.id
            WHERE v.id = ?
        `, [req.params.id]);
        
        if (vlans.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'VLAN not found'
            });
        }
        
        // Get devices in this VLAN
        const devices = runQuery('SELECT * FROM devices WHERE vlan_id = ?', [req.params.id]);
        
        res.json({
            success: true,
            data: {
                ...vlans[0],
                devices
            }
        });
    } catch (error) {
        console.error('Error fetching VLAN:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching VLAN'
        });
    }
});

// POST /api/vlans - Create new VLAN
router.post('/', isAuthenticated, (req, res) => {
    try {
        const { id, name, department_id, ip_range, gateway, subnet_mask, description } = req.body;
        
        if (!id || !name || !ip_range || !gateway) {
            return res.status(400).json({
                success: false,
                message: 'VLAN ID, name, IP range, and gateway are required'
            });
        }
        
        // Check if VLAN ID already exists
        const existing = runQuery('SELECT id FROM vlans WHERE id = ?', [id]);
        if (existing.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'VLAN ID already exists'
            });
        }
        
        runStatement(`
            INSERT INTO vlans (id, name, department_id, ip_range, gateway, subnet_mask, description, is_active)
            VALUES (?, ?, ?, ?, ?, ?, ?, 1)
        `, [id, name, department_id || null, ip_range, gateway, subnet_mask || '255.255.255.0', description || '']);
        
        res.status(201).json({
            success: true,
            message: 'VLAN created successfully',
            data: { id }
        });
    } catch (error) {
        console.error('Error creating VLAN:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating VLAN'
        });
    }
});

// PUT /api/vlans/:id - Update VLAN
router.put('/:id', isAuthenticated, (req, res) => {
    try {
        const { name, department_id, ip_range, gateway, subnet_mask, description, is_active } = req.body;
        
        const existing = runQuery('SELECT id FROM vlans WHERE id = ?', [req.params.id]);
        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'VLAN not found'
            });
        }
        
        runStatement(`
            UPDATE vlans 
            SET name = COALESCE(?, name),
                department_id = COALESCE(?, department_id),
                ip_range = COALESCE(?, ip_range),
                gateway = COALESCE(?, gateway),
                subnet_mask = COALESCE(?, subnet_mask),
                description = COALESCE(?, description),
                is_active = COALESCE(?, is_active)
            WHERE id = ?
        `, [name, department_id, ip_range, gateway, subnet_mask, description, is_active, req.params.id]);
        
        res.json({
            success: true,
            message: 'VLAN updated successfully'
        });
    } catch (error) {
        console.error('Error updating VLAN:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating VLAN'
        });
    }
});

// DELETE /api/vlans/:id - Delete VLAN
router.delete('/:id', isAuthenticated, (req, res) => {
    try {
        // Check if VLAN has devices
        const devices = runQuery('SELECT COUNT(*) as count FROM devices WHERE vlan_id = ?', [req.params.id]);
        if (devices[0].count > 0) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete VLAN with connected devices'
            });
        }
        
        const result = runStatement('DELETE FROM vlans WHERE id = ?', [req.params.id]);
        
        if (result === 0) {
            return res.status(404).json({
                success: false,
                message: 'VLAN not found'
            });
        }
        
        res.json({
            success: true,
            message: 'VLAN deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting VLAN:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting VLAN'
        });
    }
});

module.exports = router;
