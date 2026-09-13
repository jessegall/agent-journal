#!/usr/bin/env python3
"""questions.py: ask, link, answer, withdraw, and the stop nudge."""
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


def j(*a):
    return P.cli(*a)


def stored():
    f = d / ".journal" / "environments" / "default" / "questions.json"
    return json.loads(f.read_text())["questions"] if f.is_file() else []


# ------------------------------------------------------------------ something to link to
j("todos", "add", "build the thing")
j("pins", "add", "a fact worth keeping")

# ------------------------------------------------------------------ ask
code, out = j("questions", "add", "which database?")
check("a bare question", (code, "question 1" in out), (0, True))
code, out = j("questions", "add", "is the fact still true?", "--about=todo 1", "--about=pin 1")
check("a question about two resources", (code, "question 2, about to-do 1, pin 1" in out), (0, True))
check("stored with one spelling per link", stored()[1]["links"], ["todo:1", "pin:1"])
check("stored on this environment's own file", len(stored()), 2)

code, out = j("questions", "add", "nothing?", "--about=todo 99")
check("a link to a to-do that does not exist is refused", code, 1)
code, out = j("questions", "add", "huh", "--about=banana 3")
check("a link that is not a reference is refused", (code, "todo 22" in out), (1, True))
code, out = j("questions", "add", "part?", "--about=pin 1.2")
check("only a doc takes a part number", code, 1)
code, out = j("questions", "add")
check("a question needs its text", code, 1)

# ------------------------------------------------------------------ list and show
code, out = j("questions")
check("listed", ("which database?" in out, "is the fact still true?" in out, "2 open" in out), (True, True, True))
code, out = j("questions", "show", "2")
check("show names what it is about", (code, "to-do 1, pin 1" in out, "open" in out), (0, True, True))
code, out = j("question", "2")
check("`question N` is the same read", (code, "is the fact still true?" in out), (0, True))

# ------------------------------------------------------------------ link and unlink
code, out = j("questions", "link", "1", "todo 1")
check("linked", (code, "about to-do 1" in out), (0, True))
code, out = j("questions", "link", "1", "todo:1")
check("the same link twice is refused", code, 1)
code, out = j("questions", "unlink", "2", "pin 1")
check("unlinked", (code, stored()[1]["links"]), (0, ["todo:1"]))
code, out = j("questions", "unlink", "2", "pin 1")
check("unlinking what is not linked is refused", code, 1)

# ------------------------------------------------------------------ many questions on one resource
sys.path.insert(0, str(d / ".journal"))
import questions as q_mod  # noqa: E402
root = d / ".journal"
check("a resource carries every question linked to it",
      [n for n, _ in q_mod.about(root, "todo:1", "default")], [1, 2])

# ------------------------------------------------------------------ answer, and the agent is told once
code, out = j("questions", "answer", "1", "postgres")
check("answered", (code, "answered question 1" in out), (0, True))
check("an answered question is untold until the agent hears it, a question about a to-do too",
      [n for n, _ in q_mod.untold(root, "default")], [1])
code, out = j("questions")
check("open ones list before answered ones",
      out.index("is the fact still true?") < out.index("which database?"), True)
q_mod.mark_told(root, "default", [1], "2026-09-13T00:00:00Z")
check("told once, then quiet", q_mod.untold(root, "default"), [])
code, out = j("questions", "answer", "1", "sqlite after all")
check("answering again replaces it and keeps the earlier answer",
      (code, stored()[0]["answer"], stored()[0]["told_at"], stored()[0]["earlier_answers"][0]["answer"]),
      (0, "sqlite after all", None, "postgres"))
code, out = j("questions", "answer", "2")
check("an answer needs its text", code, 1)

# ------------------------------------------------------------------ withdraw
code, out = j("questions", "withdraw", "2")
check("withdrawing needs a reason", code, 1)
code, out = j("questions", "withdraw", "2", "not needed")
check("withdrawn", code, 0)
code, out = j("questions")
check("a withdrawn question leaves the list", "is the fact still true?" in out, False)
code, out = j("questions", "--all")
check("and stays under --all", ("is the fact still true?" in out, "not needed" in out), (True, True))
code, out = j("questions", "answer", "2", "late")
check("a withdrawn question cannot be answered", code, 1)

# ------------------------------------------------------------------ per environment
j("prepare", "elsewhere")
code, out = j("questions")
check("another environment has its own questions", "which database?" in out, False)
j("switch", "default")

# ------------------------------------------------------------------ the web viewer's shape
rows = q_mod.rows_response(root, "default", all_of_them=True)
check("rows carry status and labelled links",
      [(r["n"], r["status"], [l["label"] for l in r["links"]]) for r in rows],
      [(1, "answered", ["to-do 1"]), (2, "withdrawn", ["to-do 1"])])

# ------------------------------------------------------------------ writes are writes to the hook
import hook  # noqa: E402
cmd = lambda c: {"tool_name": "Bash", "tool_input": {"command": c}}  # noqa: E731
check("asking, answering and linking are writes; reading is not",
      [hook._journal_write(cmd(f".journal/journal.py {c}")) for c in
       ("questions add x", "question answer 1 y", "questions link 1 todo 1", "questions", "questions show 1")],
      ["questions", "question", "questions", None, None])

