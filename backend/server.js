/**
 * Smart University Campus Network Management System
 * Main Server Entry Point
 */

const express = require('express');
const cors = require('cors');
const session = require('express-session');
const path = require('path');

// Import database
const { getDatabase } = require('./models/database');

// Import routes
const authRoutes = require('./routes/auth');
const vlanRoutes = require('./routes/vlans');
const deviceRoutes = require('./routes/devices');
const serverRoutes = require('./routes/servers');
const wifiRoutes = require('./routes/wifi');
const dashboardRoutes = require('./routes/dashboard');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: true,
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
    secret: 'smart-campus-network-secret-key-2024',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Set to true in production with HTTPS
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Serve static files from frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/vlans', vlanRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/servers', serverRoutes);
app.use('/api/wifi', wifiRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Smart Campus Network API is running',
        timestamp: new Date().toISOString()
    });
});

// Serve frontend for all other routes (SPA support)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
});

// Initialize database and start server
async function startServer() {
    try {
        // Initialize database
        console.log('Initializing database...');
        await getDatabase();
        console.log('Database initialized successfully');
        
        // Start server
        app.listen(PORT, () => {
            console.log('='.repeat(50));
            console.log('Smart University Campus Network Management System');
            console.log('='.repeat(50));
            console.log(`Server running on http://localhost:${PORT}`);
            console.log(`API available at http://localhost:${PORT}/api`);
            console.log('');
            console.log('Default login credentials:');
            console.log('  Username: admin');
            console.log('  Password: admin123');
            console.log('='.repeat(50));
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();
