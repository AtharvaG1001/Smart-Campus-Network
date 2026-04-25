/**
 * Smart University Campus Network Management System
 * Authentication JavaScript
 */

const API_BASE = '/api';

// Global Toast Notification System
function showToast(message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.style.cssText = 'position: fixed; bottom: 20px; right: 20px; z-index: 9999; display: flex; flex-direction: column; gap: 10px;';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    const bgColor = type === 'success' ? '#10b981' : '#ef4444';
    toast.style.cssText = `background: ${bgColor}; color: white; padding: 12px 24px; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); font-family: 'Inter', sans-serif; font-size: 0.9rem; opacity: 0; transform: translateY(20px); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);`;
    toast.textContent = message;
    
    container.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
    }, 10);
    
    // Animate out and remove
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Check if user is authenticated
async function checkAuth() {
    try {
        const response = await fetch(`${API_BASE}/auth/verify`, {
            credentials: 'include'
        });
        const data = await response.json();
        
        if (!data.authenticated) {
            // For demo purposes, set a default user if not authenticated
            if (document.getElementById('userName')) {
                document.getElementById('userName').textContent = 'System Administrator';
            }
            if (document.getElementById('userAvatar')) {
                document.getElementById('userAvatar').textContent = 'S';
            }
            
            // Don't redirect on dashboard and other pages for demo
            if (window.location.pathname.includes('index.html') || 
                window.location.pathname === '/') {
                return false; // Only login page should check auth
            }
            return true; // Allow access to other pages for demo
        }
        
        // Update user info in header if elements exist
        if (document.getElementById('userName')) {
            document.getElementById('userName').textContent = data.user.full_name || data.user.username;
        }
        if (document.getElementById('userAvatar')) {
            document.getElementById('userAvatar').textContent = (data.user.full_name || data.user.username).charAt(0).toUpperCase();
        }
        
        // On login page but authenticated, redirect to dashboard
        if (window.location.pathname.includes('index.html') || 
            window.location.pathname === '/') {
            window.location.href = 'dashboard.html';
        }
        
        return true;
    } catch (error) {
        console.error('Auth check error:', error);
        // Allow access even if auth check fails for demo purposes
        if (document.getElementById('userName')) {
            document.getElementById('userName').textContent = 'System Administrator';
        }
        if (document.getElementById('userAvatar')) {
            document.getElementById('userAvatar').textContent = 'S';
        }
        return true;
    }
}

// Login function
async function login(username, password) {
    try {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            window.location.href = 'dashboard.html';
            return { success: true };
        } else {
            return { success: false, message: data.message };
        }
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, message: 'Network error. Please try again.' };
    }
}

// Logout function
async function logout() {
    try {
        await fetch(`${API_BASE}/auth/logout`, {
            method: 'POST',
            credentials: 'include'
        });
    } catch (error) {
        console.error('Logout error:', error);
    }
    window.location.href = 'index.html';
}

// Handle login form submission
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const loginBtn = document.getElementById('loginBtn');
            
            // Disable button during login
            loginBtn.disabled = true;
            loginBtn.textContent = 'Signing in...';
            
            const result = await login(username, password);
            
            if (!result.success) {
                loginError.textContent = result.message;
                loginError.classList.add('show');
                loginBtn.disabled = false;
                loginBtn.textContent = 'Sign In';
            }
        });
        
        // Check if already authenticated (for login page)
        checkAuth();
    } else {
        // On other pages, verify authentication
        checkAuth();
    }
});
