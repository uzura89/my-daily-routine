"use client";

import { TimetableType, TimetableItemType } from "@/types/ConfigTypes";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import {
  DndContext,
  DragCancelEvent,
  DragEndEvent,
  DragMoveEvent,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  useDraggable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  durationMinutes,
  minutesToTime,
  timeToMinutes,
  wrapMinutes,
} from "@/hooks/useBoards";

const HOUR_HEIGHT = 60; // 1 hour = 60px
const LABEL_WIDTH = 60; // width of time label
const SNAP_MINUTES = 15;
const LONG_PRESS_MS = 350;
const MOVE_TOLERANCE = 8;
const DAY_MIN = 24 * 60;

export type ScheduleProps = {
  timetable: TimetableType;
  onCreateAt: (start: string) => void;
  onEditItem: (item: TimetableItemType) => void;
  onMoveItem: (id: string, newStart: string) => void;
};

export const Schedule: FC<ScheduleProps> = (props) => {
  const timetableSheetRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  const [, setWholeWidth] = useState(0);
  const [currentHour, setCurrentHour] = useState("24:00");
  const [dragGhostStart, setDragGhostStart] = useState<{
    id: string;
    startMin: number;
  } | null>(null);

  const itemsById = useMemo(() => {
    const map = new Map<string, TimetableItemType>();
    for (const i of props.timetable) map.set(i.id, i);
    return map;
  }, [props.timetable]);

  // Long-press to activate drag, with movement tolerance during the hold.
  // Same constraint for mouse and touch keeps desktop and mobile UX consistent.
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: { delay: LONG_PRESS_MS, tolerance: MOVE_TOLERANCE },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: LONG_PRESS_MS, tolerance: MOVE_TOLERANCE },
    })
  );

  function calcWholeWidth() {
    if (timetableSheetRef.current) {
      const cardWidth = timetableSheetRef.current.getBoundingClientRect().width;
      setWholeWidth(cardWidth);
    }
  }

  function adjustToCurrentHour() {
    const date = new Date();
    const hour = date.getHours().toString().padStart(2, "0");
    const minute = date.getMinutes().toString().padStart(2, "0");
    setCurrentHour(`${hour}:${minute}`);
  }

  useEffect(() => {
    calcWholeWidth();
    adjustToCurrentHour();
    intervalRef.current = setInterval(() => adjustToCurrentHour(), 1000 * 60);
    const onResize = () => calcWholeWidth();
    window.addEventListener("resize", onResize);
    return () => {
      clearInterval(intervalRef.current);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  function handleBlankClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target !== e.currentTarget) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const minutes = snap((y / HOUR_HEIGHT) * 60, SNAP_MINUTES);
    const clamped = Math.max(0, Math.min(DAY_MIN - 30, minutes));
    props.onCreateAt(minutesToTime(clamped));
  }

  function computeDraggedStart(itemId: string, deltaY: number): number | null {
    const item = itemsById.get(itemId);
    if (!item) return null;
    const storedStart = timeToMinutes(item.start);
    const proposedMin = storedStart + (deltaY / HOUR_HEIGHT) * 60;
    return wrapMinutes(snap(proposedMin, SNAP_MINUTES));
  }

  function onDragStart(e: DragStartEvent) {
    const item = itemsById.get(String(e.active.id));
    if (!item) return;
    setDragGhostStart({ id: item.id, startMin: timeToMinutes(item.start) });
  }

  function onDragMove(e: DragMoveEvent) {
    const id = String(e.active.id);
    const newStart = computeDraggedStart(id, e.delta.y);
    if (newStart === null) return;
    setDragGhostStart({ id, startMin: newStart });
  }

  function onDragEnd(e: DragEndEvent) {
    const id = String(e.active.id);
    const newStart = computeDraggedStart(id, e.delta.y);
    if (newStart !== null) {
      props.onMoveItem(id, minutesToTime(newStart));
    }
    setDragGhostStart(null);
  }

  function onDragCancel(_: DragCancelEvent) {
    setDragGhostStart(null);
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={onDragStart}
      onDragMove={onDragMove}
      onDragEnd={onDragEnd}
      onDragCancel={onDragCancel}
    >
      <div
        ref={timetableSheetRef}
        className="relative"
        style={{ height: HOUR_HEIGHT * 24 }}
      >
        <TimetableSheetBlank
          labelWidth={LABEL_WIDTH}
          rowHeight={HOUR_HEIGHT}
          onBlankClick={handleBlankClick}
        />

        <TimetableData
          labelWidth={LABEL_WIDTH}
          rowHeight={HOUR_HEIGHT}
          timetable={props.timetable}
          dragOverride={dragGhostStart}
          onEditItem={props.onEditItem}
        />

        <CurrentTimeLine
          labelWidth={LABEL_WIDTH}
          rowHeight={HOUR_HEIGHT}
          currentHour={currentHour}
        />
      </div>
    </DndContext>
  );
};

