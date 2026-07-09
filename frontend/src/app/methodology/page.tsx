"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import { BookOpen } from "lucide-react"

interface MethodologyData {
  methods: {
    baseline: { description: string }
    z_score: { description: string; thresholds: Record<string, string> }
    robust_score: { description: string }
    reliability_score: { description: string; components: Record<string, number>; interpretation: Record<string, string> }
  }
  alert_levels: Record<string, string>
  limitations: string[]
}

export default function MethodologyPage() {
  const [methodology, setMethodology] = useState<MethodologyData | null>(null)

  useEffect(() => {
    api.getMethodology().then((data) => setMethodology(data as unknown as MethodologyData)).catch(() => {})
  }, [])

  const m = methodology

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-white flex items-center gap-2">
        <BookOpen className="w-6 h-6 text-emerald-400" />
        Metodologia e Limites
      </h1>

      {m?.methods && (
        <div className="space-y-6">
          <section className="bg-slate-800 rounded-lg p-5 border border-slate-700">
            <h2 className="text-lg font-semibold text-white mb-2">Baseline Histórico</h2>
            <p className="text-slate-300 text-sm">{m.methods.baseline.description}</p>
          </section>

          <section className="bg-slate-800 rounded-lg p-5 border border-slate-700">
            <h2 className="text-lg font-semibold text-white mb-2">Z-Score</h2>
            <p className="text-slate-300 text-sm mb-3">{m.methods.z_score.description}</p>
            <div className="space-y-1">
              {Object.entries(m.methods.z_score.thresholds).map(([level, threshold]) => (
                <div key={level} className="flex items-center gap-2 text-sm">
                  <span className="text-slate-400 capitalize w-28">{level.replace("_", " ")}</span>
                  <span className="text-slate-500">→</span>
                  <span className="text-slate-300 font-mono">{threshold}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-slate-800 rounded-lg p-5 border border-slate-700">
            <h2 className="text-lg font-semibold text-white mb-2">Reliability Score</h2>
            <p className="text-slate-300 text-sm mb-3">{m.methods.reliability_score.description}</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {Object.entries(m.methods.reliability_score.components).map(([component, weight]) => (
                <div key={component} className="flex justify-between bg-slate-700/50 rounded px-3 py-1.5">
                  <span className="text-slate-400 capitalize">{component.replace("_", " ")}</span>
                  <span className="text-white font-mono">{weight}%</span>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-slate-800 rounded-lg p-5 border border-slate-700">
            <h2 className="text-lg font-semibold text-white mb-2">Alert Levels</h2>
            <div className="space-y-1">
              {Object.entries(m.alert_levels).map(([level, desc]) => (
                <div key={level} className="flex items-start gap-2 text-sm">
                  <span className="text-slate-400 capitalize w-32 shrink-0">{level.replace("_", " ")}</span>
                  <span className="text-slate-300">{desc}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-slate-800 rounded-lg p-5 border border-slate-700">
            <h2 className="text-lg font-semibold text-white mb-2">Limitações</h2>
            <ul className="space-y-1">
              {m.limitations.map((lim, i) => (
                <li key={i} className="flex gap-2 text-sm text-slate-400">
                  <span className="text-amber-400">•</span>
                  <span>{lim}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </div>
  )
}
