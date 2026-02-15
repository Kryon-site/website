import { Mail, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 mx-auto max-w-7xl"
    >
      <div className="flex items-center gap-2 group cursor-pointer">
        <div className="bg-primary p-2 rounded-xl group-hover:scale-110 transition-transform duration-300">
          <Mail className="w-6 h-6 text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight">MailAI</span>
      </div>

      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/70">
        <a href="#" className="hover:text-white transition-colors">Product</a>
        <a href="#" className="hover:text-white transition-colors">Solutions</a>
        <a href="#" className="hover:text-white transition-colors">Pricing</a>
        <a href="#" className="hover:text-white transition-colors">Developers</a>
      </div>

      <div className="flex items-center gap-4">
        <button className="hidden sm:block text-sm font-medium hover:text-white transition-colors">
          Sign In
        </button>
        <button className="bg-white text-black px-5 py-2 rounded-full text-sm font-semibold flex items-center gap-2 hover:bg-white/90 transition-all hover:gap-3">
          Get Started <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.nav>
  );
};

export default Navbar;
