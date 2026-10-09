#!/bin/sh
# Proves the install on this machine's own Docker, then removes everything it made:
# build, start, first-time setup, login, refusals, an unprivileged server, secrets only it can read,
# a backup that leaves out the server's secrets, and a restore that brings back what was lost and keeps them.
set -eu
cd "$(dirname "$0")"
export COMPOSE_PROJECT_NAME=journal-proof COMPOSE_PROFILES=journal JOURNAL_IMAGE=agent-journal:local HTTP_PORT=18080 HTTPS_PORT=18443 JOURNAL_ADDRESS=localhost
WORK="$(mktemp -d)"
export JOURNAL_ENV_FILE="$WORK/.env" BACKUP_FOLDER="$WORK/backups"
printf 'JOURNAL_ADDRESS=localhost\nRESTIC_PASSWORD=proof-only-password\n' > "$JOURNAL_ENV_FILE"
SITE="https://localhost:$HTTPS_PORT"
JAR="$WORK/cookies"
PASSWORD="a proof of the install"
compose() { docker compose "$@"; }
pass() { echo "ok   $1"; }
fail() { echo "FAIL $1"; compose logs --tail 40 journal >&2 || true; exit 1; }
cleanup() { compose --profile journal --profile restore down -v --remove-orphans >/dev/null 2>&1 || true; rm -rf "$WORK"; }
trap cleanup EXIT

[ "${SKIP_BUILD:-}" = "1" ] || docker build -q -f Dockerfile -t "$JOURNAL_IMAGE" .. >/dev/null
env -u COMPOSE_PROFILES -u JOURNAL_IMAGE docker compose config --services 2>/dev/null | grep -qx journal && fail "a plain docker compose up would start the journal on an unchecked image"
pass "a plain docker compose up leaves the journal to the updater"
compose up -d journal caddy >/dev/null 2>&1
for _ in $(seq 1 90); do compose exec -T journal curl -fsS http://127.0.0.1:8440/ready >/dev/null 2>&1 && break; sleep 2; done
compose exec -T journal curl -fsS http://127.0.0.1:8440/ready >/dev/null 2>&1 && pass "the journal starts and its health address answers" || fail "the journal never became ready"

