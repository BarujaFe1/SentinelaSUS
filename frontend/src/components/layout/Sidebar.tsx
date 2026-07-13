"use client"

import { useState } from "react"
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
  Menu,
  X,
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

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/"
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function Sidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const closeMenu = () => setOpen(false)

  const nav = (
    <>
      <div className="p-4 border-b border-slate-700">
        <Link href="/" className="flex items-center gap-2" onClick={closeMenu}>
          <Activity className="w-6 h-6 text-emerald-400" />
          <span className="font-bold text-lg text-white">SentinelaSUS</span>
        </Link>
      </div>
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto" aria-label="Navegação principal">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(pathname, item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeMenu}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                active
                  ? "bg-slate-700 text-white font-medium"
                  : "hover:bg-slate-800 hover:text-slate-200"
              }`}
              aria-current={active ? "page" : undefined}
            >
              <Icon className="w-4 h-4" aria-hidden />
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="p-4 border-t border-slate-700 text-xs text-slate-500">
        Dados sintéticos · v0.1.0
      </div>
    </>
  )

  return (
    <>
      <button
        type="button"
        className="md:hidden fixed top-3 left-3 z-40 inline-flex items-center justify-center rounded-lg bg-slate-800 border border-slate-600 p-2 text-white"
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {open && (
        <button
          type="button"
          className="md:hidden fixed inset-0 z-30 bg-black/50"
          aria-label="Fechar menu"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed md:static inset-y-0 left-0 z-30 w-64 h-screen bg-slate-900 text-slate-300 flex flex-col border-r border-slate-700 transition-transform md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {nav}
      </aside>
    </>
  )
}
