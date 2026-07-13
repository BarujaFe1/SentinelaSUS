"use client"

import Link from "next/link"
import {
  Activity,
  BarChart3,
  AlertTriangle,
  FileText,
  ShieldCheck,
  BookOpen,
  FlaskConical,
  GitCompare,
} from "lucide-react"
import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import type { OverviewKPIs } from "@/lib/types"

export default function Home() {
  const [overview, setOverview] = useState<OverviewKPIs | null>(null)
  const [overviewError, setOverviewError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    api
      .getOverview()
      .then((data) => {
        if (!cancelled) setOverview(data)
      })
      .catch(() => {
        if (!cancelled) setOverviewError("API indisponível — KPIs não carregados.")
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-white flex items-center gap-3">
          <Activity className="w-8 h-8 text-emerald-400" />
          SentinelaSUS
        </h1>
        <p className="text-xl text-slate-400">
          Laboratório analítico de vigilância epidemiológica sintética: sinais interpretáveis,
          comparação z vs MAD e comunicação responsável de incerteza.
        </p>
      </div>

      <div className="bg-amber-900/30 border border-amber-700/50 rounded-lg p-4 text-amber-200 text-sm">
        <strong>Dados sintéticos para fins demonstrativos.</strong> Este projeto não substitui sistemas
        oficiais de vigilância epidemiológica. Não faz diagnóstico, recomendação clínica ou previsão de casos.
      </div>

      {overviewError && <div className="text-amber-400 text-sm">{overviewError}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {overview && (
          <>
            <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
              <div className="text-2xl font-bold text-white">{overview.total_municipalities}</div>
              <div className="text-sm text-slate-400">Municípios sintéticos</div>
            </div>
            <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
              <div className="text-2xl font-bold text-white">{overview.total_conditions}</div>
              <div className="text-sm text-slate-400">Condições simuladas</div>
            </div>
            <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
              <div className="text-2xl font-bold text-white">{overview.total_weeks_analyzed}</div>
              <div className="text-sm text-slate-400">Semanas analisadas</div>
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/overview" className="bg-slate-800 rounded-lg p-5 border border-slate-700 hover:border-emerald-700 transition-colors group">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-5 h-5 text-emerald-400" />
            <h3 className="font-semibold text-white">Visão Geral</h3>
          </div>
          <p className="text-sm text-slate-400">KPIs, distribuição de alertas e confiabilidade média.</p>
        </Link>
        <Link href="/explorer" className="bg-slate-800 rounded-lg p-5 border border-slate-700 hover:border-emerald-700 transition-colors group">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            <h3 className="font-semibold text-white">Explorador</h3>
          </div>
          <p className="text-sm text-slate-400">Série temporal com baseline e bandas de referência.</p>
        </Link>
        <Link href="/alerts" className="bg-slate-800 rounded-lg p-5 border border-slate-700 hover:border-emerald-700 transition-colors group">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-emerald-400" />
            <h3 className="font-semibold text-white">Alertas</h3>
          </div>
          <p className="text-sm text-slate-400">Sinais estatísticos por nível e confiabilidade.</p>
        </Link>
        <Link href="/simulation" className="bg-slate-800 rounded-lg p-5 border border-slate-700 hover:border-emerald-700 transition-colors group">
          <div className="flex items-center gap-2 mb-2">
            <FlaskConical className="w-5 h-5 text-emerald-400" />
            <h3 className="font-semibold text-white">Simulação de falso alerta</h3>
          </div>
          <p className="text-sm text-slate-400">TP/FP/FN pedagógicos vs anomalias plantadas (z e MAD).</p>
        </Link>
        <Link href="/comparison" className="bg-slate-800 rounded-lg p-5 border border-slate-700 hover:border-emerald-700 transition-colors group">
          <div className="flex items-center gap-2 mb-2">
            <GitCompare className="w-5 h-5 text-emerald-400" />
            <h3 className="font-semibold text-white">Comparação z vs MAD</h3>
          </div>
          <p className="text-sm text-slate-400">Scatter e concordância empírica na mesma série.</p>
        </Link>
        <Link href="/brief" className="bg-slate-800 rounded-lg p-5 border border-slate-700 hover:border-emerald-700 transition-colors group">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            <h3 className="font-semibold text-white">Relatório Executivo</h3>
          </div>
          <p className="text-sm text-slate-400">Brief determinístico com achados e limitações.</p>
        </Link>
        <Link href="/methodology" className="bg-slate-800 rounded-lg p-5 border border-slate-700 hover:border-emerald-700 transition-colors group">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-5 h-5 text-emerald-400" />
            <h3 className="font-semibold text-white">Metodologia visual</h3>
          </div>
          <p className="text-sm text-slate-400">Fórmulas, papéis (oficial vs comparador) e série dual.</p>
        </Link>
        <Link href="/responsible-analytics" className="bg-slate-800 rounded-lg p-5 border border-slate-700 hover:border-emerald-700 transition-colors group">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="font-semibold text-white">Memo de uso responsável</h3>
          </div>
          <p className="text-sm text-slate-400">Anti-escopo, linguagem e proveniência — imprimível.</p>
        </Link>
      </div>
    </div>
  )
}
