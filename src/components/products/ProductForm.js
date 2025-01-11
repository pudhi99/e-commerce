// src\components\products\ProductForm.js
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema } from "@/lib/validations/product";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ImageUpload } from "./ImageUpload";
import { VariantsField } from "./VariantsField";
import { CategoriesField } from "./CategoriesField";

export function ProductForm({ initialData, onSubmit }) {
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      price: initialData?.price?.toString() || "0",
      oldPrice: initialData?.oldPrice || "",
      type: initialData?.type || "OTHER",
      inventory: initialData?.inventory?.toString() || "0",
      published: initialData?.published || false,
      featured: initialData?.featured || false,
      images: initialData?.images || [],
      details: initialData?.details || {},
      categories:
        initialData?.categories.map((category) => String(category.id)) || [],
      variants: initialData?.variants || [],
    },
  });

  const handleImageUpload = async (files) => {
    try {
      const uploadedUrls = await Promise.all(
        files.map(async (file) => {
          const formData = new FormData();
          formData.append("file", file);

          const response = await fetch("/api/upload", {
            method: "POST",
            body: file,
            headers: {
              "content-type": file.type,
            },
          });

          if (!response.ok)
            throw new Error(`Upload failed: ${response.statusText}`);

          const data = await response.json();
          return data.url;
        })
      );

      const currentImages = form.watch("images") || [];
      form.setValue("images", [...currentImages, ...uploadedUrls]);
    } catch (error) {
      console.error("Error uploading images:", error);
    }
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);

      const formData = {
        ...values,
        variants:
          values.variants?.map((variant) => ({
            ...variant,
            price: parseFloat(variant.price),
            inventory: parseInt(variant.inventory),
          })) || [],
      };

      console.log(formData, "formData");

      await onSubmit(formData);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Input {...field} disabled={loading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={loading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="CLOTHING">Clothing</SelectItem>
                    <SelectItem value="FOOD">Food</SelectItem>
                    <SelectItem value="GROCERY">Grocery</SelectItem>
                    <SelectItem value="CUSTOMIZED">Customized</SelectItem>
                    <SelectItem value="ELECTRONICS">Electronics</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea {...field} disabled={loading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input type="text" {...field} disabled={loading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="inventory"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Inventory</FormLabel>
                <FormControl>
                  <Input type="text" {...field} disabled={loading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="col-span-2">
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Images</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value || []}
                      disabled={loading}
                      onChange={handleImageUpload}
                      onRemove={(url) => {
                        form.setValue(
                          "images",
                          field.value.filter((image) => image !== url)
                        );
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <VariantsField control={form.control} disabled={loading} />
          <CategoriesField control={form.control} disabled={loading} />

          <div className="flex items-center gap-4">
            <FormField
              control={form.control}
              name="published"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormLabel>Published</FormLabel>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="featured"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormLabel>Featured</FormLabel>
                </FormItem>
              )}
            />
          </div>
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Product"}
        </Button>
      </form>
    </Form>
  );
}
