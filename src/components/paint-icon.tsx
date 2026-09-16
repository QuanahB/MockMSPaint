export function PaintIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      aria-hidden="true"
      shapeRendering="crispEdges"
    >
      <rect width="16" height="16" fill="#c0c0c0" />
      <rect x="1" y="9" width="9" height="6" fill="#808080" />
      <rect x="2" y="10" width="7" height="4" fill="#ffffff" />
      <rect x="2" y="10" width="2" height="2" fill="#000000" />
      <rect x="4" y="10" width="2" height="2" fill="#800000" />
      <rect x="6" y="10" width="2" height="2" fill="#008000" />
      <rect x="2" y="12" width="2" height="2" fill="#000080" />
      <rect x="4" y="12" width="2" height="2" fill="#ffff00" />
      <rect x="6" y="12" width="2" height="2" fill="#ff00ff" />
      <path d="M8 2h2v1h1v1h1v2h-1v1H9V6H8V5H7V3h1z" fill="#000080" />
      <rect x="10" y="1" width="4" height="3" fill="#ff8000" />
      <rect x="11" y="2" width="2" height="1" fill="#ffff00" />
    </svg>
  );
}
