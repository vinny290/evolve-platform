import { cn } from "@/lib/utils";

function Title({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: React.ComponentProps<"h1">;
}) {
  return (
    <h1
      className={cn(
        "scroll-m-20 text-4xl font-bold tracking-tight text-balance",
        className,
      )}
    >
      {children}
    </h1>
  );
}

export default Title;
