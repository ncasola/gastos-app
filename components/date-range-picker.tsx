"use client";

import * as React from "react";
import { ChevronDownIcon, ClockIcon } from "lucide-react";
import { type DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function DateRangePicker({
  onSelect,
}: {
  onSelect: (range: DateRange) => void;
}) {
  const [range, setRange] = React.useState<DateRange | undefined>(undefined);
  const [fromTime, setFromTime] = React.useState<string>("00:00");
  const [toTime, setToTime] = React.useState<string>("23:59");

  // Función para combinar fecha y hora
  const combineDateTime = (date: Date, time: string): Date => {
    const [hours, minutes] = time.split(":").map(Number);
    const newDate = new Date(date);
    newDate.setHours(hours, minutes, 0, 0);
    return newDate;
  };

  // Función para aplicar las horas a las fechas seleccionadas
  const applyTimesToRange = (dateRange: DateRange | undefined) => {
    if (!dateRange?.from) return;

    const fromDateTime = combineDateTime(dateRange.from, fromTime);
    const toDateTime = dateRange.to
      ? combineDateTime(dateRange.to, toTime)
      : combineDateTime(dateRange.from, toTime);

    const newRange: DateRange = {
      from: fromDateTime,
      to: toDateTime,
    };

    onSelect(newRange);
  };

  return (
    <div className="flex flex-col gap-3 items-center justify-center">
      <Label htmlFor="dates" className="px-1">
        Selecciona el rango de fechas
      </Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="dates"
            className="w-fit justify-between font-normal"
          >
            {range?.from && range?.to
              ? `${range.from.toLocaleDateString()} ${fromTime} - ${range.to.toLocaleDateString()} ${toTime}`
              : "Selecciona el rango de fechas y horas"}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="overflow-hidden p-0 max-w-sm" align="start">
          <div className="p-3">
            <div className="space-y-4">
              {/* Selector de fecha */}
              <div>
                <Label className="text-sm font-medium">Rango de fechas</Label>
                <Calendar
                  mode="range"
                  selected={range}
                  captionLayout="dropdown"
                  onSelect={(range) => {
                    setRange(range);
                    if (range) {
                      applyTimesToRange(range);
                    }
                  }}
                />
              </div>

              {/* Selectores de hora */}
              {range?.from && (
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Horas</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {/* Hora de inicio */}
                    <div className="space-y-2">
                      <Label htmlFor="fromTime" className="text-xs font-medium">
                        Desde
                      </Label>
                      <div className="flex items-center space-x-2">
                        <ClockIcon className="h-4 w-4 text-muted-foreground" />
                        <Input
                          id="fromTime"
                          type="time"
                          value={fromTime}
                          onChange={(e) => {
                            setFromTime(e.target.value);
                            if (range) {
                              applyTimesToRange(range);
                            }
                          }}
                          className="w-full"
                        />
                      </div>
                    </div>

                    {/* Hora de fin */}
                    <div className="space-y-2">
                      <Label htmlFor="toTime" className="text-xs font-medium">
                        Hasta
                      </Label>
                      <div className="flex items-center space-x-2">
                        <ClockIcon className="h-4 w-4 text-muted-foreground" />
                        <Input
                          id="toTime"
                          type="time"
                          value={toTime}
                          onChange={(e) => {
                            setToTime(e.target.value);
                            if (range) {
                              applyTimesToRange(range);
                            }
                          }}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
