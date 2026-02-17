# Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Add Your Gemini API Key

1. Get a free API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Open `backend/.env`
3. Replace `your_gemini_api_key_here` with your actual key:

```env
GEMINI_API_KEY=AIzaSy...your_actual_key_here
PORT=5000
```

### Step 2: Start the Backend

```bash
cd backend
npm start
```

You should see: `🚀 Server running on http://localhost:5000`

### Step 3: Start the Frontend

Open a new terminal:

```bash
cd frontend
npm run dev
```

You should see: `➜ Local: http://localhost:5173/`

### Step 4: Open the App

Navigate to `http://localhost:5173` in your browser.

---

## 📝 Try It Out

**Sample Business Problem:**
```
Customer complaints are handled manually via email causing delays 
and missed follow-ups. Support team receives 50+ emails daily 
with no tracking system.
```

1. Paste this into the textarea
2. Click "Generate Process Map"
3. Wait 10-20 seconds
4. Review the 7 analysis sections
5. Export the diagram or copy the analysis

---

## ⚠️ Troubleshooting

**Backend won't start?**
- Make sure you added your Gemini API key to `backend/.env`
- Check that port 5000 is not in use

**Frontend can't connect?**
- Verify the backend is running on port 5000
- Check `http://localhost:5000/health` in your browser

**Need help?**
- See the full [README.md](file:///Users/bhargavteja/Desktop/BA-project2/README.md)
- Check the [walkthrough.md](file:///Users/bhargavteja/.gemini/antigravity/brain/52c977c6-1705-4cd0-a2c0-3387aa28b713/walkthrough.md)

---

**You're all set! 🎉**
