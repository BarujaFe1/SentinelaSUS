"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import type { ReportBrief } from "@/lib/types"
import { FileText } from "lucide-react"
import { SyntheticBanner } from "@/components/SyntheticBanner"

export default function BriefPage() {
  const [brief, setBrief] = useState<ReportBrief | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    api
      .getBrief()
      .then((result) => {
        if (!cancelled) setBrief(result)
      })
      .catch(() => {
        if (!cancelled) {
          setError("Não foi possível carregar o relatório. Verifique se a API está disponível.")
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
  if (!brief) return <div className="text-slate-400">Nenhum relatório disponível.</div>

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-white flex items-center gap-2">
        <FileText className="w-6 h-6 text-emerald-400" />
        Relatório Executivo
      </h1>
      <SyntheticBanner />

      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 space-y-6">
        <div className="text-xs text-slate-500">
          Gerado em: {new Date(brief.generated_at).toLocaleString("pt-BR")}
        </div>

        <section>
          <h2 className="text-lg font-semibold text-white mb-3">Principais Achados</h2>
          <ul className="space-y-2">
            {brief.main_findings.map((finding, i) => (
              <li key={i} className="flex gap-2 text-slate-300">
                <span className="text-emerald-400 mt-1">•</span>
                <span>{finding}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-3">Limitações</h2>
          <ul className="space-y-2">
            {brief.limitations.map((lim, i) => (
              <li key={i} className="flex gap-2 text-slate-400">
                <span className="text-amber-400 mt-1">•</span>
                <span>{lim}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-3">Próximos Checks Sugeridos</h2>
          <ul className="space-y-2">
            {brief.recommended_next_checks.map((rec, i) => (
              <li key={i} className="flex gap-2 text-slate-300">
                <span className="text-emerald-400 mt-1">→</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </section>

        <div className="border-t border-slate-700 pt-4">
          <p className="text-sm text-amber-400/80 leading-relaxed">
            {brief.disclaimer}
          </p>
        </div>
      </div>
    </div>
  )
}
