"use client";
import { useState } from "react";
import Link from "next/link";
import { SERVICES, PLANS, SPEEDS, TIMES, PAYMENTS, calcTotal } from "@/lib/pricing";

type Booking = { reference: string; total: string; pickupDate: string; pickupTime: string; email: string };
const inp = "w-full border rounded-lg px-3 py-2 focus:outline-sky-500";

export default function Book() {
  const today = new Date().toISOString().slice(0, 10);
  const [f, setF] = useState({
    fullName: "", email: "", phone: "", address: "", service: "wash-fold", weightKg: 5, plan: "one-time",
    pickupDate: today, pickupTime: TIMES[1], deliverySpeed: "standard", detergent: "regular", instructions: "",
    paymentMethod: "card", cardNumber: "", cardExpiry: "", cardCvc: "", cardName: "",
  });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState<Booking | null>(null);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setF({ ...f, [k]: k === "weightKg" ? Number(e.target.value) : e.target.value });
  const price = calcTotal(f.service, f.weightKg || 0, f.plan, f.deliverySpeed);

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setErr(""); setLoading(true);
    const r = await fetch("/api/bookings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) });
    const d = await r.json(); setLoading(false);
    if (!r.ok) return setErr(d.error || "Something went wrong");
    setDone(d);
  }

  if (done) return (
    <main className="max-w-lg mx-auto p-8 mt-10 bg-white rounded-2xl shadow text-center">
      <div className="text-5xl">✅</div>
      <h1 className="text-2xl font-bold mt-3">Booking confirmed!</h1>
      <p className="mt-2">Reference <b>{done.reference}</b></p>
      <p className="text-slate-600">Pickup on {done.pickupDate}, {done.pickupTime}</p>
      <p className="text-xl font-bold mt-2">Total: ${done.total}</p>
      <Link href={`/my-bookings?email=${encodeURIComponent(done.email)}`} className="inline-block mt-6 bg-sky-600 text-white px-6 py-2 rounded-full">View my bookings</Link>
    </main>
  );

  return (
    <main className="max-w-6xl mx-auto p-4 grid lg:grid-cols-3 gap-6 mt-6">
      <form onSubmit={submit} className="lg:col-span-2 space-y-6">
        <Card title="1. Choose a service">
          <div className="grid sm:grid-cols-2 gap-3">
            {SERVICES.map((s) => (
              <label key={s.id} className={`border rounded-xl p-3 cursor-pointer ${f.service === s.id ? "border-sky-500 bg-sky-50" : ""}`}>
                <input type="radio" name="service" className="hidden" value={s.id} checked={f.service === s.id} onChange={set("service")} />
                <span className="font-medium">{s.icon} {s.name}</span> <span className="text-sm text-slate-500">${s.perKg}/kg</span>
              </label>
            ))}
          </div>
          <div className="grid sm:grid-cols-2 gap-3 mt-4">
            <Field label="Estimated weight (kg)"><input type="number" min={1} max={100} className={inp} value={f.weightKg} onChange={set("weightKg")} required /></Field>
            <Field label="Detergent"><select className={inp} value={f.detergent} onChange={set("detergent")}>
              <option value="regular">Regular</option><option value="hypoallergenic">Hypoallergenic</option><option value="eco">Eco-friendly</option><option value="fragrance-free">Fragrance-free</option></select></Field>
          </div>
        </Card>

        <Card title="2. Schedule & plan">
          <div className="grid sm:grid-cols-2 gap-3">
            {PLANS.map((p) => (
              <label key={p.id} className={`border rounded-xl p-3 cursor-pointer ${f.plan === p.id ? "border-sky-500 bg-sky-50" : ""}`}>
                <input type="radio" name="plan" className="hidden" value={p.id} checked={f.plan === p.id} onChange={set("plan")} />
                <div className="font-medium">{p.name}</div><div className="text-xs text-slate-500">{p.desc}</div>
              </label>
            ))}
          </div>
          <div className="grid sm:grid-cols-3 gap-3 mt-4">
            <Field label={f.plan === "one-time" ? "Pickup date" : "First pickup date"}><input type="date" min={today} className={inp} value={f.pickupDate} onChange={set("pickupDate")} required /></Field>
            <Field label="Time slot"><select className={inp} value={f.pickupTime} onChange={set("pickupTime")}>{TIMES.map((t) => <option key={t}>{t}</option>)}</select></Field>
            <Field label="Turnaround"><select className={inp} value={f.deliverySpeed} onChange={set("deliverySpeed")}>{SPEEDS.map((s) => <option key={s.id} value={s.id}>{s.name}{s.fee ? ` (+$${s.fee})` : ""}</option>)}</select></Field>
          </div>
        </Card>

        <Card title="3. Your details">
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Full name"><input className={inp} value={f.fullName} onChange={set("fullName")} required /></Field>
            <Field label="Phone"><input type="tel" className={inp} value={f.phone} onChange={set("phone")} required /></Field>
            <Field label="Email"><input type="email" className={inp} value={f.email} onChange={set("email")} required /></Field>
            <Field label="Pickup address"><input className={inp} value={f.address} onChange={set("address")} required /></Field>
          </div>
          <Field label="Special instructions (optional)"><textarea className={inp} rows={2} value={f.instructions} onChange={set("instructions")} placeholder="Gate code, stain notes, fabric care..." /></Field>
        </Card>

        <Card title="4. Payment method">
          <div className="flex flex-wrap gap-3">
            {PAYMENTS.map((p) => (
              <label key={p.id} className={`border rounded-xl px-4 py-2 cursor-pointer ${f.paymentMethod === p.id ? "border-sky-500 bg-sky-50" : ""}`}>
                <input type="radio" className="hidden" name="pay" value={p.id} checked={f.paymentMethod === p.id} onChange={set("paymentMethod")} />{p.name}
              </label>
            ))}
          </div>
          {f.paymentMethod === "card" && (
            <div className="grid sm:grid-cols-4 gap-3 mt-4">
              <div className="sm:col-span-2"><Field label="Name on card"><input className={inp} value={f.cardName} onChange={set("cardName")} required /></Field></div>
              <div className="sm:col-span-2"><Field label="Card number"><input className={inp} inputMode="numeric" placeholder="4242 4242 4242 4242" value={f.cardNumber} onChange={set("cardNumber")} required /></Field></div>
              <Field label="Expiry"><input className={inp} placeholder="MM/YY" value={f.cardExpiry} onChange={set("cardExpiry")} required /></Field>
              <Field label="CVC"><input className={inp} placeholder="123" value={f.cardCvc} onChange={set("cardCvc")} required /></Field>
            </div>
          )}
          {f.paymentMethod === "paypal" && <p className="text-sm text-slate-500 mt-3">You&apos;ll receive a PayPal payment request at your email.</p>}
          {f.paymentMethod === "cash" && <p className="text-sm text-slate-500 mt-3">Pay our driver on delivery.</p>}
          <p className="text-xs text-slate-400 mt-3">🔒 Demo checkout — only the last 4 digits of your card are stored.</p>
        </Card>

        {err && <p className="text-red-600 bg-red-50 p-3 rounded-lg">{err}</p>}
        <button disabled={loading} className="w-full bg-sky-600 text-white py-3 rounded-full font-semibold disabled:opacity-50">{loading ? "Booking..." : `Confirm booking · $${price?.total.toFixed(2)}`}</button>
      </form>

      <aside className="bg-white rounded-2xl border p-6 h-fit lg:sticky lg:top-20">
        <h2 className="font-bold text-lg mb-4">Order summary</h2>
        {price && (
          <dl className="space-y-2 text-sm">
            <Row k={`${SERVICES.find((s) => s.id === f.service)?.name} × ${f.weightKg}kg`} v={price.base} />
            {price.discount > 0 && <Row k="Plan discount" v={-price.discount} />}
            <Row k="Turnaround fee" v={price.speedFee} />
            <Row k="Pickup fee" v={price.pickupFee} />
            <div className="border-t pt-2 flex justify-between font-bold text-base"><span>Total{f.plan !== "one-time" ? " / pickup" : ""}</span><span>${price.total.toFixed(2)}</span></div>
          </dl>
        )}
        <p className="text-xs text-slate-500 mt-4">Final price adjusts to actual weight at pickup.</p>
      </aside>
    </main>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="bg-white rounded-2xl border p-6 space-y-3"><h2 className="font-bold text-lg">{title}</h2>{children}</section>;
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block text-sm"><span className="text-slate-600 mb-1 block">{label}</span>{children}</label>;
}
function Row({ k, v }: { k: string; v: number }) {
  return <div className="flex justify-between"><dt className="text-slate-600">{k}</dt><dd>{v < 0 ? "-" : ""}${Math.abs(v).toFixed(2)}</dd></div>;
}
