import Link from "next/link";
import { SERVICES, PLANS, SPEEDS } from "@/lib/pricing";

export default function Home() {
  return (
    <main>
      <section className="bg-gradient-to-br from-sky-500 to-indigo-600 text-white">
        <div className="max-w-6xl mx-auto px-4 py-14 md:py-20 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-sky-100 mb-4">Fresh clothes, less effort</p>
            <h1 className="text-5xl font-extrabold mb-4">Laundry day, done for you.</h1>
            <p className="text-lg opacity-90 mb-8">Free pickup & delivery. Schedule once or set a recurring plan and save up to 15%.</p>
            <Link href="/book" className="inline-block bg-white text-sky-700 font-semibold px-8 py-3 rounded-full shadow hover:bg-sky-50">Book a pickup</Link>
          </div>
          <div className="relative overflow-hidden rounded-3xl shadow-2xl border border-white/20">
            <img
              src="/images/laundry-folded.jpg"
              alt="Freshly folded white laundry in a basket"
              className="h-72 md:h-96 w-full object-cover"
            />
            <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-slate-950/70 px-4 py-3 backdrop-blur-sm">
              <p className="font-semibold">Picked up, cleaned, folded.</p>
              <p className="text-sm text-slate-200">Back at your door on your schedule.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-4 gap-6 text-center">
        {[["📅", "Schedule", "Pick a date & time slot"], ["🚐", "Pickup", "We collect at your door"], ["🫧", "Clean", "Professionally cleaned"], ["📦", "Deliver", "Returned fresh & folded"]].map(([i, t, d]) => (
          <div key={t}><div className="text-4xl">{i}</div><h3 className="font-semibold mt-2">{t}</h3><p className="text-sm text-slate-500">{d}</p></div>
        ))}
      </section>

      <section id="services" className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-3xl font-bold mb-8 text-center">Services & Pricing</h2>
        <div className="mb-8 overflow-hidden rounded-3xl">
          <img
            src="/images/laundry-room.jpg"
            alt="Clean laundry room with washing machines"
            className="h-48 md:h-64 w-full object-cover"
          />
        </div>
        <div className="grid md:grid-cols-4 gap-6">
          {SERVICES.map((s) => (
            <div key={s.id} className="bg-white rounded-2xl p-6 shadow-sm border">
              <div className="text-4xl">{s.icon}</div>
              <h3 className="font-semibold text-lg mt-3">{s.name}</h3>
              <p className="text-sm text-slate-500 my-2">{s.desc}</p>
              <p className="text-2xl font-bold text-sky-600">${s.perKg.toFixed(2)}<span className="text-sm text-slate-500">/kg</span></p>
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-slate-500 mt-4">
          Turnaround: {SPEEDS.map((s) => `${s.name}${s.fee ? ` +$${s.fee}` : " free"}`).join(" · ")} · $3 pickup fee
        </p>
      </section>

      <section id="plans" className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-3xl font-bold mb-8 text-center">Schedule Plans</h2>
        <div className="grid md:grid-cols-4 gap-6">
          {PLANS.map((p) => (
            <div key={p.id} className={`rounded-2xl p-6 border ${p.id === "weekly" ? "bg-sky-600 text-white" : "bg-white"}`}>
              <h3 className="font-semibold text-lg">{p.name}</h3>
              <p className="text-3xl font-bold my-2">{p.discount ? `-${p.discount * 100}%` : "Flex"}</p>
              <p className="text-sm opacity-80">{p.desc}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-10"><Link href="/book" className="bg-sky-600 text-white px-8 py-3 rounded-full font-semibold">Start booking</Link></div>
      </section>
    </main>
  );
}
