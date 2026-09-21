import pytest

import features
from controllers.types import Agents
from engine import viewer
from resources.base import SYSTEM
from tests.kit import report
from tests.conftest import fresh


@pytest.fixture(autouse=True)
def loaded_features():
    features.unload()
    features.load()
    yield
    features.unload()


def test_a_session_starting_shows_the_viewer_once_a_subagent_never_does():
    shown = []
    up = {"url": "http://127.0.0.1:8422/"}
    viewer.running = lambda root: up["url"]
    viewer.show = lambda url: shown.append(url)

    record = fresh()
    Agents(record, actor=SYSTEM).create("claude-1")
    report(record, "working", "UserPromptSubmit")
    assert shown == [], "no session start yet: the tab is left alone"

    report(record, "idle", "SessionStart")
    assert shown == ["http://127.0.0.1:8422/"], "the session started: its viewer is shown"
    report(record, "idle", "SessionStart")
    report(record, "working", "PreToolUse")
    assert len(shown) == 1, "a second start of the same session, a compaction or a clear, shows nothing more"

    report(record, "idle", "SessionStart", session="claude-2")
    assert len(shown) == 2, "a new session shows the viewer again"

    up["url"] = ""
    report(record, "idle", "SessionStart", session="claude-3")
    up["url"] = "http://127.0.0.1:8424/"
    report(record, "idle", "SessionStart", session="claude-3")
    assert shown[2:] == ["http://127.0.0.1:8424/"], "no viewer: nothing; once one runs, the next start shows it"

    Agents(record, actor=SYSTEM).create("child-1", parent="claude-1")
    report(record, "idle", "SessionStart", session="child-1")
    assert len(shown) == 3, "a subagent starting shows nothing"
