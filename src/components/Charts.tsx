"use client";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const COLORS = ["#4338ca", "#0891b2", "#059669", "#d97706", "#dc2626", "#7c3aed", "#db2777", "#65a30d"];

export function BarBlock({ title, data }: { title: string; data: { name: string; value: number }[] }) {
  return (
    <div className="rounded-xl border bg-white p-4">
      <h3 className="mb-2 font-semibold">{title}</h3>
      {data.length === 0 ? <p className="text-sm text-slate-500">—</p> : (
        <div style={{ width: "100%", height: 280 }}>
          <ResponsiveContainer>
            <BarChart data={data} margin={{ bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" interval={0} angle={-25} textAnchor="end" height={70} tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" name="soni">{data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

// Guruhlangan ustunli diagramma: har bir strategiya uchun omil qiymatlari bo'yicha sonlar
export function StackedBlock({ title, data, keys }: { title: string; data: Record<string, string | number>[]; keys: string[] }) {
  return (
    <div className="rounded-xl border bg-white p-4">
      <h3 className="mb-2 font-semibold">{title}</h3>
      {data.length === 0 ? <p className="text-sm text-slate-500">—</p> : (
        <div style={{ width: "100%", height: 320 }}>
          <ResponsiveContainer>
            <BarChart data={data} margin={{ bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" interval={0} angle={-25} textAnchor="end" height={70} tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} />
              <Tooltip /><Legend verticalAlign="top" />
              {keys.map((k, i) => <Bar key={k} dataKey={k} stackId="a" fill={COLORS[i % COLORS.length]} />)}
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export function PieBlock({ title, data }: { title: string; data: { name: string; value: number }[] }) {
  return (
    <div className="rounded-xl border bg-white p-4">
      <h3 className="mb-2 font-semibold">{title}</h3>
      {data.length === 0 ? <p className="text-sm text-slate-500">—</p> : (
        <div style={{ width: "100%", height: 280 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" outerRadius={90} label>
                {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip /><Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
