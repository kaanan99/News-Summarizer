import os
import requests
import string
import smtplib

from exceptions import TopicLoadException, HeadlineLoadException, UserLoadException, NoHeadlinesException

from datetime import datetime
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from dotenv import load_dotenv

def send_email(sender_email, sender_password, recipient_email, subject, body):
    # Create a multipart message
    msg = MIMEMultipart()
    msg['From'] = sender_email
    msg['To'] = recipient_email
    msg['Subject'] = subject

    # Attach the body to the message
    msg.attach(MIMEText(body, 'plain'))

    try:
        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp_server:
            smtp_server.login(sender_email, sender_password)
            smtp_server.sendmail(sender_email, recipient_email, msg.as_string())
    except Exception as e:
        print(f"Error sending to {recipient_email}: {e}")


def main():
    # Get current date and variations
    current_date = datetime.now()
    date_slash = current_date.strftime("%m/%d/%Y")
    date_dash = current_date.strftime("%Y-%m-%d")

    # Get sender email and password
    sender_email = os.getenv("EMAIL_USERNAME")
    sender_password = os.getenv("EMAIL_PASSWORD")

    # Get API
    load_dotenv()
    api = os.getenv("API")

    
    """
    Get Topics
    """
    # Get topics
    response = requests.get(f"{api}/topics")

    # If there was an error loading users
    if response.status_code != 200:
        raise TopicLoadException

    topics = dict(response.json())["data"]

    topic_headlines = {}
    topic_map = {}

    # Map headline and topic name to topic id in dict
    for topic in topics:
        topic_id = topic["tid"]
        topic_name = topic["topic_type"]

        topic_headlines[topic_id] = []
        topic_map[topic_id] = topic_name


    """
    Get Generated Headlines
    """
    # Get Generated Headlines
    response = requests.get(f"{api}/generatedHeadline?date_added={date_dash}")

    # If there was an error loading headlines
    if response.status_code != 200:
        raise HeadlineLoadException

    # Extract the information for each topic
    headlines = dict(response.json())["data"]

    # If there are no headlines, don't send any emails
    if len(headlines) == 0:
        raise NoHeadlinesException

    for headline in headlines:
        topic_id = headline["tid"]
        topic_headlines[topic_id].append(headline["headline_text"])


    """
    Make Headlines to send
    """
    # Generate bodies for each topic:
    topic_message = {}

    for topic_id in topic_map.keys():
        topic_name = topic_map[topic_id]
        if topic_name == "us":
            topic_name = topic_name.upper()
        else:
            topic_name = string.capwords(topic_name)

        header = f"{topic_name} News:"
        body = ""
        for headline in topic_headlines[topic_id]:#[:10]:
            body += f"\n\t- {headline}"
        
        topic_message[topic_id] = header + body


    """
    Send Emails
    """
    # Get users that are active
    response = requests.get(f"{api}//users?is_active=true")

    # If there was an error loading users
    if response.status_code != 200:
        raise UserLoadException

    users = dict(response.json())["data"]

    for user in users:
        name = user["first_name"]
        email = user["email"]

        # This is hard coded for now and in the future we will add the feature to allow users to choose their topics
        user_topics = topic_message.keys()

        subject = f"News for {date_slash}"
        body = f"Hi {name} here is your news for {date_slash}!"

        for topic in user_topics:
            body += f"\n\n{topic_message[topic]}"

        send_email(sender_email, sender_password, email, subject, body)



if __name__ == "__main__":
    main()