from __future__ import annotations

import contextlib
import json
import os
import tempfile
from pathlib import Path

import rollout
from templates import render as fill

#: The windows that exist, smallest first. The right one is the smallest that fits what
#: this session has ALREADY held.
WINDOWS = (200_000, 1_000_000)


MESSAGES = {
    "head": "CONTEXT IS {pct}% FULL — {used} of {window}. {said}",
    "standing": "{n} pin(s) stand[, {since} written since the last warning]",
    "claim": "{standing}. A pin is a CLAIM a later reader would get WRONG without.{early}",
    "claim_early": " Never a status, a count, or what you just did; those rot into confident falsehoods wearing the "
                   "same authority as the facts that still hold.",
    "latest": "The last one written, for the shape of it:\n  {latest}",
    "share": "  {share}  {label}[\n         {lever}]",
    "made_of": "WHAT IS ACTUALLY IN HERE, by share of what was said:\n{rows:\n}",
}

def say(message: str, /, **values) -> str:
    return fill(MESSAGES[message], **values)


def window_for(peak: int, setting: int = 0, learned: int = 0) -> tuple[int, bool]:
    if setting:
        return setting, True
    # LEARNED AT A COMPACTION. Claude Code compacts when the window is nearly full, so the
    # peak right before a compaction boundary IS the window, rounded up to the one it
    # fits. The hook records it in the project's record the first time it sees one, and
    # from then on the ladder climbs a measured window with no setting at all.
    if learned:
        return learned, True
    fits = [w for w in WINDOWS if peak <= w]
    if not fits:
        return WINDOWS[-1], True  # past every known window: it is the largest
    return fits[0], len(fits) == 1


#: path -> (size read, used, peak). A TRANSCRIPT ONLY GROWS, so the answer for the first N
#: bytes never changes and re-reading them cannot say anything new. Kept per process: the
#: hook reads this several times in one event and every read was a full pass.
_READ: dict = {}


def reading(path: Path, cache: Path | None = None) -> tuple[int, int] | None:
    if not path.is_file():
        return None
    st = path.stat()
    size = st.st_size
    had = _READ.get(str(path))
    if had is None and cache is not None:
        had = _resumed(cache, path, st)
    start, used, peak = (had if had and had[0] <= size else (0, None, 0))
    if had and had[0] == size:
        _READ[str(path)] = had
        return (used, peak) if used is not None else None
    with path.open("rb") as fh:
        fh.seek(start)
        data = fh.read(size - start)
    # stop at the last complete line: a record still being written is read next time, not lost
    end = data.rfind(b"\n") + 1
    for line in data[:end].splitlines():
        # A LINE THAT CANNOT CARRY THE FIELD IS NOT PARSED. `reading_tail` has done this
        # since it was written; this one parsed every record of the transcript to find the
        # few that are assistant turns with usage — 10,780 `json.loads` calls and 0.23s of
        # a 0.81s command in a real project, to read a number that lives on maybe 400 of
        # them. A substring test on the raw line is two orders of magnitude cheaper, and
        # it can only ever admit MORE candidates than it should, never fewer.
        codex = rollout.usage_of(line)              # a Codex rollout counts in its own record
        if codex is not None:
            used = codex
            peak = max(peak, used)
            continue
        if b'"usage"' not in line:
            continue
        try:
            rec = json.loads(line)
        except ValueError:
            continue
        if rec.get("type") != "assistant":
            continue
        msg = rec.get("message") or {}
        usage = msg.get("usage")
        if not usage:
            continue
        used = (
            usage.get("input_tokens", 0)
            + usage.get("cache_read_input_tokens", 0)
            + usage.get("cache_creation_input_tokens", 0)
        )
        peak = max(peak, used)
    _READ[str(path)] = (start + end, used, peak)
    if cache is not None and end:
        _remember(cache, path, st, (start + end, used, peak))
    # a last record with no newline yet still counts now; the kept position is before it, so it is read again
    if end < len(data) and b'"usage"' in data[end:]:
        try:
            rec = json.loads(data[end:])
        except ValueError:
            rec = {}
        usage = ((rec.get("message") or {}).get("usage") or {}) if rec.get("type") == "assistant" else {}
        if usage:
            used = usage.get("input_tokens", 0) + usage.get("cache_read_input_tokens", 0) + usage.get("cache_creation_input_tokens", 0)
            peak = max(peak, used)
    if used is None:
        return None
    return used, peak


