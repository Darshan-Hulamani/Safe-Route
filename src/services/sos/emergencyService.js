import { smsService } from './smsService';

export const emergencyService = {
  async triggerSOS(location, contacts) {
    // Vibration
    if (navigator.vibrate) {
      navigator.vibrate([500, 200, 500, 200, 500]);
    }

    // Notify contacts (simulated)
    for (const contact of contacts) {
      await smsService.sendAlert(contact, location);
    }

    // Generate tracking link
    const trackingLink = generateTrackingLink(location);
    return trackingLink;
  }
};

function generateTrackingLink(location) {
  const base = window.location.origin;
  return `${base}/track?lat=${location.latitude}&lng=${location.longitude}`;
}