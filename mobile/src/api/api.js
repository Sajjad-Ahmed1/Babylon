/**
 * api.js — تكامل واجهة برمجة تطبيقات خارجية (External API)
 *
 * يجلب سجل "مستجدات المنصة" مباشرة من GitHub REST API
 * (https://docs.github.com/en/rest/commits/commits)
 * كل تحديث يُنشر على المنصة يظهر للمواطن مع التاريخ والناشر.
 */
const API_BASE = 'https://api.github.com';
const OWNER = 'Sajjad-Ahmed1';
const REPO = 'Babylon';

/** مهلة للطلب حتى لا ينتظر المستخدم بلا نهاية */
function withTimeout(promise, ms = 10000) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), ms)),
  ]);
}

/**
 * جلب آخر التحديثات من الـ API وتحويلها لشكل يناسب الواجهة
 * @returns {Promise<Array<{id:string,title:string,author:string,date:string,url:string}>>}
 */
export async function fetchPlatformUpdates(limit = 15) {
  const url = `${API_BASE}/repos/${OWNER}/${REPO}/commits?per_page=${limit}`;
  const res = await withTimeout(
    fetch(url, { headers: { Accept: 'application/vnd.github+json' } })
  );
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  const json = await res.json();
  return json.map((item) => ({
    id: item.sha,
    shortId: item.sha.slice(0, 7),
    title: item.commit.message.split('\n')[0],
    author: item.commit.author?.name ?? 'غير معروف',
    date: item.commit.author?.date,
    url: item.html_url,
  }));
}

/** تنسيق التاريخ بالعربية */
export function formatDate(iso) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleString('ar-IQ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}
