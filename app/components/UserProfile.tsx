"use client";
import Link from "next/link";

type userDetails = {
    fullname: string;
    username: string;
    email: string;
};

type userDetailsProps = {
    details: userDetails;
    loading: boolean;
}
export default function UserProfile({ details, loading }: userDetailsProps) {

   return(
      <div className="user-profile-container">
        <h2>Hello {details.username}</h2>
        {loading ? (
          <p>Loading user details...</p>
        ) : (
          <div>
            <p>Full Name: {details.fullname}</p>
            <p>Email: {details.email}</p>
            <Link href="/dashboard/tasks">
              View My Tasks →
            </Link>
          </div>
        )}
      </div>
   )
}