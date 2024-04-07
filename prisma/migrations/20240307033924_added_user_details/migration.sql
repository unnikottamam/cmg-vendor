/*
  Warnings:

  - You are about to drop the `profile` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `profile` DROP FOREIGN KEY `Profile_userId_fkey`;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `city` VARCHAR(191) NULL,
    ADD COLUMN `country` ENUM('CANADA', 'USA') NULL,
    ADD COLUMN `isVerified` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `password` VARCHAR(191) NOT NULL,
    ADD COLUMN `state` VARCHAR(191) NULL,
    ADD COLUMN `streetAddress` VARCHAR(191) NULL,
    ADD COLUMN `zip` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `profile`;
