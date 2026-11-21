# The agent image: every agent's program runs inside one of these containers (doc 14, sections 58 and 59; doc 61
# decision 9). No account, login, personal settings or build secret goes into any layer. Pin BASE to a digest when
# building. bubblewrap and socat let the program sandbox its own tools and reach the host's relays; TOOLCHAIN_PACKAGES
# names the apt packages of the project toolchains the main agent's workspace needs, none by default.
ARG BASE=php:8.5-cli-bookworm
ARG GO_IMAGE=golang:1.26.4-bookworm

# The protected-account init and the fixed shell executor (doc 78), built static for the target architecture.
FROM --platform=$BUILDPLATFORM ${GO_IMAGE} AS protected-start
ARG TARGETOS
ARG TARGETARCH
WORKDIR /src
COPY tools/journal-agent/go.mod tools/journal-agent/go.sum ./
RUN go mod download
COPY tools/journal-agent/ ./
RUN CGO_ENABLED=0 GOOS=$TARGETOS GOARCH=$TARGETARCH go build -trimpath -o /out/journal-init ./cmd/journal-init \
    && CGO_ENABLED=0 GOOS=$TARGETOS GOARCH=$TARGETARCH go build -trimpath -o /out/journal-exec ./cmd/journal-exec

FROM ${BASE}

ARG CLAUDE_CODE_VERSION=2.1.323
ARG CODEX_VERSION=0.165.0
ARG TOOLCHAIN_PACKAGES=""

RUN apt-get update \
    && apt-get install -y --no-install-recommends git ca-certificates bash nodejs npm bubblewrap socat \
        ${TOOLCHAIN_PACKAGES} \
    && npm install -g "@anthropic-ai/claude-code@${CLAUDE_CODE_VERSION}" "@openai/codex@${CODEX_VERSION}" \
    && npm cache clean --force \
    && apt-get purge -y npm && apt-get autoremove -y && rm -rf /var/lib/apt/lists/*

# The protected relay console: the hook and MCP relays and the transport-only artisan commands, with no .env and no
# database; and the protected stop checks.
COPY --chown=root:root bin/journal-hook bin/journal-mcp /opt/journal/bin/
COPY --chown=root:root tools/journal-check/journal-check /opt/journal/bin/journal-check
COPY --from=protected-start --chown=root:root /out/journal-init /out/journal-exec /opt/journal/bin/
RUN chmod 0555 /opt/journal/bin/*

# The program's user 10001 alone reads the sign-in; under the protected-account profile the commands the model runs go
# through the executor's user 10002, and the init drops to 10003. The program and the executor share the workspace
# through the group journal-work (10010), and no launcher, setting or hook lies under a path either can write.
RUN groupadd --gid 10001 journal && useradd --uid 10001 --gid 10001 --home-dir /home/journal --no-create-home journal \
    && groupadd --gid 10002 journal-tools \
    && useradd --uid 10002 --gid 10002 --home-dir /home/journal-tools --create-home journal-tools \
    && groupadd --gid 10003 journal-init \
    && useradd --uid 10003 --gid 10003 --no-create-home --home-dir /nonexistent --shell /usr/sbin/nologin journal-init \
    && groupadd --gid 10010 journal-work \
    && usermod --append --groups journal-work journal && usermod --append --groups journal-work journal-tools
# A new workspace volume takes this folder's owner and mode: the program's user, the shared group, and new files
# keeping the group.
RUN mkdir -p /workspace && chown 10001:10010 /workspace && chmod 2770 /workspace
USER 10001:10001
WORKDIR /workspace
