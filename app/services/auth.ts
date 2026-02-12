export const logoutUser = async () => {

  const res = await fetch(
    `/api/v1/users/logout`,
    {
      method: "POST",
      credentials: "include",
    }
  );

  const data = await res.json()
  if (!res.ok) {
    // Show an error toast if the logout failed
    //alert(data.message || "Logout failed");
    return false;
    
  }

  // Show a success toast if the logout was successful
  //alert(data.message || "logged out successfully!");

  return true;
};

