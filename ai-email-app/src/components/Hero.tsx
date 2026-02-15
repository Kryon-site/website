import { motion } from 'framer-motion';
import { Sparkles, Zap, Shield, MousePointer2 } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20 overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center max-w-4xl"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-purple-400 mb-8">
          <Sparkles className="w-3 h-3" />
          <span>The next generation of business communication</span>
        </div>

        <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-8 text-gradient leading-[1.1]">
          AI that writes <br />
          <span className="text-white">better emails than you.</span>
        </h1>

        <p className="text-lg md:text-xl text-white/60 mb-10 max-w-2xl mx-auto leading-relaxed">
          Supercharge your business with MailAI. Automate outreach, personalize every touchpoint, and close deals faster with our advanced AI engine.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <button className="w-full sm:w-auto px-8 py-4 bg-primary text-white rounded-full font-bold text-lg hover:scale-105 transition-transform purple-glow">
            Start Free Trial
          </button>
          <button className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 text-white rounded-full font-bold text-lg hover:bg-white/10 transition-colors">
            Book a Demo
          </button>
        </div>

        {/* Floating Icons/Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {[
            { icon: Zap, title: "Lightning Fast", desc: "Draft emails in seconds, not minutes." },
            { icon: Shield, title: "Enterprise Secure", desc: "Bank-level encryption for your data." },
            { icon: MousePointer2, title: "One-Click Send", desc: "Seamlessly integrates with your workflow." }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="glass-morphism p-6 rounded-3xl text-left hover:border-white/20 transition-colors group"
            >
              <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                <item.icon className="w-5 h-5" />
              </div>
              <h3 className="font-semibold mb-1 text-white">{item.title}</h3>
              <p className="text-sm text-white/40">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Grid Pattern Background */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary opacity-20 blur-[100px]"></div>
      </div>
    </div>
  );
};

export default Hero;
