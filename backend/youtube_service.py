from dotenv import load_dotenv
load_dotenv()

import os
import re
from googleapiclient.discovery import build

YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")

if not YOUTUBE_API_KEY:
    raise ValueError("YOUTUBE_API_KEY not found in environment variables")

youtube = build("youtube", "v3", developerKey=YOUTUBE_API_KEY)


def extract_video_id(url: str):
    # Upgraded robust regex patterns to handle Shorts, Embeds, and Mobile Share links
    patterns = [
        r"(?:v=|\/)([0-9A-Za-z_-]{11}).*",          # Standard v=ID and general 11-char matches
        r"youtu\.be\/([0-9A-Za-z_-]{11})",          # Mobile share links
        r"shorts\/([0-9A-Za-z_-]{11})",             # YouTube Shorts
        r"embed\/([0-9A-Za-z_-]{11})"               # Embedded videos
    ]

    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)

    raise ValueError("Invalid YouTube URL")


def get_video_metadata(video_id):
    response = youtube.videos().list(
        part="snippet,statistics",
        id=video_id
    ).execute()

    if not response["items"]:
        raise ValueError("Video not found")

    item = response["items"][0]

    return {
        "title": item["snippet"]["title"],
        "channelName": item["snippet"]["channelTitle"],
        "thumbnailUrl": item["snippet"]["thumbnails"]["high"]["url"],
        "viewCount": int(item["statistics"].get("viewCount", 0)),
        "likeCount": int(item["statistics"].get("likeCount", 0)),
        "commentCount": int(item["statistics"].get("commentCount", 0))
    }


def get_comments(video_id, max_comments=500):
    comments = []
    next_page_token = None

    while len(comments) < max_comments:
        response = youtube.commentThreads().list(
            part="snippet",
            videoId=video_id,
            maxResults=100,
            pageToken=next_page_token,
            textFormat="plainText"
        ).execute()

        for item in response["items"]:
            comment = item["snippet"]["topLevelComment"]

            comments.append({
                "id": comment["id"],
                "text": comment["snippet"]["textOriginal"], # Uses textOriginal to avoid HTML tags
                "author": comment["snippet"]["authorDisplayName"],
                "likes": comment["snippet"]["likeCount"],
                "timestamp": comment["snippet"]["publishedAt"]
            })

            if len(comments) >= max_comments:
                break

        next_page_token = response.get("nextPageToken")
        if not next_page_token:
            break

    return comments