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
  "#4000ff",
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
  "#00ff80",
  "#80ffff",
  "#8080ff",
  "#ff0080",
  "#ff8040",
];

export function PaintPalette() {
  const top = PALETTE.slice(0, 14);
  const bottom = PALETTE.slice(14);

  return (
    <div className="flex items-center gap-1 bg-[#c0c0c0] px-1 py-1">
      <div className="win-sunken flex size-8 shrink-0 flex-col p-0.5">
        <span className="h-3.5 w-full bg-black" />
        <span className="h-3.5 w-full bg-white" />
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
