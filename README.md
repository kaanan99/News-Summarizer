# News Summarizer
This project parses headlines from Google News and summarizes them. The summary is sent by email to those subscribed to the newsletter.

## Running Docker
### Run API
1. Install [Docker](https://www.docker.com/)
2. Build image:
```bash
docker build -t news_summarizer .
```
3. Run container:
```
docker run --rm -p -d 3000:3000 news_summarizer
```
**NOTE:** The `--rm` flag will delete the container after it has stopped running

### Run Scripts
1. Build image:
```bash
docker build -f Dockerfile.script -t scripts .
```
2. Run container:
```bash
docker run -d -v scripts/logs:logs scripts
```
Make sure that you are in the home directory of this repo!