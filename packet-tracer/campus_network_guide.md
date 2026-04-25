# Cisco Packet Tracer Configuration Guide
## Smart University Campus Network

This guide provides step-by-step instructions to recreate the Smart University Campus Network in Cisco Packet Tracer.

---

## Network Overview

### Topology Summary
- 1 Core Router (Gateway to Internet)
- 1 Layer 3 Core Switch
- 6 Department Access Switches
- 1 Server Switch
- 5 Servers
- 3 Wireless Access Points
- Multiple end devices

### IP Addressing Scheme

| Network Segment | IP Range | Gateway | VLAN |
|-----------------|----------|---------|------|
| Administration | 192.168.10.0/24 | 192.168.10.1 | 10 |
| IT Department | 192.168.20.0/24 | 192.168.20.1 | 20 |
| Computer Lab | 192.168.30.0/24 | 192.168.30.1 | 30 |
| Library | 192.168.40.0/24 | 192.168.40.1 | 40 |
| Exam Cell | 192.168.50.0/24 | 192.168.50.1 | 50 |
| Faculty | 192.168.60.0/24 | 192.168.60.1 | 60 |
| Servers | 192.168.100.0/24 | 192.168.100.1 | 100 |
| Student Wi-Fi | 10.0.0.0/16 | 10.0.0.1 | 200 |

---

## Step-by-Step Configuration

### Step 1: Create the Network Topology

1. Open Cisco Packet Tracer
2. Add the following devices:
   - 1x Router (2911 or similar)
   - 1x Layer 3 Switch (3560-24PS)
   - 7x Layer 2 Switches (2960-24TT)
   - 5x Servers
   - 3x Access Points (AP-PT-N)
   - Multiple PCs and Laptops

3. Connect devices:
   - Router Gig0/0 → Core L3 Switch Gig0/1
   - Core L3 Switch → Each Access Switch
   - Server Switch → Servers
   - Access Points → Core Switch

---

### Step 2: Configure the Core Router

```
Router> enable
Router# configure terminal
Router(config)# hostname CORE-ROUTER

! Configure interface to Core Switch
Router(config)# interface GigabitEthernet0/0
Router(config-if)# ip address 192.168.1.1 255.255.255.0
Router(config-if)# no shutdown
Router(config-if)# exit

! Configure sub-interfaces for inter-VLAN routing (if using Router-on-a-Stick)
! Skip this if using Layer 3 Switch for routing

! Configure DHCP pools
Router(config)# ip dhcp pool VLAN10_POOL
Router(dhcp-config)# network 192.168.10.0 255.255.255.0
Router(dhcp-config)# default-router 192.168.10.1
Router(dhcp-config)# dns-server 192.168.100.50
Router(dhcp-config)# exit

Router(config)# ip dhcp pool VLAN20_POOL
Router(dhcp-config)# network 192.168.20.0 255.255.255.0
Router(dhcp-config)# default-router 192.168.20.1
Router(dhcp-config)# dns-server 192.168.100.50
Router(dhcp-config)# exit

! Repeat for other VLANs...

Router(config)# ip dhcp pool WIFI_POOL
Router(dhcp-config)# network 10.0.0.0 255.255.0.0
Router(dhcp-config)# default-router 10.0.0.1
Router(dhcp-config)# dns-server 192.168.100.50
Router(dhcp-config)# exit

Router(config)# end
Router# write memory
```

---

### Step 3: Configure the Layer 3 Core Switch

