export const isAdmin = (req, res, next) => {
  if (req.userRole !== "admin") {
    return res.status(403).send("Access denied");
  }
  next();
};