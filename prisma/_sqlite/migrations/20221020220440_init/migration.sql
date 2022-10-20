-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Faucet" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "address" TEXT NOT NULL,
    "tokenMint" TEXT NOT NULL DEFAULT '',
    "tokenMintAmount" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Faucet" ("address", "createdAt", "id", "updatedAt") SELECT "address", "createdAt", "id", "updatedAt" FROM "Faucet";
DROP TABLE "Faucet";
ALTER TABLE "new_Faucet" RENAME TO "Faucet";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
