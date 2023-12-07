import clsx from "clsx";

export default function Card(props: {
  children: React.ReactNode;
  noPadding?: boolean;
}) {
  return (
    <div
      className={clsx(
        "bg-bgLight rounded-md shadow-sm",
        props.noPadding ? "" : "p-4"
      )}
    >
      {props.children}
    </div>
  );
}
