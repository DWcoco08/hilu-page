import { motion } from "motion/react";
import { useMobileDetect } from "../hooks/useMobileDetect";

export function About() {
  const isMobile = useMobileDetect();

  // Mobile version - no animations, plain HTML
  if (isMobile) {
    return (
      <section id="about" className="py-24 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="text-center">
            {/* Quote */}
            <div className="mb-16">
              <div className="relative">
                <div className="absolute -top-8 -left-8 text-6xl text-[#125EF1]/20">
                  "
                </div>
                <blockquote className="text-3xl lg:text-4xl text-gray-900 leading-relaxed mb-8 relative z-10">
                  The simpler the user interface, the more complex the system behind it
                </blockquote>
                <div className="absolute -bottom-8 -right-8 text-6xl text-[#125EF1]/20">
                  "
                </div>
              </div>
            </div>

            {/* Arrow connector */}
            <div className="flex items-center justify-center mb-16">
              <div className="flex items-center space-x-4 text-xl text-gray-600">
                <div className="text-3xl text-[#125EF1]">
                  →
                </div>
              </div>
            </div>

            {/* Explanation */}
            <div className="bg-white/40 backdrop-blur-md border border-white/20 rounded-2xl p-12 shadow-sm hover:shadow-xl transition-all duration-300 relative group overflow-hidden">
              {/* Animated background on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#125EF1]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative z-10">
                <h3 className="text-2xl text-gray-900 mb-6 group-hover:text-[#125EF1] transition-colors duration-300">
                  That's why we build in the depth of logic to bring you effortless using experience
                </h3>

                <p className="text-lg text-gray-600 leading-relaxed max-w-4xl mx-auto">
                  We believe that true innovation lies in making complex technology feel intuitive.
                  Every interaction should feel natural, every feature should serve a purpose, and
                  every user should feel empowered—not overwhelmed. Behind every simple click,
                  swipe, or tap, we build sophisticated algorithms, robust architectures, and
                  intelligent systems that anticipate user needs and eliminate friction.
                </p>

                <div className="mt-8 flex justify-center">
                  <div className="flex space-x-8 text-sm text-gray-500">
                    <div className="text-center">
                      <div className="text-2xl text-[#125EF1] mb-1">Hi-Logic</div>
                      <div>Smart Systems</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl text-[#125EF1] mb-1">User-Centric</div>
                      <div>Simple Interface</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative corner elements */}
              <div className="absolute top-6 right-6 w-16 h-16 bg-gradient-to-br from-[#125EF1]/10 to-[#125EF1]/5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-6 left-6 w-12 h-12 bg-gradient-to-br from-white/50 to-[#125EF1]/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Desktop version with animations
  return (
    <section id="about" className="py-24 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          {/* Quote */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mb-16"
          >
            <div className="relative">
              <motion.div
                className="absolute -top-8 -left-8 text-6xl text-[#125EF1]/20"
                initial={{ opacity: 0, rotate: -45 }}
                whileInView={{ opacity: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                "
              </motion.div>
              <blockquote className="text-3xl lg:text-4xl text-gray-900 leading-relaxed mb-8 relative z-10">
                The simpler the user interface, the more complex the system behind it
              </blockquote>
              <motion.div
                className="absolute -bottom-8 -right-8 text-6xl text-[#125EF1]/20"
                initial={{ opacity: 0, rotate: 45 }}
                whileInView={{ opacity: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                "
              </motion.div>
            </div>
          </motion.div>

          {/* Arrow connector */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="flex items-center justify-center mb-16"
          >
            <motion.div
              className="flex items-center space-x-4 text-xl text-gray-600"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                animate={{ x: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-3xl text-[#125EF1]"
              >
                →
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Explanation */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="bg-white/40 backdrop-blur-md border border-white/20 rounded-2xl p-12 shadow-sm hover:shadow-xl transition-all duration-300 relative group overflow-hidden"
          >
            {/* Animated background on hover */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-[#125EF1]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />

            <div className="relative z-10">
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.6 }}
                className="text-2xl text-gray-900 mb-6 group-hover:text-[#125EF1] transition-colors duration-300"
              >
                That's why we build in the depth of logic to bring you effortless using experience
              </motion.h3>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.7 }}
                className="text-lg text-gray-600 leading-relaxed max-w-4xl mx-auto"
              >
                We believe that true innovation lies in making complex technology feel intuitive.
                Every interaction should feel natural, every feature should serve a purpose, and
                every user should feel empowered—not overwhelmed. Behind every simple click,
                swipe, or tap, we build sophisticated algorithms, robust architectures, and
                intelligent systems that anticipate user needs and eliminate friction.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.8 }}
                className="mt-8 flex justify-center"
              >
                <div className="flex space-x-8 text-sm text-gray-500">
                  <div className="text-center">
                    <div className="text-2xl text-[#125EF1] mb-1">Hi-Logic</div>
                    <div>Smart Systems</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl text-[#125EF1] mb-1">User-Centric</div>
                    <div>Simple Interface</div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Decorative corner elements */}
            <motion.div
              className="absolute top-6 right-6 w-16 h-16 bg-gradient-to-br from-[#125EF1]/10 to-[#125EF1]/5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              whileHover={{ scale: 1.2, rotate: 180 }}
              transition={{ duration: 0.3 }}
            />
            <motion.div
              className="absolute bottom-6 left-6 w-12 h-12 bg-gradient-to-br from-white/50 to-[#125EF1]/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              whileHover={{ scale: 1.3, rotate: -180 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}