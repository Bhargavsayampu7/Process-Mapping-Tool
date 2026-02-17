import React from 'react';

export default function KPIsCard({ kpis }) {
    if (!kpis) return null;

    // Parse KPIs from text
    const kpiLines = kpis.split('\n').filter(line => line.trim().length > 0);

    return (
        <div className="section-card animate-slide-up">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <span className="text-2xl">📊</span>
                    <h2 className="text-xl font-bold text-gradient">8. Key Performance Indicators (KPIs)</h2>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {kpiLines.map((kpi, index) => {
                    // Parse format: "KPI Name - Target/Metric - Description"
                    const parts = kpi.split(' - ');
                    const name = parts[0]?.trim() || '';
                    const target = parts[1]?.trim() || '';
                    const description = parts[2]?.trim() || '';

                    if (!name) return null;

                    return (
                        <div
                            key={index}
                            className="bg-dark-800/30 border border-dark-700 rounded-lg p-4 hover:border-primary-500/30 transition-all duration-200"
                        >
                            <h3 className="font-semibold text-primary-400 mb-2">{name}</h3>
                            {target && (
                                <div className="text-lg font-bold text-dark-100 mb-1">{target}</div>
                            )}
                            {description && (
                                <p className="text-sm text-dark-300">{description}</p>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
