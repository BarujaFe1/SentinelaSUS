"use client"

import Link from "next/link"
import { Activity, BarChart3, AlertTriangle, FileText, ShieldCheck, BookOpen } from "lucide-react"
import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import type { OverviewKPIs } from "@/lib/types"

export default function Home() {
  const [overview, setOverview] = useState<OverviewKPIs | null>(null)

  useEffect(() => {
    api.getOverview().then(setOverview).catch(() => {})
  }, [])

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-white flex items-center gap-3">
          <Activity className="w-8 h-8 text-emerald-400" />
          SentinelaSUS
        </h1>
        <p className="text-xl text-slate-400">
          Painel responsável de vigilância epidemiológica sintética para detectar sinais estatísticos
          incomuns em séries temporais municipais.
        </p>
      </div>

      <div className="bg-amber-900/30 border border-amber-700/50 rounded-lg p-4 text-amber-200 text-sm">
        <strong>Dados sintéticos para fins demonstrativos.</strong> Este projeto não substitui sistemas
        oficiais de vigilância epidemiológica. Não faz diagnóstico, recomendação clínica ou previsão de casos.
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {overview && (
          <>
            <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
              <div className="text-2xl font-bold text-white">{overview.total_municipalities}</div>
              <div className="text-sm text-slate-400">Municípios monitorados</div>
            </div>
            <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
              <div className="text-2xl font-bold text-white">{overview.total_conditions}</div>
              <div className="text-sm text-slate-400">Condições monitoradas</div>
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
          <p className="text-sm text-slate-400">Série temporal com baseline e bandas de controle.</p>
        </Link>
        <Link href="/alerts" className="bg-slate-800 rounded-lg p-5 border border-slate-700 hover:border-emerald-700 transition-colors group">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-emerald-400" />
            <h3 className="font-semibold text-white">Alertas</h3>
          </div>
          <p className="text-sm text-slate-400">Sinais estatísticos por nível e confiabilidade.</p>
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
            <h3 className="font-semibold text-white">Metodologia</h3>
          </div>
          <p className="text-sm text-slate-400">Documentação detalhada dos métodos e limites.</p>
        </Link>
        <Link href="/responsible-analytics" className="bg-slate-800 rounded-lg p-5 border border-slate-700 hover:border-emerald-700 transition-colors group">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="font-semibold text-white">Responsabilidade Analítica</h3>
          </div>
          <p className="text-sm text-slate-400">Princípios éticos e antiescopo do projeto.</p>
        </Link>
      </div>
    </div>
  )
}
