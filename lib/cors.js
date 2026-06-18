// Permissive CORS for the public mobile client. The mobile app runs on
// arbitrary origins (Expo Go uses `exp://...`, web preview uses
// `http://localhost:19006`, production is the device with no origin), so we
// allow everything for these endpoints. Sensitive endpoints (none yet) should
// use a stricter allow-list.

export function applyCors(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Client');
  res.setHeader('Access-Control-Max-Age', '600');
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return true;
  }
  return false;
}
