import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { ContextProvider } from "./Context/AppContext";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Bitcops Community: Connect, Chat & Discuss Ethical Hacking",
  description:
    "Join the Bitcops Community, a platform for ethical hackers to connect, chat, and discuss all things related to ethical hacking. Share knowledge, find collaborators, and stay ahead of the curve",
  keywords: [
    "ethical hacking",
    "bitcops",
    "ethical hacker community",
    "chat for ethical hackers",
    "cybersecurity",
    "infosec",
    "penetration testing",
    "vulnerability research",
    "bug bounty",
  ],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ContextProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />
            {children}
          </ThemeProvider>
        </ContextProvider>

        <Toaster />
      </body>
    </html>
  );
}
