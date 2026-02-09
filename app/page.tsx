import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { apiFetch } from "./lib/api";

const cookieStore = await cookies();

export default async function Home() {
  // call backend to check auth
  
  const res = await apiFetch("/users/me", {
    headers: {
      Cookie: cookieStore.getAll().map(c => `${c.name}=${c.value}`).join("; ")
    },
    cache: "no-store"
  });

  if (!res.ok) {
    redirect("/login");
  }

  redirect("/tasks");
}
