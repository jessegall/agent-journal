#!/bin/sh
# Proves the install on this machine's own Docker, then removes everything it made:
# build, start, first-time setup, login, refusals, an unprivileged server, secrets only it can read,
# a backup, and a restore that brings back what was lost.
set -eu
cd "$(dirname "$0")"
export COMPOSE_PROJECT_NAME=journal-proof JOURNAL_IMAGE=agent-journal:local HTTP_PORT=18080 HTTPS_PORT=18443 JOURNAL_ADDRESS=localhost
WORK="$(mktemp -d)"
export JOURNAL_ENV_FILE="$WORK/.env" BACKUP_FOLDER="$WORK/backups"
printf 'JOURNAL_ADDRESS=localhost\nRESTIC_PASSWORD=proof-only-password\n' > "$JOURNAL_ENV_FILE"
SITE="https://localhost:$HTTPS_PORT"
JAR="$WORK/cookies"
PASSWORD="a proof of the install"
compose() { docker compose "$@"; }
pass() { echo "ok   $1"; }
fail() { echo "FAIL $1"; compose logs --tail 40 journal >&2 || true; exit 1; }
cleanup() { compose --profile restore down -v --remove-orphans >/dev/null 2>&1 || true; rm -rf "$WORK"; }
trap cleanup EXIT

[ "${SKIP_BUILD:-}" = "1" ] || docker build -q -f Dockerfile -t "$JOURNAL_IMAGE" .. >/dev/null
compose up -d journal caddy >/dev/null 2>&1
for _ in $(seq 1 90); do compose exec -T journal curl -fsS http://127.0.0.1:8440/ready >/dev/null 2>&1 && break; sleep 2; done
compose exec -T journal curl -fsS http://127.0.0.1:8440/ready >/dev/null 2>&1 && pass "the journal starts and its health address answers" || fail "the journal never became ready"

curl -sk "$SITE/login" | grep -q "Set up" && pass "the first visit asks for the setup code" || fail "no setup page"
[ "$(curl -s -o /dev/null -w '%{http_code}' "http://localhost:$HTTP_PORT/")" = "308" ] && pass "plain http is sent on to https" || fail "plain http answered"
curl -skI "$SITE/login" | grep -qi "strict-transport-security" && pass "https answers carry HSTS" || fail "no HSTS"

CODE="$(compose exec -T journal hosted-journal setup-code | sed 's/.*: //')"
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

[ "$(compose exec -T journal id -u)" = "10001" ] && pass "the server runs as an unprivileged user" || fail "the server runs as root"
MODES="$(compose exec -T journal sh -c 'stat -c %a "$HOME"/.journal/hosted "$HOME"/.journal/hosted/*/owner.json' | tr '\n' ' ')"
echo "$MODES" | grep -Eq '^700 600 $' && pass "secrets sit in a folder only the server's user can read" || fail "secret modes are $MODES"
compose exec -T journal sh -c 'grep -rl "owner.json\|scrypt" /data/project/.journal --include=*.json' >/dev/null 2>&1 && fail "a secret is in the record" || pass "no secret is in the record"

compose exec -T journal sh -c 'echo kept > /data/project/proof.txt'
compose run --rm -e BACKUP_ONCE=1 backup >/dev/null 2>&1 && pass "a backup snapshot is made" || fail "the backup failed"
compose exec -T journal rm /data/project/proof.txt
SNAPSHOT=latest compose stop journal >/dev/null 2>&1
compose --profile restore run --rm --no-deps restore >/dev/null 2>&1 || fail "the restore failed"
compose start journal >/dev/null 2>&1
for _ in $(seq 1 90); do compose exec -T journal curl -fsS http://127.0.0.1:8440/ready >/dev/null 2>&1 && break; sleep 2; done
[ "$(compose exec -T journal cat /data/project/proof.txt)" = "kept" ] && pass "the restore brings back a lost file" || fail "the restored volume lacks the file"
STATUS="$(curl -sk -o /dev/null -w '%{http_code}' -H "Origin: $SITE" -H "X-Forwarded-For: 192.0.2.99" --data-urlencode "password=$PASSWORD" "$SITE/login")"
[ "$STATUS" = "303" ] || [ "$STATUS" = "429" ] && pass "the owner's password survives the restore" || fail "login after restore answered $STATUS"
echo "The install is proven on this machine."
