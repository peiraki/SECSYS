import React from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { useCart } from "@/hooks/useCart";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingCart, ArrowLeft, CheckCircle, XCircle, Eye, Truck, Shield, RotateCcw, Loader2
} from "lucide-react";

export default function ProductDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = window.location.pathname.split("/product/")[1];
  const { addToCart } = useCart();

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", productId],
    queryFn: async () => {
      const products = await base44.entities.Product.filter({ id: productId });
      return products[0];
    },
    enabled: !!productId,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h2 className="font-heading text-2xl font-bold">Product not found</h2>
        <Link to="/"><Button>Back to Home</Button></Link>
      </div>
    );
  }

  const hasOffer = product.is_on_offer && product.offer_price && product.offer_price < product.price;
  const discount = hasOffer ? Math.round(((product.price - product.offer_price) / product.price) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Products
      </Link>

      <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted">
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">No Image</div>
          )}
          {hasOffer && (
            <Badge className="absolute top-4 left-4 bg-destructive text-destructive-foreground text-lg font-bold px-4 py-1.5">
              -{discount}% OFF
            </Badge>
          )}
        </div>

        <div className="flex flex-col justify-center">
          <div className="mb-2">
            {product.category && (
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                {product.category.replace(/_/g, " ")}
              </span>
            )}
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-4">
            {product.name}
          </h1>

          <div className="flex items-center gap-3 mb-4">
            {product.is_available ? (
              <Badge variant="secondary" className="bg-accent/10 text-accent gap-1 text-sm">
                <CheckCircle className="w-3.5 h-3.5" /> In Stock
              </Badge>
            ) : (
              <Badge variant="secondary" className="bg-destructive/10 text-destructive gap-1 text-sm">
                <XCircle className="w-3.5 h-3.5" /> Out of Stock
              </Badge>
            )}
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" /> {product.views || 0} views
            </span>
          </div>

          <div className="flex items-baseline gap-3 mb-6">
            {hasOffer ? (
              <>
                <span className="font-heading text-4xl font-bold text-primary">
                  ${product.offer_price.toFixed(2)}
                </span>
                <span className="text-xl text-muted-foreground line-through">
                  ${product.price.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="font-heading text-4xl font-bold text-foreground">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>

          {product.description && (
            <p className="text-muted-foreground leading-relaxed mb-8">{product.description}</p>
          )}

          <Button
            size="lg"
            className="rounded-full gap-2 w-full sm:w-auto px-10"
            onClick={() => addToCart(product)}
            disabled={!product.is_available}
          >
            <ShoppingCart className="w-5 h-5" />
            {product.is_available ? "Add to Cart" : "Out of Stock"}
          </Button>

          <div className="grid grid-cols-3 gap-4 mt-10 pt-8 border-t border-border">
            {[
              { icon: Truck, label: "Free Shipping", sub: "Orders over $50" },
              { icon: Shield, label: "2 Year Warranty", sub: "Full coverage" },
              { icon: RotateCcw, label: "Easy Returns", sub: "30-day policy" },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <item.icon className="w-5 h-5 text-primary mx-auto mb-2" />
                <p className="text-xs font-semibold text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}