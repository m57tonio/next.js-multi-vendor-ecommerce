-- AlterTable
ALTER TABLE `order` ADD COLUMN `stripePaymentIntentId` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Order_stripePaymentIntentId_key` ON `Order`(`stripePaymentIntentId`);
