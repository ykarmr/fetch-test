export const dynamic = 'force-dynamic'

import { Suspense } from 'react';
import Link from 'next/link';

async function FetchData({ auth, label }: { auth: string; label?: string }) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/random-date`, {
        headers: {
            'Cookie': `auth-token=${auth}`,
        },
        next: { revalidate: 10 },
    });

    if (!res.ok) {
        throw new Error(`Other Page: Failed to fetch data: ${res.status}`);
    }

    const data = await res.json();

    return (
        <div className="p-4 border rounded-lg shadow-sm bg-green-50 dark:bg-green-900/20 mb-4 border-green-200">
            <h2 className="text-xl font-bold text-green-700 dark:text-green-400 mb-2">{label}</h2>
            <p className="text-sm mb-2"><strong>Cookie:</strong> auth-token={auth}</p>
            <div className="font-mono text-sm">
                <p>Date: {data.date}</p>
                <p>Random: {data.random}</p>
            </div>
        </div>
    );
}

export default function OtherPage() {
    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Other Page (Navigation Test)</h1>

            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400">
                <p>このページでも <code>revalidate: 10</code> を設定した同じ API を呼び出しています。</p>
                <p>トップページから遷移してきた際、キャッシュが引き継がれているか確認してください。</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <Suspense fallback={<div>Loading A...</div>}>
                    <FetchData auth="Bearer token-aaa" label="User A (Other Page)" />
                </Suspense>
                <Suspense fallback={<div>Loading B...</div>}>
                    <FetchData auth="Bearer token-bbb" label="User B (Other Page)" />
                </Suspense>
            </div>

            <Link
                href="/"
                className="text-blue-600 hover:underline flex items-center gap-2"
            >
                ← Back to Home
            </Link>
        </div>
    );
}
