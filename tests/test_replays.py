"""Plan 2's replays: a listener and the workflow that replaces it, run through the same steps on two fresh journals, must leave the agent
with the same answers and the same typed lines. Each replay freezes the listener's record, so it still stands once the listener is gone."""

from pathlib import Path

import pytest

from journal.app import App
from journal.config import Config
from journal.console.where import Where
from journal.engine.machine import Machine
from journal.features.workers.worker_runner import WorkerRunner
from journal.models.actor import Actor
from journal.models.setting import Setting
from journal.repositories.charts import Charts
from journal.repositories.environments import Environments
from journal.repositories.settings import Settings
from tests.replay import Replay, differences
from tests.test_features import AGENT, USER, hook


@pytest.fixture
def journals(tmp_path: Path, monkeypatch):
    """Two fresh journals, one for the listener and one for the workflow; both start and stop together."""
    monkeypatch.setattr(Config, "status_home", property(lambda self: tmp_path / "status"))
    monkeypatch.setattr(WorkerRunner, "start", lambda self, worker, by: None)
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


def tool_uses_with_the_inbox(app, replay: Replay) -> None:
    """The steps: with a task in hand a message arrives; sixteen reads and a write go by unread; the message is read and a read, a journal command, a look at its files and a read after the reply follow."""
    hook(app, "SessionStart")
    console = app.console()
    console.run(["environment", "here"], AGENT)
    console.run(["task", "create", "the footer", "--start"], AGENT)
    replay.step("a task in hand")
    console.run(["message", "send", "one"], USER)
    replay.step("message 1 arrives")
    for i in range(1, 17):
        replay.step(f"read {i}", hook(app, "PreToolUse", tool_name="Read", tool_input={"file_path": "a.py", "limit": 1})[1])
    replay.step("a write at 17", hook(app, "PreToolUse", tool_name="Write", tool_input={"file_path": "a.py"})[1])
    console.run(["message", "read", "1"], AGENT)
    replay.step("message 1 read")
    replay.step("a read while owed", hook(app, "PreToolUse", tool_name="Read", tool_input={"file_path": "a.py", "limit": 1})[1])
    replay.step("a journal command while owed", hook(app, "PreToolUse", tool_name="Bash", tool_input={"command": "journal task list"})[1])
    replay.step("a look at its files", hook(app, "PreToolUse", tool_name="Read", tool_input={"file_path": str(app.config.home / "files" / "message" / "1" / "a.png")})[1])
    console.run(["message", "send", "[!reply:1] here", "--reply-to", "1"], AGENT)
    replay.step("the reply")
    replay.step("a read after the reply", hook(app, "PreToolUse", tool_name="Read", tool_input={"file_path": "a.py", "limit": 1})[1])


def writes_over_the_log(app, replay: Replay) -> None:
    """The steps: a task in hand, twenty-seven writes, a log line, then fifty-one writes more."""
    hook(app, "SessionStart")
    console = app.console()
    console.run(["environment", "here"], AGENT)
    console.run(["task", "create", "the footer", "--start"], AGENT)
    replay.step("a task in hand")
    for i in range(1, 28):
        replay.step(f"write {i}", hook(app, "PreToolUse", tool_name="Write", tool_input={"file_path": "a.py"})[1])
    console.run(["task", "log", "1", "halfway"], AGENT)
    replay.step("logged")
    for i in range(1, 52):
        replay.step(f"write {i} after the log", hook(app, "PreToolUse", tool_name="Write", tool_input={"file_path": "a.py"})[1])


def the_clock_ticks(app, replay: Replay) -> None:
    """The steps: an idle agent in auto mode hears the clock at a minute, at half an hour and at half an hour again; then with a task parked, at a minute, twice."""
    from journal.events.agent.ticked import Ticked
    from journal.features.bus import Bus
    hook(app, "SessionStart")
    console = app.console()
    console.run(["environment", "here"], AGENT)
    env = app.container.get(Environments).named("main").id
    tick = lambda quiet: app.container.get(Bus).dispatch(Ticked(session="s1", environment_id=env, at=0.0, quiet_for=quiet))
    hook(app, "Stop")
    replay.step("idle")
    for name, quiet in (("a minute", 60.0), ("half an hour", 1800.0), ("half an hour again", 1800.0)):
        tick(quiet)
        replay.step(f"quiet for {name}")
    console.run(["task", "create", "the footer", "--start"], AGENT)
    console.run(["task", "park", "1", "the header first"], AGENT)
    hook(app, "Stop")
    replay.step("a task parked")
    for name in ("a minute with a task parked", "a minute more"):
        tick(60.0)
        replay.step(name)


