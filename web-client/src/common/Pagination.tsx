import Button from "./Button";

interface PaginationProps {
  page: number;
  totalPages: number;
  totalCount: number;
  itemLabel?: string;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  page,
  totalPages,
  totalCount,
  itemLabel = "items",
  onPageChange,
}: PaginationProps) {
  return (
    <div className="flex items-center justify-between text-sm text-gray-600">
      <span>
        Page {page} of {totalPages} · {totalCount} {itemLabel}
      </span>
      <div className="flex gap-2">
        <Button
          disabled={page <= 1}
          onClick={() => onPageChange(Math.max(1, page - 1))}
        >
          Prev
        </Button>
        <Button
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
