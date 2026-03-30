import { ReactNode } from "react";

type PanelProps = {
  children: ReactNode;
  className?: string;
};

export function Panel({ children, className }: PanelProps) {
  return <div className={`glass-card ${className ?? ""}`.trim()}>{children}</div>;
}
