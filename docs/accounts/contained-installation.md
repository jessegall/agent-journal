# Installing the journal in containers on a server

This is the contained arrangement: the journal, its sign-in service and every agent run in containers on one server,
and agents run in a separate Docker daemon that holds only agent containers. Every user runs their own journal on a
machine of their own, so a server you run for yourself counts as yours: it offers the same sign-in methods as the Mac,
Claude's browser sign-in with a pasted code included. A journal hosted for other users is not supported.

Follow the steps in order on a fresh server that has Docker and nothing else.

On a development machine, `sh scripts/local-host.sh` does all of this in one go: it builds the images for the machine,
writes the contained settings into `.env`, enrolls a local host and starts everything, so sign-ins and agent starts work
locally. `sh scripts/local-host.sh --fresh` first removes the local containers, the database and the host's enrolment,
for a clean demo. The development override runs the agent daemon rootful, since OrbStack and Docker Desktop have no
Sysbox.

In development, code changes reach the running services without an image build. PHP reloads through Octane's watcher
and the frontend through Vite. For the Go host, `sh scripts/dev-watch-host.sh` builds `journal-agent` on the machine
with Go's caches whenever a file under `tools/journal-agent` changes, and restarts the host and the sign-in service,
which the development override points at that binary. The same watcher builds the agent image's own programs
(journal-init, journal-exec, the shell bridge, journal-hook and journal-mcp) into `.build/dev/protected`, and the local
host mounts them read-only over the image's copies in every session container it starts, so the next protected start
runs the change. Only a change to `.docker/helper` or `tools/journal-check` rebuilds the agent image, and
`sh scripts/local-host.sh` does that by itself; the cached layers keep it quick. A production host is never given
the folder and runs the verified image alone. Every build ends with
`.docker/helper/prune.sh`, which removes untagged images and build cache older than a week or past 10 GB, and keeps
the cache the next build reuses.

## 1. What the server needs

- **Linux on x86_64 with Docker Engine 28 or later** and the Compose plugin. The test server runs Ubuntu 26.04 (kernel
  7.0) with Docker 29.
- **Docker's classic image store.** The agent images are loaded from saved archives, which the containerd image store
  handles differently. In `/etc/docker/daemon.json`:

  ```json
  {
      "features": { "containerd-snapshotter": false },
      "log-driver": "json-file",
      "log-opts": { "max-size": "10m", "max-file": "3" },
      "builder": {
          "gc": {
              "enabled": true,
              "defaultKeepStorage": "4GB",
              "policy": [
                  { "keepStorage": "2GB", "filter": ["unused-for=168h"] },
                  { "keepStorage": "4GB", "all": true }
              ]
          }
      }
  }
  ```

  The `builder.gc` part keeps the build cache from filling the disk; each install also removes the images a build
  replaced. Restart Docker after changing the file.
- **Sysbox, for the agent daemon.** Agent containers carry budgets (processes, memory, CPU). The agent daemon enforces
  them only when it owns its cgroups, which a rootful Docker-in-Docker under Sysbox does; the rootless image accepts the
  budgets and ignores them, so the agent host refuses to start agents on it. Install Sysbox CE 0.7.1 or later from its
  release package, with no containers on the server yet:

  ```sh
  curl -fsSLO https://downloads.nestybox.com/sysbox/releases/v0.7.1/sysbox-ce_0.7.1-0.linux_amd64.deb
  apt-get install -y ./sysbox-ce_0.7.1-0.linux_amd64.deb
  ```

  Installing it restarts Docker and adds the `sysbox-runc` runtime (`docker info` lists it). On Ubuntu 26.04, Sysbox's
  FUSE mounts need `fusermount3` in AppArmor complain mode:

  ```sh
  apt-get install -y apparmor-utils
  aa-complain /etc/apparmor.d/fusermount3
  systemctl restart sysbox
  ```

- **Disk:** at least 20 GB free for the images, the build cache and the agent daemon's data.

## 2. The files

Put the repository's files in an installation folder, for example `/srv/journal`, and work there. The folder does not
need to be a git checkout.

```sh
cp .env.example .env
mkdir -p secrets
```

## 3. The settings in `.env`

Fill in, beside the usual `APP_KEY`, `APP_URL`, database and Reverb values:

| Variable | Value |
|---|---|
| `COMPOSE_FILE` | `compose.yaml`. Never the development override: it mounts the project folder over the image's code. Add your own overlay after a colon when you need one. |
| `JOURNAL_OWNER_EMAIL` | The email you sign in to the journal with. |
| `AGENTS_ARRANGEMENT` | `contained` |
| `AGENTS_INSTALLATION_NAME` | A short name for this journal; it prefixes its containers, networks and volumes on the agent daemon. |
| `AGENT_DAEMON_IMAGE` | `docker:28-dind` |
| `AGENT_DAEMON_RUNTIME` | `sysbox-runc` |
| `AGENT_DAEMON_DATA` | `/var/lib/docker` |
| `AGENT_DAEMON_SOCKET_GROUP` | `1000` |
| `ACCOUNTS_ROOT` | `/srv/journal/accounts` |
| `AGENT_IMAGE`, `RUNNER_IMAGE` | The two image ids from step 4. |
| `AGENTS_HOST_ID` | The host id from step 6. |
| `AGENTS_WORKSPACES`, `AGENTS_WORKSPACES_FOLDER` | Optional: each environment's workspace, from Git or a server folder (step 5). |
| `APP_PORT` | The local port the journal answers on, `54700` unless you change it. |

