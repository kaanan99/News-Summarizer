import os
import requests

from datetime import datetime

from exceptions import TopicLoadException
from zoneinfo import ZoneInfo

from dotenv import load_dotenv
from GoogleNews import GoogleNews
from sentence_transformers import SentenceTransformer, util


def main():
    # Get current date and variations
    current_date = datetime.now(ZoneInfo('America/Los_Angeles'))
    date_slash = current_date.strftime("%m/%d/%Y")
    date_dash = current_date.strftime("%Y-%m-%d")

    # Get API
    load_dotenv()
    api = os.getenv("API")

    # Get Topics
    response = requests.get(f"{api}/topics")
    
    # If there was an error loading topics, end the script
    if response.status_code != 200:
        raise TopicLoadException

    # Extract the information for each topic
    topic_data = dict(response.json())["data"]

    # Load SBERT model
    model = SentenceTransformer("all-MiniLM-L6-v2")
    model.max_seq_length = 128

    # Save raw headlines for each topic
    for data in topic_data:
        
        # Topic meta data
        topic_key = data["topic_key"]
        topic_id = data["tid"]

        # Initialize google news object
        googlenews = GoogleNews(start=date_slash)
        googlenews.set_topic(topic_key)
        googlenews.get_news()

        # Get Headlines and URLs
        news = googlenews.result()

        headlines = []
        urls = []
        for obj in news:
            headlines.append(obj["title"])
            urls.append(obj["link"])

        # Group the headlines together
        embeddings = model.encode(headlines)
        clusters = util.community_detection(embeddings, min_community_size=3, threshold=0.6)
        
        for group in range(len(clusters)):
            for index in clusters[group]:
                # Data to send in the POST request
                data = {
                    "headline_text": headlines[index],
                    "headline_url": urls[index],
                    "date_added": date_dash,
                    "group": group+1,
                    "tid": topic_id
                }

                # Send POST request
                response = requests.post(f"{api}/rawHeadline", json=data)

                # Check the response
                if response.status_code != 200:
                    print("Failed to post:", response.status_code, response.text)
                    print(data)
        

if __name__ == "__main__":
    main()