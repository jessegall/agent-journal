# The agent image: every agent's program runs inside one of these containers. No account, login, personal settings or build secret goes into any layer. Pin BASE to a digest when
# building. bubblewrap and socat let the program sandbox its own tools and reach the host's relays; TOOLCHAIN_PACKAGES
# names the apt packages of the project toolchains the main agent's workspace needs, none by default.
ARG BASE=php:8.5-cli-bookworm
ARG GO_IMAGE=golang:1.26.4-bookworm

# The protected-account init and the fixed shell executor, built static for the target architecture.
FROM --platform=$BUILDPLATFORM ${GO_IMAGE} AS protected-start
ARG TARGETOS
ARG TARGETARCH
WORKDIR /src
COPY tools/journal-agent/go.mod tools/journal-agent/go.sum ./
RUN --mount=type=cache,target=/go/pkg/mod go mod download
COPY tools/journal-agent/ ./
RUN --mount=type=cache,target=/go/pkg/mod --mount=type=cache,target=/root/.cache/go-build \
    CGO_ENABLED=0 GOOS=$TARGETOS GOARCH=$TARGETARCH go build -trimpath -o /out/journal-init ./cmd/journal-init \
    && CGO_ENABLED=0 GOOS=$TARGETOS GOARCH=$TARGETARCH go build -trimpath -o /out/journal-exec ./cmd/journal-exec \
    && CGO_ENABLED=0 GOOS=$TARGETOS GOARCH=$TARGETARCH go build -trimpath -o /out/journal-shell ./cmd/journal-shell \
    && CGO_ENABLED=0 GOOS=$TARGETOS GOARCH=$TARGETARCH go build -trimpath -o /out/journal-hook ./cmd/journal-hook \
    && CGO_ENABLED=0 GOOS=$TARGETOS GOARCH=$TARGETARCH go build -trimpath -o /out/journal-mcp ./cmd/journal-mcp

FROM ${BASE}

ARG CLAUDE_CODE_VERSION=2.1.323
ARG CODEX_VERSION=0.165.0
ARG TOOLCHAIN_PACKAGES=""

RUN --mount=type=cache,target=/root/.npm --mount=type=cache,target=/var/cache/apt,sharing=locked --mount=type=cache,target=/var/lib/apt/lists,sharing=locked \
    rm -f /etc/apt/apt.conf.d/docker-clean && apt-get update \
    && apt-get install -y --no-install-recommends git ca-certificates bash nodejs npm bubblewrap socat \
        ${TOOLCHAIN_PACKAGES} \
    && npm install -g "@anthropic-ai/claude-code@${CLAUDE_CODE_VERSION}" "@openai/codex@${CODEX_VERSION}" \
    && apt-get purge -y npm && apt-get autoremove -y

# The relays and the protected stop checks. Both relays are standalone programs that ask the journal themselves with
# the start's grant; the image holds no application console.
COPY --from=protected-start --chown=root:root /out/journal-hook /out/journal-mcp /opt/journal/bin/
COPY --chown=root:root tools/journal-check/journal-check /opt/journal/bin/journal-check
COPY --from=protected-start --chown=root:root /out/journal-init /out/journal-exec /out/journal-shell /opt/journal/bin/
# Claude Code takes a shell only by the name bash: the shell bridge under that name hands every command to the executor.
COPY --from=protected-start --chown=root:root /out/journal-shell /opt/journal/shell/bash
# Root owns the start programs and the shell bridge, and a session can only run them. Claude Code's managed policy is
# handed with each start, never built in (docs/accounts/claude-integration.md, section Managed policy).
RUN chmod 0555 /opt/journal/bin/* /opt/journal/shell/bash

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
# A session's new history volume, mounted in the account folder, takes this folder's owner and mode too: the program's
# user alone, or the program could not keep the conversation a later turn resumes.
RUN mkdir -p /home/journal/.account/projects && chown -R 10001:10001 /home/journal \
    && chmod 0700 /home/journal/.account /home/journal/.account/projects
USER 10001:10001
WORKDIR /workspace
