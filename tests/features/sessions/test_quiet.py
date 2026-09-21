import time

import pytest

import features
from controllers.types import Agents
from resources.base import SYSTEM
from tests.features.kit import report
from tests.conftest import fresh


@pytest.fixture(autouse=True)
def loaded_features():
    features.unload()
    features.load()
    yield
    features.unload()


def test_a_session_gone_quiet_past_the_limit_is_marked_stopped():
    record = fresh()
    sessions = features.FEATURES["sessions"]
    agents = Agents(record, actor=SYSTEM)

    report(record, "working", "PreToolUse", session="claude-1")
    report(record, "working", "PreToolUse", session="claude-2")
    assert [r.n for r in sessions.quieted(record)] == [], "a session that just wrote is left alone"

    quiet = agents.by_session("claude-2")
    agents.stamp(quiet.n, at=time.time() - 2 * 60 * 60)
    assert ([r.title for r in sessions.quieted(record)], agents.by_session("claude-2").status) == (["claude-2"], "stopped"), \
        "one silent past the hour is marked stopped"
    assert agents.by_session("claude-1").status == "working", "the one still writing keeps its status"
    assert [r.title for r in sessions.quieted(record)] == [], "and it is not marked twice"

    record.set_setting("sessions", {"quiet": 1})
    agents.stamp(agents.by_session("claude-1").n, at=time.time() - 5 * 60)
    assert [r.title for r in sessions.quieted(record)] == ["claude-1"], "the setting says how long the silence may be"
