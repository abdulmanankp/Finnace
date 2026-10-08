export function formatCurrency(amount: number, currency = 'Rs'): string {
  const isNegative = amount < 0;
  const abs = Math.abs(amount);
  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(abs);

  return `${isNegative ? '-' : ''}${currency} ${formatted}`;
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  if (dateStr === today) return 'Today';
  if (dateStr === yesterday) return 'Yesterday';

  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}
