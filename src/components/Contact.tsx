import { motion } from "motion/react";
import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner@2.0.3";
import { useMobileDetect } from "../hooks/useMobileDetect";

declare global {
  interface Window {
    turnstile: any;
  }
}

export function Contact() {
  const isMobile = useMobileDetect();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [errors, setErrors] = useState({
    name: false,
    email: false
  });
  const [turnstileToken, setTurnstileToken] = useState<string>("");
  const turnstileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load Turnstile widget
    if (window.turnstile && turnstileRef.current) {
      window.turnstile.render(turnstileRef.current, {
        sitekey: '0x4AAAAAAB20YkbQa1D11qIz',
        callback: (token: string) => {
          setTurnstileToken(token);
        },
        'error-callback': () => {
          toast.error("Captcha verification failed. Please refresh and try again.");
          setTurnstileToken("");
        },
        'expired-callback': () => {
          setTurnstileToken("");
        }
      });
    }
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: false }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      name: formData.name.trim() === "",
      email: formData.email.trim() === ""
    };

    setErrors(newErrors);

    if (newErrors.name) {
      toast.error("Please enter your name");
    }
    if (newErrors.email) {
      toast.error("Please enter your email address");
    }

    return !newErrors.name && !newErrors.email;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!turnstileToken) {
      toast.error("Please complete the captcha verification");
      return;
    }

    if (validateForm()) {
      try {
        // Worker URL
        const workerUrl = 'https://hilu-website.btt7m8gzm7.workers.dev';

        const response = await fetch(`${workerUrl}/api/contact`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formData,
            turnstileToken
          }),
        });

        const result = await response.json();

        if (response.ok) {
          toast.success("Message sent successfully! We'll get back to you within 24 hours.");
          // Reset form
          setFormData({ name: "", email: "", message: "" });
        } else {
          toast.error(result.error || "Failed to send message. Please try again.");
        }
      } catch (error) {
        console.error('Submit error:', error);
        toast.error("Network error. Please check your connection and try again.");
      }
    }
  };

  const quickContactMethods = [
    {
      title: "Email",
      info: "elie@ctld.life",
      action: "mailto:elie@ctld.life"
    },
    {
      title: "Telegram",
      info: "@elieting",
      action: "https://t.me/elieting"
    },
    {
      title: "Schedule Call",
      info: "Book a meeting",
      action: "https://calendly.com/hilu"
    }
  ];

  // Mobile version - simplified without animations
  if (isMobile) {
    return (
      <section id="contact" className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          {/* Header with CTA */}
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl text-gray-900 mb-8 leading-tight">
              Don't let your big idea wait — <br />
              <span className="text-[#125EF1]">let us help you build it right.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Quick Contact Section */}
            <div className="space-y-8">
              <h3 className="text-2xl text-gray-900 mb-8">
                Let's talk now
              </h3>

              {quickContactMethods.map((method) => (
                <a
                  key={method.title}
                  href={method.action}
                  className="flex items-center space-x-6 p-6 bg-white/30 backdrop-blur-md border border-white/20 rounded-xl hover:bg-white/50 hover:shadow-lg transition-all duration-300 group cursor-pointer"
                >
                  <div className="w-14 h-14 bg-[#125EF1]/10 rounded-full flex items-center justify-center group-hover:bg-[#125EF1]/20 transition-colors duration-300">
                    <div className="w-6 h-6 bg-[#125EF1] rounded-full" />
                  </div>
                  <div>
                    <h4 className="text-lg text-gray-900 group-hover:text-[#125EF1] transition-colors duration-300 mb-1">
                      {method.title}
                    </h4>
                    <p className="text-[#125EF1]">{method.info}</p>
                  </div>
                </a>
              ))}
            </div>

            {/* Contact Form */}
            <div className="bg-white/30 backdrop-blur-md border border-white/20 rounded-2xl p-8 hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-2xl text-gray-900 mb-2">
                Leave a message and we'll reach you
              </h3>
              <p className="text-gray-600 mb-8">
                Tell us about your project and we'll get back to you within 24 hours.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-gray-700 mb-2">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Your name"
                    className={`w-full focus:border-[#125EF1] focus:ring-[#125EF1] transition-colors duration-300 bg-white ${
                      errors.name ? "border-red-500" : "border-gray-200"
                    }`}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="your@email.com"
                    className={`w-full focus:border-[#125EF1] focus:ring-[#125EF1] transition-colors duration-300 bg-white ${
                      errors.email ? "border-red-500" : "border-gray-200"
                    }`}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-gray-700 mb-2">
                    Message <span className="text-gray-500">(optional)</span>
                  </label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                    placeholder="Tell us about your project, timeline, and goals..."
                    rows={5}
                    className="w-full border-gray-200 focus:border-[#125EF1] focus:ring-[#125EF1] transition-colors duration-300 resize-none bg-white"
                  />
                </div>

                <div className="flex justify-center">
                  <div ref={turnstileRef}></div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#125EF1] hover:bg-[#0e4dc4] text-white py-4 rounded-lg transition-all duration-300"
                >
                  Send Message
                </Button>
              </form>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-20 pt-12 border-t border-gray-200">
            <p className="text-gray-600 mb-4">
              © 2024 Hilu. We make Hi-Logic, user-centric programs with intelligent systems.
            </p>
            <div className="flex justify-center space-x-6 text-sm text-gray-500">
              {['Privacy Policy', 'Terms of Service', 'LinkedIn', 'GitHub'].map((link) => (
                <a
                  key={link}
                  href="#"
                  className="hover:text-[#125EF1] transition-colors duration-300"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Desktop version with full animations
  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Header with CTA */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center mb-16"
        >
          <motion.h2
            className="text-4xl lg:text-5xl text-gray-900 mb-8 leading-tight"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            Don't let your big idea wait — <br />
            <span className="text-[#125EF1]">let us help you build it right.</span>
          </motion.h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Quick Contact Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
          >
            <motion.h3
              className="text-2xl text-gray-900 mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              Let's talk now
            </motion.h3>

            {quickContactMethods.map((method, index) => (
              <motion.a
                key={method.title}
                href={method.action}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 + 0.15 }}
                whileHover={{
                  x: 10,
                  transition: { duration: 0.2 }
                }}
                className="flex items-center space-x-6 p-6 bg-white/30 backdrop-blur-md border border-white/20 rounded-xl hover:bg-white/50 hover:shadow-lg transition-all duration-300 group cursor-pointer"
              >
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  transition={{ duration: 0.3 }}
                  className="w-14 h-14 bg-[#125EF1]/10 rounded-full flex items-center justify-center group-hover:bg-[#125EF1]/20 transition-colors duration-300"
                >
                  <div className="w-6 h-6 bg-[#125EF1] rounded-full" />
                </motion.div>
                <div>
                  <h4 className="text-lg text-gray-900 group-hover:text-[#125EF1] transition-colors duration-300 mb-1">
                    {method.title}
                  </h4>
                  <p className="text-[#125EF1]">{method.info}</p>
                </div>
              </motion.a>
            ))}
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="bg-white/30 backdrop-blur-md border border-white/20 rounded-2xl p-8 hover:shadow-xl transition-shadow duration-300"
          >
            <motion.h3
              className="text-2xl text-gray-900 mb-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              Leave a message and we'll reach you
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.15 }}
              className="text-gray-600 mb-8"
            >
              Tell us about your project and we'll get back to you within 24 hours.
            </motion.p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.2, delay: 0.2 }}
                whileFocus={{ scale: 1.02 }}
                className="transition-transform duration-200"
              >
                <label htmlFor="name" className="block text-gray-700 mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Your name"
                  className={`w-full focus:border-[#125EF1] focus:ring-[#125EF1] transition-colors duration-300 bg-white ${
                    errors.name ? "border-red-500" : "border-gray-200"
                  }`}
                  required
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.2, delay: 0.25 }}
                whileFocus={{ scale: 1.02 }}
                className="transition-transform duration-200"
              >
                <label htmlFor="email" className="block text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="your@email.com"
                  className={`w-full focus:border-[#125EF1] focus:ring-[#125EF1] transition-colors duration-300 bg-white ${
                    errors.email ? "border-red-500" : "border-gray-200"
                  }`}
                  required
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.2, delay: 0.3 }}
                whileFocus={{ scale: 1.02 }}
                className="transition-transform duration-200"
              >
                <label htmlFor="message" className="block text-gray-700 mb-2">
                  Message <span className="text-gray-500">(optional)</span>
                </label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  placeholder="Tell us about your project, timeline, and goals..."
                  rows={5}
                  className="w-full border-gray-200 focus:border-[#125EF1] focus:ring-[#125EF1] transition-colors duration-300 resize-none bg-white"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.2, delay: 0.33 }}
                className="flex justify-center"
              >
                <div ref={turnstileRef}></div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.2, delay: 0.35 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="submit"
                  className="w-full bg-[#125EF1] hover:bg-[#0e4dc4] text-white py-4 rounded-lg transition-all duration-300 relative group overflow-hidden"
                >
                  <span className="relative z-10">Send Message</span>
                  <motion.div
                    className="absolute inset-0 bg-white/10"
                    initial={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </Button>
              </motion.div>
            </form>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="text-center mt-20 pt-12 border-t border-gray-200"
        >
          <motion.p
            className="text-gray-600 mb-4"
            whileHover={{ color: "#125EF1" }}
            transition={{ duration: 0.3 }}
          >
            © 2024 Hilu. We make Hi-Logic, user-centric programs with intelligent systems.
          </motion.p>
          <motion.div
            className="flex justify-center space-x-6 text-sm text-gray-500"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            {['Privacy Policy', 'Terms of Service', 'LinkedIn', 'GitHub'].map((link, index) => (
              <motion.a
                key={link}
                href="#"
                whileHover={{ scale: 1.1, color: "#125EF1" }}
                transition={{ duration: 0.2 }}
                className="hover:text-[#125EF1] transition-colors duration-300"
              >
                {link}
              </motion.a>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}