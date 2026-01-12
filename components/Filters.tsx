"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const STATUS_OPTIONS = ["pending", "processing", "completed", "cancelled"];

interface FiltersProps {
  globalFilter: string;
  setGlobalFilter: (val: string) => void;
  columnFilters: any[];
  setColumnFilters: (val: any[]) => void;
}

const Filters = ({
  globalFilter,
  setGlobalFilter,
  columnFilters,
  setColumnFilters,
}: FiltersProps) => {
  const statusFilter =
    columnFilters.find((f) => f.id === "status")?.value || "";

  const onStatusChange = (value: string) => {
    setColumnFilters((prev) => {
      const existing = prev.find((f) => f.id === "status");

      if (!existing) {
        return [...prev, { id: "status", value }];
      }

      return prev.map((f) =>
        f.id === "status"
          ? {
              ...f,
              value,
            }
          : f
      );
    });
  };

  return (
    <div className="flex space-x-2 mb-4">
      <Input
        placeholder="Search by order name or ID"
        value={globalFilter ?? ""}
        onChange={(e) => setGlobalFilter(e.target.value)}
        className="max-w-sm"
      />

      <Select
        value={statusFilter || null}
        onValueChange={(val) => onStatusChange(val)}
      >
        <SelectTrigger className="w-36">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          {STATUS_OPTIONS.map((status) => (
            <SelectItem key={status} value={status}>
              {status}
            </SelectItem>
          ))}
          <SelectItem key="none" value={null}>
            All
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default Filters;
