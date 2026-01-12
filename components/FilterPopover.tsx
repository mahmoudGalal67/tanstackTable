"use client";

import { STATUSES } from "../data";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import FilterIcon from "./icons/FilterIcon";

interface StatusItemProps {
  status: { id: string; name: string };
  isActive: boolean;
  setColumnFilters: React.Dispatch<any>;
}

const StatusItem = ({
  status,
  isActive,
  setColumnFilters,
}: StatusItemProps) => {
  return (
    <div
      className={cn(
        "cursor-pointer rounded-md px-3 py-1 font-medium hover:bg-gray-100 dark:hover:bg-gray-800",
        isActive ? "bg-gray-200 dark:bg-gray-700" : "bg-transparent"
      )}
      onClick={() =>
        setColumnFilters((prev: any[]) => {
          const existing = prev.find((f) => f.id === "status")?.value || [];
          if (isActive) {
            return prev.map((f) =>
              f.id === "status"
                ? {
                    ...f,
                    value: existing.filter((s: string) => s !== status.id),
                  }
                : f
            );
          } else {
            if (!existing.length) {
              return [...prev, { id: "status", value: [status.id] }];
            } else {
              return prev.map((f) =>
                f.id === "status"
                  ? { ...f, value: [...existing, status.id] }
                  : f
              );
            }
          }
        })
      }
    >
      {status.name}
    </div>
  );
};

interface FilterPopoverProps {
  columnFilters: any[];
  setColumnFilters: React.Dispatch<any>;
}

const FilterPopover = ({
  columnFilters,
  setColumnFilters,
}: FilterPopoverProps) => {
  const filterStatuses =
    columnFilters.find((f) => f.id === "status")?.value || [];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={filterStatuses.length ? "default" : "outline"}
          size="sm"
          className="flex items-center gap-1"
        >
          <FilterIcon className="w-4 h-4" />
          Filter
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-4">
        {/* You can add a custom arrow with CSS if you like */}
        <div className="text-sm font-bold mb-2">Filter By:</div>
        <div className="text-xs font-semibold text-gray-500 mb-3">Status</div>
        <div className="flex flex-col gap-1">
          {STATUSES.map((status) => (
            <StatusItem
              key={status.id}
              status={status}
              isActive={filterStatuses.includes(status.id)}
              setColumnFilters={setColumnFilters}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default FilterPopover;
