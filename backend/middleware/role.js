const ROLE_PRIORITY = {
	superadmin: 4,
	admin: 3,
	editor: 2,
	viewer: 1,
};

module.exports = function requireRole(allowed) {
	return (req, res, next) => {
		if (!req.user) return res.status(401).json({ message: 'Not authenticated' });

		const userRole = req.user.role || 'viewer';
		const allowedRoles = Array.isArray(allowed) ? allowed : [allowed];

		if (userRole === 'superadmin') return next();
		if (allowedRoles.includes(userRole)) return next();

		const userRank = ROLE_PRIORITY[userRole] || 0;
		const canAccess = allowedRoles.some((role) => {
			if (role === 'superadmin') return false;
			const requiredRank = ROLE_PRIORITY[role] || 0;
			return userRank >= requiredRank && requiredRank > 0;
		});

		if (!canAccess) {
			return res.status(403).json({ message: 'Forbidden: insufficient role' });
		}

		next();
	};
};