"use client"

import { useEffect, useState } from "react"
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts"
import { api } from "@/lib/api"
import type { Observation, Municipality, Condition } from "@/lib/types"
import { SyntheticBanner } from "@/components/SyntheticBanner"

export default function ExplorerPage() {
  const [municipalities, setMunicipalities] = useState<Municipality[]>([])
  const [conditions, setConditions] = useState<Condition[]>([])
  const [selectedMun, setSelectedMun] = useState("")
  const [selectedCond, setSelectedCond] = useState("")
  const [observations, setObservations] = useState<Observation[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [metaError, setMetaError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    Promise.all([api.getMunicipalities(), api.getConditions()])
      .then(([muns, conds]) => {
        if (cancelled) return
        setMunicipalities(muns)
        setConditions(conds)
      })
      .catch(() => {
        if (!cancelled) setMetaError("Não foi possível carregar municípios/condições.")
      })
    return () => {
      cancelled = true
    }
  }, [])

  const loadSeries = (mun: string, cond: string) => {
    setSelectedMun(mun)
    setSelectedCond(cond)
    setError(null)
    if (!mun || !cond) {
      setObservations([])
      setLoading(false)
      return
    }
    setLoading(true)
    api
      .getTimeSeries({ municipality_id: mun, condition_id: cond })
      .then(setObservations)
      .catch(() => setError("Não foi possível carregar a série temporal."))
      .finally(() => setLoading(false))
  }

  const chartData = observations.map((o) => ({
    week: `${o.year}-W${String(o.epidemiological_week).padStart(2, "0")}`,
    observed: o.reported_cases,
    baseline: o.baseline_mean,
    upper: o.baseline_mean + (o.baseline_std || 0) * 1.5,
    alert: o.alert_level,
  }))

  const alertColor = (level: string) => {
    switch (level) {
      case "sinal_forte": return "#ef4444"
      case "atencao": return "#f97316"
      case "observacao": return "#eab308"
      default: return "#22c55e"
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-white">Explorador de Séries Temporais</h1>
      <SyntheticBanner />

      {metaError && <div className="text-amber-400">{metaError}</div>}

      <div className="flex flex-col sm:flex-row gap-4">
        <label className="flex flex-col gap-1 text-sm text-slate-400 flex-1">
          Município
          <select
            className="bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white text-sm"
            value={selectedMun}
            onChange={(e) => loadSeries(e.target.value, selectedCond)}
          >
            <option value="">Selecione município</option>
            {municipalities.map((m) => (
              <option key={m.municipality_id} value={m.municipality_id}>
                {m.municipality_name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm text-slate-400 flex-1">
          Condição
          <select
            className="bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white text-sm"
            value={selectedCond}
            onChange={(e) => loadSeries(selectedMun, e.target.value)}
          >
            <option value="">Selecione condição</option>
            {conditions.map((c) => (
              <option key={c.condition_id} value={c.condition_id}>
                {c.condition_name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {loading && <div className="text-slate-400">Carregando série...</div>}
      {error && <div className="text-amber-400">{error}</div>}

      {!loading && !error && selectedMun && selectedCond && chartData.length === 0 && (
        <div className="text-slate-400">Nenhuma observação encontrada para este filtro.</div>
      )}

      {!selectedMun || !selectedCond ? (
        <div className="text-slate-500 text-sm">
          Selecione município e condição para visualizar a série com baseline e bandas.
        </div>
      ) : null}

      {chartData.length > 0 && (
        <div className="bg-slate-800 rounded-lg p-5 border border-slate-700">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="week" tick={{ fontSize: 10, fill: "#94a3b8" }} interval={10} />
              <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} />
              <Tooltip
                contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px" }}
                labelStyle={{ color: "#f1f5f9" }}
              />
              <Legend />
              <Line type="monotone" dataKey="observed" stroke="#22c55e" name="Casos Observados" dot={false} strokeWidth={2} />
              <Line type="monotone" dataKey="baseline" stroke="#64748b" name="Baseline" dot={false} strokeDasharray="4 4" />
              <Line type="monotone" dataKey="upper" stroke="#f97316" name="Limite Superior" dot={false} strokeDasharray="2 2" opacity={0.5} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {chartData.length > 0 && (
        <div className="bg-slate-800 rounded-lg p-5 border border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-3">Observações recentes</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <caption className="sr-only">Observações semanais da série selecionada</caption>
              <thead>
                <tr className="text-slate-400 border-b border-slate-700">
                  <th className="py-2 px-3">Semana</th>
                  <th className="py-2 px-3">Observados</th>
                  <th className="py-2 px-3">Esperados</th>
                  <th className="py-2 px-3">z-score</th>
                  <th className="py-2 px-3">Nível</th>
                  <th className="py-2 px-3">Confiabilidade</th>
                </tr>
              </thead>
              <tbody>
                {observations.slice(-20).reverse().map((o) => (
                  <tr key={o.observation_id} className="border-b border-slate-700/50">
                    <td className="py-2 px-3 text-slate-300">
                      {o.year}-W{String(o.epidemiological_week).padStart(2, "0")}
                    </td>
                    <td className="py-2 px-3 text-white">{o.reported_cases}</td>
                    <td className="py-2 px-3 text-slate-400">{o.expected_cases.toFixed(1)}</td>
                    <td className={`py-2 px-3 font-mono ${o.z_score > 2 ? "text-orange-400" : "text-slate-300"}`}>
                      {o.z_score.toFixed(2)}
                    </td>
                    <td className="py-2 px-3">
                      <span
                        className="px-2 py-0.5 rounded text-xs font-medium"
                        style={{ backgroundColor: alertColor(o.alert_level) + "22", color: alertColor(o.alert_level) }}
                      >
                        {o.alert_level.replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-slate-400">{o.reliability_score}</td>
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
