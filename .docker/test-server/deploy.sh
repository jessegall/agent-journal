#!/bin/sh
# The test server's deploy: build the application images and the runner, pin the runner, restart what changed and
# run the migrations. update.sh calls it for each new commit; it can also be run by hand.
set -eu
cd "${DEPLOY_ROOT:-/srv/journal-test}"
start=$(date +%s)
echo "$(date +%T) building the application images"
docker compose --progress=quiet build app share
echo "$(date +%T) building the runner"
sh .docker/helper/build.sh linux/amd64 runner > /tmp/runner-build.log 2>&1
runner=$(python3 -c 'import json; print(json.load(open("docs/accounts/docker-images.json"))["images"][-1]["reference"])')
sed -i "s|^RUNNER_IMAGE=.*|RUNNER_IMAGE=$runner|" .env
echo "$(date +%T) restarting"
docker compose --profile contained up -d --wait --wait-timeout 240 >/tmp/deploy-up.log 2>&1 || true
echo "$(date +%T) migrating"
docker compose exec -T app php artisan migrate --force
docker image prune -f >/dev/null
echo "deploy took $(( $(date +%s) - start )) s; runner $runner"
docker compose --profile contained ps -a --format "{{.Service}} {{.Status}}"
