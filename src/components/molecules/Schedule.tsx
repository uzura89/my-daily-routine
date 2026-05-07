"use client";

import { TimetableType, TimetableItemType } from "@/types/ConfigTypes";
import { FC, useEffect, useRef, useState } from "react";
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
const MOVE_CANCEL_PX = 8;
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

  return (
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
        onMoveItem={props.onMoveItem}
        onDragGhostChange={setDragGhostStart}
      />

      <CurrentTimeLine
        labelWidth={LABEL_WIDTH}
        rowHeight={HOUR_HEIGHT}
        currentHour={currentHour}
      />
    </div>
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
  onMoveItem: (id: string, newStart: string) => void;
  onDragGhostChange: (
    g: { id: string; startMin: number } | null
  ) => void;
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
          onMoveItem={props.onMoveItem}
          onDragGhostChange={props.onDragGhostChange}
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
  onMoveItem: (id: string, newStart: string) => void;
  onDragGhostChange: (
    g: { id: string; startMin: number } | null
  ) => void;
}) {
  const storedStartMin = timeToMinutes(props.item.start);
  const duration = durationMinutes(props.item.start, props.item.end);

  // While dragging, render at the drag-target position so the item visibly
  // tracks the pointer. Grab-offset math still uses the stored start.
  const effectiveStart =
    props.dragOverrideStartMin !== null
      ? props.dragOverrideStartMin
      : storedStartMin;
  const effectiveEndRaw = effectiveStart + duration;
  const effectiveEnd =
    effectiveEndRaw <= DAY_MIN ? effectiveEndRaw : effectiveEndRaw - DAY_MIN;
  const segments = itemSegments(effectiveStart, effectiveEnd);

  // Outer wrapper covering the data column. Used as the reference for
  // converting clientY → minutes during drag.
  const wrapperRef = useRef<HTMLDivElement>(null);

  const stateRef = useRef<{
    pointerId: number | null;
    pressTimer: ReturnType<typeof setTimeout> | null;
    capturedEl: HTMLElement | null;
    startX: number;
    startY: number;
    grabOffsetMin: number;
    dragging: boolean;
    moved: boolean;
  }>({
    pointerId: null,
    pressTimer: null,
    capturedEl: null,
    startX: 0,
    startY: 0,
    grabOffsetMin: 0,
    dragging: false,
    moved: false,
  });

  const [isDragging, setIsDragging] = useState(false);

  function clearTimer() {
    if (stateRef.current.pressTimer) {
      clearTimeout(stateRef.current.pressTimer);
      stateRef.current.pressTimer = null;
    }
  }

  function commitDrag(commitStartMin: number | null) {
    const s = stateRef.current;
    if (s.dragging && commitStartMin !== null) {
      const snapped = wrapMinutes(snap(commitStartMin, SNAP_MINUTES));
      props.onMoveItem(props.item.id, minutesToTime(snapped));
    }
    s.dragging = false;
    s.pointerId = null;
    s.moved = false;
    s.capturedEl = null;
    setIsDragging(false);
    props.onDragGhostChange(null);
  }

  function clientYToAbsMin(clientY: number): number | null {
    const parentRect = wrapperRef.current?.getBoundingClientRect();
    if (!parentRect) return null;
    return ((clientY - parentRect.top) / props.rowHeight) * 60;
  }

  function onPointerDown(
    e: React.PointerEvent<HTMLDivElement>,
    segment: Segment
  ) {
    if (e.button !== undefined && e.button !== 0) return;
    const s = stateRef.current;
    s.pointerId = e.pointerId;
    s.startX = e.clientX;
    s.startY = e.clientY;
    s.moved = false;
    s.dragging = false;
    s.capturedEl = e.currentTarget;

    // grab offset within the item, in minutes (handles wrap by using
    // duration along the item's timeline, not raw clock time).
    const abs = clientYToAbsMin(e.clientY);
    if (abs === null) {
      s.grabOffsetMin = 0;
    } else if (segment.isHead) {
      s.grabOffsetMin = Math.max(0, abs - storedStartMin);
    } else {
      s.grabOffsetMin = DAY_MIN - storedStartMin + Math.max(0, abs);
    }

    clearTimer();
    s.pressTimer = setTimeout(() => {
      if (stateRef.current.pointerId !== e.pointerId) return;
      stateRef.current.dragging = true;
      setIsDragging(true);
      try {
        stateRef.current.capturedEl?.setPointerCapture(e.pointerId);
      } catch {}
      props.onDragGhostChange({ id: props.item.id, startMin: storedStartMin });
    }, LONG_PRESS_MS);
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const s = stateRef.current;
    if (s.pointerId !== e.pointerId) return;

    if (!s.dragging) {
      const dx = Math.abs(e.clientX - s.startX);
      const dy = Math.abs(e.clientY - s.startY);
      if (dx + dy > MOVE_CANCEL_PX) {
        s.moved = true;
        clearTimer();
      }
      return;
    }

    e.preventDefault();
    const abs = clientYToAbsMin(e.clientY);
    if (abs === null) return;
    const proposed = wrapMinutes(abs - s.grabOffsetMin);
    props.onDragGhostChange({
      id: props.item.id,
      startMin: snap(proposed, SNAP_MINUTES) % DAY_MIN,
    });
  }

  function onPointerUp(e: React.PointerEvent<HTMLDivElement>) {
    const s = stateRef.current;
    if (s.pointerId !== e.pointerId) return;
    clearTimer();

    if (s.dragging) {
      const abs = clientYToAbsMin(e.clientY);
      const newStart = abs === null ? null : abs - s.grabOffsetMin;
      try {
        s.capturedEl?.releasePointerCapture(e.pointerId);
      } catch {}
      commitDrag(newStart);
    } else if (!s.moved) {
      props.onEditItem(props.item);
      s.pointerId = null;
      s.capturedEl = null;
    } else {
      s.pointerId = null;
      s.capturedEl = null;
    }
  }

  function onPointerCancel(e: React.PointerEvent<HTMLDivElement>) {
    const s = stateRef.current;
    clearTimer();
    if (s.dragging) {
      try {
        s.capturedEl?.releasePointerCapture(e.pointerId);
      } catch {}
    }
    commitDrag(null);
  }

  return (
    <div ref={wrapperRef} className="absolute inset-0 pointer-events-none">
      {segments.map((seg, idx) => {
        const segY = (seg.startMin / 60) * props.rowHeight;
        const segH = ((seg.endMin - seg.startMin) / 60) * props.rowHeight;
        const isOnly = segments.length === 1;
        return (
          <div
            key={idx}
            className="absolute select-none pointer-events-auto"
            style={{
              transform: `translateY(${segY + (seg.isHead ? 2 : 0)}px) scale(${
                isDragging ? 1.02 : 1
              })`,
              left: 1,
              right: 5,
              height: segH - (seg.isHead ? 2 : 0),
              backgroundColor: props.item.color,
              cursor: isDragging ? "grabbing" : "pointer",
              touchAction: isDragging ? "none" : "pan-y",
              WebkitTouchCallout: "none",
              zIndex: isDragging ? 10 : "auto",
              boxShadow: isDragging
                ? "0 6px 14px rgba(0,0,0,0.18)"
                : undefined,
              transition: isDragging
                ? undefined
                : "box-shadow 120ms ease",
              borderTopLeftRadius: seg.isHead ? 2 : 0,
              borderTopRightRadius: seg.isHead ? 2 : 0,
              borderBottomLeftRadius: !seg.isHead || isOnly ? 2 : 0,
              borderBottomRightRadius: !seg.isHead || isOnly ? 2 : 0,
            }}
            onPointerDown={(e) => onPointerDown(e, seg)}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerCancel}
          >
            {seg.isHead && (
              <div className="px-2 py-1 flex flex-wrap items-center gap-0.5 overflow-hidden">
                <div className="text-fore text-sm shrink-0 mr-3">
                  {props.item.name}
                </div>
                <div className="text-fore opacity-80 text-xs">
                  {props.item.memo}
                </div>
              </div>
            )}
            {!seg.isHead && segments.length > 1 && (
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
