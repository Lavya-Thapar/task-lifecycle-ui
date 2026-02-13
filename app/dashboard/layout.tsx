
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import "./dashboard.css"; 
import LogoutButton from "../components/LogoutButton";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname(); 

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">

        <div className="nav-links">
          <Link
            href="/dashboard/tasks"
            className={pathname === "/dashboard/tasks" ? "active" : ""}
          >
            My Tasks
          </Link>

          <Link
            href="/dashboard/profile"
            className={pathname === "/dashboard/profile" ? "active" : ""}
          >
            My Profile
          </Link>
        </div>

        <LogoutButton/>
      </nav>

      <main className="dashboard-content">
        {children} 
      </main>
    </div>
  );
}