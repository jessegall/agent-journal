# Agent Journal

## Updating automatically

An installation can keep itself on the newest commit of its branch. A small updater container fetches
`.docker/updater/update.sh` from the repository every minute and runs it; the script checks whether the branch has a
newer commit and, when it has, writes that commit's files into the installation folder, rebuilds, restarts and runs
the migrations. The installation folder is never a git checkout.

To turn it on, run this in the installation folder:

```sh
cat >> .env <<EOF
JOURNAL_ROOT=$(pwd)
JOURNAL_BRANCH=version-6
JOURNAL_PROFILES=contained
EOF
docker compose --profile updater up -d updater
```

`JOURNAL_PROFILES` names the compose profiles the installation runs, space-separated; leave it empty for none. Follow
what it does with `docker compose logs -f updater`, and turn it off with `docker compose stop updater`.

Know what you switch on: the updater holds the Docker socket, which gives it root on the server, and it runs whatever
the branch holds a minute after each push.
