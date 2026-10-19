#!/bin/bash
# The journal's runner: Claude Code runs every shell command, and its MCP servers, as run.sh '<line>'. Only a shell
# command, which Claude wraps in eval, is taken apart at && and ; into its parts; a worker runs them one by one in
# the agent's own shell, each of the agent's own recorded with its output and duration. This process shows each part's output as it lands and ends with the chain's exit code; past
# the foreground limit it ends at once, says where the output goes, and the worker carries on in the background and
# reports when it ends.
here=$(cd "$(dirname "$0")" && pwd)
__journal_cli="$here/../../journal.sh"
root=$(cd "$here/../../.." && pwd)

# The working tree as git sees it, one line a changed file: lines added, lines removed, path, a new file marked ?
# and counted only once it shows up as changed. Only a part that writes, as the journal read it, is measured, so a
# read costs nothing. What differs between before and after is what the part changed. The helpers never fail the
# worker, whatever a part did to its options, such as set -e.
__journal_tree() {
    git diff --numstat HEAD 2>/dev/null | grep -v "	\.journal/"
    git ls-files --others --exclude-standard 2>/dev/null | grep -v "^\.journal/" | sed 's/^/?\t0\t/'
}
# The part before left a status the next may read as $?; replayed, except under set -e, where the replay itself would end the shell.
__journal_status() {
    case "$-" in *e*) return 0 ;; *) return "$__journal_code" ;; esac
}
__journal_changed() {
    { diff "$__journal_folder/$1.before" "$__journal_folder/$1.after" 2>/dev/null || true; } | sed -n 's/^> //p' | while IFS="$(printf '\t')" read -r __journal_a __journal_r __journal_path; do
        [ "$__journal_a" = "?" ] && __journal_a=$(wc -l < "$__journal_path" 2>/dev/null | tr -d ' ')
        printf '%s\t%s\t%s\n' "${__journal_a:-0}" "$__journal_r" "$__journal_path"
    done
}

# The foreground shows a part's output as the journal's cap says: whole for a line of journal commands, half of the
# characters from each end for a command that reads, and for any other whole up to the cap and past it not at all; a line
# names the output by its number.
__journal_show() {
    __journal_size=$(wc -c < "$1" | tr -d ' ')
    if [ "$show" = whole ] || [ "$__journal_size" -le "$cap" ]; then
        cat "$1"
        return
    fi
    __journal_n=$(cat "$folder/number" 2>/dev/null)
    if [ "$show" = ends ]; then
        head -c $((cap / 2)) "$1"
        printf '\n[journal] output %s: %s characters, %s cut from the middle. journal output read %s --lines or --grep reads them\n' "$__journal_n" "$__journal_size" "$((__journal_size - cap))" "$__journal_n"
        tail -c $((cap / 2)) "$1"
        return
    fi
    printf '[journal] output %s: %s characters. journal output read %s reads it\n' "$__journal_n" "$__journal_size" "$__journal_n"
}

