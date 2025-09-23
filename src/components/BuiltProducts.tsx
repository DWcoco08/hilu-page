import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { Button } from "./ui/button";
import { useMobileDetect } from "../hooks/useMobileDetect";

export function BuiltProducts() {
  const isMobile = useMobileDetect();
  const [expandedProduct, setExpandedProduct] = useState<number | null>(null);

  const products = [
    {
      title: "E-commerce Marketplace",
      brief: "Multi-vendor platform solution",
      description: "A comprehensive marketplace platform that connects multiple vendors with customers through an intuitive interface. Features advanced vendor management, automated commission handling, integrated payment processing, and real-time analytics. Built with scalable architecture to handle thousands of concurrent users while maintaining lightning-fast performance.",
      demoType: "Live Demo Available"
    },
    {
      title: "Performance Management Platform",
      brief: "Employee development & analytics",
      description: "An intelligent HR platform that streamlines employee performance tracking, goal setting, and professional development. Features automated performance reviews, skill gap analysis, personalized learning recommendations, and comprehensive analytics dashboards. Helps organizations make data-driven decisions about talent development and retention.",
      demoType: "Case Study"
    },
    {
      title: "Court Booking System",
      brief: "Smart facility reservation platform",
      description: "A sophisticated facility management system designed for sports courts, meeting rooms, and recreational facilities. Features intelligent scheduling algorithms, automated conflict resolution, mobile-first booking interface, and integrated payment processing. Reduces administrative overhead by 60% while improving user satisfaction through seamless booking experiences.",
      demoType: "Product Blog"
    }
  ];

  const toggleExpanded = (index: number) => {
    setExpandedProduct(expandedProduct === index ? null : index);
  };

  // Mobile version - simplified without animations
  if (isMobile) {
    return (
      <section id="built-products" className="py-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl text-gray-900 mb-6">Built Products</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real solutions we've built that showcase our hi-logic approach
            </p>
          </div>

          <div className="space-y-6">
            {products.map((product, index) => (
              <div
                key={product.title}
                className="bg-white/30 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 group"
              >
                {/* Main product card */}
                <div
                  onClick={() => toggleExpanded(index)}
                  className="p-8 cursor-pointer relative overflow-hidden"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-2xl text-gray-900 mb-2 group-hover:text-[#125EF1] transition-colors duration-300">
                        {product.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {product.brief}
                      </p>
                    </div>

                    <div className={`ml-6 w-8 h-8 bg-[#125EF1]/10 rounded-full flex items-center justify-center group-hover:bg-[#125EF1]/20 transition-all duration-300 ${expandedProduct === index ? 'rotate-180' : ''}`}>
                      <div className="w-4 h-4 border-r-2 border-b-2 border-[#125EF1] transform rotate-45" />
                    </div>
                  </div>

                  {/* Animated background on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#125EF1]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Expanded content */}
                {expandedProduct === index && (
                  <div className="border-t border-white/30 bg-white/50 backdrop-blur-sm">
                    <div className="p-8">
                      <p className="text-gray-700 leading-relaxed mb-6">
                        {product.description}
                      </p>

                      <Button className="bg-[#125EF1] hover:bg-[#0e4dc4] text-white px-6 py-3 rounded-full transition-all duration-300">
                        View {product.demoType}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Desktop version with animations
  return (
    <section id="built-products" className="py-24">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl text-gray-900 mb-6">Built Products</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real solutions we've built that showcase our hi-logic approach
          </p>
        </motion.div>

        <div className="space-y-6">
          {products.map((product, index) => (
            <motion.div
              key={product.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-white/30 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 group"
            >
              {/* Main product card */}
              <motion.div
                onClick={() => toggleExpanded(index)}
                className="p-8 cursor-pointer relative overflow-hidden"
                whileHover={{ backgroundColor: "rgba(18, 94, 241, 0.02)" }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <motion.h3
                      className="text-2xl text-gray-900 mb-2 group-hover:text-[#125EF1] transition-colors duration-300"
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      {product.title}
                    </motion.h3>
                    <p className="text-gray-600 leading-relaxed">
                      {product.brief}
                    </p>
                  </div>

                  <motion.div
                    animate={{
                      rotate: expandedProduct === index ? 180 : 0,
                      scale: expandedProduct === index ? 1.1 : 1
                    }}
                    transition={{ duration: 0.3 }}
                    className="ml-6 w-8 h-8 bg-[#125EF1]/10 rounded-full flex items-center justify-center group-hover:bg-[#125EF1]/20 transition-colors duration-300"
                  >
                    <motion.div
                      className="w-4 h-4 border-r-2 border-b-2 border-[#125EF1] transform rotate-45"
                    />
                  </motion.div>
                </div>

                {/* Animated background on hover */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-[#125EF1]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
              </motion.div>

              {/* Expanded content */}
              <AnimatePresence>
                {expandedProduct === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="border-t border-white/30 bg-white/50 backdrop-blur-sm"
                  >
                    <div className="p-8">
                      <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        className="text-gray-700 leading-relaxed mb-6"
                      >
                        {product.description}
                      </motion.p>

                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                      >
                        <Button
                          className="bg-[#125EF1] hover:bg-[#0e4dc4] text-white px-6 py-3 rounded-full transition-all duration-300 relative group overflow-hidden"
                        >
                          <span className="relative z-10">View {product.demoType}</span>
                          <motion.div
                            className="absolute inset-0 bg-white/20"
                            initial={{ scale: 0, opacity: 0 }}
                            whileHover={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          />
                        </Button>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}