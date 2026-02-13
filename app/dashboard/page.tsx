import { redirect } from "next/navigation";

export default function DashboardRoot() {
  // Server-side redirect
  redirect("/dashboard/tasks");
}