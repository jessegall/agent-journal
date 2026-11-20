# The agent image: every agent's program runs inside one of these containers (doc 14, sections 58 and 59; doc 61
# decision 9). No account, login, personal settings or build secret goes into any layer. Pin BASE to a digest when
# building. bubblewrap and socat let the program sandbox its own tools and reach the host's relays; TOOLCHAIN_PACKAGES
# names the apt packages of the project toolchains the main agent's workspace needs, none by default.
ARG BASE=php:8.5-cli-bookworm
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
RUN chmod 0555 /opt/journal/bin/*

RUN groupadd --gid 10001 journal && useradd --uid 10001 --gid 10001 --home-dir /home/journal --no-create-home journal
USER 10001:10001
WORKDIR /workspace
