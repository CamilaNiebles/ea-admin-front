export interface DashboardSummary {
  organizations: {
    total: number
    byStatus: Record<string, number>
  }
  schools: {
    total: number
    byStatus: Record<string, number>
    byPlanTier: Record<string, number>
  }
  students: {
    total: number
  }
  sessions: {
    total: number
  }
}
