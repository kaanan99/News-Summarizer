import os
import smtplib
from email.mime.text import MIMEText
import requests
from datetime import datetime
import string
from dotenv import load_dotenv
from zoneinfo import ZoneInfo


def create_html(header, headlines):
    headlines_html = ''.join(f"<li>{point}</li>" for point in headlines)
    html_section = f"""
    <div style="margin: 20px 0;">
        <h2 style="font-size: 1.5em; color: #333;">{header}</h2>
        <ul style="margin-left: 20px; list-style-type: disc;">
            {headlines_html}
        </ul>
    </div>
    """
    return html_section


def create_email_body(header, htmls):
    main_header = f"""
    <h1 style="text-align: center; font-size: 2em; color: #007BFF; margin-top: 20px;">
        {header}
    </h1>
    """
    message = "".join(htmls)
    full_html = f"""
    <html>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
            {main_header}
            {message}
            <p style="text-align: center; margin-top: 30px;">Thank you for staying updated!</p>
        </body>
    </html>
    """
    return full_html


def send_email(subject, message_text, sender, recipient, password):
    message = MIMEText(message_text, 'html')
    message['to'] = recipient
    message['from'] = sender
    message['subject'] = subject
    with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp_server:
       smtp_server.login(sender, password)
       smtp_server.sendmail(sender, recipient, message.as_string())
    print("Message sent!")


def main():
    # Get current date and variations
    current_date = datetime.now(ZoneInfo('America/Los_Angeles'))
    date_slash = current_date.strftime("%m/%d/%Y")
    date_dash = current_date.strftime("%Y-%m-%d")
    date_dash = "2024-11-22"

    # Load .env file and get environment variables
    load_dotenv()
    sender_email = os.getenv("SENDER_EMAIL")
    api = os.getenv("API")
    sender_email = os.getenv("SENDER_EMAIL")
    sender_password = os.getenv("SENDER_PASSWORD")

    # Get Topics
    response = requests.get(f"{api}/topics")
    if response.status_code != 200:
        print("Error loading topics")
        return
    topics = dict(response.json())["data"]

    topic_headlines = {}
    topic_map = {}

    for topic in topics:
        topic_id = topic["tid"]
        topic_name = topic["topic_type"]
        topic_headlines[topic_id] = []
        topic_map[topic_id] = topic_name

    # Get Generated Headlines
    response = requests.get(f"{api}/generatedHeadline?date_added={date_dash}")
    if response.status_code != 200:
        print("Error loading headlines")
        return
    headlines = dict(response.json())["data"]

    if len(headlines) == 0:
        print("No headlines to send")
        return

    for headline in headlines:
        topic_id = headline["tid"]
        topic_headlines[topic_id].append(headline["headline_text"])

    # Generate HTML bodies for each topic:
    topic_message = {}
    for topic_id in topic_map.keys():
        topic_name = topic_map[topic_id]
        if topic_name == "us":
            topic_name = topic_name.upper()
        else:
            topic_name = string.capwords(topic_name)

        header = f"{topic_name} News:"
        headlines = topic_headlines[topic_id]
        topic_message[topic_id] = create_html(header, headlines)

    # Get users that are active
    response = requests.get(f"{api}/users?is_active=true")
    if response.status_code != 200:
        print("Error loading users")
        return
    users = dict(response.json())["data"]


    for user in users:
        name = user["first_name"]
        email = user["email"]

        user_topics = topic_message.keys() # This is hard coded to include all the topics for now
        subject = f"News for {date_slash}"
        email_header = f"Hi {name}, here is your news for {date_slash}!"
        topics_content = [topic_message[topic_id] for topic_id in user_topics]
        email_body = create_email_body(email_header, topics_content)
        
        send_email(subject, email_body, sender_email, email, sender_password)


if __name__ == "__main__":
    main()
