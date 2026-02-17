'use client';

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // ログなどをここに記述
        console.error(error);
    }, [error]);

    return (
        <div className="p-8 max-w-4xl mx-auto text-center">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Something went wrong!</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {error.message || '予期せぬエラーが発生しました。'}
                </p>
                <button
                    onClick={() => reset()}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
                >
                    Try again
                </button>
            </div>
        </div>
    );
}
