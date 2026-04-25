/**
 * Smart University Campus Network Management System
 * Wi-Fi JavaScript
 * NOTE: API_BASE is declared in auth.js (loaded first) — do NOT redeclare here.
 */

// Load Wi-Fi data
async function loadWifiData() {
    try {
        // Load stats
        const statsResponse = await fetch(`${API_BASE}/wifi/stats`, { credentials: 'include' });
        const stats = await statsResponse.json();
        
        if (stats.success) {
            document.getElementById('connectedClients').textContent = stats.data.connected;
            document.getElementById('disconnectedClients').textContent = stats.data.disconnected;
            document.getElementById('totalBandwidth').textContent = stats.data.total_bandwidth.toFixed(1);
            document.getElementById('avgSignal').textContent = stats.data.avg_signal;
            
            // Update device type breakdown
            updateDeviceTypeBreakdown(stats.data.by_device_type);
        }
        
        // Load clients
        await loadWifiClients();
        
    } catch (error) {
        console.error('Error loading Wi-Fi data:', error);
    }
}

// Load Wi-Fi clients with filter
async function loadWifiClients() {
    try {
        const statusFilter = document.getElementById('filterStatus').value;
        let url = `${API_BASE}/wifi/clients`;
        if (statusFilter) {
            url += `?status=${statusFilter}`;
        }
        
        const response = await fetch(url, { credentials: 'include' });
        const data = await response.json();
        
        if (data.success) {
            updateClientsTable(data.data);
        }
    } catch (error) {
        console.error('Error loading Wi-Fi clients:', error);
    }
}

// Update device type breakdown
function updateDeviceTypeBreakdown(deviceTypes) {
    const container = document.getElementById('deviceTypeBreakdown');
    container.innerHTML = '';
    
    const icons = {
        'Phone': '📱',
        'Laptop': '💻',
        'Tablet': '📱'
    };
    
    const colors = {
        'Phone': '#22c55e',
        'Laptop': '#2563eb',
        'Tablet': '#f59e0b'
    };
    
    deviceTypes.forEach(type => {
        const item = document.createElement('div');
        item.style.cssText = 'display: flex; align-items: center; gap: 15px; padding: 15px 25px; background: #f8fafc; border-radius: 10px;';
        item.innerHTML = `
            <div style="font-size: 2rem;">${icons[type.device_type] || '📱'}</div>
            <div>
                <div style="font-size: 1.5rem; font-weight: 700; color: ${colors[type.device_type] || '#64748b'};">${type.count}</div>
                <div style="color: #64748b; font-size: 0.9rem;">${type.device_type}s</div>
                <div style="color: #94a3b8; font-size: 0.8rem;">${type.bandwidth?.toFixed(1) || 0} Mbps</div>
            </div>
        `;
        container.appendChild(item);
    });
}

// Update clients table
function updateClientsTable(clients) {
    const table = document.getElementById('wifiClientsTable');
    table.innerHTML = '';
    
    if (clients.length === 0) {
        table.innerHTML = '<tr><td colspan="9" class="text-center">No Wi-Fi clients found</td></tr>';
        return;
    }
    
    clients.forEach(client => {
        const signalIcon = getSignalIcon(client.signal_strength);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${client.student_id}</strong></td>
            <td>${client.student_name}</td>
            <td>${client.device_name}</td>
            <td>${getDeviceIcon(client.device_type)} ${client.device_type}</td>
            <td><code>${client.ip_address}</code></td>
            <td>${signalIcon} ${client.signal_strength} dBm</td>
            <td>${client.bandwidth_usage?.toFixed(1) || 0} Mbps</td>
            <td><span class="status-badge ${client.status}">${client.status}</span></td>
            <td>
                ${client.status === 'connected' 
                    ? `<button class="btn btn-sm btn-danger" onclick="disconnectClient(${client.id}, '${client.student_name}')">Disconnect</button>`
                    : `<button class="btn btn-sm btn-success" onclick="reconnectClient(${client.id}, '${client.student_name}')">Reconnect</button>`
                }
            </td>
        `;
        table.appendChild(row);
    });
}

// Get signal strength icon
function getSignalIcon(signal) {
    if (signal >= -50) return '📶';
    if (signal >= -60) return '📶';
    if (signal >= -70) return '📶';
    return '📶';
}

// Get device type icon
function getDeviceIcon(type) {
    const icons = {
        'Phone': '📱',
        'Laptop': '💻',
        'Tablet': '📱'
    };
    return icons[type] || '📱';
}

// Disconnect client
async function disconnectClient(clientId, clientName) {
    if (!confirm(`Disconnect ${clientName} from Wi-Fi?`)) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/wifi/disconnect/${clientId}`, {
            method: 'POST',
            credentials: 'include'
        });
        
        const data = await response.json();
        
        if (data.success) {
            loadWifiData();
        } else {
            alert(data.message || 'Error disconnecting client');
        }
    } catch (error) {
        console.error('Error disconnecting client:', error);
        alert('Error disconnecting client');
    }
}

// Reconnect client
async function reconnectClient(clientId, clientName) {
    try {
        const response = await fetch(`${API_BASE}/wifi/reconnect/${clientId}`, {
            method: 'POST',
            credentials: 'include'
        });
        
        const data = await response.json();
        
        if (data.success) {
            loadWifiData();
        } else {
            alert(data.message || 'Error reconnecting client');
        }
    } catch (error) {
        console.error('Error reconnecting client:', error);
        alert('Error reconnecting client');
    }
}

// Refresh Wi-Fi clients
function refreshWifiClients() {
    loadWifiData();
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadWifiData();
    
    // Add filter event listener
    document.getElementById('filterStatus').addEventListener('change', loadWifiClients);
    
    // Auto-refresh every 10 seconds
    setInterval(loadWifiData, 10000);
});
