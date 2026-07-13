"use client"

import Link from "next/link"
import { ShieldCheck, AlertTriangle, BookOpen, Printer } from "lucide-react"
import { SyntheticBanner } from "@/components/SyntheticBanner"

export default function ResponsibleAnalyticsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 print:max-w-none print:text-black">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2 print:text-black">
          <ShieldCheck className="w-6 h-6 text-emerald-400 print:text-black" />
          Memo de uso responsável
        </h1>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-200 hover:bg-slate-700 print:hidden"
        >
          <Printer className="w-4 h-4" />
          Imprimir / PDF
        </button>
      </div>

      <SyntheticBanner />

      <article className="space-y-6 print:space-y-4">
        <header className="bg-slate-800 rounded-lg p-5 border border-slate-700 print:border print:border-black print:bg-white">
          <p className="text-xs uppercase tracking-wide text-slate-500 print:text-neutral-600 mb-2">
            SentinelaSUS · v0.2 · Documento de portfólio
          </p>
          <p className="text-slate-300 leading-relaxed print:text-neutral-800">
            Este memo formaliza o escopo ético e analítico do projeto. SentinelaSUS é um{" "}
            <strong className="text-white print:text-black">laboratório demonstrativo</strong> com
            dados 100% sintéticos — não vigilância oficial, não diagnóstico, não previsão.
          </p>
          <p className="text-slate-500 text-sm mt-3 print:text-neutral-600">
            Versão canônica em Markdown:{" "}
            <code className="text-slate-400">docs/RESPONSIBLE_USE_MEMO.md</code>
          </p>
        </header>

        <section className="bg-red-900/20 border border-red-800/40 rounded-lg p-5 print:bg-white print:border-red-700">
          <h2 className="text-lg font-semibold text-red-400 flex items-center gap-2 mb-3 print:text-red-700">
            <AlertTriangle className="w-5 h-5" />
            O que este sistema NÃO faz
          </h2>
          <ul className="space-y-2 text-sm text-red-300 print:text-neutral-800">
            <li className="flex gap-2"><span className="text-red-400">✕</span> Não detecta surtos reais</li>
            <li className="flex gap-2"><span className="text-red-400">✕</span> Não substitui vigilância epidemiológica oficial</li>
            <li className="flex gap-2"><span className="text-red-400">✕</span> Não faz diagnóstico clínico</li>
            <li className="flex gap-2"><span className="text-red-400">✕</span> Não recomenda política pública</li>
            <li className="flex gap-2"><span className="text-red-400">✕</span> Não prevê casos futuros</li>
            <li className="flex gap-2"><span className="text-red-400">✕</span> Não usa dados reais de pacientes</li>
            <li className="flex gap-2"><span className="text-red-400">✕</span> Não toma decisões automáticas</li>
          </ul>
        </section>

        <section className="bg-slate-800 rounded-lg p-5 border border-slate-700 print:bg-white print:border-black">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-3 print:text-black">
            <BookOpen className="w-5 h-5 text-emerald-400 print:text-black" />
            Sinal estatístico vs. evento confirmado
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed print:text-neutral-800">
            Um <strong className="text-white print:text-black">sinal estatístico</strong> indica
            desvio em relação ao baseline sintético. Pode ser ruído, melhoria de notificação,
            artefato de qualidade ou aumento real simulado. Sem investigação de campo, nenhum
            sinal “confirma” evento. A simulação de{" "}
            <Link href="/simulation" className="text-emerald-400 hover:underline print:text-black print:underline">
              falsos alertas
            </Link>{" "}
            deixa esse trade-off explícito.
          </p>
        </section>

        <section className="bg-slate-800 rounded-lg p-5 border border-slate-700 print:bg-white print:border-black">
          <h2 className="text-lg font-semibold text-white mb-3 print:text-black">Linguagem responsável</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="text-emerald-400 font-medium mb-2 print:text-black">Usamos</h3>
              <ul className="space-y-1 text-slate-300 print:text-neutral-800">
                <li>• sinal estatístico</li>
                <li>• variação acima do esperado</li>
                <li>• baseline histórico</li>
                <li>• monitoramento exploratório</li>
                <li>• requer revisão técnica</li>
                <li>• não substitui análise oficial</li>
              </ul>
            </div>
            <div>
              <h3 className="text-red-400 font-medium mb-2 print:text-black">Evitamos</h3>
              <ul className="space-y-1 text-slate-400 print:text-neutral-700">
                <li>• surto detectado</li>
                <li>• epidemia confirmada</li>
                <li>• município em crise</li>
                <li>• previsão de casos</li>
                <li>• recomendação médica</li>
                <li>• alarme oficial</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-slate-800 rounded-lg p-5 border border-slate-700 print:bg-white print:border-black text-sm text-slate-300 print:text-neutral-800 space-y-2">
          <h2 className="text-lg font-semibold text-white mb-2 print:text-black">Proveniência</h2>
          <p>Gerador determinístico (seed 42) → pipeline bronze/silver/gold → API → UI.</p>
          <p>
            Ground truth de anomalias plantadas alimenta a avaliação pedagógica em{" "}
            <code className="text-slate-400">/api/v1/evaluation/false-alerts</code>.
          </p>
          <p>
            Limite metodológico conhecido: baseline da mesma semana inclui o ano avaliado (MVP).
          </p>
        </section>
      </article>
    </div>
  )
}
