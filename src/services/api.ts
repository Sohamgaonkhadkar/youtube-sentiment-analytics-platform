export interface VideoMetadata { title: string; channelName: string; thumbnailUrl: string; viewCount: number; likeCount: number; commentCount: number; }
export interface Comment { id: string; text: string; author: string; likes: number; sentiment: string; confidence: number; timestamp: string; }
export interface KpiStack { satisfaction: number; communityHealth: number; trust: number; sentiment: number; engagementQuality: number; creatorReputation: number; audienceLoyalty: number; growthPotential: number; viralPotential: number; contentQuality: number; }
export interface AIInsights {
  executiveSummary: string[];
  recommendedMove: { title: string; rationale: string; demand: number; effort: string; impact: string; };
  segments: { name: string; percentage: number; desc: string; }[];
  emotions: { name: string; score: number; desc: string; }[];
  contentEngine: { praised: string[]; criticized: string[]; requested: string[]; confusing: string[]; valuable: string[]; memorable: string[]; };
  growthOpportunities: { action: string; impact: string; effort: string; lift: string; rationale: string; }[];
  topRequests: { topic: string; context: string; volume: number; }[];
}
export interface AnalysisResponse { metadata: VideoMetadata; kpis: KpiStack; comments: Comment[]; insights: AIInsights; }

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export async function analyzeVideo(url: string): Promise<AnalysisResponse> {
  const res = await fetch(`${API_BASE_URL}/analyze`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ youtube_url: url }) });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function askCoach(question: string, context: string): Promise<{ answer: string }> {
  const res = await fetch(`${API_BASE_URL}/coach`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question, context }) });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}