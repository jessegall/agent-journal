#!/usr/bin/env python3
"""A to-do's brief: it reads back with its structure intact, and it can be changed.

    .journal/test_todo.py

Owns what test_queue.py (the stop queue) and test_docs.py (docs, a different shape) do
not: todo.py's own CRUD — a brief's rendering, and the amend/replace verbs that change
one without rewriting the file by hand.
"""
import json, os, re, shutil, subprocess, sys, tempfile, time
from pathlib import Path

os.environ["AGENT_JOURNAL_OFFLINE"] = "1"
os.environ["AGENT_JOURNAL_IN_TESTS"] = "1"
SRC = Path(__file__).resolve().parent
sys.path.insert(0, str(SRC))
import journal, testkit, todo, transcript  # noqa: E402

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
(d / ".journal" / "settings.json").write_text("{}")
tdir = transcript.project_dir(d); tdir.mkdir(parents=True, exist_ok=True)
(tdir / "s1.jsonl").write_text("")
J = str(d / ".journal" / "journal.py")
env = {**os.environ, transcript.SESSION_ENV: "s1"}
root = d / ".journal"


def j(*args, stdin=""):
    p = subprocess.run([J, *args], env=env, input=stdin, capture_output=True, text=True, timeout=180)
    return p.returncode, p.stdout + p.stderr


# ─────────────────────────── a brief round-trips: heading, list, command ──────────────────────
BRIEF = (
    "The opening paragraph, in ordinary prose that is long enough to wrap across more "
    "than one line once it is filled back to the terminal width, so wrapping is actually exercised.\n"
    "## What exactly\n"
    "  - first item of the list\n"
    "  - second item of the list\n"
    "## Where to start\n"
    "    journal todo edit 1 --section=\"What exactly\" --brief\n"
)
code, out = j("todo", "a brief with structure", "--brief", stdin=BRIEF)
check("adding with a brief succeeds", code, 0)
code, out = j("todo", "1")
check("the heading `## What exactly` is on its own line, not swallowed into prose",
      "## What exactly" in out, True)
check("the heading `## Where to start` is on its own line too",
      "## Where to start" in out, True)
check("the indented list items survive, each on its own line",
      ("- first item of the list" in out, "- second item of the list" in out), (True, True))
check("the indented command line survives exactly, not rewrapped",
      'journal todo edit 1 --section="What exactly" --brief' in out, True)

# ─────────────────────────────── to-do 6: amend and replace ───────────────────────────────────
struck_dir = root / "environments" / "default" / "todo" / "struck"


def struck_count():
    return len(list(struck_dir.glob("*.md"))) if struck_dir.is_dir() else 0


before_struck = struck_count()
code, out = j("todos", "amend", "1", "A new part", "--brief", stdin="Content of the new section.\n")
check("amend adds a section", (code, "added section" in out), (0, True))
code, out = j("todo", "1")
check("the new section is there, without disturbing the others",
      ("## A new part" in out, "Content of the new section." in out, "## What exactly" in out, "## Where to start" in out),
      (True, True, True, True))
check("amend snapshots the pre-edit brief under struck/", struck_count(), before_struck + 1)

code, out = j("todos", "amend", "1", "A new part", "--brief", stdin="Try again.\n")
check("amend refuses a duplicate section title", (code, "already has a section" in out), (1, True))
check("and does not snapshot on a refusal", struck_count(), before_struck + 1)

before_struck = struck_count()
code, out = j("todo", "replace", "1", "A new part", "--brief", stdin="Replaced content only.\n")
check("replace swaps ONE named section", (code, "replaced" in out), (0, True))
code, out = j("todo", "1")
check("only the named section changed; the rest is untouched",
      ("Replaced content only." in out, "Content of the new section." not in out,
       "## What exactly" in out, "## Where to start" in out), (True, True, True, True))
check("replace snapshots too, so struck/ now has two", struck_count(), before_struck + 1)

code, out = j("todo", "replace", "1", "No such section", "--brief", stdin="x\n")
check("replace refuses a title that names no section, and lists what it does have",
      (code, "has no section called" in out, "A new part" in out), (1, True, True))

# a titleless replace swaps the whole body
code, out = j("todo", "the untitled one")
n = len(todo._all(root, "default"))
code, out = j("todo", "replace", str(n), "--brief", stdin="Only this now.\n")
check("a titleless replace swaps the whole body", (code, "the whole brief replaced" in out), (0, True))
code, out = j("todo", str(n))
check("and it reads back as exactly that", "Only this now." in out, True)

# ───────────────── --brief never hangs: it is bounded, and an empty read refuses ─────────────
# The flag reads to EOF, and an agent's shell hands the command a stdin nobody closes: the
# hang looked like the journal thinking. Both shapes below returned nothing before this.
code, out = j("todos", "add", "no brief came", "--brief", stdin="")
check("--brief with nothing on stdin refuses, naming the spelling that works",
      (code, "takes the brief on stdin" in out, "drop --brief" in out), (1, True, True))

