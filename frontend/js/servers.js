/**
 * Smart University Campus Network Management System
 * Servers JavaScript
 * NOTE: API_BASE is declared in auth.js (loaded first)
 */


// Load servers
async function loadServers() {
    try {
        // Load server stats
        const statsResponse = await fetch(`${API_BASE}/servers/stats`, {
            credentials: 'include'
        });
        const stats = await statsResponse.json();
        
        if (stats.success) {
            document.getElementById('totalServers').textContent = stats.data.total;
            document.getElementById('onlineServers').textContent = stats.data.online;
            document.getElementById('avgCpu').textContent = `${stats.data.avg_cpu}%`;
            document.getElementById('avgMemory').textContent = `${stats.data.avg_memory}%`;
        }
        
        // Load servers list
        const serversResponse = await fetch(`${API_BASE}/servers`, {
            credentials: 'include'
        });
        const servers = await serversResponse.json();
        
        if (servers.success) {
            updateServerGrid(servers.data);
        }
        
    } catch (error) {
        console.error('Error loading servers:', error);
    }
}

// Update server grid
function updateServerGrid(servers) {
    const grid = document.getElementById('serverGrid');
    grid.innerHTML = '';
    
    servers.forEach(server => {
        const card = document.createElement('div');
        card.className = 'server-card';
        
        const cpuColor = server.cpu_usage > 80 ? 'red' : server.cpu_usage > 60 ? 'orange' : 'green';
        const memColor = server.memory_usage > 80 ? 'red' : server.memory_usage > 60 ? 'orange' : 'blue';
        const diskColor = server.disk_usage > 80 ? 'red' : server.disk_usage > 60 ? 'orange' : 'green';
        
        card.innerHTML = `
            <div class="server-header">
                <div>
                    <div class="server-name">${server.name}</div>
                    <div class="server-type">${server.type} Server</div>
                </div>
                <span class="status-badge ${server.status}">${server.status}</span>
            </div>
            <div style="margin-bottom: 15px;">
                <div style="font-size: 0.85rem; color: #64748b;">IP: ${server.ip_address}</div>
                <div style="font-size: 0.85rem; color: #64748b;">OS: ${server.os_type || 'N/A'}</div>
                <div style="font-size: 0.85rem; color: #64748b;">Uptime: ${formatUptime(server.uptime_hours)}</div>
            </div>
            <div class="server-metrics">
                <div class="metric">
                    <div class="metric-header">
                        <span class="metric-label">CPU Usage</span>
                        <span class="metric-value">${server.cpu_usage}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill ${cpuColor}" style="width: ${server.cpu_usage}%"></div>
                    </div>
                </div>
                <div class="metric">
                    <div class="metric-header">
                        <span class="metric-label">Memory Usage</span>
                        <span class="metric-value">${server.memory_usage}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill ${memColor}" style="width: ${server.memory_usage}%"></div>
                    </div>
                </div>
                <div class="metric">
                    <div class="metric-header">
                        <span class="metric-label">Disk Usage</span>
                        <span class="metric-value">${server.disk_usage}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill ${diskColor}" style="width: ${server.disk_usage}%"></div>
                    </div>
                </div>
            </div>
            <div style="margin-top: 15px; display: flex; gap: 10px;">
                <button class="btn btn-sm ${server.status === 'online' ? 'btn-danger' : 'btn-success'}" 
                        onclick="toggleServerStatus(${server.id}, '${server.status}')">
                    ${server.status === 'online' ? 'Stop' : 'Start'}
                </button>
                <button class="btn btn-sm btn-outline" onclick="simulateServer(${server.id})">
                    Simulate
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Format uptime hours to readable format
function formatUptime(hours) {
    if (!hours) return 'N/A';
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    if (days > 0) {
        return `${days}d ${remainingHours}h`;
    }
    return `${remainingHours}h`;
}

// Toggle server status
async function toggleServerStatus(serverId, currentStatus) {
    const newStatus = currentStatus === 'online' ? 'offline' : 'online';
    
    try {
        const response = await fetch(`${API_BASE}/servers/${serverId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ status: newStatus })
        });
        
        const data = await response.json();
        
        if (data.success) {
            loadServers();
        } else {
            alert(data.message || 'Error updating server status');
        }
    } catch (error) {
        console.error('Error toggling server status:', error);
        alert('Error updating server status');
    }
}

// Simulate server metrics
async function simulateServer(serverId) {
    try {
        const response = await fetch(`${API_BASE}/servers/${serverId}/simulate`, {
            method: 'POST',
            credentials: 'include'
        });
        
        const data = await response.json();
        
        if (data.success) {
            loadServers();
        }
    } catch (error) {
        console.error('Error simulating server:', error);
    }
}

// Refresh servers
function refreshServers() {
    loadServers();
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadServers();
    
    // Auto-refresh every 15 seconds
    setInterval(loadServers, 15000);
});
