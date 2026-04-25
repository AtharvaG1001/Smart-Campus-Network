/**
 * Smart University Campus Network Management System
 * Authentication Middleware
 */

function isAuthenticated(req, res, next) {
    // VIVA DEMO MODE: Authentication Bypassed to prevent presentation issues
    return next();
}

function isAdmin(req, res, next) {
    // VIVA DEMO MODE: Admin check bypassed
    return next();
}

module.exports = {
    isAuthenticated,
    isAdmin
};
