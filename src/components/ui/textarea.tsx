import * as React from "react"
import { cn } from "cn"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "win-sunken field-sizing-content min-h-16 w-full rounded-none bg-white px-1.5 py-1 text-[12px] text-black outline-none placeholder:text-[#808080] disabled:bg-[#c0c0c0]",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
