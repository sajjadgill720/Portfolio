import {profile} from '../public/data.js';

export default function handler(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(process.env.CONTACT_EMAIL || '')
    ? process.env.CONTACT_EMAIL
    : profile.email;
  res.status(200).json({
    ai: !!(process.env.OPENAI_API_KEY && process.env.OPENAI_MODEL),
    email
  });
}
