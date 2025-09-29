"use client";

import * as React from "react";
import { CalendarIcon, ClockIcon } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export default function DateTimePicker({
  value,
  onChange,
  placeholder = "Selecciona fecha y hora",
}: {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    value
  );
  const [selectedTime, setSelectedTime] = React.useState<string>("");

  // Inicializar la hora cuando se selecciona una fecha
  React.useEffect(() => {
    if (value) {
      setSelectedDate(value);
      setSelectedTime(
        `${value.getHours().toString().padStart(2, "0")}:${value
          .getMinutes()
          .toString()
          .padStart(2, "0")}`
      );
    }
  }, [value]);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      // Si no hay hora seleccionada, usar la hora actual
      if (!selectedTime) {
        const now = new Date();
        setSelectedTime(
          `${now.getHours().toString().padStart(2, "0")}:${now
            .getMinutes()
            .toString()
            .padStart(2, "0")}`
        );
      }
    }
  };

  const handleTimeChange = (time: string) => {
    setSelectedTime(time);
  };

  const handleApply = () => {
    if (selectedDate && selectedTime) {
      const [hours, minutes] = selectedTime.split(":").map(Number);
      const dateTime = new Date(selectedDate);
      dateTime.setHours(hours, minutes, 0, 0);
      onChange(dateTime);
      setOpen(false);
    }
  };

  const handleClear = () => {
    setSelectedDate(undefined);
    setSelectedTime("");
    onChange(undefined);
    setOpen(false);
  };

  return (
    <div className="flex flex-col gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !value && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? (
              format(value, "P HH:mm", { locale: es })
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0 max-w-sm"
          align="start"
          side="bottom"
          sideOffset={4}
        >
          <div className="p-3">
            <div className="space-y-3">
              {/* Selector de fecha */}
              <div>
                <Label className="text-sm font-medium">Fecha</Label>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                />
              </div>

              {/* Selector de hora */}
              {selectedDate && (
                <div className="space-y-2">
                  <Label htmlFor="time" className="text-sm font-medium">
                    Hora
                  </Label>
                  <div className="flex items-center space-x-2">
                    <ClockIcon className="h-4 w-4 text-muted-foreground" />
                    <Input
                      id="time"
                      type="time"
                      value={selectedTime}
                      onChange={(e) => handleTimeChange(e.target.value)}
                      className="w-32"
                    />
                  </div>
                </div>
              )}

              {/* Botones de acción */}
              {selectedDate && selectedTime && (
                <div className="flex justify-between space-x-2 pt-2 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClear}
                    className="flex-1"
                  >
                    Limpiar
                  </Button>
                  <Button size="sm" onClick={handleApply} className="flex-1">
                    Aplicar
                  </Button>
                </div>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
