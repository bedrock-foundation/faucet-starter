-- CreateTable
CREATE TABLE "Scan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "scannerId" TEXT NOT NULL,
    "faucetId" TEXT NOT NULL,
    "faucetAddress" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "ref" TEXT NOT NULL,
    "tokenMint" TEXT,
    "tokenMintAmount" TEXT,
    "mint" TEXT,
    "signature" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
