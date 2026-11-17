# The journal and Caddy in one container: Caddy asks for a username and password and passes the request on to the
# journal's viewer, which listens on the container's loopback only. Built from the repository root.
FROM caddy:2.10 AS caddy

FROM python:3.14.7-slim

RUN apt-get update \
    && apt-get install -y --no-install-recommends bash ca-certificates curl gh git nodejs npm procps \
    && npm install -g @anthropic-ai/claude-code \
    && npm cache clean --force \
    && rm -rf /var/lib/apt/lists/*

COPY --from=caddy /usr/bin/caddy /usr/bin/caddy

# The journal and its agents run as journal; Claude Code refuses to skip its permission questions as root.
RUN groupadd --gid 10001 journal \
    && useradd --uid 10001 --gid journal --home-dir /data/home --no-create-home --shell /bin/sh journal

# The installer of version 4 with the code it copies into the project's .journal; with no .git in the image, the
# commit it installs is read from src/commit.
ARG COMMIT=local
COPY install.sh update_steps.json /opt/agent-journal/
COPY src /opt/agent-journal/src
RUN printf '%s\n' "$COMMIT" > /opt/agent-journal/src/commit

COPY --chmod=755 docker/simple/entrypoint.sh /usr/local/bin/entrypoint.sh
COPY docker/simple/Caddyfile /etc/caddy/Caddyfile
COPY docker/simple/time-report-check.py /opt/agent-journal/time-report-check.py

ENV PYTHONDONTWRITEBYTECODE=1 \
    XDG_DATA_HOME=/data/caddy

VOLUME /data
EXPOSE 80 443

ENTRYPOINT ["entrypoint.sh"]
