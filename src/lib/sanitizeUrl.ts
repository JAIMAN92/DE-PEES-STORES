/**
 * Validates external URLs to prevent javascript:/data: XSS injection in href/src attributes.
 */
export function sanitizeExternalUrl(rawUrl?: string, allowRelative = false): string {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  const trimmed = rawUrl.trim();
  if (!trimmed) return '';

  if (allowRelative && trimmed.startsWith('/') && !trimmed.startsWith('//')) {
    return trimmed;
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
      return parsed.toString();
    }
    return '';
  } catch {
    return '';
  }
}

export function sanitizeMediaUrl(rawUrl?: string): string {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  const trimmed = rawUrl.trim();
  if (!trimmed) return '';

  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) {
    return trimmed;
  }

  if (/^data:(image\/(png|jpeg|jpg|webp|gif)|video\/(mp4|webm|quicktime));base64,/i.test(trimmed)) {
    return trimmed;
  }

  return sanitizeExternalUrl(trimmed, false);
}
