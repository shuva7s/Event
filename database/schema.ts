import {
  pgTable,
  text,
  integer,
  timestamp,
  boolean,
  uuid,
  primaryKey,
} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

export const event = pgTable("event", {
  id: uuid("id").defaultRandom().primaryKey().unique(),
  hostId: text("host_id")
    .notNull()
    .references(() => user.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  image: text("image"),
  online: boolean("online").default(true),
  public: boolean("public").default(true),
  location: text("location"),
  startDateTime: timestamp("start_date_time").notNull(),
  endDateTime: timestamp("end_date_time").notNull(),
  hasStarted: boolean("has_started").default(false),
  hasEnded: boolean("has_ended").default(false),
  offlineDayCount: integer("offline_day_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const membership = pgTable(
  "membership",
  {
    eventId: uuid("event_id")
      .notNull()
      .references(() => event.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id),
    role: text("role", { enum: ["guest", "admin", "host"] }).default("guest"), // Enum for role
  },
  (table) => [primaryKey({ columns: [table.eventId, table.userId] })]
);

export const request = pgTable(
  "request",
  {
    eventId: uuid("event_id")
      .notNull()
      .references(() => event.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id),
    createdAt: timestamp("created_at").defaultNow(),
    status: text("status", { enum: ["pending", "banned"] }).default("pending"),
  },
  (table) => [primaryKey({ columns: [table.eventId, table.userId] })]
);

// Types for Users
export type InsertUser = typeof user.$inferInsert;
export type SelectUser = typeof user.$inferSelect;

// Types for Sessions
export type InsertSession = typeof session.$inferInsert;
export type SelectSession = typeof session.$inferSelect;

// Types for Accounts
export type InsertAccount = typeof account.$inferInsert;
export type SelectAccount = typeof account.$inferSelect;

// Types for Verifications
export type InsertVerification = typeof verification.$inferInsert;
export type SelectVerification = typeof verification.$inferSelect;

// Types for Events
export type InsertEvent = typeof event.$inferInsert;
export type SelectEvent = typeof event.$inferSelect;

// Types for Memberships
export type InsertMembership = typeof membership.$inferInsert;
export type SelectMembership = typeof membership.$inferSelect;

// Types for Requests
export type InsertRequest = typeof request.$inferInsert;
export type SelectRequest = typeof request.$inferSelect;
