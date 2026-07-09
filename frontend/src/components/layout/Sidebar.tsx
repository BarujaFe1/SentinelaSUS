"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Activity,
  AlertTriangle,
  BarChart3,
  FileText,
  GitCompare,
  Home,
  BookOpen,
  ShieldCheck,
  Table,
} from "lucide-react"

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/overview", label: "Visão Geral", icon: BarChart3 },
  { href: "/explorer", label: "Explorador", icon: Activity },
  { href: "/alerts", label: "Alertas", icon: AlertTriangle },
  { href: "/quality", label: "Qualidade", icon: Table },
  { href: "/brief", label: "Relatório", icon: FileText },
  { href: "/comparison", label: "Comparação", icon: GitCompare },
  { href: "/methodology", label: "Metodologia", icon: BookOpen },
  { href: "/responsible-analytics", label: "Ética", icon: ShieldCheck },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 h-screen bg-slate-900 text-slate-300 flex flex-col border-r border-slate-700">
      <div className="p-4 border-b border-slate-700">
        <Link href="/" className="flex items-center gap-2">
          <Activity className="w-6 h-6 text-emerald-400" />
          <span className="font-bold text-lg text-white">SentinelaSUS</span>
        </Link>
      </div>
      <nav className="flex-1 p-2 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                active
                  ? "bg-slate-700 text-white font-medium"
                  : "hover:bg-slate-800 hover:text-slate-200"
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="p-4 border-t border-slate-700 text-xs text-slate-500">
        Dados sintéticos · v0.1.0
      </div>
    </aside>
  )
}
