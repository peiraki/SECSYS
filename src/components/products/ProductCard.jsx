import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Eye, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

/**
 * @typedef {any} ProductCardProduct
 */

/**
 * @typedef {(product: ProductCardProduct) => void} OnAddToCartFn
 */

/**
 * @param {{ product: ProductCardProduct; onAddToCart?: OnAddToCartFn }} props
 */
export default function ProductCard({ product, onAddToCart }) {
  const hasOffer = product.is_on_offer && product.offer_price != null && product.offer_price < product.price;
  const offerPrice = hasOffer ? product.offer_price : product.price;
  const discount = hasOffer ? Math.round(((product.price - offerPrice) / product.price) * 100) : 0;

  return (
    <div className="group bg-card rounded-2xl border border-border/50 overflow-hidden hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 hover:-translate-y-1">
      <div className="relative aspect-square overflow-hidden bg-muted">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            No Image
          </div>
        )}

        {hasOffer && (
          <Badge variant="destructive" className="absolute top-3 left-3 font-semibold">
            -{discount}%
          </Badge>
        )}

        <div className="absolute top-3 right-3">
          {product.is_available ? (
            <Badge variant="secondary" className="bg-accent/90 text-accent-foreground gap-1">
              <CheckCircle className="w-3 h-3" /> In Stock
            </Badge>
          ) : (
            <Badge variant="secondary" className="bg-destructive/90 text-destructive-foreground gap-1">
              <XCircle className="w-3 h-3" /> Out of Stock
            </Badge>
          )}
        </div>

        <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors duration-300 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
          <Link to={`/product/${product.id}`}>
            <Button size="sm" variant="secondary" className="rounded-full shadow-lg">
              <Eye className="w-4 h-4 mr-1" /> View
            </Button>
          </Link>
        </div>
      </div>

      <div className="p-4">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-heading font-semibold text-sm text-foreground line-clamp-1 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        {product.category && (
          <p className="text-xs text-muted-foreground mt-1 capitalize">
            {product.category.replace(/_/g, " ")}
          </p>
        )}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            {hasOffer ? (
              <>
                <span className="font-heading font-bold text-lg text-primary">
                  ${offerPrice.toFixed(2)}
                </span>
                <span className="text-sm text-muted-foreground line-through">
                  ${product.price.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="font-heading font-bold text-lg text-foreground">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>
          <Button
            size="icon"
            variant="outline"
            className="h-8 w-8 rounded-full"
            onClick={(e) => {
              e.preventDefault();
              onAddToCart?.(product);
            }}
            disabled={!product.is_available}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}