r, w = os.pipe()  # a stdin that is open and never closes: it must refuse, not wait forever
started = time.time()
p = subprocess.Popen([J, "todos", "add", "stdin never closes", "--brief"], env=env,
                     stdin=r, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
os.close(r)
try:
    out = p.communicate(timeout=journal.BRIEF_WAIT + 20)[0]
except subprocess.TimeoutExpired:
    p.kill(); out = "HUNG"
os.close(w)
check("a stdin that never closes refuses inside the bound, instead of hanging",
      (p.returncode, "takes the brief on stdin" in out,
       time.time() - started < journal.BRIEF_WAIT + 10), (1, True, True))

# A PAYLOAD THAT OPENS WITH `--` IS PAYLOAD, after a bare `--`. Without it, a title
# beginning with a known flag was parsed as that flag: `todos add "--env= is validated
# twice"` was refused with a message about environments, and nothing was written.
code, out = j("todos", "add", "--", "--env= is validated in one place")
check("a title that opens with a flag lands after `--`", (code, "--env= is validated" in out), (0, True))
code, out = j("todos")
check("and it is in the list", "--env= is validated in one place" in out, True)
code, out = j("todos", "add", "--nonsense=1", "a title")
check("an unknown option is still refused rather than kept as words", code, 1)

# ─────────────── set aside on a CONDITION: not done, not abandoned, not the user's ────────
# The state whose absence built a parking-bay environment: a row the agent cannot do now,
# for a reason that is nobody's to answer.
code, out = j("todos", "add", "needs the rig batch")
n = re.search(r"to-do (\d+)", out).group(1)
code, out = j("todos", "block", n)
check("a block wants its reason, like every retirement here", (code, "what has to be true" in out), (1, True))
code, out = j("todos", "block", n, "the rig batch has not run")
check("set aside, with what it waits on", (code, "set aside" in out), (0, True))
code, out = j("todos")
check("the list still shows it, and says why", ("set aside: the rig batch has not run" in out), True)
code, out = j("next")
check("but `next` does not offer it", f"to-do {n}," in out, False)
code, out = j("todos", "start", n)
check("starting it ends the block: picking it up IS the judgement", code, 0)
code, out = j("todos")
check("and it reads as started, not set aside", "set aside" in out, False)

# ─────────────────── a prerequisite: a block whose condition the code can check ───────────
code, out = j("todos", "add", "the groundwork")
first = re.search(r"to-do (\d+)", out).group(1)
code, out = j("todos", "add", "the part that follows", f"--after={first}")
second = re.search(r"to-do (\d+)", out).group(1)
check("a row can be filed already knowing what it follows",
      (code, f"waits on {first}" in out), (0, True))
code, out = j("next")
check("`next` does not offer it while the groundwork is open", f"to-do {second}," in out, False)
code, out = j("todos", "after", second, "9999")
check("an unknown prerequisite is refused", (code, "numbered 9999" in out), (1, True))
code, out = j("todos", "after", second, second)
check("so is waiting on itself", (code, "cannot wait on itself" in out), (1, True))
code, out = j("todos", "after", first, second)
check("and so is a cycle, when it is written rather than when next goes quiet",
      (code, "that is a cycle" in out), (1, True))
j("todos", "done", first, "landed")
code, out = j("todos")
check("with the groundwork done the row reads as ready", "all done: ready" in out, True)
code, out = j("todos")
check("and the row is ready — nobody had to release it", "all done: ready" in out, True)
import todo as _todo
check("`ready` counts it, which is what next and auto read",
      str(second) in [str(x["n"]) for x in _todo.ready(d / ".journal", "default")], True)
code, out = j("todos", "after", second, "--none")
check("a prerequisite can be cleared", (code, "waits on nothing" in out), (0, True))

# ─────────── a to-do's state is a priority order, and the order is the decision ────────────
# `asks` was HISTORY read as STATE: `ask()` records the question and nothing ever clears it,
# and the ladder tested it bare — so any row ever asked a question shadowed started,
# assigned, reported, blocked and after, and printed "waits on the user" for the rest of the
# project. Found by a dogfood agent, which preserved the behaviour and reported it.
import todo as _t
check("a row picked up after a question is STARTED, not still waiting on the user",
      _t._state({"asks": "which way?", "started": "now"}), "started")
check("and the question is still on the record — history is kept, it just is not the state",
      _t._state({"asks": "q", "answer": "a", "started": "now", "reported": "done it"}), "reported")
check("an unanswered question nobody picked up is the one thing that waits on the user",
      (_t._state({"asks": "q"}), _t._state({"asks": "q", "answer": "a"})), ("asks", "answered"))
check("every state is reachable — a rung nothing can reach is a rung that is wrong",
      sorted({_t._state(row) for row in (
          {"done": "d"}, {"asks": "q", "answer": "a"}, {"asks": "q"}, {"reported": "r"},
          {"assigned": "z9"}, {"blocked": "b"}, {"after": "12"}, {"started": "s"}, {})}),
      sorted(n for n, _ in _t._STATES))
# THE PRECEDENCE IS THE DECISION, so it is asserted rather than left to the reader. A row
# that is both blocked and started reports why it is not moving NOW.
for _row, _first, _also in (({"blocked": "b", "started": "s"}, "blocked", ["started"]),
                            ({"after": "12", "started": "s"}, "after", ["started"]),
                            ({"assigned": "z9", "blocked": "b"}, "assigned", ["blocked"]),
                            ({"reported": "r", "assigned": "z9"}, "reported", ["assigned"])):
    check(f"{_first} outranks {_also[0]}",
          (_t._state(_row), _t.states_of(_row)[1:]), (_first, _also))

# ────────────── ending work is not finishing a row (rule 4) ────────────────────────────────
# `work end` closed any started to-do whose title matched, unconditionally. In one real
# project 710 of 1,810 closed rows closed that way rather than because anyone decided they
# were done, and 36 were caught and reopened: "parked on a Kit gap, not done — the work-end
# closed it". The cause was one spelling for two meanings — "this is finished" and "I am
# putting this down" — and an agent interrupted mid-row does the tidy thing.
_n = re.search(r"to-do (\d+)", j("todos", "add", "a row somebody is in the middle of")[1]).group(1)
j("todos", "start", _n)
_code, _out = j("work", "end", "a row somebody is in the middle of")
check("a bare work end leaves the row standing, and says so",
      (f"to-do {_n} has this title and STAYS OPEN" in _out,
       "a row somebody is in the middle of" in j("todos")[1]), (True, True))
check("and it names both ways to close it",
      (f'journal todos done {_n}' in _out, "--todo" in _out), (True, True))
# `started` is never cleared by a bare `work end`, so the listing used to keep claiming
# "work is open" for a row that plainly is not — `journal open` said nothing was, right
# beside a to-do insisting otherwise.
_listing = j("todos")[1]
_block = _listing[_listing.index("a row somebody is in the middle of"):]
check("the row no longer claims work is open once it plainly is not",
      ("work is open" in _block.splitlines()[1], "ended without closing this row" in _block.splitlines()[1]),
      (False, True))
j("todos", "start", _n)
_code, _out = j("work", "end", "a row somebody is in the middle of", "--todo")
check("--todo closes both", (f"to-do {_n} is done with it" in _out,
                             "a row somebody is in the middle of" in j("todos")[1]), (True, False))
check("and the reason distinguishes this era from the auto-closed one",
      ("same name" in j("todos", "--all")[1], "the work that finished it" in j("todos", str(_n))[1]),
      (False, True))

# ─────────── the ledger is a reading of the files, and must prove itself against them ──────
# One file holds every row's front matter so a count costs one scandir instead of 1,891 file
# opens. That is a cache over the store this package exists to keep honest, so the only thing
# that makes it acceptable is that a stale one is DETECTED — per file, by mtime and size, so
# a hand edit, another process's write and a git checkout are all caught the same way.
import todo as _tm
_r = root
_dir = _tm.folder(_r, "default")
_open_before = len(_tm.open_items(_r, "default"))
_led = _tm._index_file(_r, "default")
check("the ledger is written, and under runtime/ where derived things live",
      (_led.is_file(), "runtime" in str(_led)), (True, True))
check("nothing in it is the body — a listing says 'has a brief' and never prints one",
      any("body" in row.get("meta", {}) for row in json.loads(_led.read_text())["rows"].values()),
      False)

# a row edited BY HAND, with nothing in memory — the shape a second process sees
_f = sorted(_dir.glob("*.md"))[0]
_was = _f.read_text()
_f.write_text(_was.replace("done: ", "done: 2020-01-01T00:00:00+00:00"))
_tm._LISTED.clear()
check("a hand edit outside the CLI is caught", len(_tm.open_items(_r, "default")), _open_before - 1)
_f.write_text(_was)
_tm._LISTED.clear()
check("and undoing it is caught too", len(_tm.open_items(_r, "default")), _open_before)

# a row that disappears and comes back
_g = sorted(_dir.glob("*.md"))[-1]
_kept = _g.read_text(); _n_before = len(_tm._all(_r, "default"))
_g.unlink(); _tm._LISTED.clear()
check("a deleted row leaves the ledger", len(_tm._all(_r, "default")), _n_before - 1)
_g.write_text(_kept); _tm._LISTED.clear()
check("and a restored one comes back", len(_tm._all(_r, "default")), _n_before)

# a ledger from an older shape is discarded, never interpreted
_led.write_text(json.dumps({"v": -1, "rows": {"nonsense.md": {"stamp": [0, 0], "meta": {"n": 999}}}}))
_tm._LISTED.clear()
check("a ledger in an unknown shape is thrown away, not read",
      [t["n"] for t in _tm._all(_r, "default") if t["n"] == 999], [])
# and one that is corrupt outright
_led.write_text("{not json")
_tm._LISTED.clear()
check("a corrupt ledger is a rebuild, never a failure", len(_tm._all(_r, "default")), _n_before)
check("the body is still there for whoever asks for one row",
      bool(_tm._get(_r, "default", _tm._all(_r, "default")[0]["n"])[0].get("body") is not None), True)

print(f"\n{ok} passed, {fail} failed")
sys.exit(1 if fail else 0)
