import React from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Flame } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

// @ts-ignore
export default function OffersSection({ products }) {
  const { t } = useTranslation();
  if (!products || products.length === 0) return null;

  const topOffers = products.slice(0, 3);

  return (
    <section className="py-16 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-destructive/10 text-destructive text-xs font-semibold uppercase tracking-wider mb-3">
            <Flame className="w-3.5 h-3.5" /> {t("hotDeals")}
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
            {t("specialOffers")}
          </h2>
          <p className="text-muted-foreground mt-2 max-w-md mx-auto">
            {t("limitedTimeDeals")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topOffers.map((/** @type {{ price: number; offer_price: number; id: React.Key | null | undefined; image_url: string | undefined; name: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined; }} */ product, /** @type {number} */ i) => {
            const discount = Math.round(
              ((product.price - product.offer_price) / product.price) * 100
            );
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Link to={`/product/${product.id}`}>
                  <div className="relative bg-card rounded-2xl border border-border/50 overflow-hidden group hover:shadow-xl transition-all duration-500">
                    <div className="aspect-[4/3] overflow-hidden bg-muted">
                      {product.image_url && (
                        <img
                          src={product.image_url}
                          // @ts-ignore
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      )}
                      <Badge className="absolute top-4 left-4 bg-destructive text-destructive-foreground text-sm font-bold px-3 py-1" variant={undefined}>
                        -{discount}% OFF
                      </Badge>
                    </div>
                    <div className="p-5">
                      <h3 className="font-heading font-semibold text-foreground mb-2">{product.name}</h3>
                      <div className="flex items-center gap-3">
                        <span className="font-heading text-2xl font-bold text-primary">
                          ${product.offer_price?.toFixed(2)}
                        </span>
                        <span className="text-muted-foreground line-through">
                          ${product.price.toFixed(2)}
                        </span>
                      </div>
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