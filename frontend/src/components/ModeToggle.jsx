import React from 'react';

export default function ModeToggle({ mode, onChange }) {
    return (
        <div className="flex items-center gap-4 bg-dark-800/50 rounded-xl p-2 border border-dark-700">
            <button
                onClick={() => onChange('executive')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${mode === 'executive'
                        ? 'bg-primary-600 text-white shadow-lg'
                        : 'text-dark-300 hover:text-dark-100'
                    }`}
            >
                <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>Executive Summary</span>
                </div>
            </button>

            <button
                onClick={() => onChange('full')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${mode === 'full'
                        ? 'bg-primary-600 text-white shadow-lg'
                        : 'text-dark-300 hover:text-dark-100'
                    }`}
            >
                <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Full Analysis</span>
                </div>
            </button>
        </div>
    );
}