```
Switch> enable
Switch# configure terminal
Switch(config)# hostname CORE-SWITCH

! Enable IP routing
Switch(config)# ip routing

! Create VLANs
Switch(config)# vlan 10
Switch(config-vlan)# name VLAN_ADMIN
Switch(config-vlan)# exit

Switch(config)# vlan 20
Switch(config-vlan)# name VLAN_IT
Switch(config-vlan)# exit

Switch(config)# vlan 30
Switch(config-vlan)# name VLAN_LAB
Switch(config-vlan)# exit

Switch(config)# vlan 40
Switch(config-vlan)# name VLAN_LIBRARY
Switch(config-vlan)# exit

Switch(config)# vlan 50
Switch(config-vlan)# name VLAN_EXAM
Switch(config-vlan)# exit

Switch(config)# vlan 60
Switch(config-vlan)# name VLAN_FACULTY
Switch(config-vlan)# exit

Switch(config)# vlan 100
Switch(config-vlan)# name VLAN_SERVERS
Switch(config-vlan)# exit

Switch(config)# vlan 200
Switch(config-vlan)# name VLAN_WIFI
Switch(config-vlan)# exit

! Configure VLAN interfaces (SVIs) for inter-VLAN routing
Switch(config)# interface vlan 10
Switch(config-if)# ip address 192.168.10.1 255.255.255.0
Switch(config-if)# no shutdown
Switch(config-if)# exit

Switch(config)# interface vlan 20
Switch(config-if)# ip address 192.168.20.1 255.255.255.0
Switch(config-if)# no shutdown
Switch(config-if)# exit

Switch(config)# interface vlan 30
Switch(config-if)# ip address 192.168.30.1 255.255.255.0
Switch(config-if)# no shutdown
Switch(config-if)# exit

Switch(config)# interface vlan 40
Switch(config-if)# ip address 192.168.40.1 255.255.255.0
Switch(config-if)# no shutdown
Switch(config-if)# exit

Switch(config)# interface vlan 50
Switch(config-if)# ip address 192.168.50.1 255.255.255.0
Switch(config-if)# no shutdown
Switch(config-if)# exit

Switch(config)# interface vlan 60
Switch(config-if)# ip address 192.168.60.1 255.255.255.0
Switch(config-if)# no shutdown
Switch(config-if)# exit

Switch(config)# interface vlan 100
Switch(config-if)# ip address 192.168.100.1 255.255.255.0
Switch(config-if)# no shutdown
Switch(config-if)# exit

Switch(config)# interface vlan 200
Switch(config-if)# ip address 10.0.0.1 255.255.0.0
Switch(config-if)# no shutdown
Switch(config-if)# exit

! Configure uplink to Router
Switch(config)# interface GigabitEthernet0/1
Switch(config-if)# no switchport
Switch(config-if)# ip address 192.168.1.2 255.255.255.0
Switch(config-if)# no shutdown
Switch(config-if)# exit

! Configure trunk ports to access switches
Switch(config)# interface range FastEthernet0/1-6
Switch(config-if-range)# switchport trunk encapsulation dot1q
Switch(config-if-range)# switchport mode trunk
Switch(config-if-range)# switchport trunk allowed vlan all
Switch(config-if-range)# no shutdown
Switch(config-if-range)# exit

! Configure default route to Router
Switch(config)# ip route 0.0.0.0 0.0.0.0 192.168.1.1

Switch(config)# end
Switch# write memory
```

---

### Step 4: Configure Access Switches

**Example: Administration Switch (SW-ADMIN)**

```
Switch> enable
Switch# configure terminal
Switch(config)# hostname SW-ADMIN

! Create VLANs
Switch(config)# vlan 10
Switch(config-vlan)# name VLAN_ADMIN
Switch(config-vlan)# exit

! Configure trunk port to Core Switch
Switch(config)# interface FastEthernet0/24
Switch(config-if)# switchport mode trunk
Switch(config-if)# switchport trunk allowed vlan 10
Switch(config-if)# no shutdown
Switch(config-if)# exit

! Configure access ports for devices
Switch(config)# interface range FastEthernet0/1-10
Switch(config-if-range)# switchport mode access
Switch(config-if-range)# switchport access vlan 10
Switch(config-if-range)# no shutdown
Switch(config-if-range)# exit

Switch(config)# end
Switch# write memory
```

