const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  console.log("🔐 All headers:", req.headers);  
  console.log("🔑 JWT_SECRET is:", process.env.JWT_SECRET); 

  const authHeader = req.headers['authorization']; 
  if (!authHeader) {
    console.log("❌ No Authorization header");
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1]?.trim();  
  console.log("🧪 Extracted Token:", token);

  if (!token) {
    console.log("❌ Invalid token format");
    return res.status(401).json({ message: 'Invalid token format' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log("❌ Token verification failed:", err.message);
      return res.status(401).json({ message: 'Failed to authenticate token' });
    }
console.log("🧾 VERIFY: Checking token with secret:", process.env.JWT_SECRET);

    console.log("✅ Token verified. Decoded payload:", decoded);
    req.userId = decoded.userId;
    next();
  });
}

module.exports = verifyToken;