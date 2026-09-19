const PALETTE = [
  "#000000",
  "#808080",
  "#800000",
  "#808000",
  "#008000",
  "#008080",
  "#000080",
  "#800080",
  "#808040",
  "#004040",
  "#0080ff",
  "#004080",
  "#400080",
  "#804000",
  "#ffffff",
  "#c0c0c0",
  "#ff0000",
  "#ffff00",
  "#00ff00",
  "#00ffff",
  "#0000ff",
  "#ff00ff",
  "#ffff80",
  "#80ff80",
  "#80ffff",
  "#8080ff",
  "#ff80c0",
  "#ff8040",
];

export function PaintPalette() {
  const top = PALETTE.slice(0, 14);
  const bottom = PALETTE.slice(14);

  return (
    <div className="flex items-end gap-2 bg-[#ece9d8] px-2 py-1.5">
      <div className="relative h-[36px] w-[36px] shrink-0">
        <span
          className="absolute top-[10px] left-[10px] h-5 w-5 border border-[#808080] bg-white shadow-[inset_1px_1px_0_#fff,1px_1px_0_#000]"
          aria-hidden
        />
        <span
          className="absolute top-0 left-0 h-5 w-5 border border-[#808080] bg-black shadow-[inset_1px_1px_0_#404040,1px_1px_0_#000]"
          aria-hidden
        />
      </div>
      <div className="flex flex-col gap-px">
        <div className="flex">
          {top.map((color) => (
            <span
              key={`t-${color}`}
              className="win-swatch"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
        <div className="flex">
          {bottom.map((color) => (
            <span
              key={`b-${color}`}
              className="win-swatch"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
