"use client";

import { useEffect, useState } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

export function CategoriesField({ control, disabled }) {
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        const data = await response.json();
        setCategories(data || []);
      } catch (error) {
        console.error("Error:", error);
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  return (
    <FormField
      control={control}
      name="categories"
      render={({ field }) => {
        const value = field.value || [];

        return (
          <FormItem className="flex flex-col">
            <FormLabel>Categories</FormLabel>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "justify-between",
                      !value.length && "text-muted-foreground"
                    )}
                    disabled={disabled}
                  >
                    {value.length > 0
                      ? `${value.length} categories selected`
                      : "Select categories..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="p-0">
                <Command>
                  <CommandInput placeholder="Search categories..." />
                  <CommandList>
                    <CommandEmpty>No categories found.</CommandEmpty>
                    <CommandGroup heading="Categories">
                      {categories.map((category) => (
                        <CommandItem
                          key={category.id}
                          value={category.id}
                          onSelect={(currentValue) => {
                            const newValue = value.includes(currentValue)
                              ? value.filter((id) => id !== currentValue)
                              : [...value, currentValue];
                            field.onChange(newValue);
                          }}
                        >
                          {category.name}
                          <Check
                            className={cn(
                              "ml-auto",
                              value.includes(category.id)
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
