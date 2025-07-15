import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "채팅 - JoinUs",
  description: "실시간 채팅",
};

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen bg-white flex flex-col">
      {children}
    </div>
  );
}