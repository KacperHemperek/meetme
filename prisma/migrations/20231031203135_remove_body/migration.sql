/*
  Warnings:

  - Made the column `test` on table `Test` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Test" ALTER COLUMN "test" SET NOT NULL;
