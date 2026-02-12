export const formatDateForInput = (isoString: string) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  
  
  const offset = date.getTimezoneOffset() * 60000; 
  
  // Create a new date adjusted to local time
  const localDate = new Date(date.getTime() - offset);
  
  // Now slicing gives the correct local time
  return localDate.toISOString().slice(0, 16);
};