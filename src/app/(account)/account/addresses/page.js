"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Plus, Edit2, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

export default function AddressesPage() {
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      name: "John Doe",
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zip: "10001",
      phone: "123-456-7890",
      isDefault: true,
    },
    // Add more addresses as needed
  ]);

  const [editingAddress, setEditingAddress] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const AddressForm = ({ address, onSubmit, onClose }) => {
    const [formData, setFormData] = useState(
      address || {
        name: "",
        street: "",
        city: "",
        state: "",
        zip: "",
        phone: "",
        isDefault: false,
      }
    );

    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit(formData);
      onClose();
      toast({
        title: address ? "Address updated" : "Address added",
        description: `Address has been ${
          address ? "updated" : "added"
        } successfully.`,
      });
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="street">Street Address</Label>
            <Input
              id="street"
              value={formData.street}
              onChange={(e) =>
                setFormData({ ...formData, street: e.target.value })
              }
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) =>
                  setFormData({ ...formData, state: e.target.value })
                }
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="zip">ZIP Code</Label>
              <Input
                id="zip"
                value={formData.zip}
                onChange={(e) =>
                  setFormData({ ...formData, zip: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                required
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Save Address</Button>
        </div>
      </form>
    );
  };

  const handleAddAddress = (newAddress) => {
    setAddresses((prev) => [...prev, { ...newAddress, id: Date.now() }]);
  };

  const handleEditAddress = (updatedAddress) => {
    setAddresses((prev) =>
      prev.map((addr) =>
        addr.id === updatedAddress.id ? updatedAddress : addr
      )
    );
  };

  const handleDeleteAddress = (addressId) => {
    setAddresses((prev) => prev.filter((addr) => addr.id !== addressId));
    toast({
      title: "Address deleted",
      description: "Address has been deleted successfully.",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <MapPin className="h-6 w-6" />
            My Addresses
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add New Address
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Address</DialogTitle>
              </DialogHeader>
              <AddressForm
                onSubmit={handleAddAddress}
                onClose={() => setIsDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent className="space-y-4">
          {addresses.map((address) => (
            <div
              key={address.id}
              className="p-4 border rounded-md flex justify-between items-center space-y-2"
            >
              <div>
                <h4 className="font-bold">{address.name}</h4>
                <p>{address.street}</p>
                <p>
                  {address.city}, {address.state} {address.zip}
                </p>
                <p>Phone: {address.phone}</p>
                {address.isDefault && (
                  <span className="text-sm text-green-500">
                    Default Address
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingAddress(address);
                    setIsDialogOpen(true);
                  }}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteAddress(address.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Dialog for editing an address */}
      {editingAddress && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Address</DialogTitle>
            </DialogHeader>
            <AddressForm
              address={editingAddress}
              onSubmit={handleEditAddress}
              onClose={() => {
                setEditingAddress(null);
                setIsDialogOpen(false);
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
