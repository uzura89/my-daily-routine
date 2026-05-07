"use client";

import Container from "../atoms/wrappers/Container";

import { IMG_BRAND_MARK } from "@/constants/img.cons";
import Image from "next/image";
import { Akatab } from "next/font/google";
import { ScheduleCard } from "../organisms/ScheduleCard";
import { FC, useState } from "react";
import { TimetableItemType } from "@/types/ConfigTypes";
import { useBoards, timeToMinutes, minutesToTime } from "@/hooks/useBoards";
import { EditItemModal } from "../molecules/EditItemModal";
import { BoardSwitcher } from "../molecules/BoardSwitcher";
import * as color from "@/constants/itemcolor.cons";

const akatab = Akatab({ subsets: ["latin"], weight: ["400"] });

type ModalState =
  | { mode: "closed" }
  | {
      mode: "new";
      initial: Omit<TimetableItemType, "id">;
    }
  | {
      mode: "edit";
      item: TimetableItemType;
    };

export const ScheduleTemplate: FC = () => {
  const boards = useBoards();
  const [modal, setModal] = useState<ModalState>({ mode: "closed" });

  if (!boards.ready || !boards.activeBoard) {
    return (
      <Container>
        <div className="pt-10 text-center text-foreLight text-sm">Loading…</div>
      </Container>
    );
  }

  const activeBoard = boards.activeBoard;

  function handleCreateAt(start: string) {
    const startMin = timeToMinutes(start);
    const endMin = Math.min(startMin + 30, 24 * 60);
    setModal({
      mode: "new",
      initial: {
        name: "",
        memo: "",
        start,
        end: minutesToTime(endMin),
        color: color.ITEM_COLOR_GRAY,
      },
    });
  }

  function handleEditItem(item: TimetableItemType) {
    setModal({ mode: "edit", item });
  }

  function handleSave(values: Omit<TimetableItemType, "id">) {
    if (modal.mode === "new") {
      boards.addItem(values);
    } else if (modal.mode === "edit") {
      boards.updateItem(modal.item.id, values);
    }
    setModal({ mode: "closed" });
  }

  function handleDelete() {
    if (modal.mode === "edit") {
      boards.deleteItem(modal.item.id);
    }
    setModal({ mode: "closed" });
  }

  return (
    <Container>
      <div className="flex items-center justify-center pt-5 pb-4">
        <h1 className="font-bold text-lg">
          <Image
            src={IMG_BRAND_MARK}
            width={30}
            height={30}
            alt="OneDay"
            className="inline-block"
          />
        </h1>
      </div>

      <div className="flex items-center justify-center mt-1 mb-6">
        <div className={`${akatab.className}`}>
          <BoardSwitcher
            boards={boards.boards}
            activeBoardId={activeBoard.id}
            onSwitch={boards.switchBoard}
            onAdd={boards.addBoard}
            onRename={boards.renameBoard}
            onDelete={boards.deleteBoard}
          />
        </div>
      </div>

      <div className="mt-2 mb-10">
        <ScheduleCard
          timetable={activeBoard.timetable}
          onCreateAt={handleCreateAt}
          onEditItem={handleEditItem}
          onMoveItem={boards.moveItem}
        />
      </div>

      {modal.mode !== "closed" && (
        <EditItemModal
          isNew={modal.mode === "new"}
          initial={modal.mode === "new" ? modal.initial : modal.item}
          itemId={modal.mode === "edit" ? modal.item.id : undefined}
          onSave={handleSave}
          onDelete={modal.mode === "edit" ? handleDelete : undefined}
          onClose={() => setModal({ mode: "closed" })}
        />
      )}
    </Container>
  );
};
