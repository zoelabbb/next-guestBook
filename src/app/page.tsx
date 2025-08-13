"use client"
import MessageForm from "./MessageForm";
import PaginationControls from "./PaginationControls";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

function escapeHTML(str: string) {
  return str.replace(/[&<>'"`]/g, (tag) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;',
    '`': '&#96;',
  }[tag] ?? tag));
}

function maskEmail(email: string) {
  if (!email) return "";
  const [user, domain] = email.split("@");
  if (!user || !domain) return email;
  return user[0] + "***@" + domain;
}

export default function GuestBookPage() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 5);

  const [messages, setMessages] = useState<any[]>([]);
  const [totalMessages, setTotalMessages] = useState(0);
  const [loading, setLoading] = useState(true);

  async function loadMessages() {
    setLoading(true);
    const res = await fetch("/api/messages?page=" + page + "&limit=" + limit);
    const data = await res.json();
    setMessages(data.messages || []);
    setTotalMessages(data.totalMessages || 0);
    setLoading(false);
  }

  useEffect(() => {
    loadMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit]);

  return (
    <main className="max-w-2xl mx-auto my-8 px-4">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-2 underline decoration-wavy decoration-[var(--accent)]">
          GUEST BOOK
        </h1>
        <p className="text-[var(--secondary)]">/// SIGN IN WITH YOUR MESSAGE ///</p>
      </header>

      <MessageForm onMessageSent={loadMessages} />

      <section className="mt-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold pb-2 border-b border-[var(--secondary)]">
            VISITOR MESSAGES
          </h2>
          <div className="text-sm text-[var(--secondary)]">
            {totalMessages} MESSAGES TOTAL
          </div>
        </div>

        {loading ? (
          <div className="retro-box p-8 text-center bg-[var(--background)] text-[var(--secondary)]">
            <p>LOADING MESSAGES...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="retro-box p-8 text-center bg-[var(--background)] text-[var(--secondary)]">
            <p>NO MESSAGES FOUND.</p>
            <p className="mt-2">BE THE FIRST TO LEAVE YOUR MARK!</p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 mb-8">
              {messages.map((msg: any) => (
                <article
                  key={msg.id}
                  className="retro-box p-4 bg-[var(--background)] hover:bg-[var(--highlight)] transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-8 h-8 border-2 border-[var(--foreground)] bg-[var(--accent)] text-[var(--background)] font-bold flex-shrink-0">
                      {escapeHTML(msg.name.charAt(0).toUpperCase())}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-baseline gap-2">
                        <h3 className="font-bold text-sm truncate">
                          {escapeHTML(msg.name.toUpperCase())}
                        </h3>
                        {msg.email && (
                          <a
                            href={`mailto:${escapeHTML(msg.email)}`}
                            className="text-xs text-[var(--accent)] hover:underline truncate"
                          >
                            {maskEmail(msg.email)}
                          </a>
                        )}
                      </div>
                      <p className="text-sm mt-1 whitespace-pre-line break-words">
                        {escapeHTML(msg.message)}
                      </p>
                      <time
                        dateTime={msg.createdAt}
                        className="text-xs text-[var(--secondary)] block mt-2"
                      >
                        {new Date(msg.createdAt).toLocaleString().toUpperCase()}
                      </time>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <PaginationControls
              currentPage={page}
              totalPages={Math.ceil(totalMessages / limit)}
              limit={limit}
              totalMessages={totalMessages}
            />
          </>
        )}
      </section>
    </main>
  );
}