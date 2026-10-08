# The journal on a server

One journal, its owner only, at a domain of its own. You log in there with one password, use the full
viewer, pair your phone, and start agents that run on the server and push their branches to GitHub.

## What the server needs

- Linux with Docker Engine and the compose plugin; 2 CPUs, 4 GB of memory and 20 GB of disk are enough for one agent.
- Ports 80 and 443 open, and a DNS record for the journal's domain pointing at the server.
- A GitHub repository for the project, and a fine-grained token that may push to it.
- A provider login for the agents: a token from `claude setup-token` on your own machine, or an API key.

## Install

```sh
git clone https://github.com/jessegall/agent-journal && cd agent-journal/docker
cp .env.example .env && chmod 600 .env    # fill in the domain, repository, tokens and a backup password
docker compose up -d
docker compose exec -u gateway journal hosted-journal setup-code
```

Open `https://<your domain>`, type the setup code and choose the owner's password (12 characters or more).

## What runs

- `journal`: the journal and its agents as the user `journal`, and the login page at port 8440 as the user
  `gateway`, run from the root-owned code in /opt. Only `gateway` reads /data/vault, where the password, logins
  and wrong tries are kept. The journal's own server stays on the container's loopback, and the container keeps
  no capability but switching to those two users. It is given only the variables it uses; the backup password
  stays with `backup`.
- `caddy`: TLS for the domain, HSTS, and plain http sent on to https.
- `backup`: a restic snapshot of the journal's volume every day, kept 7 days and 4 weeks. It holds the
  project checkout, the record and the server's home (provider login, password hash, logins, audit log);
  it leaves out the journal's runtime folder. Set `RESTIC_REPOSITORY` to keep it off the server.
- `watchtower`: pulls a new image every hour and restarts the journal on it; the journal upgrades its record on start.
  Images are published only for release tags and signed with cosign:
  `cosign verify --certificate-identity-regexp '^https://github.com/jessegall/agent-journal/' --certificate-oidc-issuer https://token.actions.githubusercontent.com ghcr.io/jessegall/agent-journal:latest`.

## Day to day

- `docker compose logs journal` — the journal's log; logins and refusals are in `/data/vault/*/audit.log` in the container.
- `docker compose exec -u gateway journal hosted-journal logout-everywhere` — end every login.
- `docker compose exec -u gateway journal hosted-journal reset-password` — clear the password; then get a new setup code.
- `./restore.sh [snapshot]` — put a backup back, unpacked beside the journal first so a bad snapshot changes nothing; `docker compose run --rm --entrypoint restic backup snapshots` lists them.
- `./prove.sh` — build the image and prove the install on this machine's Docker, then remove what it made.
