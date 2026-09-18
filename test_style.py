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
(d / "CLAUDE.md").write_text("# proj\n\nnotes of our own\n")

BODY = """## Why
A name says what a thing does, so a reader never has to open it.

## Examples
### Bad
```py
def user(id): ...
```
### Good
```py
def load_user(id): ...
```

## Triggers
- what should I call this function
- rename this variable
"""

code, out = P.cli("style", "add", "naming", "How functions and values are named",
                  "--decision=Functions are verbs, values are nouns", "--when=Use it when naming a function, a variable or a file.",
                  "--brief", stdin=BODY)
check("a rule is added, naming its skill", (code, "style-naming" in out), (0, True))
skill = d / ".claude" / "skills" / "style-naming"
check("adding it writes its skill: SKILL.md, examples, triggers and the generator's marker",
      [(skill / f).is_file() for f in ("SKILL.md", "reference/examples.md", "evals/triggers.json", ".generated-by-agent-journal")],
      [True, True, True, True])
text = (skill / "SKILL.md").read_text()
check("the skill is named after its subject, says when it loads and carries the decision",
      ("name: style-naming" in text, "Use it when naming a function" in text, "Functions are verbs, values are nouns" in text,
       "A name says what a thing does" in text), (True, True, True, True))
check("its examples are the rule's", "def load_user(id)" in (skill / "reference" / "examples.md").read_text(), True)
_desc = next(l for l in (skill / "SKILL.md").read_text().splitlines() if l.startswith("description:"))
check("its description says when to load it, then the rule, as two sentences",
      (_desc.startswith('description: "Use when '), ". This project's rule: " in _desc), (True, True))
check("its SKILL.md links the worked examples as a markdown link",
      "[reference/examples.md](reference/examples.md)" in (skill / "SKILL.md").read_text(), True)
check("its trigger phrases are the rule's", json.loads((skill / "evals" / "triggers.json").read_text())["triggers"],
      ["what should I call this function", "rename this variable"])
claude = (d / "CLAUDE.md").read_text()
check("CLAUDE.md lists the style skill in its own block, keeping what was there",
      ("BEGIN: agent-journal style" in claude, "style-naming" in claude, "notes of our own" in claude), (True, True, True))
code, out = P.cli("style")
check("journal style lists the rule", (code, "naming" in out, "Functions are verbs" in out), (0, True, True))
code, out = P.cli("style", "show", "naming")
check("and shows it", (code, "decision: Functions are verbs, values are nouns" in out), (0, True))

code, out = P.cli("style", "add", "naming", "again", "--decision=x", "--when=y")
check("a second rule for the same subject is refused", code, 1)
code, out = P.cli("style", "add", "spacing", "Blank lines", "--when=Use it when laying out a function.")
check("a rule without a decision is refused", (code, "decision" in out), (1, True))

code, out = P.cli("style", "set", "naming", "decision", "Functions are verbs; values and classes are nouns")
check("changing a rule regenerates its skill",
      (code, "values and classes are nouns" in (skill / "SKILL.md").read_text()), (0, True))

own = d / ".claude" / "skills" / "style-own"
own.mkdir(parents=True)
(own / "SKILL.md").write_text("a skill written by hand\n")
code, out = P.cli("style", "remove", "naming", "we name things differently now")
check("retiring a rule removes its generated skill", (code, skill.exists()), (0, False))
check("but never a style-something skill it did not generate", (own / "SKILL.md").is_file(), True)
check("the retired rule is kept, not deleted", (d / ".journal" / "style" / "struck" / "naming" / "item.md").is_file(), True)
claude = (d / "CLAUDE.md").read_text()
check("with no rule left, the style block leaves CLAUDE.md and the rest stays",
      ("BEGIN: agent-journal style" in claude, "notes of our own" in claude), (False, True))
code, out = P.cli("style", "sync")
check("sync with nothing to do says so", (code, "already current" in out), (0, True))

print(f"\n{ok} passed, {fail} failed")
sys.exit(1 if fail else 0)