def test_clock_ticks_as_the_shipped_workflow_equals_the_two_listeners(journals, monkeypatch):
    with_listener, with_workflow = journals
    with_listener.runtime().start()
    left = Replay(with_listener, monkeypatch)
    empty_shipped(with_listener, "ticked")
    the_clock_ticks(with_listener, left)
    with_workflow.runtime().start()
    right = Replay(with_workflow, monkeypatch, listeners_off=("AskAfterParked", "CheckIn"))
    the_clock_ticks(with_workflow, right)
    by_name = {s["name"]: s for s in left.record()}
    assert by_name["quiet for a minute"]["typed"] == [] and "nothing has happened for half an hour" in str(by_name["quiet for half an hour"]["typed"]) and by_name["quiet for half an hour again"]["typed"] == [], "the listener checks in at half an hour, once inside the window"
    assert "task 1, the footer, is still parked" in str(by_name["a minute with a task parked"]["typed"]) and by_name["a minute more"]["typed"] == [], "and asks after the parked task, once inside the window"
    assert differences(left.record(), right.record(), nudges=True) == [], "the agent would have seen the same, and the record says the same"
    left.freeze("the_clock_ticks")


def a_worker_reports(app, replay: Replay) -> None:
    """The steps: two workers dispatched and awaited; one reports, the other is stopped."""
    hook(app, "SessionStart")
    console = app.console()
    console.run(["environment", "here"], AGENT)
    console.run(["task", "create", "the footer", "--start"], AGENT)
    console.run(["worker", "dispatch", "Lady Lovelace", "write the parser", "--model", "fast"], AGENT)
    console.run(["worker", "dispatch", "Dr. Einstein", "profile it", "--model", "fast"], AGENT)
    console.run(["worker", "wait", "1", "2"], AGENT)
    hook(app, "Stop")
    replay.step("awaiting two workers")
    console.run(["worker", "report", "1", "parser done"], Where("main", "w1"))
    app.runtime().deferred.drain()
    replay.step("worker 1 reports")
    console.run(["worker", "stop", "2"], USER)
    app.runtime().deferred.drain()
    replay.step("worker 2 is stopped")


def a_question_is_answered(app, replay: Replay) -> None:
    """The steps: a question asked and waited on, then answered by the user."""
    hook(app, "SessionStart")
    console = app.console()
    console.run(["environment", "here"], AGENT)
    console.run(["task", "create", "the footer", "--start"], AGENT)
    console.run(["question", "ask", "which colour?", "--options", "red,blue"], AGENT)
    hook(app, "Stop")
    replay.step("waiting on the question")
    console.run(["question", "answer", "1", "blue"], USER)
    app.runtime().deferred.drain()
    replay.step("answered")


def test_worker_reports_as_the_shipped_workflow_equals_the_listener(journals, monkeypatch):
    with_listener, with_workflow = journals
    with_listener.runtime().start()
    left = Replay(with_listener, monkeypatch)
    empty_shipped(with_listener, "workers.updated")
    a_worker_reports(with_listener, left)
    with_workflow.runtime().start()
    right = Replay(with_workflow, monkeypatch, listeners_off=("ReleaseAwaiting",))
    a_worker_reports(with_workflow, right)
    by_name = {s["name"]: s for s in left.record()}
    assert by_name["worker 1 reports"]["typed"] == ["[journal] worker 1, Lady Lovelace, reported in the chat"]
    assert by_name["worker 2 is stopped"]["typed"] == ["[journal] worker 2, Dr. Einstein, stopped before it reported", "[journal] what you waited on came back: carry on"]
    assert with_workflow.container.get(Machine).current("s1").task_id == 1, "the workflow released the agent"
    assert differences(left.record(), right.record(), nudges=True) == [], "the agent would have seen the same, and the record says the same"
    left.freeze("a_worker_reports")


def test_question_answered_as_the_shipped_workflow_equals_the_listener(journals, monkeypatch):
    with_listener, with_workflow = journals
    with_listener.runtime().start()
    left = Replay(with_listener, monkeypatch)
    empty_shipped(with_listener, "questions.updated")
    a_question_is_answered(with_listener, left)
    with_workflow.runtime().start()
    right = Replay(with_workflow, monkeypatch, listeners_off=("ReleaseWaiting",))
    a_question_is_answered(with_workflow, right)
    assert left.record()[-1]["typed"] == ["[journal] question 1 is answered. journal question show 1 reads it whole, with the messages linked to it; act on the answer"]
    assert with_workflow.container.get(Machine).current("s1").task_id == 1, "the workflow released the agent"
    assert differences(left.record(), right.record()) == [], "the agent would have seen the same; the workflow's line is on record too, which the listener never left"
    left.freeze("a_question_is_answered")


def stops_with_unread(app, replay: Replay) -> None:
    """The steps: the agent stops with one message unread, then with four."""
    hook(app, "SessionStart")
    console = app.console()
    console.run(["environment", "here"], AGENT)
    console.run(["message", "send", "one"], USER)
    replay.step("message 1 arrives")
    replay.step("a stop with one unread", hook(app, "Stop")[1])
    for words in ("two", "three", "four"):
        console.run(["message", "send", words], USER)
    replay.step("three more arrive")
    replay.step("a stop with four unread", hook(app, "Stop")[1])


