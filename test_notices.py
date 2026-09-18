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

code, out = j("notice", "")
check("a notice needs its line", (code, "wants the line the user sees" in out), (1, True))
code, out = j("notice", "the build is green again", "--tone=sideways")
check("and a tone the viewer has no colour for is refused", (code, "is not a tone" in out), (1, True))
code, out = j("notice", "x" * 200)
check("a notice is one line, not a message", (code, "is a message, not a notice" in out), (1, True))

code, out = j("notice", "The PR is open: github.com/x/y/pull/3", "--tone=good", "--link=https://example.test/pr/3")
check("a notice is pinned to the top of the chat", (code, "at the top of the chat" in out), (0, True))
code, out = j("notices")
check("and it is listed as up, with its tone", (code, "The PR is open" in out, "up" in out, "good" in out), (0, True, True, True))

# ONLY ON PURPOSE. The X is the user's; the agent can retire its own when it stops being true.
code, out = j("notices", "close", "1")
check("closing it takes it down", (code, "is down" in out), (0, True))
code, out = j("notices", "close", "1")
check("closing it twice says so rather than pretending", (code, "already down" in out), (1, True))
code, out = j("notices", "close", "9")
check("and a notice that never existed is refused", (code, "no notice 9" in out), (1, True))

code, out = j("notices")
check("the list is empty once it is closed", (code, "Nothing is pinned" in out), (0, True))
code, out = j("notices", "--all")
check("--all still shows what was said", (code, "The PR is open" in out), (0, True))

print(f"\n{ok} passed, {fail} failed")
sys.exit(1 if fail else 0)
