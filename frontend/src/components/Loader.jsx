import React from 'react';

export default function Loader() {
    return (
        <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
            <div className="relative">
                <div className="w-20 h-20 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-b-primary-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            </div>
            <p className="mt-6 text-lg font-medium text-dark-200 animate-pulse-slow">
                AI is analyzing your process...
            </p>
            <p className="mt-2 text-sm text-dark-400">
                This may take 10-20 seconds
            </p>
        </div>
    );
}
