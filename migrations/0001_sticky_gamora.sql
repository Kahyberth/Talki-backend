ALTER TABLE "messages" ALTER COLUMN "user_id" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "server_memberships" ALTER COLUMN "user_id" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "servers" ALTER COLUMN "owner_id" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "user_roles" ALTER COLUMN "user_id" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "servers" ADD COLUMN "online" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "servers" ADD COLUMN "image" varchar(255);--> statement-breakpoint
ALTER TABLE "servers" ADD COLUMN "badge" varchar(255) NOT NULL;