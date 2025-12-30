// Generate and persist a unique device ID
// This ID is stored in localStorage and used to identify which device owns which profiles

const DEVICE_ID_KEY = "fm_device_id";

export function getDeviceId(): string {
  if (typeof window === "undefined") {
    return "server";
  }
  
  let deviceId = localStorage.getItem(DEVICE_ID_KEY);
  
  if (!deviceId) {
    // Generate a unique device ID using crypto API + timestamp + random
    deviceId = generateDeviceId();
    localStorage.setItem(DEVICE_ID_KEY, deviceId);
  }
  
  return deviceId;
}

function generateDeviceId(): string {
  // Use crypto.randomUUID if available, otherwise fallback
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `device_${crypto.randomUUID()}`;
  }
  
  // Fallback: timestamp + random string
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 15);
  const randomPart2 = Math.random().toString(36).substring(2, 15);
  
  return `device_${timestamp}_${randomPart}${randomPart2}`;
}

// Check if a profile belongs to this device
export function isProfileOwnedByDevice(profileDeviceId: string): boolean {
  return profileDeviceId === getDeviceId();
}
