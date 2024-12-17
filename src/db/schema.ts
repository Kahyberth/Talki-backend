import { relations } from 'drizzle-orm';
import {
  pgTable,
  serial,
  varchar,
  integer,
  primaryKey,
  text,
  timestamp,
  boolean,
} from 'drizzle-orm/pg-core';

export const chats = pgTable('chats', {
  id: serial().primaryKey(),
  message: text(),
  created_by: varchar({ length: 50 }),
  server: varchar({ length: 50 }),
  createdAt: timestamp(),
});

export const server = pgTable('server', {
  id: serial().primaryKey(),
  name: varchar({ length: 50 }),
  description: text(),
  created_by: varchar({ length: 50 }),
  createdAt: timestamp(),
  updatedAt: timestamp(),
  is_alive: boolean().default(true),
});

export const users = pgTable('users', {
  id: serial().primaryKey(),
  email: varchar({ length: 50 }),
  name: varchar({ length: 50 }),
  avatar: varchar({ length: 50 }),
  external_user_id: varchar({ length: 50 }),
});

// Relations between tables

export const server_relations_chats = relations(server, ({ many }) => ({
  chats: many(chats),
}));

export const chats_relation_server = relations(chats, ({ one }) => ({
  server: one(server, {
    fields: [chats.server],
    references: [server.id],
  }),
}));

export const users_relation_chats = relations(users, ({ many }) => ({
  chats: many(chats),
}));

export const chats_relation_users = relations(chats, ({ one }) => ({
  user: one(users, {
    fields: [chats.created_by],
    references: [users.id],
  }),
}));

export const users_relation_server = relations(users, ({ many }) => ({
  server: many(server),
}));

export const server_relation_users = relations(server, ({ one }) => ({
  users: one(users, {
    fields: [server.created_by],
    references: [users.id],
  }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  server: many(server),
}));

export const serverRelations = relations(server, ({ many }) => ({
  users: many(users),
}));

export const usersToServers = pgTable(
  'users_to_servers',
  {
    userId: integer('user_id')
      .notNull()
      .references(() => users.id),
    serverId: integer('server_id')
      .notNull()
      .references(() => server.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.serverId] }),
  }),
);

export const usersToServersRelations = relations(usersToServers, ({ one }) => ({
  server: one(server, {
    fields: [usersToServers.serverId],
    references: [server.id],
  }),
  user: one(users, {
    fields: [usersToServers.userId],
    references: [users.id],
  }),
}));
