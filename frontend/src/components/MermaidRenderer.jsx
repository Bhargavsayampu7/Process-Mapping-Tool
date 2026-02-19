import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import html2canvas from 'html2canvas';

// Initialize mermaid
mermaid.initialize({
    startOnLoad: false,
    theme: 'dark',
    themeVariables: {
        primaryColor: '#0ea5e9',
        primaryTextColor: '#f1f5f9',
        primaryBorderColor: '#0284c7',
        lineColor: '#64748b',
        secondaryColor: '#1e293b',
        tertiaryColor: '#334155',
        background: '#0f172a',
        mainBkg: '#1e293b',
        secondBkg: '#334155',
        textColor: '#f1f5f9',
        fontSize: '16px',
    },
    flowchart: {
        htmlLabels: true,
        curve: 'basis',
    },
});

export default function MermaidRenderer({ diagram, diagramType = 'flowchart' }) {
    const mermaidRef = useRef(null);
    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [selectedType, setSelectedType] = useState(diagramType);

    useEffect(() => {
        const sanitizeDiagram = (raw) => {
            return raw
                .replace(/```mermaid\s*/gi, '')
                .replace(/```\s*/g, '')
                .replace(/^mermaid\s*\n/i, '')
                .trim();
        };

        const renderDiagram = async () => {
            if (!diagram || !mermaidRef.current) return;

            try {
                setError(null);
                mermaidRef.current.innerHTML = '';

                const id = `mermaid-${Date.now()}`;
                const cleanDiagram = sanitizeDiagram(diagram);
                const { svg } = await mermaid.render(id, cleanDiagram);
                mermaidRef.current.innerHTML = svg;
            } catch (err) {
                console.error('Mermaid rendering error:', err);
                setError('Failed to render diagram. The Mermaid syntax may be invalid.');
            }
        };

        renderDiagram();
    }, [diagram]);

    const handleCopyCode = async () => {
        try {
            await navigator.clipboard.writeText(diagram);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handleDownloadCode = () => {
        const blob = new Blob([diagram], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `process-diagram-${Date.now()}.mmd`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const handleExportPNG = async () => {
        if (!mermaidRef.current) return;

        try {
            setExporting(true);
            const canvas = await html2canvas(mermaidRef.current, {
                backgroundColor: '#0f172a',
                scale: 2,
            });

            const link = document.createElement('a');
            link.download = `process-diagram-${Date.now()}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (err) {
            console.error('Failed to export:', err);
            alert('Failed to export diagram as PNG');
        } finally {
            setExporting(false);
        }
    };

    if (error) {
        return (
            <div className="section-card animate-slide-up">
                <h2 className="text-xl font-bold text-gradient mb-4">📊 Process Diagram</h2>
                <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 text-red-200">
                    <p className="font-semibold">Diagram Rendering Error</p>
                    <p className="text-sm mt-1">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="section-card animate-slide-up">
            <div className="flex items-start justify-between mb-4 flex-wrap gap-4">
                <h2 className="text-xl font-bold text-gradient">📊 Process Diagram</h2>

                <div className="flex gap-2 flex-wrap">
                    <button
                        onClick={handleCopyCode}
                        className="px-3 py-1.5 text-sm bg-dark-800 hover:bg-dark-700 border border-dark-600 rounded-lg transition-all duration-200 flex items-center gap-2"
                        title="Copy Mermaid code"
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
                                <span>Copy Code</span>
                            </>
                        )}
                    </button>

                    <button
                        onClick={handleDownloadCode}
                        className="px-3 py-1.5 text-sm bg-dark-800 hover:bg-dark-700 border border-dark-600 rounded-lg transition-all duration-200 flex items-center gap-2"
                        title="Download Mermaid file"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>Download .mmd</span>
                    </button>

                    <button
                        onClick={handleExportPNG}
                        disabled={exporting}
                        className="px-3 py-1.5 text-sm bg-primary-600 hover:bg-primary-700 border border-primary-500 rounded-lg transition-all duration-200 flex items-center gap-2 disabled:opacity-50"
                        title="Export as PNG"
                    >
                        {exporting ? (
                            <>
                                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Exporting...</span>
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                <span>Export PNG</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            <div
                ref={mermaidRef}
                className="bg-dark-900/30 rounded-lg p-6 overflow-x-auto flex justify-center items-center min-h-[300px]"
            />
        </div>
    );
}
