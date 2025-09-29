"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { DualRangeSlider } from "@/components/ui/dual-range-slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Table } from "@tanstack/react-table";
import type { GastosTable } from "@/lib/db";
import CurrencyView from "@/components/currency-view";
import { useEffect } from "react";
import MultipleSelector from "@/components/ui/multiple-selector";
import { Card, CardContent } from "@/components/ui/card";
import DateRangePicker from "@/components/date-range-picker";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";

interface GastosFiltersProps {
  table: Table<GastosTable>;
}

const GastosFiltersSchema = z.object({
  categorias: z
    .array(
      z.object({
        value: z.string(),
        label: z.string(),
      })
    )
    .optional(),
  metodos: z
    .array(
      z.object({
        value: z.string(),
        label: z.string(),
      })
    )
    .optional(),
  estado: z
    .array(
      z.object({
        value: z.string(),
        label: z.string(),
      })
    )
    .optional(),
  nombre: z.string().optional(),
  cantidad: z.array(z.number()).optional(),
  fecha: z
    .object({
      from: z.date(),
      to: z.date(),
    })
    .optional(),
});

export function GastosFilters({ table }: GastosFiltersProps) {
  const filtrosData = useLiveQuery(async () => {
    const [cantidadRange, categorias, metodosPago] = await Promise.all([
      (async () => {
        const [minGasto, maxGasto] = await Promise.all([
          db.gastos.orderBy("cantidad").limit(1).first(),
          db.gastos.orderBy("cantidad").reverse().limit(1).first(),
        ]);
        return {
          min: minGasto?.cantidad || 0,
          max: maxGasto?.cantidad || 1000,
        };
      })(),
      db.categorias.toArray(),
      db.metodosPago.toArray(),
    ]);

    return {
      cantidadRange,
      categorias,
      metodosPago,
    };
  });

  const categorias = filtrosData?.categorias;
  const metodosPago = filtrosData?.metodosPago;
  const cantidadRange = filtrosData?.cantidadRange;
  const estados = [
    {
      value: "pendiente",
      label: "Pendiente",
    },
    {
      value: "pagado",
      label: "Pagado",
    },
  ];

  const form = useForm<z.infer<typeof GastosFiltersSchema>>({
    resolver: zodResolver(GastosFiltersSchema),
    defaultValues: {
      categorias: undefined,
      metodos: undefined,
      estado: undefined,
      nombre: undefined,
      cantidad: [0, 1000], // Valores temporales hasta que se carguen los datos
      fecha: undefined,
    },
  });

  // Actualizar los valores del formulario cuando se carguen los datos reales
  useEffect(() => {
    if (cantidadRange) {
      form.setValue("cantidad", [cantidadRange.min, cantidadRange.max]);
    }
  }, [cantidadRange, form]);

  const handleReset = () => {
    form.reset();
    table.resetColumnFilters();
  };

  async function onSubmit(values: z.infer<typeof GastosFiltersSchema>) {
    console.log(values.fecha);
    table.setColumnFilters([
      {
        id: "categoriaId",
        value: values.categorias,
      },
      {
        id: "metodoPagoId",
        value: values.metodos,
      },
      {
        id: "estado",
        value: values.estado,
      },
      {
        id: "nombre",
        value: values.nombre,
      },
      {
        id: "cantidad",
        value: values.cantidad,
      },
      {
        id: "fecha",
        value: values.fecha,
      },
    ]);
  }

  return (
    <Card className="w-full">
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6 px-4">
              {/* Fila 1: Inputs y selects */}
              <div className="flex flex-col sm:flex-row gap-4 w-full">
                <FormField
                  control={form.control}
                  name="nombre"
                  render={({ field }) => (
                    <FormItem className="lg:w-1/3 sm:w-full">
                      <Input
                        placeholder="Buscar por nombre"
                        {...field}
                        className="w-full"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="categorias"
                  render={({ field }) => (
                    <FormItem className="lg:w-1/3 sm:w-full">
                      {categorias ? (
                        <MultipleSelector
                          defaultOptions={categorias.map((categoria) => ({
                            value: categoria.id.toString(),
                            label: categoria.nombre,
                          }))}
                          value={field.value}
                          placeholder="Selecciona una categoría"
                          emptyIndicator={
                            <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                              Sin resultados
                            </p>
                          }
                          onChange={(value) => field.onChange(value)}
                        />
                      ) : (
                        <div className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground">
                          Cargando categorías...
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="metodos"
                  render={({ field }) => (
                    <FormItem className="lg:w-1/3 sm:w-full">
                      {metodosPago ? (
                        <MultipleSelector
                          defaultOptions={metodosPago.map((metodoPago) => ({
                            value: metodoPago.id.toString(),
                            label: metodoPago.nombre,
                          }))}
                          value={field.value}
                          placeholder="Selecciona un método de pago"
                          onChange={(value) => field.onChange(value)}
                          emptyIndicator={
                            <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                              Sin resultados
                            </p>
                          }
                        />
                      ) : (
                        <div className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground">
                          Cargando métodos de pago...
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="estado"
                  render={({ field }) => (
                    <FormItem className="lg:w-1/3 sm:w-full">
                      {estados ? (
                        <MultipleSelector
                          defaultOptions={estados.map((estado) => ({
                            value: estado.value,
                            label: estado.label,
                          }))}
                          value={field.value}
                          placeholder="Selecciona un estado"
                          onChange={(value) => field.onChange(value)}
                          emptyIndicator={
                            <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                              Sin resultados
                            </p>
                          }
                        />
                      ) : (
                        <div className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground">
                          Cargando estados...
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Fila 2: Filtros de cantidad y fechas */}
              <div className="flex flex-col sm:flex-row gap-4 w-full">
                <div className="flex flex-col sm:flex-row gap-4 w-full">
                  <FormField
                    control={form.control}
                    name="cantidad"
                    render={({ field }) => (
                      <FormItem className="lg:w-1/3 sm:w-full m-6">
                        <DualRangeSlider
                          label={(value) => (
                            <CurrencyView amount={value || 0} />
                          )}
                          value={
                            field.value || [
                              cantidadRange?.min || 0,
                              cantidadRange?.max || 1000,
                            ]
                          }
                          className="w-full"
                          onValueChange={(value) => field.onChange(value)}
                          min={cantidadRange?.min || 0}
                          max={cantidadRange?.max || 1000}
                          step={1}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="fecha"
                    render={({ field }) => (
                      <FormItem className="lg:w-1/3 sm:w-full">
                        <DateRangePicker
                          onSelect={(range) => field.onChange(range)}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              {/* Fila 3: Botones */}
              <div className="flex flex-col sm:flex-row gap-4 w-full justify-end">
                <Button type="submit" className="w-full sm:w-auto">
                  Filtrar
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  className="w-full sm:w-auto"
                >
                  Limpiar filtros
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
