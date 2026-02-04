CREATE TABLE `products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`videoId` int NOT NULL,
	`title` text NOT NULL,
	`price` varchar(50),
	`imageUrl` text,
	`productUrl` text,
	`store` varchar(100),
	`position` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `products_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `validationReports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`totalVideos` int NOT NULL,
	`totalProducts` int NOT NULL,
	`videosWithHashtag` int NOT NULL,
	`videosWithoutHashtag` int NOT NULL,
	`successCount` int NOT NULL,
	`failureCount` int NOT NULL,
	`exportFormat` enum('csv','excel'),
	`exportedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `validationReports_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `videos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`youtubeUrl` varchar(255) NOT NULL,
	`videoId` varchar(64) NOT NULL,
	`title` text,
	`description` text,
	`creator` varchar(255),
	`hasRequiredHashtag` int NOT NULL DEFAULT 0,
	`requiredHashtag` varchar(100) NOT NULL DEFAULT '#pagamento',
	`productCount` int NOT NULL DEFAULT 0,
	`status` enum('pending','processing','completed','failed') NOT NULL DEFAULT 'pending',
	`errorMessage` text,
	`processedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `videos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `products` ADD CONSTRAINT `products_videoId_videos_id_fk` FOREIGN KEY (`videoId`) REFERENCES `videos`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `validationReports` ADD CONSTRAINT `validationReports_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `videos` ADD CONSTRAINT `videos_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;