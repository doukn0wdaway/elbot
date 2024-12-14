export const getCurrentTime = () => {
  return new Date()
    .toLocaleString("uk-UA", {
      timeZone: "Europe/Kyiv",
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
    .split(", ")
    .reverse()
    .join(" ");
};
