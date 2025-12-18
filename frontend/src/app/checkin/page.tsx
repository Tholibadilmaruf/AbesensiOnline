"use client";

import React, { useState } from "react";

export default function CheckInPage() {
    const [note, setNote] = useState("");
    const [message, setMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Minimal check-in UI that posts to the app-router proxy.
    // The server-side proxy injects a temporary hardcoded token (see route.js).
    async function doCheckIn() {
        setLoading(true);
        setMessage(null);
        try {
            const res = await fetch("/api/attendance/check-in", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ note }),
            });
            const body = await res.json();
            if (res.status === 201) {
                setMessage("Check-in successful: " + (body.id || JSON.stringify(body)));
            } else {
                setMessage(body.message || body.error || "Check-in failed");
            }
        } catch (err) {
            setMessage("Network error");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="p-6">
            <h1 className="text-xl font-bold mb-4">Check In (Minimal)</h1>

            <div className="mb-4">
                <label className="block text-sm">Note</label>
                <input value={note} onChange={(e) => setNote(e.target.value)} className="border p-2 w-full" />
            </div>

            <div className="flex gap-2 mb-4">
                <button onClick={doCheckIn} disabled={loading} className="bg-green-600 text-white px-4 py-2 rounded">Check In</button>
            </div>

            {message && <div className="mt-4 p-3 border rounded">{message}</div>}

            <div className="mt-4 text-xs text-gray-600">Note: using a temporary hardcoded token on the server proxy. Replace in `route.js` with a valid token.</div>
        </div>
    );
}
