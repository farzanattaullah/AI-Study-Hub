# AI Study Assistant

> **Upload. Understand. Practice. Learn.**

An AI-powered full-stack academic study platform engineered for college and university students. Upload PDF lecture slides or TXT notes to automatically extract text and generate structured summaries, key points, definitions, formulas, exam-oriented questions, interactive MCQ quizzes, and consult a **Source-First AI Tutor** with optional verified external search.

---

## 1. Project Overview

**AI Study Assistant** solves information overload and unverified AI hallucinations for university students. When a student uploads study material (`.pdf` or `.txt`), the system extracts the underlying text and uses AI to generate an end-to-end study pack strictly grounded in the uploaded document.

When students ask questions in the **AI Tutor**, the system follows a strict **Source-First Protocol**:
1. It searches the uploaded study material first.
2. If found, it answers directly from the student's notes (`"According to your uploaded material..."`).
3. If the information is not present in the uploaded PDF/TXT, it **never** hallucinates or silently mixes outside trivia—instead, it notifies the student and asks explicit permission (`[Yes, use other sources]` / `[No, stay with my material]`) before querying reliable external academic sources.

---

## 2. Features

1. **Simple & Detailed Summaries**: Automatically extracts short overviews, comprehensive summaries, bulleted key points, definitions, and mathematical formulas.
2. **Important Topics**: Identifies core syllabus topics with importance indicators and 1-click **"Explain this topic"** deep dives.
3. **Exam-Oriented Questions**: Generates Short-Answer, Long-Answer, and University Exam Questions with copy and bookmarking support.
4. **Simple Topic Explanations**: Explains any selected concept with college-level clarity, practical examples, and key terminology.
5. **Interactive AI MCQ Quizzes**: Generates 4-option multiple-choice quizzes with progress tracking, instant grading, accuracy percentages, and per-question explanations.
6. **Source-First AI Tutor**:
   - Checks uploaded PDF/TXT material first.
   - Supports **PDF Only** and **PDF + External Sources** modes, remembering preference per document.
   - Requests student permission before searching external academic sources via Google Search grounding.
7. **Interactive 3D Components**:
   - **3D Cosmic Orbital Knowledge Sphere** with interactive mouse-tilt perspective.
   - **3D Neural Study Companion Hub** & **3D Interactive FlipBook Portal**.
8. **Student Progress Analytics**: Tracks total documents, quizzes completed, questions practiced, average & highest scores, and performance progression charts.

---

## 3. Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Vite, Lucide React Icons, Framer Motion, CSS 3D Transforms
- **Backend**: Node.js, Express.js, RESTful API architecture (`server.ts`)
- **Database**: Cloud Firestore (`firebase-applet-config.json`, `firestore.rules`)
- **Authentication**: Firebase Authentication (Google Sign-In via popup & native session tokens)
- **File Processing**: `multer` (file validation & 20MB size limit), `unpdf` PDF text extraction + stream fallback
- **AI Integration**: Google GenAI SDK (`@google/genai`) running server-side with `gemini-3.8-flash` and Google Search Grounding (`googleSearch`)

---

## 4. Folder Structure

```text
├── server.ts                      # Express + Vite full-stack server entry point (Port 3000)
├── server/
│   ├── config/
│   │   └── db.ts                  # Persistent storage adapter & local seed store
│   ├── middleware/
│   │   └── auth.ts                # Firebase ID token & session verification middleware
│   ├── models/
│   │   ├── User.ts                # User data model interfaces
│   │   ├── Document.ts            # Document data model interfaces
│   │   ├── Quiz.ts                # Quiz & QuizQuestion data model interfaces
│   │   └── Chat.ts                # Chat & Source-First Message data model interfaces
│   ├── routes/
│   │   ├── authRoutes.ts          # /api/auth/* endpoints
│   │   ├── documentRoutes.ts      # /api/documents/* upload & CRUD endpoints
│   │   ├── aiRoutes.ts            # /api/ai/* summarize, questions, explain, quiz, chat, external-search
│   │   ├── quizRoutes.ts          # /api/quizzes/* endpoints
│   │   └── chatRoutes.ts          # /api/chats/* endpoints
│   └── services/
│       ├── pdfService.ts          # PDF & TXT text extraction service
│       └── aiService.ts           # Gemini AI prompts & Source-First Tutor engine
├── src/
│   ├── components/
│   │   ├── three/
│   │   │   ├── CosmicOrbitalSphere3D.tsx
│   │   │   ├── StudyCompanionHub3D.tsx
│   │   │   └── FlipBookModal3D.tsx
│   │   └── ui/
│   │       └── ToastContainer.tsx
│   ├── context/
│   │   └── AuthContext.tsx        # Global auth, document, quiz & toast state
│   ├── layouts/
│   │   └── DashboardLayout.tsx    # Responsive sidebar + mobile navigation shell
│   ├── pages/
│   │   ├── LandingPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── SignupPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── UploadPage.tsx
│   │   ├── MyDocumentsPage.tsx
│   │   ├── DocumentDetailsPage.tsx
│   │   ├── AITutorPage.tsx
│   │   ├── QuizzesPage.tsx
│   │   ├── ProgressPage.tsx
│   │   └── ProfilePage.tsx
│   ├── services/
│   │   └── api.ts                 # Typed REST API client
│   └── types/
│       └── study.ts               # Shared TypeScript interfaces
├── .env.example                   # Environment variable template
└── package.json
```

---

## 5. Installation

```bash
git clone <repository-url>
cd ai-study-assistant
npm install
```

---

## 6. Firebase & Cloud Firestore Setup

1. Firebase configuration is loaded from `firebase-applet-config.json` containing the Firestore Database ID `ai-studio-remixlearnhub-ff26afcc-c996-4c46-8ac1-582d1c0c7ccd`.
2. Cloud Firestore security rules are defined in `firestore.rules`.
3. Users authenticate via Google Sign-In with popup through Firebase Auth.

---

## 7. Environment Variables

Create a `.env` file in the root directory based on `.env.example`:

```env
GEMINI_API_KEY=your_gemini_api_key
AI_API_KEY=your_gemini_api_key
AI_MODEL=gemini-flash-latest
PORT=3000
NODE_ENV=production
```

---

## 8. AI API Setup

1. Obtain a Gemini API key from Google AI Studio.
2. Assign it to `GEMINI_API_KEY` (or `AI_API_KEY`) in `.env`.
3. All AI calls execute strictly on the Node.js/Express backend (`server/services/aiService.ts`). Keys are never exposed to the client browser.

---

## 9. External Search Setup

When a student clicks **`[Yes, use other sources]`** in the AI Tutor, the backend endpoint `POST /api/ai/external-search` uses `@google/genai` with Google Search Grounding (`tools: [{ googleSearch: {} }]`) to retrieve citations and domain links from reputable educational and university websites.

---

## 10. Running Frontend & 11. Running Backend

The full-stack development server runs both the Express REST API and Vite frontend middleware on port `3000`:

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.
- **Demo Student Account**: `alex@university.edu` / `password123` (or click the **Instant Demo Login** button on the Login page).

---

## 12. Production Build

```bash
npm run build
npm run start
```

---

## 13. Deployment Instructions

1. Run `npm run build` to compile the React/TypeScript frontend into `dist/`.
2. Configure environment variables (`GEMINI_API_KEY`, `SESSION_SECRET`, `NODE_ENV=production`, `PORT=3000`) on your hosting provider (Vercel, Cloud Run, Render, or VPS).
3. Start the production server with `npm run start`.
