const jwt = require("jsonwebtoken");

const doctorProtect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Not authorized. Please login as a doctor.",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    if (decoded.role !== "doctor") {
      return res.status(403).json({
        message: "Doctor access required.",
      });
    }

    if (!decoded.doctorId) {
      return res.status(403).json({
        message: "Invalid doctor authentication.",
      });
    }

    req.doctor = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired doctor token.",
    });
  }
};

module.exports = doctorProtect;