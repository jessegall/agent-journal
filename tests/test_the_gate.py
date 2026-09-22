import json


import features
from controllers.types import Works
from engine.hooks import gate_file, handle
from features.base import held
from providers import PROVIDERS
from resources.base import AGENT
from tests.conftest import fresh

REFUSED = 'nothing is open, so this write would not be filed: journal work start "<the work>" first'


def test_a_write_is_refused_until_work_is_open_for_every_provider():
    record = fresh()
    root, env = record.root, record.env

    for name, provider_cls in PROVIDERS.items():
        provider = provider_cls()
        session = f"{name}-7"

        def hook(event, tool="", cwd="", **tool_input):
            return handle(provider, root, env, {"hook_event_name": event, "session_id": session, "tool_name": tool, "tool_input": tool_input, "cwd": cwd})

        hook("SessionStart")
        assert held(record, session) == REFUSED, f"{name}: a fresh session with nothing open: the flag says refused"
        assert hook("PreToolUse", "Read", file_path="x.py") == {}, f"{name}: a read passes"
        assert hook("PreToolUse", "Bash", command="cat x.py | grep y") == {}, f"{name}: a Bash read passes"
        assert hook("PreToolUse", "Edit", file_path="x.py") == {"decision": "block", "reason": REFUSED}, \
            f"{name}: an edit is refused, in the harness's shape"
        assert hook("PreToolUse", "Bash", command="git commit -m x") == {"decision": "block", "reason": REFUSED}, \
            f"{name}: a writing command is refused"
        assert hook("PreToolUse", "Bash", command="echo x > out.txt") == {"decision": "block", "reason": REFUSED}, \
            f"{name}: a redirect is a write"
        assert hook("PreToolUse", "Bash", command="make > /dev/null") == {}, f"{name}: a redirect to /dev/null is not"
        assert hook("PreToolUse", "Bash", command="python3 tests/x.py 2>&1 | tail -1") == {}, f"{name}: joining stderr is not a write"
        project = str(root.parent)
        assert hook("PreToolUse", "Write", cwd=project, file_path="web/x.js") == {"decision": "block", "reason": REFUSED}, \
            f"{name}: a project file is gated"
        assert hook("PreToolUse", "Write", cwd=project, file_path=".journal/environments/main/notes.md") == {}, \
            f"{name}: a file inside the journal is not project work"
        assert hook("PreToolUse", "Edit", cwd=project, file_path="/tmp/elsewhere/memory.md") == {}, \
            f"{name}: a file outside the project is not project work"
        assert hook("PreToolUse", "Bash", command="journal work start \"x\" >/dev/null; .journal/journal todo add x") == {}, \
            f"{name}: a journal command is never gated, it is how work opens"
        work = Works(record, actor=AGENT).create(f"the header for {name}")
        assert held(record, session) == "", f"{name}: work open: the flag flips to allowed"
        assert hook("PreToolUse", "Edit", file_path="x.py") == {}, f"{name}: the same edit passes"
        Works(record, actor=AGENT).complete(work.n, "done")
        assert hook("PreToolUse", "Write", file_path="y.py") == {"decision": "block", "reason": REFUSED}, \
            f"{name}: work ended, nothing open: refused again"
        assert json.loads(gate_file(root, env, session).read_text())["work_tracking"] == REFUSED, \
            f"{name}: the flag is a file per environment and session, with the why"


def test_a_hook_that_crashes_is_told_to_the_agent_for_every_provider(monkeypatch):
    from commands.dispatch import dispatch
    import commands.http  # noqa: F401
    from controllers.types import Nudges
    from resources.base import SYSTEM
    from tests.kit import report
    features.load()
    record = fresh()
    report(record, "working", "PreToolUse")

    for name, provider_cls in PROVIDERS.items():
        def crash(self, row, hook, root):
            raise TypeError(f"{name} crashed")
        monkeypatch.setattr(provider_cls, "facts", crash)
        body = {"hook_event_name": "PreToolUse", "session_id": "claude-1", "tool_name": "Read", "tool_input": {"file_path": "x.py"}}
        dispatch("POST", f"/api/hook/{name}", record.root, {"root": str(record.root), "env": record.env}, body)
        lines = [f"{n.title} {n.brief}" for n in Nudges(record, actor=SYSTEM)._every()]
        assert any("hit an error" in line and f"TypeError: {name} crashed" in line for line in lines), \
            f"{name}: a crash inside the hook reaches the agent, with the error"
    monkeypatch.undo()
    from engine import runtime
    (runtime.folder(record.root) / "hook-failures.log").write_text("1790000000 000 claude\n1790000001 500 claude\n")
    dispatch("POST", "/api/hook/claude", record.root, {"root": str(record.root), "env": record.env}, body)
    lines = [f"{n.title} {n.brief}" for n in Nudges(record, actor=SYSTEM)._every()]
    assert any("no answer from the server 2 times (codes 000, 500)" in line for line in lines), \
        "hooks the server never answered are told once it answers again"
    assert not (runtime.folder(record.root) / "hook-failures.log").exists(), "and are told only once"
    monkeypatch.setattr(runtime, "STARTED", [1790000100.0])
    (runtime.folder(record.root) / "hook-failures.log").write_text("1790000095 000 claude\n")
    dispatch("POST", "/api/hook/claude", record.root, {"root": str(record.root), "env": record.env}, body)
    assert len([n for n in Nudges(record, actor=SYSTEM)._every() if "no answer from the server" in n.brief]) == 1, \
        "a hook missed while the server was restarting is not an error"
