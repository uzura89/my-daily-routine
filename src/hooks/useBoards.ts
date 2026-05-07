"use client";

import { useCallback, useEffect, useState } from "react";
import {
  BoardType,
  BoardsStateType,
  TimetableItemType,
} from "@/types/ConfigTypes";
import { config } from "@/data/config";

const STORAGE_KEY = "oneday.boards.v1";

function generateId(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function buildSeedState(): BoardsStateType {
  const seedBoardId = generateId();
  const seedBoard: BoardType = {
    id: seedBoardId,
    name: config.name || "Daily Routine",
    timetable: config.timetable.map((item) => ({ ...item, id: generateId() })),
  };
  return {
    boards: [seedBoard],
    activeBoardId: seedBoardId,
  };
}

function loadFromStorage(): BoardsStateType | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as BoardsStateType;
    if (!parsed?.boards?.length || !parsed.activeBoardId) return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveToStorage(state: BoardsStateType) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore quota / serialization errors
  }
}

export type UseBoardsReturn = {
  ready: boolean;
  boards: BoardType[];
  activeBoard: BoardType | undefined;
  switchBoard: (boardId: string) => void;
  addBoard: (name: string) => string;
  renameBoard: (boardId: string, name: string) => void;
  deleteBoard: (boardId: string) => void;
  addItem: (item: Omit<TimetableItemType, "id">) => void;
  updateItem: (id: string, patch: Partial<Omit<TimetableItemType, "id">>) => void;
  deleteItem: (id: string) => void;
  moveItem: (id: string, newStart: string) => void;
};

export function useBoards(): UseBoardsReturn {
  const [state, setState] = useState<BoardsStateType | null>(null);

  useEffect(() => {
    const fromStorage = loadFromStorage();
    setState(fromStorage ?? buildSeedState());
  }, []);

  useEffect(() => {
    if (state) saveToStorage(state);
  }, [state]);

  const updateActiveBoard = useCallback(
    (mutator: (board: BoardType) => BoardType) => {
      setState((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          boards: prev.boards.map((b) =>
            b.id === prev.activeBoardId ? mutator(b) : b
          ),
        };
      });
    },
    []
  );

  const switchBoard = useCallback((boardId: string) => {
    setState((prev) => {
      if (!prev) return prev;
      if (!prev.boards.some((b) => b.id === boardId)) return prev;
      return { ...prev, activeBoardId: boardId };
    });
  }, []);

  const addBoard = useCallback((name: string) => {
    const newId = generateId();
    setState((prev) => {
      const base: BoardsStateType = prev ?? { boards: [], activeBoardId: "" };
      const trimmed = name.trim() || "New Board";
      const newBoard: BoardType = {
        id: newId,
        name: trimmed,
        timetable: [],
      };
      return {
        boards: [...base.boards, newBoard],
        activeBoardId: newId,
      };
    });
    return newId;
  }, []);

  const renameBoard = useCallback((boardId: string, name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setState((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        boards: prev.boards.map((b) =>
          b.id === boardId ? { ...b, name: trimmed } : b
        ),
      };
    });
  }, []);

  const deleteBoard = useCallback((boardId: string) => {
    setState((prev) => {
      if (!prev) return prev;
      if (prev.boards.length <= 1) return prev; // keep at least one
      const remaining = prev.boards.filter((b) => b.id !== boardId);
      const nextActive =
        prev.activeBoardId === boardId
          ? remaining[0].id
          : prev.activeBoardId;
      return { boards: remaining, activeBoardId: nextActive };
    });
  }, []);

  const addItem = useCallback(
    (item: Omit<TimetableItemType, "id">) => {
      updateActiveBoard((board) => ({
        ...board,
        timetable: [...board.timetable, { ...item, id: generateId() }],
      }));
    },
    [updateActiveBoard]
  );

  const updateItem = useCallback(
    (id: string, patch: Partial<Omit<TimetableItemType, "id">>) => {
      updateActiveBoard((board) => ({
        ...board,
        timetable: board.timetable.map((it) =>
          it.id === id ? { ...it, ...patch } : it
        ),
      }));
    },
    [updateActiveBoard]
  );

  const deleteItem = useCallback(
    (id: string) => {
      updateActiveBoard((board) => ({
        ...board,
        timetable: board.timetable.filter((it) => it.id !== id),
      }));
    },
    [updateActiveBoard]
  );

  const moveItem = useCallback(
    (id: string, newStart: string) => {
      updateActiveBoard((board) => ({
        ...board,
        timetable: board.timetable.map((it) => {
          if (it.id !== id) return it;
          const duration = durationMinutes(it.start, it.end);
          const startMin = wrapMinutes(timeToMinutes(newStart));
          const endRaw = startMin + duration;
          const endMin = endRaw <= 24 * 60 ? endRaw : endRaw - 24 * 60;
          return {
            ...it,
            start: minutesToTime(startMin),
            end: minutesToTime(endMin),
          };
        }),
      }));
    },
    [updateActiveBoard]
  );

  const activeBoard = state?.boards.find((b) => b.id === state.activeBoardId);

  return {
    ready: state !== null,
    boards: state?.boards ?? [],
    activeBoard,
    switchBoard,
    addBoard,
    renameBoard,
    deleteBoard,
    addItem,
    updateItem,
    deleteItem,
    moveItem,
  };
}

export function timeToMinutes(t: string): number {
  const [h, m] = t.split(":");
  return Number(h) * 60 + Number(m);
}

export function minutesToTime(min: number): string {
  const clamped = clamp(Math.round(min), 0, 24 * 60);
  const h = Math.floor(clamped / 60);
  const m = clamped % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

// Duration in minutes from start to end, wrapping midnight when end < start.
// "23:00" → "06:00" returns 7 * 60. "21:00" → "24:00" returns 3 * 60.
export function durationMinutes(start: string, end: string): number {
  const s = timeToMinutes(start);
  const e = timeToMinutes(end);
  if (e > s) return e - s;
  if (e === s) return 0;
  return 24 * 60 - s + e;
}

export function wrapMinutes(min: number): number {
  const day = 24 * 60;
  return ((Math.round(min) % day) + day) % day;
}
