# Runs the echo plugin's program for each step, so it is not in the default run: python3 -m pytest -q tests/plugins_replays_run.py, before any commit that touches how plugins hear or answer. REPLAY_FREEZE=1 records it anew.
"""A replay with a plugin installed: what the agent sees through a session with the echo plugin on, a held tool, a told prompt and a row heard after the reply, must match the record frozen when it was last right."""

from pathlib import Path

import pytest

from journal.app import App
from journal.config import Config
from journal.features.workers.worker_runner import WorkerRunner
from journal.support.deferred import Deferred
from journal.support.actor import Actor
from journal.models.setting import Setting
from journal.models.task import Task
from journal.support.scope import Scope
from journal.repositories.settings import Settings
from journal.repositories.tasks import Tasks
from tests.replay import Replay, differences, hook_as, recorded
from tests.test_features import AGENT, MAIN, USER

ECHO = Path(__file__).parent / "plugins" / "echo"


@pytest.fixture
def journals(tmp_path: Path, monkeypatch):
    """Two fresh journals with the echo plugin installed, one for the record and one run anew."""
    monkeypatch.setattr(Config, "status_home", property(lambda self: self.root / "status"))
    monkeypatch.setattr(WorkerRunner, "start", lambda self, worker, by: None)
    apps = []
    for name in ("recorded", "anew"):
        app = App(Config(tmp_path / name, port=0))
        app.container.get(Settings).save(Setting(environment_id=0, key="features.skills", value=False), Actor.system())
        apps.append(app)
    with apps[0].container.get(Scope).of(MAIN):
        yield apps
    for app in apps:
        app.runtime().stop()


def with_echo(app, replay: Replay, provider: str) -> None:
    """The steps: echo is installed, a session starts, a forbidden read is held, a prompt is told a line, and a task made is heard after the reply."""
    app.console().run(["plugin", "install", str(ECHO), "--yes"], USER)
    hook_as(app, provider, "SessionStart")
    app.console().run(["environment", "here"], AGENT)
    replay.step("session starts")
    replay.step("a forbidden read", hook_as(app, provider, "PreToolUse", tool_name="Read", tool_input={"file_path": "forbidden.py"})[1])
    replay.step("a prompt", hook_as(app, provider, "UserPromptSubmit", prompt="hello")[1])
    app.container.get(Tasks).save(Task(environment_id=1, title="echo me"), Actor.user(1))
    app.container.get(Deferred).drain()
    app.container.get(Deferred).drain()
    replay.step("a task is made")


def test_a_session_with_the_echo_plugin_matches_its_record(journals, monkeypatch):
    recorded_app, anew = journals
    left = recorded("echo_plugin_claude", recorded_app, monkeypatch, with_echo, "claude")
    anew.runtime().start()
    right = Replay(anew, monkeypatch)
    with_echo(anew, right, "claude")
    answers = [str(s["answer"]) for s in right.record() if s["answer"] is not None]
    assert "[plugin echo] echo refuses a forbidden tool" in answers[0] and "[plugin echo] echo heard your prompt" in answers[1], "the plugin held the tool and told the prompt"
    assert differences(left.record(), right.record()) == [], "the agent would have seen the same as the record says"
