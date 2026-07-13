import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Sidebar } from "@/components/layout/Sidebar"
import "./globals.css"

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] })
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SentinelaSUS — Vigilância Epidemiológica Sintética",
  description:
    "Painel responsável de vigilância epidemiológica sintética para detectar sinais estatísticos incomuns em séries temporais municipais.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-950 text-slate-200`}>
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 p-6 pt-14 md:pt-6 overflow-auto">{children}</main>
        </div>
      </body>
    </html>
  )
}
