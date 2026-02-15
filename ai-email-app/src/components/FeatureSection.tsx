import { motion } from 'framer-motion';
import { Bot, LineChart, Globe, Users } from 'lucide-react';

const features = [
  {
    icon: Bot,
    title: "AI Writing Assistant",
    description: "Our advanced AI learns your tone of voice and writes perfectly tailored emails every time.",
    color: "bg-blue-500/20 text-blue-400"
  },
  {
    icon: LineChart,
    title: "Analytics Dashboard",
    description: "Track open rates, click-throughs, and conversions with deep-dive analytics.",
    color: "bg-emerald-500/20 text-emerald-400"
  },
  {
    icon: Globe,
    title: "Global Reach",
    description: "Translate and localize your outreach to 50+ languages with native-level fluency.",
    color: "bg-orange-500/20 text-orange-400"
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Share templates, insights, and manage team workflows in one central hub.",
    color: "bg-purple-500/20 text-purple-400"
  }
];

const FeatureSection = () => {
  return (
    <div className="py-24 px-6 max-w-7xl mx-auto relative">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold mb-4 text-gradient">Built for modern teams</h2>
        <p className="text-white/60 max-w-2xl mx-auto">Everything you need to scale your business communication without losing the personal touch.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="group p-8 rounded-3xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition-all duration-300 hover:border-white/20"
          >
            <div className={`w-12 h-12 rounded-2xl ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
              <feature.icon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
            <p className="text-white/50 leading-relaxed text-sm">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FeatureSection;
