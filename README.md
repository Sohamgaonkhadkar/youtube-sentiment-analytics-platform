# TubeSignal

## AI-Powered YouTube Audience Intelligence Platform

TubeSignal is a production-grade audience intelligence platform that transforms raw YouTube comments into actionable business insights for creators.

Instead of manually reading hundreds or thousands of comments, creators can provide a YouTube video URL and receive a comprehensive intelligence report containing sentiment analysis, audience segmentation, emotional profiling, growth opportunities, content recommendations, strategic insights, and AI-powered coaching.

The platform combines transformer-based NLP, YouTube Data API integration, business KPI generation, and local Large Language Model reasoning to convert unstructured audience feedback into creator-focused decision support.

---

# Abstract

Traditional sentiment analysis systems focus primarily on classifying comments as positive, negative, or neutral. While useful, these classifications often fail to answer the questions creators actually care about:

* What do viewers love most?
* What frustrates the audience?
* What content should be created next?
* Which improvements will have the highest impact?
* What opportunities are hidden within audience feedback?

TubeSignal addresses this gap by integrating transformer-based sentiment classification with local LLM-powered intelligence synthesis. The system retrieves YouTube comments, performs sentiment inference locally, generates business-oriented KPIs, extracts audience signals, and produces strategic recommendations designed to help creators improve future content.

The entire inference pipeline operates locally using Hugging Face Transformers and Ollama, ensuring data privacy, low latency, and full control over the AI workflow.

---

# What TubeSignal Does

TubeSignal converts YouTube comments into creator intelligence.

A user simply submits a YouTube URL.

The platform then:

1. Retrieves video metadata and comments.
2. Performs sentiment classification on each comment.
3. Generates audience KPIs.
4. Extracts audience signals and recurring themes.
5. Identifies growth opportunities.
6. Generates strategic recommendations.
7. Provides AI-powered coaching grounded in audience evidence.

The result is a comprehensive intelligence report that helps creators understand how their audience perceives their content and what actions they should take next.

# TubeSignal

AI-Powered YouTube Audience Intelligence Platform

<img width="1902" height="873" alt="Image" src="https://github.com/user-attachments/assets/02a99743-40d3-429c-b62c-dab275bc5352" />

---

## Demo Video

https://github.com/user-attachments/assets/6c154976-a083-403e-b134-f6b1ef4e6082

---

# Key Features

## YouTube Video Analysis

* Accepts standard YouTube URLs.
* Extracts video metadata.
* Retrieves audience comments.
* Processes audience feedback automatically.

---

## Sentiment Analysis

Every comment is classified into:

* Positive
* Neutral
* Negative

The sentiment engine produces:

* Comment-level predictions
* Confidence scores
* Overall sentiment distribution

---

## Executive Intelligence Briefing

Automatically generates an executive summary of audience reactions.

The summary highlights:

* Major audience opinions
* Recurring praise
* Recurring complaints
* Emerging audience trends

---

## Recommended Next Move

The platform identifies the highest-impact action a creator should take next.

Each recommendation includes:

* Action title
* Business rationale
* Audience demand estimate
* Expected effort
* Expected impact

---

## Audience Segmentation

TubeSignal automatically groups viewers into behavioral segments.

Examples include:

* Beginners
* Advanced Users
* Loyal Subscribers
* Critics
* Feature Requesters

Each segment includes:

* Relative audience share
* Behavioral description
* Strategic significance

---

## Audience Emotion Analysis

Beyond sentiment classification, the system estimates audience emotions such as:

* Satisfaction
* Excitement
* Curiosity
* Trust
* Confusion
* Frustration

This helps explain why viewers reacted the way they did.

---

## Content Improvement Engine

TubeSignal extracts actionable content signals from audience feedback.

The platform identifies:

### Most Praised Topics

Topics receiving the highest positive feedback.

### Most Criticized Topics

Topics associated with negative audience reactions.

### Most Requested Topics

Topics viewers want covered next.

### Most Confusing Sections

Sections generating audience confusion.

### Most Valuable Sections

Content perceived as highly useful.

