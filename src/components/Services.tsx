import { motion } from "motion/react";
import { useMobileDetect } from "../hooks/useMobileDetect";

export function Services() {
  const isMobile = useMobileDetect();
  const services = [
    {
      title: "Strategy",
      description: "Turn ideas into reality.",
      details: "We transform your vision into actionable roadmaps with clear milestones and achievable goals."
    },
    {
      title: "Engineering",
      description: "Our strength, build hi-logic & user-centric software.",
      details: "Deep technical expertise in modern frameworks, scalable architectures, and clean code practices."
    },
    {
      title: "Design",
      description: "Make your branding and product stand out.",
      details: "User-centered design that balances aesthetics with functionality for memorable experiences."
    },
    {
      title: "Applied AI",
      description: "Fine-tune AI to make your systems smarter.",
      details: "Custom AI solutions that integrate seamlessly into your workflow and enhance user productivity."
    }
  ];

  // On mobile, render without animations
  if (isMobile) {
    return (
      <section id="services" className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl text-gray-900 mb-6">What We Make</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service) => (
              <div
                key={service.title}
                className="bg-white/40 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#125EF1]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative z-10">
                  <div>
                    <h3 className="text-2xl text-gray-900 mb-4 group-hover:text-[#125EF1] transition-colors duration-300">
                      {service.title}
                    </h3>
                  </div>

                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {service.description}
                  </p>

                  <p className="text-gray-500 text-sm leading-relaxed">
                    {service.details}
                  </p>
                </div>

                <div className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-br from-[#125EF1]/10 to-[#125EF1]/5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Desktop version with animations
  return (
    <section id="services" className="py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl text-gray-900 mb-6">What We Make</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{
                y: -10,
                transition: { duration: 0.3 }
              }}
              className="bg-white/40 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
            >
              {/* Hover gradient effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-[#125EF1]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />

              <div className="relative z-10">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <h3 className="text-2xl text-gray-900 mb-4 group-hover:text-[#125EF1] transition-colors duration-300">
                    {service.title}
                  </h3>
                </motion.div>

                <p className="text-gray-600 mb-4 leading-relaxed">
                  {service.description}
                </p>

                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  whileInView={{ opacity: 1, height: "auto" }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.2, delay: (index * 0.05) + 0.1 }}
                  className="text-gray-500 text-sm leading-relaxed"
                >
                  {service.details}
                </motion.p>
              </div>

              {/* Interactive corner element */}
              <motion.div
                className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-br from-[#125EF1]/10 to-[#125EF1]/5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                whileHover={{ scale: 1.2, rotate: 180 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}