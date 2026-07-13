const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

async function fetchJSON<T>(path: string, params?: Record<string, string | number | undefined>): Promise<T> {
  const url = new URL(`${API_BASE}${path}`)
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null) url.searchParams.set(k, String(v))
    })
  }
  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`)
  return res.json()
}

export const api = {
  getMetadata: () => fetchJSON<Record<string, unknown>>("/api/v1/demo/metadata"),
  getOverview: () => fetchJSON<import("./types").OverviewKPIs>("/api/v1/overview"),
  getMunicipalities: () => fetchJSON<import("./types").Municipality[]>("/api/v1/municipalities"),
  getConditions: () => fetchJSON<import("./types").Condition[]>("/api/v1/conditions"),
  getTimeSeries: (params?: { municipality_id?: string; condition_id?: string; start_week?: number; end_week?: number; start_year?: number; end_year?: number }) =>
    fetchJSON<import("./types").Observation[]>("/api/v1/timeseries", params as Record<string, string | number | undefined>),
  getAlerts: (params?: { alert_level?: string; municipality_id?: string; condition_id?: string; min_reliability?: number; page?: number; limit?: number }) =>
    fetchJSON<import("./types").AlertSignal[]>("/api/v1/alerts", params as Record<string, string | number | undefined>),
  getAlertDetail: (id: string) => fetchJSON<import("./types").AlertSignal>(`/api/v1/alerts/${id}`),
  getQualityIssues: (params?: { municipality_id?: string; condition_id?: string; issue_type?: string; severity?: string; page?: number; limit?: number }) =>
    fetchJSON<import("./types").DataQualityIssue[]>("/api/v1/quality/issues", params as Record<string, string | number | undefined>),
  getMunicipalitySummary: (id: string) => fetchJSON<import("./types").MunicipalitySummary>(`/api/v1/municipalities/${id}/summary`),
  getBrief: (params?: { municipality_id?: string; condition_id?: string }) =>
    fetchJSON<import("./types").ReportBrief>("/api/v1/brief", params as Record<string, string | number | undefined>),
  getMethodology: () => fetchJSON<Record<string, unknown>>("/api/v1/methodology"),
  getFalseAlertSimulation: () =>
    fetchJSON<Record<string, unknown>>("/api/v1/evaluation/false-alerts"),
}