# The worker. Its own variables carry a prefix, since the parts run in the same shell and may set i or code.
# A part after && is skipped while the part before it failed, a part after ; runs whatever came before, and a part
# before && may fail without ending a shell under set -e,
# as in the shell; a part that exits the shell, such as a bare exit 3, ends the chain through the trap: the part's
# status and the chain's end are written all the same, so the foreground and the journal both learn of it.
__journal_finish() {
    __journal_code=$1
    [ -f "$__journal_folder/done" ] && return
    if [ -f "$__journal_folder/$__journal_i.part" ] && [ ! -f "$__journal_folder/$__journal_i.status" ]; then
        case "$__journal_kind" in R*) sh "$__journal_cli" shell ran "$__journal_part" --chain "$__journal_id" --status "$__journal_code" --seconds "$((SECONDS - __journal_began))" --output "$(cat "$__journal_folder/$__journal_i.out" "$__journal_folder/$__journal_i.err" 2>/dev/null | tail -c 2000)" >/dev/null 2>&1 ;; esac
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
            ?'&'??) if [ "$__journal_code" -ne 0 ]; then : > "$__journal_folder/$__journal_i.out"; : > "$__journal_folder/$__journal_i.err"; echo "$__journal_code" > "$__journal_folder/$__journal_i.status"; __journal_i=$((__journal_i + 1)); continue; fi ;;
        esac
        case "$__journal_kind" in R*) __journal_lastr=$__journal_i; sh "$__journal_cli" shell started "$__journal_part" --chain "$__journal_id" >/dev/null 2>&1 ;; esac
        case "$__journal_kind" in ???w) __journal_tree > "$__journal_folder/$__journal_i.before" || true ;; esac
        __journal_began=$SECONDS
        case "$__journal_part" in
            exec\ *) (eval "$__journal_part") > "$__journal_folder/$__journal_i.out" 2> "$__journal_folder/$__journal_i.err"; __journal_code=$?; echo "$__journal_code" > "$__journal_folder/$__journal_i.status"; break ;;
            *) case "$__journal_kind" in
                   ??'&'?) if __journal_status; eval "$__journal_part" < /dev/null > "$__journal_folder/$__journal_i.out" 2> "$__journal_folder/$__journal_i.err"; then __journal_code=0; else __journal_code=$?; fi ;;
                   *) __journal_status; eval "$__journal_part" < /dev/null > "$__journal_folder/$__journal_i.out" 2> "$__journal_folder/$__journal_i.err"; __journal_code=$? ;;
               esac ;;
        esac
        case "$__journal_kind" in ???w) __journal_tree > "$__journal_folder/$__journal_i.after" || true ;; esac
        case "$__journal_kind" in R*) sh "$__journal_cli" shell ran "$__journal_part" --chain "$__journal_id" --status "$__journal_code" --seconds "$((SECONDS - __journal_began))" --output "$(cat "$__journal_folder/$__journal_i.out" "$__journal_folder/$__journal_i.err" | tail -c 2000)" --changed "$(__journal_changed "$__journal_i")" >/dev/null 2>&1 ;; esac
        echo "$__journal_code" > "$__journal_folder/$__journal_i.status"
        __journal_i=$((__journal_i + 1))
    done < "$__journal_folder/parts"
    __journal_finish "$__journal_code"
    exit "$__journal_code"
fi

[ $# -eq 1 ] || exec "$@"
case "$1" in *"&& eval '"*"' < /dev/null && pwd -P"* | *"&& eval '"*"' && pwd -P"*) ;; *) exec "${SHELL:-bash}" -c "$1" ;; esac
[ -f "$root/port" ] || exec "${SHELL:-bash}" -c "$1"
id=$(date +%s)-$$
folder="$root/runtime/outputs/$id"
mkdir -p "$folder"
printf '%s' "$1" > "$folder/line"
sh "$__journal_cli" shell split "$1" --into "$folder" > "$folder/parts" 2>/dev/null || exec "${SHELL:-bash}" -c "$1"
[ -f "$folder/dropped" ] && cat "$folder/dropped"
("${SHELL:-bash}" "$0" --chain "$folder" </dev/null >/dev/null 2>&1 &)
limit=$(sh "$__journal_cli" shell limit --line "$1" 2>/dev/null); limit=${limit:-30}
cap=$(sh "$__journal_cli" shell cap --line "$1" 2>/dev/null); cap=${cap:-hint 200}
show=${cap%% *}
cap=${cap##* }
trap 'touch "$folder/moved"; exit 143' TERM INT HUP
shown=0
tick=0
began=$SECONDS
while :; do
    while [ -f "$folder/$shown.status" ]; do
        __journal_show "$folder/$shown.out"
        __journal_show "$folder/$shown.err" >&2 2>/dev/null
        shown=$((shown + 1))
    done
    if [ -f "$folder/done" ]; then
        code=$(cat "$folder/done")
        [ "$show" = whole ] && rm -rf "$folder"
        exit "$code"
    fi
    if [ "$limit" -gt 0 ] && [ $((SECONDS - began)) -ge "$limit" ]; then
        touch "$folder/moved"
        running=$(cat "$folder/$shown.part")
        sh "$__journal_cli" shell moved "$id" "$running" --file "$folder"
        exit 0
    fi
    sleep 0.2
    tick=$((tick + 1))
    if [ $((tick % 10)) -eq 0 ]; then
        fresh=$(sh "$__journal_cli" shell limit --line "$1" 2>/dev/null)
        limit=${fresh:-$limit}
    fi
done
