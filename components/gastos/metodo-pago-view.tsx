import React from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/lib/db'
import { Badge } from '@/components/ui/badge'

type Props = {
    id: number
}

export const MetodoPagoView = ({ id }: Props) => {
  const metodoPago = useLiveQuery(() => db.metodosPago.get(id))
  return (
    <>
        {metodoPago && (
            <Badge variant="outline">
                {metodoPago.icono} {metodoPago.nombre}
            </Badge>
        )}
    </>
  )
}