**Repeat similar configuration for other department switches:**
- SW-IT (VLAN 20)
- SW-LAB (VLAN 30)
- SW-LIBRARY (VLAN 40)
- SW-EXAM (VLAN 50)
- SW-FACULTY (VLAN 60)

---

### Step 5: Configure Server Switch

```
Switch> enable
Switch# configure terminal
Switch(config)# hostname SW-SERVERS

! Create Server VLAN
Switch(config)# vlan 100
Switch(config-vlan)# name VLAN_SERVERS
Switch(config-vlan)# exit

! Configure trunk to Core Switch
Switch(config)# interface FastEthernet0/24
Switch(config-if)# switchport mode trunk
Switch(config-if)# no shutdown
Switch(config-if)# exit

! Configure access ports for servers
Switch(config)# interface range FastEthernet0/1-5
Switch(config-if-range)# switchport mode access
Switch(config-if-range)# switchport access vlan 100
Switch(config-if-range)# no shutdown
Switch(config-if-range)# exit

Switch(config)# end
Switch# write memory
```

---

### Step 6: Configure Servers

**Library Server**
- IP Address: 192.168.100.10
- Subnet Mask: 255.255.255.0
- Default Gateway: 192.168.100.1
- Enable HTTP Service

**Exam Server**
- IP Address: 192.168.100.20
- Subnet Mask: 255.255.255.0
- Default Gateway: 192.168.100.1

**Web Server**
- IP Address: 192.168.100.30
- Subnet Mask: 255.255.255.0
- Default Gateway: 192.168.100.1
- Enable HTTP Service

**DHCP Server**
- IP Address: 192.168.100.40
- Subnet Mask: 255.255.255.0
- Default Gateway: 192.168.100.1
- Enable DHCP Service (configure pools)

**DNS Server**
- IP Address: 192.168.100.50
- Subnet Mask: 255.255.255.0
- Default Gateway: 192.168.100.1
- Enable DNS Service
- Add DNS records:
  - library.smartcampus.edu → 192.168.100.10
  - exam.smartcampus.edu → 192.168.100.20
  - www.smartcampus.edu → 192.168.100.30

---

### Step 7: Configure Wireless Access Points

1. Click on Access Point
2. Go to Config tab
3. Set SSID: "SmartCampus-WiFi"
4. Set Authentication: WPA2-PSK
5. Set Password: (your choice)
6. Connect to VLAN 200 port on switch

---

### Step 8: Configure End Devices

**For PCs with static IP:**
1. Click on PC
2. Go to Desktop → IP Configuration
3. Set:
   - IP Address (e.g., 192.168.10.10)
   - Subnet Mask: 255.255.255.0
   - Default Gateway (e.g., 192.168.10.1)
   - DNS Server: 192.168.100.50

**For DHCP:**
1. Click on PC
2. Go to Desktop → IP Configuration
3. Select "DHCP"
4. Wait for IP assignment

---

### Step 9: Verify Configuration

**Check VLAN configuration:**
```
Switch# show vlan brief
```

**Check IP routing:**
```
Switch# show ip route
```

**Check trunk ports:**
```
Switch# show interfaces trunk
```

**Test connectivity:**
```
PC> ping 192.168.100.30  (Web Server)
PC> ping 10.0.0.1        (Wi-Fi Gateway)
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| No connectivity between VLANs | Verify SVI configuration on L3 switch |
| DHCP not working | Check DHCP pool configuration |
| Trunk not working | Verify encapsulation and allowed VLANs |
| Wi-Fi not connecting | Check AP configuration and VLAN |

---

## Summary

This Packet Tracer configuration demonstrates:
- VLAN segmentation for network security
- Inter-VLAN routing using Layer 3 switch
- DHCP and DNS server configuration
- Wireless network integration
- Proper IP addressing scheme

The configuration aligns with the web-based management system, allowing students to understand both the network infrastructure and the management application.
