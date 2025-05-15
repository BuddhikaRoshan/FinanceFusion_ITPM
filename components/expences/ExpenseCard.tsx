import { Expense } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Loader2, Edit, Trash2 } from "lucide-react";
import { useState } from "react";

interface ExpenseCardProps {
  expense: Expense;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

export const ExpenseCard = ({
  expense,
  onEdit,
  onDelete,
}: ExpenseCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this expense?"
    );
    if (!confirmDelete) return;

    try {
      setIsDeleting(true);
      await onDelete(expense.id);
    } finally {
      setIsDeleting(false);
    }
  };

  // Format amount to 2 decimal places
  const formattedAmount =
    typeof expense.amount === "number"
      ? expense.amount.toFixed(2)
      : expense.amount;

  // Make sure date is properly formatted
  const formattedDate =
    expense.date instanceof Date
      ? expense.date.toLocaleDateString()
      : new Date(expense.date).toLocaleDateString();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-800 h-[190px] border-gray-700 border rounded-lg shadow-xl backdrop-blur-sm bg-opacity-80 hover:shadow-2xl transition-all duration-300"
    >
      <div className="p-5 space-y-3">
        <div className="flex justify-between items-start">
          <p className="font-bold text-2xl bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
            LKR {formattedAmount}
          </p>
          <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-gray-700 text-gray-300">
            {expense.category}
          </span>
        </div>
        <p className="text-sm text-gray-400">{formattedDate}</p>
        {expense.reason && (
          <p className="text-sm text-gray-300 italic">{expense.reason}</p>
        )}

        <div className="flex gap-3 mt-4">
          <Button
            onClick={() => onEdit(expense)}
            className="flex-1 bg-gray-700 text-white hover:bg-gray-600 flex items-center justify-center"
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button
            onClick={handleDelete}
            disabled={isDeleting}
            variant="destructive"
            className="flex-1 bg-red-600 hover:bg-red-700 flex items-center justify-center"
          >
            {isDeleting ? (
              <div className="flex items-center">
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                Deleting...
              </div>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
