/**
 * Smart University Campus Network Management System
 * Dashboard JavaScript
 * NOTE: API_BASE is declared in auth.js (loaded first) — do NOT redeclare here.
 */

// Load dashboard data
async function loadDashboard() {
    try {
        // Load stats
        const statsResponse = await fetch(`${API_BASE}/dashboard/stats`, {
            credentials: 'include'
        });
        const stats = await statsResponse.json();
        
        if (stats.success) {
            // Update stat cards with animation
            animateCount('totalDevices', stats.data.devices.total);
            document.getElementById('activeDevices').textContent = `${stats.data.devices.active} active`;
            animateCount('totalVlans', stats.data.vlans.active);
            document.getElementById('totalServers').textContent = `${stats.data.servers.online}/${stats.data.servers.total}`;
            document.getElementById('serverStatus').textContent = stats.data.servers.online === stats.data.servers.total 
                ? 'All operational' 
                : `${stats.data.servers.offline} offline`;
            animateCount('wifiClients', stats.data.wifi.connected_students);
            document.getElementById('wifiBandwidth').textContent = `${stats.data.wifi.total_bandwidth} Mbps total`;
            
            // Update recent devices table
            updateRecentDevices(stats.data.recent_devices);
        }
        
        // Load departments
        const deptResponse = await fetch(`${API_BASE}/dashboard/departments`, {
            credentials: 'include'
        });
        const depts = await deptResponse.json();
        
        if (depts.success) {
            updateDepartmentGrid(depts.data);
        }
        
    } catch (error) {
        console.error('Error loading dashboard:', error);
        showToast('Failed to load dashboard data. Is the server running?', 'error');
    }
}

// Animate number count up
function animateCount(elementId, target) {
    const el = document.getElementById(elementId);
    if (!el) return;
    const start = parseInt(el.textContent) || 0;
    const duration = 800;
    const step = (target - start) / (duration / 16);
    let current = start;
    const timer = setInterval(() => {
        current += step;
        if ((step > 0 && current >= target) || (step < 0 && current <= target)) {
            el.textContent = target;
            clearInterval(timer);
        } else {
            el.textContent = Math.round(current);
        }
    }, 16);
}

// Update department grid
function updateDepartmentGrid(departments) {
    const grid = document.getElementById('departmentGrid');
    if (!grid) return;
    grid.innerHTML = '';
    
    departments.forEach(dept => {
        const card = document.createElement('div');
        card.className = 'department-card';
        card.innerHTML = `
            <div class="department-name">${dept.name}</div>
            <div class="department-info">
                <div class="info-item">
                    <span class="info-label">VLAN ID</span>
                    <span class="info-value vlan-badge">${dept.vlan_id || 'N/A'}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">VLAN Name</span>
                    <span class="info-value">${dept.vlan_name || 'N/A'}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">IP Range</span>
                    <span class="info-value code-val">${dept.ip_range || 'N/A'}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Gateway</span>
                    <span class="info-value code-val">${dept.gateway || 'N/A'}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Building</span>
                    <span class="info-value">${dept.building}, Floor ${dept.floor}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Devices</span>
                    <span class="info-value">${dept.active_devices}/${dept.device_count} active</span>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Update recent devices table
function updateRecentDevices(devices) {
    const table = document.getElementById('recentDevicesTable');
    if (!table) return;
    table.innerHTML = '';
    
    if (!devices || devices.length === 0) {
        table.innerHTML = '<tr><td colspan="5" class="text-center">No recent devices</td></tr>';
        return;
    }
    
    devices.forEach(device => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${device.name}</strong></td>
            <td>${device.type}</td>
            <td><code>${device.ip_address || 'N/A'}</code></td>
            <td><span class="status-badge ${device.status}">${device.status}</span></td>
            <td>${formatDateTime(device.last_seen)}</td>
        `;
        table.appendChild(row);
    });
}

// Format date time
function formatDateTime(dateStr) {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleString();
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    loadDashboard();
    // Refresh dashboard every 30 seconds
    setInterval(loadDashboard, 30000);
});
