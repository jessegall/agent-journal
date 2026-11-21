# The updater: the Docker client with compose, git and python, and nothing else. It fetches update.sh from the
# repository every minute and runs it.
FROM docker:29-cli
RUN apk add --no-cache git python3 curl
COPY .docker/updater/loop.sh /usr/local/bin/journal-updater
ENTRYPOINT ["sh", "/usr/local/bin/journal-updater"]
