import { pgTable, serial, text, integer, timestamp, numeric } from "drizzle-orm/pg-core";

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  reference: text("reference").notNull().unique(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  service: text("service").notNull(),
  weightKg: integer("weight_kg").notNull(),
  plan: text("plan").notNull(),
  pickupDate: text("pickup_date").notNull(),
  pickupTime: text("pickup_time").notNull(),
  deliverySpeed: text("delivery_speed").notNull(),
  detergent: text("detergent").notNull(),
  instructions: text("instructions"),
  paymentMethod: text("payment_method").notNull(),
  cardLast4: text("card_last4"),
  total: numeric("total", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("scheduled"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
