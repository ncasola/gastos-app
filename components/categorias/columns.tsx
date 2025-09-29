"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CategoriasTable } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const colorMap: Record<string, string> = {
  red: "bg-red-500",
  blue: "bg-blue-500",
  green: "bg-green-500",
  yellow: "bg-yellow-500",
  purple: "bg-purple-500",
  pink: "bg-pink-500",
  indigo: "bg-indigo-500",
  gray: "bg-gray-500",
};

type CategoriasColumnsProps = {
  onEdit: (categoria: CategoriasTable) => void;
  onDelete: (id: number) => void;
};

export const createCategoriasColumns = ({
  onEdit,
  onDelete,
}: CategoriasColumnsProps): ColumnDef<CategoriasTable>[] => [
  {
    accessorKey: "icono",
    header: "Icono",
    cell: ({ row }) => <div className="text-2xl">{row.getValue("icono")}</div>,
  },
  {
    accessorKey: "nombre",
    header: "Nombre",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("nombre")}</div>
    ),
  },
  {
    accessorKey: "descripcion",
    header: "Descripción",
    cell: ({ row }) => (
      <div className="text-muted-foreground">{row.getValue("descripcion")}</div>
    ),
  },
  {
    accessorKey: "color",
    header: "Color",
    cell: ({ row }) => {
      const color = row.getValue("color") as string;
      return (
        <div className="flex items-center gap-2">
          <div
            className={`w-4 h-4 rounded-full ${
              colorMap[color] || "bg-gray-500"
            }`}
          />
          <span className="capitalize">{color}</span>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Acciones",
    enableSorting: false,
    cell: ({ row }) => {
      const categoria = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menú</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(categoria)}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(categoria.id)}
              className="text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
