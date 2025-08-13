"use client";
import React, { useState } from "react";
import { addMessage } from "./controllers/messageController";

function validateEmail(email: string) {
    return /^([\w-.]+)@([\w-]+)\.([\w]{2,})$/.test(email);
}

export default function MessageForm({ onMessageSent }: { onMessageSent?: () => void }) {
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setToast(null);
        if (!name.trim()) {
            setError("Name is required.");
            setToast({ type: "error", message: "Name is required." });
            return;
        }
        if (!validateEmail(email)) {
            setError("Email format is invalid.");
            setToast({ type: "error", message: "Email format is invalid." });
            return;
        }
        if (!message.trim()) {
            setError("Message is required.");
            setToast({ type: "error", message: "Message is required." });
            return;
        }
        if (message.length > 500) {
            setError("Message must be at most 500 characters.");
            setToast({ type: "error", message: "Message must be at most 500 characters." });
            return;
        }
        setLoading(true);
        try {
            const res = await fetch("/api/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, message, email }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to send message.");
            setName("");
            setMessage("");
            setEmail("");
            setToast({ type: "success", message: "Message sent successfully!" });
            if (onMessageSent) onMessageSent();
        } catch (err: any) {
            setError(err.message);
            setToast({ type: "error", message: err.message });
        } finally {
            setLoading(false);
        }
    }

    React.useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    return (
        <div className="retro-box p-6 mb-8">
            <h3 className="text-xl font-bold mb-4">LEAVE A MESSAGE</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-bold mb-1">NAME *</label>
                    <input
                        type="text"
                        placeholder="Your name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                        className="retro-input w-full"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold mb-1">EMAIL *</label>
                    <input
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        required
                        onChange={e => setEmail(e.target.value)}
                        className="retro-input w-full"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold mb-1">MESSAGE *</label>
                    <textarea
                        placeholder="Type your message here..."
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        required
                        maxLength={500}
                        rows={4}
                        className="retro-input w-full"
                    />
                    <p className="text-xs text-[var(--secondary)] mt-1">Max 500 characters</p>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="retro-button w-full py-3"
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                            SENDING...
                        </span>
                    ) : (
                        "SUBMIT MESSAGE"
                    )}
                </button>

                {error && (
                    <div className="text-red-600 font-mono text-sm mt-2 p-2 bg-red-100 border border-red-600">
                        ERROR: {error}
                    </div>
                )}
            </form>

            {toast && (
                <div
                    className={`fixed top-6 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded shadow-lg z-50 font-bold text-center
            ${toast.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}
                    style={{ minWidth: 220 }}
                    onClick={() => setToast(null)}
                >
                    {toast.message}
                </div>
            )}
        </div>
    );
}