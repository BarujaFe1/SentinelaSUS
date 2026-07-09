export interface Municipality {
  municipality_id: string
  municipality_name: string
  state: string
  population_band: string
  region_type: string
  synthetic_flag: boolean
}

export interface Condition {
  condition_id: string
  condition_name: string
  category: string
  seasonality_profile: string
  base_rate_per_100k: number
  notes: string
}

export interface Observation {
  observation_id: string
  municipality_id: string
  condition_id: string
  epidemiological_week: number
  year: number
  week_start_date: string
  reported_cases: number
  expected_cases: number
  delayed_reports: number
  completeness_score: number
  source_type: string
  z_score: number
  robust_score: number | null
  alert_level: string
  reliability_score: number
  baseline_mean: number
  baseline_std: number
  baseline_median: number
  baseline_mad: number
}

export interface AlertSignal {
  signal_id: string
  municipality_id: string
  municipality_name: string
  condition_id: string
  condition_name: string
  epidemiological_week: number
  year: number
  observed_cases: number
  expected_cases: number
  z_score: number
  robust_score: number | null
  alert_level: string
  reliability_score: number
  confidence_notes: string
  data_quality_flags: string[]
  explanation: string
}

export interface DataQualityIssue {
  issue_id: string
  municipality_id: string
  municipality_name: string
  condition_id: string
  condition_name: string
  week: number
  year: number
  issue_type: string
  severity: string
  affected_metric: string
  explanation: string
}

export interface MunicipalitySummary {
  municipality: Municipality
  total_conditions: number
  total_weeks: number
  active_alerts: number
  average_completeness: number
  average_delay: number
  overall_reliability: number
}

export interface OverviewKPIs {
  total_municipalities: number
  total_conditions: number
  total_weeks_analyzed: number
  alert_counts: Record<string, number>
  non_interpretable_count: number
  average_reliability: number
  total_quality_issues: number
}

export interface ReportBrief {
  report_id: string
  generated_at: string
  selected_filters: Record<string, string>
  main_findings: string[]
  limitations: string[]
  recommended_next_checks: string[]
  disclaimer: string
}
