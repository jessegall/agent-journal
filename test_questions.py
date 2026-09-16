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
code, out = j("questions", "add", "which shell?", "--option=zsh", "--option=bash", "--pick=2")
n_shell = len(q_mod._all(root, "default"))
check("the agent's pick is stored as the option's number and shown beside it",
      (code, q_mod._all(root, "default")[-1].get("pick"), "2. bash  (the agent's pick)" in j("questions", "show", str(n_shell))[1]),
      (0, 2, True))
code, out = j("questions", "add", "which editor?", "--option=vim", "--pick=3")
check("a pick that is not one of the options is refused", (code != 0, "1 to 1" in out, len(q_mod._all(root, "default"))), (True, True, n_shell))
j("questions", "withdraw", str(n_shell), "only testing the pick")

# ------------------------------------------------------------------ rewording an answered question asks it again
code, out = j("questions", "add", "which colour for the header?")
n_colour = len(q_mod._all(root, "default"))
j("questions", "answer", str(n_colour), "blue")
code, out = j("questions", "edit", str(n_colour), "which colour for the header, in dark mode?")
q = q_mod._all(root, "default")[-1]
check("rewording an answered question opens it again and says so",
      (code, "open again" in out, q_mod.is_open(q), [a["answer"] for a in q.get("earlier_answers") or []]), (0, True, True, ["blue"]))
code, out = j("questions", "edit", str(n_colour), "which colour for the header, in dark mode?", "--option=blue", "--option=grey")
check("changing only the options of an open question does not touch its history",
      (code, [a["answer"] for a in q_mod._all(root, "default")[-1].get("earlier_answers") or []]), (0, ["blue"]))
j("questions", "withdraw", str(n_colour), "only testing the reword")

# ------------------------------------------------------------------ an option carries a description and a code example
code, out = j("questions", "add", "where does the cache live?",
              "--option=In memory", "--option-description=Fast, lost on restart",
              "--option=On disk", "--option-description=Survives restarts", "--option-code=cache = DiskCache('.cache')")
n_cache = len(q_mod._all(root, "default"))
check("each option keeps the description and code given in its position",
      (code, q_mod.row_response(n_cache, q_mod._all(root, "default")[-1])["options"]),
      (0, [{"label": "In memory", "description": "Fast, lost on restart", "code": ""},
           {"label": "On disk", "description": "Survives restarts", "code": "cache = DiskCache('.cache')"}]))
code, out = j("questions", "show", str(n_cache))
check("show prints each option's description and code under it",
      ("1. In memory" in out, "Fast, lost on restart" in out, "cache = DiskCache('.cache')" in out), (True, True, True))
check("an option stored as a bare string, as older questions have, reads as its label",
      q_mod._options(["8420", {"label": "9000", "code": "port = 9000"}]),
      [{"label": "8420", "description": "", "code": ""}, {"label": "9000", "description": "", "code": "port = 9000"}])
j("questions", "withdraw", str(n_cache), "only testing option descriptions")

for title in ("Which way? A) keep it B) drop it", "Which port: 1. 8420 2. 9000", "pick one:\n- vim\n- emacs",
              "which do you want (a) the fast one (b) the safe one"):
    code, out = j("questions", "add", title)
    check(f"a question that lists its choices in its text is refused, pointing at --option: {title[:24]!r}",
          (code, "--option=" in out, "--description=" in out), (1, True, True))
for title in ("ship 1.131.85 today, or wait for the 2.0 branch?", "is e.g. the Files page (the one in the sidebar) still needed?"):
    code, out = j("questions", "add", title)
    check(f"an ordinary question is not mistaken for a list of choices: {title[:24]!r}", code, 0)
code, out = j("questions", "edit", "1", "Which? A) this B) that")
check("rewording a question into a list of choices is refused too", (code, "--option=" in out), (1, True))

# ------------------------------------------------------------------ questions about the coding style
check("bare style is a reference to the coding style as a whole",
      [q_mod.parse_ref(t)[0] for t in ("style", "coding style", "Style")], ["style", "style", "style"])
check("style with a subject names one rule", [q_mod.parse_ref(t)[0] for t in ("style naming", "style:early-returns")],
      ["style:naming", "style:early-returns"])
check("each reads back in words", q_mod.labels(["style", "style:naming"]), ["the coding style", "coding style rule naming"])
code, out = j("questions", "add", "tabs or spaces?", "--about=style")
check("a question about the coding style as a whole needs no rule to exist", (code, "about the coding style" in out), (0, True))
code, out = j("questions", "add", "camelCase?", "--about=style naming")
check("a question about a rule that does not exist is refused", (code, "no coding style rule" in out), (1, True))
j("style", "add", "naming", "How things are named", "--decision=camelCase for variables", "--when=naming anything")
code, out = j("questions", "add", "camelCase for constants too?", "--about=style naming")
check("once the rule exists, the question is filed about it", (code, "about coding style rule naming" in out), (0, True))
check("about() finds each by its reference", ([len(q_mod.about(root, "style", "default")), len(q_mod.about(root, "style:naming", "default"))]), [1, 1])
check("the row carries the reference the viewer links by",
      [l["ref"] for l in q_mod.row_response(1, q_mod.about(root, "style:naming", "default")[0][1])["links"]], ["style:naming"])

# ------------------------------------------------------------------ the title is one line
long_title = ("Auto mode is per environment today, and that was deliberate: one environment of chores can drain itself "
              "while another full of design questions waits for you. Making it global removes that. Which do you want?")
code, out = j("questions", "add", long_title)
check("a title that reads as a brief is refused, naming the cap and where the context goes",
      (code, f"{len(long_title)} characters" in out, "200" in out, "--description=" in out), (1, True, True, True))
check("and nothing was stored", [q["text"] for q in stored() if q["text"] == long_title], [])
code, out = j("questions", "add", "Should auto mode be one switch for the whole journal?", f"--description={long_title}")
check("the same words fit once they are the description, not the title", (code, "question" in out), (0, True))
code, out = j("questions", "edit", "1", long_title)
check("rewording a question into a brief is refused too", (code, "characters" in out), (1, True))
code, out = j("questions", "add", "x" * 200)
check("exactly the cap is allowed", code, 0)

print(f"\n{ok} passed, {fail} failed")
raise SystemExit(1 if fail else 0)
