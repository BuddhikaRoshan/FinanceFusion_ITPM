"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { incomeSchema } from "@/schemas/income.schema";
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
import { DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";

type FormValues = z.infer<typeof incomeSchema>;

interface IncomeFormProps {
  onSubmit: (data: z.infer<typeof incomeSchema>) => void;
  defaultValues?: Partial<z.infer<typeof incomeSchema>>;
  userId: string;
}

export const IncomeForm = ({
  onSubmit,
  defaultValues,
  userId,
}: IncomeFormProps) => {
  const [error, setError] = useState<string | null>(null);

  const preparedDefaults: Partial<FormValues> = {
    ...defaultValues,
    date: defaultValues?.date ? new Date(defaultValues.date) : undefined,
    userId: defaultValues?.userId ?? userId,
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(incomeSchema),
    defaultValues: preparedDefaults,
  });

  const handleSubmit = async (data: FormValues) => {
    try {
      setError(null);
      await onSubmit({
        ...data,
        userId: userId,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    }
  };

  return (
    <Form {...form}>
      <DialogTitle className="mb-4 text-gray-100">
        {defaultValues ? "Edit Income" : "Add New Income"}
      </DialogTitle>

      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-300">Amount</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...field}
                  onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                  className="bg-gray-700 border-gray-600 text-gray-100"
                />
              </FormControl>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="source"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-300">Source</FormLabel>
              <FormControl>
                <Input 
                  placeholder="e.g., Salary, Freelance" 
                  {...field}
                  className="bg-gray-700 border-gray-600 text-gray-100"
                />
              </FormControl>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="text-gray-300">Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left bg-gray-700 border-gray-600 hover:bg-gray-600 text-gray-200"
                    >
                      {field.value ? format(field.value, "PPP") : "Pick a date"}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-70" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                    className="bg-gray-800 text-gray-100"
                  />
                </PopoverContent>
              </Popover>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />

        <input type="hidden" {...form.register("userId")} value={userId} />

        <DialogFooter>
          <Button 
            type="submit" 
            disabled={form.formState.isSubmitting}
            className="bg-green-600 hover:bg-green-700 text-gray-100"
          >
            {form.formState.isSubmitting ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};