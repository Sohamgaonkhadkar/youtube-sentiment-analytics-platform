import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, ArrowRight, BarChart3, PlayCircle, Layers, Fingerprint, Lightbulb, TrendingUp, AlertOctagon } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const [url, setUrl] = useState('');

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (url) {
      navigate(`/dashboard?url=${encodeURIComponent(url)}`);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#0B0E14] text-zinc-300 font-sans selection:bg-cyan-500/30">
      
      {/* Navbar (Unified with Dashboard) */}
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-white/5 bg-[#0B0E14]/90 px-8 backdrop-blur-md">
        <div className="flex items-center gap-3">
          {/* TubeSignal Logo Replica */}
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-400 to-indigo-500 p-[2px]">
            <div className="w-full h-full bg-[#0B0E14] rounded-md flex items-center justify-center">
               <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full" />
            </div>
          </div>
          <span className="font-bold text-white tracking-[0.2em] text-sm uppercase">TubeSignal</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8 text-[13px] font-medium text-zinc-400">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#insights" className="hover:text-white transition-colors">Actionable Insights</a>
        </nav>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => document.getElementById('analyze-section')?.scrollIntoView({ behavior: 'smooth' })} 
            className="border border-white/10 hover:bg-white/5 text-[13px] text-white px-5 py-2 rounded-full transition-colors font-medium"
          >
            Try Demo
          </button>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-24 pb-32 md:pt-32 md:pb-40 px-6 bg-grid-pattern">
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E14] via-transparent to-transparent pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
          
          <div className="relative mx-auto max-w-5xl text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-sm text-cyan-300 font-medium tracking-wide"
            >
              <span className="flex h-2 w-2 rounded-full bg-cyan-500 mr-2 animate-pulse" />
              Trusted by Creators to Understand Audience Feedback
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold tracking-tighter text-white"
            >
              YouTube Audience <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">
                Intelligence Engine
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mx-auto max-w-2xl text-lg md:text-xl text-zinc-400 leading-relaxed"
            >
              Stop guessing what your viewers think. Analyze massive comment sections in seconds to discover what they love, what they hate, and exactly how to improve your next video.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              id="analyze-section"
              className="mx-auto max-w-xl mt-8 p-1 rounded-2xl bg-[#13161F]/80 border border-white/10 backdrop-blur-md shadow-2xl"
            >
              <form onSubmit={handleAnalyze} className="relative flex items-center">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <PlayCircle className="h-5 w-5 text-zinc-500" />
                </div>
                <input
                  type="url"
                  required
                  placeholder="Paste YouTube Video URL..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full bg-transparent pl-12 pr-36 py-4 text-white placeholder:text-zinc-500 focus:outline-none"
                />
                <button 
                  type="submit" 
                  className="absolute right-2 top-2 bottom-2 bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-white font-bold rounded-xl px-6 transition-all flex items-center shadow-lg shadow-cyan-500/20"
                >
                  Analyze
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </form>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 px-6 border-t border-white/5 bg-[#0B0E14]">
          <div className="mx-auto max-w-6xl">
            <div className="mb-16 text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white mb-4">Analytics for Serious Creators</h2>
              <p className="text-zinc-400 max-w-2xl mx-auto">Skip the manual reading. Our AI reads every single comment and provides the overarching narrative of your community.</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: <Activity className="h-6 w-6 text-cyan-400" />, title: "Sentiment Tracking", desc: "Instantly see the ratio of positive to negative feedback without digging through trolls and spam.", color: "bg-cyan-500/10" },
                { icon: <Fingerprint className="h-6 w-6 text-indigo-400" />, title: "Viewer Personas", desc: "Automatically identify the key demographics responding to your video, from beginners to critics.", color: "bg-indigo-500/10" },
                { icon: <BarChart3 className="h-6 w-6 text-emerald-400" />, title: "Brand Monitoring", desc: "Track your channel's reputation health score across multiple videos and over time.", color: "bg-emerald-500/10" },
                { icon: <Layers className="h-6 w-6 text-amber-400" />, title: "Content Opportunities", desc: "Find the hidden gems—uncover highly requested topics that your viewers are begging for.", color: "bg-amber-500/10" }
              ].map((f, i) => (
                <div key={i} className="bg-[#13161F] border border-white/5 hover:border-white/10 transition-colors rounded-2xl p-6 group">
                  <div className={`mb-6 inline-flex p-4 rounded-xl ${f.color} group-hover:scale-110 transition-transform`}>{f.icon}</div>
                  <h3 className="text-lg font-bold mb-3 text-white tracking-wide">{f.title}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Actionable Insights Section */}
        <section id="insights" className="py-24 px-6 border-t border-white/5 bg-[#0B0E14]">
          <div className="mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4">Answers the Questions that Matter</h2>
              <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                Metrics only tell part of the story. We turn your chaotic comment section into a clear blueprint for your next upload.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: <TrendingUp className="h-6 w-6 text-emerald-400" />, title: "What do they love?", desc: "Identify exactly which jokes landed, which edits worked, and what parts of your video kept the audience hooked. Double down on your strengths.", color: "bg-emerald-500/10", border: "border-t-emerald-500" },
                { icon: <AlertOctagon className="h-6 w-6 text-rose-400" />, title: "What do they hate?", desc: "Filter out the noise and pinpoint real friction. Was the pacing too slow? Was the audio mixed poorly? Catch mistakes before they become habits.", color: "bg-rose-500/10", border: "border-t-rose-500" },
                { icon: <Lightbulb className="h-6 w-6 text-amber-400" />, title: "What should I improve?", desc: "Get AI-generated, actionable suggestions to improve your retention. Discover the most requested topics for your next piece of content.", color: "bg-amber-500/10", border: "border-t-amber-500" }
              ].map((c, i) => (
                <div key={i} className={`flex flex-col p-8 rounded-3xl bg-[#13161F] border border-white/5 border-t-[3px] ${c.border} hover:bg-[#1A1D27] transition-colors`}>
                  <div className={`h-14 w-14 rounded-2xl ${c.color} flex items-center justify-center mb-6`}>
                    {c.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{c.title}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed flex-1">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6 bg-[#0B0E14] text-center text-zinc-600 text-xs font-mono uppercase tracking-widest">
        <p>© {new Date().getFullYear()} TubeSignal Analytics. All systems nominal.</p>
      </footer>
    </div>
  );
}