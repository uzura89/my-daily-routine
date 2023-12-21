import { TimetableType, TimetableItemType } from "@/types/TimetableTypes";
import { FC, useEffect, useRef, useState } from "react";

const HOUR_HEIGHT = 60; // (1 hour = 60px)
const LABEL_WIDTH = 60; // width of time label

export const Schedule: FC<{ timetable: TimetableType }> = (props) => {
  const timetableSheetRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  const [wholeWidth, setWholeWidth] = useState(0);
  const [currentHour, setCurrentHour] = useState("24:00");

  /**
   * Functions
   */

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

  /**
   * Effect
   */

  useEffect(() => {
    calcWholeWidth();
    adjustToCurrentHour();

    intervalRef.current = setInterval(() => {
      adjustToCurrentHour();
    }, 1000 * 60);

    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div
      ref={timetableSheetRef}
      className="relative"
      style={{
        height: HOUR_HEIGHT * 24,
      }}
    >
      <TimetableSheetBlank
        wholeWidth={wholeWidth}
        labelWidth={LABEL_WIDTH}
        rowHeight={HOUR_HEIGHT}
      />

      <TimetableData
        wholeWidth={wholeWidth}
        labelWidth={LABEL_WIDTH}
        rowHeight={HOUR_HEIGHT}
        timetable={props.timetable}
      />

      <CurrentTimeLine
        labelWidth={LABEL_WIDTH}
        rowHeight={HOUR_HEIGHT}
        currentHour={currentHour}
      />
    </div>
  );
};

/**
 * Sub Components
 */

function TimetableSheetBlank(props: {
  wholeWidth: number;
  labelWidth: number;
  rowHeight: number;
}) {
  return (
    <div
      className="border-t border-b border-border relative"
      style={{
        height: props.rowHeight * 24,
      }}
    >
      {/* Hour Lines */}
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

      {/* Vertical Line */}
      <div
        className="absolute top-0 bottom-0 left-0 w-[1px] bg-border"
        style={{
          transform: `translateX(${props.labelWidth}px)`,
        }}
      ></div>
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
      className="absolute w-full"
      style={{
        transform: `translateY(${props.translateY}px)`,
      }}
    >
      <div className="flex items-start">
        <div
          className="w-10 text-center text-foreLight text-xs -translate-y-[7.4px]"
          style={{
            width: props.labelWidth,
          }}
        >
          {props.label}
        </div>
        <div
          className="h-[1px] bg-border absolute right-0"
          style={{
            width: `calc(100% - ${props.labelWidth - 8}px)`,
          }}
        ></div>
      </div>
    </div>
  );
}

function TimetableData(props: {
  wholeWidth: number;
  labelWidth: number;
  rowHeight: number;
  timetable: TimetableType;
}) {
  return (
    <div
      className="absolute top-0 bottom-0 right-0"
      style={{
        left: props.labelWidth,
      }}
    >
      {props.timetable.items.map((item, index) => {
        return (
          <TimetableItem key={index} item={item} rowHeight={props.rowHeight} />
        );
      })}
    </div>
  );
}

function TimetableItem(props: { item: TimetableItemType; rowHeight: number }) {
  const start = calcTimeToY(props.item.start, props.rowHeight);
  const end = calcTimeToY(props.item.end, props.rowHeight);
  const height = end - start;

  return (
    <div
      className="absolute rounded-sm"
      style={{
        transform: `translateY(${start + 2}px)`,
        left: 1,
        right: 5,
        height: height - 2,
        backgroundColor: props.item.color,
      }}
    >
      <div className="px-2 py-1 flex flex-wrap items-center gap-0.5 overflow-hidden">
        <div className="text-fore text-sm shrink-0 mr-3">{props.item.name}</div>
        <div className="text-fore opacity-80 text-xs">{props.item.memo}</div>
      </div>
    </div>
  );
}

function CurrentTimeLine(props: {
  labelWidth: number;
  rowHeight: number;
  currentHour: string;
}) {
  const currentHourY = calcTimeToY(props.currentHour, props.rowHeight);

  return (
    <div
      className="absolute top-0 right-0"
      style={{
        transform: `translateY(${currentHourY - 3}px)`,
        width: `calc(100% - ${props.labelWidth - 8}px)`,
      }}
    >
      <div className="flex items-center">
        {/* Dot */}
        <div className="w-2 h-2 rounded-full bg-foreLight" />
        {/* Line */}
        <div className="h-[1px] bg-foreLight absolute right-0 w-full"></div>
      </div>
    </div>
  );
}

function calcTimeToY(time: string, rowHeight: number) {
  const [hour, minute] = time.split(":");
  const hourNum = Number(hour);
  const minuteNum = Number(minute) / 60;
  return (hourNum + minuteNum) * rowHeight;
}
