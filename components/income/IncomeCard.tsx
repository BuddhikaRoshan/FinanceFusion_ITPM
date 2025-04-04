import { Income } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface IncomeCardProps {
  income: Income;
  onEdit: (income: Income) => void;
  onDelete: (id: string) => void;
}

export const IncomeCard = ({ income, onEdit, onDelete }: IncomeCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      onDelete(income.id);
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
    <div className="border border-gray-700 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-gray-800 text-gray-100">
      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <p className="font-semibold text-lg text-green-400">${formattedAmount}</p>
          <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-gray-700 text-gray-300">
            {income.source}
          </span>
        </div>
        <p className="text-sm text-gray-400">{formattedDate}</p>
      </div>
      <div className="flex gap-2 mt-4">
        <Button
          variant="outline"
          onClick={() => onEdit(income)}
          className="flex-1 bg-gray-700 text-gray-200 hover:bg-gray-600"
        >
          Edit
        </Button>
        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={isDeleting}
          className="flex-1"
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </Button>
      </div>
    </div>
  );
};