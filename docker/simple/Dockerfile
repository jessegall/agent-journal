# The journal and Caddy in one container: Caddy asks for a username and password and passes the request on to the
# journal's viewer, which listens on the container's loopback only. Built from the repository root.
FROM caddy:2.10@sha256:c3d7ee5d2b11f9dc54f947f68a734c84e9c9666c92c88a7f30b9cba5da182adb AS caddy

# the Docker client and its compose plugin, for the Docker daemon that runs beside the journal
FROM docker:27-cli@sha256:851f91d241214e7c6db86513b270d58776379aacc5eb9c4a87e5b47115e3065c AS docker

FROM python:3.14.7-slim@sha256:51dafde81dbdb6ebde285137a295cf18a47ca95234fe388a343719cb97305b3d

# Claude Code at a version chosen here; raise it to take a newer one.
ARG CLAUDE_CODE_VERSION=2.1.326

RUN apt-get update \
    && apt-get install -y --no-install-recommends bash ca-certificates curl gh git nodejs npm procps \
    && npm install -g "@anthropic-ai/claude-code@${CLAUDE_CODE_VERSION}" \
    && npm cache clean --force \
    && rm -rf /var/lib/apt/lists/*

COPY --from=caddy /usr/bin/caddy /usr/bin/caddy
COPY --from=docker /usr/local/bin/docker /usr/local/bin/docker
COPY --from=docker /usr/local/libexec/docker/cli-plugins/docker-compose /usr/local/libexec/docker/cli-plugins/docker-compose
# Caddy runs as a user of its own, on ports a user without privileges may take: the copy drops the file capability the
# official binary carries, which a container with no new privileges refuses to run.
RUN cp /usr/bin/caddy /usr/bin/caddy.plain && mv -f /usr/bin/caddy.plain /usr/bin/caddy \
    && groupadd --system caddy && useradd --system --gid caddy --home-dir /data/caddy --no-create-home --shell /usr/sbin/nologin caddy

# The journal and its agents run as journal; Claude Code refuses to skip its permission questions as root.
RUN groupadd --gid 10001 journal \
    && useradd --uid 10001 --gid journal --home-dir /data/home --no-create-home --shell /bin/sh journal \
    && find / -xdev -perm /6000 -type f -exec chmod a-s {} +

# The installer of version 4 with the code it copies into the project's .journal; with no .git in the image, the
# commit it installs is read from src/commit.
ARG COMMIT=local
COPY install.sh update_steps.json /opt/agent-journal/
COPY src /opt/agent-journal/src
RUN printf '%s\n' "$COMMIT" > /opt/agent-journal/src/commit

COPY --chmod=755 docker/simple/entrypoint.sh /usr/local/bin/entrypoint.sh
COPY docker/simple/Caddyfile /etc/caddy/Caddyfile
COPY --chmod=644 docker/simple/login_gate.py /usr/local/lib/login_gate.py

ENV PYTHONDONTWRITEBYTECODE=1

VOLUME /data
EXPOSE 8080 8443

ENTRYPOINT ["entrypoint.sh"]
