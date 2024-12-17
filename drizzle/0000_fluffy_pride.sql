CREATE TABLE `chats_table` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`message` text NOT NULL,
	`username` text NOT NULL,
	`sender` text NOT NULL,
	`server_id` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `server_table` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`created_by` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`is_alive` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `server_table_name_unique` ON `server_table` (`name`);--> statement-breakpoint
CREATE TABLE `sessions_table` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`sever_id` text NOT NULL,
	`user_id` text NOT NULL,
	`joinedAt` text NOT NULL
);
