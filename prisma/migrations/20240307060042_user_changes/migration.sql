/*
  Warnings:

  - You are about to drop the column `password` on the `user` table. All the data in the column will be lost.
  - You are about to alter the column `country` on the `user` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(1))` to `VarChar(191)`.
  - Added the required column `hashPassword` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `password`,
    ADD COLUMN `hashPassword` VARCHAR(191) NOT NULL,
    MODIFY `firstName` VARCHAR(191) NULL,
    MODIFY `lastName` VARCHAR(191) NULL,
    MODIFY `isActive` BOOLEAN NULL DEFAULT true,
    MODIFY `role` ENUM('EDITOR', 'ADMIN') NULL DEFAULT 'EDITOR',
    MODIFY `country` VARCHAR(191) NULL,
    MODIFY `isVerified` BOOLEAN NULL DEFAULT false;
