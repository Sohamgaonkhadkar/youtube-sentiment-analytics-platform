import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Search, Download, AlertTriangle, ArrowRight
} from 'lucide-react';
import { analyzeVideo, AnalysisResponse, askCoach } from '../services/api';

export default function DashboardPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const url = searchParams.get('url');

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AnalysisResponse | null>(null);
  
  // Section Navigation State
  const [activeSection, setActiveSection] = useState<'dashboard' | 'coach' | 'strategy'>('dashboard');

  useEffect(() => {
    if (!url) return navigate('/');
    
    analyzeVideo(url)
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [url, navigate]);

  if (loading) return <LoadingScreen />;
  if (!data) return <ErrorScreen onReturn={() => navigate('/')} />;

  const { insights, kpis, comments } = data;

  return (
    <div className="flex flex-col min-h-screen bg-[#0B0E14] text-zinc-300 font-sans selection:bg-cyan-500/30">
      
      {/* 1. TOP NAVBAR (Matches Screenshot) */}
      <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-[#0B0E14]/90 backdrop-blur-md sticky top-0 z-50 shrink-0">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          {/* TubeSignal Logo Replica */}
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-400 to-indigo-500 p-[2px]">
            <div className="w-full h-full bg-[#0B0E14] rounded-md flex items-center justify-center">
               <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full" />
            </div>
          </div>
          <span className="font-bold text-white tracking-[0.2em] text-sm uppercase">TubeSignal</span>
        </div>
        
        <nav className="hidden md:flex gap-8 text-[13px] font-medium text-zinc-400">
          <button 
            onClick={() => setActiveSection('dashboard')}
            className={`transition-colors hover:text-white ${activeSection === 'dashboard' ? 'text-white' : ''}`}
          >
            Dashboard
          </button>
          <button 
            onClick={() => setActiveSection('coach')}
            className={`transition-colors hover:text-white ${activeSection === 'coach' ? 'text-white' : ''}`}
          >
            AI Coach
          </button>
          <button 
            onClick={() => setActiveSection('strategy')}
            className={`transition-colors hover:text-white ${activeSection === 'strategy' ? 'text-white' : ''}`}
          >
            Strategy
          </button>
        </nav>

        <button onClick={() => navigate('/')} className="border border-white/10 hover:bg-white/5 text-[13px] text-white px-5 py-2 rounded-full transition-colors font-medium">
          Open terminal
        </button>
      </header>

      {/* 2. MAIN WORKSPACE */}
      <main className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          
          {/* =========================================================
              SECTION: DASHBOARD
              ========================================================= */}
          {activeSection === 'dashboard' && (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}
              className="max-w-[1400px] mx-auto px-6 py-12 space-y-16"
            >
              {/* Header Titles */}
              <section>
                <p className="text-[10px] font-bold text-cyan-400 uppercase tracking-[0.2em] mb-3">Live Intelligence Workspace</p>
                <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight mb-4">
                  Audience briefing for the latest<br/>analyzed video
                </h1>
                <p className="text-sm text-zinc-500 font-mono break-all">Source: {url}</p>
              </section>

              {/* Hero Cards */}
              <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-[#13161F] border border-white/5 rounded-2xl p-8">
                  <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-6">Executive Summary</h3>
                  <div className="space-y-6">
                    {insights.executiveSummary?.map((para, i) => (
                      <p key={i} className="text-[17px] text-zinc-100 font-medium leading-relaxed">{para}</p>
                    ))}
                  </div>
                </div>
                <div className="bg-[#13161F] border border-white/5 rounded-2xl p-8 flex flex-col">
                   <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-6">Recommended Next Move</h3>
                   <h2 className="text-2xl font-bold text-white mb-4 leading-tight">{insights.recommendedMove?.title}</h2>
                   <p className="text-sm text-zinc-400 leading-relaxed mb-8 flex-1">{insights.recommendedMove?.rationale}</p>
                   <div className="grid grid-cols-3 gap-3">
                     <StatBlock label="Demand" value={insights.recommendedMove?.demand} />
                     <StatBlock label="Effort" value={insights.recommendedMove?.effort} />
                     <StatBlock label="Impact" value={insights.recommendedMove?.impact} />
                   </div>
                </div>
              </section>

              {/* Premium KPI Stack */}
              <section>
                 <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Premium KPI stack</h2>
                 <p className="text-sm text-zinc-500 mb-8">Scores are translated into creator decisions, not technical analysis outputs.</p>
                 <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <KpiBox title="Audience Satisfaction Score" score={kpis.satisfaction} text="Practical examples are the main satisfaction driver." color="border-t-purple-500" />
                    <KpiBox title="Community Health Score" score={kpis.communityHealth} text="Discussion is constructive with limited hostile replies." color="border-t-cyan-500" />
                    <KpiBox title="Trust Score" score={kpis.trust} text="Viewers believe the creator ships real working systems." color="border-t-emerald-500" />
                    <KpiBox title="Audience Sentiment Score" score={kpis.sentiment} text="Praise outweighs frustration by a wide margin." color="border-t-blue-500" />
                    <KpiBox title="Engagement Quality Score" score={kpis.engagementQuality} text="High-intent questions indicate serious viewers." color="border-t-amber-500" />
                    <KpiBox title="Creator Reputation Score" score={kpis.creatorReputation} text="Repeated references to clarity, honesty, and depth." color="border-t-purple-400" />
                    <KpiBox title="Audience Loyalty Score" score={kpis.audienceLoyalty} text="Fans are asking for a series, not one-off uploads." color="border-t-cyan-400" />
                    <KpiBox title="Growth Potential Score" score={kpis.growthPotential} text="Unmet demand clusters around deployment content." color="border-t-rose-500" />
                    <KpiBox title="Viral Potential Score" score={kpis.viralPotential} text="Shareability improves if the promise is more specific." color="border-t-emerald-400" />
                    <KpiBox title="Content Quality Score" score={kpis.contentQuality} text="Implementation quality is consistently praised." color="border-t-indigo-500" />
                 </div>
              </section>

              {/* Segmentation & Emotion */}
              <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <div className="bg-[#13161F] border border-white/5 rounded-2xl p-8 flex flex-col">
                    <h2 className="text-xl font-bold text-white mb-2">Audience segmentation</h2>
                    <p className="text-sm text-zinc-500 mb-8">Who is reacting and how each group behaves.</p>
                    
                    <div className="h-2 w-full rounded-full flex overflow-hidden mb-8 bg-[#1A1D27]">
                       {insights.segments?.map((s, i) => (
                          <div key={i} style={{ width: `${s.percentage}%` }} className={`h-full ${['bg-purple-500', 'bg-cyan-500', 'bg-zinc-500', 'bg-amber-500', 'bg-rose-500'][i%5]}`} />
                       ))}
                    </div>

                    <div className="space-y-3 flex-1">
                       {insights.segments?.map((s, i) => (
                         <div key={i} className="bg-[#1A1D27] border border-white/5 p-4 rounded-xl flex items-center justify-between">
                            <div>
                               <div className="flex items-center gap-3 mb-1">
                                  <span className={`w-2 h-2 rounded-full ${['bg-purple-500', 'bg-cyan-500', 'bg-zinc-500', 'bg-amber-500', 'bg-rose-500'][i%5]}`} />
                                  <span className="font-bold text-zinc-100 text-sm">{s.name}</span>
                               </div>
                               <p className="text-[11px] text-zinc-500 pl-5">{s.desc}</p>
                            </div>
                            <span className="text-xl font-bold text-white">{s.percentage}%</span>
                         </div>
                       ))}
                    </div>
                 </div>

                 <div className="bg-[#13161F] border border-white/5 rounded-2xl p-8 flex flex-col">
                    <h2 className="text-xl font-bold text-white mb-2">Audience emotion analysis</h2>
                    <p className="text-sm text-zinc-500 mb-10">Emotions are converted into creative direction and risk signals.</p>
                    <div className="grid grid-cols-4 gap-4 flex-1">
                       {insights.emotions?.slice(0,8).map((e, i) => (
                          <div key={i} className="flex flex-col items-center justify-end h-full">
                             <div className="w-12 h-32 bg-[#1A1D27] rounded-full p-1 relative flex items-end justify-center mb-4 border border-white/5">
                                <motion.div 
                                  initial={{ height: 0 }} 
                                  animate={{ height: `${e.score}%` }} 
                                  transition={{ duration: 1, delay: i * 0.1 }} 
                                  className="w-full bg-gradient-to-t from-cyan-400 to-indigo-500 rounded-full" 
                                />
                             </div>
                             <span className="text-xs font-bold text-white mb-1">{e.name}</span>
                             <span className="text-lg font-bold text-white mb-2">{e.score}</span>
                             <p className="text-[9px] text-zinc-500 text-center leading-tight px-1">{e.desc}</p>
                          </div>
                       ))}
                    </div>
                 </div>
              </section>

              {/* Content Improvement Engine */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-2">Content improvement engine</h2>
                <p className="text-sm text-zinc-500 mb-8">The platform identifies what to repeat, what to fix, and what to create next.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <ListCard title="Most Praised Topics" items={insights.contentEngine?.praised} />
                   <ListCard title="Most Criticized Topics" items={insights.contentEngine?.criticized} />
                   <ListCard title="Most Requested Topics" items={insights.contentEngine?.requested} />
                   <ListCard title="Most Confusing Sections" items={insights.contentEngine?.confusing} />
                   <ListCard title="Most Valuable Sections" items={insights.contentEngine?.valuable} />
                   <ListCard title="Most Memorable Moments" items={insights.contentEngine?.memorable} />
                </div>
              </section>
            </motion.div>
          )}

          {/* =========================================================
              SECTION: STRATEGY
              ========================================================= */}
          {activeSection === 'strategy' && (
            <motion.div 
              key="strategy"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}
              className="max-w-[1400px] mx-auto px-6 py-12 space-y-16"
            >
              {/* Growth Opportunities */}
              <section className="bg-[#13161F] border border-white/5 rounded-2xl p-8">
                 <h2 className="text-2xl font-bold text-white mb-2">Growth opportunities</h2>
                 <p className="text-sm text-zinc-500 mb-8">What should this creator do next, ranked by impact and effort.</p>
                 <div className="overflow-x-auto">
                   <table className="w-full text-left text-sm whitespace-nowrap">
                     <thead>
                       <tr className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] border-b border-white/5">
                         <th className="pb-4">Action</th>
                         <th className="pb-4">Impact</th>
                         <th className="pb-4">Effort</th>
                         <th className="pb-4">Estimated Lift</th>
                         <th className="pb-4 w-full">Why it matters</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-white/5">
                       {insights.growthOpportunities?.map((go, i) => (
                         <tr key={i} className="hover:bg-white/[0.02]">
                           <td className="py-6 font-bold text-zinc-100 pr-8">{go.action}</td>
                           <td className="py-6 pr-8"><Badge color={go.impact.includes("High") ? "emerald" : "zinc"}>{go.impact}</Badge></td>
                           <td className="py-6 pr-8"><Badge color="zinc">{go.effort}</Badge></td>
                           <td className="py-6 font-bold text-emerald-400 pr-8">{go.lift}</td>
                           <td className="py-6 text-zinc-400 text-xs whitespace-normal">{go.rationale}</td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                 </div>
              </section>

              {/* Audience Request Mining */}
              <section>
                 <h2 className="text-2xl font-bold text-white mb-2">Audience request mining</h2>
                 <p className="text-sm text-zinc-500 mb-6">Repeated asks become the content backlog.</p>
                 <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                    {insights.topRequests?.map((req, i) => (
                       <div key={i} className="bg-[#13161F] border border-white/5 rounded-2xl p-6">
                          <div className="flex justify-between items-center mb-6">
                             <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">0{i+1}</span>
                             <span className="bg-cyan-500/10 text-cyan-400 text-[10px] font-bold px-2 py-0.5 rounded-full">{req.volume} asks</span>
                          </div>
                          <h4 className="text-lg font-bold text-white mb-2 truncate">{req.topic}</h4>
                          <p className="text-xs text-zinc-500 mb-6 min-h-[32px]">{req.context}</p>
                          <div className="h-1 w-full bg-[#1A1D27] rounded-full overflow-hidden">
                             <div className="h-full bg-gradient-to-r from-cyan-400 to-purple-500" style={{ width: `${Math.min((req.volume / 200) * 100, 100)}%` }} />
                          </div>
                       </div>
                    ))}
                 </div>
              </section>

              {/* Competitive Insights & Reports */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <section className="bg-[#13161F] border border-white/5 rounded-2xl p-8">
                    <h2 className="text-xl font-bold text-white mb-2">Competitive insights</h2>
                    <p className="text-sm text-zinc-500 mb-8">Compare current video performance against platform benchmarks.</p>
                    <div className="space-y-6">
                       <BenchBar title="Audience Satisfaction" score={kpis.satisfaction} bench={67} />
                       <BenchBar title="Engagement Quality" score={kpis.engagementQuality} bench={61} />
                       <BenchBar title="Creator Trust" score={kpis.trust} bench={64} />
                       <BenchBar title="Growth Potential" score={kpis.growthPotential} bench={58} />
                    </div>
                 </section>

                 <section className="bg-[#13161F] border border-white/5 rounded-2xl p-8 flex flex-col justify-between">
                    <div>
                       <h2 className="text-xl font-bold text-white mb-2 uppercase tracking-wide text-sm text-zinc-400">Report Generation</h2>
                       <h1 className="text-3xl font-bold text-white mb-4">Download stakeholder-ready intelligence.</h1>
                       <p className="text-sm text-zinc-500 mb-8">Exports package the executive narrative, KPIs, audience requests, recommendations, and comment evidence into client-ready reports.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <ReportCard title="Executive Summary PDF" desc="Generate download" />
                       <ReportCard title="Creator Insights Report" desc="Generate download" />
                       <ReportCard title="Audience Intelligence Report" desc="Generate download" />
                       <ReportCard title="Brand Sentiment Report" desc="Generate download" />
                    </div>
                 </section>
              </div>

              {/* Comment Intelligence Explorer */}
              <section>
                 <h2 className="text-2xl font-bold text-white mb-2">Comment intelligence</h2>
                 <p className="text-sm text-zinc-500 mb-6">A powerful evidence explorer for the comments behind every recommendation.</p>
                 <CommentExplorer comments={comments} />
              </section>
            </motion.div>
          )}

          {/* =========================================================
              SECTION: AI COACH
              ========================================================= */}
          {activeSection === 'coach' && (
            <motion.div 
              key="coach"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}
              className="max-w-[1000px] mx-auto px-6 py-12 h-[calc(100vh-64px)] flex flex-col"
            >
               <div className="mb-8 shrink-0">
                  <h1 className="text-2xl font-bold text-white mb-2">AI Creator Coach</h1>
                  <p className="text-zinc-500 text-sm">Ask business questions in plain English and get answers grounded in audience evidence.</p>
               </div>
               <CoachChat insights={insights} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}


/* =========================================================================
   SUBCOMPONENTS (Styled to match TubeSignal Mockups)
   ========================================================================= */

function LoadingScreen() {
  return (
    <div className="h-screen bg-[#0B0E14] flex flex-col items-center justify-center space-y-6">
       <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
       <div className="text-center">
         <h2 className="text-xl font-bold text-white tracking-[0.2em] uppercase mb-2">TubeSignal</h2>
         <p className="text-xs text-zinc-500 font-mono">Synthesizing intelligence brief...</p>
       </div>
    </div>
  );
}

function ErrorScreen({ onReturn }: { onReturn: () => void }) { 
  return (
    <div className="h-screen bg-[#0B0E14] flex flex-col items-center justify-center space-y-6">
       <AlertTriangle className="w-16 h-16 text-rose-500" />
       <div className="text-center">
         <h2 className="text-xl font-bold text-white tracking-[0.2em] uppercase mb-2">Analysis Interrupted</h2>
         <p className="text-sm text-zinc-500 font-mono mb-6">The telemetry data could not be parsed.</p>
         <button onClick={onReturn} className="border border-white/10 hover:bg-white/5 px-6 py-2 rounded-full text-sm font-bold text-white transition-colors">Return to Terminal</button>
       </div>
    </div>
  ); 
}

function StatBlock({ label, value }: { label: string, value: string | number }) {
  return (
    <div className="bg-[#1A1D27] rounded-xl p-4 border border-white/5 flex flex-col justify-center">
      <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.1em] mb-1">{label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  );
}

function KpiBox({ title, score, text, color }: { title: string, score: number, text: string, color: string }) {
  return (
    <div className={`bg-[#13161F] rounded-2xl p-5 border border-white/5 border-t-[3px] ${color} relative flex flex-col`}>
       <div className="flex items-center gap-2 mb-4">
         <h4 className="text-[11px] font-bold text-zinc-300 leading-snug tracking-wider flex-1">{title}</h4>
         <div className="w-7 h-7 rounded-full border border-white/10 flex items-center justify-center text-[10px] font-bold text-white bg-white/5 shrink-0">{score}</div>
       </div>
       <h2 className="text-3xl font-bold text-white mb-2">{score}</h2>
       <p className="text-[10px] text-cyan-400 font-bold tracking-wider mb-4 uppercase">+14% vs benchmark</p>
       <p className="text-[11px] text-zinc-500 leading-relaxed flex-1">{text}</p>
    </div>
  );
}

function ListCard({ title, items }: { title: string, items: string[] }) {
  return (
    <div className="bg-[#13161F] border border-white/5 rounded-2xl p-6">
      <h3 className="text-sm font-bold text-white mb-6 tracking-wide">{title}</h3>
      <div className="space-y-3">
        {items?.slice(0,4).map((item, i) => (
          <div key={i} className="flex items-center gap-4 bg-[#1A1D27] border border-white/5 p-3.5 rounded-xl">
            <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-bold text-zinc-400 shrink-0">{i+1}</div>
            <p className="text-sm text-zinc-300 font-medium truncate">{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Badge({ children, color }: { children: React.ReactNode, color: 'emerald' | 'zinc' }) {
  const styles = color === 'emerald' ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' : 'border-white/10 text-zinc-300 bg-white/5';
  return <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.1em] border ${styles}`}>{children}</span>;
}

function BenchBar({ title, score, bench }: { title: string, score: number, bench: number }) {
  const diff = score - bench;
  return (
    <div className="bg-[#1A1D27] border border-white/5 rounded-xl p-6">
       <div className="flex justify-between items-center mb-6">
         <h4 className="font-bold text-white text-sm">{title}</h4>
         <Badge color="emerald">{diff > 0 ? `${diff}% Above Average` : `${diff}% Below Average`}</Badge>
       </div>
       <div className="flex gap-4 mb-4">
         <div className="flex-1 bg-black/40 rounded-xl p-3 border border-white/5">
           <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.1em] mb-1">Your Score</p>
           <p className="text-xl font-bold text-white">{score}</p>
         </div>
         <div className="flex-1 bg-black/40 rounded-xl p-3 border border-white/5">
           <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.1em] mb-1">Industry Benchmark</p>
           <p className="text-xl font-bold text-zinc-500">{bench}</p>
         </div>
       </div>
       <div className="space-y-2">
         <div className="h-1.5 w-full bg-black/50 rounded-full overflow-hidden">
           <motion.div initial={{ width: 0 }} animate={{ width: `${score}%` }} transition={{ duration: 1 }} className="h-full bg-gradient-to-r from-cyan-400 to-purple-500" />
         </div>
         <div className="h-1.5 w-full bg-black/50 rounded-full overflow-hidden">
           <motion.div initial={{ width: 0 }} animate={{ width: `${bench}%` }} transition={{ duration: 1 }} className="h-full bg-zinc-600" />
         </div>
       </div>
    </div>
  );
}

function ReportCard({ title, desc }: { title: string, desc: string }) {
  return (
    <button className="bg-[#1A1D27] border border-white/5 hover:border-white/10 transition-colors rounded-xl p-5 text-left group">
      <h4 className="font-bold text-sm text-white mb-1 group-hover:text-cyan-400 transition-colors">{title}</h4>
      <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">{desc}</p>
    </button>
  );
}

function CommentExplorer({ comments }: { comments: any[] }) {
  // Add state for our specific dropdown filter
  const [sentimentFilter, setSentimentFilter] = useState('All');

  // Filter the comments based on the dropdown state
  const filtered = comments?.filter(c => {
    if (sentimentFilter === 'All') return true;
    return (c.sentiment || "").toLowerCase() === sentimentFilter.toLowerCase();
  }) || [];

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-wrap gap-4 mb-4">
        {/* Placeholder Dropdowns */}
        {['Emotion', 'Engagement', 'Likes', 'Insight Confidence', 'Topic'].map(f => (
          <div key={f} className="flex flex-col gap-1">
             <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">{f}</span>
             <select className="bg-[#13161F] border border-white/5 text-zinc-300 text-sm rounded-lg px-4 py-2 outline-none focus:border-cyan-500/50 appearance-none min-w-[140px] opacity-50 cursor-not-allowed">
               <option>All (Coming Soon)</option>
             </select>
          </div>
        ))}

        {/* Working Sentiment Dropdown */}
        <div className="flex flex-col gap-1">
           <span className="text-[10px] text-emerald-500 uppercase tracking-widest font-bold">Sentiment</span>
           <select 
             value={sentimentFilter} 
             onChange={(e) => setSentimentFilter(e.target.value)}
             className="bg-[#13161F] border border-white/5 text-white font-medium text-sm rounded-lg px-4 py-2 outline-none focus:border-emerald-500/50 appearance-none min-w-[140px]"
           >
             <option value="All">All</option>
             <option value="positive">Positive</option>
             <option value="negative">Negative</option>
             <option value="neutral">Neutral</option>
           </select>
        </div>
      </div>
      
      {/* Comments List */}
      <div className="space-y-4">
        {filtered.length === 0 && (
           <p className="text-zinc-500 text-sm py-4">No comments found for this filter.</p>
        )}
        {filtered.slice(0, 10).map((c, i) => (
          <div key={i} className="bg-[#13161F] border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                 <span className="font-bold text-white">{c.author}</span>
                 <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${c.sentiment === 'positive' ? 'bg-emerald-500/10 text-emerald-400' : c.sentiment === 'negative' ? 'bg-rose-500/10 text-rose-400' : 'bg-zinc-500/10 text-zinc-400'}`}>
                    {c.sentiment}
                 </span>
              </div>
              <p className="text-[15px] text-zinc-300 leading-relaxed">{c.text}</p>
            </div>
            {/* Keeping the right-side metrics static for now as placeholders */}
            <div className="grid grid-cols-2 gap-4 shrink-0 md:w-64 h-fit">
               <div className="bg-[#1A1D27] border border-white/5 rounded-xl p-3">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">Likes</span>
                  <span className="text-sm font-bold text-white">{c.likes}</span>
               </div>
               <div className="bg-[#1A1D27] border border-white/5 rounded-xl p-3">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">Confidence</span>
                  <span className="text-sm font-bold text-white">{(c.confidence * 100).toFixed(1)}%</span>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CoachChat({ insights }: { insights: any }) {
  const [messages, setMessages] = useState([{role: 'coach', text: "Create a deployment-focused follow-up. It aligns with the largest request cluster and strengthens your reputation for real-world implementation."}]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const msg = input; setInput(''); setMessages(p => [...p, {role: 'user', text: msg}]);
    setLoading(true);
    try {
      const res = await askCoach(msg, JSON.stringify(insights));
      setMessages(p => [...p, {role: 'coach', text: res.answer}]);
    } catch { setMessages(p => [...p, {role: 'coach', text: "Error."}]); }
    finally { setLoading(false); }
  }

  useEffect(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), [messages, loading]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-wrap gap-3 mb-6">
         {['What do viewers dislike?', 'What video should I create next?', 'What causes negative sentiment?', 'What content performs best?', 'What do subscribers want?'].map(q => (
           <button key={q} onClick={() => setInput(q)} className="border border-white/10 bg-[#13161F] text-[11px] font-bold text-zinc-400 px-4 py-2.5 rounded-full hover:text-white transition tracking-wide">{q}</button>
         ))}
      </div>
      
      <div className="flex-1 overflow-y-auto mb-6 bg-[#13161F] border border-white/5 rounded-2xl p-8 flex flex-col gap-6">
         {messages.map((m, i) => (
            <div key={i} className="flex flex-col">
               <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.1em] mb-2">{m.role === 'coach' ? 'Coach Answer' : 'Question'}</p>
               <p className={`text-[15px] leading-relaxed ${m.role === 'user' ? 'text-white font-bold' : 'text-zinc-300'}`}>{m.text}</p>
            </div>
         ))}
         {loading && <p className="text-zinc-500 animate-pulse text-sm">Thinking...</p>}
         <div ref={endRef} />
      </div>

      <form onSubmit={handleSend} className="relative shrink-0">
         <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your question..." className="w-full bg-[#13161F] border border-white/5 rounded-xl pl-6 pr-16 py-4 text-sm text-white focus:outline-none focus:border-white/20 transition-colors" />
         <button type="submit" disabled={!input.trim() || loading} className="absolute right-3 top-3 bottom-3 bg-white text-black px-4 rounded-lg text-xs font-bold hover:bg-zinc-200 disabled:opacity-50 transition-colors">Ask</button>
      </form>
    </div>
  );
}