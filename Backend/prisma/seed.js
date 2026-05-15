const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding started...");

  // clear old data (foreign key order important)
  await prisma.complaint.deleteMany();
  await prisma.tracking.deleteMany();
  await prisma.chatHistory.deleteMany();
  await prisma.order.deleteMany();
  await prisma.user.deleteMany();

  // users
  await prisma.user.createMany({
    data: [
      {
        id: 1,
        name: "Admin",
        phone: null,
        email: "admin@example.com",
        password: "$2b$10$Ta2Kk/M9PKrPET9I09UkZ.57SmUInh51eJPLVv3.DaEPX.bwpcZpa",
        role: "admin",
        created_at: new Date("2026-05-06T13:12:56.000Z"),
      },
      {
        id: 2,
        name: "Ali Khan",
        phone: "03001234567",
        email: "ali@example.com",
        password: "password123",
        role: "user",
        created_at: new Date("2026-05-06T17:22:26.000Z"),
      },
      {
        id: 3,
        name: "Ahmed Raza",
        phone: "03111234567",
        email: "ahmed@example.com",
        password: "password123",
        role: "user",
        created_at: new Date("2026-05-06T17:22:26.000Z"),
      },
      {
        id: 4,
        name: "Usman Tariq",
        phone: "03221234567",
        email: "usman@example.com",
        password: "password123",
        role: "user",
        created_at: new Date("2026-05-06T17:22:26.000Z"),
      },
      {
        id: 5,
        name: "Hamza Malik",
        phone: "03331234567",
        email: "hamza@example.com",
        password: "password123",
        role: "user",
        created_at: new Date("2026-05-06T17:22:26.000Z"),
      },
      {
        id: 6,
        name: "Bilal Ahmed",
        phone: "03441234567",
        email: "bilal@example.com",
        password: "password123",
        role: "user",
        created_at: new Date("2026-05-06T17:22:26.000Z"),
      },
    ],
  });

  // orders
  await prisma.order.createMany({
    data: [
      {
        id: 1,
        order_number: "ORD1001",
        user_id: 1,
        status: "Pending",
      },
      {
        id: 2,
        order_number: "ORD1002",
        user_id: 2,
        status: "Shipped",
      },
      {
        id: 3,
        order_number: "ORD1003",
        user_id: 3,
        status: "Out For Delivery",
      },
      {
        id: 4,
        order_number: "ORD1004",
        user_id: 4,
        status: "Delivered",
      },
      {
        id: 5,
        order_number: "ORD1005",
        user_id: 5,
        status: "Cancelled",
      },
    ],
  });

  // tracking
  await prisma.tracking.createMany({
    data: [
      {
        id: 1,
        order_id: 1,
        location: "Lahore Warehouse",
        eta: "2 Days",
      },
      {
        id: 2,
        order_id: 2,
        location: "Islamabad Hub",
        eta: "Tomorrow",
      },
      {
        id: 3,
        order_id: 3,
        location: "Karachi Dispatch Center",
        eta: "Today",
      },
      {
        id: 4,
        order_id: 4,
        location: "Delivered to Customer",
        eta: "Completed",
      },
      {
        id: 5,
        order_id: 5,
        location: "Order Cancelled",
        eta: "N/A",
      },
    ],
  });
  console.log("Seeding completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });