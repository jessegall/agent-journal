# Codex on the agent base: its native build and code-mode host checked against their digests, its system hooks and
# config, and the shell bridge as the program user's login shell, through which Codex runs the model's commands.
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
COPY --from=download --chown=root:root /out/codex /out/codex-code-mode-host /usr/local/bin/
# The folders exist first, as a COPY --chmod would give the files' read-only mode to the folders it creates.
RUN install -d -o root -g root -m 0755 /etc/codex /etc/journal/driver
COPY --chown=root:root --chmod=0444 hooks.json config.toml /etc/codex/
COPY --chown=root:root --chmod=0444 programs.txt /etc/journal/driver/programs.txt
# Codex runs the model's commands through this user's login shell; its hooks go through the relay's hook tool.
RUN usermod --shell /opt/journal/shell/bash journal
USER 10001:10001
RUN sh /opt/journal/checks/driver-image.sh codex 2 "$VERSION" /etc/journal/driver/programs.txt /etc/codex -- claude
