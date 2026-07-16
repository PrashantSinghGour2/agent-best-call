export interface SessionInfo {
    icon: string;
    alt: string;
    title: string;
    value: number;
    percentage: string;
  }

  export interface BarChartData {
    name: string;
    data: number[];
}

export interface BestCallAgent {
  agent: string;
  ticket: string;
  reason: string;
  summary: string;
  score: number;
  tint: string;
  userId: string;
}
