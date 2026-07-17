import { DashboardContent } from "@/components/dashboard-content";
import { getSession } from "@/lib/auth/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getSession();
  // Redirect to login if session data is missing
  if (!session?.data?.user) {
    redirect("/auth/sign-in"); 
  }

  return <DashboardContent userId={session.data.user.id} />;
}
