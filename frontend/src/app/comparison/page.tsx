"use client"

import { SyntheticBanner } from "@/components/SyntheticBanner"

export default function ComparisonPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-white">Comparação Metodológica</h1>
      <SyntheticBanner />
      <div className="bg-slate-800 rounded-lg p-5 border border-slate-700 space-y-4">
        <p className="text-slate-300">
          Esta página compara os dois métodos de detecção implementados no SentinelaSUS:
          <strong className="text-white"> rolling z-score</strong> e{" "}
          <strong className="text-white"> MAD robusto</strong>.
        </p>
        <p className="text-slate-400 text-sm">
          O rolling z-score é o método padrão do MVP. O MAD robusto é oferecido como comparação
          metodológica para mostrar onde os métodos concordam ou divergem.
        </p>
        <div className="border-t border-slate-700 pt-4">
          <h3 className="text-white font-medium mb-2">Rolling z-score</h3>
          <p className="text-sm text-slate-400">
            z = (observado - média_baseline) / desvio_baseline. Sensível a outliers, mas simples e explicável.
          </p>
        </div>
        <div className="border-t border-slate-700 pt-4">
          <h3 className="text-white font-medium mb-2">MAD robusto</h3>
          <p className="text-sm text-slate-400">
            z_robusto = (observado - mediana_baseline) / (MAD * 1.4826). Mais robusto a outliers, menos familiar.
          </p>
        </div>
        <div className="border-t border-slate-700 pt-4">
          <p className="text-sm text-slate-500">
            Esta comparação não valida nenhum método como superior. Ambos são aproximações
            estatísticas com limitações específicas para cada contexto de dados.
          </p>
        </div>
      </div>
    </div>
  )
}
