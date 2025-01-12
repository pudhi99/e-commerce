// src/components/hero-banner/HeroBannerTable.js
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function HeroBannerTable({ banners, onUpdate }) {
  const { toast } = useToast();
  console.log(banners, "banners");

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this banner?")) return;

    try {
      await fetch(`/api/hero-banner/${id}`, {
        method: "DELETE",
      });
      toast({
        title: "Success",
        description: "Banner deleted successfully",
      });
      onUpdate();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete banner",
        variant: "destructive",
      });
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Subtitle</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {banners?.map((banner) => (
          <TableRow key={banner.id}>
            <TableCell>{banner.title}</TableCell>
            <TableCell>{banner.subtitle}</TableCell>
            <TableCell>{banner.isActive ? "Active" : "Inactive"}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" asChild>
                  <a href={`/dashboard/hero-banner/edit/${banner.id}`}>
                    <Pencil className="h-4 w-4" />
                  </a>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(banner.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
