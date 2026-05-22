import React, { useState } from "react";
import { Camera, Cable, Wifi, Home, Zap, Package } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const categories = [
  { key: "all", icon: Package },
  { key: "security_cameras", icon: Camera },
  { key: "cables", icon: Cable },
  { key: "networking", icon: Wifi },
  { key: "smart_home", icon: Home },
  { key: "power_supplies", icon: Zap },
  { key: "accessories", icon: Package },
];

/**
 * @typedef {Object} CategoryNavProps
 * @property {(category: string) => void} onCategoryChange
 * @property {string} [activeCategory]
 */

/**
 * @param {CategoryNavProps} props
 */
export default function CategoryNav({ onCategoryChange, activeCategory = "all" }) {
  const { t } = useTranslation();

  return (
    <section className="py-10 border-b border-border/50 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-heading text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-5">
          {t("shopByCategory")}
        </h2>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide" style={{ scrollbarWidth: "none" }}>
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.key;
            return (
              <motion.button
                key={cat.key}
                whileTap={{ scale: 0.95 }}
                onClick={() => onCategoryChange(cat.key)}
                className={`flex-shrink-0 flex flex-col items-center gap-2 px-5 py-3 rounded-2xl border transition-all duration-200 cursor-pointer
                  ${isActive
                    ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
                    : "bg-card text-muted-foreground border-border/50 hover:border-primary/40 hover:text-foreground hover:bg-muted/50"
                  }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium whitespace-nowrap">{t(`category.${cat.key}`)}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}