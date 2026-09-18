import json
import subprocess
import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))
from v2.controllers.types import CONTROLLERS  # noqa: E402
from v2.engine.record import Record  # noqa: E402
from v2.engine.sessions import Sessions  # noqa: E402
from v2.resources.base import SYSTEM  # noqa: E402
from v2.tests.kit import check, done  # noqa: E402

HERE = Path(__file__).resolve().parents[2]
project = Path(tempfile.mkdtemp())
root = project / ".journal"


def journal(*argv, env="t", session=""):
    p = subprocess.run([sys.executable, str(HERE / "v2" / "journal.py"), "--root", str(root), *(("--env", env) if env else ()), *(("--session", session) if session else ()), *argv],
                       cwd=project, capture_output=True, text=True, timeout=20)
    return p.returncode, (p.stdout + p.stderr).rstrip()


# EVERY TYPE'S WORDS, AND THE QUERIES
code, out = journal("todo", "add", "a row", "--brief", "why")
check("a to-do is added by the type's own word, as the agent", (code, out.startswith("---")), (0, True))
check("the agent created it", CONTROLLERS["todo"](Record(root, "t")).load(1).seen, ["agent"])
check("all lists it", journal("todo", "all")[1], "   1  a row")
check("done is refused with a wrong word", journal("todo", "complete", "1")[0], 2)
check("done with a how", journal("todo", "done", "1", "--how", "shipped")[0], 0)
check("status counts", "to-do            0" in journal("status")[1], True)
journal("plan", "create", "The plan", "--set", "goal=all of it")
journal("plan", "phase", "1", "First", "--when", "it is first")
code, out = journal("plan", "todos", "1", "1", "1")
check("a list parameter is positional", (code, "todo:1" in out), (0, True))
check("continue is the plan's word and only the user's", journal("plan", "continue", "1")[1], "! only the user can continue a plan: they do it in the viewer")
check("the user may, with --as", journal("--as", "user", "plan", "activate", "1")[0], 0)
check("carry begins with the start block", journal("carry")[1].startswith("THE JOURNAL IS IN FORCE HERE"), True)
check("open lists open work", journal("open")[1], "")
check("nothing notes the decision on the session's agent row", journal("nothing", "fine as it is", session="s-1")[1], "noted: fine as it is")
check("version", journal("version", env="")[1], "2.0.0")

# THE SESSION: --session binds; without it the holder of the environment is used
journal("environment", "prepare", "t", env="t")
code, out = journal("environment", "switch", "1", session="s-1")
check("switch binds the named session", (code, Sessions(root).environment("s-1")), (0, "t"))
code, out = journal("environment", "switch", "1", session="s-2")
check("a held environment refuses another session", out.startswith("! environment 't' is taken by session s-1"), True)
check("with no --env the session's environment is used", journal("status", env="", session="s-1")[1].startswith("JOURNAL  environment t"), True)

# THE TRANSCRIPT QUERIES read through the provider
transcript = project / "s.jsonl"
transcript.write_text("\n".join(json.dumps(r) for r in [{"type": "user", "message": {"content": "fix the header"}}, {"type": "assistant", "message": {"content": [{"type": "text", "text": "[!reply] done"}]}}]) + "\n")
agents = CONTROLLERS["agent"](Record(root, "t"), actor=SYSTEM)
row = agents.by_session("s-1")
agents.update(row.n, provider="claude", transcript=str(transcript))
check("search cites line numbers", journal("search", "header", session="s-1")[1], "     1  user    fix the header")
check("user is the user's words", journal("user", session="s-1")[1], "     1  user    fix the header")
check("conversation --back with no summary is everything", journal("conversation", session="s-1")[1].count("\n"), 1)

done()
