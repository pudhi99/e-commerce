import { useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Trash2, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function VariantsField({ control, disabled }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <FormLabel>Product Variants</FormLabel>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            append({
              name: "",
              value: "",
              sku: "",
              price: "", // Changed to empty string
              inventory: "0", // Changed to string "0"
            })
          }
          disabled={disabled}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Variant
        </Button>
      </div>

      {fields.map((field, index) => (
        <Card key={field.id}>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={control}
                name={`variants.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Variant Name (e.g., Size, Color)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter variant name"
                        {...field}
                        disabled={disabled}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`variants.${index}.value`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Value (e.g., XL, #FF0000)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter variant value"
                        {...field}
                        disabled={disabled}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`variants.${index}.sku`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKU (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter SKU"
                        {...field}
                        disabled={disabled}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`variants.${index}.price`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price Override (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter price"
                        {...field}
                        // Remove parseFloat - let the schema handle the transformation
                        onChange={(e) => field.onChange(e.target.value)}
                        disabled={disabled}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`variants.${index}.inventory`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Inventory</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter inventory"
                        {...field}
                        // Remove parseInt - let the schema handle the transformation
                        onChange={(e) => field.onChange(e.target.value)}
                        disabled={disabled}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-end md:col-span-2">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => remove(index)}
                  disabled={disabled}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove Variant
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
