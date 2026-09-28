import type { Metadata } from "next";
import { Fraunces, Source_Sans_3 } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { getAuthUser } from "@/lib/auth";
import "./globals.css";

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
});

export const metadata: Metadata = {
  title: "Family Recipe Book",
  description: "Save and share family recipes, ingredients, kitchenware, and cooking steps.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const user = await getAuthUser();

  return (
    <html
      lang="en"
      className={`${sourceSans.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <SiteHeader email={user?.email ?? null} />
        <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
          {children}
        </main>
      </body>
    </html>
  );
}
