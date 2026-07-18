"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type UserRole = "fan" | "volunteer" | "security" | "medical" | "organizer" | "admin";
export type EmergencyType = "none" | "fire" | "medical" | "stampede" | "lost_child" | "suspicious_object" | "security_threat";
export type RouteType = "shortest" | "wheelchair" | "low_crowd" | "evacuation";

export interface SystemMetrics {
  totalFans: number;
  liveAttendance: number;
  crowdDensity: number; // 0 to 100
  emergencyAlerts: number;
  medicalRequests: number;
  parkingStatus: number; // 0 to 100 (occupancy)
  foodQueueStatus: number; // average waiting time in minutes
  securityAlerts: number;
  volunteerStatus: number; // percentage of volunteers active
  weather: string;
  temperature: number;
  energyConsumption: number; // kWh
  waterUsage: number; // Gallons
  carbonFootprint: number; // kg CO2
  lostFoundCount: number;
}

export interface FoodItem {
  id: string;
  name: string;
  category: "Veg" | "Vegan" | "Halal" | "Jain" | "Regular";
  price: number;
  waitTime: number; // in mins
  rating: number;
  stall: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "error" | "success";
  timestamp: string;
  role: UserRole | "all";
}

export interface VolunteerTask {
  id: string;
  title: string;
  description: string;
  location: string;
  status: "pending" | "in_progress" | "completed";
  assignedTo: string;
  priority: "low" | "medium" | "high";
  points: number;
}

export interface SecurityIncident {
  id: string;
  type: string;
  location: string;
  status: "reported" | "investigating" | "resolved";
  reportedAt: string;
  severity: "low" | "medium" | "critical";
  assignedOfficer: string;
}

export interface MedicalCase {
  id: string;
  patientName: string;
  symptom: string;
  location: string;
  priority: "low" | "medium" | "high" | "critical";
  status: "waiting" | "ambulance_enroute" | "being_treated" | "discharged";
  assignedMedic: string;
}

interface AppStateContextType {
  // Authentication & Roles
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  userName: string;
  setUserName: (name: string) => void;
  isLoggedIn: boolean;
  login: (email: string, role: UserRole) => void;
  logout: () => void;

  // Active Emergency System
  activeEmergency: EmergencyType;
  emergencyLocation: string;
  triggerEmergency: (type: EmergencyType, location: string) => void;
  resolveEmergency: () => void;

  // Navigation Map
  navStart: string;
  setNavStart: (start: string) => void;
  navEnd: string;
  setNavEnd: (end: string) => void;
  routeType: RouteType;
  setRouteType: (type: RouteType) => void;

  // System Metrics (Simulated real-time)
  metrics: SystemMetrics;
  setMetrics: React.Dispatch<React.SetStateAction<SystemMetrics>>;

  // Notifications
  notifications: Notification[];
  addNotification: (title: string, message: string, type: Notification["type"], role?: UserRole | "all") => void;
  clearNotifications: () => void;

  // Food AI
  foodItems: FoodItem[];
  foodOrders: { id: string; name: string; price: number; status: string; waitTime: number }[];
  placeFoodOrder: (name: string, price: number, waitTime: number) => void;

  // Volunteer Tasks
  tasks: VolunteerTask[];
  updateTaskStatus: (taskId: string, status: VolunteerTask["status"]) => void;
  addTask: (task: Omit<VolunteerTask, "id" | "status">) => void;

  // Security Incidents
  incidents: SecurityIncident[];
  reportIncident: (type: string, location: string, severity: SecurityIncident["severity"]) => void;
  updateIncidentStatus: (id: string, status: SecurityIncident["status"]) => void;

  // Medical Cases
  medicalQueue: MedicalCase[];
  requestMedicalHelp: (symptom: string, location: string, priority: MedicalCase["priority"]) => void;
  updateMedicalStatus: (id: string, status: MedicalCase["status"]) => void;