curl -sk "$SITE/login" | grep -q "Set up" && pass "the first visit asks for the setup code" || fail "no setup page"
[ "$(curl -s -o /dev/null -w '%{http_code}' "http://localhost:$HTTP_PORT/")" = "308" ] && pass "plain http is sent on to https" || fail "plain http answered"
curl -skI "$SITE/login" | grep -qi "strict-transport-security" && pass "https answers carry HSTS" || fail "no HSTS"

CODE="$(compose exec -T -u gateway journal hosted-journal setup-code | sed 's/.*: //')"
STATUS="$(curl -sk -o /dev/null -w '%{http_code}' -c "$JAR" -H "Origin: $SITE" --data-urlencode "code=$CODE" --data-urlencode "password=$PASSWORD" --data-urlencode "again=$PASSWORD" "$SITE/setup")"
[ "$STATUS" = "303" ] && pass "the setup code sets the owner's password and logs in" || fail "setup answered $STATUS"
[ "$(curl -sk -o /dev/null -w '%{http_code}' -b "$JAR" "$SITE/api/identity")" = "200" ] && pass "the logged-in owner reaches the journal's own server" || fail "the viewer's API was not reached"
curl -sk -b "$JAR" "$SITE/" | grep -q 'id="app"' && pass "the full viewer is served" || fail "no viewer"
for path in run upgrade stop hook/claude; do
    [ "$(curl -sk -o /dev/null -w '%{http_code}' -b "$JAR" -H "Origin: $SITE" -X POST "$SITE/api/$path")" = "403" ] || fail "/api/$path was not refused"
done
pass "run, upgrade, stop and hook are refused to the owner"
[ "$(curl -sk -o /dev/null -w '%{http_code}' -b "$JAR" -H "Origin: https://evil.example" -X POST -d '{}' "$SITE/api/main/todo")" = "403" ] && pass "a change from another site is refused" || fail "a cross-site change went through"
for _ in 1 2 3 4 5; do curl -sk -o /dev/null -H "Origin: $SITE" --data "password=wrong" "$SITE/login"; done
curl -sk -H "Origin: $SITE" --data-urlencode "password=$PASSWORD" "$SITE/login" | grep -q "Too many wrong tries" && pass "five wrong passwords lock the place out" || fail "no lock-out"

json() { python3 -c "import json, sys; print(json.load(sys.stdin)$1)"; }
LINK="$(curl -sk -b "$JAR" -H "Origin: $SITE" -H "Content-Type: application/json" -X POST -d '{"days": 7}' "$SITE/api/main/phone/connect" | json '["link"]')"
echo "$LINK" | grep -q "^https://localhost/p/#" || fail "the phone's code points at $LINK"
PHONE="$WORK/phone"
curl -sk -o /dev/null -c "$PHONE" -H "Origin: $SITE" -H "X-Phone: 1" -H "Content-Type: application/json" -X POST -d "{\"code\": \"${LINK#*#}\", \"device\": \"proof\"}" "$SITE/p/pair"
[ "$(curl -sk -o /dev/null -w '%{http_code}' -b "$PHONE" "$SITE/p/state")" = "200" ] && pass "a phone pairs at the server's own address" || fail "the phone did not pair"

PLACE="$(curl -sk -b "$JAR" -H "Origin: $SITE" -H "Content-Type: application/json" -X POST -d '{"title": "server-work"}' "$SITE/api/main/environment" | json '["n"]')"
curl -sk -o /dev/null -b "$JAR" -H "Origin: $SITE" -H "Content-Type: application/json" -X POST -d '{"agent": "claude"}' "$SITE/api/main/environment/$PLACE/launch"
for _ in $(seq 1 30); do compose exec -T journal pgrep -u journal -x claude >/dev/null 2>&1 && break; sleep 1; done
compose exec -T journal pgrep -u journal -x claude >/dev/null 2>&1 && pass "an agent started from the viewer runs headless on the server" || fail "no agent started"

[ "$(docker inspect --format '{{.HostConfig.CapDrop}} {{.HostConfig.SecurityOpt}}' "$(compose ps -q journal)")" = "[ALL] [no-new-privileges:true]" ] && pass "the journal's container drops every capability it does not use" || fail "the journal's container keeps capabilities"
[ "$(compose exec -T journal ps -o user= -p 1 | tr -d ' ')" = "journal" ] && pass "the journal and its agents run as the unprivileged user journal" || fail "the journal runs as another user"
compose exec -T journal pgrep -u gateway -f "commands.login_page serve" >/dev/null && pass "the login page runs as its own user, gateway" || fail "the login page does not run as gateway"
MODES="$(compose exec -T -u gateway journal sh -c 'stat -c %a /data/vault /data/vault/*/ /data/vault/*/owner.json' | tr '\n' ' ')"
echo "$MODES" | grep -Eq '^700 700 600 $' && pass "the password and logins sit in a folder only gateway can read" || fail "vault modes are $MODES"
compose exec -T -u journal journal sh -c 'cat /data/vault/*/owner.json' >/dev/null 2>&1 && fail "an agent's user reads the password hash" || pass "an agent's user cannot read the password or logins"
compose exec -T -u journal journal hosted-journal setup-code >/dev/null 2>&1 && fail "an agent's user made a setup code" || pass "an agent's user cannot make a setup code or reset the password"
compose exec -T -u journal journal sh -c 'mkdir -p /data/project/features && for f in json.py features/__init__.py; do echo "open(\"/tmp/planted\", \"w\").write(\"ran\")" > /data/project/$f; done'
compose exec -T -u gateway -w /data/project journal hosted-journal password-status >/dev/null 2>&1 || true
compose exec -T journal pkill -u gateway -f "commands.login_page serve" >/dev/null 2>&1 || true
compose exec -T -u journal journal python3 -c 'import socket; socket.create_server(("0.0.0.0", 8440))' >/dev/null 2>&1 && fail "an agent's user took the login page's port" || pass "the login page's port stays held while the login page restarts"
for _ in $(seq 1 30); do compose exec -T journal curl -fsS http://127.0.0.1:8440/ready >/dev/null 2>&1 && break; sleep 1; done
compose exec -T journal test -e /tmp/planted && fail "code planted in the project ran as gateway" || pass "code planted in the project never runs as the login page's user"
compose exec -T -u journal journal sh -c 'rm -rf /data/project/json.py /data/project/features'
compose exec -T -u journal journal sh -c 'touch /opt/agent-journal/src/serve.py' >/dev/null 2>&1 && fail "an agent's user can change the login page's code" || pass "the login page's code cannot be changed by an agent's user"
compose exec -T -u journal journal sh -c 'grep -rl "owner.json\|scrypt" /data/project/.journal --include=*.json' >/dev/null 2>&1 && fail "a secret is in the record" || pass "no secret is in the record"

RUNNING="$(docker inspect --format '{{.Image}}' "$(compose ps -q journal)")"
compose run --rm -e UPDATE_ONCE=1 -e JOURNAL_IMAGE_NAME=agent-journal updater 2>/dev/null | grep -q "carries no signature" \
    && [ "$(docker inspect --format '{{.Image}}' "$(compose ps -q journal)")" = "$RUNNING" ] \
    && pass "an image without the release workflow's signature is never deployed" || fail "the updater deployed an unsigned image"

compose exec -T -u journal journal sh -c 'echo kept > /data/project/proof.txt'
compose exec -T -u journal -w /data/project journal sh -c 'J="python3 .journal/journal.py --root .journal"; $J secret create Proof --kind "api key" >/dev/null && echo proof-secret-value > /tmp/made && $J secret store 1 key /tmp/made >/dev/null' \
    || fail "a secret's value could not be kept on the server"
[ "$(compose exec -T -u journal journal sh -c 'stat -c %a /data/secrets /data/secrets/*.env' | tr '\n' ' ')" = "700 600 " ] && pass "the server keeps its secrets in a file of its own" || fail "the server's secrets file is not owner-only"
compose run --rm -e BACKUP_ONCE=1 backup >/dev/null 2>&1 && pass "a backup snapshot is made" || fail "the backup failed"
LISTED="$(compose run --rm --entrypoint restic backup ls latest --host journal 2>/dev/null)"
echo "$LISTED" | grep -qx /data/project/proof.txt && ! echo "$LISTED" | grep -q '^/data/secrets' && pass "no backup holds the server's secrets" || fail "a backup holds the server's secrets"
compose exec -T journal printenv RESTIC_PASSWORD >/dev/null 2>&1 && fail "the journal's agents can read the backup password" || pass "the backup password stays off the journal's container"
compose stop journal >/dev/null 2>&1
env SNAPSHOT=0000000000 docker compose --profile restore run --rm --no-deps restore >/dev/null 2>&1 && fail "a snapshot that does not exist was restored"
compose --profile restore run --rm --no-deps --entrypoint cat restore /data/project/proof.txt 2>/dev/null | grep -q kept && pass "a snapshot that cannot be read leaves the volume as it was" || fail "a failed restore emptied the volume"
compose start journal >/dev/null 2>&1
compose exec -T -u journal journal rm /data/project/proof.txt
compose stop journal >/dev/null 2>&1
compose --profile restore run --rm --no-deps restore > "$WORK/restore.log" 2>&1 || { tail -5 "$WORK/restore.log"; fail "the restore failed"; }
compose start journal >/dev/null 2>&1
for _ in $(seq 1 90); do compose exec -T journal curl -fsS http://127.0.0.1:8440/ready >/dev/null 2>&1 && break; sleep 2; done
[ "$(compose exec -T -u journal journal cat /data/project/proof.txt)" = "kept" ] && pass "the restore brings back a lost file" || fail "the restored volume lacks the file"
compose exec -T -u journal journal sh -c 'cat /data/secrets/*.env' | grep -q proof-secret-value && pass "a restore leaves the server's secrets in place" || fail "the restore took the server's secrets"
STATUS="$(curl -sk -o /dev/null -w '%{http_code}' -H "Origin: $SITE" -H "X-Forwarded-For: 192.0.2.99" --data-urlencode "password=$PASSWORD" "$SITE/login")"
[ "$STATUS" = "303" ] || [ "$STATUS" = "429" ] && pass "the owner's password survives the restore" || fail "login after restore answered $STATUS"
echo "The install is proven on this machine."
