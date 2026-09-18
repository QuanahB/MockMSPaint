import { Gochi_Hand, Kalam } from "next/font/google";
import { site } from "@/lib/site";

const gochi = Gochi_Hand({
  weight: "400",
  subsets: ["latin"],
});

const kalam = Kalam({
  weight: "400",
  subsets: ["latin"],
});

export function OimadisCanvas() {
  return (
    <div className="paint-scroll flex min-h-full min-w-full items-center justify-center bg-white px-6 py-16">
      <div className="flex min-h-[520px] min-w-[720px] flex-col items-center justify-center text-center text-black">
        <h1
          className={`${gochi.className} text-[4.5rem] leading-[0.9] tracking-wide sm:text-[7rem]`}
          style={{
            textShadow:
              "0.5px 0 currentColor, -0.5px 0 currentColor, 0 0.5px currentColor, 0 -0.5px currentColor",
          }}
        >
          {site.name}
        </h1>
        <p className={`${kalam.className} mt-4 text-2xl sm:text-3xl`}>
          ({site.tagline})
        </p>
      </div>
    </div>
  );
}
