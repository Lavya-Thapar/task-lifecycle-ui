"use client";

import UserProfile from "@/app/components/UserProfile"; 
import { useState } from "react";
import { useEffect } from "react";

export default function ProfilePage() {

  const [userDetails, setUserDetails] = useState({
    fullname: "",
    username: "",
    email: "",
  });
  const [loading, setLoading] = useState(true);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/v1/users/fetch-details", {
        credentials: "include",
        cache: "no-store",
      });

      const data = await res.json();
      console.log("recieved details: ", data)
      if (res.ok) {
        setUserDetails(data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  return <UserProfile details={userDetails} loading={loading} />

}