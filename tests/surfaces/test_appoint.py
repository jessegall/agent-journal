import json
import time
from pathlib import Path

import pytest

import features
from commands.http import dispatch
from controllers.types import Agents
from engine.record import Record
from engine.sessions import Sessions
from surfaces.appoint import appoint, online
from resources.base import AGENT
from tests.conftest import refused


@pytest.fixture(autouse=True)
def loaded_features():
    features.unload()
    features.load()
    yield
    features.unload()


def test_appointing_an_online_agent_moves_it_and_the_viewer_reflects_it(tmp_path):
    root = tmp_path / ".journal"
    main = Record(root, "main")
    other = Record(root, "other")
    sessions = Sessions(root)
    sessions.write("codex-live", environment="main", seen=time.time())
    source = Agents(main, actor=AGENT).create("codex-live", provider="codex", model="gpt-6", status="idle", context=42)
    seat = {"at": time.time(), "agent": "codex", "state": "idle", "env": "main",
            "report": {"title": "codex-live", "provider": "codex", "model": "gpt-6", "status": "idle", "context": 42,
                       "skills": ["journal"], "shells": 2}}
    (root / "runtime" / "seat-codex.json").write_text(json.dumps(seat))

    assert [(a["session"], a["environment"], a["model"]) for a in online(root)] == [("codex-live", "main", "gpt-6")], \
        "only a fresh seat is offered as an online agent"
    got = appoint(root, "other", "codex-live")
    target = Agents(other).all()[0]
    assert (got["before"], got["environment"], sessions.environment("codex-live"), target.title, target.provider, target.model,
            target.status, target.skills, target.shells) == \
        ("main", "other", "other", "codex-live", "codex", "gpt-6", "idle", ["journal"], 2), \
        "appointment moves the session and carries its visible state"
    assert Agents(main).load(source.n).status == "stopped", "the environment it left no longer presents the agent as live"
    assert refused(lambda: appoint(root, "main", "gone")) == "session 'gone' is not online", "an offline session cannot be appointed"
    sessions.write("claude-holder", environment="main", seen=time.time())
    assert refused(lambda: appoint(root, "main", "codex-live")) == "environment 'main' is taken by session claude-holder", \
        "an agent cannot be appointed over an environment's live holder"
    sessions.unbind("claude-holder")

    offered = dispatch("GET", "/api/agents", root, {}, {})
    moved = dispatch("POST", "/api/main/appoint", root, {}, {"session": "codex-live"})
    assert (offered.code, offered.body[0]["session"], moved.code, moved.body["environment"]) == (200, "codex-live", 200, "main"), \
        "the viewer API lists and appoints online sessions"

    seat["at"] = time.time() - 6
    (root / "runtime" / "seat-codex.json").write_text(json.dumps(seat))
    assert online(root) == [], "stale seats disappear from the online list"
    assert refused(lambda: appoint(root, "missing", "codex-live")) == "no environment 'missing'", \
        "unknown environments are refused without creating them"
