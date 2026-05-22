import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Zap, Headphones } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-foreground via-foreground to-primary/30 text-background">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/30 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-6">
              <Zap className="w-3.5 h-3.5" /> {t("newArrivals")}
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              {t("premiumTech")}
              <br />
              <span className="text-primary">{t("securitySolutions")}</span>
            </h1>
            <p className="text-background/70 text-lg max-w-lg mb-8 leading-relaxed">
              {t("discoverTopTier")}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/about">
                <Button size="lg" className="rounded-full gap-2 px-8 bg-primary hover:bg-primary/90">
                  {t("shopNow")} <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/about">
                <Button size="lg" variant="outline" className="rounded-full px-8 border-background/30 text-background hover:bg-background/10">
                  {t("learnMore")}
                </Button>
              </Link>
            </div>

            <div className="flex gap-8 mt-12">
              {[
                { icon: Shield, label: t("warranty2Year") },
                { icon: Zap, label: t("fastShipping") },
                { icon: Headphones, label: t("support24_7") },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2 text-sm text-background/60">
                  <item.icon className="w-4 h-4 text-primary" />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="hidden lg:block"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-3xl blur-2xl" />
              <img
                src="https://media.base44.com/images/public/6a0f4b4a09f0706b313458bb/bdf49cdb1_generated_0d3a5c6b.png"
                alt="Security camera system"
                className="relative rounded-3xl shadow-2xl w-full"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}