function TimetableSheetBlank(props: {
  labelWidth: number;
  rowHeight: number;
  onBlankClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}) {
  return (
    <div
      className="border-t border-b border-border relative"
      style={{ height: props.rowHeight * 24 }}
    >
      {[...Array(24)].map((_, index) => {
        if (index === 0) return null;
        return (
          <HourLine
            key={index}
            translateY={index * props.rowHeight}
            label={`${index.toString().padStart(2, "0")}:00`}
            labelWidth={props.labelWidth}
          />
        );
      })}

      <div
        className="absolute top-0 bottom-0 left-0 w-[1px] bg-border"
        style={{ transform: `translateX(${props.labelWidth}px)` }}
      />

      {/* Click target for new items */}
      <div
        className="absolute top-0 bottom-0 right-0 cursor-cell"
        style={{ left: props.labelWidth }}
        onClick={props.onBlankClick}
      />
    </div>
  );
}

function HourLine(props: {
  translateY: number;
  label: string;
  labelWidth: number;
}) {
  return (
    <div
      className="absolute w-full pointer-events-none"
      style={{ transform: `translateY(${props.translateY}px)` }}
    >
      <div className="flex items-start">
        <div
          className="text-center text-foreLight text-xs -translate-y-[7.4px]"
          style={{ width: props.labelWidth }}
        >
          {props.label}
        </div>
        <div
          className="h-[1px] bg-border absolute right-0"
          style={{ width: `calc(100% - ${props.labelWidth - 8}px)` }}
        />
      </div>
    </div>
  );
}

function TimetableData(props: {
  labelWidth: number;
  rowHeight: number;
  timetable: TimetableType;
  dragOverride: { id: string; startMin: number } | null;
  onEditItem: (item: TimetableItemType) => void;
}) {
  return (
    <div
      className="absolute top-0 bottom-0 right-0 pointer-events-none"
      style={{ left: props.labelWidth }}
    >
      {props.timetable.map((item) => (
        <TimetableItem
          key={item.id}
          item={item}
          rowHeight={props.rowHeight}
          dragOverrideStartMin={
            props.dragOverride?.id === item.id
              ? props.dragOverride.startMin
              : null
          }
          onEditItem={props.onEditItem}
        />
      ))}
    </div>
  );
}

type Segment = { startMin: number; endMin: number; isHead: boolean };

function itemSegments(startMin: number, endMin: number): Segment[] {
  if (endMin > startMin) {
    return [{ startMin, endMin, isHead: true }];
  }
  // wraps midnight
  return [
    { startMin, endMin: DAY_MIN, isHead: true },
    { startMin: 0, endMin, isHead: false },
  ];
}

