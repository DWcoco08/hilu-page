import { motion } from "motion/react";
import { useMobileDetect } from "../hooks/useMobileDetect";
import { useState } from "react";

export function Navigation() {
  const isMobile = useMobileDetect();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "What We Make", href: "#services" },
    { label: "Built Products", href: "#built-products" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ];

  // Mobile version - simplified without animations
  if (isMobile) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="cursor-pointer"
            >
              <h2 className="text-gray-900 text-xl font-semibold">Hilu</h2>
            </a>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2"
            >
              <div className="w-6 h-0.5 bg-[#125EF1] mb-1"></div>
              <div className="w-6 h-0.5 bg-[#125EF1] mb-1"></div>
              <div className="w-6 h-0.5 bg-[#125EF1]"></div>
            </button>

            {/* Desktop menu */}
            <div className="hidden md:flex space-x-8">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    const target = document.querySelector(item.href);
                    if (target) {
                      target.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  className="text-gray-700 hover:text-[#125EF1] transition-colors duration-300 cursor-pointer"
                >
                  {item.label}
                </a>
              ))}
            </div>

          </div>

          {/* Mobile menu dropdown */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    const target = document.querySelector(item.href);
                    if (target) {
                      target.scrollIntoView({ behavior: "smooth" });
                    }
                    setMobileMenuOpen(false);
                  }}
                  className="block py-2 text-gray-700 hover:text-[#125EF1] transition-colors duration-300"
                >
                  {item.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </nav>
    );
  }

  // Desktop version with animations
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-white/20"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <motion.a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            whileHover={{ scale: 1.05 }}
            className="cursor-pointer"
          >
            <h2 className="text-gray-900">Hilu</h2>
          </motion.a>

          <div className="hidden md:flex space-x-8">
            {navItems.map((item, index) => (
              <motion.a
                key={item.label}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  const target = document.querySelector(item.href);
                  if (target) {
                    target.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: index * 0.05 }}
                whileHover={{
                  scale: 1.1,
                  transition: { duration: 0.2 },
                }}
                className="text-gray-700 hover:text-[#125EF1] transition-colors duration-300 cursor-pointer relative group"
              >
                {item.label}
                <motion.div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#125EF1] group-hover:w-full transition-all duration-300" />
              </motion.a>
            ))}
          </div>

        </div>
      </div>
    </motion.nav>
  );
}
