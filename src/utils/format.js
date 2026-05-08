export function formatDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("ko-KR");
}

export function formatDateTime(value) {
  if (!value) return "-";
  return new Date(value).toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}
