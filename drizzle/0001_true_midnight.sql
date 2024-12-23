DROP INDEX "server_table_name_unique";--> statement-breakpoint
ALTER TABLE `server_table` ALTER COLUMN "icon" TO "icon" text NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `server_table_name_unique` ON `server_table` (`name`);--> statement-breakpoint
ALTER TABLE `server_table` ALTER COLUMN "badge" TO "badge" text NOT NULL;