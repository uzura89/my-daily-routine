"use client";

import { FC, useEffect, useRef, useState } from "react";
import { BoardType } from "@/types/ConfigTypes";

export type BoardSwitcherProps = {
  boards: BoardType[];
  activeBoardId: string;
  onSwitch: (boardId: string) => void;
  onAdd: (name: string) => void;
  onRename: (boardId: string, name: string) => void;
  onDelete: (boardId: string) => void;
};

export const BoardSwitcher: FC<BoardSwitcherProps> = (props) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const active = props.boards.find((b) => b.id === props.activeBoardId);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    window.addEventListener("mousedown", onClick);
    return () => window.removeEventListener("mousedown", onClick);
  }, [open]);

  function handleAdd() {
    const name = window.prompt("Board name");
    if (!name) return;
    props.onAdd(name);
    setOpen(false);
  }

  function handleRename(boardId: string, currentName: string) {
    const name = window.prompt("Rename board", currentName);
    if (!name) return;
    props.onRename(boardId, name);
  }

  function handleDelete(boardId: string, name: string) {
    if (props.boards.length <= 1) {
      window.alert("Can't delete the last board.");
      return;
    }
    if (!window.confirm(`Delete board "${name}"?`)) return;
    props.onDelete(boardId);
  }

  return (
    <div className="relative inline-block" ref={wrapperRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1 text-md text-fore opacity-70 hover:opacity-100"
      >
        <span>{active?.name ?? "Board"}</span>
        <span className="text-xs">▾</span>
      </button>

      {open && (
        <div
          className="absolute left-1/2 -translate-x-1/2 mt-2 w-60 bg-bgLight border border-border rounded-md shadow-md z-30 p-1"
        >
          <div className="max-h-64 overflow-auto">
            {props.boards.map((b) => {
              const isActive = b.id === props.activeBoardId;
              return (
                <div
                  key={b.id}
                  className="flex items-center justify-between gap-1 px-2 py-1.5 rounded hover:bg-black/5"
                >
                  <button
                    type="button"
                    onClick={() => {
                      props.onSwitch(b.id);
                      setOpen(false);
                    }}
                    className={`flex-1 text-left text-sm ${
                      isActive ? "font-semibold text-fore" : "text-foreLight"
                    }`}
                  >
                    {b.name}
                  </button>
                  <button
                    type="button"
                    title="Rename"
                    onClick={() => handleRename(b.id, b.name)}
                    className="text-[10px] text-foreLight px-1.5 py-0.5 hover:underline"
                  >
                    rename
                  </button>
                  <button
                    type="button"
                    title="Delete"
                    onClick={() => handleDelete(b.id, b.name)}
                    className="text-[10px] text-foreLight px-1.5 py-0.5 hover:underline"
                  >
                    delete
                  </button>
                </div>
              );
            })}
          </div>
          <div className="border-t border-border mt-1 pt-1">
            <button
              type="button"
              onClick={handleAdd}
              className="w-full text-left text-sm text-fore px-2 py-1.5 rounded hover:bg-black/5"
            >
              + New board
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
