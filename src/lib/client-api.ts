'use client';
export async function authenticatedFetch(input: RequestInfo | URL, init?: RequestInit) {
  const response = await fetch(input, init);
  if (response.status === 401 && typeof window !== 'undefined') {
    const current = `${window.location.pathname}${window.location.search}`;
    const destination = `/signin?reason=session-expired&next=${encodeURIComponent(current)}`;
    window.location.assign(destination);
  }
  return response;
}

export async function responseError(response: Response, fallback: string) {
  const body = await response.json().catch(() => null);
  return typeof body?.error === 'string' ? body.error : fallback;
}
