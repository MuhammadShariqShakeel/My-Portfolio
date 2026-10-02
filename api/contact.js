import { handleContact } from '../contact-api.mjs';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Vercel automatically parses JSON requests into req.body
    const body = req.body || {};
    const result = await handleContact(body);
    
    return res.status(result.status).json(result.body);
  } catch (error) {
    return res.status(400).json({ error: error.message || 'Invalid request.' });
  }
}