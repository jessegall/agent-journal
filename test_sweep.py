#!/usr/bin/env python3
import json, os, sys, tempfile
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
root = d / ".journal"
env = root / "environments" / "default"
OLD = "2020-01-01T00:00:00+00:00"


def j(*a, stdin=""):
    return P.cli(*a, stdin=stdin)


def load(key):
    return json.loads((env / f"{key}.json").read_text())[key]


def save(key, items):
    (env / f"{key}.json").write_text(json.dumps({key: items}))


j("todos", "add", "something to ask about")
j("questions", "add", "old question?")
j("questions", "answer", "1", "an old answer")
j("questions", "add", "new question?")
j("messages", "add", "an old message")
j("messages", "process", "1", "--part=an old message", "--became=noted")
j("messages", "done", "1")
j("messages", "add", "a waiting message")

qs = load("questions"); qs[0]["answered_at"] = OLD; save("questions", qs)
ms = load("inbox"); ms[0]["processed"] = OLD; save("inbox", ms)

import prune  # noqa: E402
got = prune.sweep(root, "default")
check("the sweep counts what it removed per store", (got.get("questions"), got.get("inbox")), (1, 1))

qs, ms = load("questions"), load("inbox")
check("a question answered long ago loses its text and answer, keeps its place and stays closed",
      (len(qs), qs[0]["text"], qs[0]["answer"], bool(qs[0].get("removed")), qs[1]["text"]),
      (2, "", "", True, "new question?"))
check("an old processed message loses its text, keeps its status", (ms[0]["text"], bool(ms[0]["processed"]), ms[1]["text"]),
      ("", True, "a waiting message"))

import questions  # noqa: E402
check("a removed question is not open", questions.is_open(qs[0]), False)
code, out = j("questions", "--all")
check("lists skip removed items", ("old question?" in out, "new question?" in out), (False, True))
code, out = j("questions", "show", "2")
check("numbers did not shift", "new question?" in out, True)
check("a second sweep removes nothing more", prune.sweep(root, "default"), {})

print(f"\n{ok} passed, {fail} failed")
sys.exit(1 if fail else 0)
