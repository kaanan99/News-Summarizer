# News Summarizer
This project parses headlines from Google News and summarizes them. The summary is sent by email to those subscribed to the newsletter.

## Running Docker
1. Install [docker](https://www.docker.com/)
2. Build image:
```bash
docker build -t news_summarizer .
```
3. Run container:
```
docker run --rm -p 3000:3000 news_summarizer
```
**NOTE:** The `--rm` flag will delete the container after it has stopped running