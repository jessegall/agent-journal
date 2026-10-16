"""Plan 2's replays: a listener and the workflow that replaces it, run through the same steps on two fresh journals, must leave the agent
with the same answers and the same typed lines. Each replay freezes the listener's record, so it still stands once the listener is gone."""

from pathlib import Path

import pytest

from journal.app import App
from journal.config import Config
from journal.models.actor import Actor
from journal.models.setting import Setting
from journal.repositories.charts import Charts
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


def empty_shipped(app, event: str) -> None:
    """The shipped workflow on an event with its nodes taken out, so the journal under replay runs the listener alone."""
    charts = app.container.get(Charts)
    for chart in charts.shipped_on(event):
        for node in charts.nodes_of(chart):
            charts.remove_node(node, Actor.system())


def prompts_with_unread(app, replay: Replay) -> None:
    """The steps: a session starts, messages arrive while the agent sits at its prompt, and it sends a prompt after one, after three and after four, twice."""
    hook(app, "SessionStart")
    app.console().run(["environment", "here"], AGENT)
    replay.step("session starts")
    for n, words in ((1, "one"), (2, "two"), (3, "three"), (4, "four")):
        app.console().run(["message", "send", words], USER)
        replay.step(f"message {n} arrives")
        if n in (1, 3, 4):
            replay.step(f"a prompt after {n}", hook(app, "UserPromptSubmit", prompt="working")[1])
    replay.step("a prompt again after 4", hook(app, "UserPromptSubmit", prompt="still working")[1])


def test_prompt_sent_as_the_shipped_workflow_equals_the_listener(journals, monkeypatch):
    with_listener, with_workflow = journals
    with_listener.runtime().start()
    left = Replay(with_listener, monkeypatch, listeners_off=("InboxOnArrival",))
    empty_shipped(with_listener, "prompt_submitted")
    prompts_with_unread(with_listener, left)
    with_workflow.runtime().start()
    right = Replay(with_workflow, monkeypatch, listeners_off=("InboxOnArrival", "InboxAtPrompt"))
    prompts_with_unread(with_workflow, right)
    answers = [s["answer"] for s in left.record() if s["answer"] is not None]
    assert "new message 1" in str(answers[0]) and "new messages 1, 2, 3" in str(answers[1]) and "4 messages unread" in str(answers[2]) and "unread" not in str(answers[3]), "the listener names one, a few, many, and not again inside the window"
    assert differences(left.record(), right.record(), nudges=True) == [], "the agent would have seen the same, and the record says the same"
    left.freeze("prompt_sent")


def message_arrives(app, replay: Replay) -> None:
    """The steps: a session starts, the user leaves a message while the agent sits at its prompt."""
    hook(app, "SessionStart")
    app.console().run(["environment", "here"], AGENT)
    replay.step("session starts")
    app.console().run(["message", "send", "are you there?"], USER)
    replay.step("a message arrives")


def test_message_arrives_as_the_shipped_workflow_equals_the_listener(journals, monkeypatch):
    with_listener, with_workflow = journals
    with_listener.runtime().start()
    left = Replay(with_listener, monkeypatch)
    empty_shipped(with_listener, "messages.created")
    message_arrives(with_listener, left)
    with_workflow.runtime().start()
    right = Replay(with_workflow, monkeypatch, listeners_off=("InboxOnArrival",))
    message_arrives(with_workflow, right)
    assert left.record()[-1]["typed"] == ["[journal] new message 1"], "the listener names the message"
    assert differences(left.record(), right.record(), nudges=True) == [], "the agent would have seen the same, and the record says the same"
    left.freeze("message_arrives")
    assert differences(left.record(), Replay.frozen("message_arrives")) == [], "the frozen record reads back equal"
