import { cn } from "cn"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("win-sunken animate-pulse rounded-none bg-[#808080]", className)}
      {...props}
    />
  )
}

export { Skeleton }
