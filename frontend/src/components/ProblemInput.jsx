import React from 'react';

export default function ProblemInput({ value, onChange, disabled }) {
    const maxLength = 2000;
    const remaining = maxLength - value.length;

    return (
        <div className="w-full">
            <label htmlFor="problem-input" className="block text-lg font-semibold mb-3 text-dark-100">
                Describe Your Business Problem
            </label>
            <textarea
                id="problem-input"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                placeholder="Example: Customer complaints are handled manually via email causing delays and missed follow-ups..."
                className="input-field min-h-[200px] resize-y disabled:opacity-50 disabled:cursor-not-allowed"
                maxLength={maxLength}
            />
            <div className="flex justify-between items-center mt-2 text-sm">
                <p className="text-dark-400">
                    Be specific about the process, actors involved, and current pain points.
                </p>
                <p className={`font-mono ${remaining < 100 ? 'text-orange-400' : 'text-dark-400'}`}>
                    {remaining} characters remaining
                </p>
            </div>
        </div>
    );
}
