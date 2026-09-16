import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-none border-2 bg-[#c0c0c0] text-[12px] font-normal whitespace-nowrap text-black outline-none select-none disabled:pointer-events-none disabled:text-[#808080] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5",
  {
    variants: {
      variant: {
        default:
          "border-[#ffffff] border-r-[#000000] border-b-[#000000] shadow-[inset_-1px_-1px_0_#808080,inset_1px_1px_0_#dfdfdf] active:border-[#000000] active:border-r-[#ffffff] active:border-b-[#ffffff]",
        outline:
          "border-[#ffffff] border-r-[#000000] border-b-[#000000] shadow-[inset_-1px_-1px_0_#808080,inset_1px_1px_0_#dfdfdf] active:border-[#000000] active:border-r-[#ffffff] active:border-b-[#ffffff]",
        secondary:
          "border-[#ffffff] border-r-[#000000] border-b-[#000000] shadow-[inset_-1px_-1px_0_#808080,inset_1px_1px_0_#dfdfdf]",
        ghost:
          "border-transparent bg-transparent shadow-none hover:bg-[#000080] hover:text-white",
        destructive:
          "border-[#ffffff] border-r-[#000000] border-b-[#000000] text-[#800000]",
        link: "border-transparent bg-transparent text-[#000080] underline",
      },
      size: {
        default: "h-[23px] min-w-[75px] gap-1 px-3",
        xs: "h-[18px] min-w-[50px] gap-1 px-2 text-[11px]",
        sm: "h-[21px] min-w-[60px] gap-1 px-2",
        lg: "h-[28px] min-w-[90px] gap-1 px-4",
        icon: "size-[23px] min-w-[23px] p-0",
        "icon-xs": "size-[18px] min-w-[18px] p-0",
        "icon-sm": "size-[21px] min-w-[21px] p-0",
        "icon-lg": "size-[28px] min-w-[28px] p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