### Most Memorable Moments

Content repeatedly referenced by viewers.

---

## Growth Opportunity Discovery

The platform identifies opportunities hidden within audience feedback.

Each opportunity includes:

* Recommended action
* Impact estimate
* Effort estimate
* Growth rationale
* Expected audience lift

---

## Audience Request Mining

Repeated viewer requests are automatically discovered and ranked.

Examples include:

* Requests for follow-up videos
* Requests for tutorials
* Requests for source code
* Requests for deployment walkthroughs
* Requests for deeper explanations

---

## Premium KPI Dashboard

TubeSignal generates creator-focused KPIs.

Metrics include:

* Audience Satisfaction Score
* Community Health Score
* Trust Score
* Audience Sentiment Score
* Engagement Quality Score
* Creator Reputation Score
* Audience Loyalty Score
* Growth Potential Score
* Viral Potential Score
* Content Quality Score

---

## AI Creator Coach

A conversational AI assistant powered by Ollama.

Users can ask questions such as:

```text
What should I create next?

Why are viewers unhappy?

Which audience segment matters most?

What is limiting growth?

How can I improve engagement?
```

Responses are generated using the analyzed audience data rather than generic internet advice.

---

## Comment Intelligence Explorer

Provides direct access to analyzed comments.

Users can inspect:

* Positive comments
* Negative comments
* Neutral comments
* Confidence scores
* Likes
* Comment evidence

This allows users to verify recommendations against the original audience feedback.

---

# System Architecture

```text
                        ┌─────────────────────┐
                        │ React + Vite Client │
                        └──────────┬──────────┘
                                   │
                                   ▼
                     ┌──────────────────────────┐
                     │      FastAPI Server      │
                     └──────────┬───────────────┘
                                │
          ┌─────────────────────┼─────────────────────┐
          │                     │                     │
          ▼                     ▼                     ▼
 ┌────────────────┐  ┌──────────────────┐  ┌─────────────────┐
 │ YouTube Data   │  │ Sentiment Model  │  │ Ollama LLM      │
 │ API v3         │  │ (Transformers)   │  │ LLaMA 3.1 8B    │
 └────────────────┘  └──────────────────┘  └─────────────────┘
          │                     │                     │
          └──────────┬──────────┴──────────┬──────────┘
                     │                     │
                     ▼                     ▼
              KPI Generation      Intelligence Layer
                     │
                     ▼
              JSON API Response
```

---

# Technology Stack

## Backend

* FastAPI
* Uvicorn
* Pydantic

## Machine Learning

* PyTorch
* Hugging Face Transformers

## Large Language Models

* Ollama
* LLaMA 3.1 8B

## External Services

* Google YouTube Data API v3

## Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* Framer Motion

---

# Backend Components

## main.py

Primary API entry point.

Responsibilities:

* Route management
* Request validation
* Sentiment orchestration
* KPI computation
* Response serialization

---

## youtube_service.py

Responsible for:

* URL validation
* Video ID extraction
* Metadata retrieval
* Comment retrieval

---

## model_pipeline.py

Local transformer inference pipeline.

Responsibilities:

* Tokenization
* Sentiment inference
* Confidence scoring
* Device management

---

## insights_service.py

Intelligence generation layer.

Responsibilities:

* Ollama integration
* Prompt engineering
* JSON validation
* Strategic recommendation generation
* AI coach responses

---

# Prerequisites

## Python

```text
Python 3.10+
```

Recommended:

```text
Python 3.11
```

---

## Ollama

Install Ollama:

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

Pull required model:

```bash
ollama pull llama3.1:8b
```

Start service:

```bash
ollama serve
```

Verify installation:

```bash
ollama list
```

Expected:

```text
llama3.1:8b
```

---

# Environment Configuration

Create a `.env` file:

```env
YOUTUBE_API_KEY=YOUR_YOUTUBE_API_KEY
```

---

# Project Structure

