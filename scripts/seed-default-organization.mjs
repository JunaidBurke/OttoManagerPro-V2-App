import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const organizationId = process.env.SEED_ORGANIZATION_ID ?? "org_demo";
  const organizationName = process.env.SEED_ORGANIZATION_NAME ?? "Demo Organization";
  const defaultLocationName = process.env.SEED_LOCATION_NAME ?? "Main Shop";
  const defaultLocationAddress = process.env.SEED_LOCATION_ADDRESS ?? null;

  await prisma.organization.upsert({
    where: { id: organizationId },
    update: { name: organizationName },
    create: {
      id: organizationId,
      name: organizationName
    }
  });

  const location = await prisma.location.upsert({
    where: {
      organizationId_name: {
        organizationId,
        name: defaultLocationName
      }
    },
    update: {
      address: defaultLocationAddress,
      isActive: true
    },
    create: {
      organizationId,
      name: defaultLocationName,
      address: defaultLocationAddress,
      isActive: true
    }
  });

  console.log("Seeded organization and default location.");
  console.log({
    organizationId,
    organizationName,
    locationId: location.id,
    locationName: location.name
  });
}

main()
  .catch((error) => {
    console.error("Failed seeding default organization/location.", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
