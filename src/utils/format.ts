// 45000 -> "45.000 đ"
export function formatPrice(value: number): string {
  const rounded = Math.round(value);
  const digits = String(Math.abs(rounded)).replace(
    /\B(?=(\d{3})+(?!\d))/g,
    '.',
  );
  return `${rounded < 0 ? '-' : ''}${digits} đ`;
}

const pad = (n: number) => String(n).padStart(2, '0');

// Date -> "hh:mm dd/mm/yyyy"
export function formatDateTime(date: Date): string {
  return `${pad(date.getHours())}:${pad(date.getMinutes())} ${pad(
    date.getDate(),
  )}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function onlyDigits(text: string): string {
  return text.replace(/\D/g, '');
}
