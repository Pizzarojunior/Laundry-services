import { NextResponse } from "next/server";
import { db } from "@/db";
import { bookings } from "@/db/schema";
import { calcTotal, PAYMENTS, TIMES } from "@/lib/pricing";
import { and, desc, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const email = url.searchParams.get("email")?.trim().toLowerCase();
  if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });
  const rows = await db.select().from(bookings).where(eq(bookings.email, email)).orderBy(desc(bookings.createdAt));
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const b = await req.json().catch(() => null);
  if (!b) return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  const req_ = ["fullName", "email", "phone", "address", "service", "plan", "pickupDate", "pickupTime", "deliverySpeed", "paymentMethod"];
  for (const k of req_) if (!b[k] || typeof b[k] !== "string" || !b[k].trim()) return NextResponse.json({ error: `Missing ${k}` }, { status: 400 });
  if (!/^\S+@\S+\.\S+$/.test(b.email)) return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  const kg = Number(b.weightKg);
  if (!Number.isInteger(kg) || kg < 1 || kg > 100) return NextResponse.json({ error: "Weight must be 1-100 kg" }, { status: 400 });
  if (!TIMES.includes(b.pickupTime)) return NextResponse.json({ error: "Invalid time" }, { status: 400 });
  if (!PAYMENTS.some((p) => p.id === b.paymentMethod)) return NextResponse.json({ error: "Invalid payment" }, { status: 400 });
  const today = new Date().toISOString().slice(0, 10);
  if (b.pickupDate < today) return NextResponse.json({ error: "Pickup date must be in the future" }, { status: 400 });
  let last4: string | null = null;
  if (b.paymentMethod === "card") {
    const num = String(b.cardNumber || "").replace(/\s/g, "");
    if (!/^\d{13,19}$/.test(num) || !/^\d{2}\/\d{2}$/.test(b.cardExpiry || "") || !/^\d{3,4}$/.test(b.cardCvc || ""))
      return NextResponse.json({ error: "Invalid card details" }, { status: 400 });
    last4 = num.slice(-4);
  }
  const price = calcTotal(b.service, kg, b.plan, b.deliverySpeed);
  if (!price) return NextResponse.json({ error: "Invalid service options" }, { status: 400 });
  const reference = "LW-" + Math.random().toString(36).slice(2, 8).toUpperCase();
  const [row] = await db.insert(bookings).values({
    reference, fullName: b.fullName.trim(), email: b.email.trim().toLowerCase(), phone: b.phone.trim(), address: b.address.trim(),
    service: b.service, weightKg: kg, plan: b.plan, pickupDate: b.pickupDate, pickupTime: b.pickupTime,
    deliverySpeed: b.deliverySpeed, detergent: b.detergent || "regular", instructions: b.instructions || null,
    paymentMethod: b.paymentMethod, cardLast4: last4, total: price.total.toFixed(2),
    status: b.paymentMethod === "cash" ? "scheduled" : "paid",
  }).returning();
  return NextResponse.json(row, { status: 201 });
}

export async function PATCH(req: Request) {
  const b = await req.json().catch(() => null);
  if (!b?.id || !b?.email) return NextResponse.json({ error: "Invalid" }, { status: 400 });
  const [row] = await db.update(bookings).set({ status: "cancelled" })
    .where(and(eq(bookings.id, Number(b.id)), eq(bookings.email, String(b.email).toLowerCase()))).returning();
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(row);
}
