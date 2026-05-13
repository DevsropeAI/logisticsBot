const prisma = require("./db");

exports.getUserById = (id) => {
  return prisma.user.findUnique({
    where: { id: parseInt(id) }
  });
};

exports.findByEmail = (email) => {
  return prisma.user.findUnique({
    where: { email }
  });
};

exports.getAllNonAdminUsers = () => {
  return prisma.user.findMany({
    where: { role: { not: 'admin' } },
    orderBy: { createdAt: 'desc' }
  });
};