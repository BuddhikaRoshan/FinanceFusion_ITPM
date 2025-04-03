"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { motion } from "framer-motion";
import { expenseSchema } from "@/schemas/expense.schema";
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
import { DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Loader2, Mic } from "lucide-react";
import { useState } from "react";
import { VoiceInputModal } from "./VoiceInputModal";

// Create a form-specific schema that properly handles the form values
const formSchema = z.object({
  amount: z.coerce.number().positive("Amount must be positive"),
  category: z.string().min(1, "Category is required"),
  date: z.date({
    required_error: "Please select a date",
    invalid_type_error: "That's not a valid date",
  }),
  reason: z.string().optional(),
  userId: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

interface ExpenseFormProps {
  onSubmit: (data: z.infer<typeof expenseSchema>) => void;
  defaultValues?: Partial<z.infer<typeof expenseSchema>>;
  userId: string;
}

export const ExpenseForm = ({
  onSubmit,
  defaultValues,
  userId,
}: ExpenseFormProps) => {
  const [error, setError] = useState<string | null>(null);
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);
  // Prepare default values, ensuring date is a Date object
  const preparedDefaults: Partial<FormValues> = {
    ...defaultValues,
    date: defaultValues?.date ? new Date(defaultValues.date) : undefined,
    reason: defaultValues?.reason ?? undefined, // Convert null to undefined
    userId: defaultValues?.userId ?? userId, // Ensure userId is set
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: preparedDefaults,
  });

  const handleSubmit = async (data: FormValues) => {
    try {
      setError(null);
      await onSubmit({
        ...data,
        userId: userId, // Always use the provided userId
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-800 rounded-xl p-6 shadow-xl backdrop-blur-sm bg-opacity-80"
    >
      <Form {...form}>
        <DialogTitle className="mb-4 text-2xl font-bold text-white">
          <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            {defaultValues ? "Edit Expense" : "Add New Expense"}
          </span>
        </DialogTitle>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-600 bg-opacity-20 border border-red-500 text-red-300 px-4 py-3 rounded mb-4"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
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
                      onChange={(e) =>
                        field.onChange(e.target.valueAsNumber || 0)
                      }
                      className="bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-blue-500"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Category</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Food, Transportation"
                      {...field}
                      className="bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-blue-500"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
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
                          className="w-full justify-start text-left bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                        >
                          {field.value
                            ? format(field.value, "PPP")
                            : "Pick a date"}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        className="bg-gray-800 text-white"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">
                    Reason (Optional)
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Why did you make this expense?"
                      {...field}
                      value={field.value || ""}
                      className="bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-blue-500"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
          </motion.div>

          {/* Hidden field for userId */}
          <input type="hidden" {...form.register("userId")} value={userId} />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <DialogFooter>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium shadow-md transition-all"
              >
                {form.formState.isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    Saving...
                  </div>
                ) : (
                  "Save"
                )}
              </Button>
            </DialogFooter>
          </motion.div>
        </form>
      </Form>
      <Button
        type="button"
        onClick={() => setVoiceModalOpen(true)}
        variant="outline"
        className="mb-4 gap-2 bg-gray-700 text-white hover:bg-gray-600"
      >
        <Mic className="h-4 w-4" />
        Voice Input
      </Button>
      <VoiceInputModal
        open={voiceModalOpen}
        onOpenChange={setVoiceModalOpen}
        onDataReceived={(data) => {
          form.setValue("amount", data.amount);
          form.setValue("category", data.category);
          form.setValue("date", data.date);
          if (data.reason) {
            form.setValue("reason", data.reason);
          }
        }}
      />
    </motion.div>
  );
};
