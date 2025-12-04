-- CreateTable
CREATE TABLE "routes" (
    "id" TEXT NOT NULL,
    "routeId" TEXT NOT NULL,
    "vesselType" TEXT NOT NULL,
    "fuelType" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "ghgIntensity" DOUBLE PRECISION NOT NULL,
    "fuelConsumption" DOUBLE PRECISION NOT NULL,
    "distance" DOUBLE PRECISION NOT NULL,
    "totalEmissions" DOUBLE PRECISION NOT NULL,
    "isBaseline" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "routes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ship_compliance" (
    "id" TEXT NOT NULL,
    "shipId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "cbGco2eq" DOUBLE PRECISION NOT NULL,
    "adjustedCbGco2eq" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ship_compliance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bank_entries" (
    "id" TEXT NOT NULL,
    "shipId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "amountGco2eq" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bank_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pools" (
    "id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pools_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pool_members" (
    "id" TEXT NOT NULL,
    "poolId" TEXT NOT NULL,
    "shipId" TEXT NOT NULL,
    "cbBefore" DOUBLE PRECISION NOT NULL,
    "cbAfter" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "pool_members_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "routes_routeId_key" ON "routes"("routeId");

-- CreateIndex
CREATE INDEX "routes_year_idx" ON "routes"("year");

-- CreateIndex
CREATE INDEX "routes_vesselType_idx" ON "routes"("vesselType");

-- CreateIndex
CREATE INDEX "routes_fuelType_idx" ON "routes"("fuelType");

-- CreateIndex
CREATE INDEX "ship_compliance_shipId_idx" ON "ship_compliance"("shipId");

-- CreateIndex
CREATE INDEX "ship_compliance_year_idx" ON "ship_compliance"("year");

-- CreateIndex
CREATE UNIQUE INDEX "ship_compliance_shipId_year_key" ON "ship_compliance"("shipId", "year");

-- CreateIndex
CREATE INDEX "bank_entries_shipId_year_idx" ON "bank_entries"("shipId", "year");

-- CreateIndex
CREATE INDEX "pool_members_poolId_idx" ON "pool_members"("poolId");

-- CreateIndex
CREATE INDEX "pool_members_shipId_idx" ON "pool_members"("shipId");

-- AddForeignKey
ALTER TABLE "pool_members" ADD CONSTRAINT "pool_members_poolId_fkey" FOREIGN KEY ("poolId") REFERENCES "pools"("id") ON DELETE CASCADE ON UPDATE CASCADE;
