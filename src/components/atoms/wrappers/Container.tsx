export default function Container(props: { children: React.ReactNode }) {
  return <div className="container mx-auto px-4">{props.children}</div>;
}
