"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { api } from "@/lib/api"
import type { AlertSignal } from "@/lib/types"
import { SyntheticBanner } from "@/components/SyntheticBanner"

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<AlertSignal[]>([])
  const [levelFilter, setLevelFilter] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    api
      .getAlerts({ limit: 200 })
      .then((result) => {
        if (!cancelled) setAlerts(result)
      })
      .catch(() => {
        if (!cancelled) {
          setError("Não foi possível carregar os alertas. Verifique se a API está disponível.")
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const filtered = levelFilter ? alerts.filter((a) => a.alert_level === levelFilter) : alerts

  const alertColor = (level: string) => {
    switch (level) {
      case "sinal_forte": return "text-red-400 bg-red-400/10 border-red-400/30"
      case "atencao": return "text-orange-400 bg-orange-400/10 border-orange-400/30"
      case "observacao": return "text-yellow-400 bg-yellow-400/10 border-yellow-400/30"
      case "nao_interpretavel": return "text-slate-500 bg-slate-500/10 border-slate-500/30"
      default: return "text-green-400 bg-green-400/10 border-green-400/30"
    }
  }

  const reliabilityColor = (score: number) => {
    if (score >= 80) return "text-green-400"
    if (score >= 50) return "text-yellow-400"
    if (score >= 30) return "text-orange-400"
    return "text-red-400"
  }

  if (loading) return <div className="text-slate-400">Carregando...</div>
  if (error) return <div className="text-amber-400">{error}</div>

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Central de Alertas</h1>
        <select
          className="bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white text-sm"
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value)}
        >
          <option value="">Todos os níveis</option>
          <option value="sinal_forte">Sinal Forte</option>
          <option value="atencao">Atenção</option>
          <option value="observacao">Observação</option>
          <option value="nao_interpretavel">Não Interpretável</option>
          <option value="normal">Normal</option>
        </select>
      </div>
      <SyntheticBanner />

      <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="text-slate-400 border-b border-slate-700 bg-slate-800/50">
                <th className="py-3 px-4 font-medium">Município</th>
                <th className="py-3 px-4 font-medium">Condição</th>
                <th className="py-3 px-4 font-medium">Semana</th>
                <th className="py-3 px-4 font-medium">Observados</th>
                <th className="py-3 px-4 font-medium">Esperados</th>
                <th className="py-3 px-4 font-medium">z-score</th>
                <th className="py-3 px-4 font-medium">Nível</th>
                <th className="py-3 px-4 font-medium">Confiabilidade</th>
                <th className="py-3 px-4 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((alert) => (
                <tr key={alert.signal_id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                  <td className="py-3 px-4 text-white">
                    <Link
                      href={`/municipalities/${alert.municipality_id}`}
                      className="text-emerald-400 hover:text-emerald-300"
                    >
                      {alert.municipality_name}
                    </Link>
                  </td>
                  <td className="py-3 px-4 text-slate-300">{alert.condition_name}</td>
                  <td className="py-3 px-4 text-slate-400">
                    {alert.year}-W{String(alert.epidemiological_week).padStart(2, "0")}
                  </td>
                  <td className="py-3 px-4 text-white font-mono">{alert.observed_cases}</td>
                  <td className="py-3 px-4 text-slate-400 font-mono">{alert.expected_cases.toFixed(1)}</td>
                  <td className={`py-3 px-4 font-mono ${alert.z_score > 2 ? "text-orange-400" : "text-slate-300"}`}>
                    {alert.z_score.toFixed(2)}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium border ${alertColor(alert.alert_level)}`}>
                      {alert.alert_level.replace("_", " ")}
                    </span>
                  </td>
                  <td className={`py-3 px-4 font-mono ${reliabilityColor(alert.reliability_score)}`}>
                    {alert.reliability_score}
                  </td>
                  <td className="py-3 px-4">
                    <Link
                      href={`/alerts/${alert.signal_id}`}
                      className="text-emerald-400 hover:text-emerald-300 text-xs"
                    >
                      Detalhes
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
