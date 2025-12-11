module.exports = function requireRole(allowed) {
return (req, res, next) => {
if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
const userRole = req.user.role;
const allowedRoles = Array.isArray(allowed) ? allowed : [allowed];
if (!allowedRoles.includes(userRole)) {
return res.status(403).json({ message: 'Forbidden: insufficient role' });
}
next();
};
};