import React from "react";
import { Shield, Users, Award, Globe, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const stats = [
  { value: "10K+", label: "Products Sold" },
  { value: "50+", label: "Brands" },
  { value: "99%", label: "Satisfaction" },
  { value: "24/7", label: "Support" },
];

const values = [
  { icon: Shield, title: "Quality First", desc: "We only carry products from trusted manufacturers with proven track records." },
  { icon: Users, title: "Customer Focus", desc: "Our dedicated team is here to help you find the perfect solution for your needs." },
  { icon: Award, title: "Expert Knowledge", desc: "Years of experience in security and networking technology at your service." },
  { icon: Globe, title: "Global Reach", desc: "We ship worldwide with fast, reliable delivery to your doorstep." },
];

export default function About() {
  return (
    <div>
      <section className="relative bg-gradient-to-br from-foreground to-primary/30 text-background py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="text-xs font-semibold uppercase tracking-widest text-primary mb-4 block">About Us</span>
              <h1 className="font-heading text-4xl sm:text-5xl font-bold leading-tight mb-6">
                Securing Spaces With <span className="text-primary">Smart Technology</span>
              </h1>
              <p className="text-background/70 text-lg leading-relaxed">
                Founded with a mission to make premium security and networking technology accessible to everyone. 
                We believe that safety and connectivity shouldn't be a luxury.
              </p>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }} className="hidden lg:block">
              <img src="https://media.base44.com/images/public/6a0f4b4a09f0706b313458bb/b57b4ad89_generated_e6e5f575.png" alt="Our team" className="rounded-2xl shadow-2xl" />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-6 bg-card rounded-2xl border border-border/50"
              >
                <p className="font-heading text-3xl font-bold text-primary">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold">Our Values</h2>
            <p className="text-muted-foreground mt-2">What drives us every day</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 bg-card rounded-2xl border border-border/50 hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl font-bold mb-4">Ready to Secure Your Space?</h2>
          <p className="text-primary-foreground/70 mb-8">Browse our collection of premium tech products.</p>
          <Link to="/">
            <Button size="lg" variant="secondary" className="rounded-full gap-2 px-8">
              Shop Now <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}