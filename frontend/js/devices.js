/**
 * Smart University Campus Network Management System
 * Devices JavaScript
 */

// API_BASE is already defined in auth.js
let allDevices = [];
let allVlans = [];
let allDepartments = [];

// Load initial data
async function loadInitialData() {
    try {
        // Load VLANs for filter and modal
        const vlansResponse = await fetch(`${API_BASE}/vlans`, { credentials: 'include' });
        const vlansData = await vlansResponse.json();
        if (vlansData.success) {
            allVlans = vlansData.data;
            populateVlanFilter();
        }
        
        // Load departments for modal
        const deptResponse = await fetch(`${API_BASE}/dashboard/all-departments`, { credentials: 'include' });
        const deptData = await deptResponse.json();
        if (deptData.success) {
            allDepartments = deptData.data;
            populateDepartmentSelect();
        }
        
        // Load devices
        await loadDevices();
        
    } catch (error) {
        console.error('Error loading initial data:', error);
    }
}

// Load devices with filters
async function loadDevices() {
    try {
        const vlanFilter = document.getElementById('filterVlan').value;
        const typeFilter = document.getElementById('filterType').value;
        const statusFilter = document.getElementById('filterStatus').value;
        
        let url = `${API_BASE}/devices?`;
        if (vlanFilter) url += `vlan_id=${vlanFilter}&`;
        if (typeFilter) url += `type=${typeFilter}&`;
        if (statusFilter) url += `status=${statusFilter}&`;
        
        const response = await fetch(url, { credentials: 'include' });
        const data = await response.json();
        
        if (data.success) {
            allDevices = data.data;
            updateDevicesTable(allDevices);
            updateStats();
        }
        
    } catch (error) {
        console.error('Error loading devices:', error);
    }
}

// Update device stats
async function updateStats() {
    try {
        const response = await fetch(`${API_BASE}/devices/stats`, { credentials: 'include' });
        const data = await response.json();
        
        if (data.success) {
            document.getElementById('totalDevices').textContent = data.data.total;
            document.getElementById('activeDevices').textContent = data.data.active;
            document.getElementById('inactiveDevices').textContent = data.data.inactive;
            document.getElementById('vlanCount').textContent = allVlans.length;
        }
    } catch (error) {
        console.error('Error updating stats:', error);
    }
}

// Populate VLAN filter dropdown
function populateVlanFilter() {
    const filterSelect = document.getElementById('filterVlan');
    const modalSelect = document.getElementById('deviceVlan');
    
    // Clear existing options (except first)
    filterSelect.innerHTML = '<option value="">All VLANs</option>';
    modalSelect.innerHTML = '<option value="">Select VLAN</option>';
    
    allVlans.forEach(vlan => {
        const option1 = document.createElement('option');
        option1.value = vlan.id;
        option1.textContent = `VLAN ${vlan.id} - ${vlan.name}`;
        filterSelect.appendChild(option1);
        
        const option2 = document.createElement('option');
        option2.value = vlan.id;
        option2.textContent = `VLAN ${vlan.id} - ${vlan.name} (${vlan.ip_range})`;
        modalSelect.appendChild(option2);
    });
}

// Populate department select
function populateDepartmentSelect() {
    const select = document.getElementById('deviceDepartment');
    select.innerHTML = '<option value="">Select Department</option>';
    
    allDepartments.forEach(dept => {
        const option = document.createElement('option');
        option.value = dept.id;
        option.textContent = dept.name;
        select.appendChild(option);
    });
}

