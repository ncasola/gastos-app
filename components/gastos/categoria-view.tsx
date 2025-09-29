import React from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/lib/db'
import { Badge } from '@/components/ui/badge'

type Props = {
    id: number
}

export const CategoriaView = ({ id }: Props) => {
  const categoria = useLiveQuery(() => db.categorias.get(id))
  return (
    <>
        {categoria && (
            <>
                <span
                  style={{
                    display: "inline-block",
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    backgroundColor: categoria.color,
                    marginRight: "8px",
                    verticalAlign: "middle"
                  }}
                ></span>
                <Badge variant="outline">
                    {categoria.icono} {categoria.nombre}
                </Badge>
            </>
        )}
    </>
  )
}