def _resumed(cache: Path, path: Path, st) -> tuple[int, int | None, int] | None:
    try:
        got = json.loads(cache.read_text())
    except (OSError, ValueError):
        return None
    if not isinstance(got, dict) or got.get("path") != str(path) or got.get("inode") != st.st_ino:
        return None
    return got.get("offset", 0), got.get("used"), got.get("peak", 0)


def _remember(cache: Path, path: Path, st, point: tuple[int, int | None, int]) -> None:
    tmp = None
    try:
        cache.parent.mkdir(parents=True, exist_ok=True)
        fd, tmp = tempfile.mkstemp(dir=cache.parent, prefix=f".{cache.name}.", suffix=".tmp")
        with os.fdopen(fd, "w") as fh:
            json.dump({"path": str(path), "inode": st.st_ino, "offset": point[0], "used": point[1], "peak": point[2]}, fh)
        os.replace(tmp, cache)
    except OSError:
        if tmp:
            with contextlib.suppress(OSError):
                os.unlink(tmp)


def reading_tail(path: Path, limit: int = 300_000) -> int | None:
    if not path.is_file():
        return None
    size = path.stat().st_size
    with path.open("rb") as fh:
        if size > limit:
            fh.seek(size - limit)
            fh.readline()
        raw = fh.read().decode("utf-8", "replace")
    used = None
    for line in raw.splitlines():
        codex = rollout.usage_of(line.encode())
        if codex is not None:
            used = codex
            continue
        if '"usage"' not in line:
            continue
        try:
            rec = json.loads(line)
        except ValueError:
            continue
        if rec.get("type") != "assistant":
            continue
        usage = (rec.get("message") or {}).get("usage")
        if usage:
            used = (usage.get("input_tokens", 0) + usage.get("cache_read_input_tokens", 0)
                    + usage.get("cache_creation_input_tokens", 0))
    return used


def pressure(path: Path, setting: int = 0, learned: int = 0, cache: Path | None = None) -> tuple[float, int, int, bool] | None:
    got = reading(path, cache)
    if not got:
        return None
    used, peak = got
    window, known = window_for(peak, setting, learned)
    return used / window, used, window, known


def peak_before_compaction(path: Path) -> int:
    peak = 0
    best = 0
    if not path.is_file():
        return 0
    with path.open() as fh:
        for line in fh:
            try:
                rec = json.loads(line)
            except ValueError:
                continue
            if rec.get("type") == "system" and rec.get("subtype") == "compact_boundary":
                best = max(best, peak)
                peak = 0
                continue
            if rec.get("type") != "assistant":
                continue
            usage = (rec.get("message") or {}).get("usage")
            if usage:
                peak = max(peak, usage.get("input_tokens", 0) + usage.get("cache_read_input_tokens", 0)
                           + usage.get("cache_creation_input_tokens", 0))
    return best


def window_from_peak(peak: int) -> int:
    for w in WINDOWS:
        if peak <= w:
            return w
    return WINDOWS[-1]


#: What each share IS. A label, not an instruction — every row gets one of these.
_LABELS = {
    "tool_result": "tool output",
    "text": "your own messages",
    "injected": "hook and system blocks",
    "human": "what the user said",
}

#: THE ONLY ROW THE READER CAN ACT ON, and only while it is the one doing the damage.
#:
#: A lever printed beside a share nobody can move is the defect this system keeps finding:
#: a line that fires when it does not apply teaches the reader to skip the block, and then
#: the line that DID apply gets skipped with it. Eleven wrong nudges to catch three was the
#: measurement that first made the point. Nothing can be done about how much the user said,
#: and "write less" is not advice worth interrupting for — so those rows are shown as facts
#: and left alone.
#:
#: The threshold means the suggestion appears when tool output is genuinely the reason the
#: context is full, not merely present in it. Below it, the number still prints and says
#: nothing.
_LEVER_AT = 0.40
_LEVER = {
    "tool_result": "read narrower next time: grep or sed a range, not whole files",
}


