/*
  Warnings:

  - The primary key for the `bookmarks` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `int` on the `bookmarks` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "bookmarks" DROP CONSTRAINT "bookmarks_pkey",
DROP COLUMN "int",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "bookmarks_pkey" PRIMARY KEY ("id");
