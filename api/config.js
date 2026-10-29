import {profile} from '../public/data.js';

export default function handler(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') return res.status(405).json({error: 'Method not allowed'});
  const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(process.env.CONTACT_EMAIL || '')
    ? process.env.CONTACT_EMAIL
    : profile.email;
  const hasKey = !!(process.env.OPENAI_API_KEY || process.env.GROQ_API_KEY);
  res.status(200).json({
    ai: hasKey,
    email
  });
}
