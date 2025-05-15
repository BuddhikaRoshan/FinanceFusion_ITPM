import { Income } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { motion } from "framer-motion";
import { Edit, Trash2, Loader2 } from "lucide-react";

interface IncomeCardProps {
  income: Income;
  onEdit: (income: Income) => void;
  onDelete: (id: string) => void;
}

export const IncomeCard = ({ income, onEdit, onDelete }: IncomeCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this income?"
    );
    if (!confirmDelete) return;

    try {
      setIsDeleting(true);
      await onDelete(income.id);
    } finally {
      setIsDeleting(false);
    }
  };

  const formattedAmount =
    typeof income.amount === "number"
      ? income.amount.toFixed(2)
      : income.amount;

  const formattedDate =
    income.date instanceof Date
      ? income.date.toLocaleDateString()
      : new Date(income.date).toLocaleDateString();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl backdrop-blur-sm bg-opacity-80 hover:shadow-2xl transition-all duration-300"
    >
      <div className="p-5 space-y-3">
        <div className="flex justify-between items-start">
          <p className="font-bold text-2xl bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text text-transparent">
            LKR {formattedAmount}
          </p>
          <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-gray-700 text-gray-300">
            {income.source}
          </span>
        </div>
        <p className="text-sm text-gray-400">{formattedDate}</p>

        <div className="flex gap-3 mt-4">
          <Button
            onClick={() => onEdit(income)}
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
