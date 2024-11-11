import os
import requests

from datetime import datetime

from exceptions import TopicLoadException
from dotenv import load_dotenv
from openai import OpenAI
from zoneinfo import ZoneInfo
import logging

logging.basicConfig(filename='/var/log/cron_python.log', level=logging.DEBUG)

def generate_summary(headlines, system_message, client, model="gpt-4o-mini"):
    chat_completion = client.chat.completions.create(
        messages=[
            {"role": "system", "content": system_message},
            {"role": "user", "content": headlines},
        ],
        model=model,
    )

    summary= chat_completion.choices[0].message.content
    return summary


def main():
    # Get current date and variations
    current_date = datetime.now(ZoneInfo('America/Los_Angeles'))
    date_dash = current_date.strftime("%Y-%m-%d")
    
    # Get API
    load_dotenv()
    api = os.getenv("API")

    
    # Open AI API setup
    client = OpenAI()
    system_message = "You are a summarization tool. You will be given a list of headlines, generate a single headline which summarizes all the information provided. Be objective and do not incorporate bias into the summaries."

    
    # Get Topics
    response = requests.get(f"{api}/topics")
    
    
    # If there was an error loading topics, end the script
    if response.status_code != 200:
        raise TopicLoadException

    
    # Extract the information for each topic
    topic_data = dict(response.json())["data"]

    
    # Save raw headlines for each topic
    for data in topic_data:
        
        # Topic meta data
        topic_id = data["tid"]

        # GET headlines for the topic
        params = {
            "date_added": date_dash,
            "tid": topic_id,
        }
        response = requests.get(f"{api}/rawHeadline", params=params)
        
        if response.status_code != 200:
            logging.error("Request failed:", response.status_code, response.text)
            continue
        
        headline_objs = dict(response.json())["data"]

        if len(headline_objs) == 0:
            logging.error(f"No raw headlines for topic id: {topic_id}")
            continue

        # Combine headlines within a group
        groups = {}
        for obj in headline_objs:
            groups[obj["group"]] = groups.get(obj["group"], "") + f"{obj["headline_text"]}\n"

        
        # Generate the summary for each group
        for group in groups.keys():

            # Generate the summary
            group_headlines = groups[group]
            generated_summary = generate_summary(group_headlines, system_message, client)
            
            # Data to send in the POST request
            data = {
                "headline_text":generated_summary,
                "date_added": date_dash,
                "group": group,
                "tid": topic_id
            }

            # Send POST request
            response = requests.post(f"{api}/generatedHeadline", json=data)

            # Check the response
            if response.status_code != 200:
                logging.error("Failed to post:", response.status_code, response.text)
                logging.debug(data)

    
        

if __name__ == "__main__":
    main()