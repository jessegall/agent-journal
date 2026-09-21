from pathlib import Path

import pytest

import features
from controllers.types import Agents, Todos
from features.plugins.payload import of, refusal
from providers.payload import Hook
from resources.base import AGENT, SYSTEM
from tests.conftest import fresh


@pytest.fixture(autouse=True)
def loaded_features():
    features.unload()
    features.load()
    yield
    features.unload()


def test_a_record_event_carries_the_row_the_environment_and_the_agent():
    record = fresh()
    where = Path("/p/.journal/plugins/works")
    todos = Todos(record, actor=AGENT)
    made = todos.create("fix the header", brief="it wraps on mobile")
    agents = Agents(record, actor=SYSTEM)
    agents.update(agents.by_session("claude-3").n, status="working", model="claude-opus-5", cwd="/p")

    event = [e for e in record.events() if e.type == "todo"][-1]
    said = of(record, event, "works", where)
    assert (said["v"], said["event"], said["n"], said["actor"]) == (1, "todo.created", made.n, AGENT), \
        "the event is named type.action and keeps its number and actor"
    assert (said["resource"]["title"], said["resource"]["ref"], said["resource"]["brief"]) == \
        ("fix the header", made.ref, "it wraps on mobile"), "the row it is about rides along, with its ref"
    assert (said["env"], said["project"], said["plugin"]) == (record.env, str(record.root.parent), {"name": "works", "dir": str(where)}), \
        "the environment, the project and the plugin's own folder are named"
    assert said["agent"]["session"] == "claude-3", "with no session on the event, the environment's own agent is named"

    todos.delete(made.n, "not needed")
    gone = of(record, [e for e in record.events() if e.type == "todo"][-1], "works", where)
    assert (gone["event"], gone["resource"]["deleted"] > 0) == ("todo.deleted", True), \
        "a deleted row leaves the event without a resource, never without an answer"

    agents.saw(agents.by_session("claude-3").n, {"hook": "PostToolUse", "tool": "Edit", "file": "/p/a.py", "session": "claude-3"}, status="working")
    hooked = of(record, [e for e in record.events() if e.type == "agent"][-1], "works", where)
    assert (hooked["event"], hooked["data"]["tool"], hooked["data"]["file"], hooked["agent"]["session"]) == \
        ("hook.PostToolUse", "Edit", "/p/a.py", "claude-3"), "a hook rides as hook.<event> with what it saw"

    hook = Hook.read({"hook_event_name": "PreToolUse", "session_id": "claude-3", "tool_name": "Edit", "cwd": "/p", "tool_input": {"file_path": "/p/a.py"}})
    asked = refusal(record, hook, "works", where, True)
    assert (asked["event"], asked["tool"], asked["agent"]["session"]) == \
        ("hook.PreToolUse", {"name": "Edit", "file": "/p/a.py", "command": "", "writes": True}, "claude-3"), \
        "the tool, the file and whether it writes are named"
