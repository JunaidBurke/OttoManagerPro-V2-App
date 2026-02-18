CREATE TABLE "customers" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "phoneDigits" TEXT NOT NULL,
    "lastVisitAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "customers_organizationId_phoneDigits_key" ON "customers"("organizationId", "phoneDigits");
CREATE INDEX "customers_organizationId_phoneDigits_idx" ON "customers"("organizationId", "phoneDigits");
CREATE INDEX "customers_organizationId_name_idx" ON "customers"("organizationId", "name");

ALTER TABLE "customers"
ADD CONSTRAINT "customers_organizationId_fkey"
FOREIGN KEY ("organizationId")
REFERENCES "organizations"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;
