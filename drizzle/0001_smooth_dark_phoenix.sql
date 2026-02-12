CREATE TABLE `emailSubscriptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`states` text,
	`cities` text,
	`notificationType` enum('all','national','state','municipal','judiciary') NOT NULL DEFAULT 'all',
	`daysBeforeNotification` int NOT NULL DEFAULT 7,
	`isActive` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `emailSubscriptions_id` PRIMARY KEY(`id`),
	CONSTRAINT `emailSubscriptions_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `notificationLogs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`subscriptionId` int NOT NULL,
	`holidayDate` varchar(10) NOT NULL,
	`holidayName` varchar(255) NOT NULL,
	`sentAt` timestamp NOT NULL DEFAULT (now()),
	`status` enum('sent','failed','bounced') NOT NULL DEFAULT 'sent',
	CONSTRAINT `notificationLogs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `notificationLogs` ADD CONSTRAINT `notificationLogs_subscriptionId_emailSubscriptions_id_fk` FOREIGN KEY (`subscriptionId`) REFERENCES `emailSubscriptions`(`id`) ON DELETE no action ON UPDATE no action;