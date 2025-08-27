/*
  Warnings:

  - You are about to drop the column `refresh_token_expires_in` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `createdById` on the `Post` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Post" DROP CONSTRAINT "Post_createdById_fkey";

-- AlterTable
ALTER TABLE "public"."Account" DROP COLUMN "refresh_token_expires_in";

-- AlterTable
ALTER TABLE "public"."Post" DROP COLUMN "createdById";

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "password" TEXT;
