export const dynamic = 'force-dynamic'

import { Suspense } from 'react';

async function FetchData({ auth, label }: { auth: string; label?: string }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/random-date`, {
    headers: {
      'Authorization': auth,
    },
    next: { revalidate: 10 }, // 10秒間キャッシュ
  });

  const data = await res.json();

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white dark:bg-gray-800 mb-4 transition-all hover:border-blue-500">
      <div className="flex justify-between items-start mb-2">
        <h2 className="text-xl font-bold italic text-blue-600 dark:text-blue-400">{label}</h2>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
        <strong>Auth:</strong> <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded text-xs">{auth}</code>
      </p>
      <div className="space-y-1">
        <p className="text-xs text-gray-500">Random Date from API:</p>
        <p className="font-mono text-sm break-all">{data.date}</p>
        <p className="text-xs text-gray-500 mt-2">Random Number:</p>
        <p className="font-semibold text-lg">{data.random}</p>
      </div>
    </div>
  );
}

export default function RevalidateTestPage() {
  const currentTime = new Date().toISOString();

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-6 text-gray-900 dark:text-white">
        Fetch Revalidate & Auth Header Verification
      </h1>

      <div className="mb-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 text-yellow-800 dark:text-yellow-200">
        <p>このページは 10 秒の <code>revalidate</code> を設定した fetch を行います。</p>
        <p>異なる <code>Authorization</code> ヘッダーを持つリクエストがそれぞれ独立してキャッシュされるかを確認します。</p>
        <p className="mt-2 text-sm italic">Page Rendered at: {currentTime}</p>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">User A Groups (Shared Auth)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Suspense fallback={<div>Loading A1...</div>}>
              <FetchData auth="Bearer token-aaa" label="Component A1" />
            </Suspense>

            <Suspense fallback={<div>Loading A2...</div>}>
              <FetchData auth="Bearer token-aaa" label="Component A2 (Duplicate)" />
            </Suspense>
          </div>
          <p className="mt-2 text-sm text-gray-500 italic">
            A1 と A2 は同じエンドポイントと認証ヘッダーを使用しています。Next.js のリクエストデデュプリケーションにより、同じ値が表示されるはずです。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">User B Groups (Shared Auth)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Suspense fallback={<div>Loading B1...</div>}>
              <FetchData auth="Bearer token-bbb" label="Component B1" />
            </Suspense>

            <Suspense fallback={<div>Loading B2...</div>}>
              <FetchData auth="Bearer token-bbb" label="Component B2 (Duplicate)" />
            </Suspense>
          </div>
          <p className="mt-2 text-sm text-gray-500 italic">
            B1 と B2 も同様に同じ値が表示されますが、User A とは異なる（独立してキャッシュされる）はずです。
          </p>
        </section>
      </div>

      <div className="mt-8 text-sm text-gray-500">
        <p>検証手順:</p>
        <ol className="list-decimal list-inside ml-2">
          <li>ページをリロードする。</li>
          <li>User-A と User-B の日付が異なることを確認する。</li>
          <li>10秒以内に再度リロードし、日付が変わらない（キャッシュされている）ことを確認する。</li>
          <li>10秒経過後にリロードし、日付が更新されることを確認する。</li>
        </ol>
      </div>
    </div>
  );
}
