#!/bin/bash
# The journal's runner: Claude Code runs every shell command, and its MCP servers, as run.sh '<line>'. Only a shell
# command, which Claude wraps in eval, is taken apart at && and ; into its parts; a worker runs them one by one in
# the agent's own shell, each of the agent's own recorded with its output and duration. This process shows each part's output as it lands and ends with the chain's exit code; past
# the foreground limit it ends at once, says where the output goes, and the worker carries on in the background and
# reports when it ends.
here=$(cd "$(dirname "$0")" && pwd)
__journal_cli="$here/../../journal.sh"
root=$(cd "$here/../../.." && pwd)

# The worker. Its own variables carry a prefix, since the parts run in the same shell and may set i or code.
# A part after && is skipped while the part before it failed, a part after ; runs whatever came before,
# as in the shell; a part that exits the shell, such as a bare exit 3, ends the chain through the trap: the part's
# status and the chain's end are written all the same, so the foreground and the journal both learn of it.
__journal_finish() {
    __journal_code=$1
    [ -f "$__journal_folder/done" ] && return
    if [ -f "$__journal_folder/$__journal_i.part" ] && [ ! -f "$__journal_folder/$__journal_i.status" ]; then
        case "$__journal_kind" in R*) sh "$__journal_cli" shell ran "$__journal_part" --chain "$__journal_id" --status "$__journal_code" --seconds "$((SECONDS - __journal_began))" --output "$(tail -c 2000 "$__journal_folder/$__journal_i.out" 2>/dev/null)" >/dev/null 2>&1 ;; esac
        echo "$__journal_code" > "$__journal_folder/$__journal_i.status"
    fi
    echo "$__journal_code" > "$__journal_folder/done"
    if [ -f "$__journal_folder/moved" ]; then
        sh "$__journal_cli" shell ended "$__journal_id" --status "$__journal_code" --file "$__journal_folder" --last "$(tail -n 5 "$__journal_folder/$__journal_lastr.out" 2>/dev/null)" >/dev/null 2>&1
    fi
}
if [ "$1" = "--chain" ]; then
    __journal_folder=$2
    __journal_id=$(basename "$__journal_folder")
    __journal_i=0
    __journal_code=0
    __journal_kind=S
    __journal_part=""
    __journal_lastr=0
    __journal_began=$SECONDS
    trap '__journal_finish $?' EXIT
    while read -r __journal_kind; do
        __journal_part=$(cat "$__journal_folder/$__journal_i.part")
        case "$__journal_kind" in
            *'&') if [ "$__journal_code" -ne 0 ]; then : > "$__journal_folder/$__journal_i.out"; echo "$__journal_code" > "$__journal_folder/$__journal_i.status"; __journal_i=$((__journal_i + 1)); continue; fi ;;
        esac
        case "$__journal_kind" in R*) __journal_lastr=$__journal_i; sh "$__journal_cli" shell started "$__journal_part" --chain "$__journal_id" >/dev/null 2>&1 ;; esac
        __journal_began=$SECONDS
        case "$__journal_part" in
            exec\ *) (eval "$__journal_part") > "$__journal_folder/$__journal_i.out" 2>&1; __journal_code=$?; echo "$__journal_code" > "$__journal_folder/$__journal_i.status"; break ;;
            *) (exit "$__journal_code"); eval "$__journal_part" < /dev/null > "$__journal_folder/$__journal_i.out" 2>&1; __journal_code=$? ;;
        esac
        case "$__journal_kind" in R*) sh "$__journal_cli" shell ran "$__journal_part" --chain "$__journal_id" --status "$__journal_code" --seconds "$((SECONDS - __journal_began))" --output "$(tail -c 2000 "$__journal_folder/$__journal_i.out")" >/dev/null 2>&1 ;; esac
        echo "$__journal_code" > "$__journal_folder/$__journal_i.status"
        __journal_i=$((__journal_i + 1))
    done < "$__journal_folder/parts"
    __journal_finish "$__journal_code"
    exit "$__journal_code"
fi

[ $# -eq 1 ] || exec "$@"
case "$1" in *"&& eval '"*"' < /dev/null && pwd -P"*) ;; *) exec "${SHELL:-bash}" -c "$1" ;; esac
[ -f "$root/port" ] || exec "${SHELL:-bash}" -c "$1"
id=$(date +%s)-$$
folder="$root/runtime/outputs/$id"
mkdir -p "$folder"
find "$root/runtime/outputs" -mindepth 1 -maxdepth 1 -mmin +1440 -exec rm -r {} + 2>/dev/null
printf '%s' "$1" > "$folder/line"
sh "$__journal_cli" shell split "$1" --into "$folder" > "$folder/parts" 2>/dev/null || exec "${SHELL:-bash}" -c "$1"
("${SHELL:-bash}" "$0" --chain "$folder" </dev/null >/dev/null 2>&1 &)
limit=$(sh "$__journal_cli" shell limit 2>/dev/null); limit=${limit:-30}
trap 'touch "$folder/moved"; exit 143' TERM INT HUP
shown=0
tick=0
began=$SECONDS
while :; do
    while [ -f "$folder/$shown.status" ]; do
        cat "$folder/$shown.out"
        shown=$((shown + 1))
    done
    [ -f "$folder/done" ] && exit "$(cat "$folder/done")"
    if [ $((SECONDS - __journal_began)) -ge "$limit" ]; then
        touch "$folder/moved"
        running=$(cat "$folder/$shown.part")
        sh "$__journal_cli" shell moved "$id" "$running" --file "$folder"
        exit 0
    fi
    sleep 0.2
    tick=$((tick + 1))
    if [ $((tick % 10)) -eq 0 ]; then
        fresh=$(sh "$__journal_cli" shell limit 2>/dev/null)
        limit=${fresh:-$limit}
    fi
done
