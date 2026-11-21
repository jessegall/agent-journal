# Agent Journal

## Updating automatically

An installation can keep itself on the newest commit of its branch. A small updater container fetches
`.docker/updater/update.sh` from the repository every minute and runs it; the script checks whether the branch has a
newer commit and, when it has, writes that commit's files into the installation folder, rebuilds, runs the migrations
when the commit changed one, and restarts. The installation folder is never a git checkout.

The app restarts as a rolling update: the `web` service in front holds the published port, the new app container starts
beside the old one, and the old one stops once the new one is healthy, so the journal keeps answering through an
install. Migrations run before the switch, so a migration must leave the code before it working.

To turn it on, run this in the installation folder:

```sh
cat >> .env <<EOF
JOURNAL_ROOT=$(pwd)
JOURNAL_BRANCH=version-6
EOF
docker compose --profile updater up -d updater
```

A contained installation (`AGENTS_ARRANGEMENT=contained` in `.env`) also gets its contained services and runner image
rebuilt. Follow what it does with `docker compose logs -f updater`, and turn it off with `docker compose stop updater`.

Know what you switch on: the updater holds the Docker socket, which gives it root on the server, and it runs whatever
the branch holds a minute after each push.
