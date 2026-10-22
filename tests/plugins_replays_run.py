# Runs the echo plugin's program for each step, so it is not in the default run: python3 -m pytest -q tests/plugins_replays_run.py, before any commit that touches how plugins hear or answer. REPLAY_FREEZE=1 records it anew.
"""A replay with a plugin installed: what the agent sees through a session with the echo plugin on, a held tool, a told prompt and a row heard after the reply, must match the record frozen when it was last right."""

from pathlib import Path

import pytest

from journal.app import App
from journal.config import Config
from journal.features.plugins.feature import PluginsFeature
from journal.features.workers.support.worker_runner import WorkerRunner
from journal.support.listener_queue import ListenerQueue
from journal.support.actor import Actor
from journal.models.setting import Setting
from journal.models.task import Task
from journal.repositories.scope import Scope
from journal.repositories.setting_rows import SettingRows
from journal.repositories.tasks import Tasks
from tests.replay import Replay, hook_as, played
from tests.test_features import AGENT, MAIN, USER

ECHO = Path(__file__).parent / "plugins" / "echo"


@pytest.fixture
def journal(tmp_path: Path, monkeypatch):
    """A fresh journal the echo plugin is installed in, its steps compared to the record; the plugin is given two seconds to answer, since a program started fresh on a busy machine misses the shipped window."""
    monkeypatch.setattr(Config, "status_home", property(lambda self: self.root / "status"))
    monkeypatch.setattr(WorkerRunner, "start", lambda self, worker, actor: None)
    app = App(Config(tmp_path / "anew", port=0))
    app.container.get(SettingRows).save(Setting(environment_id=0, key="features.skills", value=False), Actor.system())
    app.container.get(SettingRows).set(PluginsFeature.PLUGIN_ANSWER_WINDOW.key, 2000, Actor.user(1))
    with app.container.get(Scope).environment(MAIN):
        yield app
    app.runtime().stop()


def with_echo(app, replay: Replay, provider: str) -> None:
    """The steps: echo is installed, a session starts, a forbidden read is held, a prompt is told a line, and a task made is heard after the reply."""
    app.console().run(["plugin", "install", str(ECHO), "--yes"], USER)
    hook_as(app, provider, "SessionStart")
    app.console().run(["environment", "overview"], AGENT)
    replay.step("session starts")
    replay.step("a forbidden read", hook_as(app, provider, "PreToolUse", tool_name="Read", tool_input={"file_path": "forbidden.py"})[1])
    replay.step("a prompt", hook_as(app, provider, "UserPromptSubmit", prompt="hello")[1])
    app.container.get(Tasks).save(Task(environment_id=1, title="echo me"), Actor.user(1))
    app.container.get(ListenerQueue).drain()
    app.container.get(ListenerQueue).drain()
    replay.step("a task is made")


def test_a_session_with_the_echo_plugin_matches_its_record(journal, monkeypatch):
    right, differing = played("echo_plugin_claude", journal, monkeypatch, with_echo, "claude")
    answers = [str(s["answer"]) for s in right.record() if s["answer"] is not None]
    assert "[plugin echo] echo refuses a forbidden tool" in answers[0] and "[plugin echo] echo heard your prompt" in answers[1], "the plugin held the tool and told the prompt"
    assert differing == [], "the agent would have seen the same as the record says"
