"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import type { DataQualityIssue } from "@/lib/types"
import { SyntheticBanner } from "@/components/SyntheticBanner"

export default function QualityPage() {
  const [issues, setIssues] = useState<DataQualityIssue[]>([])
  const [issueFilter, setIssueFilter] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    api
      .getQualityIssues({ limit: 200 })
      .then((result) => {
        if (!cancelled) setIssues(result)
      })
      .catch(() => {
        if (!cancelled) {
          setError("Não foi possível carregar os problemas de qualidade.")
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const filtered = issueFilter ? issues.filter((i) => i.issue_type === issueFilter) : issues

  const severityColor = (s: string) => {
    switch (s) {
      case "high": return "text-red-400"
      case "medium": return "text-yellow-400"
      case "low": return "text-slate-400"
      default: return "text-slate-400"
    }
  }

  const issueTypes = [...new Set(issues.map((i) => i.issue_type))]

  if (loading) return <div className="text-slate-400">Carregando...</div>
  if (error) return <div className="text-amber-400">{error}</div>

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Central de Qualidade de Dados</h1>
        <select
          className="bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white text-sm"
          value={issueFilter}
          onChange={(e) => setIssueFilter(e.target.value)}
        >
          <option value="">Todos os tipos</option>
          {issueTypes.map((t) => (
            <option key={t} value={t}>{t.replace("_", " ")}</option>
          ))}
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
                <th className="py-3 px-4 font-medium">Tipo</th>
                <th className="py-3 px-4 font-medium">Severidade</th>
                <th className="py-3 px-4 font-medium">Métrica Afetada</th>
                <th className="py-3 px-4 font-medium">Explicação</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((issue) => (
                <tr key={issue.issue_id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                  <td className="py-3 px-4 text-white">{issue.municipality_name}</td>
                  <td className="py-3 px-4 text-slate-300">{issue.condition_name}</td>
                  <td className="py-3 px-4 text-slate-400">
                    {issue.year}-W{String(issue.week).padStart(2, "0")}
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-slate-300 capitalize">{issue.issue_type.replace("_", " ")}</span>
                  </td>
                  <td className={`py-3 px-4 font-medium ${severityColor(issue.severity)}`}>
                    {issue.severity}
                  </td>
                  <td className="py-3 px-4 text-slate-400">{issue.affected_metric}</td>
                  <td className="py-3 px-4 text-slate-500 max-w-xs truncate">{issue.explanation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
