import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const badgeVariants = cva(
  "group/badge inline-flex h-[18px] w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-none border-2 px-1.5 text-[11px] whitespace-nowrap [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default:
          "border-[#ffffff] border-r-[#000000] border-b-[#000000] bg-[#000080] text-white",
        secondary:
          "border-[#ffffff] border-r-[#000000] border-b-[#000000] bg-[#c0c0c0] text-black",
        destructive:
          "border-[#ffffff] border-r-[#000000] border-b-[#000000] bg-[#800000] text-white",
        outline:
          "border-[#ffffff] border-r-[#000000] border-b-[#000000] bg-[#c0c0c0] text-black",
        ghost: "border-transparent bg-transparent text-black",
        link: "border-transparent text-[#000080] underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