`AGENT_DAEMON_APPARMOR` names an AppArmor profile only for the rootless daemon on a host that restricts unprivileged
user namespaces; under Sysbox leave it unset.

## 4. The images

```sh
.docker/helper/build.sh
```

builds the agent image and the runner image, saves them under `images/`, and records their ids in
`docs/accounts/docker-images.json`. Put the two ids in `.env` as `AGENT_IMAGE` and `RUNNER_IMAGE`, and load the runner
image into the server's Docker as well (`docker load -i images/runner-linux-amd64.tar`): the sign-in service and the
agent host run from it. The agent daemon loads both from `images/` by itself when it starts, and keeps no other image.

## 5. Secrets and workspaces

- `secrets/journal_host_secret`: the agent host's enrollment secret from step 6, owned by uid 10001, mode 0600.
- For a workspace from Git: a deploy key per environment as `secrets/deploy_key_<environment>` (same owner and mode),
  named in `AGENTS_WORKSPACES` as `"deploy_key_secret": "deploy_key_<environment>"`. The repository's host must be on
  the egress list (step 8).
- For a workspace from a server folder: `AGENTS_WORKSPACES_FOLDER` holds one folder per environment, owned by uid 10001.

## 6. Start it

```sh
docker compose up -d --wait
docker compose exec app php artisan agents:host-enroll <installation name> --contained --root /workspace
```

The second command prints the host id and the secret: the id goes in `.env` as `AGENTS_HOST_ID`, the secret in
`secrets/journal_host_secret`. Then start the contained services:

```sh
docker compose --profile contained up -d --wait
```

`agent-host-enroll` enrolls the host on its first run and does nothing after. Within two minutes every service is
running, and these report healthy: `app`, `reverb`, `share`, `postgres`, `redis`, `egress`, `agent-docker`,
`agent-host` and `accounts`. `accounts-volume`, `agent-images` and `agent-host-enroll` run once and exit with code 0.

Then activate the built-in profiles, so a session can start as the main agent and its helpers:

```sh
docker compose exec -T app php artisan profile:activate
```

It lists each profile with its revision. The updater runs it again on every install, which leaves an unchanged profile
as it is.

## 7. Reach it from a browser

The journal answers on `127.0.0.1:${APP_PORT}` only. Put a TLS reverse proxy in front of it, with the websocket paths
`/app` and `/apps` going to Reverb. With Caddy on the server, and Reverb published on a local port by your overlay:

```
journal.example.com {
    @websocket path /app/* /apps/*
    reverse_proxy @websocket 127.0.0.1:54704
    reverse_proxy 127.0.0.1:54700
}
```

```yaml
# compose.server.yaml, added to COMPOSE_FILE as compose.yaml:compose.server.yaml
services:
    reverb:
        ports:
            - "127.0.0.1:54704:8080"
```

Without a domain of your own, the share service gives the journal a public address through a gateway instead: open
Settings, Share gateways, and configure one.

Open the address, sign in as the owner, then Accounts, Add account, and sign in to Claude Code or Codex. The new
account shows as signed in.

### Install lines need the journal's own address, with no redirect

An install line (`curl -fsSL https://<origin>/install/<ticket> | sh`) carries a live secret in its URL, and the
installer downloads every release file from that same origin. Before switching on Connect a project:

- Set `agents.server_origin` to the canonical HTTPS origin users copy lines for, such as
  `https://journal.example.com`, with no path.
- Let that origin, and the first proxy in front of it, serve `/install/*` and `/releases/*` itself: no redirect from
  `http://` to `https://`, from a bare domain to `www.`, or to a CDN. The installer follows none and stops with "the
  journal must serve it directly"; `journal-agent install-release` stops with a release-verification error and
  installs nothing.
- Keep the proxy's access log from recording the path of `/install/*`, or strip its last segment, as the journal's
  own log does: the journal answers it with `Cache-Control: no-store, private` and redacts the ticket, the relay
  credential and the device code from every log record it writes.
- Check it on the deployed server, from outside, before you issue the first line:
  `curl -sS -o /dev/null -w '%{http_code}\n' https://journal.example.com/releases/current/manifest.json` must print
  `200`, not a `30x`.

## 8. Outgoing traffic

The sign-in service reaches the internet only through the `egress` proxy, which allows the hosts in
`.docker/egress/allowed-domains.txt`: the ones the sign-ins were seen to reach. To let a workspace clone from a Git host,
add that host on its own line and restart the proxy (`docker compose restart egress`).

## 9. After a reboot or a recreate

Every service restarts by itself. A recreated `agent-docker` keeps its data in its volume; when that volume is new, the
pinned images are loaded again from `images/`. After changing `.env`, run `docker compose --profile contained up -d
--wait` again. To keep the installation on the newest commit of its branch, see "Updating automatically" in the
README.

## What does not run yet

- Codex starts in containers are refused until the provider transport exists (task 1503); Codex accounts sign in and
  are kept, and Claude Code agents run in containers.
- Starting an agent from the browser comes with Home's start actions (plan 42).
