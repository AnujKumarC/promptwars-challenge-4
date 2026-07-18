# Database Schema Documentation

Since **FIFA Nexus AI** is optimized for high-efficiency hackathon sandbox demos, all database writes and mutations are coordinated through a centralized client-side state machine using React Context synced to browser `localStorage`. This allows instant mutations, alert propagations, and role-switching simulations without needing a live connection to an external database.

Below is the structured schema for each collections table.

---

## 1. System Metrics (`metrics`)
Tracks the real-time telemetry from stadium sensor systems.

```json
{
  "totalFans": 75000,
  "liveAttendance": 68420,
  "crowdDensity": 64, 
  "emergencyAlerts": 0,
  "medicalRequests": 2,
  "parkingStatus": 82, 
  "foodQueueStatus": 12, 
  "securityAlerts": 1,
  "volunteerStatus": 94, 
  "weather": "Clear Sky",
  "temperature": 24,
  "energyConsumption": 12504, 
  "waterUsage": 45200, 
  "carbonFootprint": 1820 
}
```

---

## 2. Volunteer Tasks (`tasks`)
Defines shifts and crowd mitigation instructions assigned to volunteers.

```json
{
  "id": "t1",
  "title": "Guide VIP Guests",
  "description": "Welcome delegates at Executive Box Suite B and direct to seats.",
  "location": "VIP Suite Entrance",
  "status": "in_progress", // pending | in_progress | completed
  "assignedTo": "Alex Rivera",
  "priority": "medium", // low | medium | high
  "points": 150
}
```

---

## 3. Security Incidents (`incidents`)
Logs reported stadium disruptions and security team dispatches.

```json
{
  "id": "i1",
  "type": "Intruder in Restricted Area",
  "location": "Media Center Level 2",
  "status": "investigating", // reported | investigating | resolved
  "reportedAt": "10 mins ago",
  "severity": "medium", // low | medium | critical
  "assignedOfficer": "Officer Davis"
}
```

---

## 4. Medical Queue Cases (`medicalQueue`)
Coordinates triage medical treatments for distressed fans.

```json
{
  "id": "m1",
  "patientName": "Marcus Vance",
  "symptom": "Severe Dehydration / Dizziness",
  "location": "Section 104, Row K",
  "priority": "medium", // low | medium | high | critical
  "status": "ambulance_enroute", // waiting | ambulance_enroute | being_treated | discharged
  "assignedMedic": "Dr. Clara Chen"
}
```

---

## 5. Food Ordering Items (`foodItems` & `orders`)
Coordinates wait times and mock orders.

```json
{
  "id": "f1",
  "name": "Premium Nexus Burger",
  "category": "Regular", // Veg | Vegan | Halal | Jain | Regular
  "price": 14.99,
  "waitTime": 12,
  "rating": 4.8,
  "stall": "Stall A - Gridiron Eats"
}
```
```json
{
  "id": "ord_102",
  "name": "Premium Nexus Burger",
  "price": 14.99,
  "status": "preparing", // preparing | ready
  "waitTime": 12
}
```
