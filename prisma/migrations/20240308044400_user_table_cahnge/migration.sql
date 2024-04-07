/*
  Warnings:

  - Made the column `firstName` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `lastName` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phone` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `city` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `state` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `streetAddress` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `zip` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `user` MODIFY `firstName` VARCHAR(191) NOT NULL,
    MODIFY `lastName` VARCHAR(191) NOT NULL,
    MODIFY `phone` VARCHAR(191) NOT NULL,
    MODIFY `city` VARCHAR(191) NOT NULL,
    MODIFY `state` VARCHAR(191) NOT NULL,
    MODIFY `streetAddress` VARCHAR(191) NOT NULL,
    MODIFY `zip` VARCHAR(191) NOT NULL;
