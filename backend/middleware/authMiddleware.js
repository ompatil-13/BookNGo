import jwt from "jsonwebtoken";

export function protect(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : null;
    if (!token) return res.status(401).json({ message: "Not authorized, token missing" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "myLocalSecretKey");
    req.user = decoded; // { aadhaar_no }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Not authorized, token invalid" });
  }
}