```text
TubeSignal/
│
├── main.py
├── youtube_service.py
├── model_pipeline.py
├── insights_service.py
├── requirements.txt
├── .env
│
├── model/
│   ├── config.json
│   ├── tokenizer.json
│   ├── tokenizer_config.json
│   ├── special_tokens_map.json
│   ├── model.safetensors
│   └── ...
│
├── frontend/
│   ├── src/
│   ├── pages/
│   ├── services/
│   └── components/
│
└── mlruns/
```

---

# Installation

## Clone Repository

```bash
git clone https://github.com/<username>/tubesignal.git

cd tubesignal
```

---

## Create Virtual Environment

### Windows

```bash
python -m venv venv

venv\Scripts\activate
```

### Linux / macOS

```bash
python -m venv venv

source venv/bin/activate
```

---

## Install Dependencies

```bash
pip install --upgrade pip

pip install -r requirements.txt
```

---

# Running the Backend

Start FastAPI server:

```bash
uvicorn main:app --reload
```

Server:

```text
http://localhost:8000
```

Swagger UI:

```text
http://localhost:8000/docs
```

ReDoc:

```text
http://localhost:8000/redoc
```

---

# Model Management

The sentiment model is loaded locally at application startup.

Required structure:

```text
model/
├── config.json
├── tokenizer.json
├── tokenizer_config.json
├── special_tokens_map.json
├── model.safetensors
```

Initialization:

```python
SentimentAnalyzer("./model")
```

If model artifacts are missing, the API will fail during startup.

---

# API Documentation

## Analyze Video

### Endpoint

```http
POST /analyze
```

### Request

```json
{
  "youtube_url": "https://www.youtube.com/watch?v=VIDEO_ID"
}
```

### Response

```json
{
  "metadata": {
    "title": "Video Title",
    "channelName": "Channel Name",
    "viewCount": 125000,
    "likeCount": 8400,
    "commentCount": 1500
  },
  "kpis": {},
  "comments": [],
  "insights": {}
}
```

---

## AI Creator Coach

### Endpoint

```http
POST /coach
```

### Request

```json
{
  "question": "What content should I make next?",
  "context": "{serialized_insights}"
}
```

### Response

```json
{
  "answer": "A deployment-focused follow-up aligns strongly with current audience demand."
}
```

---

# KPI Definitions

| KPI                         | Description                                  |
| --------------------------- | -------------------------------------------- |
| Audience Satisfaction Score | Overall audience positivity                  |
| Community Health Score      | Quality of audience discussions              |
| Trust Score                 | Creator credibility perception               |
| Audience Sentiment Score    | Aggregate sentiment measure                  |
| Engagement Quality Score    | Interaction quality assessment               |
| Creator Reputation Score    | Community reputation indicator               |
| Audience Loyalty Score      | Returning audience strength                  |
| Growth Potential Score      | Future expansion opportunity                 |
| Viral Potential Score       | Content shareability estimate                |
| Content Quality Score       | Perceived educational or entertainment value |

---

# Error Handling

## Missing URL

```http
400 Bad Request
```

```json
{
  "detail": "URL required"
}
```

---

## Invalid URL

```http
400 Bad Request
```

```json
{
  "detail": "Invalid YouTube URL"
}
```

---

## No Comments Found

```http
400 Bad Request
```

```json
{
  "detail": "No comments found"
}
```

---

## Internal Server Error

```http
500 Internal Server Error
```

```json
{
  "detail": "Internal server error"
}
```

---

# Security Considerations

For production deployments:

* Restrict CORS origins.
* Store secrets in environment variables.
* Enable HTTPS.
* Configure reverse proxies.
* Implement rate limiting.
* Enable centralized logging.
* Monitor API latency and resource utilization.

---

# Future Roadmap

Planned enhancements include:

* Multi-video comparative analysis
* Channel-level intelligence dashboards
* Historical KPI tracking
* Trend detection across uploads
* PDF report generation
* Competitive benchmarking
* Multi-language comment analysis
* Real-time analytics streaming

---

# License

This repository contains the deployment infrastructure for the TubeSignal Audience Intelligence Platform.

All sentiment inference, KPI generation, and intelligence synthesis are executed locally using transformer models and Ollama-powered LLMs.
