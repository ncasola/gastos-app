"use client";

import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db, type CategoriasTable } from "@/lib/db";
import { DataTable } from "@/components/data-table";
import { createCategoriasColumns } from "./columns";
import { CategoriasForm } from "./add-form";
import { CategoriasFilters } from "./categorias-filters";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import DeleteConfirm from "@/components/delete-confirm";

export function CategoriasTable() {
  const [editingCategoria, setEditingCategoria] = useState<
    CategoriasTable | undefined
  >();
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const categorias = useLiveQuery(() =>
    db.categorias.orderBy("nombre").toArray()
  );

  const handleEdit = (categoria: CategoriasTable) => {
    setEditingCategoria(categoria);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    setDeleteId(id);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (deleteId) {
      try {
        await db.categorias.delete(deleteId);
        toast.success("Categoría eliminada correctamente");
      } catch (error) {
        toast.error("Error al eliminar la categoría");
        console.error("Error:", error);
      }
    }
    setShowDeleteDialog(false);
    setDeleteId(null);
  };

  const handleNewCategoria = () => {
    setEditingCategoria(undefined);
    setShowForm(true);
  };

  return (
    <div className="container mx-auto py-6 space-y-6 px-4 sm:px-2">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Categorías</h2>
          <p className="text-muted-foreground">
            Gestiona las categorías de gastos disponibles
          </p>
        </div>
        <Button onClick={handleNewCategoria} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Nueva Categoría
        </Button>
      </div>

      <DataTable
        columns={createCategoriasColumns({
          onEdit: handleEdit,
          onDelete: handleDelete,
        })}
        data={categorias || []}
      >
        {(table) => <CategoriasFilters table={table} />}
      </DataTable>

      {/* Dialog para formulario */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingCategoria ? "Editar Categoría" : "Nueva Categoría"}
            </DialogTitle>
            <DialogDescription>
              {editingCategoria
                ? "Modifica la información de la categoría"
                : "Completa la información de la categoría que deseas registrar"}
            </DialogDescription>
          </DialogHeader>
          <CategoriasForm categoria={editingCategoria} />
        </DialogContent>
      </Dialog>

      <DeleteConfirm
        showDeleteDialog={showDeleteDialog}
        setShowDeleteDialog={setShowDeleteDialog}
        confirmDelete={confirmDelete}
        title="¿Estás seguro?"
        description="Esta acción no se puede deshacer. Se eliminará permanentemente la categoría."
      />
    </div>
  );
}
