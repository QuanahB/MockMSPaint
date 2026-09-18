import Link from "next/link";

function ChromeButton({
  href,
  label,
  children,
  danger = false,
}: {
  href?: string;
  label: string;
  children: React.ReactNode;
  danger?: boolean;
}) {
  const className = danger
    ? "inline-flex size-[21px] items-center justify-center border border-[#fff] border-r-[#000] border-b-[#000] bg-[#e81123] text-[11px] font-bold leading-none text-white"
    : "win-raised inline-flex size-[21px] items-center justify-center bg-[#c0c0c0] text-[11px] leading-none text-black";

  if (href) {
    return (
      <Link href={href} className={className} aria-label={label} title={label}>
        {children}
      </Link>
    );
  }

  return (
    <span className={className} aria-hidden title={label}>
      {children}
    </span>
  );
}

export function WindowControls() {
  return (
    <div className="ml-auto flex shrink-0 items-center gap-0.5">
      <ChromeButton href="/about" label="Help">
        ?
      </ChromeButton>
      <ChromeButton href="/sign-in" label="Account">
        <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden>
          <circle cx="6" cy="3.5" r="2" fill="#000" />
          <path d="M2 11c0-2.2 1.8-3.5 4-3.5s4 1.3 4 3.5" fill="#000" />
        </svg>
      </ChromeButton>
      <ChromeButton href="/" label="Close" danger>
        ×
      </ChromeButton>
    </div>
  );
}