def shape(lines) -> list[tuple[str, float]]:
    total = 0
    by_kind: dict[str, int] = {}
    for l in lines:
        n = len(l.text or "")
        if not n:
            continue
        by_kind[l.kind] = by_kind.get(l.kind, 0) + n
        total += n
    if not total:
        return []
    return sorted(((k, v / total) for k, v in by_kind.items()), key=lambda x: -x[1])


#: What each rung is FOR. The ladder exists because one warning at 75% is both too late to
#: think and too early to be urgent; four rungs let the message change with the situation
#: instead of repeating itself louder.
_RUNGS = {
    0.50: "Half the window is gone. This is the cheapest moment to think about what has to "
          "outlive it — you have room to be wrong and fix it.",
    0.70: "A compaction will probably happen before this session ends.",
    0.90: "A compaction is close. This is the last comfortable moment to write one.",
    0.95: "A compaction is imminent. This is the last warning you get.",
}

#: THE ANTI-PADDING LINE, and it is the whole reason this nudge is safe to repeat.
#:
#: A message that says "pin something" four times a session will be obeyed four times, and
#: a store of obedient pins is worse than an empty one: every pin is re-read in full after
#: every compaction for the rest of the project, so a weak one is a tax the writer pays
#: once and every future reader pays forever. The nudge therefore states the COST and
#: blesses the empty answer explicitly, rather than asking for a contribution.
_NOTHING_IS_FINE = (
    "Most stretches produce none, and none is the right answer here more often than not. "
    "A pin that did not need to be there is not free — it is re-read in full after every "
    "compaction from now on, and it dilutes the ones that matter."
)


def warning(used: int, window: int, pinned: int, made_of=(), rung: float = 0.0,
            latest: str = "", since: int = 0, gated: bool = False) -> str:
    pct = 100 * used / window
    said = _RUNGS.get(rung, "A compaction is coming.")
    # THE TEACHING IS FRONT-LOADED AND THEN DROPPED. At 50% there is room to explain what a
    # pin is; at 95% there is not, and for a long time both rungs said nearly the same
    # thing at nearly the same length — six to eight paragraphs, four times a session, into
    # a context this very message is warning is nearly full. What repeats is the MEASURED
    # half (the reading, the shape, the counts) because that is different every time and
    # cannot be learned once. What a pin IS, and that nothing is a fine answer, is in the
    # `journal` skill and in the start block, and is said here only at the first rung.
    early = rung <= 0.5
    out = [
        say("head", pct=round(pct), used=format(used, ","), window=format(window, ","), said=said),
    ]
    if early:
        out.append("A compaction keeps what was DONE and drops what was DECIDED. Pins and open "
                   "work are what cross it; everything else has to be read back on purpose.")
    standing = say("standing", n=pinned, since=since or None)
    out.append(say("claim", standing=standing, early=say("claim_early") if early else ""))
    if latest and early:
        # THE STANDARD, SHOWN RATHER THAN DESCRIBED. "Short and concrete" is an instruction
        # nobody can check themselves against; the last pin that was accepted is one they can.
        out.append(say("latest", latest=latest))
    out.append('  .journal/journal.py pins add "<the claim, in one line>"\n'
               '  .journal/journal.py todos add "<title>"   work you are holding for later '
               "lives only in this window")
    if early:
        out.append(_NOTHING_IS_FINE)
    if gated:
        # A DECISION IS REQUIRED, A PIN IS NOT. The gate is what makes this land — the
        # nudge alone was measured and did not — and "nothing" has to be as cheap a way
        # through it as a pin, or the gate manufactures pins.
        out.append(
            "NOTHING ELSE RUNS UNTIL YOU HAVE DECIDED. The next tool call is denied until "
            "one of these has run:\n"
            '  .journal/journal.py pins add "<the claim>"\n'
            '  .journal/journal.py nothing "<why nothing here needs pinning>"\n'
            "Both are one command. The journal's own commands still run, so `search` and "
            "`--back=1` are available to decide with."
        )
    if made_of:
        out.append(say("made_of", rows=[
            say("share", share=format(share, ">5.0%"), label=_LABELS.get(kind, kind),
                lever=_LEVER[kind] if kind in _LEVER and share >= _LEVER_AT else None)
            for kind, share in made_of[:4]]))
    return "\n\n".join(out)
