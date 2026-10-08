FROM python:3.12-slim-bookworm@sha256:34386ef0cb081344d7ec1c103ba398e6e9f64e9ab3a1509accc92a4e24a07258

RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates curl git nodejs npm procps \
    && npm install -g @anthropic-ai/claude-code@2.1.293 \
    && npm cache clean --force \
    && rm -rf /var/lib/apt/lists/*

# Two users share the record through the journal group: journal runs the server and its agents, gateway runs
# the login page and alone reads its password and logins.
RUN groupadd --gid 10001 journal \
    && useradd --uid 10001 --gid journal --home-dir /data/home --no-create-home --shell /bin/sh journal \
    && useradd --uid 10002 --gid journal --home-dir /data/gateway --no-create-home --shell /usr/sbin/nologin gateway \
    && mkdir -p /data/home /data/project /data/gateway /data/vault \
    && chown journal:journal /data/home /data/project \
    && chown gateway:journal /data/gateway /data/vault \
    && chmod 700 /data/home /data/gateway /data/vault \
    && chmod 2770 /data/project

COPY --chown=root:root src /opt/agent-journal/src
COPY --chown=root:root VERSION /opt/agent-journal/VERSION
COPY --chown=root:root --chmod=755 docker/entrypoint.sh docker/hosted-journal /usr/local/bin/

ENV JOURNAL_PROJECT=/data/project \
    JOURNAL_ROOT=/data/project/.journal \
    AGENT_JOURNAL_VAULT=/data/vault \
    PYTHONDONTWRITEBYTECODE=1

WORKDIR /data/project
VOLUME /data
EXPOSE 8440

HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
    CMD curl -fsS http://127.0.0.1:8440/ready || exit 1

ENTRYPOINT ["entrypoint.sh"]
