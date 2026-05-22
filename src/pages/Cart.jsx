import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";

export default function Cart() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [checkoutMode, setCheckoutMode] = useState(false);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  const { data: cartItems = [], isLoading } = useQuery({
    queryKey: ["cart", user?.email],
    queryFn: () => base44.entities.CartItem.filter({ user_email: user?.email }),
    enabled: !!user?.email,
  });

  const updateQty = useMutation({
    mutationFn: ({ id, quantity }) => base44.entities.CartItem.update(id, { quantity }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });

  const removeItem = useMutation({
    mutationFn: (id) => base44.entities.CartItem.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });

  const placeOrder = useMutation({
    mutationFn: async () => {
      const orderItems = cartItems.map((item) => ({
        product_id: item.product_id,
        product_name: item.product_name,
        price: item.price,
        quantity: item.quantity || 1,
      }));
      await base44.entities.Order.create({
        items: orderItems,
        total,
        shipping_address: address,
        phone,
        user_email: user.email,
        status: "pending",
      });
      for (const item of cartItems) {
        await base44.entities.CartItem.delete(item.id);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      setCheckoutMode(false);
      toast({ title: t("orderPlaced"), description: t("orderPlacedSuccess") });
    },
  });

  const total = cartItems.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="font-heading text-2xl font-bold mb-2">{t("signInToViewCart")}</h2>
        <Link to="/login"><Button className="mt-4">{t("signIn")}</Button></Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="font-heading text-2xl font-bold mb-2">{t("yourCartIsEmpty")}</h2>
        <p className="text-muted-foreground mb-6">{t("addSomeProducts")}</p>
        <Link to="/"><Button>{t("browseProducts")}</Button></Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> {t("continueShopping")}
      </Link>

      <h1 className="font-heading text-3xl font-bold mb-8">{t("shoppingCart")}</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="flex gap-4 bg-card rounded-xl border border-border/50 p-4">
              <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                {item.product_image && (
                  <img src={item.product_image} alt={item.product_name} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <Link to={`/product/${item.product_id}`}>
                  <h3 className="font-semibold text-foreground hover:text-primary transition-colors truncate">
                    {item.product_name}
                  </h3>
                </Link>
                <p className="text-primary font-bold mt-1">${item.price.toFixed(2)}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Button
                    variant="outline" size="icon" className="h-7 w-7"
                    onClick={() => updateQty.mutate({ id: item.id, quantity: Math.max(1, (item.quantity || 1) - 1) })}
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                  <span className="text-sm font-medium w-8 text-center">{item.quantity || 1}</span>
                  <Button
                    variant="outline" size="icon" className="h-7 w-7"
                    onClick={() => updateQty.mutate({ id: item.id, quantity: (item.quantity || 1) + 1 })}
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost" size="icon" className="h-7 w-7 ml-auto text-destructive"
                    onClick={() => removeItem.mutate(item.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-card rounded-xl border border-border/50 p-6 h-fit sticky top-24">
          <h3 className="font-heading font-bold text-lg mb-4">Order Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span className="text-accent font-medium">{total > 50 ? "Free" : "$5.99"}</span>
            </div>
            <div className="border-t border-border pt-2 mt-2">
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-primary">${(total > 50 ? total : total + 5.99).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {!checkoutMode ? (
            <Button className="w-full mt-6 rounded-full" size="lg" onClick={() => setCheckoutMode(true)}>
              Checkout
            </Button>
          ) : (
            <div className="mt-6 space-y-3">
              <Textarea
                placeholder="Shipping address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <Input
                placeholder="Phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <Button
                className="w-full rounded-full"
                size="lg"
                onClick={() => placeOrder.mutate()}
                disabled={!address || placeOrder.isPending}
              >
                {placeOrder.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                {t("orderPlaced").replace("!", "")}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}