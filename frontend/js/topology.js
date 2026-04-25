/**
 * Smart University Campus Network Management System
 * Topology JavaScript
 * NOTE: API_BASE is declared in auth.js (loaded first)
 */


// Load topology data
async function loadTopologyData() {
    try {
        const response = await fetch(`${API_BASE}/dashboard/topology`, { credentials: 'include' });
        const data = await response.json();
        
        if (data.success) {
            updateTopologyInfo(data.data);
        }
    } catch (error) {
        console.error('Error loading topology data:', error);
    }
}

// Update topology information
function updateTopologyInfo(topology) {
    // Update info panel stats
    document.getElementById('infoVlans').textContent = topology.vlans?.length || 0;
    document.getElementById('infoDevices').textContent = topology.total_devices || 0;
    document.getElementById('infoServers').textContent = `${topology.servers?.filter(s => s.status === 'online').length || 0}/${topology.servers?.length || 0}`;
    document.getElementById('infoWifi').textContent = topology.wifi_clients || 0;
    
    // Update Wi-Fi client count in diagram
    const wifiClientText = document.getElementById('wifiClientCount');
    if (wifiClientText) {
        wifiClientText.textContent = `${topology.wifi_clients || 0} active clients`;
    }
    
    // Update device counts per VLAN in SVG
    updateVlanDeviceCounts(topology.vlans || []);
}

// Update VLAN device counts in the SVG diagram
function updateVlanDeviceCounts(vlans) {
    // Map VLAN IDs to element IDs
    const vlanElements = {
        10: 'vlan10Devices',
        20: 'vlan20Devices',
        30: 'vlan30Devices',
        40: 'vlan40Devices',
        50: 'vlan50Devices',
        60: 'vlan60Devices'
    };
    
    vlans.forEach(vlan => {
        const elementId = vlanElements[vlan.id];
        if (elementId) {
            const element = document.getElementById(elementId);
            if (element) {
                element.textContent = `${vlan.device_count || 0} devs`;
            }
        }
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadTopologyData();
    initializeTopologyInteractivity();
    
    // Refresh topology data every 30 seconds
    setInterval(loadTopologyData, 30000);
});
