"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, ChevronDown, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";

export default function OrdersPage() {
  const [orders] = useState([
    {
      id: "ORD001",
      date: "2024-01-02",
      total: 159.99,
      status: "delivered",
      items: [
        {
          id: 1,
          name: "Wireless Headphones",
          price: 99.99,
          quantity: 1,
          image: "/api/placeholder/100/100",
        },
        {
          id: 2,
          name: "Phone Case",
          price: 29.99,
          quantity: 2,
          image: "/api/placeholder/100/100",
        },
      ],
    },
    // Add more orders as needed
  ]);

  const OrderDetails = ({ order }) => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-muted-foreground">Order Date</p>
          <p className="font-medium">
            {new Date(order.date).toLocaleDateString()}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Total Amount</p>
          <p className="font-medium">${order.total.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Status</p>
          <Badge
            variant={order.status === "delivered" ? "success" : "secondary"}
          >
            {order.status}
          </Badge>
        </div>
      </div>
      <div className="divide-y">
        {order.items.map((item) => (
          <div key={item.id} className="py-4 flex items-center space-x-4">
            <Image
              src={item.image}
              alt={item.name}
              className="h-16 w-16 rounded-md object-cover"
            />
            <div className="flex-1">
              <h4 className="font-medium">{item.name}</h4>
              <p className="text-sm text-muted-foreground">
                Quantity: {item.quantity}
              </p>
              <p className="text-sm font-medium">${item.price.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Package className="h-6 w-6" />
            My Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList>
              <TabsTrigger value="all">All Orders</TabsTrigger>
              <TabsTrigger value="processing">Processing</TabsTrigger>
              <TabsTrigger value="delivered">Delivered</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="space-y-4">
              {orders.map((order) => (
                <Card key={order.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Order #{order.id}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant={
                            order.status === "delivered"
                              ? "success"
                              : "secondary"
                          }
                        >
                          {order.status}
                        </Badge>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Order #{order.id}</DialogTitle>
                            </DialogHeader>
                            <OrderDetails order={order} />
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
