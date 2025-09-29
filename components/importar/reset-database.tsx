"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";

const ResetDatabase = () => {
  const [showDialog, setShowDialog] = useState(false);
  const handleResetDatabase = () => {
    db.gastos.clear();
    db.categorias.clear();
    db.metodosPago.clear();
    toast.success("Database reset successfully");
  };
  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogTrigger asChild>
        <Button variant="destructive">
          <Trash2 className="w-4 h-4" />
          Resetear Base de Datos
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Resetear Base de Datos</DialogTitle>
          <DialogDescription>
            Estás seguro de querer resetear la base de datos?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={handleResetDatabase} variant="destructive">
            <Trash2 className="w-4 h-4" />
            Resetear Base de Datos
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ResetDatabase;
