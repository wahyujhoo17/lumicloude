import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding plans...");

  // Clear existing data
  await prisma.planFeature.deleteMany();
  await prisma.plan.deleteMany();

  // Create hosting plans
  const starterPlan = await prisma.plan.create({
    data: {
      name: "starter",
      displayName: "Starter",
      description: "Cocok untuk website personal dan blog",
      type: "HOSTING",
      price: 15000,
      storage: "500 MB NVMe SSD",
      bandwidth: "5 GB",
      websites: "1",
      isPopular: false,
      sortOrder: 1,
      features: {
        create: [
          { name: "500 MB NVMe SSD Storage", sortOrder: 1 },
          { name: "5 GB Bandwidth", sortOrder: 2 },
          { name: "1 Website", sortOrder: 3 },
          { name: "Free SSL Certificate", sortOrder: 4 },
          { name: "Daily Backup", sortOrder: 5 },
          { name: "cPanel Access", sortOrder: 6 },
          { name: "Email Support", sortOrder: 7 },
        ],
      },
    },
  });

  const businessPlan = await prisma.plan.create({
    data: {
      name: "business",
      displayName: "Business",
      description: "Ideal untuk bisnis dan toko online",
      type: "HOSTING",
      price: 30000,
      storage: "3 GB NVMe SSD",
      bandwidth: "Unlimited",
      websites: "5",
      isPopular: true,
      sortOrder: 2,
      features: {
        create: [
          { name: "3 GB NVMe SSD", sortOrder: 1 },
          { name: "Unlimited Bandwidth", sortOrder: 2 },
          { name: "5 Website", sortOrder: 3 },
          { name: "Free SSL Certificate", sortOrder: 4 },
          { name: "Daily Backup", sortOrder: 5 },
          { name: "cPanel Access", sortOrder: 6 },
          { name: "Free Domain 1 Tahun", sortOrder: 7 },
          { name: "Priority Support 24/7", sortOrder: 8 },
          { name: "Imunify360 Security", sortOrder: 9 },
        ],
      },
    },
  });

  const enterprisePlan = await prisma.plan.create({
    data: {
      name: "enterprise",
      displayName: "Enterprise",
      description: "Untuk website dengan traffic tinggi",
      type: "HOSTING",
      price: 70000,
      storage: "10 GB NVMe SSD",
      bandwidth: "Unlimited",
      websites: "Unlimited",
      isPopular: false,
      sortOrder: 3,
      features: {
        create: [
          { name: "10 GB NVMe SSD", sortOrder: 1 },
          { name: "Unlimited Bandwidth", sortOrder: 2 },
          { name: "Unlimited Website", sortOrder: 3 },
          { name: "Free SSL Wildcard", sortOrder: 4 },
          { name: "Daily Backup + Weekly", sortOrder: 5 },
          { name: "cPanel Access", sortOrder: 6 },
          { name: "Free Domain 1 Tahun", sortOrder: 7 },
          { name: "Dedicated Support 24/7", sortOrder: 8 },
          { name: "Imunify360 + Firewall", sortOrder: 9 },
          { name: "CDN Integration", sortOrder: 10 },
          { name: "Staging Environment", sortOrder: 11 },
        ],
      },
    },
  });

  // Create VPS plans
  const vpsBasic = await prisma.plan.create({
    data: {
      name: "vps-basic",
      displayName: "VPS Basic",
      description: "VPS dengan spesifikasi dasar",
      type: "VPS",
      price: 50000,
      storage: "10 GB SSD",
      bandwidth: "Unlimited",
      websites: "Unlimited",
      isPopular: false,
      sortOrder: 4,
      features: {
        create: [
          { name: "1 vCPU", sortOrder: 1 },
          { name: "1 GB RAM", sortOrder: 2 },
          { name: "10 GB SSD Storage", sortOrder: 3 },
          { name: "Unlimited Bandwidth", sortOrder: 4 },
          { name: "Full Root Access", sortOrder: 5 },
          { name: "99.9% Uptime SLA", sortOrder: 6 },
          { name: "24/7 Support", sortOrder: 7 },
        ],
      },
    },
  });

  const vpsStandard = await prisma.plan.create({
    data: {
      name: "vps-standard",
      displayName: "VPS Standard",
      description: "VPS dengan performa optimal",
      type: "VPS",
      price: 100000,
      storage: "20 GB SSD",
      bandwidth: "Unlimited",
      websites: "Unlimited",
      isPopular: false,
      sortOrder: 5,
      features: {
        create: [
          { name: "2 vCPU", sortOrder: 1 },
          { name: "2 GB RAM", sortOrder: 2 },
          { name: "20 GB SSD Storage", sortOrder: 3 },
          { name: "Unlimited Bandwidth", sortOrder: 4 },
          { name: "Full Root Access", sortOrder: 5 },
          { name: "99.9% Uptime SLA", sortOrder: 6 },
          { name: "24/7 Support", sortOrder: 7 },
        ],
      },
    },
  });

  const vpsPro = await prisma.plan.create({
    data: {
      name: "vps-pro",
      displayName: "VPS Pro",
      description: "VPS high-performance untuk aplikasi berat",
      type: "VPS",
      price: 200000,
      storage: "40 GB SSD",
      bandwidth: "Unlimited",
      websites: "Unlimited",
      isPopular: false,
      sortOrder: 6,
      features: {
        create: [
          { name: "4 vCPU", sortOrder: 1 },
          { name: "4 GB RAM", sortOrder: 2 },
          { name: "40 GB SSD Storage", sortOrder: 3 },
          { name: "Unlimited Bandwidth", sortOrder: 4 },
          { name: "Full Root Access", sortOrder: 5 },
          { name: "99.9% Uptime SLA", sortOrder: 6 },
          { name: "24/7 Priority Support", sortOrder: 7 },
        ],
      },
    },
  });

  console.log("Plans seeded successfully!");
  console.log({
    hosting: [starterPlan, businessPlan, enterprisePlan],
    vps: [vpsBasic, vpsStandard, vpsPro],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
