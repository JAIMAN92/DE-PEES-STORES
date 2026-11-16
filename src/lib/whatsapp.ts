/**
 * Helper to ensure WhatsApp URLs format any Nigerian phone number into the correct wa.me link.
 * Handles inputs like '08100809719', '+2348100809719', '2348100809719', etc.
 */
export function getWhatsAppUrl(phoneOrWa?: string, defaultMessage: string = ''): string {
  if (!phoneOrWa) return '#';
  let clean = phoneOrWa.replace(/[^0-9]/g, '');
  if (!clean) return '#';

  if (clean.startsWith('0')) {
    clean = '234' + clean.slice(1);
  } else if (!clean.startsWith('234') && clean.length === 10) {
    clean = '234' + clean;
  }

  const query = defaultMessage ? `?text=${encodeURIComponent(defaultMessage)}` : '';
  return `https://wa.me/${clean}${query}`;
}

export function isValidWhatsAppNumber(number?: string): boolean {
  if (!number) return false;
  const digits = number.replace(/[^0-9]/g, '');
  if (digits.length < 10) return false;
  if (digits.includes('8031234567')) return false;
  return true;
}
