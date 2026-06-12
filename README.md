# NexusML - YouTube Audience Intelligence Platform

An enterprise-grade, full-stack application that leverages a custom fine-tuned RoBERTa model to analyze YouTube comment sections, providing deep audience insights, sentiment analysis, and community health metrics.

## 🚀 Folder Structure

\`\`\`
.
├── backend/                  # FastAPI & ML Inference
│   ├── main.py               # API endpoints
│   ├── model_pipeline.py     # RoBERTa inference pipeline
│   ├── requirements.txt      # Python dependencies
│   └── Dockerfile            # Backend container
├── src/                      # Frontend (Vite + React)
│   ├── components/           # Reusable UI components
│   ├── pages/                # Landing & Dashboard pages
│   ├── services/             # API client & mocks
│   └── utils/                # Helpers (cn, styling)
├── package.json              # Node dependencies
└── tailwind.config.js        # Tailwind styling
\`\`\`

## 🏗 Architecture

### Frontend Architecture
- **Framework:** React + Vite
- **Routing:** React Router DOM
- **State Management:** React Hooks
- **Styling:** Tailwind CSS + Custom UI Components (Shadcn pattern)
- **Data Visualization:** Recharts
- **Animations:** Framer Motion

### Backend Architecture (provided in \`/backend\`)
- **Framework:** FastAPI (Python)
- **Model Serving:** Hugging Face Transformers (`roberta-base` fine-tuned)
- **Compute:** PyTorch (CUDA supported)
- **Inference:** Batch processing with Softmax probability confidence scoring.

### Database Schema (PostgreSQL)
\`\`\`sql
CREATE TABLE analysis_runs (
    id UUID PRIMARY KEY,
    video_id VARCHAR(50) NOT NULL,
    video_title TEXT,
    channel_name TEXT,
    total_comments_analyzed INT,
    positive_score FLOAT,
    neutral_score FLOAT,
    negative_score FLOAT,
    confidence_score FLOAT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE comments_data (
    id UUID PRIMARY KEY,
    run_id UUID REFERENCES analysis_runs(id),
    author TEXT,
    comment_text TEXT,
    sentiment VARCHAR(20),
    confidence FLOAT,
    likes INT,
    published_at TIMESTAMP
);
\`\`\`

## 🔧 API Contracts

### `POST /analyze`
Initiates a new ML analysis pipeline on a given YouTube video.

**Request:**
\`\`\`json
{
  "youtube_url": "https://www.youtube.com/watch?v=..."
}
\`\`\`

**Response:**
\`\`\`json
{
  "metadata": {
    "title": "...",
    "channelName": "...",
    "thumbnailUrl": "...",
    "viewCount": 1000,
    "likeCount": 50,
    "commentCount": 10
  },
  "sentiment": {
    "totalAnalyzed": 1000,
    "positivePercent": 65.5,
    "neutralPercent": 20.0,
    "negativePercent": 14.5,
    "sentimentScore": 78.0,
    "satisfactionScore": 82.0,
    "confidenceScore": 89.15,
    "engagementScore": 75.0
  },
  "analytics": {
     // Timeseries, word frequency, confidence distribution data
  },
  "insights": {
     "executiveSummary": "...",
     "mainPraises": [],
     "mainComplaints": [],
     "communityMood": "..."
  }
}
\`\`\`

## 🐳 Docker Setup

### Building the Backend Image
\`\`\`bash
cd backend
docker build -t nexusml-backend .
\`\`\`

### Running the Backend Container
\`\`\`bash
docker run -p 8000:8000 --env-file .env nexusml-backend
\`\`\`

## 🔐 Environment Variables (.env)

\`\`\`env
# Backend
YOUTUBE_API_KEY=your_google_api_key
MODEL_PATH=roberta-base-sentiment-finetuned
REDIS_URL=redis://localhost:6379/0
DATABASE_URL=postgresql://user:pass@localhost:5432/nexusml

# Frontend
VITE_API_BASE_URL=http://localhost:8000
\`\`\`

## 📖 Deployment Guide

1. **Model Preparation:** 
   Ensure your fine-tuned RoBERTa model artifacts (`pytorch_model.bin`, `config.json`, `vocab.json`, etc.) are placed in a cloud storage bucket or baked into the Docker image under the `/app/model` path.
2. **Database:** 
   Spin up a managed PostgreSQL instance (e.g., AWS RDS or Supabase) and run the schema migrations.
3. **Caching:** 
   Set up Redis for caching YouTube API responses and duplicate video URLs to save compute.
4. **Compute Instances:** 
   Deploy the FastAPI backend to an instance with GPU access (e.g., AWS EC2 g4dn, or GCP Compute Engine with T4) for fast inference. If CPU-only, adjust batch size in `model_pipeline.py`.
5. **Frontend Hosting:** 
   Deploy the React frontend to Vercel or Netlify, pointing the `VITE_API_BASE_URL` to your live backend domain.
