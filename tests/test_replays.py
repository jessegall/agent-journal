"""Plan 2's replays: a listener and the workflow that replaces it, run through the same steps on two fresh journals, must leave the agent
with the same answers and the same typed lines. Each replay freezes the listener's record, so it still stands once the listener is gone."""

from pathlib import Path

import pytest

from journal.app import App
from journal.config import Config
from journal.models.actor import Actor
from journal.models.setting import Setting
from journal.repositories.settings import Settings
from tests.replay import Replay, differences
from tests.test_features import AGENT, USER, hook


@pytest.fixture
def journals(tmp_path: Path, monkeypatch):
    """Two fresh journals, one for the listener and one for the workflow; both start and stop together."""
    monkeypatch.setattr(Config, "status_home", property(lambda self: tmp_path / "status"))
    apps = []
    for name in ("listener", "workflow"):
        app = App(Config(tmp_path / name, port=0))
        app.container.get(Settings).save(Setting(environment_id=0, key="features.skills", value=False), Actor.system())
        apps.append(app)
    yield apps
    for app in apps:
        app.runtime().stop()


def message_arrives(app, replay: Replay) -> None:
    """The steps: a session starts, the user leaves a message while the agent sits at its prompt."""
    hook(app, "SessionStart")
    app.console().run(["environment", "here"], AGENT)
    replay.step("session starts")
    app.console().run(["message", "send", "are you there?"], USER)
    replay.step("a message arrives")


def test_message_arrives_as_a_workflow_equals_the_listener(journals, monkeypatch):
    with_listener, with_workflow = journals
    left = Replay(with_listener, monkeypatch)
    with_listener.runtime().start()
    message_arrives(with_listener, left)
    right = Replay(with_workflow, monkeypatch, listeners_off=("InboxOnArrival",))
    with_workflow.runtime().start()
    console = with_workflow.console()
    made = console.run(["chart", "new", "Message arrives"], USER).out
    n = int(made.split()[1].rstrip(":"))
    node = lambda *args: int(console.run(["chart", "node", *args, "--in", str(n)], USER).out.split()[1].rstrip(":"))
    trigger = node("trigger", "messages.created")
    check = node("check", "message_by_user")
    action = node("action", "type", "--text", "[messages.new] new message {{row}}")
    console.run(["chart", "line", str(trigger), str(check)], USER)
    console.run(["chart", "line", str(check), str(action), "--port", "yes"], USER)
    message_arrives(with_workflow, right)
    assert left.record()[-1]["typed"] == ["[journal] new message 1"], "the listener names the message"
    assert differences(left.record(), right.record(), nudges=True) == [], "the agent would have seen the same, and the record says the same"
    left.freeze("message_arrives")
    assert differences(left.record(), Replay.frozen("message_arrives")) == [], "the frozen record reads back equal"
