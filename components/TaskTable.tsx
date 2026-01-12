"use client";

import { useState, useMemo } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  flexRender,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";

import { DATA } from "../data";
import SortIcon from "./icons/SortIcon";
import Filters from "./Filters";

import StatusCell from "@/components/StatusCell";

const TaskTable = () => {
  const [data, setData] = useState(DATA.data);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState([]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "order_id",
        header: "# Order ID",
        cell: (info: any) => info.getValue(),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: StatusCell,
        enableSorting: false,
        filterFn: (row, columnId, filterValue) => {
          if (!filterValue) return true;
          return row.getValue(columnId) === filterValue;
        },
      },
      {
        id: "order_name",
        header: "Name",
        accessorFn: (row: any) => row.order?.name ?? "",
        cell: (info: any) => info.getValue(),
      },
      {
        accessorKey: "subtotal",
        header: "Subtotal",
        cell: (info: any) => `$${info.getValue()}`,
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter, columnFilters },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row: any, _columnId: any, value: string) => {
      const search = value.toLowerCase();
      return (
        String(row.original.order_id).includes(search) ||
        row.original.order?.name?.toLowerCase().includes(search)
      );
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    meta: {
      updateData: (rowIndex, columnId, value) =>
        setData((prev) =>
          prev.map((row, index) =>
            index === rowIndex
              ? {
                  ...prev[rowIndex],
                  [columnId]: value,
                }
              : row
          )
        ),
    },
  });

  return (
    <div className="space-y-4">
      <Filters
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        setColumnFilters={setColumnFilters}
        columnFilters={columnFilters}
      />

      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                  {header.column.getCanSort() && (
                    <SortIcon
                      className="inline ml-1 w-3 h-3 cursor-pointer"
                      onClick={header.column.getToggleSortingHandler()}
                    />
                  )}
                  {
                    {
                      asc: " 🔼",
                      desc: " 🔽",
                    }[header.column.getIsSorted()]
                  }
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-gray-500 py-4">
                No results found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </span>

        <div className="space-x-2">
          <Button
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {"<"}
          </Button>
          <Button
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {">"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskTable;
