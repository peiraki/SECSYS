import { base44 } from "@/api/base44Client";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/AuthContext";
import { useToast } from "@/components/ui/use-toast";

export function useCart() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const addToCart = async (product) => {
    if (!user?.email) {
      toast({ title: "Please sign in", description: "You need to be logged in to add items to cart.", variant: "destructive" });
      return;
    }

    const existing = await base44.entities.CartItem.filter({
      user_email: user.email,
      product_id: product.id,
    });

    if (existing.length > 0) {
      await base44.entities.CartItem.update(existing[0].id, {
        quantity: (existing[0].quantity || 1) + 1,
      });
    } else {
      await base44.entities.CartItem.create({
        product_id: product.id,
        product_name: product.name,
        product_image: product.image_url,
        price: product.is_on_offer && product.offer_price ? product.offer_price : product.price,
        quantity: 1,
        user_email: user.email,
      });
    }

    queryClient.invalidateQueries({ queryKey: ["cart"] });
    toast({ title: "Added to cart", description: `${product.name} added to your cart.` });
  };

  return { addToCart };
}