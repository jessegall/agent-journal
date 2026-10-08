FROM python:3.12-slim-bookworm

RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates curl git nodejs npm procps \
    && npm install -g @anthropic-ai/claude-code \
    && npm cache clean --force \
    && rm -rf /var/lib/apt/lists/*

RUN useradd --uid 10001 --home-dir /data/home --no-create-home --shell /bin/sh journal \
    && mkdir -p /data/home /data/project \
    && chown -R journal:journal /data

COPY --chown=root:root src /opt/agent-journal/src
COPY --chown=root:root VERSION /opt/agent-journal/VERSION
COPY --chown=root:root --chmod=755 docker/entrypoint.sh docker/hosted-journal /usr/local/bin/

ENV HOME=/data/home \
    JOURNAL_PROJECT=/data/project \
    JOURNAL_ROOT=/data/project/.journal \
    PYTHONDONTWRITEBYTECODE=1

USER journal
WORKDIR /data/project
VOLUME /data
EXPOSE 8440

HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
    CMD curl -fsS http://127.0.0.1:8440/ready || exit 1

ENTRYPOINT ["entrypoint.sh"]
