"use client"

import { useEffect, useMemo, useState } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from "recharts"
import { BookOpen } from "lucide-react"
import Link from "next/link"
import { api } from "@/lib/api"
import type { Observation } from "@/lib/types"
import { SyntheticBanner } from "@/components/SyntheticBanner"

interface MethodologyData {
  methods: {
    baseline: { description: string; known_limitation?: string }
    z_score: {
      description: string
      formula?: string
      role?: string
      thresholds: Record<string, string>
    }
    robust_score: { description: string; formula?: string; role?: string }
    reliability_score: {
      description: string
      components: Record<string, number>
      interpretation: Record<string, string>
    }
  }
  alert_levels: Record<string, string>
  limitations: string[]
}

export default function MethodologyPage() {
  const [methodology, setMethodology] = useState<MethodologyData | null>(null)
  const [series, setSeries] = useState<Observation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const [methodData, muns, conds] = await Promise.all([
          api.getMethodology(),
          api.getMunicipalities(),
          api.getConditions(),
        ])
        if (cancelled) return
        setMethodology(methodData as unknown as MethodologyData)

        if (muns[0] && conds[0]) {
          const obs = await api.getTimeSeries({
            municipality_id: muns[0].municipality_id,
            condition_id: conds[0].condition_id,
          })
          if (!cancelled) setSeries(obs.slice(-52))
        }
      } catch {
        if (!cancelled) setError("Não foi possível carregar a metodologia.")
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const chartData = useMemo(
    () =>
      series
        .filter((o) => o.robust_score != null)
        .map((o) => ({
          label: `${o.year}-W${String(o.epidemiological_week).padStart(2, "0")}`,
          z: Number(o.z_score.toFixed(2)),
          mad: Number((o.robust_score as number).toFixed(2)),
        })),
    [series],
  )

  if (loading) return <div className="text-slate-400">Carregando...</div>
  if (error) return <div className="text-amber-400">{error}</div>
  if (!methodology?.methods) {
    return <div className="text-slate-400">Metodologia indisponível.</div>
  }

  const m = methodology

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-white flex items-center gap-2">
        <BookOpen className="w-6 h-6 text-emerald-400" />
        Metodologia visual — z-score vs MAD
      </h1>
      <SyntheticBanner />

      <div className="bg-slate-800 rounded-lg p-5 border border-slate-700 space-y-2">
        <p className="text-slate-300 text-sm leading-relaxed">
          O produto classifica alertas com <strong className="text-white">z-score sazonal assinado</strong>.
          O score MAD é um <strong className="text-white">comparador robusto</strong> na mesma série —
          útil para discutir sensibilidade a outliers, não um segundo “alarme oficial”.
        </p>
        <p className="text-slate-500 text-sm">
          Baseline = mesma semana epidemiológica ao longo dos anos (não é janela móvel / rolling).
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <section className="bg-slate-800 rounded-lg p-5 border border-emerald-800/40">
          <p className="text-xs uppercase tracking-wide text-emerald-400 mb-1">Classificador oficial</p>
          <h2 className="text-lg font-semibold text-white mb-2">Z-score sazonal</h2>
          <code className="block text-sm text-emerald-200/90 bg-slate-900/60 rounded px-3 py-2 mb-3 font-mono">
            {m.methods.z_score.formula ?? "(x − μ_semana) / max(σ_semana, 0.1)"}
          </code>
          <p className="text-slate-300 text-sm mb-3">{m.methods.z_score.description}</p>
          <div className="space-y-1">
            {Object.entries(m.methods.z_score.thresholds).map(([level, threshold]) => (
              <div key={level} className="flex items-center gap-2 text-sm">
                <span className="text-slate-400 capitalize w-28">{level.replace("_", " ")}</span>
                <span className="text-slate-500">→</span>
                <span className="text-slate-300 font-mono">{threshold}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-slate-800 rounded-lg p-5 border border-sky-800/40">
          <p className="text-xs uppercase tracking-wide text-sky-400 mb-1">Comparador robusto</p>
          <h2 className="text-lg font-semibold text-white mb-2">MAD (robust score)</h2>
          <code className="block text-sm text-sky-200/90 bg-slate-900/60 rounded px-3 py-2 mb-3 font-mono">
            {m.methods.robust_score.formula ?? "(x − mediana) / max(MAD × 1.4826, 0.1)"}
          </code>
          <p className="text-slate-300 text-sm">{m.methods.robust_score.description}</p>
        </section>
      </div>

      <section className="bg-slate-800 rounded-lg p-5 border border-slate-700">
        <h2 className="text-lg font-semibold text-white mb-1">Série demonstrativa (últimas 52 semanas)</h2>
        <p className="text-slate-500 text-sm mb-4">
          Mesmo município/condição: linhas z (verde) e MAD (azul). Limiar de observação = 1.5.
        </p>
        {chartData.length === 0 ? (
          <p className="text-slate-400 text-sm">Sem série disponível para o gráfico.</p>
        ) : (
          <div className="h-72" role="img" aria-label="Gráfico comparativo z-score e MAD ao longo do tempo">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="label" tick={{ fill: "#94a3b8", fontSize: 10 }} interval={6} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ background: "#1e293b", border: "1px solid #475569" }}
                  labelStyle={{ color: "#e2e8f0" }}
                />
                <Legend />
                <ReferenceLine y={1.5} stroke="#f59e0b" strokeDasharray="4 4" label="1.5" />
                <ReferenceLine y={2.5} stroke="#f97316" strokeDasharray="4 4" label="2.5" />
                <Line type="monotone" dataKey="z" name="z-score" stroke="#34d399" dot={false} strokeWidth={2} />
                <Line type="monotone" dataKey="mad" name="MAD robusto" stroke="#38bdf8" dot={false} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
        <p className="text-slate-500 text-xs mt-3">
          Para scatter e concordância empírica, veja{" "}
          <Link href="/comparison" className="text-emerald-400 hover:underline">
            Comparação
          </Link>
          . Para falsos alertas pedagógicos, veja{" "}
          <Link href="/simulation" className="text-emerald-400 hover:underline">
            Simulação
          </Link>
          .
        </p>
      </section>

      <section className="bg-slate-800 rounded-lg p-5 border border-slate-700">
        <h2 className="text-lg font-semibold text-white mb-2">Baseline histórico</h2>
        <p className="text-slate-300 text-sm">{m.methods.baseline.description}</p>
        {m.methods.baseline.known_limitation && (
          <p className="text-amber-200/80 text-sm mt-3">{m.methods.baseline.known_limitation}</p>
        )}
      </section>

      <section className="bg-slate-800 rounded-lg p-5 border border-slate-700">
        <h2 className="text-lg font-semibold text-white mb-2">Reliability score</h2>
        <p className="text-slate-300 text-sm mb-3">{m.methods.reliability_score.description}</p>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {Object.entries(m.methods.reliability_score.components).map(([component, weight]) => (
            <div key={component} className="flex justify-between bg-slate-700/50 rounded px-3 py-1.5">
              <span className="text-slate-400 capitalize">{component.replace("_", " ")}</span>
              <span className="text-white font-mono">{weight}%</span>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-800 rounded-lg p-5 border border-slate-700">
        <h2 className="text-lg font-semibold text-white mb-2">Níveis de alerta</h2>
        <div className="space-y-1">
          {Object.entries(m.alert_levels).map(([level, desc]) => (
            <div key={level} className="flex items-start gap-2 text-sm">
              <span className="text-slate-400 capitalize w-32 shrink-0">{level.replace("_", " ")}</span>
              <span className="text-slate-300">{desc}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-800 rounded-lg p-5 border border-slate-700">
        <h2 className="text-lg font-semibold text-white mb-2">Limitações</h2>
        <ul className="space-y-2">
          {m.limitations.map((lim) => (
            <li key={lim} className="text-sm text-slate-400 flex gap-2">
              <span className="text-amber-400">•</span>
              <span>{lim}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
