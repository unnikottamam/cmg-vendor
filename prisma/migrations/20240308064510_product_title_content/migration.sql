/*
  Warnings:

  - Added the required column `content` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `product` ADD COLUMN `content` LONGTEXT NOT NULL,
    ADD COLUMN `title` VARCHAR(191) NOT NULL;
