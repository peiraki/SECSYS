import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const CATEGORIES = [
  {
    key: "security_cameras",
    color: "from-blue-600/20 to-blue-900/30",
    accent: "bg-blue-500",
  },
  {
    key: "networking",
    color: "from-purple-600/20 to-purple-900/30",
    accent: "bg-purple-500",
  },
  {
    key: "cables",
    color: "from-emerald-600/20 to-emerald-900/30",
    accent: "bg-emerald-500",
  },
  {
    key: "smart_home",
    color: "from-orange-600/20 to-orange-900/30",
    accent: "bg-orange-500",
  },
  {
    key: "power_supplies",
    color: "from-red-600/20 to-red-900/30",
    accent: "bg-red-500",
  },
  {
    key: "accessories",
    color: "from-slate-600/20 to-slate-900/30",
    accent: "bg-slate-500",
  },
];

/**
 * @typedef {Object} CatalogProduct
 * @property {string|number} id
 * @property {string} name
 * @property {string} category
 * @property {boolean} is_available
 * @property {string} [image_url]
 */

/**
 * @param {{ products?: CatalogProduct[] }} props
 */
export default function CatalogSlider({ products = [] }) {
  const { t } = useTranslation();
  const scrollRef = useRef(/** @type {HTMLDivElement | null} */ (null));

  const scroll = /** @param {'left'|'right'} dir */ (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === "left" ? -320 : 320, behavior: "smooth" });
    }
  };

  const categories = CATEGORIES.map((category) => ({
    ...category,
    label: t(`category.${category.key}`),
    description: t(`category.${category.key}Description`),
  }));

  const getProductsForCategory = /** @param {string} key */ (key) =>
    products.filter((p) => p.category === key && p.is_available);

  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-primary mb-2 block">
              {t("shopByCategory")}
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
              {t("browseCatalog")}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/products">
              <Button variant="outline" size="sm" className="gap-2 hidden sm:flex">
                {t("viewAll")} <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" className="rounded-full h-8 w-8" onClick={() => scroll("left")}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full h-8 w-8" onClick={() => scroll("right")}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {categories.map((cat, i) => {
            const catProducts = getProductsForCategory(cat.key);
            const preview = catProducts.slice(0, 3);
            return (
              <motion.div
                key={cat.key}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="flex-shrink-0 w-[260px] snap-start"
              >
                <Link to={`/products?category=${cat.key}`}>
                  <div className={`relative bg-gradient-to-br ${cat.color} border border-border/50 rounded-2xl overflow-hidden group hover:shadow-xl transition-all duration-500 h-[280px] flex flex-col justify-between p-5`}>
                    <div>
                      <div className={`w-2 h-2 rounded-full ${cat.accent} mb-3`} />
                      <h3 className="font-heading font-bold text-foreground text-lg">{cat.label}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{cat.description}</p>
                      <Badge variant="secondary" className="mt-2 text-xs">
                        {catProducts.length} {catProducts.length === 1 ? t("item") : t("items")}
                      </Badge>
                    </div>

                    <div className="flex gap-2 mt-4">
                      {preview.map((p, idx) => (
                        <div
                          key={p.id}
                          className="w-14 h-14 rounded-lg overflow-hidden bg-card/60 border border-border/30 flex-shrink-0"
                          style={{ zIndex: preview.length - idx }}
                        >
                          {p.image_url ? (
                            <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          ) : (
                            <div className="w-full h-full bg-muted" />
                          )}
                        </div>
                      ))}
                      {catProducts.length === 0 && (
                        <span className="text-xs text-muted-foreground">{t("comingSoon")}</span>
                      )}
                    </div>

                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}