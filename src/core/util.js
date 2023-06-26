// Purte functions
export function capitalize(string) {
  if (typeof string !== "string" || !string) {
    return "";
  }

  return string[0].toUpperCase() + string.slice(1);
}
