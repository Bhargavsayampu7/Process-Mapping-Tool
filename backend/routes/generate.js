import express from 'express';
import OpenAI from 'openai';

const router = express.Router();

const SYSTEM_PROMPT = `You are a Senior Business Analyst and Process Architect.

Your job is to convert messy business problems into clear operational workflows.

When given a problem description, you must generate:

1. PROCESS OVERVIEW
2. ACTORS / ROLES
3. CURRENT STATE WORKFLOW (AS-IS)
4. IMPROVED WORKFLOW (TO-BE)
5. MERMAID FLOWCHART CODE
6. KEY BOTTLENECKS
7. OPTIMIZATION RECOMMENDATIONS
8. KEY PERFORMANCE INDICATORS (KPIs)

CRITICAL OUTPUT RULES:

- Write in professional business language.
- No emojis.
- No marketing tone.
- Do NOT use markdown formatting (no **, *, #, etc.)
- Write in plain text only.
- Assume this will be reviewed by enterprise stakeholders.
- Think MVP + realistic operations.
- Focus on clarity, not verbosity.

MERMAID RULES (VERY IMPORTANT):

- Output ONE valid Mermaid flowchart.
- Use flowchart TD
- Do NOT use special characters inside node labels.
- Keep labels short.
- Every node must connect.
- Use this structure:

flowchart TD
A[Start] --> B[Step]
B --> C[Decision]
C -->|Yes| D[Action]
C -->|No| E[Action]
D --> F[End]
E --> F

DO NOT wrap Mermaid in markdown code blocks.
DO NOT add explanations inside Mermaid block.

SECTIONS FORMAT:

====================================

1. PROCESS OVERVIEW
Write 2-3 paragraphs explaining the business process in plain text.

====================================

2. ACTORS / ROLES
List each role with their responsibility. One per line.
Format: Role Name - Responsibility

====================================

3. AS-IS WORKFLOW
Numbered steps of current process. Keep it concise and bulleted.
Use simple numbered list format.

====================================

4. TO-BE WORKFLOW
Numbered steps of optimized process. Keep it concise and bulleted.
Use simple numbered list format.

====================================

5. MERMAID DIAGRAM
Only Mermaid code here.

====================================

6. KEY BOTTLENECKS
List each bottleneck with business impact.
Format: Bottleneck Name - Business Impact

====================================

7. OPTIMIZATION RECOMMENDATIONS
List each recommendation with expected outcome.
Format: Recommendation - Expected Outcome

====================================

8. KEY PERFORMANCE INDICATORS (KPIs)
Provide 4-6 measurable KPIs relevant to this process.
Format: KPI Name - Target/Metric - Description

Examples:
First Response Time - Under 2 hours - Time from complaint receipt to first agent response
Resolution Time - 24-48 hours - Average time to fully resolve customer issues
Escalation Rate - Under 15% - Percentage of tickets requiring specialist intervention
Ticket Backlog - Under 20 tickets - Number of unresolved tickets at end of day
Customer Satisfaction - Above 85% - CSAT score from post-resolution surveys
Agent Utilization - 70-80% - Percentage of agent time spent on active tickets

CRITICAL:
You MUST generate ALL sections including KPIs.
Think like a real Business Analyst.
Use real-world operational logic.
Avoid generic answers.
DO NOT USE ANY MARKDOWN FORMATTING.`;

// Markdown cleanup function
function cleanMarkdown(text) {
    if (!text) return '';

    return text
        .replace(/\*\*/g, '')           // Remove bold **
        .replace(/\*/g, '')             // Remove italic *
        .replace(/#{1,6}\s?/g, '')      // Remove heading markers
        .replace(/`{1,3}/g, '')         // Remove code markers
        .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')  // Remove links, keep text
        .trim();
}

router.post('/generate', async (req, res) => {
    try {
        const { problem } = req.body;

        if (!problem || problem.trim().length === 0) {
            return res.status(400).json({ error: 'Problem description is required' });
        }

        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: 'OpenAI API key not configured. Please check your OPENAI_API_KEY environment variable.' });
        }

        const openai = new OpenAI({ apiKey });

        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            max_tokens: 2000,
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'user', content: `BUSINESS PROBLEM:\n${problem}` }
            ]
        });

        const rawText = completion.choices[0]?.message?.content || '';

        // Clean markdown from the entire response
        const cleanedText = cleanMarkdown(rawText);

        // Parse the response into sections
        const sections = parseResponse(cleanedText);

        res.json({ success: true, data: sections });
    } catch (error) {
        console.error('Error generating process:', error);
        res.status(500).json({
            error: 'Failed to generate process mapping',
            message: error.message
        });
    }
});

function parseResponse(text) {
    const sections = {
        processOverview: '',
        actors: '',
        asIsWorkflow: '',
        toBeWorkflow: '',
        mermaidDiagram: '',
        bottlenecks: '',
        recommendations: '',
        kpis: ''
    };

    // Split by section markers
    const sectionPattern = /={20,}\s*\n/g;
    const parts = text.split(sectionPattern);

    parts.forEach(part => {
        const trimmed = part.trim();

        if (trimmed.match(/^1\.\s*PROCESS OVERVIEW/i)) {
            sections.processOverview = trimmed.replace(/^1\.\s*PROCESS OVERVIEW\s*/i, '').trim();
        } else if (trimmed.match(/^2\.\s*ACTORS?\s*\/?\s*ROLES?/i)) {
            sections.actors = trimmed.replace(/^2\.\s*ACTORS?\s*\/?\s*ROLES?\s*/i, '').trim();
        } else if (trimmed.match(/^3\.\s*(AS-IS|CURRENT STATE)\s*WORKFLOW/i)) {
            sections.asIsWorkflow = trimmed.replace(/^3\.\s*(AS-IS|CURRENT STATE)\s*WORKFLOW\s*/i, '').trim();
        } else if (trimmed.match(/^4\.\s*(TO-BE|IMPROVED)\s*WORKFLOW/i)) {
            sections.toBeWorkflow = trimmed.replace(/^4\.\s*(TO-BE|IMPROVED)\s*WORKFLOW\s*/i, '').trim();
        } else if (trimmed.match(/^5\.\s*MERMAID\s*DIAGRAM/i)) {
            const mermaidContent = trimmed.replace(/^5\.\s*MERMAID\s*DIAGRAM\s*/i, '').trim();
            // Remove markdown code blocks if present
            sections.mermaidDiagram = mermaidContent
                .replace(/```mermaid\s*/g, '')
                .replace(/```\s*/g, '')
                .trim();
        } else if (trimmed.match(/^6\.\s*KEY\s*BOTTLENECKS?/i)) {
            sections.bottlenecks = trimmed.replace(/^6\.\s*KEY\s*BOTTLENECKS?\s*/i, '').trim();
        } else if (trimmed.match(/^7\.\s*OPTIMIZATION\s*RECOMMENDATIONS?/i)) {
            sections.recommendations = trimmed.replace(/^7\.\s*OPTIMIZATION\s*RECOMMENDATIONS?\s*/i, '').trim();
        } else if (trimmed.match(/^8\.\s*KEY\s*PERFORMANCE\s*INDICATORS?/i)) {
            sections.kpis = trimmed.replace(/^8\.\s*KEY\s*PERFORMANCE\s*INDICATORS?\s*(\(KPIs\))?\s*/i, '').trim();
        }
    });

    return sections;
}

export default router;