def starts_with_unread(app, replay: Replay) -> None:
    """The steps: two messages are left before any session, then a session starts."""
    console = app.console()
    console.run(["environment", "here"], USER)
    console.run(["message", "send", "one"], USER)
    console.run(["message", "send", "two"], USER)
    replay.step("two messages wait")
    replay.step("a session starts", hook(app, "SessionStart")[1])


def test_the_stop_workflow_carries_the_inbox_equal_to_the_listener(journals, monkeypatch):
    with_listener, with_workflow = journals
    with_listener.runtime().start()
    left = Replay(with_listener, monkeypatch, listeners_off=("InboxOnArrival",))
    empty_shipped(with_listener, "idle")
    stops_with_unread(with_listener, left)
    with_workflow.runtime().start()
    right = Replay(with_workflow, monkeypatch, listeners_off=("InboxOnArrival", "InboxAtStop"))
    stops_with_unread(with_workflow, right)
    by_name = {s["name"]: s for s in left.record()}
    assert "new message 1" in str(by_name["a stop with one unread"]["answer"]) and "4 messages unread" in str(by_name["a stop with four unread"]["answer"])
    assert differences(left.record(), right.record(), nudges=True) == [], "the agent would have seen the same, and the record says the same"
    left.freeze("stops_with_unread")


def test_the_start_workflow_carries_the_inbox_equal_to_the_listener(journals, monkeypatch):
    with_listener, with_workflow = journals
    with_listener.runtime().start()
    left = Replay(with_listener, monkeypatch)
    empty_shipped(with_listener, "session_started")
    starts_with_unread(with_listener, left)
    with_workflow.runtime().start()
    right = Replay(with_workflow, monkeypatch, listeners_off=("InboxAtStart",))
    starts_with_unread(with_workflow, right)
    assert "new messages 1, 2" in str(left.record()[-1]["answer"]), "the listener names the inbox at a start"
    assert differences(left.record(), right.record(), nudges=True) == [], "the agent would have seen the same, and the record says the same"
    left.freeze("starts_with_unread")


TOOL_LISTENERS = ("HoldUnread", "HoldUnanswered", "LogCadence")


def test_tool_about_to_run_as_the_shipped_workflow_equals_the_three_listeners_on_the_inbox(journals, monkeypatch):
    with_listener, with_workflow = journals
    with_listener.runtime().start()
    left = Replay(with_listener, monkeypatch, listeners_off=("InboxOnArrival", "InboxAtPrompt"))
    empty_shipped(with_listener, "tool_starting")
    tool_uses_with_the_inbox(with_listener, left)
    with_workflow.runtime().start()
    right = Replay(with_workflow, monkeypatch, listeners_off=("InboxOnArrival", "InboxAtPrompt", *TOOL_LISTENERS))
    tool_uses_with_the_inbox(with_workflow, right)
    by_name = {s["name"]: s for s in left.record()}
    assert "new message 1" in str(by_name["read 3"]["answer"]) and by_name["read 4"]["answer"] == {}, "the listener names the inbox every third use"
    assert "your inbox is unread: 1 waiting" in str(by_name["a write at 17"]["answer"]), "and holds the write after five namings"
    assert "answer message 1 first" in str(by_name["a read while owed"]["answer"]) and by_name["a journal command while owed"]["answer"] == {} and by_name["a look at its files"]["answer"] == {} and by_name["a read after the reply"]["answer"] == {}
    assert differences(left.record(), right.record(), nudges=True) == [], "the agent would have seen the same, and the record says the same"
    left.freeze("tool_uses_with_the_inbox")


def test_tool_about_to_run_as_the_shipped_workflow_equals_the_log_cadence(journals, monkeypatch):
    with_listener, with_workflow = journals
    with_listener.runtime().start()
    left = Replay(with_listener, monkeypatch)
    empty_shipped(with_listener, "tool_starting")
    writes_over_the_log(with_listener, left)
    with_workflow.runtime().start()
    right = Replay(with_workflow, monkeypatch, listeners_off=TOOL_LISTENERS)
    writes_over_the_log(with_workflow, right)
    by_name = {s["name"]: s for s in left.record()}
    assert "25 edits since you logged task 1" in str(by_name["write 26"]["answer"]) and by_name["write 27"]["answer"] == {}, "the listener asks for a log at the first threshold"
    assert "50 edits since you logged task 1" in str(by_name["write 51 after the log"]["answer"]) and "error" in by_name["write 51 after the log"]["answer"], "and holds the write when the log is overdue"
    assert differences(left.record(), right.record(), nudges=True) == [], "the agent would have seen the same, and the record says the same"
    left.freeze("writes_over_the_log")


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
