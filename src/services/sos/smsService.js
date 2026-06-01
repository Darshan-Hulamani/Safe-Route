export const smsService = {
  async sendAlert(contact, location) {
    const mapsLink = `https://maps.google.com/?q=${location.lat},${location.lng}`;
    const message = `🚨 EMERGENCY! I need help at: ${mapsLink}`;
    
    console.log(`SMS alert to ${contact.name} (${contact.phone}):`, message);
    
    // Try to share via native share sheet (works on mobile)
    if (navigator.share) {
      try {
        await navigator.share({
          title: '🚨 EMERGENCY – I need help!',
          text: message,
        });
      } catch (e) {
        // user cancelled or not supported
      }
    } else {
      // Fallback: copy link to clipboard
      await navigator.clipboard.writeText(message);
      // Optionally, open SMS app (not reliably possible from web)
    }
    return true;
  },
};