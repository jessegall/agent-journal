import json
import subprocess
import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from controllers.types import Agents, Asks, Environments, Plans, Todos  # noqa: E402
from engine.record import Record  # noqa: E402
from engine.sessions import Sessions  # noqa: E402
from resources.base import SYSTEM  # noqa: E402
from tests.kit import check, done  # noqa: E402

HERE = Path(__file__).resolve().parents[1]
project = Path(tempfile.mkdtemp())
root = project / ".journal"


def journal(*argv, env="t", session=""):
    p = subprocess.run([sys.executable, str(HERE / "journal.py"), "--root", str(root), *(("--env", env) if env else ()), *(("--session", session) if session else ()), *argv],
                       cwd=project, capture_output=True, text=True, timeout=20)
    return p.returncode, (p.stdout + p.stderr).rstrip()


# EVERY TYPE'S WORDS, AND THE QUERIES
code, out = journal("todo", "create", "a row", "--brief", "why")
check("a to-do is created by the generic word, as the agent", (code, out.startswith("---")), (0, True))
check("the agent created it", Todos(Record(root, "t")).load(1).seen, ["agent"])
check("transcript queries need no live session", (journal("search", "nothing")[0], journal("conversation")[0], journal("user")[0]), (0, 0, 0))
check("all lists it", journal("todo", "all")[1], "   1  a row")
check("done is refused with a wrong word", journal("todo", "complete", "1")[0], 2)
check("done with a how", journal("todo", "done", "1", "--how", "shipped")[0], 0)
check("a completed row is marked in list output", journal("todo", "all")[1], "   1  a row  [done]")
check("starting a completed row is refused", journal("todo", "start", "1"), (1, "! todo 1 is already done"))
check("the refused start creates no work", journal("work", "all")[1], "")
picture = project / "dashboard.png"
picture.write_bytes(b"png")
journal("todo", "attach", "1", str(picture), "--what", "deployment graph")
check("search without a session still finds file tags", journal("search", "deployment")[1], "  file  todo:1  dashboard.png — deployment graph")
check("status counts", "to-do            0" in journal("status")[1], True)
journal("plan", "create", "The plan", "--set", "goal=all of it")
journal("plan", "phase", "1", "First", "--when", "it is first")
code, out = journal("plan", "todos", "1", "1", "1")
check("a list parameter is positional", (code, "todo:1" in out), (0, True))
journal("plan", "rephrase", "1", "1", "--checkpoint", "true")
journal("plan", "rephrase", "1", "1", "--title", "Still first")
check("a bool-or-none parameter takes a word and keeps it a boolean, untouched when unset", Plans(Record(root, "t")).load(1).phases[0]["checkpoint"], True)
journal("plan", "rephrase", "1", "1", "--checkpoint", "false")
check("the word false is False, not a truthy string", Plans(Record(root, "t")).load(1).phases[0]["checkpoint"], False)
check("continue is the plan's word and only the user's", journal("plan", "continue", "1")[1], "! only the user can continue a plan: they do it in the viewer")
journal("plan", "ready", "1")
check("the user may, with --as", journal("--as", "user", "plan", "activate", "1")[0], 0)
check("carry begins with the start block", journal("carry")[1].startswith("THE JOURNAL IS IN FORCE HERE"), True)
check("open lists open work", journal("open")[1], "")
check("nothing notes the decision on the session's agent row", journal("nothing", "fine as it is", session="s-1")[1], "noted: fine as it is")
check("version is the package's VERSION file", journal("version", env="")[1] != "0", True)
(root / "runtime").mkdir(parents=True, exist_ok=True)
(root / "runtime" / "browser-t.json").write_text(json.dumps({"on": True}))
code, out = journal("browser", "ask", "goto", "https://example.com", "--wait", "0")
ask = Asks(Record(root, "t")).all()[-1]
check("a required argument before variadic browser arguments is bound once", (code, ask.title, ask.op, ask.args), (0, "browser goto", "goto", ["https://example.com"]))

code, out = journal("environment", "prepare", "disposable")
disposable = Environments(Record(root, "t")).find("disposable")
check("an unheld environment can be removed without a bound session", journal("environment", "remove", str(disposable.n), "--how", "finished")[0], 0)
check("removal takes the environment out of the catalogue", [e.title for e in Environments(Record(root, "t")).all() if e.title == "disposable"], [])

# THE SESSION: --session binds; without it the holder of the environment is used
journal("environment", "prepare", "t")
n = next(e.n for e in Environments(Record(root, "t")).all() if e.title == "t")
code, out = journal("environment", "switch", str(n), session="s-1")
check("switch binds the named session", (code, Sessions(root).environment("s-1")), (0, "t"))
code, out = journal("environment", "switch", str(n), session="s-2")
check("a held environment refuses another session", out.startswith("! environment 't' is taken by session s-1"), True)
check("with no --env the session's environment is used", journal("status", env="", session="s-1")[1].startswith("JOURNAL  environment t"), True)

# THE TRANSCRIPT QUERIES read through the provider
transcript = project / "s.jsonl"
transcript.write_text("\n".join(json.dumps(r) for r in [{"type": "user", "message": {"content": "fix the header"}}, {"type": "assistant", "message": {"content": [{"type": "text", "text": "[!reply] done"}]}}]) + "\n")
agents = Agents(Record(root, "t"), actor=SYSTEM)
row = agents.by_session("s-1")
agents.update(row.n, provider="claude", transcript=str(transcript))
check("search cites line numbers", journal("search", "header", session="s-1")[1], "claude:s-1       1  user    fix the header")
check("user is the user's words", journal("user", session="s-1")[1], "     1  user    fix the header")
check("conversation --back with no summary is everything", journal("conversation", session="s-1")[1].count("\n"), 1)
check("client transcript formatting removes agent tags", "[!reply]" not in journal("conversation", session="s-1")[1], True)

codex_transcript = project / "s-2.jsonl"
codex_transcript.write_text(json.dumps({"type": "response_item", "payload": {"type": "message", "role": "user", "content": [{"type": "input_text", "text": "fix the header everywhere"}]}}) + "\n")
second = agents.by_session("s-2")
agents.update(second.n, provider="codex", transcript=str(codex_transcript))
duplicate = agents.by_session("s-3")
agents.update(duplicate.n, provider="codex", transcript=str(codex_transcript))
missing = agents.by_session("s-4")
agents.update(missing.n, provider="claude", transcript=str(project / "missing.jsonl"))
found = journal("search", "header", session="s-1")[1]
check("search covers every agent transcript and identifies its source", ("claude:s-1" in found, "codex:s-2" in found), (True, True))
check("search deduplicates transcript paths and ignores unreadable ones", (found.count("fix the header everywhere"), "s-3" in found, "s-4" in found), (1, False, False))

# A REFUSAL SAYS WHY AND EXITS NON-ZERO, OVER HTTP AS WELL AS IN THE SHELL
from commands.cli import captured  # noqa: E402

for argv, why in ((["todo", "nosuchword", "x"], "a word no type has"), (["todo", "update", "1", "--set", "priority=critical"], "a value the field refuses")):
    said, code = captured(argv, root)
    check(f"{why} exits non-zero over http", code not in (0, None), True)
    check(f"{why} says why over http", said.strip() != "", True)

check("a word no type has exits non-zero in the shell", journal("todo", "nosuchword", "x")[0] != 0, True)
check("a word no type has says why in the shell", journal("todo", "nosuchword", "x")[1].strip() != "", True)

done()
