"""A face on a turn: either side leaves one, the same one again takes it off, and the user's is told."""
from __future__ import annotations

import os
import sys
import tempfile
from pathlib import Path

os.environ["AGENT_JOURNAL_OFFLINE"] = "1"
os.environ["AGENT_JOURNAL_IN_TESTS"] = "1"
SRC = Path(__file__).resolve().parent
sys.path.insert(0, str(SRC))
import testkit  # noqa: E402

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
P = testkit.Project(d)
j = P.cli
root = d / ".journal"

import reactions  # noqa: E402

code, out = j("messages", "add", "thank you, that worked")
code, out = j("react", "1", "🚀")
check("a face the viewer cannot draw is refused", (code, "is not one the viewer can draw" in out), (1, True))
code, out = j("react", "1", "👍")
check("the agent reacts to what the user said", (code, "reacted 👍 to message 1" in out), (0, True))
code, out = j("reactions")
check("and the list says what is on which turn", (code, "message:1" in out, "👍 by agent" in out), (0, True, True))

# THE SAME FACE AGAIN IS THE UNDO. There is no separate verb, because the gesture is the verb.
code, out = j("react", "1", "👍")
check("leaving the same one again takes it off", (code, "took the 👍 off message 1" in out), (0, True))
code, out = j("reactions")
check("and then nothing carries a face", (code, "Nothing has been reacted to" in out), (0, True))

# A NUMBER MEANS A MESSAGE; the viewer writes the turn's own key, and both land on the same turn.
env = j("environment")[1].split()[0].strip("`") if False else "default"
took, said, off = reactions.leave(root, "1", "❤️", "2099-01-01T00:00:00+00:00", by="user", track=env)
check("the viewer's own key and the agent's number are the same turn", (took, off), (True, False))

# A FACE THE USER LEFT IS AN ANSWER, so it is owed to the agent exactly once.
waiting = [(turn, r["face"]) for turn, _, r in reactions.untold(root, env)]
check("the user's reaction is waiting to be told", waiting, [("message:1", "❤️")])
reactions.mark_told(root, env, [(t, i) for t, i, _ in reactions.untold(root, env)], "2099-01-01T00:00:01+00:00")
check("and once told it is not told again", reactions.untold(root, env), [])

# the agent's own is never owed to anybody: it is the agent that would be told
reactions.leave(root, "message:1", "🎉", "2099-01-01T00:00:02+00:00", by="agent", track=env)
check("the agent's own reaction is not queued for the agent", reactions.untold(root, env), [])

print(f"\n{ok} passed, {fail} failed")
sys.exit(1 if fail else 0)
