const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    "mysecretkey",
    {
      expiresIn: "7d",
    }
  );
};

module.exports = generateToken;