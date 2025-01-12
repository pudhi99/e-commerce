// src/components/hero-banner/HeroBannerForm.js
"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { heroBannerSchema } from "@/lib/validations/hero-banner";
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
import { Switch } from "@/components/ui/switch";
import { ImageUpload } from "@/components/products/ImageUpload";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export function HeroBannerForm({ initialData }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(heroBannerSchema),
    defaultValues: {
      title: initialData?.title || "",
      subtitle: initialData?.subtitle || "",
      description: initialData?.description || "",
      primaryButtonText: initialData?.primaryButtonText || "",
      primaryButtonLink: initialData?.primaryButtonLink || "",
      secondaryButtonText: initialData?.secondaryButtonText || "",
      secondaryButtonLink: initialData?.secondaryButtonLink || "",
      images: initialData?.images || [],
      isActive: initialData?.isActive || true,
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
      toast({
        title: "Error",
        description: "Failed to upload images",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (values) => {
    try {
      setLoading(true);
      const url = initialData
        ? `/api/hero-banner/${initialData.id}`
        : "/api/hero-banner";
      const method = initialData ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error("Failed to save banner");

      toast({
        title: "Success",
        description: `Banner ${
          initialData ? "updated" : "created"
        } successfully`,
      });

      router.push("/dashboard/hero-banner");
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input {...field} disabled={loading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subtitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subtitle</FormLabel>
                <FormControl>
                  <Input {...field} disabled={loading} />
                </FormControl>
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
            name="primaryButtonText"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Primary Button Text</FormLabel>
                <FormControl>
                  <Input {...field} disabled={loading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="primaryButtonLink"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Primary Button Link</FormLabel>
                <FormControl>
                  <Input {...field} disabled={loading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="secondaryButtonText"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Secondary Button Text</FormLabel>
                <FormControl>
                  <Input {...field} disabled={loading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="secondaryButtonLink"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Secondary Button Link</FormLabel>
                <FormControl>
                  <Input {...field} disabled={loading} />
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
                  <FormLabel>Banner Images</FormLabel>
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

          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2">
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={loading}
                  />
                </FormControl>
                <FormLabel>Active</FormLabel>
              </FormItem>
            )}
          />
        </div>

        <div className="flex items-center gap-4">
          <Button type="submit" disabled={loading}>
            {loading
              ? "Saving..."
              : initialData
              ? "Update Banner"
              : "Create Banner"}
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={loading}
            onClick={() => router.push("/dashboard/hero-banner")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
