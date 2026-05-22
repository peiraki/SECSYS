import React from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  User, Package, LogOut, ShoppingBag, Calendar, Loader2
} from "lucide-react";
import { format } from "date-fns";

export default function Profile() {
  const { user } = useAuth();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["orders", user?.email],
    queryFn: () => base44.entities.Order.filter({ user_email: user?.email }, "-created_date"),
    enabled: !!user?.email,
  });

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="bg-card rounded-2xl border border-border/50 p-6 h-fit">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <User className="w-10 h-10 text-primary" />
            </div>
            <h2 className="font-heading text-xl font-bold">{user?.full_name || "User"}</h2>
            <p className="text-sm text-muted-foreground mt-1">{user?.email}</p>
            <Badge variant="secondary" className="mt-3 capitalize">{user?.role || "user"}</Badge>
          </div>
          <div className="mt-6 pt-6 border-t border-border">
            <Button
              variant="outline"
              className="w-full gap-2 text-destructive hover:text-destructive"
              onClick={() => base44.auth.logout("/")}
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </Button>
          </div>
        </div>

        <div className="lg:col-span-2">
          <h2 className="font-heading text-2xl font-bold mb-6 flex items-center gap-2">
            <Package className="w-6 h-6 text-primary" /> My Orders
          </h2>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-card rounded-2xl border border-border/50 p-12 text-center">
              <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-heading font-semibold text-lg">No orders yet</h3>
              <p className="text-muted-foreground text-sm mt-1">Your orders will appear here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-card rounded-2xl border border-border/50 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(order.created_date), "MMM d, yyyy")}
                      </span>
                      <Badge className={statusColors[order.status] || "bg-muted text-muted-foreground"}>
                        {order.status}
                      </Badge>
                    </div>
                    <span className="font-heading font-bold text-primary">${order.total?.toFixed(2)}</span>
                  </div>
                  <div className="space-y-1.5">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {item.product_name} × {item.quantity || 1}
                        </span>
                        <span>${(item.price * (item.quantity || 1)).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}