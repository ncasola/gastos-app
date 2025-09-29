export function useCurrency() {
  return window.localStorage.getItem("currency") || "EUR";
}
