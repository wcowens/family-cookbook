import { redirect } from "next/navigation";
import { claimInvites } from "@/lib/books";
import { getAuthUser } from "@/lib/auth";

export default async function BooksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAuthUser();
  if (!user) {
    redirect("/login");
  }
  await claimInvites();
  return children;
}
