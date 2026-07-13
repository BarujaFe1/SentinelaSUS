"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { FlaskConical, AlertTriangle } from "lucide-react"
import { api } from "@/lib/api"
import { SyntheticBanner } from "@/components/SyntheticBanner"

interface Confusion {
  tp: number
  fp: number
  fn: number
  tn: number
  precision: number
  recall: number
  false_positive_rate: number
  n: number
}

interface EvaluationResponse {
  definition: Record<string, string>
  summary: {
    total_observations: number
    planted_anomalies: number
    z_signals: number
    mad_signals: number
  }
  z_score_method: Confusion
  mad_method: Confusion
  false_positive_examples: Array<{
    municipality_name: string
    condition_name: string
    year: number
    epidemiological_week: number
    reported_cases: number
    z_score: number
    robust_score: number
    z_level: string
    mad_level: string
    interpretation: string
  }>
  disclaimer: string
}

function MetricCard({ title, m }: { title: string; m: Confusion }) {
  return (
    <section className="bg-slate-800 rounded-lg p-5 border border-slate-700 space-y-3">
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        {[
          ["TP", m.tp, "text-emerald-400"],
          ["FP", m.fp, "text-amber-400"],
          ["FN", m.fn, "text-orange-400"],
          ["TN", m.tn, "text-slate-300"],
        ].map(([label, value, color]) => (
          <div key={String(label)} className="bg-slate-900/50 rounded-lg py-3">
            <div className={`text-xl font-mono ${color}`}>{value}</div>
            <div className="text-xs text-slate-500">{label}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2 text-sm text-slate-400">
        <div>
          Precision{" "}
          <span className="text-white font-mono">{(m.precision * 100).toFixed(1)}%</span>
        </div>
        <div>
          Recall{" "}
          <span className="text-white font-mono">{(m.recall * 100).toFixed(1)}%</span>
        </div>
        <div>
          FPR{" "}
          <span className="text-white font-mono">{(m.false_positive_rate * 100).toFixed(1)}%</span>
        </div>
      </div>
    </section>
  )
}

export default function SimulationPage() {
  const [data, setData] = useState<EvaluationResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    api
      .getFalseAlertSimulation()
      .then((res) => {
        if (!cancelled) setData(res as unknown as EvaluationResponse)
      })
      .catch(() => {
        if (!cancelled) setError("Não foi possível carregar a simulação de falsos alertas.")
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  if (loading) return <div className="text-slate-400">Carregando simulação...</div>
  if (error) return <div className="text-amber-400">{error}</div>
  if (!data) return <div className="text-slate-400">Simulação indisponível.</div>

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-white flex items-center gap-2">
        <FlaskConical className="w-6 h-6 text-emerald-400" />
        Simulação de falso alerta
      </h1>
      <SyntheticBanner />

      <div className="bg-amber-950/30 border border-amber-800/40 rounded-lg p-5 space-y-2">
        <p className="text-amber-100 text-sm flex gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          {data.disclaimer}
        </p>
        <p className="text-slate-400 text-sm">{data.definition.caveat}</p>
      </div>

      <div className="grid sm:grid-cols-4 gap-3">
        {[
          ["Observações", data.summary.total_observations],
          ["Anomalias plantadas", data.summary.planted_anomalies],
          ["Sinais (z)", data.summary.z_signals],
          ["Sinais (MAD)", data.summary.mad_signals],
        ].map(([label, value]) => (
          <div key={String(label)} className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <div className="text-2xl font-mono text-white">{value}</div>
            <div className="text-xs text-slate-500 mt-1">{label}</div>
          </div>
        ))}
      </div>

      <div className="bg-slate-800 rounded-lg p-5 border border-slate-700 text-sm text-slate-300 space-y-2">
        <p>
          <strong className="text-white">Positivo (ground truth):</strong> {data.definition.positive_label}
        </p>
        <p>
          <strong className="text-white">Positivo (z):</strong> {data.definition.z_positive}
        </p>
        <p>
          <strong className="text-white">Positivo (MAD):</strong> {data.definition.mad_positive}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <MetricCard title="Método z-score (oficial)" m={data.z_score_method} />
        <MetricCard title="Método MAD (comparação)" m={data.mad_method} />
      </div>

      <section className="bg-slate-800 rounded-lg p-5 border border-slate-700">
        <h2 className="text-lg font-semibold text-white mb-2">Exemplos de falso alerta (z)</h2>
        <p className="text-slate-500 text-sm mb-4">
          Sinais estatísticos sem anomalia plantada — candidatos a ruído / variação natural.
        </p>
        {data.false_positive_examples.length === 0 ? (
          <p className="text-slate-400 text-sm">Nenhum falso positivo na amostra.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 border-b border-slate-700">
                  <th className="py-2 pr-3">Município</th>
                  <th className="py-2 pr-3">Condição</th>
                  <th className="py-2 pr-3">Semana</th>
                  <th className="py-2 pr-3">Casos</th>
                  <th className="py-2 pr-3">z</th>
                  <th className="py-2 pr-3">MAD</th>
                  <th className="py-2">Nível z</th>
                </tr>
              </thead>
              <tbody>
                {data.false_positive_examples.map((ex) => (
                  <tr
                    key={`${ex.municipality_name}-${ex.year}-${ex.epidemiological_week}-${ex.condition_name}`}
                    className="border-b border-slate-800 text-slate-300"
                  >
                    <td className="py-2 pr-3">{ex.municipality_name || "—"}</td>
                    <td className="py-2 pr-3">{ex.condition_name || "—"}</td>
                    <td className="py-2 pr-3 font-mono">
                      {ex.year}-W{String(ex.epidemiological_week).padStart(2, "0")}
                    </td>
                    <td className="py-2 pr-3 font-mono">{ex.reported_cases}</td>
                    <td className="py-2 pr-3 font-mono text-amber-300">{ex.z_score.toFixed(2)}</td>
                    <td className="py-2 pr-3 font-mono text-sky-300">{ex.robust_score.toFixed(2)}</td>
                    <td className="py-2 capitalize">{ex.z_level.replace("_", " ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <p className="text-slate-500 text-sm">
        Leia o{" "}
        <Link href="/responsible-analytics" className="text-emerald-400 hover:underline">
          memo de uso responsável
        </Link>{" "}
        e a{" "}
        <Link href="/methodology" className="text-emerald-400 hover:underline">
          metodologia visual
        </Link>
        .
      </p>
    </div>
  )
}
