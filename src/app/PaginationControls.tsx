// components/PaginationControls.tsx
"use client";

import { useSearchParams, useRouter } from "next/navigation";

export default function PaginationControls({
    currentPage,
    totalPages,
    limit,
    totalMessages,
}: {
    currentPage: number;
    totalPages: number;
    limit: number;
    totalMessages: number;
}) {
    const searchParams = useSearchParams();
    const router = useRouter();

    const createQueryString = (name: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set(name, value);
        return params.toString();
    };

    const startMessage = (currentPage - 1) * limit + 1;
    const endMessage = Math.min(currentPage * limit, totalMessages);

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
            <div className="text-sm text-[var(--secondary)]">
                SHOWING {startMessage}-{endMessage} OF {totalMessages}
            </div>

            <div className="flex gap-2">
                <button
                    type="button"
                    onClick={() => router.push(`?${createQueryString('page', String(Math.max(1, currentPage - 1)))}`, { scroll: false })}
                    className={`retro-button px-3 py-1 text-sm ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    aria-disabled={currentPage === 1}
                    disabled={currentPage === 1}
                >
                    PREV
                </button>

                <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const pageNum = i + 1;
                        const isActive = currentPage === pageNum;
                        return (
                            <button
                                type="button"
                                key={pageNum}
                                onClick={() => router.push(`?${createQueryString('page', String(pageNum))}`, { scroll: false })}
                                className={`retro-button px-3 py-1 text-sm min-w-[2.5rem] text-center ${isActive
                                    ? 'bg-[var(--foreground)] text-[var(--background)] border-[var(--foreground)] shadow-none'
                                    : ''
                                    }`}
                                style={{
                                    backgroundColor: isActive ? 'var(--foreground)' : '',
                                    color: isActive ? 'var(--background)' : '',
                                    borderColor: isActive ? 'var(--accent)' : '',
                                    transform: isActive ? 'translate(0, 0)' : '',
                                }}
                            >
                                {pageNum}
                            </button>
                        );
                    })}

                    {totalPages > 5 && (
                        <span className="px-2 text-[var(--secondary)]">...</span>
                    )}
                </div>

                <button
                    type="button"
                    onClick={() => router.push(`?${createQueryString('page', String(Math.min(totalPages, currentPage + 1)))}`, { scroll: false })}
                    className={`retro-button px-3 py-1 text-sm ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    aria-disabled={currentPage === totalPages}
                    disabled={currentPage === totalPages}
                >
                    NEXT
                </button>
            </div>
        </div>
    );
}