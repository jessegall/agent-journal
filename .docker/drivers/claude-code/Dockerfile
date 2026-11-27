# Claude Code on the agent base: its native build checked against its digest, its managed policy with the hooks, the
# journal's MCP descriptor and the variables only Claude Code reads.
ARG BASE
FROM ${BASE} AS download
ARG VERSION
ARG TARGETARCH
USER root
RUN apt-get update && apt-get install -y --no-install-recommends curl ca-certificates
COPY install.sh digests.txt /driver/
RUN sh /driver/install.sh "$TARGETARCH" "$VERSION" /out

FROM ${BASE}
ARG VERSION
USER root
COPY --from=download --chown=root:root /out/claude /usr/local/bin/claude
# The folders exist first, as a COPY --chmod would give the files' read-only mode to the folders it creates.
RUN install -d -o root -g root -m 0755 /etc/claude-code /etc/journal/driver
COPY --chown=root:root --chmod=0444 managed-settings.json /etc/claude-code/managed-settings.json
COPY --chown=root:root --chmod=0444 mcp.json programs.txt /etc/journal/driver/
# Claude Code takes its shell from CLAUDE_CODE_SHELL, and IS_SANDBOX lets it skip its permission prompts in a container
# whose commands the executor already confines.
ENV CLAUDE_CODE_SHELL=/opt/journal/shell/bash IS_SANDBOX=1
USER 10001:10001
RUN sh /opt/journal/checks/driver-image.sh claude 1 "$VERSION" /etc/journal/driver/programs.txt /etc/claude-code -- codex
