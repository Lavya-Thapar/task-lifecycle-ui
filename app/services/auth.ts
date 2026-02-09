export const logoutUser = async () => {
  const res = await fetch(
    `/api/v1/users/logout`,
    {
      method: "POST",
      credentials: "include",
    }
  );

  if (!res.ok) {
    alert("could not logout!");
  }

  return true;
};
