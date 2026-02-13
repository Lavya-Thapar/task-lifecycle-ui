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
    
    return false;
    
  }

  return true;
};

