import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import sampleProducts from "@/data/sampleProducts";
import HeroSection from "@/components/home/HeroSection";
import OffersSection from "@/components/home/OffersSection";
import ProductSlider from "@/components/products/ProductSlider";
import ProductCard from "@/components/products/ProductCard";
import CategoryNav from "@/components/home/CategoryNav";
import CatalogSlider from "@/components/home/CatalogSlider";
import { useCart } from "@/hooks/useCart";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

/**
 * @typedef {Object} ProductType
 * @property {string|number} id
 * @property {string} name
 * @property {string} category
 * @property {boolean} is_available
 * @property {boolean} [is_featured]
 * @property {boolean} [is_on_offer]
 * @property {number} [offer_price]
 * @property {number} price
 * @property {string} [image_url]
 */

/**
 * @param {string} text
 */
const titleCase = (text) => text.replace(/\b\w/g, (char) => char.toUpperCase());

export default function Home() {
  const { addToCart } = useCart();
  const [activeCategory, setActiveCategory] = useState("all");
  const { t } = useTranslation();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => base44.entities.Product.list("-created_date", 50),
  });

  const dataProducts = products.length > 0 ? products : sampleProducts;
  /** @type {ProductType[]} */
  const typedProducts = /** @type {ProductType[]} */ (dataProducts);
  const featuredProducts = typedProducts.filter((p) => p.is_featured);
  const offerProducts = typedProducts.filter((p) => p.is_on_offer && p.offer_price);
  const availableProducts = typedProducts.filter((p) => p.is_available);
  const filteredProducts = activeCategory === "all"
    ? availableProducts
    : availableProducts.filter((p) => p.category === activeCategory);

  const categoryLabel = activeCategory === "all" ? t("allProducts") : filteredProducts.length > 0
    ? titleCase(filteredProducts[0].category.replace(/_/g, " "))
    : t("products");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <HeroSection />
      <CategoryNav onCategoryChange={setActiveCategory} activeCategory={activeCategory} />
      {activeCategory === "all" && <OffersSection products={offerProducts} />}
      {activeCategory === "all" && <CatalogSlider products={typedProducts} />}
      {activeCategory === "all" && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-primary mb-2 block">
                  {t("featuredProducts")}
                </span>
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
                  {t("popularPicks")}
                </h2>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {(featuredProducts.length > 0 ? featuredProducts : typedProducts.slice(0, 8)).slice(0, 8).map((product) => (
                <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
              ))}
            </div>
          </div>
        </section>
      )}
      {activeCategory === "all" && (
        <ProductSlider
          title={t("topProducts")}
          subtitle={t("bestSellers")}
          products={featuredProducts.length > 0 ? featuredProducts : typedProducts.slice(0, 8)}
          onAddToCart={addToCart}
        />
      )}
      <div className={activeCategory === "all" ? "bg-muted/50" : ""}>
        <ProductSlider
          title={activeCategory === "all" ? t("allProducts") : categoryLabel}
          subtitle={activeCategory === "all" ? t("browseOurCollection") : t("shopByCategory")}
          products={filteredProducts}
          onAddToCart={addToCart}
        />
      </div>
    </div>
  );
}