  // Accessibility Controls
  highContrast: boolean;
  setHighContrast: (val: boolean) => void;
  fontSize: "normal" | "large" | "xlarge";
  setFontSize: (size: "normal" | "large" | "xlarge") => void;
  screenReader: boolean;
  setScreenReader: (val: boolean) => void;
  theme: "dark" | "light";
  setTheme: (theme: "dark" | "light") => void;
  language: string;
  setLanguage: (lang: string) => void;
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userRole, setUserRole] = useState<UserRole>("admin"); // Default to admin for easier initial setup preview
  const [userName, setUserName] = useState<string>("Alex Rivera");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true); // Default logged in for UX sandbox

  // Emergency State
  const [activeEmergency, setActiveEmergency] = useState<EmergencyType>("none");
  const [emergencyLocation, setEmergencyLocation] = useState<string>("");

  // Map Navigation Path
  const [navStart, setNavStart] = useState<string>("Entrance A");
  const [navEnd, setNavEnd] = useState<string>("Seat Section 102");
  const [routeType, setRouteType] = useState<RouteType>("shortest");

  // Accessibility
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [fontSize, setFontSize] = useState<"normal" | "large" | "xlarge">("normal");
  const [screenReader, setScreenReader] = useState<boolean>(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [language, setLanguage] = useState<string>("en");

  // Initial Simulator State
  const [metrics, setMetrics] = useState<SystemMetrics>({
    totalFans: 75000,
    liveAttendance: 68420,
    crowdDensity: 64,
    emergencyAlerts: 0,
    medicalRequests: 2,
    parkingStatus: 82,
    foodQueueStatus: 12,
    securityAlerts: 1,
    volunteerStatus: 94,
    weather: "Clear Sky",
    temperature: 24,
    energyConsumption: 12504,
    waterUsage: 45200,
    carbonFootprint: 1820,
    lostFoundCount: 14,
  });

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Tournament Update",
      message: "FIFA World Cup match kickoff in 1 hour: USA vs England.",
      type: "info",
      timestamp: "10 mins ago",
      role: "all",
    },
    {
      id: "2",
      title: "Gate Congestion Alert",
      message: "Gate C is experiencing high traffic. AI suggests diverting fans to Gate D.",
      type: "warning",
      timestamp: "5 mins ago",
      role: "security",
    },
    {
      id: "3",
      title: "Medical Dispatch Needed",
      message: "First-aid assistance requested near Seat Block 114.",
      type: "error",
      timestamp: "2 mins ago",
      role: "medical",
    },
  ]);

  const [foodOrders, setFoodOrders] = useState<{ id: string; name: string; price: number; status: string; waitTime: number }[]>([]);

  const foodItems: FoodItem[] = [
    { id: "f1", name: "Premium Nexus Burger", category: "Regular", price: 14.99, waitTime: 12, rating: 4.8, stall: "Stall A - Gridiron Eats" },
    { id: "f2", name: "Vegan Crunchy Tacos", category: "Vegan", price: 11.49, waitTime: 8, rating: 4.6, stall: "Stall B - Plant Bistro" },
    { id: "f3", name: "Halal Chicken Shawarma", category: "Halal", price: 12.99, waitTime: 10, rating: 4.7, stall: "Stall C - Desert Oasis" },
    { id: "f4", name: "Jain Paneer Roll", category: "Jain", price: 10.99, waitTime: 11, rating: 4.5, stall: "Stall D - Satvik Bites" },
    { id: "f5", name: "Super Loaded Nachos", category: "Veg", price: 9.99, waitTime: 6, rating: 4.4, stall: "Stall E - Fiesta Stadium" },
  ];

  const [tasks, setTasks] = useState<VolunteerTask[]>([
    {
      id: "t1",
      title: "Guide VIP Guests",
      description: "Welcome delegates at Executive Box Suite B and direct to seats.",
      location: "VIP Suite Entrance",
      status: "in_progress",
      assignedTo: "Alex Rivera",
      priority: "medium",
      points: 150,
    },
    {
      id: "t2",
      title: "Divert Congested Gate C",
      description: "Assist security in setting up direction boards to Gate D.",
      location: "Gate C Corridor",
      status: "pending",
      assignedTo: "Unassigned",
      priority: "high",
      points: 200,
    },
    {
      id: "t3",
      title: "Distribute Recycling Bags",
      description: "Hand out eco-friendly trash bags in Stand Section 120.",
      location: "Stand Section 120",
      status: "completed",
      assignedTo: "Alex Rivera",
      priority: "low",
      points: 50,
    },
  ]);

  const [incidents, setIncidents] = useState<SecurityIncident[]>([
    {
      id: "i1",
      type: "Intruder in Restricted Area",
      location: "Media Center Level 2",
      status: "investigating",
      reportedAt: "10 mins ago",
      severity: "medium",
      assignedOfficer: "Officer Davis",
    },
    {
      id: "i2",
      type: "Suspicious Backpack left unattended",
      location: "South Food Court Lobby",
      status: "reported",
      reportedAt: "Just now",
      severity: "critical",
      assignedOfficer: "Unassigned",
    },
  ]);

  const [medicalQueue, setMedicalQueue] = useState<MedicalCase[]>([
    {
      id: "m1",
      patientName: "Marcus Vance",
      symptom: "Severe Dehydration / Dizziness",
      location: "Section 104, Row K",
      priority: "medium",
      status: "ambulance_enroute",
      assignedMedic: "Dr. Clara Chen",
    },
    {
      id: "m2",
      patientName: "Li Wei",
      symptom: "Chest Pain / Shortness of breath",
      location: "Gate D Concourse",
      priority: "critical",
      status: "waiting",
      assignedMedic: "Dr. Robert Sands",
    },
  ]);

  // Auth Operations
  const login = (email: string, role: UserRole) => {
    setUserName(email.split("@")[0].charAt(0).toUpperCase() + email.split("@")[0].slice(1));
    setUserRole(role);
    setIsLoggedIn(true);
  };

  const logout = () => {
    setIsLoggedIn(false);
  };

  // Emergency Trigger operations
  const triggerEmergency = (type: EmergencyType, location: string) => {
    setActiveEmergency(type);
    setEmergencyLocation(location);
    setRouteType("evacuation");
    setMetrics((prev) => ({
      ...prev,
      emergencyAlerts: prev.emergencyAlerts + 1,
      crowdDensity: 90,
      foodQueueStatus: 0,
    }));
    
    const emergencyMsg = `EMERGENCY ALERT: Code Red [${type.toUpperCase()}] triggered at ${location}. Initiate safe evacuation immediately. Follow Red routes on navigation.`;
    addNotification(
      `CRITICAL ALERT: ${type.toUpperCase()}`,
      emergencyMsg,
      "error",
      "all"
    );
  };

  const resolveEmergency = () => {
    setActiveEmergency("none");
    setEmergencyLocation("");
    setRouteType("shortest");
    addNotification(
      "Emergency Resolved",
      "The situation has been contained. Normal operations are resuming. Safe to return to seats.",
      "success",
      "all"
    );
  };

  // Notification Operations
  const addNotification = (title: string, message: string, type: Notification["type"], role: UserRole | "all" = "all") => {
    const newNotif: Notification = {
      id: String(Date.now()),
      title,
      message,
      type,
      timestamp: "Just now",
      role,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const clearNotifications = () => setNotifications([]);

  // Food Ordering Operation
  const placeFoodOrder = (name: string, price: number, waitTime: number) => {
    const newOrder = {
      id: String(Date.now()),
      name,
      price,
      status: "preparing",
      waitTime,
    };
    setFoodOrders((prev) => [newOrder, ...prev]);
    addNotification(
      "Food Order Received",
      `Your order for ${name} has been placed. Estimated waiting time is ${waitTime} mins.`,
      "success",
      "fan"
    );
  };

  // Volunteer Task operations
  const updateTaskStatus = (taskId: string, status: VolunteerTask["status"]) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status } : t))
    );
    if (status === "completed") {
      addNotification(
        "Task Completed",
        "You earned points for successfully completing the task!",
        "success",
        "volunteer"
      );
    }
  };

  const addTask = (task: Omit<VolunteerTask, "id" | "status">) => {
    setTasks((prev) => [
      ...prev,
      { ...task, id: String(Date.now()), status: "pending" },
    ]);
  };

  // Security Incident Operations
  const reportIncident = (type: string, location: string, severity: SecurityIncident["severity"]) => {
    const newIncident: SecurityIncident = {
      id: String(Date.now()),
      type,
      location,
      status: "reported",
      reportedAt: "Just now",
      severity,
      assignedOfficer: "Unassigned",
    };
    setIncidents((prev) => [newIncident, ...prev]);
    setMetrics((prev) => ({ ...prev, securityAlerts: prev.securityAlerts + 1 }));
    addNotification(
      "Incident Reported",
      `A new incident [${type}] was reported at ${location}.`,
      "warning",
      "security"
    );
  };

  const updateIncidentStatus = (id: string, status: SecurityIncident["status"]) => {
    setIncidents((prev) =>
      prev.map((inc) => (inc.id === id ? { ...inc, status } : inc))
    );
  };

  // Medical Case Operations
  const requestMedicalHelp = (symptom: string, location: string, priority: MedicalCase["priority"]) => {
    const newCase: MedicalCase = {
      id: String(Date.now()),
      patientName: "Fan Emergency",
      symptom,
      location,
      priority,
      status: "waiting",
      assignedMedic: "Unassigned",
    };
    setMedicalQueue((prev) => [newCase, ...prev]);
    setMetrics((prev) => ({ ...prev, medicalRequests: prev.medicalRequests + 1 }));
    addNotification(
      "Medical Request Received",
      `Assistance requested for ${symptom} at ${location}. Triage priority: ${priority}.`,
      "error",
      "medical"
    );
  };

  const updateMedicalStatus = (id: string, status: MedicalCase["status"]) => {
    setMedicalQueue((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status } : c))
    );
  };

  // Live Metrics Simulator Engine (Ticking every 10 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) => {
        if (activeEmergency !== "none") {
          return {
            ...prev,
            energyConsumption: prev.energyConsumption + Math.floor(Math.random() * 20) + 10,
            waterUsage: prev.waterUsage + Math.floor(Math.random() * 50) + 20,
            carbonFootprint: prev.carbonFootprint + 2,
          };
        }

        const fanFlux = Math.floor(Math.random() * 10) - 4;
        const newAttendance = Math.min(prev.totalFans, Math.max(65000, prev.liveAttendance + fanFlux));
        const crowdDense = Math.min(100, Math.max(30, Math.floor((newAttendance / prev.totalFans) * 90) + (Math.floor(Math.random() * 6) - 3)));
        
        return {
          ...prev,
          liveAttendance: newAttendance,
          crowdDensity: crowdDense,
          parkingStatus: Math.min(100, Math.max(60, prev.parkingStatus + (Math.floor(Math.random() * 3) - 1))),
          foodQueueStatus: Math.min(45, Math.max(2, prev.foodQueueStatus + (Math.floor(Math.random() * 4) - 2))),
          energyConsumption: prev.energyConsumption + Math.floor(Math.random() * 30) + 15,
          waterUsage: prev.waterUsage + Math.floor(Math.random() * 100) + 50,
          carbonFootprint: prev.carbonFootprint + 1,
        };
      });

      // Simulating food order progression
      setFoodOrders((prev) =>
        prev.map((ord) => {
          if (ord.status === "preparing") {
            const nextWait = ord.waitTime - 1;
            if (nextWait <= 0) {
              addNotification(
                "Food Ready for Pickup",
                `Your order for ${ord.name} is ready at the counter!`,
                "success",
                "fan"
              );
              return { ...ord, status: "ready", waitTime: 0 };
            }
            return { ...ord, waitTime: nextWait };
          }
          return ord;
        })
      );
    }, 10000);

    return () => clearInterval(interval);
  }, [activeEmergency]);

  return (
    <AppStateContext.Provider
      value={{
        userRole,
        setUserRole,
        userName,
        setUserName,
        isLoggedIn,
        login,
        logout,
        activeEmergency,
        emergencyLocation,
        triggerEmergency,
        resolveEmergency,
        navStart,
        setNavStart,
        navEnd,
        setNavEnd,
        routeType,
        setRouteType,
        metrics,
        setMetrics,
        notifications,
        addNotification,
        clearNotifications,
        foodItems,
        foodOrders,
        placeFoodOrder,
        tasks,
        updateTaskStatus,
        addTask,
        incidents,
        reportIncident,
        updateIncidentStatus,
        medicalQueue,
        requestMedicalHelp,
        updateMedicalStatus,
        highContrast,
        setHighContrast,
        fontSize,
        setFontSize,
        screenReader,
        setScreenReader,
        theme,
        setTheme,
        language,
        setLanguage,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error("useAppState must be used within an AppStateProvider");
  }
  return context;
};
