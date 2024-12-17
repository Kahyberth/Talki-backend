import { int, sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const chatsTable = sqliteTable('chats_table', {
  id: int().primaryKey({ autoIncrement: true }),
  message: text().notNull(),
  username: text().notNull(),
  sender: text().notNull(),
  server_id: text().notNull(),
  created_at: text().notNull(),
});

export const serverTable = sqliteTable('server_table', {
  id: text().primaryKey(),
  name: text().notNull().unique(),
  description: text().notNull(),
  created_by: text().notNull(),
  created_at: text().notNull(),
  updated_at: text().notNull(),
  is_alive: integer({ mode: 'boolean' }),
});

export const sessionsTable = sqliteTable('sessions_table', {
  id: int().primaryKey({ autoIncrement: true }),
  sever_id: text().notNull(),
  user_id: text().notNull(),
  joinedAt: text().notNull(),
});

// // Relations between tables

// export const server_relations_chats = relations(serverTable, ({ many }) => ({
//   chats: many(chatsTable),
// }));

// export const chats_relation_server = relations(chatsTable, ({ one }) => ({
//   server: one(serverTable, {
//     fields: [chatsTable.server_id],
//     references: [serverTable.id],
//   }),
// }));

// export const users_relation_chats = relations(usersTable, ({ many }) => ({
//   chats: many(chatsTable),
// }));

// export const chats_relation_users = relations(chatsTable, ({ one }) => ({
//   user: one(usersTable, {
//     fields: [chatsTable.sender],
//     references: [usersTable.id],
//   }),
// }));

// export const users_relation_server = relations(usersTable, ({ many }) => ({
//   server: many(serverTable),
// }));

// export const server_relation_users = relations(serverTable, ({ one }) => ({
//   users: one(usersTable, {
//     fields: [serverTable.created_by],
//     references: [usersTable.id],
//   }),
// }));

// export const usersRelations = relations(usersTable, ({ many }) => ({
//   server: many(serverTable),
// }));

// export const serverRelations = relations(serverTable, ({ many }) => ({
//   users: many(usersTable),
// }));

// export const usersToServers = sqliteTable(
//   'users_to_servers',
//   {
//     userId: integer('user_id')
//       .notNull()
//       .references(() => usersTable.id),
//     serverId: integer('server_id')
//       .notNull()
//       .references(() => serverTable.id),
//   },
//   (t) => ({
//     pk: primaryKey({ columns: [t.userId, t.serverId] }),
//   }),
// );

// export const usersToServersRelations = relations(usersToServers, ({ one }) => ({
//   server: one(serverTable, {
//     fields: [usersToServers.serverId],
//     references: [serverTable.id],
//   }),
//   user: one(usersTable, {
//     fields: [usersToServers.userId],
//     references: [usersTable.id],
//   }),
// }));
