"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import type { OverviewKPIs } from "@/lib/types"
import { Activity, AlertTriangle, BarChart3, ShieldCheck } from "lucide-react"
import { SyntheticBanner } from "@/components/SyntheticBanner"

export default function OverviewPage() {
  const [data, setData] = useState<OverviewKPIs | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    api
      .getOverview()
      .then((result) => {
        if (!cancelled) setData(result)
      })
      .catch(() => {
        if (!cancelled) {
          setError("Não foi possível carregar a visão geral. Verifique se a API está disponível.")
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  if (loading) return <div className="text-slate-400">Carregando...</div>
  if (error) return <div className="text-amber-400">{error}</div>
  if (!data) return <div className="text-slate-400">Nenhum dado disponível.</div>

  const alertColors: Record<string, string> = {
    normal: "text-green-400",
    observacao: "text-yellow-400",
    atencao: "text-orange-400",
    sinal_forte: "text-red-400",
    nao_interpretavel: "text-slate-500",
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-white">Visão Geral da Vigilância</h1>
      <SyntheticBanner />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center gap-2 text-emerald-400 mb-1">
            <BarChart3 className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wider">Municípios</span>
          </div>
          <div className="text-3xl font-bold text-white">{data.total_municipalities}</div>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center gap-2 text-emerald-400 mb-1">
            <Activity className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wider">Condições</span>
          </div>
          <div className="text-3xl font-bold text-white">{data.total_conditions}</div>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center gap-2 text-emerald-400 mb-1">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wider">Não Interpretáveis</span>
          </div>
          <div className="text-3xl font-bold text-white">{data.non_interpretable_count}</div>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center gap-2 text-emerald-400 mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wider">Confiab. Média</span>
          </div>
          <div className="text-3xl font-bold text-white">{data.average_reliability}</div>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center gap-2 text-emerald-400 mb-1">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wider">Issues de Qualidade</span>
          </div>
          <div className="text-3xl font-bold text-white">{data.total_quality_issues}</div>
        </div>
      </div>

      <div className="bg-slate-800 rounded-lg p-5 border border-slate-700">
        <h2 className="text-lg font-semibold text-white mb-3">Distribuição de Alertas</h2>
        <div className="space-y-2">
          {Object.entries(data.alert_counts).map(([level, count]) => (
            <div key={level} className="flex items-center justify-between">
              <span className={`text-sm capitalize ${alertColors[level] || "text-slate-400"}`}>
                {level.replace("_", " ")}
              </span>
              <span className="text-sm font-mono text-white">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
