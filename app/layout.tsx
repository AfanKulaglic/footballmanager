import type { Metadata } from "next";
import "./globals.css";
import AuthGuard from "@/components/AuthGuard";
import BottomNavWrapper from "@/components/BottomNavWrapper";

export const metadata: Metadata = {
  title: "Football Manager",
  description: "Football Manager Game",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-bg flex flex-col">
        <AuthGuard>
          <main className="flex-1 overflow-y-auto pb-20">
            {children}
          </main>
          <BottomNavWrapper />
        </AuthGuard>
      </body>
    </html>
  );
}
