import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cn } from "cn"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "win-sunken h-[23px] w-full min-w-0 rounded-none bg-white px-1.5 py-0 text-[12px] text-black outline-none placeholder:text-[#808080] disabled:bg-[#c0c0c0] disabled:text-[#808080]",
        className
      )}
      {...props}
    />
  )
}

export { Input }
