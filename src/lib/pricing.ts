export const SERVICES = [
  { id: "wash-fold", name: "Wash & Fold", perKg: 2.5, icon: "🧺", desc: "Everyday laundry washed, dried and neatly folded." },
  { id: "wash-iron", name: "Wash & Iron", perKg: 3.5, icon: "👔", desc: "Washed and crisply pressed, ready to wear." },
  { id: "dry-clean", name: "Dry Cleaning", perKg: 6, icon: "🧥", desc: "Gentle care for suits, dresses and delicates." },
  { id: "bedding", name: "Bedding & Linens", perKg: 3, icon: "🛏️", desc: "Duvets, sheets, towels and curtains." },
];

export const PLANS = [
  { id: "one-time", name: "One-time", discount: 0, desc: "Single pickup, no commitment." },
  { id: "weekly", name: "Weekly", discount: 0.15, desc: "Pickup every week · save 15%." },
  { id: "biweekly", name: "Bi-weekly", discount: 0.1, desc: "Pickup every 2 weeks · save 10%." },
  { id: "monthly", name: "Monthly", discount: 0.05, desc: "Pickup once a month · save 5%." },
];

export const SPEEDS = [
  { id: "standard", name: "Standard (48h)", fee: 0 },
  { id: "express", name: "Express (24h)", fee: 8 },
  { id: "same-day", name: "Same day", fee: 15 },
];

export const TIMES = ["08:00 - 10:00", "10:00 - 12:00", "12:00 - 14:00", "14:00 - 16:00", "16:00 - 18:00", "18:00 - 20:00"];
export const PAYMENTS = [
  { id: "card", name: "Credit / Debit Card" },
  { id: "paypal", name: "PayPal" },
  { id: "cash", name: "Cash on Delivery" },
];
export const PICKUP_FEE = 3;

export function calcTotal(service: string, kg: number, plan: string, speed: string) {
  const s = SERVICES.find((x) => x.id === service);
  const p = PLANS.find((x) => x.id === plan);
  const d = SPEEDS.find((x) => x.id === speed);
  if (!s || !p || !d) return null;
  const base = s.perKg * kg;
  const discount = base * p.discount;
  const total = base - discount + d.fee + PICKUP_FEE;
  return { base, discount, speedFee: d.fee, pickupFee: PICKUP_FEE, total: Math.round(total * 100) / 100 };
}
