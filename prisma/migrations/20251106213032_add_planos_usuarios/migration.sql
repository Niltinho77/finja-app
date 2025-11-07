-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Usuario" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT,
    "telefone" TEXT NOT NULL,
    "idioma" TEXT DEFAULT 'pt-BR',
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" DATETIME NOT NULL,
    "plano" TEXT DEFAULT 'free',
    "trialExpiraEm" DATETIME,
    "premiumExpiraEm" DATETIME,
    "tester" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Usuario" ("ativo", "atualizadoEm", "criadoEm", "id", "idioma", "nome", "telefone") SELECT "ativo", "atualizadoEm", "criadoEm", "id", "idioma", "nome", "telefone" FROM "Usuario";
DROP TABLE "Usuario";
ALTER TABLE "new_Usuario" RENAME TO "Usuario";
CREATE UNIQUE INDEX "Usuario_telefone_key" ON "Usuario"("telefone");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
