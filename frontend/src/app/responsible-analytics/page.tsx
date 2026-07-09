import { ShieldCheck, AlertTriangle, BookOpen } from "lucide-react"

export default function ResponsibleAnalyticsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-white flex items-center gap-2">
        <ShieldCheck className="w-6 h-6 text-emerald-400" />
        Responsabilidade Analítica
      </h1>

      <div className="bg-slate-800 rounded-lg p-5 border border-slate-700 space-y-4">
        <p className="text-slate-300 leading-relaxed">
          SentinelaSUS é uma ferramenta de <strong className="text-white">demonstração e aprendizado</strong>.
          Seu objetivo é ilustrar como séries temporais epidemiológicas podem ser analisadas com
          métodos estatísticos simples, transparência metodológica e comunicação responsável.
        </p>
      </div>

      <div className="bg-red-900/20 border border-red-800/40 rounded-lg p-5">
        <h2 className="text-lg font-semibold text-red-400 flex items-center gap-2 mb-3">
          <AlertTriangle className="w-5 h-5" />
          O que este sistema NÃO faz
        </h2>
        <ul className="space-y-2 text-sm text-red-300">
          <li className="flex gap-2"><span className="text-red-400">✕</span> Não detecta surtos reais</li>
          <li className="flex gap-2"><span className="text-red-400">✕</span> Não substitui vigilância epidemiológica oficial (Sinan, Sivep-Gripe, etc.)</li>
          <li className="flex gap-2"><span className="text-red-400">✕</span> Não faz diagnóstico clínico</li>
          <li className="flex gap-2"><span className="text-red-400">✕</span> Não recomenda política pública</li>
          <li className="flex gap-2"><span className="text-red-400">✕</span> Não prevê casos futuros</li>
          <li className="flex gap-2"><span className="text-red-400">✕</span> Não usa dados reais de pacientes</li>
          <li className="flex gap-2"><span className="text-red-400">✕</span> Não toma decisões automáticas</li>
        </ul>
      </div>

      <div className="bg-slate-800 rounded-lg p-5 border border-slate-700">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-3">
          <BookOpen className="w-5 h-5 text-emerald-400" />
          Sinal estatístico vs. Diagnóstico
        </h2>
        <p className="text-slate-300 text-sm leading-relaxed">
          Um <strong className="text-white">sinal estatístico</strong> indica que o número de casos observados
          em uma semana está acima do que seria esperado com base no histórico. Isso pode acontecer por
          variação aleatória, melhoria na notificação, mudança de critério diagnóstico ou aumento real
          de incidência. Apenas uma investigação epidemiológica de campo pode confirmar a natureza de um sinal.
        </p>
      </div>

      <div className="bg-slate-800 rounded-lg p-5 border border-slate-700">
        <h2 className="text-lg font-semibold text-white mb-3">Linguagem Responsável</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <h3 className="text-emerald-400 font-medium mb-2">Usamos</h3>
            <ul className="space-y-1 text-slate-300">
              <li>• sinal estatístico</li>
              <li>• variação acima do esperado</li>
              <li>• baseline histórico</li>
              <li>• monitoramento exploratório</li>
              <li>• requer revisão técnica</li>
              <li>• não substitui análise oficial</li>
            </ul>
          </div>
          <div>
            <h3 className="text-red-400 font-medium mb-2">Evitamos</h3>
            <ul className="space-y-1 text-slate-400">
              <li>• surto detectado</li>
              <li>• epidemia confirmada</li>
              <li>• município em crise</li>
              <li>• previsão de casos</li>
              <li>• recomendação médica</li>
              <li>• alarme oficial</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
