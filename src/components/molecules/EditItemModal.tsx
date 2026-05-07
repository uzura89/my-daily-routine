"use client";

import { FC, useEffect, useMemo, useState } from "react";
import { TimetableItemType } from "@/types/ConfigTypes";
import * as color from "@/constants/itemcolor.cons";
import { durationMinutes, minutesToTime } from "@/hooks/useBoards";

const COLOR_SWATCHES = [
  color.ITEM_COLOR_PURPLE,
  color.ITEM_COLOR_GRAY,
  color.ITEM_COLOR_CYAN,
  color.ITEM_COLOR_GREEN,
  color.ITEM_COLOR_ORANGE,
  color.ITEM_COLOR_PINK,
  color.ITEM_COLOR_YELLOW,
  color.ITEM_COLOR_BLUE,
];

const DURATION_MINUTE_STEP = 5;
const DAY_MIN = 24 * 60;

export type EditItemModalProps = {
  isNew: boolean;
  initial: Omit<TimetableItemType, "id">;
  itemId?: string;
  onSave: (item: Omit<TimetableItemType, "id">) => void;
  onDelete?: () => void;
  onClose: () => void;
};

export const EditItemModal: FC<EditItemModalProps> = (props) => {
  const initialDuration = useMemo(
    () => durationMinutes(props.initial.start, props.initial.end),
    [props.initial.start, props.initial.end]
  );

  const [name, setName] = useState(props.initial.name);
  const [memo, setMemo] = useState(props.initial.memo);
  const [start, setStart] = useState(toInputTime(props.initial.start));
  const [hours, setHours] = useState(Math.floor(initialDuration / 60));
  const [minutes, setMinutes] = useState(initialDuration % 60);
  const [selectedColor, setSelectedColor] = useState(props.initial.color);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") props.onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [props]);

  const totalMinutes = hours * 60 + minutes;

  const previewEndLabel = useMemo(() => {
    if (!isValidTime(start) || totalMinutes <= 0) return null;
    const startMin = toMin(start);
    const endRaw = startMin + totalMinutes;
    const endMin = endRaw <= DAY_MIN ? endRaw : endRaw - DAY_MIN;
    const wraps = endRaw > DAY_MIN;
    return { label: minutesToTime(endMin), wraps };
  }, [start, totalMinutes]);

  function handleSave() {
    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    if (!isValidTime(start)) {
      setError("Start must be HH:MM");
      return;
    }
    if (totalMinutes <= 0) {
      setError("Duration must be greater than 0");
      return;
    }
    if (totalMinutes > DAY_MIN) {
      setError("Duration can't exceed 24 hours");
      return;
    }

    const startMin = toMin(start);
    const endRaw = startMin + totalMinutes;
    const endMin = endRaw <= DAY_MIN ? endRaw : endRaw - DAY_MIN;

    props.onSave({
      name: name.trim(),
      memo: memo.trim(),
      start,
      end: minutesToTime(endMin),
      color: selectedColor,
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/30 backdrop-blur-[1px]"
      onClick={props.onClose}
    >
      <div
        className="w-full max-w-md bg-bgLight rounded-t-lg sm:rounded-lg shadow-lg p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-md font-semibold text-fore">
            {props.isNew ? "New item" : "Edit item"}
          </h2>
          <button
            type="button"
            onClick={props.onClose}
            className="text-foreLight text-sm px-2 py-1"
            aria-label="Close"
          >
            Close
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <Field label="Name">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white border border-border rounded px-2 py-1.5 text-sm text-fore outline-none focus:border-foreLight"
              autoFocus
            />
          </Field>

          <Field label="Memo">
            <input
              type="text"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              className="w-full bg-white border border-border rounded px-2 py-1.5 text-sm text-fore outline-none focus:border-foreLight"
            />
          </Field>

          <div className="flex gap-3">
            <Field label="Start" className="flex-1">
              <input
                type="time"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                className="w-full bg-white border border-border rounded px-2 py-1.5 text-sm text-fore outline-none focus:border-foreLight"
              />
            </Field>
            <Field label="Duration" className="flex-1">
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min={0}
                  max={24}
                  step={1}
                  value={hours}
                  onChange={(e) =>
                    setHours(clamp(parseInt(e.target.value || "0", 10), 0, 24))
                  }
                  className="w-14 bg-white border border-border rounded px-2 py-1.5 text-sm text-fore outline-none focus:border-foreLight"
                />
                <span className="text-xs text-foreLight">h</span>
                <input
                  type="number"
                  min={0}
                  max={59}
                  step={DURATION_MINUTE_STEP}
                  value={minutes}
                  onChange={(e) =>
                    setMinutes(
                      clamp(parseInt(e.target.value || "0", 10), 0, 59)
                    )
                  }
                  className="w-14 bg-white border border-border rounded px-2 py-1.5 text-sm text-fore outline-none focus:border-foreLight"
                />
                <span className="text-xs text-foreLight">m</span>
              </div>
            </Field>
          </div>

          {previewEndLabel && (
            <div className="text-xs text-foreLight">
              Ends at {previewEndLabel.label}
              {previewEndLabel.wraps ? " (next day)" : ""}
            </div>
          )}

          <Field label="Color">
            <div className="flex flex-wrap gap-2">
              {COLOR_SWATCHES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setSelectedColor(c)}
                  className="w-7 h-7 rounded-full border"
                  style={{
                    backgroundColor: c,
                    borderColor: c === selectedColor ? "#000" : "transparent",
                    boxShadow:
                      c === selectedColor
                        ? "0 0 0 2px rgba(0,0,0,0.15)"
                        : undefined,
                  }}
                  aria-label={`Color ${c}`}
                />
              ))}
            </div>
          </Field>

          {error && <div className="text-xs text-red-600 mt-1">{error}</div>}
        </div>

        <div className="flex items-center justify-between mt-5 gap-2">
          <div>
            {!props.isNew && props.onDelete && (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm("Delete this item?")) props.onDelete?.();
                }}
                className="text-sm text-red-600 px-3 py-1.5"
              >
                Delete
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={props.onClose}
              className="text-sm text-foreLight px-3 py-1.5"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="text-sm rounded px-3 py-1.5 text-bgLight"
              style={{ backgroundColor: "rgb(97,95,82)" }}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Field: FC<{
  label: string;
  className?: string;
  children: React.ReactNode;
}> = ({ label, className, children }) => (
  <label className={`flex flex-col gap-1 ${className ?? ""}`}>
    <span className="text-xs text-foreLight">{label}</span>
    {children}
  </label>
);

function isValidTime(t: string): boolean {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(t) || t === "24:00";
}

function toMin(t: string): number {
  const [h, m] = t.split(":");
  return Number(h) * 60 + Number(m);
}

function toInputTime(t: string): string {
  return t === "24:00" ? "23:59" : t;
}

function clamp(n: number, lo: number, hi: number): number {
  if (Number.isNaN(n)) return lo;
  return Math.max(lo, Math.min(hi, n));
}