// Update devices table
function updateDevicesTable(devices) {
    const table = document.getElementById('devicesTable');
    table.innerHTML = '';
    
    if (devices.length === 0) {
        table.innerHTML = '<tr><td colspan="8" class="text-center">No devices found</td></tr>';
        return;
    }
    
    devices.forEach(device => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${device.name}</strong><br><small style="color: #64748b;">${device.location || 'N/A'}</small></td>
            <td>${device.type}</td>
            <td>${device.ip_address || 'N/A'}</td>
            <td><code style="font-size: 0.8rem;">${device.mac_address || 'N/A'}</code></td>
            <td>${device.vlan_name ? `${device.vlan_name} (${device.vlan_id})` : 'N/A'}</td>
            <td>${device.department_name || 'N/A'}</td>
            <td><span class="status-badge ${device.status}">${device.status}</span></td>
            <td>
                <button class="btn btn-sm btn-outline" onclick="editDevice(${device.id})">Edit</button>
                <button class="btn btn-sm btn-danger" onclick="deleteDevice(${device.id}, '${device.name}')">Delete</button>
            </td>
        `;
        table.appendChild(row);
    });
}

// Open add device modal
function openAddDeviceModal() {
    document.getElementById('modalTitle').textContent = 'Add New Device';
    document.getElementById('deviceId').value = '';
    document.getElementById('deviceForm').reset();
    document.getElementById('deviceModal').classList.add('active');
}

// Close device modal
function closeDeviceModal() {
    document.getElementById('deviceModal').classList.remove('active');
    document.getElementById('deviceForm').reset();
}

// Edit device
async function editDevice(deviceId) {
    try {
        const response = await fetch(`${API_BASE}/devices/${deviceId}`, { credentials: 'include' });
        const data = await response.json();
        
        if (data.success) {
            const device = data.data;
            document.getElementById('modalTitle').textContent = 'Edit Device';
            document.getElementById('deviceId').value = device.id;
            document.getElementById('deviceName').value = device.name;
            document.getElementById('deviceType').value = device.type;
            document.getElementById('macAddress').value = device.mac_address || '';
            document.getElementById('ipAddress').value = device.ip_address || '';
            document.getElementById('deviceVlan').value = device.vlan_id || '';
            document.getElementById('deviceDepartment').value = device.department_id || '';
            document.getElementById('deviceLocation').value = device.location || '';
            document.getElementById('deviceStatus').value = device.status;
            document.getElementById('connectedPort').value = device.connected_port || '';
            
            document.getElementById('deviceModal').classList.add('active');
        }
    } catch (error) {
        console.error('Error fetching device:', error);
        alert('Error loading device data');
    }
}

// Save device (create or update)
async function saveDevice() {
    const deviceId = document.getElementById('deviceId').value;
    const isEdit = !!deviceId;
    
    const deviceData = {
        name: document.getElementById('deviceName').value.trim(),
        type: document.getElementById('deviceType').value,
        mac_address: document.getElementById('macAddress').value.trim() || null,
        ip_address: document.getElementById('ipAddress').value.trim() || null,
        vlan_id: document.getElementById('deviceVlan').value || null,
        department_id: document.getElementById('deviceDepartment').value || null,
        location: document.getElementById('deviceLocation').value.trim() || null,
        status: document.getElementById('deviceStatus').value,
        connected_port: document.getElementById('connectedPort').value.trim() || null
    };

    if (!deviceData.name || !deviceData.type) {
        showToast('Please fill in Device Name and Type.', 'error');
        return;
    }
    
    const saveBtn = document.querySelector('#deviceModal .modal-footer .btn-primary');
    if (saveBtn) { saveBtn.disabled = true; saveBtn.textContent = 'Saving...'; }

    try {
        const url = isEdit ? `${API_BASE}/devices/${deviceId}` : `${API_BASE}/devices`;
        const method = isEdit ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(deviceData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            closeDeviceModal();
            await loadDevices();
            showToast(isEdit ? `✅ Device "${deviceData.name}" updated successfully!` : `✅ Device "${deviceData.name}" added successfully!`, 'success');
        } else {
            showToast(`❌ ${data.message || 'Error saving device'}`, 'error');
        }
    } catch (error) {
        console.error('Error saving device:', error);
        showToast('❌ Network error. Make sure the server is running.', 'error');
    } finally {
        if (saveBtn) { saveBtn.disabled = false; saveBtn.textContent = 'Save Device'; }
    }
}

// Delete device
async function deleteDevice(deviceId, deviceName) {
    if (!confirm(`Are you sure you want to delete "${deviceName}"?`)) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/devices/${deviceId}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        
        const data = await response.json();
        
        if (data.success) {
            loadDevices();
        } else {
            alert(data.message || 'Error deleting device');
        }
    } catch (error) {
        console.error('Error deleting device:', error);
        alert('Error deleting device');
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadInitialData();
    
    // Add filter event listeners
    document.getElementById('filterVlan').addEventListener('change', loadDevices);
    document.getElementById('filterType').addEventListener('change', loadDevices);
    document.getElementById('filterStatus').addEventListener('change', loadDevices);
    
    // Close modal on overlay click
    document.getElementById('deviceModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeDeviceModal();
        }
    });
});
