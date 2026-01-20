import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import bcrypt from "bcryptjs";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting database seed...");

  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@lumicloud.com" },
    update: {},
    create: {
      email: "admin@lumicloud.com",
      password: hashedPassword,
      name: "Admin LumiCloud",
      phone: "08123456789",
    },
  });

  console.log("✅ Admin user created:", admin.email);

  // Create test user
  const testUserPassword = await bcrypt.hash("test123", 10);

  const testUser = await prisma.user.upsert({
    where: { email: "test@lumicloud.com" },
    update: {},
    create: {
      email: "test@lumicloud.com",
      password: testUserPassword,
      name: "Test User",
      phone: "08987654321",
    },
  });

  console.log("✅ Test user created:", testUser.email);

  console.log("🎉 Database seeding completed!");
}

main()
  .catch((error) => {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
