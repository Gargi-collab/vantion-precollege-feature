"use client";

import { ReactNode, useState } from "react";
import { cn } from "@/lib/utils";

interface AccordionItemProps {
  title: string;
  preview?: string;
  defaultOpen?: boolean;
  children: ReactNode;
}

export function AccordionItem({ title, preview, defaultOpen = false, children }: AccordionItemProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-[28px] border border-line bg-[#fffdfa]">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6"
        aria-expanded={open}
      >
        <div className="min-w-0">
          <p className="text-base font-semibold text-ink">{title}</p>
          {preview ? <p className="mt-1 truncate text-sm text-slate-500 sm:whitespace-normal">{preview}</p> : null}
        </div>
        <span
          className={cn(
            "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line bg-[#f8f1e8] text-lg text-ink transition",
            open ? "rotate-45" : "",
          )}
        >
          +
        </span>
      </button>

      {open ? <div className="border-t border-line px-5 py-5 sm:px-6 sm:py-6">{children}</div> : null}
    </div>
  );
}
