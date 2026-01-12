import { memo, useCallback } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const STATUS_OPTIONS = ["pending", "processing", "completed", "cancelled"];

const StatusCell = memo(({ getValue, row, column, table }) => {
  const value = getValue();

  const onChange = useCallback(
    (val: string) => {
      table.options.meta?.updateData(row.index, column.id, val);
    },
    [row.index, column.id, table]
  );

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-36">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {STATUS_OPTIONS.map((status) => (
          <SelectItem key={status} value={status}>
            {status}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
});

export default StatusCell;
