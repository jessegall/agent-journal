#!/usr/bin/env python3
"""`journal enable` / `journal disable`: the kill switch, and that it actually
silences every hook.

    .journal/test_enable.py
"""
import json, os, sys, tempfile
from pathlib import Path

os.environ["AGENT_JOURNAL_OFFLINE"] = "1"
os.environ["AGENT_JOURNAL_IN_TESTS"] = "1"
SRC = Path(__file__).resolve().parent
sys.path.insert(0, str(SRC))
import testkit, transcript  # noqa: E402

ok = fail = 0


def check(label, got, want):
    global ok, fail
    if got == want:
        ok += 1
    else:
        fail += 1
        print(f"  FAIL {label}\n       got  {got!r}\n       want {want!r}")


d = Path(tempfile.mkdtemp()) / "proj"
(d / ".claude").mkdir(parents=True)
testkit.make(d, SRC)
stem = "s1"
path = transcript.project_dir(d) / f"{stem}.jsonl"
path.parent.mkdir(parents=True, exist_ok=True)
path.write_text("")
P = testkit.Project(d)


def j(*a):
    code, out = P.cli(*a, session=stem)
    return code, out.strip()


def fire(event, **extra):
    return P.hook(event, session_id=stem, transcript_path=str(path), **extra)[1]


# ------------------------------------------------------------------ default is ON
code, out = j()
check("bare status does not mention DISABLED by default", "DISABLED" in out, False)

out_on = fire("SessionStart", source="startup")
check("hooks fire normally while enabled (a SessionStart briefing comes back)", bool(out_on.strip()), True)

# ------------------------------------------------------------------ disable silences EVERY event
code, out = j("disable")
check("disabling reports it plainly", (code, "DISABLED" in out), (0, True))
code, out = j()
check("bare status now says so too", "DISABLED" in out, True)

check("SessionStart: nothing at all while disabled", fire("SessionStart", source="startup").strip(), "")
check("Stop: nothing at all while disabled", fire("Stop").strip(), "")
check("PreToolUse: nothing at all — not even a hold on something it would normally gate",
      fire("PreToolUse", tool_name="Bash", tool_input={"command": "echo hi"}).strip(), "")

# a loop firing `journal next` while disabled gets one honest line, not the usual
# hold/to-do advisory — see to-do 20.
code, out = j("next")
check("journal next: one honest line while disabled, not its normal advisory logic",
      (code, "disabled" in out, "journal enable" in out), (0, True, True))

# ------------------------------------------------------------------ the CLI itself is never gated by this
code, out = j("enable")
check("re-enabling works from the same, unaffected CLI", (code, "ENABLED" in out), (0, True))
out_on2 = fire("SessionStart", source="startup")
check("hooks fire again once re-enabled", bool(out_on2.strip()), True)

print(f"\n{ok} passed, {fail} failed")
raise SystemExit(1 if fail else 0)
