"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { api } from "@/lib/api"
import type { AlertSignal } from "@/lib/types"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { SyntheticBanner } from "@/components/SyntheticBanner"

export default function AlertDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [alert, setAlert] = useState<AlertSignal | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    let cancelled = false
    api
      .getAlertDetail(id)
      .then((result) => {
        if (!cancelled) setAlert(result)
      })
      .catch((err: Error) => {
        if (cancelled) return
        const msg = err?.message || ""
        if (msg.includes("404")) {
          setError("Sinal não encontrado.")
        } else {
          setError("Não foi possível carregar o detalhe do sinal.")
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
      <div className="max-w-3xl mx-auto space-y-4">
        <Link href="/alerts" className="flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300">
          <ArrowLeft className="w-4 h-4" /> Voltar para Alertas
        </Link>
        <div className="text-amber-400">{error}</div>
      </div>
    )
  }
  if (!alert) return <div className="text-slate-400">Sinal não encontrado.</div>

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link href="/alerts" className="flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300">
        <ArrowLeft className="w-4 h-4" /> Voltar para Alertas
      </Link>

      <h1 className="text-2xl font-bold text-white">Detalhe do Sinal</h1>
      <SyntheticBanner />

      <div className="bg-slate-800 rounded-lg p-5 border border-slate-700 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-xs text-slate-500 uppercase">Município</span>
            <div className="text-white font-medium">
              <Link
                href={`/municipalities/${alert.municipality_id}`}
                className="text-emerald-400 hover:text-emerald-300"
              >
                {alert.municipality_name}
              </Link>
            </div>
          </div>
          <div>
            <span className="text-xs text-slate-500 uppercase">Condição</span>
            <div className="text-white font-medium">{alert.condition_name}</div>
          </div>
          <div>
            <span className="text-xs text-slate-500 uppercase">Semana</span>
            <div className="text-white font-mono">
              {alert.year}-W{String(alert.epidemiological_week).padStart(2, "0")}
            </div>
          </div>
          <div>
            <span className="text-xs text-slate-500 uppercase">Nível</span>
            <div className="text-white font-medium capitalize">
              {alert.alert_level.replace("_", " ")}
            </div>
          </div>
          <div>
            <span className="text-xs text-slate-500 uppercase">Casos Observados</span>
            <div className="text-white font-mono">{alert.observed_cases}</div>
          </div>
          <div>
            <span className="text-xs text-slate-500 uppercase">Casos Esperados</span>
            <div className="text-slate-400 font-mono">{alert.expected_cases.toFixed(2)}</div>
          </div>
          <div>
            <span className="text-xs text-slate-500 uppercase">z-score</span>
            <div className="text-orange-400 font-mono">{alert.z_score.toFixed(2)}</div>
          </div>
          <div>
            <span className="text-xs text-slate-500 uppercase">Confiabilidade</span>
            <div className="text-emerald-400 font-mono">{alert.reliability_score}/100</div>
          </div>
        </div>

        <div>
          <span className="text-xs text-slate-500 uppercase">Explicação</span>
          <div className="text-slate-300 text-sm mt-1">{alert.explanation}</div>
        </div>

        <div>
          <span className="text-xs text-slate-500 uppercase">Notas de Confiança</span>
          <div className="text-slate-400 text-sm mt-1">{alert.confidence_notes}</div>
        </div>

        {alert.data_quality_flags.length > 0 && (
          <div>
            <span className="text-xs text-slate-500 uppercase">Flags de Qualidade</span>
            <div className="flex flex-wrap gap-2 mt-1">
              {alert.data_quality_flags.map((flag, i) => (
                <span key={i} className="px-2 py-0.5 bg-amber-400/10 text-amber-400 rounded text-xs">
                  {flag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
