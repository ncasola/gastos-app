"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { db, CategoriasTable } from "@/lib/db"
import { toast } from "react-toastify"

const CategoriasFormSchema = z.object({
  nombre: z.string()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres" })
    .max(50, { message: "El nombre no puede tener más de 50 caracteres" }),
  descripcion: z.string()
    .min(2, { message: "La descripción debe tener al menos 2 caracteres" })
    .max(100, { message: "La descripción no puede tener más de 100 caracteres" }),
  color: z.string()
    .min(1, { message: "Debes seleccionar un color" }),
  icono: z.string()
    .min(1, { message: "El icono es obligatorio" })
    .max(10, { message: "El icono no puede tener más de 10 caracteres" }),
});

const colors = [
  { value: "red", label: "Rojo", color: "bg-red-500" },
  { value: "blue", label: "Azul", color: "bg-blue-500" },
  { value: "green", label: "Verde", color: "bg-green-500" },
  { value: "yellow", label: "Amarillo", color: "bg-yellow-500" },
  { value: "purple", label: "Morado", color: "bg-purple-500" },
  { value: "pink", label: "Rosa", color: "bg-pink-500" },
  { value: "indigo", label: "Índigo", color: "bg-indigo-500" },
  { value: "gray", label: "Gris", color: "bg-gray-500" },
]

type CategoriasFormProps = {
  categoria?: CategoriasTable
}

export function CategoriasForm({ categoria }: CategoriasFormProps) {
  const isEditing = !!categoria
  
  const form = useForm<z.infer<typeof CategoriasFormSchema>>({
    resolver: zodResolver(CategoriasFormSchema),
    defaultValues: {
      nombre: categoria?.nombre || "",
      descripcion: categoria?.descripcion || "",
      color: categoria?.color || "",
      icono: categoria?.icono || "",
    },
  })

  async function onSubmit(values: z.infer<typeof CategoriasFormSchema>) {
    try {
      if (isEditing && categoria) {
        // Editar categoría existente
        await db.categorias.update(categoria.id!, values)
        toast.success("Categoría actualizada")
      } else {
        // Crear nueva categoría
        const result = await db.categorias.add(values)
        toast.success(`(#${result}) Categoría añadida`)
      }
      
      // Resetear formulario solo si no es edición
      if (!isEditing) {
        form.reset()
      }
    } catch (error) {
      toast.error("Error al guardar la categoría")
      console.error("Error:", error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Primera fila: Nombre e Icono */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="nombre" render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Alimentación" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="icono" render={({ field }) => (
                <FormItem>
                  <FormLabel>Icono</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: 🍔" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            {/* Segunda fila: Color */}
            <div className="grid grid-cols-1 gap-4">
              <FormField control={form.control} name="color" render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un color" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {colors.map((color) => (
                        <SelectItem key={color.value} value={color.value}>
                          <div className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded-full ${color.color}`} />
                            {color.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            {/* Tercera fila: Descripción */}
            <div className="grid grid-cols-1 gap-4">
              <FormField control={form.control} name="descripcion" render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Input placeholder="Descripción de la categoría" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            {/* Botón de envío */}
            <div className="flex justify-end pt-4">
              <Button type="submit" className="w-full md:w-auto" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? (
                  <>
                    <span className="mr-2">
                      <svg className="animate-spin h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                      </svg>
                    </span>
                    {isEditing ? "Actualizando..." : "Guardando..."}
                  </>
                ) : (
                  isEditing ? "Actualizar categoría" : "Guardar categoría"
                )}
              </Button>
            </div>
          </form>
        </Form>
  )
}
