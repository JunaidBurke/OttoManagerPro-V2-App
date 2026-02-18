CREATE TYPE "InventoryCondition" AS ENUM ('NEW', 'USED');

CREATE TABLE "inventory_items" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "item" TEXT NOT NULL,
    "condition" "InventoryCondition" NOT NULL,
    "size" TEXT NOT NULL,
    "priceCents" INTEGER NOT NULL,
    "qty" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inventory_items_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "inventory_items_organizationId_idx" ON "inventory_items"("organizationId");
CREATE INDEX "inventory_items_organizationId_locationId_idx" ON "inventory_items"("organizationId", "locationId");

ALTER TABLE "inventory_items"
ADD CONSTRAINT "inventory_items_organizationId_fkey"
FOREIGN KEY ("organizationId")
REFERENCES "organizations"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;

ALTER TABLE "inventory_items"
ADD CONSTRAINT "inventory_items_locationId_fkey"
FOREIGN KEY ("locationId")
REFERENCES "locations"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;
