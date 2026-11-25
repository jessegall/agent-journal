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

## Rebuilding a development database

A rebuild discards every development row and makes the schema again from the create migrations; how to keep a
snapshot first and the order to rebuild in are in [docs/operations/rebuild.md](docs/operations/rebuild.md).

## Licence

Copyright 2026 Jesse Gall.

The journal is under the [Functional Source License, version 1.1, with Apache 2.0 as its future licence](LICENSE.md)
(FSL-1.1-ALv2). You may use, change and pass it on for any purpose, also inside a company and to build software you
sell, except a competing use: offering the journal, or a version of it, to others as a commercial product or hosted
service. Two years after a version is released, that version is also available under the Apache License 2.0.

A commercial licence without this condition is available from the copyright holder.
