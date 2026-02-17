# AI Process Mapping Tool

A full-stack AI-powered application that transforms business problems into structured process workflows, diagrams, and optimization recommendations using Google's Gemini AI.

![AI Process Mapping Tool](https://img.shields.io/badge/AI-Gemini-blue) ![React](https://img.shields.io/badge/React-18.3-61dafb) ![Node.js](https://img.shields.io/badge/Node.js-Express-green)

## Features

✨ **Dual Viewing Modes** - Executive Summary (quick view) and Full Analysis (deep dive)  
🎯 **AI-Powered Analysis** - Leverages Google Gemini 2.0 Flash to analyze business problems  
📊 **Process Diagrams** - Automatic Mermaid flowchart generation  
🔄 **AS-IS / TO-BE Workflows** - Compare current vs. optimized processes  
👥 **Actor Mapping** - Identify roles and responsibilities  
⚠️ **Bottleneck Detection** - Pinpoint operational inefficiencies  
💡 **Optimization Recommendations** - Actionable improvement suggestions  
📈 **KPI Generation** - Key Performance Indicators for measurable outcomes  
📋 **Advanced Export** - Copy, download .mmd files, or export diagrams as PNG  
🎨 **Premium UI** - Dark-mode glassmorphism design with smooth animations  
🧹 **Professional Formatting** - Clean output without markdown artifacts

## Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Mermaid.js** - Diagram rendering
- **html2canvas** - PNG export

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **Google Gemini AI** - Generative AI model
- **CORS** - Cross-origin resource sharing

## Project Structure

```
BA-project2/
├── backend/
│   ├── index.js              # Express server
│   ├── routes/
│   │   └── generate.js       # API endpoint for AI generation
│   ├── package.json
│   └── .env                  # Environment variables
├── frontend/
│   ├── src/
│   │   ├── App.jsx           # Main application component
│   │   ├── main.jsx          # React entry point
│   │   ├── index.css         # Global styles
│   │   └── components/
│   │       ├── ProblemInput.jsx
│   │       ├── GenerateButton.jsx
│   │       ├── Loader.jsx
│   │       ├── SectionCard.jsx
│   │       └── MermaidRenderer.jsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

### 1. Clone and Install

```bash
# Navigate to project directory
cd BA-project2

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment Variables

Create or edit `backend/.env`:

```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
PORT=3001
```

**Important:** Replace `your_actual_gemini_api_key_here` with your real Gemini API key.

### 3. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```
Server runs on `http://localhost:3001`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
App runs on `http://localhost:5173`

### 4. Open in Browser

Navigate to `http://localhost:5173` and start mapping processes!

## Usage Guide

### 1. Enter Business Problem
Describe your operational challenge in the textarea. Be specific about:
- The current process
- Actors/roles involved
- Pain points and inefficiencies

**Example:**
```
Customer service response time is 48 hours due to manual 
ticket routing, no priority system, and agents checking 
multiple systems for customer data.
```

### 2. Generate Analysis
Click **"Generate Process Map"** and wait 10-20 seconds for AI analysis.

### 3. Choose Your View

**Executive Summary (Default - Quick View)**
- Problem Statement (3 lines)
- Recommended Solution (TO-BE workflow)
- Process Diagram
- Key Performance Indicators

**Full Analysis (Deep Dive)**
The tool generates 8 comprehensive sections:
1. **Process Overview** - High-level explanation
2. **Actors/Roles** - Key stakeholders
3. **AS-IS Workflow** - Current state process
4. **TO-BE Workflow** - Optimized process
5. **Mermaid Diagram** - Visual flowchart
6. **Key Bottlenecks** - Problem areas
7. **Optimization Recommendations** - Actionable improvements
8. **Key Performance Indicators** - Measurable success metrics

### 4. Export & Share
- **Copy individual sections** - Click copy button on any card
- **Copy full analysis** - Use "Copy Full Analysis" button
- **Download Mermaid code** - Click "Download .mmd" button
- **Export diagram as PNG** - Click "Export PNG" on diagram

## API Documentation

### POST `/api/generate`

Generate process mapping analysis from business problem.

**Request:**
```json
{
  "problem": "Customer complaints are handled manually..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "processOverview": "...",
    "actors": "...",
    "asIsWorkflow": "...",
    "toBeWorkflow": "...",
    "mermaidDiagram": "flowchart TD\n...",
    "bottlenecks": "...",
    "recommendations": "..."
  }
}
```

**Error Response:**
```json
{
  "error": "Error message",
  "message": "Detailed error description"
}
```

## Troubleshooting

### Backend won't start
- **Check API key:** Ensure `GEMINI_API_KEY` is set in `backend/.env`
- **Check port:** Make sure port 3001 is not in use
- **Install dependencies:** Run `npm install` in backend directory

### Frontend won't connect to backend
- **Verify backend is running:** Check `http://localhost:3001/health`
- **Check proxy config:** Ensure `vite.config.js` has correct proxy settings
- **Clear cache:** Delete `node_modules` and reinstall

### Mermaid diagram not rendering
- **Check syntax:** Gemini should generate valid Mermaid code
- **View console:** Open browser DevTools for error messages
- **Try again:** Regenerate the analysis

### API errors
- **Invalid API key:** Verify your Gemini API key is correct
- **Rate limits:** Check if you've exceeded Gemini API quotas
- **Network issues:** Ensure internet connectivity

## Development

### Backend Development Mode
```bash
cd backend
npm run dev  # Auto-restart on file changes
```

### Frontend Development Mode
```bash
cd frontend
npm run dev  # Hot module replacement
```

### Build for Production
```bash
cd frontend
npm run build  # Creates optimized build in dist/
```

## Contributing

This is a student/learning project. Feel free to fork and customize for your needs.

## License

MIT License - Free to use for educational and commercial purposes.

## Acknowledgments

- **Google Gemini AI** - Powering the intelligent analysis
- **Mermaid.js** - Beautiful diagram rendering
- **Tailwind CSS** - Rapid UI development
- **React & Vite** - Modern frontend tooling

---

**Built for Business Analysts** | Transform operational problems into actionable insights
