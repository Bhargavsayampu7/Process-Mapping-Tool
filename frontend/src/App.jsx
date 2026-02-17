import React, { useState } from 'react';
import ProblemInput from './components/ProblemInput';
import GenerateButton from './components/GenerateButton';
import Loader from './components/Loader';
import SectionCard from './components/SectionCard';
import MermaidRenderer from './components/MermaidRenderer';
import ModeToggle from './components/ModeToggle';
import KPIsCard from './components/KPIsCard';

function App() {
    const [problem, setProblem] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [viewMode, setViewMode] = useState('executive'); // 'executive' or 'full'

    const handleGenerate = async () => {
        if (!problem.trim()) {
            alert('Please enter a business problem description');
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ problem }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to generate process mapping');
            }

            setResult(data.data);
        } catch (err) {
            console.error('Error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCopyAll = async () => {
        if (!result) return;

        const fullAnalysis = `
AI PROCESS MAPPING ANALYSIS
====================================

1. PROCESS OVERVIEW
${result.processOverview}

====================================

2. ACTORS / ROLES
${result.actors}

====================================

3. AS-IS WORKFLOW
${result.asIsWorkflow}

====================================

4. TO-BE WORKFLOW
${result.toBeWorkflow}

====================================

5. MERMAID DIAGRAM
${result.mermaidDiagram}

====================================

6. KEY BOTTLENECKS
${result.bottlenecks}

====================================

7. OPTIMIZATION RECOMMENDATIONS
${result.recommendations}

====================================

8. KEY PERFORMANCE INDICATORS (KPIs)
${result.kpis}
    `.trim();

        try {
            await navigator.clipboard.writeText(fullAnalysis);
            alert('Full analysis copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy:', err);
            alert('Failed to copy to clipboard');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950">
            {/* Header */}
            <header className="border-b border-dark-800 bg-dark-900/50 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gradient">AI Process Mapping Tool</h1>
                            <p className="text-dark-400 mt-1">Transform business problems into actionable workflows</p>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-dark-400">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            <span>Powered by Gemini AI</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-12">
                {/* Input Section */}
                <div className="glass-card p-8 mb-8 animate-fade-in">
                    <ProblemInput
                        value={problem}
                        onChange={setProblem}
                        disabled={loading}
                    />

                    <div className="mt-6 flex justify-center">
                        <GenerateButton
                            onClick={handleGenerate}
                            loading={loading}
                            disabled={!problem.trim()}
                        />
                    </div>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="glass-card p-6 mb-8 border-red-500/50 bg-red-900/20 animate-fade-in">
                        <div className="flex items-start gap-3">
                            <svg className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div>
                                <h3 className="font-semibold text-red-200">Error</h3>
                                <p className="text-red-300 mt-1">{error}</p>
                                <p className="text-sm text-red-400 mt-2">
                                    Please check your Gemini API key in the backend .env file and try again.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {loading && <Loader />}

                {/* Results */}
                {result && !loading && (
                    <div className="space-y-6">
                        {/* Mode Toggle & Copy Button */}
                        <div className="flex items-center justify-between gap-4 flex-wrap">
                            <ModeToggle mode={viewMode} onChange={setViewMode} />

                            <button
                                onClick={handleCopyAll}
                                className="px-6 py-3 bg-dark-800 hover:bg-dark-700 border border-dark-600 rounded-xl transition-all duration-200 flex items-center gap-2 font-semibold"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Copy Full Analysis
                            </button>
                        </div>

                        {/* Executive Summary Mode */}
                        {viewMode === 'executive' && (
                            <div className="space-y-6">
                                <div className="glass-card p-6 border-primary-500/30">
                                    <h2 className="text-2xl font-bold text-gradient mb-4">⚡ Executive Summary</h2>
                                    <p className="text-dark-300 mb-4">Quick, actionable insights at a glance</p>
                                </div>

                                {/* Problem Summary - First 3 lines of Process Overview */}
                                <SectionCard
                                    title="Problem Statement"
                                    content={result.processOverview.split('\n').slice(0, 3).join('\n')}
                                    icon="🎯"
                                />

                                <SectionCard
                                    title="Recommended Solution (TO-BE Workflow)"
                                    content={result.toBeWorkflow}
                                    icon="🟢"
                                />

                                <MermaidRenderer diagram={result.mermaidDiagram} />

                                {result.kpis && <KPIsCard kpis={result.kpis} />}
                            </div>
                        )}

                        {/* Full Analysis Mode */}
                        {viewMode === 'full' && (
                            <div className="space-y-6">
                                <div className="glass-card p-6 border-primary-500/30">
                                    <h2 className="text-2xl font-bold text-gradient mb-4">📊 Full Analysis</h2>
                                    <p className="text-dark-300 mb-4">Comprehensive process mapping with detailed insights</p>
                                </div>

                                <SectionCard
                                    title="1. Process Overview"
                                    content={result.processOverview}
                                    icon="📋"
                                />

                                <SectionCard
                                    title="2. Actors / Roles"
                                    content={result.actors}
                                    icon="👥"
                                />

                                <SectionCard
                                    title="3. AS-IS Workflow (Current State)"
                                    content={result.asIsWorkflow}
                                    icon="🔴"
                                />

                                <SectionCard
                                    title="4. TO-BE Workflow (Improved State)"
                                    content={result.toBeWorkflow}
                                    icon="🟢"
                                />

                                <MermaidRenderer diagram={result.mermaidDiagram} />

                                <SectionCard
                                    title="6. Key Bottlenecks"
                                    content={result.bottlenecks}
                                    icon="⚠️"
                                />

                                <SectionCard
                                    title="7. Optimization Recommendations"
                                    content={result.recommendations}
                                    icon="💡"
                                />

                                {result.kpis && <KPIsCard kpis={result.kpis} />}
                            </div>
                        )}
                    </div>
                )}

                {/* Empty State */}
                {!result && !loading && !error && (
                    <div className="text-center py-16 animate-fade-in">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-500/10 rounded-full mb-6">
                            <svg className="w-10 h-10 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-dark-200 mb-3">Ready to Map Your Process</h2>
                        <p className="text-dark-400 max-w-md mx-auto">
                            Describe your business problem above and let AI generate a comprehensive process analysis with workflows, diagrams, and optimization recommendations.
                        </p>
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="border-t border-dark-800 mt-16">
                <div className="max-w-7xl mx-auto px-6 py-8 text-center text-dark-400 text-sm">
                    <p>Built for Business Analysts • Powered by Google Gemini AI</p>
                    <p className="mt-2">Transform operational problems into actionable insights</p>
                </div>
            </footer>
        </div>
    );
}

export default App;
