export default function Container(props: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto px-4 max-w-md">{props.children}</div>
  );
}
