"use client";
import { useEffect, useState, useCallback } from "react";
import { SERVICES, PLANS, SPEEDS, PAYMENTS } from "@/lib/pricing";

type B = { id: number; reference: string; service: string; weightKg: number; plan: string; pickupDate: string; pickupTime: string;
  deliverySpeed: string; paymentMethod: string; cardLast4: string | null; total: string; status: string; address: string };
const name = (arr: { id: string; name: string }[], id: string) => arr.find((x) => x.id === id)?.name ?? id;
const colors: Record<string, string> = { paid: "bg-green-100 text-green-700", scheduled: "bg-sky-100 text-sky-700", cancelled: "bg-slate-200 text-slate-500" };

export default function MyBookings() {
  const [email, setEmail] = useState("");
  const [list, setList] = useState<B[] | null>(null);

  const load = useCallback(async (e: string) => {
    const r = await fetch(`/api/bookings?email=${encodeURIComponent(e)}`);
    setList(r.ok ? await r.json() : []);
  }, []);

  useEffect(() => {
    const e = new URLSearchParams(window.location.search).get("email");
    if (e) { setEmail(e); load(e); }
  }, [load]);

  async function cancel(id: number) {
    if (!confirm("Cancel this booking?")) return;
    await fetch("/api/bookings", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, email }) });
    load(email);
  }

  return (
    <main className="max-w-4xl mx-auto p-4 mt-6">
      <h1 className="text-3xl font-bold mb-6">My bookings</h1>
      <form onSubmit={(e) => { e.preventDefault(); load(email); }} className="flex gap-2 mb-6">
        <input type="email" required placeholder="Enter your booking email" className="flex-1 border rounded-lg px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} />
        <button className="bg-sky-600 text-white px-6 rounded-lg">Find</button>
      </form>
      {list && list.length === 0 && <p className="text-slate-500">No bookings found.</p>}
      <div className="space-y-4">
        {list?.map((b) => (
          <div key={b.id} className="bg-white border rounded-2xl p-5 flex flex-wrap justify-between gap-4">
            <div>
              <div className="flex items-center gap-2"><b>{b.reference}</b><span className={`text-xs px-2 py-0.5 rounded-full ${colors[b.status] ?? ""}`}>{b.status}</span></div>
              <p className="text-sm mt-1">{name(SERVICES, b.service)} · {b.weightKg}kg · {name(PLANS, b.plan)} plan</p>
              <p className="text-sm text-slate-500">📅 {b.pickupDate} {b.pickupTime} · {name(SPEEDS, b.deliverySpeed)}</p>
              <p className="text-sm text-slate-500">📍 {b.address}</p>
              <p className="text-sm text-slate-500">💳 {name(PAYMENTS, b.paymentMethod)}{b.cardLast4 ? ` •••• ${b.cardLast4}` : ""}</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold">${b.total}</p>
              {b.status !== "cancelled" && <button onClick={() => cancel(b.id)} className="text-sm text-red-600 mt-2">Cancel</button>}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
