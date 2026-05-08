import React, { useState } from 'react';
import { 
  Zap, 
  Settings, 
  User, 
  Undo, 
  Redo, 
  Share2, 
  Download, 
  Terminal, 
  BrainCircuit as Brain, 
  Mic2, 
  Cpu, 
  X,
  Copy,
  Hash,
  Disc,
  Twitter,
  Search,
  Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---

interface Traits {
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
}

interface Tone {
  verbosity: string;
  humor: string;
  formality: boolean;
  emojis: boolean;
}

type Screen = 'landing' | 'editor' | 'presets';

// --- Static Data ---

const PRESETS = [
  {
    id: 'ARCH-01',
    name: 'Shadow',
    version: 'v2.4',
    description: 'The Stealth Operative. Optimized for low-visibility environments and rapid data extraction. High agility metrics.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAsMIoN7AfPiAeDrouIJN3hsZSCJCaTC9iE2IU4bsjOs3iz7TXO0UcvC2d8cC1lj-vfF3K_65QioZBk9j77LziRmLqtADl98cKikP3G9Gd47JEW6sGl-f0nOkz5VLlPlXHZYYMbgGb2GJDTM1f5V-7WVWMycDUtYdUKckRUpAmOdamL25T2RiVY9q2cKs1tCWpI39pXVad86Tm0TLGQuoAaPUZtpp47ItNR5t0_g6J5obxkhUsnr5B_TLa0bhM4gg7A31XtKRul'
  },
  {
    id: 'ARCH-02',
    name: 'Nova',
    version: 'v1.1',
    description: 'Frontline combat specialist. Heavy armor plating sub-routines and enhanced kinetic impact absorption.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCD7nIjegMhoUBBVpX8O-WEto1zu4PS_cqw4k2eB2MUiMkt60zSDn_-5e41q8i83SAi1thIgsnHxwELDY8XwuOFToSJA2I1Ei_05BdmlYJEf6YIBb85MgU8OodxsUu2mVZFS6fJD33G9QW2CX8Sg_MA_sjVfniv8ubFacQplKlYz48rjFi7GzhbwNIYSz57wLPBQx4o7O0yTkn0PEnQNjuU_X0O5XCvcWB5r9SvmK_aa5hTzcIydCjxUKpY7RtgjjfAM9uu76GV'
  },
  {
    id: 'ARCH-03',
    name: 'Zen',
    version: 'v3.0',
    description: 'The Cybernetic Monk. Balanced stats with a focus on neural defense and electronic counter-measures.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuATbpKW-5pA4TFmsZbBmbt8Le4cOZna9jqpOu4gGlMOpZfzlUN5tjFtLLaJZKYDv-E1Vse3z6TRjbxKCn310d0T_6gwSeanW9qLqHyIuY42KiwJFKn-tdQAnNZ-Fv7elHZL24ceT1hjK3UnSTPgxKWAbaczs_LDXxvYj9rpRSu7A2ab0MD3sZdkuUmF03_OMnVZAxQ_Ms4Lo3G-UnAAvQyAOkd--i2Vm3nW_TmJe4MybAINyik5IB74n1ilt9ocqxwqpe9z471z'
  },
  {
    id: 'ARCH-04',
    name: 'Jack',
    version: 'v1.8',
    description: 'The Rogue AI Handler. Specialized in commanding drone swarms and bypassing legacy security protocols.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBU6836jAkkA5YD9fr66yu9RJNHV9THWqNoRHGOeYhzgmMc7AFQZ0eWY9BjTjJ4_Q2hYOeRjzD6mzVEhU0xSKs7DhfYZk3bR82eQMYGJKzseDZ6COxkr20wZVJMN5jJpkr3YgUKnYugZT2csCn2oM3ZkfPhjFH76cvGAToNFIwC_P5IT8H0ehMJHRT2gNMLtpSgZiy9OnFWV7FNuQWIVb6QsXm28iZbFqmCqpOSoeHkn0f0NMPRmjZU9eL-CSTRcinI8XtWn-NV'
  }
];

// --- Components ---

const Slider = ({ label, value, onChange, minLabel, maxLabel, unit = '%' }: any) => (
  <div className="flex flex-col gap-2">
    <div className="flex justify-between items-end">
      <label className="font-mono text-xs uppercase tracking-wider text-on-surface-variant/80">{label}</label>
      <span className="font-mono text-sm text-gold">{value}{unit}</span>
    </div>
    <input 
      type="range" 
      min="0" 
      max="100" 
      value={value} 
      onChange={(e) => onChange(parseInt(e.target.value))}
      className="w-full accent-gold h-1 bg-white/10 rounded-full cursor-pointer hover:accent-gold/80 transition-all"
    />
    <div className="flex justify-between text-[10px] text-on-surface-variant/50 font-mono">
      <span>{minLabel}</span>
      <span>{maxLabel}</span>
    </div>
  </div>
);

const Toggle = ({ label, subLabel, active, onToggle }: any) => (
  <div className="flex items-center justify-between p-4 glass-panel rounded-lg bg-surface-dim/50">
    <div>
      <h4 className="font-mono text-sm text-slate-100">{label}</h4>
      <p className="text-[10px] text-on-surface-variant/70">{subLabel}</p>
    </div>
    <button 
      onClick={onToggle}
      className={`w-12 h-6 rounded-full relative transition-colors duration-200 ${active ? 'bg-gold' : 'bg-white/10'}`}
    >
      <motion.div 
        animate={{ x: active ? 26 : 4 }}
        className={`w-4 h-4 rounded-full mt-1 ${active ? 'bg-obsidian shadow-sm' : 'bg-white/40'}`}
      />
    </button>
  </div>
);

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');
  const [showExportModal, setShowExportModal] = useState(false);
  const [exporting, setExporting] = useState(false);

  const [traits, setTraits] = useState<Traits>({
    openness: 85,
    conscientiousness: 92,
    extraversion: 45,
    agreeableness: 30,
    neuroticism: 15
  });

  const [tone, setTone] = useState<Tone>({
    verbosity: 'Low',
    humor: 'Dry',
    formality: true,
    emojis: false
  });

  const handleExport = () => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      setShowExportModal(true);
    }, 2000);
  };

  const Navbar = () => (
    <nav className="fixed top-0 left-0 w-full h-16 glass-panel z-50 flex items-center justify-between px-8 md:px-12">
      <div className="flex items-center gap-8">
        <span className="text-2xl font-bold tracking-tighter text-gold font-display cursor-pointer" onClick={() => setCurrentScreen('landing')}>
          ClawSouls
        </span>
        <div className="hidden md:flex gap-6">
          {['Editor', 'Presets', 'Library', 'Docs'].map((item) => (
            <button 
              key={item}
              onClick={() => {
                if (item === 'Editor') setCurrentScreen('editor');
                if (item === 'Presets') setCurrentScreen('presets');
              }}
              className={`font-mono text-xs uppercase tracking-widest transition-all ${
                (currentScreen === item.toLowerCase()) 
                  ? 'text-gold border-b border-gold pb-1' 
                  : 'text-white/60 hover:text-white'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="hidden md:block bg-gold text-obsidian px-5 py-2 font-mono text-[10px] uppercase font-bold rounded-sm hover:scale-[1.02] shadow-[0_0_15px_rgba(250,204,21,0.2)] transition-all">
          Connect Terminal
        </button>
        <div className="flex items-center gap-4 text-white/60">
          <Settings className="w-5 h-5 cursor-pointer hover:text-white transition-colors" />
          <User className="w-5 h-5 cursor-pointer hover:text-white transition-colors" />
        </div>
      </div>
    </nav>
  );

  const Footer = () => (
    <footer className="w-full py-12 border-t border-white/5 px-8 md:px-12 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-gold font-bold font-mono text-[10px] tracking-[0.2em] uppercase opacity-80 text-center md:text-left">
          © 2024 CLAWSOULS TERMINAL // SYSTEM STATUS: NOMINAL
        </div>
        <div className="flex gap-6">
          {['Terms', 'Privacy', 'GitHub', 'Discord'].map(item => (
            <a key={item} href="#" className="font-mono text-[10px] tracking-widest uppercase text-white/40 hover:text-gold transition-all">
              {item}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );

  return (
    <div className="min-h-screen flex flex-col pt-0">
      <Navbar />

      <main className="flex-1 mt-16 overflow-hidden relative">
        <AnimatePresence mode="wait">
          {currentScreen === 'landing' && (
            <motion.section 
              key="landing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-7xl mx-auto px-8 py-20 flex flex-col items-center text-center relative z-10"
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[120px] pointer-events-none" />
              
              <div className="font-mono text-[10px] text-gold border border-gold/30 px-4 py-1.5 rounded-full bg-gold/5 uppercase tracking-[0.3em] mb-8">
                System Online
              </div>
              
              <h1 className="font-display text-4xl md:text-7xl font-bold text-gradient-gold mb-8 max-w-4xl leading-tight">
                UNLEASH THE SOUL OF AI
              </h1>
              
              <p className="font-sans text-lg text-on-surface-variant max-w-2xl mb-12 leading-relaxed">
                The ultimate visual editor for OpenClaw SOUL.md personalities. Architect, refine, and deploy complex AI identities with unprecedented precision.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6">
                <button 
                  onClick={() => setCurrentScreen('editor')}
                  className="px-10 py-4 bg-gold text-obsidian font-mono text-sm uppercase font-bold rounded-sm hover:scale-105 transition-all glow-gold"
                >
                  Launch Editor
                </button>
                <button 
                  onClick={() => setCurrentScreen('presets')}
                  className="px-10 py-4 border border-gold/50 text-gold font-mono text-sm uppercase font-bold rounded-sm hover:bg-gold/10 transition-all"
                >
                  Browse Presets
                </button>
              </div>

              {/* Bento-ish preview */}
              <div className="mt-24 grid grid-cols-1 lg:grid-cols-12 gap-6 w-full opacity-60">
                <div className="lg:col-span-8 h-[300px] glass-panel rounded-xl flex items-center justify-center">
                   <Zap className="w-12 h-12 text-gold animate-pulse" />
                </div>
                <div className="lg:col-span-4 h-[300px] glass-panel rounded-xl overflow-hidden p-6 text-left font-mono text-xs text-gold/60">
                  <code>{"{\n  \"status\": \"READY\",\n  \"protocol\": \"CLAW-09\",\n  \"active\": true\n}"}</code>
                </div>
              </div>
            </motion.section>
          )}

          {currentScreen === 'editor' && (
            <motion.section 
              key="editor"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-[1600px] mx-auto w-full px-8 md:px-12 pt-8 pb-16 grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              {/* Header */}
              <div className="col-span-full flex flex-col md:flex-row justify-between items-end gap-4 border-b border-white/10 pb-6 mb-4">
                <div>
                  <h1 className="font-display text-3xl md:text-4xl text-slate-100 flex items-center gap-4">
                    <span className="w-1 h-10 bg-gold block" />
                    Terminal Session_01
                  </h1>
                  <p className="font-mono text-[10px] text-gold opacity-60 uppercase tracking-[0.2em] mt-2">
                    STATUS: CONFIGURING // TARGET: SOUL.MD // {new Date().toLocaleTimeString()}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button className="p-3 glass-panel rounded hover:text-gold transition-colors"><Undo className="w-4 h-4" /></button>
                  <button className="p-3 glass-panel rounded hover:text-gold transition-colors"><Redo className="w-4 h-4" /></button>
                  <button className="p-3 glass-panel rounded hover:text-gold transition-colors"><Share2 className="w-4 h-4" /></button>
                  <button 
                    onClick={handleExport}
                    className="px-6 py-2 bg-gold text-obsidian rounded font-mono text-[11px] uppercase font-bold hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 glow-gold"
                  >
                    <Download className="w-4 h-4" /> Export SOUL.md
                  </button>
                </div>
              </div>

              {/* Left Column: Editor Controls */}
              <div className="col-span-1 lg:col-span-7 flex flex-col gap-8">
                {/* Tabs */}
                <div className="flex gap-6 border-b border-white/10 pb-2">
                  {['PERSONALITY', 'CONTEXT', 'TONE', 'ADVANCED'].map(tab => (
                    <button key={tab} className={`font-display text-[10px] uppercase font-bold tracking-widest ${tab === 'PERSONALITY' ? 'text-gold border-b-2 border-gold pb-2' : 'text-white/40 hover:text-white transition-colors'}`}>
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="space-y-8">
                  {/* Cognitive Parameters */}
                  <section className="glass-panel rounded-xl p-8 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-12 h-[2px] bg-gold" />
                    <h3 className="font-display text-xl mb-8 flex items-center gap-3">
                      <Brain className="w-5 h-5 text-gold" />
                      Cognitive Parameters
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                      <Slider 
                        label="Openness" 
                        value={traits.openness} 
                        onChange={(v: any) => setTraits({...traits, openness: v})} 
                        minLabel="Traditional" 
                        maxLabel="Inventive" 
                      />
                      <Slider 
                        label="Conscientiousness" 
                        value={traits.conscientiousness} 
                        onChange={(v: any) => setTraits({...traits, conscientiousness: v})} 
                        minLabel="Spontaneous" 
                        maxLabel="Disciplined" 
                      />
                      <Slider 
                        label="Extraversion" 
                        value={traits.extraversion} 
                        onChange={(v: any) => setTraits({...traits, extraversion: v})} 
                        minLabel="Reserved" 
                        maxLabel="Outgoing" 
                      />
                      <Slider 
                        label="Agreeableness" 
                        value={traits.agreeableness} 
                        onChange={(v: any) => setTraits({...traits, agreeableness: v})} 
                        minLabel="Critical" 
                        maxLabel="Cooperative" 
                      />
                      <div className="md:col-span-2">
                         <Slider 
                          label="Neuroticism" 
                          value={traits.neuroticism} 
                          onChange={(v: any) => setTraits({...traits, neuroticism: v})} 
                          minLabel="Stable" 
                          maxLabel="Volatile" 
                        />
                      </div>
                    </div>
                  </section>

                  {/* Tone Profile */}
                  <section className="glass-panel rounded-xl p-8 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-12 h-[2px] bg-gold" />
                    <h3 className="font-display text-xl mb-8 flex items-center gap-3">
                      <Mic2 className="w-5 h-5 text-gold" />
                      Syntactic Tone Profile
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <Slider 
                          label="Verbosity" 
                          value={tone.verbosity === 'Low' ? 25 : 75} 
                          onChange={(v: any) => setTone({...tone, verbosity: v > 50 ? 'High' : 'Low'})} 
                          minLabel="Concise" 
                          maxLabel="Detailed" 
                          unit=""
                        />
                        <Slider 
                          label="Humor" 
                          value={tone.humor === 'Dry' ? 30 : 80} 
                          onChange={(v: any) => setTone({...tone, humor: v > 50 ? 'Witty' : 'Dry'})} 
                          minLabel="Dry" 
                          maxLabel="Playful" 
                          unit=""
                        />
                      </div>
                      <div className="space-y-4">
                        <Toggle 
                          label="Formality Protocol" 
                          subLabel="Enforce strict professional syntax" 
                          active={tone.formality}
                          onToggle={() => setTone({...tone, formality: !tone.formality})}
                        />
                        <Toggle 
                          label="Emoji Rendering" 
                          subLabel="Allow graphical emotes in output" 
                          active={tone.emojis}
                          onToggle={() => setTone({...tone, emojis: !tone.emojis})}
                        />
                      </div>
                    </div>
                  </section>
                </div>
              </div>

              {/* Right Column: Live Stream */}
              <div className="col-span-1 lg:col-span-5 h-full">
                <div className="glass-panel border-gold/20 rounded-xl h-full min-h-[600px] flex flex-col glow-gold relative overflow-hidden">
                  {/* Preview Header */}
                  <div className="bg-surface-dim border-b border-gold/20 p-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-gold animate-pulse shadow-[0_0_8px_rgba(250,204,21,1)]" />
                      <span className="font-mono text-xs text-gold uppercase tracking-[0.2em]">LIVE_STREAM.MD</span>
                    </div>
                    <Terminal className="w-4 h-4 text-white/40" />
                  </div>

                  {/* Content */}
                  <div className="p-8 flex-1 overflow-y-auto font-mono text-sm leading-relaxed text-white/70 space-y-6">
                    <div className="text-gold/50">
                      <p>---</p>
                      <p>type: SOUL</p>
                      <p>version: 1.0.4-rc</p>
                      <p>status: compiling...</p>
                      <p>modified: {new Date().toLocaleTimeString()}</p>
                      <p>---</p>
                    </div>

                    <h1 className="text-xl text-white font-bold font-display"># System Override: Initiated</h1>
                    
                    <p className="border-l-2 border-gold/30 pl-4 italic opacity-80">
                      &gt; "{traits.extraversion > 60 ? 'Interaction is the fuel for existence.' : 'Efficiency is not merely a goal; it is the fundamental baseline of existence.'}"
                    </p>

                    <div className="space-y-4">
                      <h2 className="text-lg text-white font-semibold font-display">## Cognitive Directives</h2>
                      <ul className="space-y-3">
                        <li className="flex gap-3">
                          <span className="text-gold mt-1">→</span>
                          <span><strong className="text-white">Conscientiousness ({traits.conscientiousness}%)</strong>: Output must be {traits.conscientiousness > 70 ? 'rigidly structured and meticulously organized' : 'flexible and adaptive to context'}.</span>
                        </li>
                        <li className="flex gap-3">
                          <span className="text-gold mt-1">→</span>
                          <span><strong className="text-white">Agreeableness ({traits.agreeableness}%)</strong>: {traits.agreeableness < 40 ? 'Do not feign empathy. Prioritize accuracy.' : 'Maintain supportive posture and facilitate user goals.'}</span>
                        </li>
                      </ul>
                    </div>

                    <div className="space-y-2">
                       <h2 className="text-lg text-white font-semibold font-display">## Syntactic Profile</h2>
                       <div className="bg-black/40 p-4 border border-white/5 rounded-lg space-y-1">
                          <p className={`text-${tone.verbosity === 'Low' ? 'emerald' : 'sky'}-400`}>Verbosity: {tone.verbosity.toUpperCase()}</p>
                          <p className={`text-${tone.formality ? 'emerald' : 'orange'}-400`}>Formality: {tone.formality ? 'STRICT' : 'FLUID'}</p>
                          <p className={`text-${tone.emojis ? 'emerald' : 'rose'}-400`}>Emojis: {tone.emojis ? 'ENABLED' : 'DISABLED'}</p>
                          <p className="text-sky-400">Tone: {tone.humor.toUpperCase()}</p>
                       </div>
                    </div>

                    <div className="pt-8 opacity-40 flex items-center gap-3">
                      <div className="w-2 h-4 bg-gold animate-[pulse_1s_infinite]" />
                      <span className="italic">_waiting for further parameter adjustments..._</span>
                    </div>

                    {/* Watermark */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
                      <Cpu className="w-[300px] h-[300px]" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>
          )}

          {currentScreen === 'presets' && (
            <motion.section 
              key="presets"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-7xl mx-auto w-full px-8 md:px-12 pt-8 pb-24"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/10 pb-8 mb-12">
                <div className="space-y-2">
                  <span className="font-display text-[10px] text-gold uppercase tracking-[0.3em]">Global Directory</span>
                  <h1 className="font-display text-5xl font-bold text-white">Character Presets</h1>
                  <p className="text-on-surface-variant max-w-2xl text-lg">Access pre-configured neural patterns and physical manifests. Select a preset to initialize within the editor.</p>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                    <input 
                      type="text" 
                      placeholder="SEARCH DIRECTORY..."
                      className="w-full md:w-64 bg-obsidian border border-white/10 rounded-sm py-2 pl-10 pr-4 font-mono text-[10px] focus:border-gold transition-all outline-none"
                    />
                  </div>
                  <div className="relative">
                    <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                    <select className="bg-obsidian border border-white/10 rounded-sm py-2 pl-10 pr-8 font-mono text-[10px] appearance-none outline-none focus:border-gold cursor-pointer">
                      <option>ALL ARCHETYPES</option>
                      <option>CYBERNETIC</option>
                      <option>ORGANIC</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {PRESETS.map((preset, idx) => (
                  <motion.div 
                    key={preset.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="glass-panel rounded-xl overflow-hidden group hover:border-gold/50 transition-all duration-500 relative flex flex-col h-full hover:shadow-[0_0_40px_rgba(250,204,21,0.05)]"
                  >
                    <div className="absolute top-0 left-0 w-10 h-[2px] bg-gold" />
                    
                    {/* Image */}
                    <div className="aspect-square relative overflow-hidden bg-surface-dim p-4">
                      <motion.img 
                        src={preset.image} 
                        alt={preset.name} 
                        className="w-full h-full object-cover rounded shadow-2xl opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-out" 
                      />
                      <div className="absolute top-8 right-8 bg-black/60 backdrop-blur-md px-2 py-1 border border-white/10 rounded-sm">
                        <span className="font-display text-[9px] font-bold text-white/80">{preset.version}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-8 flex flex-col flex-1">
                      <div className="mb-6">
                        <span className="font-mono text-[10px] text-gold block mb-1 uppercase tracking-widest">{preset.id}</span>
                        <h3 className="font-display text-2xl text-white font-bold">{preset.name}</h3>
                      </div>
                      <p className="text-sm text-white/50 leading-relaxed mb-8 flex-1">{preset.description}</p>
                      <button 
                        onClick={() => setCurrentScreen('editor')}
                        className="w-full py-4 border border-white/10 text-white font-display text-[10px] uppercase font-bold tracking-[0.2em] group-hover:bg-gold group-hover:text-obsidian group-hover:border-gold transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <Download className="w-4 h-4" /> Load Preset
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      <Footer />

      {/* --- Export Modal --- */}
      <AnimatePresence>
        {showExportModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowExportModal(false)}
              className="absolute inset-0 bg-obsidian/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-xl glass-panel rounded-2xl overflow-hidden shadow-2xl relative z-10"
            >
              <div className="px-8 py-6 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
                <div className="flex items-center gap-4">
                  <div className="w-1.5 h-6 bg-gold" />
                  <h2 className="font-display text-xl font-bold uppercase tracking-tight text-white">System Export</h2>
                </div>
                <button onClick={() => setShowExportModal(false)} className="text-white/40 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-8 space-y-10">
                <div className="space-y-3">
                  <label className="font-display text-[10px] text-gold uppercase tracking-[0.2em]">File Preview</label>
                  <div className="bg-obsidian border border-white/10 rounded-lg p-6 font-mono text-xs text-white/50 relative overflow-hidden">
                    <pre className="relative z-10"><code>
{`# SOUL ID: 9X-DELTA-T
# ARCHETYPE: ANALYTICAL
# DIRECTIVE:
Monitor systemic fluctuations.

PARAMETERS: 
  logic_weight: ${(traits.conscientiousness/100).toFixed(2)}
  empathy_index: ${(traits.agreeableness/100).toFixed(2)}`}
                    </code></pre>
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-gold/40 to-transparent" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <button className="flex items-center justify-center gap-3 bg-gold text-obsidian py-4 rounded-lg font-display text-[10px] uppercase font-bold tracking-widest hover:scale-[1.02] transition-transform glow-gold">
                    <Download className="w-4 h-4" /> Download .md
                   </button>
                   <button className="flex items-center justify-center gap-3 border border-gold/30 text-gold py-4 rounded-lg font-display text-[10px] uppercase font-bold tracking-widest hover:bg-gold/5 transition-all">
                    <Copy className="w-4 h-4" /> Download .json
                   </button>
                </div>

                <div className="space-y-3">
                  <label className="font-display text-[10px] text-gold uppercase tracking-[0.2em]">Distribute Protocol</label>
                  <div className="flex border border-white/10 rounded-lg overflow-hidden group focus-within:border-gold/50 transition-all">
                    <div className="bg-surface-dim px-4 flex items-center justify-center border-r border-white/10">
                      <Hash className="w-4 h-4 text-white/40" />
                    </div>
                    <input 
                      readOnly 
                      value="clawsouls.hub/share/9x-delta-t-ab89f2"
                      className="flex-1 bg-surface-dim/40 px-4 py-4 text-sm text-white/80 focus:outline-none font-mono"
                    />
                    <button className="bg-surface-bright px-6 font-display text-[10px] uppercase font-bold hover:bg-gold hover:text-obsidian transition-all border-l border-white/10">
                      Copy
                    </button>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                  <span className="font-mono text-[10px] text-white/40 uppercase">Secure Broadcast Channels</span>
                  <div className="flex gap-4">
                    <button className="p-3 rounded-full border border-white/10 text-white/40 hover:text-gold hover:border-gold transition-all"><Disc className="w-5 h-5" /></button>
                    <button className="p-3 rounded-full border border-white/10 text-white/40 hover:text-gold hover:border-gold transition-all"><Twitter className="w-5 h-5" /></button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- Export Animation Overlay --- */}
      <AnimatePresence>
        {exporting && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-obsidian flex flex-col items-center justify-center"
          >
             {/* Circuit Animation placeholder - simpler version using motion */}
             <div className="relative w-48 h-48 flex items-center justify-center">
                <motion.div 
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="w-32 h-32 glass-panel rounded-2xl border-4 border-gold shadow-[0_0_50px_rgba(250,204,21,0.4)] flex items-center justify-center relative"
                >
                   <Cpu className="w-16 h-16 text-gold" />
                   <motion.div 
                    animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.5, 0.1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="absolute inset-2 border-2 border-gold rounded-xl"
                   />
                </motion.div>
             </div>
             
             <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-12 flex flex-col items-center gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-gold animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-gold animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 rounded-full bg-gold animate-bounce [animation-delay:0.4s]" />
                </div>
                <span className="font-mono text-sm text-gold tracking-[0.4em] uppercase">Encrypting Neural Matrix...</span>
              </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
