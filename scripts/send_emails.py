import os
import pickle
import google.auth
import google.auth.transport.requests
from google.auth.exceptions import RefreshError
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import requests
from datetime import datetime
import string
from dotenv import load_dotenv
from email.mime.text import MIMEText
import base64
from zoneinfo import ZoneInfo

# Define SCOPES for sending email
SCOPES = ['https://www.googleapis.com/auth/gmail.send']

def authenticate_gmail():
    creds = None
    # Check if token.pickle exists and load the stored credentials from it
    if os.path.exists('token.pickle'):
        with open('token.pickle', 'rb') as token:
            creds = pickle.load(token)
    
    # If there are no (valid) credentials available, let the user log in.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            try:
                creds.refresh(google.auth.transport.requests.Request())
            except RefreshError:
                print("The credentials have expired and could not be refreshed. Re-authenticating...")
                creds = None
        if not creds:
            flow = InstalledAppFlow.from_client_secrets_file(
                'credentials.json', SCOPES)  # Path to your credentials.json
            creds = flow.run_console()
        
        # Save the credentials for the next run
        with open('token.pickle', 'wb') as token:
            pickle.dump(creds, token)

    service = build('gmail', 'v1', credentials=creds)
    return service

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

def create_message(sender, to, subject, message_text):
    
    message = MIMEText(message_text, 'html')
    message['to'] = to
    message['from'] = sender
    message['subject'] = subject
    raw = base64.urlsafe_b64encode(message.as_bytes()).decode()
    return {'raw': raw}

def send_email(service, sender, to, subject, message_text):
    message = create_message(sender, to, subject, message_text)
    try:
        message = (service.users().messages().send(userId="me", body=message).execute())
        print(f"Message sent: {message['id']}")
        return message
    except Exception as error:
        print(f"An error occurred while sending an email to {message['id']}: {error}")


def main():
    # Get current date and variations
    current_date = datetime.now(ZoneInfo('America/Los_Angeles'))
    date_slash = current_date.strftime("%m/%d/%Y")
    date_dash = current_date.strftime("%Y-%m-%d")

    # Load .env file and get environment variables
    load_dotenv()
    sender_email = os.getenv("SENDER_EMAIL")
    api = os.getenv("API")

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

    # Authenticate and get Gmail API service
    service = authenticate_gmail()  

    for user in users:
        name = user["first_name"]
        email = user["email"]

        user_topics = topic_message.keys() # This is hard coded to include all the topics for now
        subject = f"News for {date_slash}"
        email_header = f"Hi {name}, here is your news for {date_slash}!"
        topics_content = [topic_message[topic_id] for topic_id in user_topics]
        email_body = create_email_body(email_header, topics_content)
        
        send_email(service, sender_email, email, subject, email_body)


if __name__ == "__main__":
    main()
