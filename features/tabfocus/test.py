
from types import SimpleNamespace
from features.tabfocus.focus import SCRIPT, existing_tab
from controllers.types import Agents
from engine import viewer
from resources.base import SYSTEM
from tests.kit import report
from tests.conftest import fresh


URL = "http://127.0.0.1:8422/"


def test_macos_asks_its_running_browsers_for_the_viewer_tab():
    calls = []

    def run(command, **options):
        calls.append((command, options))
        return SimpleNamespace(returncode=0)

    assert existing_tab(URL, "darwin", run) is True, "macOS asks its running browsers for the viewer tab"
    assert (calls[0][0][:5], calls[0][0][-2:], calls[0][1]) == \
        (["osascript", "-l", "JavaScript", "-e", SCRIPT], ["--", URL], {"capture_output": True, "timeout": 2}), \
        "the focus script receives the viewer URL"


def test_other_systems_and_a_missing_tab_leave_opening_to_the_normal_path():
    calls = []

    def run(command, **options):
        calls.append((command, options))
        return SimpleNamespace(returncode=0)

    assert (existing_tab(URL, "linux", run), calls) == (False, []), "other systems leave opening to the normal browser path"
    assert existing_tab(URL, "darwin", lambda *args, **options: SimpleNamespace(returncode=1)) is False, \
        "a missing macOS tab leaves opening to the normal browser path"


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


def test_a_server_of_another_version_is_not_taken_for_this_journals(tmp_path, monkeypatch):
    from engine import viewer
    from engine.version import version
    said = {"root": str(tmp_path), "version": ""}
    monkeypatch.setattr(viewer, "identity", lambda url, timeout=0.05: said)
    assert viewer.answers("http://127.0.0.1:8423/", tmp_path) is False, "a server left from an older install is replaced, not reused"
    said["version"] = version()
    assert viewer.answers("http://127.0.0.1:8423/", tmp_path) is True
