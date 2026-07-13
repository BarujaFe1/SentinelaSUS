"use client"

import { useEffect, useMemo, useState } from "react"
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts"
import { api } from "@/lib/api"
import type { Observation, Municipality, Condition } from "@/lib/types"
import { SyntheticBanner } from "@/components/SyntheticBanner"

const Z_OBS = 1.5
const Z_ATT = 2.0
const Z_STRONG = 2.5

function levelFromScore(score: number, sufficient: boolean) {
  if (!sufficient) return "nao_interpretavel"
  // Assinado — espelha backend/pipeline/detector.py (não usa |z|).
  if (score < Z_OBS) return "normal"
  if (score < Z_ATT) return "observacao"
  if (score < Z_STRONG) return "atencao"
  return "sinal_forte"
}

export default function ComparisonPage() {
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
        if (!cancelled) setMetaError("Não foi possível carregar filtros. Verifique a API.")
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
      return
    }
    setLoading(true)
    api
      .getTimeSeries({ municipality_id: mun, condition_id: cond })
      .then(setObservations)
      .catch(() => setError("Não foi possível carregar a série para comparação."))
      .finally(() => setLoading(false))
  }

  const points = useMemo(
    () =>
      observations
        .filter((o) => o.robust_score != null && Number.isFinite(o.z_score))
        .map((o) => ({
          z: Number(o.z_score.toFixed(3)),
          robust: Number((o.robust_score as number).toFixed(3)),
          week: `${o.year}-W${String(o.epidemiological_week).padStart(2, "0")}`,
          alert: o.alert_level,
        })),
    [observations],
  )

  const stats = useMemo(() => {
    if (points.length === 0) return null
    let agree = 0
    for (const p of points) {
      const sufficient = p.alert !== "nao_interpretavel"
      const zLevel = levelFromScore(p.z, sufficient)
      const rLevel = levelFromScore(p.robust, sufficient)
      if (zLevel === rLevel) agree += 1
    }
    const corr =
      points.length > 1
        ? pearson(
            points.map((p) => p.z),
            points.map((p) => p.robust),
          )
        : null
    return {
      n: points.length,
      agreementPct: Math.round((agree / points.length) * 100),
      corr,
    }
  }, [points])

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-white">Comparação Metodológica</h1>
      <SyntheticBanner />

      <div className="bg-slate-800 rounded-lg p-5 border border-slate-700 space-y-3">
        <p className="text-slate-300 text-sm">
          Comparação empírica entre <strong className="text-white">z-score sazonal</strong> e{" "}
          <strong className="text-white">MAD robusto</strong> na mesma série sintética.
          Concordância de nível usa os mesmos limiares assinados (1.5 / 2.0 / 2.5), espelhando o backend.
        </p>
        <p className="text-slate-500 text-sm">
          Nenhum método é declarado superior. Ambos são aproximações com limitações distintas.
        </p>
      </div>

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

      {loading && <div className="text-slate-400">Carregando comparação...</div>}
      {error && <div className="text-amber-400">{error}</div>}

      {!loading && !error && selectedMun && selectedCond && points.length === 0 && (
        <div className="text-slate-400">Sem pontos com z-score e MAD disponíveis para esta série.</div>
      )}

      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="text-xs text-slate-500 uppercase">Pontos</div>
            <div className="text-2xl font-bold text-white">{stats.n}</div>
          </div>
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="text-xs text-slate-500 uppercase">Concordância de nível</div>
            <div className="text-2xl font-bold text-emerald-400">{stats.agreementPct}%</div>
          </div>
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="text-xs text-slate-500 uppercase">Correlação (Pearson)</div>
            <div className="text-2xl font-bold text-white">
              {stats.corr == null ? "n/d" : stats.corr.toFixed(3)}
            </div>
          </div>
        </div>
      )}

      {points.length > 0 && (
        <div className="bg-slate-800 rounded-lg p-5 border border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-3">z-score × MAD robusto</h2>
          <ResponsiveContainer width="100%" height={420}>
            <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis
                type="number"
                dataKey="z"
                name="z-score"
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                label={{ value: "z-score", position: "insideBottom", offset: -5, fill: "#94a3b8" }}
              />
              <YAxis
                type="number"
                dataKey="robust"
                name="MAD"
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                label={{ value: "MAD robusto", angle: -90, position: "insideLeft", fill: "#94a3b8" }}
              />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px" }}
                labelStyle={{ color: "#f1f5f9" }}
              />
              <ReferenceLine x={0} stroke="#475569" />
              <ReferenceLine y={0} stroke="#475569" />
              <Scatter data={points} fill="#34d399" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}

function pearson(xs: number[], ys: number[]) {
  const n = xs.length
  const mx = xs.reduce((a, b) => a + b, 0) / n
  const my = ys.reduce((a, b) => a + b, 0) / n
  let num = 0
  let dx = 0
  let dy = 0
  for (let i = 0; i < n; i++) {
    const a = xs[i] - mx
    const b = ys[i] - my
    num += a * b
    dx += a * a
    dy += b * b
  }
  if (dx === 0 || dy === 0) return null
  return num / Math.sqrt(dx * dy)
}
