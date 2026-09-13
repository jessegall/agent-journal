#!/usr/bin/env python3
"""claude_md.py: a chosen rule is written into CLAUDE.md between journal markers, and taken out again."""
import os, sys, tempfile
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
md = d / "CLAUDE.md"


def j(*a, stdin=""):
    return P.cli(*a, stdin=stdin)


def text():
    return md.read_text() if md.is_file() else ""


md.write_text("# the project\n\nWhat the user wrote by hand.\n")
(d / "src").mkdir()
(d / "src" / "parser.py").write_text("THE WHOLE FILE, WHICH MUST NOT BE COPIED\n")
j("docs", "add", "Parsing", "--abstract=how input is parsed", "--brief", stdin="intro\n")
j("rules", "add", "parse input only through src/parser.py", "--doc=1")
j("rules", "add", "a second ruling")

code, out = j("rules", "inject", "1")
check("a rule is injected", (code, "rule 1 is in CLAUDE.md" in out), (0, True))
t = text()
check("between journal markers, tagged with its number",
      ("<!-- journal:rules -->" in t, "<!-- /journal:rules -->" in t, "<!-- journal:rule 1 -->" in t, "<!-- /journal:rule 1 -->" in t),
      (True, True, True, True))
check("the ruling is written, with a path to the file it names and the doc it cites",
      ("parse input only through src/parser.py" in t, "`src/parser.py`" in t, ".journal/docs/" in t), (True, True, True))
check("never the file's content", "MUST NOT BE COPIED" in t, False)
check("what the user wrote stays", t.startswith("# the project\n\nWhat the user wrote by hand."), True)

check("twice is refused", j("rules", "inject", "1")[0], 1)
check("a rule that is not there is refused", j("rules", "inject", "9")[0], 1)

j("rules", "inject", "2")
code, out = j("rules", "uninject", "1")
t = text()
check("uninject takes one out and leaves the other", (code, "<!-- journal:rule 1 -->" in t, "a second ruling" in t), (0, False, True))
check("uninjecting what is not there is refused", j("rules", "uninject", "1")[0], 1)

j("rules", "strike", "2", "no longer holds")
t = text()
check("striking an injected rule takes it out, and an empty block goes with it",
      ("a second ruling" in t, "<!-- journal:rules -->" in t, "What the user wrote by hand." in t), (False, False, True))
check("a struck rule cannot be injected", j("rules", "inject", "2")[0], 1)

j("rules", "add", "a third ruling")
j("rules", "inject", "3")
check("injected again", "a third ruling" in text(), True)
j("disable")
check("journal disable removes the whole block", ("<!-- journal:rules -->" in text(), "What the user wrote by hand." in text()), (False, True))
j("enable")

print(f"\n{ok} passed, {fail} failed")
sys.exit(1 if fail else 0)
