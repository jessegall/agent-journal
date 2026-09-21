import json
import subprocess
import sys
import tempfile
from pathlib import Path

from commands.cli import captured
from controllers.types import Agents, Asks, Environments, Todos
from features.plans.controller import Plans  # noqa: E402
from engine.record import Record
from engine.sessions import Sessions
from resources.base import SYSTEM

HERE = Path(__file__).resolve().parents[1]


def journal(*argv, root, project, env="t", session=""):
    p = subprocess.run([sys.executable, str(HERE / "journal.py"), "--root", str(root), *(("--env", env) if env else ()), *(("--session", session) if session else ()), *argv],
                       cwd=project, capture_output=True, text=True, timeout=20)
    return p.returncode, (p.stdout + p.stderr).rstrip()


def test_cli():
    project = Path(tempfile.mkdtemp())
    root = project / ".journal"

    def journal_(*argv, env="t", session=""):
        return journal(*argv, root=root, project=project, env=env, session=session)

    code, out = journal_("todo", "create", "a row", "--brief", "why")
    assert (code, out.startswith("---")) == (0, True), "a to-do is created by the generic word, as the agent"
    assert Todos(Record(root, "t")).load(1).seen == ["agent"], "the agent created it"
    assert (journal_("search", "nothing")[0], journal_("conversation")[0], journal_("user")[0]) == (0, 0, 0), \
        "transcript queries need no live session"
    assert journal_("todo", "all")[1] == "   1  a row", "all lists it"
    assert journal_("todo", "complete", "1")[0] == 2, "done is refused with a wrong word"
    assert journal_("todo", "done", "1", "--how", "shipped")[0] == 0, "done with a how"
    assert journal_("todo", "all")[1] == "", "a completed row is gone from the list"
    assert journal_("todo", "all", "--completed")[1] == "   1  a row  [done]", "asked for, it comes back marked"
    assert journal_("todo", "start", "1") == (1, "! todo 1 is already done"), "starting a completed row is refused"
    assert journal_("work", "all")[1] == "", "the refused start creates no work"

    picture = project / "dashboard.png"
    picture.write_bytes(b"png")
    journal_("todo", "attach", "1", str(picture), "--what", "deployment graph")
    assert journal_("search", "deployment")[1] == "  file  todo:1  dashboard.png — deployment graph", \
        "search without a session still finds file tags"
    assert ("to-do            0" in journal_("status")[1]) is True, "status counts"

    journal_("plan", "create", "The plan", "--set", "goal=all of it")
    journal_("plan", "phase", "1", "First", "--when", "it is first")
    code, out = journal_("plan", "todos", "1", "1", "1")
    assert (code, "todo:1" in out) == (0, True), "a list parameter is positional"

    journal_("plan", "rephrase", "1", "1", "--checkpoint", "true")
    journal_("plan", "rephrase", "1", "1", "--title", "Still first")
    assert Plans(Record(root, "t")).load(1).phases[0]["checkpoint"] is True, \
        "a bool-or-none parameter takes a word and keeps it a boolean, untouched when unset"
    journal_("plan", "rephrase", "1", "1", "--checkpoint", "false")
    assert Plans(Record(root, "t")).load(1).phases[0]["checkpoint"] is False, "the word false is False, not a truthy string"
    assert journal_("plan", "continue", "1")[1] == "! only the user can continue a plan: they do it in the viewer", \
        "continue is the plan's word and only the user's"

    journal_("plan", "ready", "1")
    assert journal_("--as", "user", "plan", "activate", "1")[0] == 0, "the user may, with --as"
    assert journal_("carry")[1].startswith("THE JOURNAL IS IN FORCE HERE") is True, "carry begins with the start block"
    assert journal_("open")[1] == "", "open lists open work"
    assert journal_("nothing", "fine as it is", session="s-1")[1] == "noted: fine as it is", \
        "nothing notes the decision on the session's agent row"
    assert (journal_("version", env="")[1] != "0") is True, "version is the package's VERSION file"

    (root / "runtime").mkdir(parents=True, exist_ok=True)
    (root / "runtime" / "browser-t.json").write_text(json.dumps({"on": True}))
    code, out = journal_("browser", "ask", "goto", "https://example.com", "--wait", "0")
    ask = Asks(Record(root, "t")).all()[-1]
    assert (code, ask.title, ask.op, ask.args) == (0, "browser goto", "goto", ["https://example.com"]), \
        "a required argument before variadic browser arguments is bound once"

    code, out = journal_("environment", "prepare", "disposable")
    disposable = Environments(Record(root, "t")).find("disposable")
    assert journal_("environment", "remove", str(disposable.n), "--how", "finished")[0] == 0, \
        "an unheld environment can be removed without a bound session"
    assert [e.title for e in Environments(Record(root, "t")).all() if e.title == "disposable"] == [], \
        "removal takes the environment out of the catalogue"

    journal_("environment", "prepare", "t")
    n = next(e.n for e in Environments(Record(root, "t")).all() if e.title == "t")
    code, out = journal_("environment", "switch", str(n), session="s-1")
    assert (code, Sessions(root).environment("s-1")) == (0, "t"), "switch binds the named session"
    code, out = journal_("environment", "switch", str(n), session="s-2")
    assert out.startswith("! environment 't' is taken by session s-1") is True, "a held environment refuses another session"
    assert journal_("status", env="", session="s-1")[1].startswith("JOURNAL  environment t") is True, \
        "with no --env the session's environment is used"

    transcript = project / "s.jsonl"
    transcript.write_text("\n".join(json.dumps(r) for r in [{"type": "user", "message": {"content": "fix the header"}}, {"type": "assistant", "message": {"content": [{"type": "text", "text": "[!reply] done"}]}}]) + "\n")
    agents = Agents(Record(root, "t"), actor=SYSTEM)
    row = agents.by_session("s-1")
    agents.update(row.n, provider="claude", transcript=str(transcript))
    assert journal_("search", "header", session="s-1")[1] == "claude:s-1       1  user    fix the header", \
        "search cites line numbers"
    assert journal_("user", session="s-1")[1] == "     1  user    fix the header", "user is the user's words"
    assert journal_("conversation", session="s-1")[1].count("\n") == 1, "conversation --back with no summary is everything"
    assert ("[!reply]" not in journal_("conversation", session="s-1")[1]) is True, \
        "client transcript formatting removes agent tags"

    codex_transcript = project / "s-2.jsonl"
    codex_transcript.write_text(json.dumps({"type": "response_item", "payload": {"type": "message", "role": "user", "content": [{"type": "input_text", "text": "fix the header everywhere"}]}}) + "\n")
    second = agents.by_session("s-2")
    agents.update(second.n, provider="codex", transcript=str(codex_transcript))
    duplicate = agents.by_session("s-3")
    agents.update(duplicate.n, provider="codex", transcript=str(codex_transcript))
    missing = agents.by_session("s-4")
    agents.update(missing.n, provider="claude", transcript=str(project / "missing.jsonl"))
    found = journal_("search", "header", session="s-1")[1]
    assert ("claude:s-1" in found, "codex:s-2" in found) == (True, True), \
        "search covers every agent transcript and identifies its source"
    assert (found.count("fix the header everywhere"), "s-3" in found, "s-4" in found) == (1, False, False), \
        "search deduplicates transcript paths and ignores unreadable ones"

    for argv, why in ((["todo", "nosuchword", "x"], "a word no type has"), (["todo", "update", "1", "--set", "priority=critical"], "a value the field refuses")):
        said, code = captured(argv, root)
        assert (code not in (0, None)) is True, f"{why} exits non-zero over http"
        assert (said.strip() != "") is True, f"{why} says why over http"

    assert (journal_("todo", "nosuchword", "x")[0] != 0) is True, "a word no type has exits non-zero in the shell"
    assert (journal_("todo", "nosuchword", "x")[1].strip() != "") is True, "a word no type has says why in the shell"
