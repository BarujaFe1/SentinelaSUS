"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { api } from "@/lib/api"
import type { MunicipalitySummary, Observation } from "@/lib/types"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { SyntheticBanner } from "@/components/SyntheticBanner"

export default function MunicipalityDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [summary, setSummary] = useState<MunicipalitySummary | null>(null)
  const [observations, setObservations] = useState<Observation[]>([])
  const [conditionNames, setConditionNames] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    let cancelled = false
    Promise.all([
      api.getMunicipalitySummary(id),
      api.getTimeSeries({ municipality_id: id }),
      api.getConditions(),
    ])
      .then(([sum, obs, conds]) => {
        if (cancelled) return
        setSummary(sum)
        setObservations(obs)
        setConditionNames(
          Object.fromEntries(conds.map((c) => [c.condition_id, c.condition_name])),
        )
      })
      .catch((err: Error) => {
        if (cancelled) return
        const msg = err?.message || ""
        if (msg.includes("404")) {
          setError("Município não encontrado.")
        } else {
          setError("Não foi possível carregar o município. Verifique se a API está disponível.")
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [id])

  if (loading) return <div className="text-slate-400">Carregando...</div>
  if (error) {
    return (
      <div className="max-w-4xl mx-auto space-y-4">
        <Link href="/alerts" className="flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Link>
        <div className="text-amber-400">{error}</div>
      </div>
    )
  }
  if (!summary) return <div className="text-slate-400">Município não encontrado.</div>

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link href="/alerts" className="flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300">
        <ArrowLeft className="w-4 h-4" /> Voltar
      </Link>

      <h1 className="text-2xl font-bold text-white">{summary.municipality.municipality_name}</h1>
      <SyntheticBanner />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="text-xs text-slate-500 uppercase">Estado</div>
          <div className="text-white font-medium">{summary.municipality.state}</div>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="text-xs text-slate-500 uppercase">Porte</div>
          <div className="text-white font-medium capitalize">{summary.municipality.population_band}</div>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="text-xs text-slate-500 uppercase">Região</div>
          <div className="text-white font-medium capitalize">{summary.municipality.region_type}</div>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="text-xs text-slate-500 uppercase">Sinais Históricos</div>
          <div className="text-orange-400 font-bold">{summary.active_alerts}</div>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="text-xs text-slate-500 uppercase">Completude Média</div>
          <div className="text-white font-mono">{summary.average_completeness}</div>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="text-xs text-slate-500 uppercase">Atraso Médio</div>
          <div className="text-white font-mono">{summary.average_delay}</div>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="text-xs text-slate-500 uppercase">Confiabilidade</div>
          <div className="text-emerald-400 font-bold">{summary.overall_reliability}</div>
        </div>
      </div>

      {observations.length > 0 && (
        <div className="bg-slate-800 rounded-lg p-5 border border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-3">Observações Recentes</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-slate-400 border-b border-slate-700">
                  <th className="py-2 px-3">Semana</th>
                  <th className="py-2 px-3">Condição</th>
                  <th className="py-2 px-3">Casos</th>
                  <th className="py-2 px-3">z-score</th>
                  <th className="py-2 px-3">Nível</th>
                </tr>
              </thead>
              <tbody>
                {observations.slice(-10).reverse().map((o) => (
                  <tr key={o.observation_id} className="border-b border-slate-700/50">
                    <td className="py-2 px-3 text-slate-300">
                      {o.year}-W{String(o.epidemiological_week).padStart(2, "0")}
                    </td>
                    <td className="py-2 px-3 text-slate-300">
                      {conditionNames[o.condition_id] || o.condition_id}
                    </td>
                    <td className="py-2 px-3 text-white">{o.reported_cases}</td>
                    <td className="py-2 px-3 font-mono text-slate-400">{o.z_score.toFixed(2)}</td>
                    <td className="py-2 px-3">
                      <span className="text-xs capitalize">{o.alert_level.replace("_", " ")}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
