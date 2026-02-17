import React, { useState } from 'react';

export default function SectionCard({ title, content, icon }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(content);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <div className="section-card animate-slide-up">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    {icon && <span className="text-2xl">{icon}</span>}
                    <h2 className="text-xl font-bold text-gradient">{title}</h2>
                </div>
                <button
                    onClick={handleCopy}
                    className="px-3 py-1.5 text-sm bg-dark-800 hover:bg-dark-700 border border-dark-600 rounded-lg transition-all duration-200 flex items-center gap-2"
                    title="Copy to clipboard"
                >
                    {copied ? (
                        <>
                            <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-green-400">Copied!</span>
                        </>
                    ) : (
                        <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            <span>Copy</span>
                        </>
                    )}
                </button>
            </div>
            <div className="prose prose-invert prose-sm max-w-none">
                <pre className="whitespace-pre-wrap text-dark-200 leading-relaxed font-sans">
                    {content}
                </pre>
            </div>
        </div>
    );
}
