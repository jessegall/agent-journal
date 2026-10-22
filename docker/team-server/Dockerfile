# The team server of a shared journal: the stdlib-only sync_server behind Caddy, which gets and renews the HTTPS
# certificate for TEAM_ADDRESS, or serves plain HTTP on port 80 when TEAM_PLAIN_HTTP=1 on a private network.
# Everything it keeps, the team's database and Caddy's certificates, lives in the /data volume.
# Built from the repository root: docker build -f docker/team-server/Dockerfile -t agent-journal-team .
FROM caddy:2.8.4 AS caddy

FROM python:3.13.1-slim
COPY --from=caddy /usr/bin/caddy /usr/bin/caddy
COPY src/sync_server /app/sync_server
COPY docker/team-server/Caddyfile.https docker/team-server/Caddyfile.plain /etc/caddy/
COPY docker/team-server/run.sh /app/run.sh
ENV PYTHONPATH=/app PYTHONDONTWRITEBYTECODE=1 XDG_DATA_HOME=/data XDG_CONFIG_HOME=/data/config
VOLUME /data
EXPOSE 80 443
CMD ["bash", "/app/run.sh"]
