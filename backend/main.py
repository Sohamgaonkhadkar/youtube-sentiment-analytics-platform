from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime

from model_pipeline import SentimentAnalyzer
from youtube_service import extract_video_id, get_video_metadata, get_comments
from insights_service import generate_insights, chat_with_coach

app = FastAPI(title="TubeSignal API", version="1.0.0")

app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

print("Loading Sentiment Model... This might take a second.")
analyzer = SentimentAnalyzer("./model")
print("Model Loaded Successfully!")

class AnalyzeRequest(BaseModel):
    youtube_url: str

class Comment(BaseModel):
    id: str
    text: str
    author: str
    likes: int
    sentiment: str
    confidence: float
    timestamp: str

class VideoMetadata(BaseModel):
    title: str
    channelName: str
    thumbnailUrl: str
    viewCount: int
    likeCount: int
    commentCount: int

class KpiStack(BaseModel):
    satisfaction: int
    communityHealth: int
    trust: int
    sentiment: int
    engagementQuality: int
    creatorReputation: int
    audienceLoyalty: int
    growthPotential: int
    viralPotential: int
    contentQuality: int

class Insights(BaseModel):
    executiveSummary: List[str] = Field(default_factory=list)
    recommendedMove: Dict[str, Any] = Field(default_factory=dict)
    segments: List[Dict[str, Any]] = Field(default_factory=list)
    emotions: List[Dict[str, Any]] = Field(default_factory=list)
    contentEngine: Dict[str, List[str]] = Field(default_factory=dict)
    growthOpportunities: List[Dict[str, Any]] = Field(default_factory=list)
    topRequests: List[Dict[str, Any]] = Field(default_factory=list)

class AnalysisResponse(BaseModel):
    metadata: VideoMetadata
    kpis: KpiStack
    comments: List[Comment]
    insights: Insights

class CoachRequest(BaseModel):
    question: str
    context: str

@app.post("/analyze", response_model=AnalysisResponse)
async def analyze_video(request: AnalyzeRequest):
    print("\n" + "="*50)
    print(f"🚀 NEW ANALYSIS REQUEST RECEIVED")
    print(f"🔗 Target URL: {request.youtube_url}")
    
    if not request.youtube_url: 
        print("❌ REJECTED (400): URL was empty.")
        raise HTTPException(status_code=400, detail="URL required")

    try:
        try:
            video_id = extract_video_id(request.youtube_url)
            print(f"✅ Extracted Video ID: {video_id}")
        except ValueError:
            print(f"❌ REJECTED (400): URL format is invalid. Could not extract ID.")
            raise HTTPException(status_code=400, detail="Invalid YouTube URL format.")

        print("📡 Fetching metadata from YouTube API...")
        video_meta = get_video_metadata(video_id)
        
        print("📡 Fetching comments from YouTube API...")
        comments_data = get_comments(video_id, max_comments=500)
        
        print(f"✅ Downloaded {len(comments_data)} comments.")

        if not comments_data: 
            print("❌ REJECTED (400): Video has 0 comments. Cannot analyze.")
            raise HTTPException(status_code=400, detail="No comments found on this video.")

        print("🧠 Running local AI sentiment analysis...")
        comments = [c["text"] for c in comments_data]
        predictions = analyzer.predict_batch(comments)

        pos, neg, neu = [], [], []
        for c, p in zip(comments, predictions):
            if p["sentiment"] == "positive": pos.append(c)
            elif p["sentiment"] == "negative": neg.append(c)
            else: neu.append(c)

        print("🤖 Generating LLaMA business insights...")
        insights_data = generate_insights(pos, neg, neu)

        print("📊 Calculating Premium KPIs...")
        total = max(len(predictions), 1)
        pos_pct = (len(pos) / total) * 100
        neg_pct = (len(neg) / total) * 100
        neu_pct = (len(neu) / total) * 100
        
        avg_conf = sum(p["confidence"] for p in predictions) / total * 100
        view_count = max(video_meta["viewCount"], 1)
        engagement_ratio = min((video_meta["likeCount"] / view_count) * 1000, 100)

        kpis = KpiStack(
            satisfaction=int(pos_pct + (neu_pct * 0.5)),
            communityHealth=int(max(0, 100 - (neg_pct * 1.5))),
            trust=int(avg_conf * (pos_pct / 100 + 0.5)),
            sentiment=int(max(0, min(pos_pct - neg_pct + 50, 100))),
            engagementQuality=int(engagement_ratio * 0.8 + (len(comments)/100)),
            creatorReputation=int(min(70 + (pos_pct * 0.3), 99)),
            audienceLoyalty=int(min(60 + (engagement_ratio * 0.4), 99)),
            growthPotential=int(min(50 + (len(insights_data.get("topRequests", [])) * 10), 99)),
            viralPotential=int(min((video_meta["likeCount"] / view_count) * 5000, 99)),
            contentQuality=int(min(pos_pct + 15, 99))
        )

        comments_resp = [
            Comment(id=c.get("id", str(i)), text=c["text"], author=c.get("author", "User"),
                    likes=c.get("likes", 0), sentiment=p["sentiment"],
                    confidence=p["confidence"], timestamp=c.get("timestamp", datetime.now().isoformat()))
            for i, (c, p) in enumerate(zip(comments_data, predictions))
        ]

        print("✅ SUCCESS! Sending data to frontend.")
        print("="*50 + "\n")
        return AnalysisResponse(
            metadata=video_meta, kpis=kpis, comments=comments_resp,
            insights=Insights(**insights_data)
        )
        
    except HTTPException as e:
        # Let our intentionally raised 400 errors pass through cleanly
        raise e
    except Exception as e:
        print(f"❌ CRITICAL SERVER ERROR (500): {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/coach")
async def ask_coach_endpoint(request: CoachRequest):
    return {"answer": chat_with_coach(request.question, request.context)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)