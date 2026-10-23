# The team server of a shared journal: the stdlib-only sync_server and the team's hosted journal behind Caddy, which
# gets and renews the HTTPS certificate for TEAM_ADDRESS, serves its own certificate with TEAM_CERTIFICATE=internal for
# a bare address, whose authority it serves at /root.crt, or serves plain HTTP on port 80 when TEAM_PLAIN_HTTP=1 on a
# private network. The sync paths go to the team server and every other path to the hosted journal, where each person
# signs in with their team account. Everything it keeps, the team's database, the hosted journal and Caddy's
# certificates, lives in the /data volume.
# Built from the repository root: docker build -f docker/team-server/Dockerfile -t agent-journal-team .
FROM caddy:2.8.4 AS caddy

FROM python:3.14.7-slim
RUN apt-get update \
    && apt-get install -y --no-install-recommends git \
    && rm -rf /var/lib/apt/lists/*
COPY --from=caddy /usr/bin/caddy /usr/bin/caddy
COPY src/sync_server /app/src/sync_server
COPY src/journal /app/src/journal
COPY src/supervisor /app/src/supervisor
COPY src/journal.py src/journal.sh /app/src/
COPY src/web/dist /app/src/web/dist
COPY install.sh /app/install.sh
COPY docker/team-server/Caddyfile.https docker/team-server/Caddyfile.plain docker/team-server/Caddyfile.internal docker/team-server/routes.caddy /etc/caddy/
COPY docker/team-server/run.sh docker/team-server/hosted.sh /app/
ENV PYTHONPATH=/app/src PYTHONDONTWRITEBYTECODE=1 XDG_DATA_HOME=/data XDG_CONFIG_HOME=/data/config
VOLUME /data
EXPOSE 80 443
CMD ["bash", "/app/run.sh"]
