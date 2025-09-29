import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
// Hook para obtener datos de gastos por período personalizado
export function useGastosPorPeriodo(dias: number) {
  return useLiveQuery(
    async () => {
      // Calcular fecha de inicio (hace X días)
      const hoy = new Date();
      const fechaInicio = new Date(hoy);
      fechaInicio.setDate(hoy.getDate() - dias + 1); // +1 para incluir el día actual

      // Obtener gastos del período
      const gastos = await db.gastos
        .where("fecha")
        .aboveOrEqual(fechaInicio.toISOString().split("T")[0])
        .and((gasto) => gasto.fecha <= hoy.toISOString().split("T")[0])
        .toArray();

      // Obtener categorías
      const categorias = await db.categorias.toArray();

      // Crear array de días del período (todos los días, incluso sin gastos)
      const diasArray = [];
      const fechaActual = new Date(fechaInicio);

      // Iterar por todos los días del período
      for (let i = 0; i < dias; i++) {
        const fechaStr = fechaActual.toISOString().split("T")[0];

        // Crear objeto base con la fecha
        const diaData: { [key: string]: string | number } = {
          date: fechaStr,
        };

        // Agregar totales por categoría (incluso si es 0)
        categorias.forEach((categoria) => {
          const total = gastos
            .filter(
              (gasto) =>
                gasto.fecha === fechaStr && gasto.categoriaId === categoria.id
            )
            .reduce((sum, gasto) => sum + gasto.cantidad, 0);

          diaData[categoria.nombre.toLowerCase()] = total;
        });

        diasArray.push(diaData);
        fechaActual.setDate(fechaActual.getDate() + 1);
      }

      return { diasArray, categorias };
    },
    [dias] // Dependencia explícita para que useLiveQuery detecte cambios
  );
}
