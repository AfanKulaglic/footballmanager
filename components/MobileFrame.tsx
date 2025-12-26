"use client";

import { ReactNode } from "react";

interface MobileFrameProps {
  children: ReactNode;
}

export default function MobileFrame({ children }: MobileFrameProps) {
  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {children}
    </div>
  );
}
