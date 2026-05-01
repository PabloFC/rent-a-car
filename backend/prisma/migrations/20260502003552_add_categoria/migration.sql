-- CreateEnum
CREATE TYPE "CategoriaAuto" AS ENUM ('ECONOMICO', 'SUV', 'PREMIUM');

-- AlterTable
ALTER TABLE "autos"
ADD COLUMN "categoria" "CategoriaAuto" NOT NULL DEFAULT 'ECONOMICO';