import json
import re
import ollama
import traceback

def get_fallback_insights():
    return {
        "executiveSummary": ["AI Intelligence generation was interrupted.", "Check your backend terminal logs to see why Ollama failed."],
        "recommendedMove": {"title": "Verify Local LLM", "rationale": "Ollama service offline or model missing.", "demand": 0, "effort": "Low", "impact": "N/A"},
        "segments": [{"name": "System Error", "percentage": 100, "desc": "Data unavailable"}],
        "emotions": [{"name": "Neutral", "score": 50, "desc": "Default baseline"}],
        "contentEngine": {
            "praised": ["N/A"], "criticized": ["N/A"], "requested": ["N/A"],
            "confusing": ["N/A"], "valuable": ["N/A"], "memorable": ["N/A"]
        },
        "growthOpportunities": [],
        "topRequests": []
    }

def generate_insights(positive_comments, negative_comments, neutral_comments):
    # Overhauled prompt to force dynamic generation instead of static copying
    prompt = f"""
You are the lead intelligence analyst for TubeSignal. Analyze the following YouTube comments and return a HIGHLY detailed, UNIQUE business intelligence report tailored SPECIFICALLY to this video's feedback.

POSITIVE COMMENTS: {positive_comments[:40]}
NEGATIVE COMMENTS: {negative_comments[:40]}

INSTRUCTIONS:
1. Read the comments carefully. Identify the actual topics, requests, and complaints mentioned by the viewers.
2. The "recommendedMove" MUST be a specific, actionable piece of advice for the creator based on the most prominent feedback (e.g., "Make a dedicated tutorial on X", "Fix the background music volume", "Do a part 2"). DO NOT give generic advice like "Address criticisms".
3. Rate "demand" from 0-100 based on how intensely the audience is asking for it.
4. Rate "effort" strictly as "Low", "Medium", or "High".
5. Rate "impact" strictly as "Low", "Medium", or "High".

Return ONLY valid JSON. Replace the bracketed placeholder text with your actual analysis:
{{
    "executiveSummary": ["<Provide 2-3 sentences summarizing the exact sentiment and requests of these specific comments.>"],
    "recommendedMove": {{"title": "<Specific Action>", "rationale": "<Why this matters based on comments>", "demand": <Number 0-100>, "effort": "<Low/Medium/High>", "impact": "<Low/Medium/High>"}},
    "segments": [{{"name": "<e.g., Beginners, Critics, Hardcore Fans>", "percentage": <Number>, "desc": "<Specific behavior>"}}],
    "emotions": [{{"name": "<Emotion>", "score": <Number 0-100>, "desc": "<Why they feel this way>"}}],
    "contentEngine": {{
        "praised": ["<Specific detail they loved>", "<Another specific detail>"],
        "criticized": ["<Specific complaint>", "<Another complaint>"],
        "requested": ["<Specific video request>", "<Another request>"],
        "confusing": ["<What they didn't understand>", "<Another point of confusion>"],
        "valuable": ["<What helped them most>", "<Another valuable point>"],
        "memorable": ["<Specific quote or moment>", "<Another moment>"]
    }},
    "growthOpportunities": [{{"action": "<Specific Action>", "impact": "<High/Medium/Low>", "effort": "<High/Medium/Low>", "lift": "<e.g., +15%>", "rationale": "<Why>"}}],
    "topRequests": [{{"topic": "<Topic>", "context": "<Why they want it>", "volume": <Number>}}]
}}
"""
    try:
        response = ollama.chat(
            model="llama3.1:8b", 
            messages=[{"role": "user", "content": prompt}],
            options={"temperature": 0.4}, # Slightly increased temp allows more creative specific answers
            format="json" 
        )
        
        text = response["message"]["content"]
        return json.loads(text)
            
    except Exception as e:
        print("\n" + "="*50)
        print("🚨 OLLAMA GENERATION FAILED 🚨")
        traceback.print_exc()
        print("="*50 + "\n")
        return get_fallback_insights()

def chat_with_coach(question: str, context: str) -> str:
    prompt = f"You are TubeSignal AI. Answer concisely based on this data: {context}\n\nUser: {question}"
    try:
        response = ollama.chat(model="llama3.1:8b", messages=[{"role": "user", "content": prompt}])
        return response["message"]["content"].strip()
    except Exception as e:
        print(f"Coach Error: {e}")
        return "Coach is currently offline."