function TimetableItem(props: {
  item: TimetableItemType;
  rowHeight: number;
  dragOverrideStartMin: number | null;
  onEditItem: (item: TimetableItemType) => void;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: props.item.id,
  });

  const storedStartMin = timeToMinutes(props.item.start);
  const duration = durationMinutes(props.item.start, props.item.end);

  const effectiveStart =
    props.dragOverrideStartMin !== null
      ? props.dragOverrideStartMin
      : storedStartMin;
  const effectiveEndRaw = effectiveStart + duration;
  const effectiveEnd =
    effectiveEndRaw <= DAY_MIN ? effectiveEndRaw : effectiveEndRaw - DAY_MIN;
  const segments = itemSegments(effectiveStart, effectiveEnd);

  // Suppress the synthetic click that fires after a drag releases.
  const justDraggedRef = useRef(false);
  useEffect(() => {
    if (isDragging) {
      justDraggedRef.current = true;
    } else if (justDraggedRef.current) {
      const t = setTimeout(() => {
        justDraggedRef.current = false;
      }, 200);
      return () => clearTimeout(t);
    }
  }, [isDragging]);

  function handleClick() {
    if (justDraggedRef.current) return;
    props.onEditItem(props.item);
  }

  return (
    <div className="absolute inset-0 pointer-events-none">
      {segments.map((seg, idx) => {
        const segY = (seg.startMin / 60) * props.rowHeight;
        const segH = ((seg.endMin - seg.startMin) / 60) * props.rowHeight;
        const isOnly = segments.length === 1;
        const isHead = seg.isHead;
        return (
          <div
            key={idx}
            ref={isHead ? setNodeRef : undefined}
            {...(isHead ? listeners : {})}
            {...(isHead ? attributes : {})}
            onClick={handleClick}
            className="absolute select-none pointer-events-auto"
            style={{
              transform: `translateY(${segY + (isHead ? 2 : 0)}px) scale(${
                isDragging ? 1.02 : 1
              })`,
              left: 1,
              right: 5,
              height: segH - (isHead ? 2 : 0),
              backgroundColor: props.item.color,
              cursor: isDragging ? "grabbing" : "pointer",
              touchAction: "none",
              WebkitTouchCallout: "none",
              zIndex: isDragging ? 10 : "auto",
              boxShadow: isDragging
                ? "0 6px 14px rgba(0,0,0,0.18)"
                : undefined,
              transition: isDragging ? undefined : "box-shadow 120ms ease",
              borderTopLeftRadius: isHead ? 2 : 0,
              borderTopRightRadius: isHead ? 2 : 0,
              borderBottomLeftRadius: !isHead || isOnly ? 2 : 0,
              borderBottomRightRadius: !isHead || isOnly ? 2 : 0,
            }}
          >
            {isHead && (
              <div className="px-2 py-1 flex flex-wrap items-center gap-0.5 overflow-hidden">
                <div className="text-fore text-sm shrink-0 mr-3">
                  {props.item.name}
                </div>
                <div className="text-fore opacity-80 text-xs">
                  {props.item.memo}
                </div>
              </div>
            )}
            {!isHead && segments.length > 1 && (
              <div className="px-2 py-0.5 text-[10px] text-fore opacity-60">
                (cont.) {props.item.name}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function CurrentTimeLine(props: {
  labelWidth: number;
  rowHeight: number;
  currentHour: string;
}) {
  const currentHourY = (timeToMinutes(props.currentHour) / 60) * props.rowHeight;
  return (
    <div
      className="absolute top-0 right-0 pointer-events-none"
      style={{
        transform: `translateY(${currentHourY - 3}px)`,
        width: `calc(100% - ${props.labelWidth - 8}px)`,
      }}
    >
      <div className="flex items-center">
        <div className="w-2 h-2 rounded-full bg-foreLight" />
        <div className="h-[1px] bg-foreLight absolute right-0 w-full" />
      </div>
    </div>
  );
}

function snap(minutes: number, step: number): number {
  return Math.round(minutes / step) * step;
}
