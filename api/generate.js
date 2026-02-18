import OpenAI from 'openai';

// Markdown cleanup function
function cleanMarkdown(text) {
    return text
        .replace(/\*\*/g, '')
        .replace(/\*/g, '')
        .replace(/#{1,6}\s?/g, '')
        .replace(/`{1,3}/g, '')
        .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
        .trim();
}

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    // Handle preflight
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { problem } = req.body;

        if (!problem || !problem.trim()) {
            return res.status(400).json({ error: 'Problem description is required' });
        }

        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: 'OpenAI API key not configured. Please set OPENAI_API_KEY in your Vercel environment variables.' });
        }

        const openai = new OpenAI({ apiKey });

        // System prompt
        const SYSTEM_PROMPT = `You are an expert Business Analyst and Process Mapping specialist. Analyze the given business problem and provide a structured response with the following 8 sections. Use plain text without any markdown formatting (no **, *, #, or other markdown symbols).

IMPORTANT OUTPUT RULES:
1. Use plain text only - NO markdown formatting
2. NO bold (**text**), italic (*text*), or heading markers (# text)
3. Use simple bullet points with dashes (-)
4. Keep paragraphs clean and readable
5. Separate sections clearly

Provide your analysis in this exact format:

SECTION 1: PROCESS OVERVIEW
[3-4 sentences describing the business problem and its context]

SECTION 2: ACTORS / ROLES
[List of key stakeholders and their roles, one per line with dashes]

SECTION 3: AS-IS WORKFLOW
[Current state workflow as bulleted steps with dashes]

SECTION 4: TO-BE WORKFLOW
[Optimized future state workflow as bulleted steps with dashes]

SECTION 5: MERMAID DIAGRAM
[Valid Mermaid flowchart code showing the TO-BE process]

SECTION 6: KEY BOTTLENECKS
[List of current bottlenecks and inefficiencies with dashes]

SECTION 7: OPTIMIZATION RECOMMENDATIONS
[Actionable recommendations with expected outcomes]

SECTION 8: KEY PERFORMANCE INDICATORS (KPIs)
[Format each KPI as: KPI Name - Target/Metric - Description]
Example: First Response Time - Under 2 hours - Average time from ticket creation to first agent response

Remember: Use plain text only, no markdown formatting.`;

        // Generate content using OpenAI
        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            max_tokens: 2000,
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'user', content: `Business Problem:\n${problem}` }
            ]
        });

        let text = completion.choices[0]?.message?.content || '';

        // Clean markdown
        text = cleanMarkdown(text);

        // Parse sections
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

        const sectionRegex = /SECTION\s+(\d+):\s+([^\n]+)\n([\s\S]*?)(?=SECTION\s+\d+:|$)/gi;
        let match;

        while ((match = sectionRegex.exec(text)) !== null) {
            const sectionNum = parseInt(match[1]);
            const content = match[3].trim();

            switch (sectionNum) {
                case 1: sections.processOverview = content; break;
                case 2: sections.actors = content; break;
                case 3: sections.asIsWorkflow = content; break;
                case 4: sections.toBeWorkflow = content; break;
                case 5: sections.mermaidDiagram = content; break;
                case 6: sections.bottlenecks = content; break;
                case 7: sections.recommendations = content; break;
                case 8: sections.kpis = content; break;
            }
        }

        return res.status(200).json({
            success: true,
            data: sections
        });

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({
            error: 'Failed to generate process mapping',
            message: error.message
        });
    }
}
