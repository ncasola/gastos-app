import Dexie, { type EntityTable } from "dexie";

interface GastosTable {
  id: number;
  nombre: string;
  descripcion: string;
  cantidad: number;
  fecha: string; // ISO string format for datetime
  categoriaId: number;
  metodoPagoId: number;
  estado: string;
}

interface CategoriasTable {
  id: number;
  nombre: string;
  descripcion: string;
  color: string;
  icono: string;
}

interface MetodosPagoTable {
  id: number;
  nombre: string;
  descripcion: string;
  icono: string;
}

const db = new Dexie("GastosApp") as Dexie & {
  gastos: EntityTable<GastosTable, "id">;
  categorias: EntityTable<CategoriasTable, "id">;
  metodosPago: EntityTable<MetodosPagoTable, "id">;
};

db.version(1).stores({
  gastos: "++id, nombre, descripcion, cantidad, fecha, estado",
  categorias: "++id, nombre, descripcion, color, icono",
  metodosPago: "++id, nombre, descripcion, icono",
});

export type { GastosTable, CategoriasTable, MetodosPagoTable };

export { db };
