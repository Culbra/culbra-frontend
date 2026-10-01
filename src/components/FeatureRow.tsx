import { Network, Brain, Lightbulb, Sprout } from "lucide-react";

const FEATURES = [
  { label: "Culture", Icon: Network },
  { label: "Brains", Icon: Brain },
  { label: "Creativity", Icon: Lightbulb },
  { label: "Impact", Icon: Sprout },
] as const;

export type FeatureLabel = (typeof FEATURES)[number]["label"];

export default function FeatureRow({
  accent = "Culture",
}: {
  accent?: FeatureLabel | "all";
}) {
  return (
    <div
      className="relative bg-cover bg-center"
      style={{ backgroundImage: "url(/images/tribal-pattern.jpg)" }}
    >
      <div className="absolute inset-0 bg-black/92" />
      <ul className="relative grid w-full grid-cols-4 divide-x divide-white/30">
        {FEATURES.map(({ label, Icon }) => (
          <li
            key={label}
            className="flex flex-col items-center gap-1 px-1 py-4 text-center sm:gap-2 sm:px-4 sm:py-8"
          >
            <Icon
              className={`h-6 w-6 sm:h-10 sm:w-10 ${accent === "all" || label === accent ? "text-culbra-green" : "text-white"}`}
              strokeWidth={1.5}
            />
            <span className="text-[11px] font-medium text-white sm:text-sm">
              {label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
