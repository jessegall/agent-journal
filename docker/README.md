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
docker compose up -d                       # Caddy, backups and the updater, which starts the journal once its image is verified
docker compose logs -f updater             # until it says it deployed the journal
docker compose exec -u gateway journal hosted-journal setup-code
```

The journal is started only by the updater, on the exact digest it verified, so a later `docker compose up` never
rolls it back to an unchecked image. To run an image of your own, name it: `JOURNAL_IMAGE=<image> COMPOSE_PROFILES=journal docker compose up -d`.

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
  it leaves out the journal's runtime folder and the secrets' values in /data/secrets. Set `RESTIC_REPOSITORY`
  to keep it off the server.
- `updater`: once an hour, checks with cosign that `ghcr.io/jessegall/agent-journal:latest` was signed by this
  repository's release workflow, and only then restarts the journal on exactly that digest; the journal upgrades its
  record on start. An image without that signature is never deployed. To check one by hand:
  `cosign verify --certificate-identity-regexp '^https://github.com/jessegall/agent-journal/' --certificate-oidc-issuer https://token.actions.githubusercontent.com ghcr.io/jessegall/agent-journal:latest`.
- `watchtower`: keeps Caddy up to date.

## What the two users protect, and what they do not

The login page runs as `gateway`; the journal and every agent run as `journal`. An agent, or anyone who takes one
over, cannot:

- read or change the owner's password, the logins, the wrong tries, the phone keys or the login page's settings;
- make a setup code, reset the password or clear the wrong tries;
- change the login page's code or take its port, even while it restarts;
- get the server to run, upgrade, stop or update the journal from outside.

It can do everything the `journal` user can: read and change the record, the project and its git history, push
with `GITHUB_TOKEN`, use the provider login, and change the journal's own server and viewer, which run from the
project's `.journal` folder. Behind the login it can therefore show the owner anything, including a page that looks
like a login form at the real address. Treat a server agent as able to act as you inside the journal; the login page
and its vault are the only things kept from it.

## Secrets on the server

The server keeps its own secrets file in /data/secrets, one per project, readable by `journal` alone. You fill in
the values in the viewer behind your login, as on your own machine. No backup and no copy of the project or the
record holds them, and a restore leaves them where they are; a new server starts with none. A local agent working
on this journal uses the secrets file of its own machine, never the server's. The agents on the server get a value
only through `journal secret run`, and the file is refused to their tools; since they run as `journal` too, that
refusal stops a mistake, not an agent taken over on purpose.

## Logs, health and alerts

- Logs: `docker compose logs journal` is the journal's output; `docker compose logs caddy` has every request. Logins and refusals are in `/data/vault/*/audit.log` in the journal container, and the journal's own service logs are in `/data/project/.journal/runtime`.
- Health: `https://<your address>/ready` answers 200 `ok` while the journal answers, and 503 with the reason when it does not or when the disk is nearly full. Docker's own health check asks the same address, so `docker compose ps` shows `unhealthy` too, and an outside monitor can ask it as well.
- Alerts: when free space on the volume drops to 128 MB, the journal puts a message in the viewer, once, and again after the space has come back and gone again. The tunnel's watchdog keeps the same kind of alert for its own address.

## Limits

- Memory: the journal container stops at 4 GB (`JOURNAL_MEMORY` in `.env`), Caddy at 256 MB, the backup at 512 MB.
- Logs: Docker keeps five files of 10 MB per container, and the journal cuts each of its own logs to its last megabyte every hour.
- Disk: once the volume has less than 64 MB free, the journal refuses every write with the answer "the server's disk is nearly full", so no file is left half written. Free some space and writes work again at once.

## Day to day

- `docker compose logs journal` — the journal's log; logins and refusals are in `/data/vault/*/audit.log` in the container.
- `docker compose exec -u gateway journal hosted-journal logout-everywhere` — end every login.
- `docker compose exec -u gateway journal hosted-journal reset-password` — clear the password; then get a new setup code.
- Upgrading and taking down are done by the owner in the viewer. The updater checks the signed image every hour and says in the viewer when a newer one is out; it deploys that digest only when the owner presses Upgrade. Taking down logs out every browser and phone at once, then stops the journal and makes a final backup, kept past the usual pruning (`docker compose run --rm --entrypoint restic backup snapshots --tag final`). The data stays in the volume. `./restore.sh` of that backup, or removing the folder with `docker compose exec updater rm -rf /data/updater`, lets the updater start the journal again.
- `./restore.sh [snapshot]` — put a backup back, unpacked beside the journal first so a bad snapshot changes nothing; `docker compose run --rm --entrypoint restic backup snapshots` lists them.
- `./prove.sh` — build the image and prove the install on this machine's Docker, then remove what it made.
