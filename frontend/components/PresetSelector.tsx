import { cn } from "@/lib/utils";

interface PresetSelectorProps {
  activeId?: string | null;
  onSelect: (presetId: string) => void;
  presets: Array<{ id: string; label: string; description: string }>;
}

export function PresetSelector({ activeId, onSelect, presets }: PresetSelectorProps) {
  return (
    <div className="rounded-[28px] border border-line bg-[#fffaf5] p-4 sm:p-5">
      <p className="text-sm font-medium text-slate-600">Try a sample student</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {presets.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => onSelect(preset.id)}
            title={preset.description}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition",
              activeId === preset.id ? "border-[#d5b89e] bg-[#f1dfcf] text-ink" : "border-line bg-[#fffdfa] text-slate-600 hover:bg-[#fbf2e8]",
            )}
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  );
}