# ------------------------------------------------------------------ a real stop tells the agent, once
import transcript  # noqa: E402
tdir = transcript.project_dir(d)
tdir.mkdir(parents=True, exist_ok=True)
tpath = tdir / "s1.jsonl"
tpath.write_text("")


def fire(event, **extra):
    return P.hook(event, session_id="s1", transcript_path=str(tpath), **extra)[1]


def turn(user_text, reply):
    with tpath.open("a") as fh:
        fh.write(json.dumps({"type": "user", "origin": {"kind": "human"}, "uuid": f"u{os.urandom(3).hex()}",
                             "message": {"role": "user", "content": user_text}}) + "\n")
    fire("UserPromptSubmit", prompt=user_text)
    with tpath.open("a") as fh:
        fh.write(json.dumps({"type": "assistant", "uuid": f"a{os.urandom(3).hex()}", "message": {
            "role": "assistant", "content": [{"type": "text", "text": reply}],
            "usage": {"input_tokens": 1000}}}) + "\n")


fire("SessionStart", source="startup")
j("questions", "add", "which port?")
j("questions", "answer", "3", "8420")
turn("how is it going", "[!reply] fine")
label, text = testkit.hold(fire("Stop", stop_hook_active=False))
check("the stop names the answered question, and not the one about a to-do",
      (label, "which port? → 8420" in text, "sqlite after all" in text),
      ("the user answered question 3", True, False))
check("and the record remembers it told them", [n for n, _ in q_mod.untold(root, "default")], [1])
turn("and now", "[!reply] still fine")
label, _ = testkit.hold(fire("Stop", stop_hook_active=False))
check("a later stop does not repeat the question, and the answered to-do question arrives with its to-do",
      label, "the user answered to-do 1")
check("the to-do's notice marks its question told", q_mod.untold(root, "default"), [])

# the bug this guards: a question about the OPEN work's to-do was never told, because the
# to-do's own notice only runs with nothing open
j("todos", "start", "1")
j("questions", "add", "which schema?", "--about=todo 1")
n_open = len(q_mod._all(root, "default"))
j("questions", "answer", str(n_open), "the new one")
turn("go on", "[!reply] going")
label, text = testkit.hold(fire("Stop", stop_hook_active=False))
check("with its to-do being worked, a question about it is told at the next stop",
      (label, "which schema? → the new one" in text), (f"the user answered question {n_open}", True))

# ------------------------------------------------------------------ to-dos ask through questions
j("todos", "add", "pick a colour")
code, out = j("todos", "ask", "2", "red or blue?")
check("todos ask files a question linked to the to-do", (code, stored()[-1]["links"]), (0, ["todo:2"]))
todo_file = next((d / ".journal" / "environments" / "default" / "todo").glob("002-*.md")).read_text()
check("and writes nothing about it into the to-do's file", ("asks:" in todo_file, "answer:" in todo_file), (False, False))
import todo as todo_mod  # noqa: E402
check("the to-do reads as waiting on the user", [t["n"] for t in todo_mod.asking(root, "default")], [2])
j("questions", "add", "which shade?", "--about=todo 2")
code, out = j("todos", "answer", "2", "red")
check("with two open questions, todos answer asks for each by number", (code, "answer each" in out), (1, True))
j("questions", "answer", str(len(stored()) - 1), "red")
check("one answered, one open: still waiting", [t["n"] for t in todo_mod.asking(root, "default")], [2])
code, out = j("todos", "answer", "2", "crimson")
check("the last open one answers through todos answer", (code, "answered to-do 2" in out), (0, True))
t2 = todo_mod.item(root, "default", 2)[0]
check("answered: nothing waits, and the to-do reads its question and answer",
      (todo_mod.asking(root, "default"), t2["asks"], t2["answer"]), ([], "which shade?", "crimson"))

# ------------------------------------------------------------------ the migration moves old asks out of the files
import migrate  # noqa: E402
j("todos", "add", "an old one")
old = next((d / ".journal" / "environments" / "default" / "todo").glob("003-*.md"))
old.write_text(old.read_text().replace("---\n", "---\nasks: tabs or spaces?\nanswer: tabs\n", 1))
said = migrate._todo_questions(root)
check("the old question becomes a question linked to its to-do, with its answer",
      ([q for q in stored() if q["links"] == ["todo:3"]][0]["answer"], "question" in said[0]), ("tabs", True))
check("and leaves the file without it", "asks:" in old.read_text(), False)
before = len(stored())
migrate._todo_questions(root)
check("running it again changes nothing", len(stored()), before)

# ------------------------------------------------------------------ a question with a description and options
code, out = j("questions", "add", "which port?", "--description=The viewer needs one.", "--option=8420", "--option=9000")
n_port = len(q_mod._all(root, "default"))
code, out = j("questions", "show", str(n_port))
check("show prints the description and the numbered options",
      (code, "The viewer needs one." in out, "1. 8420" in out, "2. 9000" in out), (0, True, True, True))
j("questions", "withdraw", str(n_port), "only testing the options")

print(f"\n{ok} passed, {fail} failed")
raise SystemExit(1 if fail else 0)
