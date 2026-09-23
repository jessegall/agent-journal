#!/bin/bash
# Claude Code runs every shell command as: output_cap.sh '<command>'. Long output keeps its head and tail; the whole of it is kept as an output row.
[ $# -eq 1 ] || exec "$@"
keep=${JOURNAL_OUTPUT_LINES:-200}
[ "$keep" -gt 0 ] 2>/dev/null || exec bash -c "$1"
folder=${JOURNAL_OUTPUT_DIR:-${TMPDIR:-/tmp}}
mkdir -p "$folder"
whole=$(mktemp "$folder/output-XXXXXX")
bash -c "$1" 2>&1 | tee "$whole" | awk -v keep="$keep" 'NR <= keep { print; fflush() }'
status=${PIPESTATUS[0]}
count=$(awk 'END { print NR }' "$whole")
if [ "$count" -gt $((2 * keep)) ]; then
    ending=$(tail -n "$keep" "$whole")
    if kept=$(journal output keep "$whole" --command_line="$1" 2>&1); then
        read -r n path <<< "$kept"
        echo "… $((count - 2 * keep)) lines cut here; the whole output is output $n, at $path: grep it or sed -n a range"
    else
        echo "… $((count - 2 * keep)) lines cut here; the whole output is at $whole (not kept as a row: $kept)"
    fi
    printf '%s\n' "$ending"
else
    [ "$count" -gt "$keep" ] && tail -n +$((keep + 1)) "$whole"
    rm -f "$whole"
fi
exit "$status"
