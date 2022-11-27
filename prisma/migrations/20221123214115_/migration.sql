-- CreateTable
CREATE TABLE "Faucet" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "tokenMint" TEXT NOT NULL DEFAULT '',
    "tokenMintAmount" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Faucet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Scan" (
    "id" TEXT NOT NULL,
    "scannerId" TEXT NOT NULL,
    "faucetId" TEXT NOT NULL,
    "faucetAddress" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "ref" TEXT NOT NULL,
    "tokenMint" TEXT,
    "tokenMintAmount" TEXT,
    "signature" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Scan_pkey" PRIMARY KEY ("id")
);
