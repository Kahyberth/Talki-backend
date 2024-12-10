import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  timestamp,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const servers = pgTable('servers', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: varchar('description', { length: 255 }).notNull(), // Corregido aquí
  online: integer('online').notNull(),
  image: varchar('image', { length: 255 }),
  badge: varchar('badge', { length: 255 }).notNull(),
  ownerId: varchar('owner_id', { length: 255 }).notNull(),
  icon: varchar('icon', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const serversRelations = relations(servers, ({ many }) => ({
  channels: many(channels),
  roles: many(roles),
  memberships: many(serverMemberships),
}));

export const serverMemberships = pgTable('server_memberships', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 255 }).notNull(),
  serverId: integer('server_id')
    .notNull()
    .references(() => servers.id),
  joinedAt: timestamp('joined_at').defaultNow(),
});

export const serverMembershipsRelations = relations(
  serverMemberships,
  ({ one }) => ({
    server: one(servers, {
      fields: [serverMemberships.serverId],
      references: [servers.id],
    }),
  }),
);

export const channels = pgTable('channels', {
  id: serial('id').primaryKey(),
  serverId: integer('server_id')
    .notNull()
    .references(() => servers.id),
  name: varchar('name', { length: 255 }).notNull(),
  type: varchar('type', { length: 50 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const channelsRelations = relations(channels, ({ one, many }) => ({
  server: one(servers, {
    fields: [channels.serverId],
    references: [servers.id],
  }),
  messages: many(messages),
}));

export const messages = pgTable('messages', {
  id: serial('id').primaryKey(),
  channelId: integer('channel_id')
    .notNull()
    .references(() => channels.id),
  userId: varchar('user_id', { length: 255 }).notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const messagesRelations = relations(messages, ({ one }) => ({
  channel: one(channels, {
    fields: [messages.channelId],
    references: [channels.id],
  }),
}));

export const roles = pgTable('roles', {
  id: serial('id').primaryKey(),
  serverId: integer('server_id')
    .notNull()
    .references(() => servers.id),
  name: varchar('name', { length: 255 }).notNull(),
  color: varchar('color', { length: 7 }),
});

export const userRoles = pgTable('user_roles', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 255 }).notNull(),
  roleId: integer('role_id')
    .notNull()
    .references(() => roles.id),
});

export const rolesRelations = relations(roles, ({ one, many }) => ({
  server: one(servers, {
    fields: [roles.serverId],
    references: [servers.id],
  }),
  userRoles: many(userRoles),
  permissions: many(permissions),
}));

export const userRolesRelations = relations(userRoles, ({ one }) => ({
  role: one(roles, {
    fields: [userRoles.roleId],
    references: [roles.id],
  }),
}));

export const permissions = pgTable('permissions', {
  id: serial('id').primaryKey(),
  roleId: integer('role_id')
    .notNull()
    .references(() => roles.id),
  permission: varchar('permission', { length: 255 }).notNull(),
});

export const permissionsRelations = relations(permissions, ({ one }) => ({
  role: one(roles, {
    fields: [permissions.roleId],
    references: [roles.id],
  }),
}));
