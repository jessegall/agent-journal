#!/bin/bash
# The journal's runner: Claude Code runs every shell command, and its MCP servers, as run.sh '<line>'. Only a shell
# command, which Claude wraps in eval, is taken apart at && and ; into its parts; a worker runs them one by one in
# the agent's own shell, each of the agent's own recorded with its output and duration. This process shows each part's output as it lands and ends with the chain's exit code; past
# the foreground limit it ends at once, says where the output goes, and the worker carries on in the background and
# reports when it ends.
here=$(cd "$(dirname "$0")" && pwd)
journal="$here/../../journal.sh"
root=$(cd "$here/../../.." && pwd)

# The worker. A part that exits the shell, such as a bare exit 3, ends the chain through the trap: the part's
# status and the chain's end are written all the same, so the foreground and the journal both learn of it.
finish() {
    code=$1
    [ -f "$folder/done" ] && return
    if [ -f "$folder/$i.part" ] && [ ! -f "$folder/$i.status" ]; then
        [ "$kind" = "R" ] && sh "$journal" shell ran "$part" --chain "$id" --status "$code" --seconds "$((SECONDS - began))" --output "$(tail -c 2000 "$folder/$i.out" 2>/dev/null)" >/dev/null 2>&1
        echo "$code" > "$folder/$i.status"
    fi
    echo "$code" > "$folder/done"
    if [ -f "$folder/moved" ]; then
        sh "$journal" shell ended "$id" --status "$code" --file "$folder" --last "$(tail -n 5 "$folder/$i.out" 2>/dev/null)" >/dev/null 2>&1
    fi
}
if [ "$1" = "--chain" ]; then
    folder=$2
    id=$(basename "$folder")
    i=0
    code=0
    kind=S
    part=""
    began=$SECONDS
    trap 'finish $?' EXIT
    while read -r kind; do
        part=$(cat "$folder/$i.part")
        [ "$kind" = "R" ] && sh "$journal" shell started "$part" --chain "$id" >/dev/null 2>&1
        began=$SECONDS
        case "$part" in
            exec\ *) (eval "$part") > "$folder/$i.out" 2>&1; code=$?; echo "$code" > "$folder/$i.status"; break ;;
            *) eval "$part" > "$folder/$i.out" 2>&1; code=$? ;;
        esac
        [ "$kind" = "R" ] && sh "$journal" shell ran "$part" --chain "$id" --status "$code" --seconds "$((SECONDS - began))" --output "$(tail -c 2000 "$folder/$i.out")" >/dev/null 2>&1
        echo "$code" > "$folder/$i.status"
        [ "$code" -eq 0 ] || break
        i=$((i + 1))
    done < "$folder/parts"
    finish "$code"
    exit "$code"
fi

[ $# -eq 1 ] || exec "$@"
case "$1" in *"&& eval '"*"' < /dev/null && pwd -P"*) ;; *) exec "${SHELL:-bash}" -c "$1" ;; esac
[ -f "$root/port" ] || exec "${SHELL:-bash}" -c "$1"
id=$(date +%s)-$$
folder="$root/runtime/outputs/$id"
mkdir -p "$folder"
printf '%s' "$1" > "$folder/line"
sh "$journal" shell split "$1" --into "$folder" > "$folder/parts" 2>/dev/null || exec "${SHELL:-bash}" -c "$1"
("${SHELL:-bash}" "$0" --chain "$folder" </dev/null >/dev/null 2>&1 &)
limit=$(sh "$journal" shell limit 2>/dev/null); limit=${limit:-30}
trap 'touch "$folder/moved"; exit 143' TERM INT HUP
shown=0
tick=0
began=$SECONDS
while :; do
    while [ -f "$folder/$shown.status" ]; do
        cat "$folder/$shown.out"
        code=$(cat "$folder/$shown.status")
        shown=$((shown + 1))
        [ "$code" -eq 0 ] || exit "$code"
    done
    [ -f "$folder/done" ] && exit "$(cat "$folder/done")"
    if [ $((SECONDS - began)) -ge "$limit" ]; then
        touch "$folder/moved"
        running=$(cat "$folder/$shown.part")
        sh "$journal" shell moved "$id" "$running" --file "$folder"
        exit 0
    fi
    sleep 0.2
    tick=$((tick + 1))
    if [ $((tick % 10)) -eq 0 ]; then
        fresh=$(sh "$journal" shell limit 2>/dev/null)
        limit=${fresh:-$limit}
    fi
done
