import Link from "next/link";

export function WindowControls() {
  return (
    <div className="ml-auto flex shrink-0 items-center gap-0.5">
      <span
        className="win-raised inline-flex size-[16px] items-end justify-center bg-[#c0c0c0] text-[11px] leading-none text-black"
        aria-hidden
      >
        _
      </span>
      <span
        className="win-raised inline-flex size-[16px] items-center justify-center bg-[#c0c0c0] text-[10px] leading-none text-black"
        aria-hidden
      >
        □
      </span>
      <Link
        href="/"
        className="win-raised inline-flex size-[16px] items-center justify-center bg-[#c0c0c0] text-[11px] leading-none font-bold text-black"
        aria-label="Close"
      >
        ×
      </Link>
    </div>
  );
}
