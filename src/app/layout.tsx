import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Adjacent — a better habit that still feels like you",
  description: "Taste-led substitutions grounded in Qloo cultural affinities.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
