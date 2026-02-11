/**
 * 带指数退避的 fetch 重试工具。
 */
export async function fetchWithRetry(
  url: string,
  options: RequestInit,
  maxRetries = 2,
): Promise<Response> {
  let lastError: Error | null = null;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(url, options);
      if (res.ok || res.status === 400 || res.status === 429) return res;
      // 5xx 或网络层可重试
      if (attempt < maxRetries) {
        console.log(`Retry ${attempt + 1}/${maxRetries}, status: ${res.status}`);
        await sleep(1000 * 2 ** attempt);
        continue;
      }
      return res;
    } catch (err) {
      lastError = err as Error;
      if (attempt < maxRetries) {
        console.log(`Retry ${attempt + 1}/${maxRetries}, error: ${(err as Error).message}`);
        await sleep(1000 * 2 ** attempt);
      }
    }
  }
  throw lastError ?? new Error("fetch failed after retries");
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
