import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import ProductCard from "@/components/products/ProductCard";
import { useCart } from "@/hooks/useCart";
import { Loader2, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import sampleProducts from "@/data/sampleProducts";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function Products() {
  const { addToCart } = useCart();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("default");

  const categories = [
    { key: "all", label: t("all") },
    { key: "security_cameras", label: t("securityCameras") },
    { key: "cables", label: t("cables") },
    { key: "networking", label: t("networking") },
    { key: "smart_home", label: t("smartHome") },
    { key: "power_supplies", label: t("powerSupplies") },
    { key: "accessories", label: t("accessories") },
  ];

  const sortOptions = [
    { key: "default", label: t("default") },
    { key: "price_asc", label: t("priceAsc") },
    { key: "price_desc", label: t("priceDesc") },
    { key: "offers", label: t("onSaleFirst") },
  ];

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => base44.entities.Product.list("-created_date", 100),
  });

  const dataProducts = products.length > 0 ? products : sampleProducts;
  let filtered = dataProducts.filter((p) => p.is_available);
  
  // Filter by search query
  if (searchQuery) {
    filtered = filtered.filter((p) =>
      p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  
  if (category !== "all") filtered = filtered.filter((p) => p.category === category);

  if (sort === "price_asc") filtered = [...filtered].sort((a, b) => (a.offer_price || a.price) - (b.offer_price || b.price));
  else if (sort === "price_desc") filtered = [...filtered].sort((a, b) => (b.offer_price || b.price) - (a.offer_price || a.price));
  else if (sort === "offers") filtered = [...filtered].sort((a, b) => (b.is_on_offer ? 1 : 0) - (a.is_on_offer ? 1 : 0));

  return (
    <div>
      <section className="bg-gradient-to-br from-foreground to-primary/30 text-background py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-xs font-semibold uppercase tracking-widest text-primary mb-3 block">{t("catalog")}</span>
            <h1 className="font-heading text-4xl sm:text-5xl font-bold">
              {searchQuery ? `${t("searchResultsFor")} "${searchQuery}"` : t("allProducts")}
            </h1>
            <p className="text-background/70 mt-3 max-w-lg">
              {searchQuery
                ? `${t("showingResultsFor")} "${searchQuery}"`
                : t("browseFullRange")
              }
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-8 border-b border-border/50 sticky top-0 bg-background z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide" style={{ scrollbarWidth: "none" }}>
            {categories.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setCategory(cat.key)}
                  className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border transition-all
                    ${category === cat.key
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-muted-foreground border-border/50 hover:border-primary/40 hover:text-foreground"
                    }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="text-sm bg-card border border-border/50 rounded-lg px-3 py-1.5 text-foreground focus:outline-none focus:border-primary"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.key} value={opt.key}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">No products found in this category.</p>
              <Button variant="outline" className="mt-4" onClick={() => setCategory("all")}>Clear Filter</Button>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-6">{filtered.length} product{filtered.length !== 1 ? "s" : ""} found</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                <AnimatePresence>
                  {filtered.map((product, i) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: i * 0.03 }}
                    >
                      <ProductCard product={product} onAddToCart={addToCart} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}