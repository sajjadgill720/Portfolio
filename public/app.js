if (typeof document !== 'undefined') {
  import('./portfolio.js');
}
export default function handler(req, res) {
  if (res && typeof res.status === 'function') {
    res.status(200).send('Portfolio Client Module');
  }
}
