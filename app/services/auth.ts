export const logoutUser = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/logout`,
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
