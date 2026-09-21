import json

import pytest

import features
from controllers.types import Works
from engine.hooks import handle
from features.base import held
from providers import PROVIDERS
from resources.base import AGENT
from tests.conftest import fresh

REFUSED = 'nothing is open, so this write would not be filed: journal work start "<the work>" first'


@pytest.fixture(autouse=True)
def loaded_features():
    features.unload()
    features.load()
    yield
    features.unload()


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
        assert json.loads((root / "runtime" / f"gate-{env}-{session}.json").read_text())["work"] == REFUSED, \
            f"{name}: the flag is a file per environment and session, with the why"
