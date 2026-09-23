#!/bin/bash
# Claude Code runs every shell command as: output_cap.sh '<command>'. Long output keeps its head and tail.
[ $# -eq 1 ] || exec "$@"
keep=${JOURNAL_OUTPUT_LINES:-200}
[ "$keep" -gt 0 ] 2>/dev/null || exec bash -c "$1"
bash -c "$1" 2>&1 | awk -v keep="$keep" '
    NR <= keep { print; fflush(); next }
    { tail[NR % keep] = $0 }
    END {
        if (NR > 2 * keep) printf "… %d lines cut here: rerun with | sed -n for a range, or grep for what you need\n", NR - 2 * keep
        for (i = (NR > 2 * keep ? NR - keep + 1 : keep + 1); i <= NR; i++) print tail[i % keep]
    }'
exit "${PIPESTATUS[0]}"
