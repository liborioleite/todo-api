-- DropIndex
DROP INDEX `products_user_id_fkey` ON `products`;

-- CreateTable
CREATE TABLE `tasks` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `task_name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `priority` ENUM('low', 'normal', 'high') NULL DEFAULT 'normal',
    `status` ENUM('pending', 'in_progress', 'completed') NULL DEFAULT 'pending',
    `started_in` DATETIME(3) NULL,
    `completed_in` DATETIME(3) NULL,
    `user_id` INTEGER NULL,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tasks` ADD CONSTRAINT `tasks_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
