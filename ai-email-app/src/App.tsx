import Navbar from './components/Navbar'
import Hero from './components/Hero'
import FeatureSection from './components/FeatureSection'
import { motion, useScroll, useSpring } from 'framer-motion'

function App() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="min-h-screen bg-[#030303] text-white selection:bg-primary/30">
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary origin-left z-[60]"
        style={{ scaleX }}
      />

      <Navbar />

      <main>
        <Hero />

        {/* Decorative Spacer */}
        <div className="h-24 bg-gradient-to-b from-transparent to-white/[0.02]" />

        <FeatureSection />

        {/* CTA Section */}
        <div className="py-24 px-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-primary/5 blur-[120px]" />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto glass-morphism p-12 md:p-20 rounded-[40px] border-primary/20"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Ready to transform your inbox?</h2>
            <p className="text-white/60 text-lg mb-10 max-w-xl mx-auto">
              Join 10,000+ businesses using MailAI to automate their communication and grow faster.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="px-10 py-4 bg-white text-black rounded-full font-bold text-lg hover:scale-105 transition-transform">
                Get Started for Free
              </button>
              <button className="px-10 py-4 border border-white/10 rounded-full font-bold text-lg hover:bg-white/5 transition-colors">
                Contact Sales
              </button>
            </div>
          </motion.div>
        </div>
      </main>

      <footer className="py-12 px-6 border-t border-white/5 text-center text-white/40 text-sm">
        <p>© 2024 MailAI Inc. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default App
