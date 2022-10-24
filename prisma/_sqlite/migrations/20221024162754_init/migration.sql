/*
  Warnings:

  - Added the required column `type` to the `Scan` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Scan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "scannerId" TEXT NOT NULL,
    "faucetId" TEXT NOT NULL,
    "faucetAddress" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "ref" TEXT NOT NULL,
    "tokenMint" TEXT,
    "tokenMintAmount" TEXT,
    "mint" TEXT,
    "signature" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Scan" ("createdAt", "faucetAddress", "faucetId", "id", "message", "mint", "ref", "scannerId", "signature", "state", "tokenMint", "tokenMintAmount", "updatedAt") SELECT "createdAt", "faucetAddress", "faucetId", "id", "message", "mint", "ref", "scannerId", "signature", "state", "tokenMint", "tokenMintAmount", "updatedAt" FROM "Scan";
DROP TABLE "Scan";
ALTER TABLE "new_Scan" RENAME TO "Scan";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
