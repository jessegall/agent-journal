# The replays boot a journal each and run minutes, so they are not in the default run: python3 -m pytest tests/replays_run.py, before any commit that touches the workflows. The listener side was frozen before the listeners were deleted; REPLAY_FREEZE=1 re-records only what listeners are still in code.
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
from journal.repositories.environments import Environments
from journal.repositories.scope import Scope
from journal.repositories.settings import Settings
from tests.replay import PROVIDERS, TOOLS, Replay, differences, hook_as, recorded
from tests.test_features import AGENT, MAIN, USER, context


@pytest.fixture(params=PROVIDERS)
def journals(tmp_path: Path, monkeypatch, request):
    """Two fresh journals, one for the listener and one for the workflow, and the provider whose agent the steps play; both start and stop together."""
    monkeypatch.setattr(Config, "status_home", property(lambda self: self.root / "status"))
    monkeypatch.setattr(WorkerRunner, "start", lambda self, worker, by: None)
    apps = []
    for name in ("listener", "workflow"):
        app = App(Config(tmp_path / name, port=0))
        app.container.get(Settings).save(Setting(environment_id=0, key="features.skills", value=False), Actor.system())
        apps.append(app)
    with apps[0].container.get(Scope).of(MAIN):
        yield [*apps, request.param]
    for app in apps:
        app.runtime().stop()




def prompts_with_unread(app, replay: Replay, provider: str) -> None:
    """The steps: a session starts, messages arrive while the agent sits at its prompt, and it sends a prompt after one, after three and after four, twice."""
    hook_as(app, provider, "SessionStart")
    app.console().run(["environment", "here"], AGENT)
    replay.step("session starts")
    for n, words in ((1, "one"), (2, "two"), (3, "three"), (4, "four")):
        app.console().run(["message", "send", words], USER)
        replay.step(f"message {n} arrives")
        if n in (1, 3, 4):
            replay.step(f"a prompt after {n}", hook_as(app, provider, "UserPromptSubmit", prompt="working")[1])
    replay.step("a prompt again after 4", hook_as(app, provider, "UserPromptSubmit", prompt="still working")[1])


def test_prompt_sent_as_the_shipped_workflow_equals_the_listener(journals, monkeypatch):
    with_listener, with_workflow, provider = journals
    left = recorded(f"prompt_sent_{provider}", with_listener, monkeypatch, prompts_with_unread, provider, nudges=True)
    with_workflow.runtime().start()
    right = Replay(with_workflow, monkeypatch)
    prompts_with_unread(with_workflow, right, provider)
    answers = [s["answer"] for s in left.record() if s["answer"] is not None]
    assert "new message 1" in str(answers[0]) and "new messages 1, 2, 3" in str(answers[1]) and "4 messages unread" in str(answers[2]) and "unread" not in str(answers[3]), "the listener names one, a few, many, and not again inside the window"
    assert differences(left.record(), right.record(), nudges=True) == [], "the agent would have seen the same, and the record says the same"


def tool_uses_with_the_inbox(app, replay: Replay, provider: str) -> None:
    """The steps: with a task in hand a message arrives; sixteen reads and a write go by unread; the message is read and a read, a journal command, a look at its files and a read after the reply follow."""
    hook_as(app, provider, "SessionStart")
    console = app.console()
    console.run(["environment", "here"], AGENT)
    console.run(["task", "create", "the footer", "--start"], AGENT)
    replay.step("a task in hand")
    console.run(["message", "send", "one"], USER)
    replay.step("message 1 arrives")
    for i in range(1, 17):
        replay.step(f"read {i}", hook_as(app, provider, "PreToolUse", tool_name=TOOLS[provider].read, tool_input={"file_path": "a.py", "limit": 1})[1])
    replay.step("a write at 17", hook_as(app, provider, "PreToolUse", tool_name=TOOLS[provider].write, tool_input={"file_path": "a.py"})[1])
    console.run(["message", "read", "1"], AGENT)
    replay.step("message 1 read")
    replay.step("a read while owed", hook_as(app, provider, "PreToolUse", tool_name=TOOLS[provider].read, tool_input={"file_path": "a.py", "limit": 1})[1])
    replay.step("a journal command while owed", hook_as(app, provider, "PreToolUse", tool_name=TOOLS[provider].shell, tool_input={"command": "journal task list"})[1])
    replay.step("a look at its files", hook_as(app, provider, "PreToolUse", tool_name=TOOLS[provider].read, tool_input={"file_path": str(app.config.home / "files" / "message" / "1" / "a.png")})[1])
    console.run(["message", "send", "[!reply:1] here", "--reply-to", "1"], AGENT)
    replay.step("the reply")
    replay.step("a read after the reply", hook_as(app, provider, "PreToolUse", tool_name=TOOLS[provider].read, tool_input={"file_path": "a.py", "limit": 1})[1])


def count_survives_events(app, replay: Replay, provider: str) -> None:
    """The steps: a message arrives, two reads, a stop, a prompt, a third read that names the inbox since the count of uses survived the stop and the prompt, a session start, then three reads more, the sixth naming again."""
    hook_as(app, provider, "SessionStart")
    console = app.console()
    console.run(["environment", "here"], AGENT)
    console.run(["message", "send", "one"], USER)
    replay.step("message 1 arrives")
    read = lambda: hook_as(app, provider, "PreToolUse", tool_name=TOOLS[provider].read, tool_input={"file_path": "a.py", "limit": 1})[1]
    replay.step("read 1", read())
    replay.step("read 2", read())
    replay.step("a stop", hook_as(app, provider, "Stop")[1])
    replay.step("a prompt", hook_as(app, provider, "UserPromptSubmit", prompt="working")[1])
    replay.step("read 3, the third use since the message", read())
    replay.step("the session starts again", hook_as(app, provider, "SessionStart")[1])
    replay.step("read 4", read())
    replay.step("read 5", read())
    replay.step("read 6, the sixth", read())


def writes_over_the_log(app, replay: Replay, provider: str) -> None:
    """The steps: a task in hand, twenty-seven writes, a log line, then fifty-one writes more."""
    hook_as(app, provider, "SessionStart")
    console = app.console()
    console.run(["environment", "here"], AGENT)
    console.run(["task", "create", "the footer", "--start"], AGENT)
    replay.step("a task in hand")
    for i in range(1, 28):
        replay.step(f"write {i}", hook_as(app, provider, "PreToolUse", tool_name=TOOLS[provider].write, tool_input={"file_path": "a.py"})[1])
    console.run(["task", "log", "1", "halfway"], AGENT)
    replay.step("logged")
    for i in range(1, 52):
        replay.step(f"write {i} after the log", hook_as(app, provider, "PreToolUse", tool_name=TOOLS[provider].write, tool_input={"file_path": "a.py"})[1])


def the_clock_ticks(app, replay: Replay, provider: str) -> None:
    """The steps: an idle agent in auto mode hears the clock at a minute, at half an hour and at half an hour again; then with a task parked, at a minute, twice; then awaiting something outside, at five minutes, twice, until its own tool use lifts the wait."""
    from journal.events.agent.ticked import Ticked
    from journal.events.bus import Bus
    hook_as(app, provider, "SessionStart")
    console = app.console()
    console.run(["environment", "here"], AGENT)
    env = app.container.get(Environments).named("main").id
    tick = lambda quiet: app.container.get(Bus).dispatch(Ticked(session="s1", environment_id=env, at=0.0, quiet_for=quiet))
    hook_as(app, provider, "Stop")
    replay.step("idle")
    for name, quiet in (("a minute", 60.0), ("half an hour", 1800.0), ("half an hour again", 1800.0)):
        tick(quiet)
        replay.step(f"quiet for {name}")
    console.run(["task", "create", "the footer", "--start"], AGENT)
    console.run(["task", "park", "1", "the header first"], AGENT)
    hook_as(app, provider, "Stop")
    replay.step("a task parked")
    for name in ("a minute with a task parked", "a minute more"):
        tick(60.0)
        replay.step(name)
    console.run(["task", "resume", "1"], AGENT)
    console.run(["await", "the deploy"], AGENT)
    replay.step("awaiting the deploy")
    for name in ("five quiet minutes awaiting", "five more awaiting"):
        tick(300.0)
        replay.step(name)
    replay.step("the agent's own tool use lifts the wait", hook_as(app, provider, "PreToolUse", tool_name=TOOLS[provider].read, tool_input={"file_path": "a.py", "limit": 1})[1])


def test_clock_ticks_as_the_shipped_workflow_equals_the_two_listeners(journals, monkeypatch):
    with_listener, with_workflow, provider = journals
    left = recorded(f"the_clock_ticks_{provider}", with_listener, monkeypatch, the_clock_ticks, provider, nudges=True)
    with_workflow.runtime().start()
    right = Replay(with_workflow, monkeypatch)
    the_clock_ticks(with_workflow, right, provider)
    by_name = {s["name"]: s for s in left.record()}
    assert by_name["quiet for a minute"]["typed"] == [] and "nothing has happened for half an hour" in str(by_name["quiet for half an hour"]["typed"]) and by_name["quiet for half an hour again"]["typed"] == [], "the listener checks in at half an hour, once inside the window"
    assert "task 1 is still parked" in str(by_name["a minute with a task parked"]["typed"]) and by_name["a minute more"]["typed"] == [], "and asks after the parked task, once inside the window"
    assert differences(left.record(), right.record(), nudges=True) == [], "the agent would have seen the same, and the record says the same"


def a_worker_reports(app, replay: Replay, provider: str) -> None:
    """The steps: two workers dispatched and awaited; one reports, the other is stopped."""
    hook_as(app, provider, "SessionStart")
    console = app.console()
    console.run(["environment", "here"], AGENT)
    console.run(["task", "create", "the footer", "--start"], AGENT)
    console.run(["worker", "dispatch", "Lady Lovelace", "write the parser", "--model", "fast"], AGENT)
    console.run(["worker", "dispatch", "Dr. Einstein", "profile it", "--model", "fast"], AGENT)
    console.run(["worker", "wait", "1", "2"], AGENT)
    hook_as(app, provider, "Stop")
    replay.step("awaiting two workers")
    console.run(["worker", "report", "1", "parser done"], Where("main", "w1"))
    app.runtime().deferred.drain()
    replay.step("worker 1 reports")
    console.run(["worker", "stop", "2"], USER)
    app.runtime().deferred.drain()
    replay.step("worker 2 is stopped")


def a_question_is_answered(app, replay: Replay, provider: str) -> None:
    """The steps: a question asked and waited on, then answered by the user."""
    hook_as(app, provider, "SessionStart")
    console = app.console()
    console.run(["environment", "here"], AGENT)
    console.run(["task", "create", "the footer", "--start"], AGENT)
    console.run(["question", "ask", "which colour?", "--options", "red,blue"], AGENT)
    hook_as(app, provider, "Stop")
    replay.step("waiting on the question")
    console.run(["question", "answer", "1", "blue"], USER)
    app.runtime().deferred.drain()
    replay.step("answered")


def test_worker_reports_as_the_shipped_workflow_equals_the_listener(journals, monkeypatch):
    with_listener, with_workflow, provider = journals
    left = recorded(f"a_worker_reports_{provider}", with_listener, monkeypatch, a_worker_reports, provider, nudges=True)
    with_workflow.runtime().start()
    right = Replay(with_workflow, monkeypatch)
    a_worker_reports(with_workflow, right, provider)
    by_name = {s["name"]: s for s in left.record()}
    assert by_name["worker 1 reports"]["typed"] == ["[journal] worker 1, Lady Lovelace, reported in the chat"]
    assert by_name["worker 2 is stopped"]["typed"] == ["[journal] worker 2, Dr. Einstein, stopped before it reported", "[journal] what you waited on came back: carry on"]
    assert with_workflow.container.get(Machine).current("s1").task_id == 1, "the workflow released the agent"
    assert differences(left.record(), right.record(), nudges=True) == [], "the agent would have seen the same, and the record says the same"


def test_question_answered_as_the_shipped_workflow_equals_the_listener(journals, monkeypatch):
    with_listener, with_workflow, provider = journals
    left = recorded(f"a_question_is_answered_{provider}", with_listener, monkeypatch, a_question_is_answered, provider, nudges=False)
    with_workflow.runtime().start()
    right = Replay(with_workflow, monkeypatch)
    a_question_is_answered(with_workflow, right, provider)
    assert left.record()[-1]["typed"] == ["[journal] question 1 is answered. `journal question show 1` reads it whole, with the messages linked to it; act on the answer"]
    assert with_workflow.container.get(Machine).current("s1").task_id == 1, "the workflow released the agent"
    assert differences(left.record(), right.record()) == [], "the agent would have seen the same; the workflow's line is on record too, which the listener never left"


def stops_with_unread(app, replay: Replay, provider: str) -> None:
    """The steps: the agent stops with one message unread, then with four."""
    hook_as(app, provider, "SessionStart")
    console = app.console()
    console.run(["environment", "here"], AGENT)
    console.run(["message", "send", "one"], USER)
    replay.step("message 1 arrives")
    replay.step("a stop with one unread", hook_as(app, provider, "Stop")[1])
    for words in ("two", "three", "four"):
        console.run(["message", "send", words], USER)
    replay.step("three more arrive")
    replay.step("a stop with four unread", hook_as(app, provider, "Stop")[1])


def starts_with_unread(app, replay: Replay, provider: str) -> None:
    """The steps: two messages are left before any session, then a session starts."""
    console = app.console()
    console.run(["environment", "here"], USER)
    console.run(["message", "send", "one"], USER)
    console.run(["message", "send", "two"], USER)
    replay.step("two messages wait")
    replay.step("a session starts", hook_as(app, provider, "SessionStart")[1])


def test_the_stop_workflow_carries_the_inbox_equal_to_the_listener(journals, monkeypatch):
    with_listener, with_workflow, provider = journals
    left = recorded(f"stops_with_unread_{provider}", with_listener, monkeypatch, stops_with_unread, provider, nudges=True)
    with_workflow.runtime().start()
    right = Replay(with_workflow, monkeypatch)
    stops_with_unread(with_workflow, right, provider)
    by_name = {s["name"]: s for s in left.record()}
    assert "new message 1" in str(by_name["a stop with one unread"]["answer"]) and "4 messages unread" in str(by_name["a stop with four unread"]["answer"])
    assert differences(left.record(), right.record(), nudges=True) == [], "the agent would have seen the same, and the record says the same"


def test_the_start_workflow_carries_the_inbox_equal_to_the_listener(journals, monkeypatch):
    with_listener, with_workflow, provider = journals
    left = recorded(f"starts_with_unread_{provider}", with_listener, monkeypatch, starts_with_unread, provider, nudges=True)
    with_workflow.runtime().start()
    right = Replay(with_workflow, monkeypatch)
    starts_with_unread(with_workflow, right, provider)
    assert "new messages 1, 2" in str(left.record()[-1]["answer"]), "the listener names the inbox at a start"
    assert differences(left.record(), right.record(), nudges=True) == [], "the agent would have seen the same, and the record says the same"


TOOL_LISTENERS = ("HoldUnread", "HoldUnanswered", "LogCadence")


def tool_uses_with_changed_settings(app, replay: Replay, provider: str) -> None:
    """The steps, with the cadences changed: the answer asked for after two uses and held after four; the task named every two edits, the log asked for at three and held at six."""
    settings = app.container.get(Settings)
    for key, value in (("messages.nudge_after", 2), ("messages.hold_after", 4), ("tasks.name_every", 2), ("tasks.first_nudge_after", 3), ("tasks.log_after", 6)):
        settings.set(key, value, Actor.system())
    hook_as(app, provider, "SessionStart")
    console = app.console()
    console.run(["environment", "here"], AGENT)
    console.run(["task", "create", "the footer", "--start"], AGENT)
    console.run(["message", "send", "one"], USER)
    console.run(["message", "read", "1"], AGENT)
    replay.step("message 1 read")
    for i in range(1, 6):
        replay.step(f"read {i} while owed", hook_as(app, provider, "PreToolUse", tool_name=TOOLS[provider].read, tool_input={"file_path": "a.py", "limit": 1})[1])
    console.run(["message", "send", "[!reply:1] here", "--reply-to", "1"], AGENT)
    replay.step("the reply")
    for i in range(1, 8):
        replay.step(f"write {i}", hook_as(app, provider, "PreToolUse", tool_name=TOOLS[provider].write, tool_input={"file_path": "a.py"})[1])


def test_changed_settings_keep_their_meaning_in_the_tool_workflow(journals, monkeypatch):
    with_listener, with_workflow, provider = journals
    left = recorded(f"tool_uses_with_changed_settings_{provider}", with_listener, monkeypatch, tool_uses_with_changed_settings, provider, nudges=True)
    with_workflow.runtime().start()
    right = Replay(with_workflow, monkeypatch)
    tool_uses_with_changed_settings(with_workflow, right, provider)
    by_name = {s["name"]: s for s in left.record()}
    assert by_name["read 1 while owed"]["answer"] == {} and "answer message 1 before you do anything else" in str(by_name["read 2 while owed"]["answer"]) and by_name["read 3 while owed"]["answer"] == {}, "the listener asks after two uses, once inside the window"
    assert "error" in by_name["read 4 while owed"]["answer"] and "error" in by_name["read 5 while owed"]["answer"], "and holds after four"
    assert "in hand, 2 edits" in str(by_name["write 3"]["answer"]) and "3 edits since you logged task 1: say where it stands" in str(by_name["write 4"]["answer"]) and "in hand, 4 edits" in str(by_name["write 5"]["answer"]) and by_name["write 6"]["answer"] == {} and "error" in by_name["write 7"]["answer"], "the task is named every two edits, the log asked at three and held at six"
    assert differences(left.record(), right.record(), nudges=True) == [], "the agent would have seen the same, and the record says the same"


def test_tool_about_to_run_as_the_shipped_workflow_equals_the_three_listeners_on_the_inbox(journals, monkeypatch):
    with_listener, with_workflow, provider = journals
    left = recorded(f"tool_uses_with_the_inbox_{provider}", with_listener, monkeypatch, tool_uses_with_the_inbox, provider, nudges=True)
    with_workflow.runtime().start()
    right = Replay(with_workflow, monkeypatch)
    tool_uses_with_the_inbox(with_workflow, right, provider)
    by_name = {s["name"]: s for s in left.record()}
    assert "new message 1" in str(by_name["read 3"]["answer"]) and by_name["read 4"]["answer"] == {}, "the listener names the inbox every third use"
    assert "you have 1 unread messages" in str(by_name["a write at 17"]["answer"]), "and holds the write after five namings"
    assert "answer message 1 first" in str(by_name["a read while owed"]["answer"]) and by_name["a journal command while owed"]["answer"] == {} and by_name["a look at its files"]["answer"] == {} and by_name["a read after the reply"]["answer"] == {}
    assert differences(left.record(), right.record(), nudges=True) == [], "the agent would have seen the same, and the record says the same"


def test_tool_about_to_run_as_the_shipped_workflow_equals_the_log_cadence(journals, monkeypatch):
    with_listener, with_workflow, provider = journals
    left = recorded(f"writes_over_the_log_{provider}", with_listener, monkeypatch, writes_over_the_log, provider, nudges=True)
    with_workflow.runtime().start()
    right = Replay(with_workflow, monkeypatch)
    writes_over_the_log(with_workflow, right, provider)
    by_name = {s["name"]: s for s in left.record()}
    assert "25 edits since you logged task 1" in str(by_name["write 26"]["answer"]) and by_name["write 27"]["answer"] == {}, "the listener asks for a log at the first threshold"
    assert "50 edits since you logged task 1" in str(by_name["write 51 after the log"]["answer"]) and "error" in by_name["write 51 after the log"]["answer"], "and holds the write when the log is overdue"
    assert differences(left.record(), right.record(), nudges=True) == [], "the agent would have seen the same, and the record says the same"


def message_arrives(app, replay: Replay, provider: str) -> None:
    """The steps: a session starts, the user leaves a message while the agent sits at its prompt."""
    hook_as(app, provider, "SessionStart")
    app.console().run(["environment", "here"], AGENT)
    replay.step("session starts")
    app.console().run(["message", "send", "are you there?"], USER)
    replay.step("a message arrives")


def test_message_arrives_as_the_shipped_workflow_equals_the_listener(journals, monkeypatch):
    with_listener, with_workflow, provider = journals
    left = recorded(f"message_arrives_{provider}", with_listener, monkeypatch, message_arrives, provider, nudges=True)
    with_workflow.runtime().start()
    right = Replay(with_workflow, monkeypatch)
    message_arrives(with_workflow, right, provider)
    assert left.record()[-1]["typed"] == ["[journal] new message 1"], "the listener names the message"
    assert differences(left.record(), right.record(), nudges=True) == [], "the agent would have seen the same, and the record says the same"


def tick(app, quiet: float) -> None:
    """A tick as the clock gives it: dispatched to every listener, and what a state says on it typed into the terminal."""
    from journal.events.agent.ticked import Ticked
    from journal.events.bus import Bus
    from journal.events.decision import Decision
    from journal.supervisor_link import SupervisorLink
    env = app.container.get(Environments).named("main").id
    for answer in app.container.get(Bus).dispatch(Ticked(session="s1", environment_id=env, at=0.0, quiet_for=quiet)):
        if isinstance(answer, Decision) and answer.context:
            app.container.get(SupervisorLink).type(env, answer.context)


def working_rules(app, replay: Replay, provider: str) -> None:
    """The steps: a task in hand, then a stop, a session starting again and a quarter of an hour's quiet: what the Working state says of its own."""
    hook_as(app, provider, "SessionStart")
    console = app.console()
    console.run(["environment", "here"], AGENT)
    console.run(["task", "create", "the footer", "--start"], AGENT)
    replay.step("a task in hand")
    replay.step("a stop with the task in hand", hook_as(app, provider, "Stop")[1])
    replay.step("the session starts again", hook_as(app, provider, "SessionStart")[1])
    tick(app, 900.0)
    replay.step("quiet for a quarter of an hour")


def expecting_rules(app, replay: Replay, provider: str) -> None:
    """The steps: a task in hand awaiting something outside, five quiet minutes twice, then a tool use that lifts the wait."""
    hook_as(app, provider, "SessionStart")
    console = app.console()
    console.run(["environment", "here"], AGENT)
    console.run(["task", "create", "the footer", "--start"], AGENT)
    console.run(["await", "the deploy"], AGENT)
    replay.step("awaiting the deploy")
    for name in ("five quiet minutes", "five more"):
        tick(app, 330.0)
        replay.step(name)
    replay.step("a tool use lifts the wait", hook_as(app, provider, "PreToolUse", tool_name=TOOLS[provider].read, tool_input={"file_path": "a.py", "limit": 1})[1])


def sequence_rules(app, replay: Replay, provider: str) -> None:
    """The steps: a sequence of two steps run; a write before the step is taken up, a stop after a tool use, the step followed and a write, then a stop at step two."""
    hook_as(app, provider, "SessionStart")
    console = app.console()
    console.run(["environment", "here"], AGENT)
    made = console.run(["sequence", "create", "ship it", "--steps", "tag it | push"], USER).out.split()[1].rstrip(":")
    console.run(["sequence", "run", made], AGENT)
    replay.step("the sequence runs")
    replay.step("a write before the step is taken up", hook_as(app, provider, "PreToolUse", tool_name=TOOLS[provider].write, tool_input={"file_path": "a.py"})[1])
    hook_as(app, provider, "PreToolUse", tool_name=TOOLS[provider].read, tool_input={"file_path": "a.py", "limit": 1})
    replay.step("a stop at step one", hook_as(app, provider, "Stop")[1])
    console.run(["sequence", "follow"], AGENT)
    replay.step("a write once it is taken up", hook_as(app, provider, "PreToolUse", tool_name=TOOLS[provider].write, tool_input={"file_path": "a.py"})[1])
    console.run(["sequence", "next"], AGENT)
    hook_as(app, provider, "PreToolUse", tool_name=TOOLS[provider].read, tool_input={"file_path": "a.py", "limit": 1})
    replay.step("a stop at step two", hook_as(app, provider, "Stop")[1])


def plan_building(app, replay: Replay, provider: str) -> None:
    """The steps: the agent creates a plan and Building a plan carries it through the goal, the phases and the tasks to a ready plan, each step taken up by the command it names."""
    hook_as(app, provider, "SessionStart")
    console = app.console()
    console.run(["environment", "here"], AGENT)
    shell = lambda line: hook_as(app, provider, "PreToolUse", tool_name=TOOLS[provider].shell, tool_input={"command": line})[1]
    console.run(["plan", "create", "Release", "--brief", "a release"], AGENT)
    app.runtime().deferred.drain()
    replay.step("the plan is created and Building a plan starts")
    replay.step("a write before the goal is taken up", hook_as(app, provider, "PreToolUse", tool_name=TOOLS[provider].write, tool_input={"file_path": "a.py"})[1])
    replay.step("the goal's command takes the step up", shell('journal plan brief 1 "a tagged release"'))
    console.run(["plan", "brief", "1", "a tagged release"], AGENT)
    console.run(["sequence", "next"], AGENT)
    replay.step("the phases' command takes the step up", shell('journal plan phase 1 "Tag" --when "tagged"'))
    console.run(["plan", "phase", "1", "Tag", "--when", "tagged"], AGENT)
    console.run(["sequence", "next"], AGENT)
    replay.step("the tasks' command takes the step up", shell('journal plan add 1 "Tag it" --brief "tagged"'))
    console.run(["plan", "add", "1", "Tag it", "--brief", "tagged"], AGENT)
    console.run(["plan", "todos", "1", "1", "1"], AGENT)
    console.run(["sequence", "next"], AGENT)
    console.run(["sequence", "follow"], AGENT)
    replay.step("the last step refused before the plan is ready", {"err": console.run(["sequence", "next"], AGENT).err})
    console.run(["plan", "ready", "1"], AGENT)
    replay.step("the last step once it is ready", {"out": console.run(["sequence", "next"], AGENT).out})


def owed_pause_rules(app, replay: Replay, provider: str) -> None:
    """The steps: a stop before the agent has looked at what is in flight, then a context mark reached and a stop under it."""
    hook_as(app, provider, "SessionStart")
    replay.step("a stop before orienting", hook_as(app, provider, "Stop")[1])
    app.console().run(["environment", "here"], AGENT)
    context(app, 95)
    replay.step("a tool use at the mark", hook_as(app, provider, "PreToolUse", tool_name=TOOLS[provider].read, tool_input={"file_path": "a.py", "limit": 1})[1])
    replay.step("a stop under the mark", hook_as(app, provider, "Stop")[1])


def waiting_rules(app, replay: Replay, provider: str) -> None:
    """The steps: a question asked and waited on, then a prompt from the user's side while it waits."""
    hook_as(app, provider, "SessionStart")
    console = app.console()
    console.run(["environment", "here"], AGENT)
    console.run(["task", "create", "the footer", "--start"], AGENT)
    console.run(["question", "ask", "which colour?", "--options", "red,blue"], AGENT)
    replay.step("waiting on the question")
    replay.step("a prompt while waiting", hook_as(app, provider, "UserPromptSubmit", prompt="carry on with the rest")[1])


def stuck_rules(app, replay: Replay, provider: str) -> None:
    """The steps: a task in hand, the agent declares itself stuck, stops, then works again."""
    hook_as(app, provider, "SessionStart")
    console = app.console()
    console.run(["environment", "here"], AGENT)
    console.run(["task", "create", "the footer", "--start"], AGENT)
    console.run(["stuck", "the build is broken"], AGENT)
    replay.step("stuck")
    replay.step("a stop while stuck", hook_as(app, provider, "Stop")[1])
    replay.step("a tool use while stuck", hook_as(app, provider, "PreToolUse", tool_name=TOOLS[provider].read, tool_input={"file_path": "a.py", "limit": 1})[1])


def read_skill(app, provider: str, folder: str):
    return hook_as(app, provider, "PostToolUse", tool_name=TOOLS[provider].read, tool_input={"file_path": str(app.config.root / f".claude/skills/{folder}/SKILL.md")}, tool_response="")[1]


def loading_skill_rules(app, replay: Replay, provider: str) -> None:
    """The steps, with the skills on: a session starts and requires the journal skill, a write is held until the file is read, the start's look follows; a message arrives and a prompt naming plans requires that skill, the inbox named under the hold, a write held until the file is read, then allowed."""
    app.container.get(Settings).save(Setting(environment_id=0, key="features.skills", value=True), Actor.system())
    write = lambda: hook_as(app, provider, "PreToolUse", tool_name=TOOLS[provider].write, tool_input={"file_path": "a.py"})[1]
    replay.step("the session starts", hook_as(app, provider, "SessionStart")[1])
    replay.step("a write before the skill is read", write())
    replay.step("the journal skill read", read_skill(app, provider, "journal"))
    replay.step("a write before the look", write())
    app.console().run(["environment", "here"], AGENT)
    replay.step("looked at what is in flight")
    app.console().run(["message", "send", "one"], USER)
    replay.step("message 1 arrives")
    replay.step("a prompt naming plans", hook_as(app, provider, "UserPromptSubmit", prompt="make me a plan for the release")[1])
    replay.step("a write before the plans skill is read", write())
    replay.step("the plans skill read", read_skill(app, provider, "journal-plans"))
    replay.step("a write after", write())


def orienting_rules(app, replay: Replay, provider: str) -> None:
    """The steps: a session starts, a write is refused until the agent has looked at what is in flight, then allowed; a start after a compaction asks the same."""
    write = lambda: hook_as(app, provider, "PreToolUse", tool_name=TOOLS[provider].write, tool_input={"file_path": "a.py"})[1]
    replay.step("the session starts", hook_as(app, provider, "SessionStart")[1])
    replay.step("a write before the look", write())
    app.console().run(["environment", "here"], AGENT)
    replay.step("looked at what is in flight")
    replay.step("a write after the look", write())
    app.console().run(["task", "create", "t", "--start"], AGENT)
    app.console().run(["message", "send", "hi"], USER)
    replay.step("the session starts again after a compaction", hook_as(app, provider, "SessionStart", source="compact")[1])
    replay.step("a write before the second look", write())
    app.console().run(["environment", "here"], AGENT)
    replay.step("looked again")
    replay.step("a write after the second look", write())


def at_mark_rules(app, replay: Replay, provider: str) -> None:
    """The steps: with a task in hand the context crosses the first mark, a read is told, a write is held, a fact recorded lets it through and the mark asks once; the context crosses the second mark at a stop, and nothing survives lets it through."""
    hook_as(app, provider, "SessionStart")
    app.console().run(["environment", "here"], AGENT)
    app.console().run(["task", "create", "t", "--start"], AGENT)
    read = lambda: hook_as(app, provider, "PreToolUse", tool_name=TOOLS[provider].read, tool_input={"file_path": "a.py", "limit": 1})[1]
    write = lambda: hook_as(app, provider, "PreToolUse", tool_name=TOOLS[provider].write, tool_input={"file_path": "a.py"})[1]
    replay.step("a task in hand")
    context(app, 30)
    replay.step("a read past the first mark", read())
    replay.step("a write at the mark", write())
    app.console().run(["fact", "create", "the login is flaky"], AGENT)
    replay.step("a fact recorded")
    replay.step("a write after the fact", write())
    replay.step("a read: the mark asks once", read())
    context(app, 55)
    replay.step("a stop past the second mark", hook_as(app, provider, "Stop")[1])
    replay.step("a write at the second mark", write())
    app.console().run(["nothing", "survives", "all logged"], AGENT)
    replay.step("nothing survives")
    replay.step("a write after", write())


def plan_rules(app, replay: Replay, provider: str) -> None:
    """The steps: a plan of two phases, the first a checkpoint, approved and started; its first task done, a stop with auto off then on, the next phase started, a second session starting under the plan, the plan parked, then a second plan started and cancelled."""
    hook_as(app, provider, "SessionStart")
    console = app.console()
    console.run(["environment", "here"], AGENT)
    console.run(["plan", "create", "p", "--brief", "b"], USER)
    console.run(["plan", "add", "1", "first"], USER)
    console.run(["plan", "add", "1", "second"], USER)
    console.run(["plan", "phase", "1", "one", "--when", "w", "--checkpoint"], USER)
    console.run(["plan", "phase", "1", "two", "--when", "w"], USER)
    console.run(["plan", "todos", "1", "1", "1"], USER)
    console.run(["plan", "todos", "1", "2", "2"], USER)
    console.run(["plan", "ready", "1"], USER)
    console.run(["plan", "approve", "1"], USER)
    console.run(["plan", "start", "1"], AGENT)
    replay.step("the plan is started")
    console.run(["task", "done", "1"], AGENT)
    app.runtime().deferred.drain()
    replay.step("the first task is done, the phase a checkpoint")
    app.container.get(Settings).save(Setting(environment_id=0, key="tasks.auto", value=False), Actor.system())
    replay.step("a stop at the checkpoint, auto off", hook_as(app, provider, "Stop")[1])
    app.container.get(Settings).save(Setting(environment_id=0, key="tasks.auto", value=True), Actor.system())
    replay.step("a stop at the checkpoint, auto on", hook_as(app, provider, "Stop")[1])
    console.run(["plan", "start", "1"], AGENT)
    replay.step("the next phase started")
    replay.step("a second session starts under the plan", hook_as(app, provider, "SessionStart", session="s2")[1])
    console.run(["plan", "park", "1"], AGENT)
    app.runtime().deferred.drain()
    replay.step("the plan is parked")
    console.run(["plan", "create", "q", "--brief", "b"], USER)
    console.run(["plan", "add", "2", "third"], USER)
    console.run(["plan", "ready", "2"], USER)
    console.run(["plan", "approve", "2"], USER)
    console.run(["plan", "start", "2"], AGENT)
    console.run(["plan", "cancel", "2"], USER)
    app.runtime().deferred.drain()
    replay.step("a second plan started and cancelled")
    replay.step("a stop after", hook_as(app, provider, "Stop")[1])


def awaiting_rules(app, replay: Replay, provider: str) -> None:
    """The steps: two workers dispatched and awaited; a stop while awaiting; the first reports and the agent still waits; the last reports and the agent is released; a stop after."""
    hook_as(app, provider, "SessionStart")
    console = app.console()
    console.run(["environment", "here"], AGENT)
    console.run(["task", "create", "the footer", "--start"], AGENT)
    console.run(["worker", "dispatch", "Lady Lovelace", "write the parser", "--model", "fast"], AGENT)
    console.run(["worker", "dispatch", "Dr. Einstein", "profile it", "--model", "fast"], AGENT)
    console.run(["worker", "wait", "1", "2"], AGENT)
    replay.step("awaiting two workers", hook_as(app, provider, "Stop")[1])
    console.run(["worker", "report", "1", "parser done"], Where("main", "w1"))
    app.runtime().deferred.drain()
    replay.step("the first reports", hook_as(app, provider, "Stop")[1])
    console.run(["worker", "report", "2", "profiled"], Where("main", "w2"))
    app.runtime().deferred.drain()
    replay.step("the last one back")
    replay.step("a stop after", hook_as(app, provider, "Stop")[1])


def pause_exits(app, replay: Replay, provider: str) -> None:
    """The steps: with a task in hand, each remaining pause is entered and left by what ends it: awaiting something outside by the agent's own tool use, being stuck by its own tool use, waiting on a question by the answer, awaiting a worker by its report, running a sequence by its last step; a stop after each shows the way back."""
    hook_as(app, provider, "SessionStart")
    console = app.console()
    console.run(["environment", "here"], AGENT)
    console.run(["task", "create", "the footer", "--start"], AGENT)
    read = lambda: hook_as(app, provider, "PreToolUse", tool_name=TOOLS[provider].read, tool_input={"file_path": "a.py", "limit": 1})[1]
    console.run(["await", "the deploy"], AGENT)
    replay.step("awaiting something outside")
    replay.step("a tool use lifts the await", read())
    replay.step("a stop back at work", hook_as(app, provider, "Stop")[1])
    console.run(["stuck", "the build is broken"], AGENT)
    replay.step("stuck")
    replay.step("a tool use lifts being stuck", read())
    console.run(["question", "ask", "which colour?", "--options", "red,blue"], AGENT)
    replay.step("waiting on a question", hook_as(app, provider, "Stop")[1])
    console.run(["question", "answer", "1", "red"], USER)
    app.runtime().deferred.drain()
    replay.step("the answer releases the wait", hook_as(app, provider, "Stop")[1])
    console.run(["worker", "dispatch", "Lady Lovelace", "write the parser", "--model", "fast"], AGENT)
    console.run(["worker", "wait", "1"], AGENT)
    replay.step("awaiting a worker", hook_as(app, provider, "Stop")[1])
    console.run(["worker", "report", "1", "parser done"], Where("main", "w1"))
    app.runtime().deferred.drain()
    replay.step("the report releases the wait", hook_as(app, provider, "Stop")[1])
    import re
    made = re.search(r"sequence (\d+)", console.run(["sequence", "create", "ship it", "--steps", "tag it | push"], USER).out).group(1)
    console.run(["sequence", "run", made], AGENT)
    replay.step("running a sequence", hook_as(app, provider, "Stop")[1])
    console.run(["sequence", "next"], AGENT)
    console.run(["sequence", "next"], AGENT)
    replay.step("the last step ends the sequence", hook_as(app, provider, "Stop")[1])


def ended_restarts(app, replay: Replay, provider: str) -> None:
    """The steps: a session with a task in hand ends, a write and a stop while ended, the same session starts again, the look, a write and a stop back at work."""
    hook_as(app, provider, "SessionStart")
    console = app.console()
    console.run(["environment", "here"], AGENT)
    console.run(["task", "create", "the footer", "--start"], AGENT)
    write = lambda: hook_as(app, provider, "PreToolUse", tool_name=TOOLS[provider].write, tool_input={"file_path": "a.py"})[1]
    ended = hook_as(app, provider, "SessionEnd")[1]
    app.runtime().deferred.drain()
    replay.step("the session ends", ended)
    replay.step("a write while ended", write())
    replay.step("a stop while ended", hook_as(app, provider, "Stop")[1])
    replay.step("the session starts again", hook_as(app, provider, "SessionStart")[1])
    console.run(["environment", "here"], AGENT)
    replay.step("looked at what is in flight")
    replay.step("a write back at work", write())
    replay.step("a stop back at work", hook_as(app, provider, "Stop")[1])


def session_starts(app, replay: Replay, provider: str) -> None:
    """The steps: the whole start block as a session starts fresh with rules, facts, reminders and a task in hand on record; a second session taking the environment over; the first starting again after a compaction, then resumed."""
    console = app.console()
    console.run(["rule", "create", "Never skip the gate", "--reason", "it broke once"], USER)
    console.run(["fact", "create", "the login is flaky"], USER)
    console.run(["reminder", "create", "tag the release"], USER)
    console.run(["task", "create", "the footer"], USER)
    console.run(["message", "send", "one"], USER)
    settled = lambda answer: (app.runtime().deferred.drain(), answer)[1]
    replay.step("a fresh start with rows on record", settled(hook_as(app, provider, "SessionStart", source="startup")[1]))
    console.run(["environment", "here"], AGENT)
    console.run(["task", "start", "1"], AGENT)
    replay.step("a second session takes the environment over", settled(hook_as(app, provider, "SessionStart", session="s2", source="startup")[1]))
    replay.step("the first starts again after a compaction", settled(hook_as(app, provider, "SessionStart", source="compact")[1]))
    console.run(["environment", "here"], AGENT)
    replay.step("the first resumed", settled(hook_as(app, provider, "SessionStart", source="resume")[1]))


def silent_session_ends(app, replay: Replay, provider: str) -> None:
    """The steps: a session with a task in hand goes quiet; the clock at a quarter of an hour, then at an hour, which ends it; a stop and a write after; the same session starting again."""
    hook_as(app, provider, "SessionStart")
    console = app.console()
    console.run(["environment", "here"], AGENT)
    console.run(["task", "create", "the footer", "--start"], AGENT)
    replay.step("a task in hand")
    tick(app, 900.0)
    app.runtime().deferred.drain()
    replay.step("quiet for a quarter of an hour")
    tick(app, 3601.0)
    app.runtime().deferred.drain()
    replay.step("quiet for an hour: the session is ended")
    replay.step("a stop while ended", hook_as(app, provider, "Stop")[1])
    replay.step("a write while ended", hook_as(app, provider, "PreToolUse", tool_name=TOOLS[provider].write, tool_input={"file_path": "a.py"})[1])
    replay.step("the session starts again", hook_as(app, provider, "SessionStart")[1])


STATE_RULES = {"plan_building": plan_building, "session_starts": session_starts, "silent_session_ends": silent_session_ends, "pause_exits": pause_exits, "ended_restarts": ended_restarts, "plan_rules": plan_rules, "awaiting_rules": awaiting_rules, "loading_skill_rules": loading_skill_rules, "orienting_rules": orienting_rules, "at_mark_rules": at_mark_rules, "working_rules": working_rules, "expecting_rules": expecting_rules, "sequence_rules": sequence_rules, "owed_pause_rules": owed_pause_rules, "waiting_rules": waiting_rules, "stuck_rules": stuck_rules}
"""What the states say of their own, frozen before any of it moves into a workflow."""


@pytest.mark.parametrize("name", sorted(STATE_RULES))
def test_a_state_rule_frozen_before_it_moves_still_holds(journals, monkeypatch, name):
    with_listener, with_workflow, provider = journals
    left = recorded(f"{name}_{provider}", with_listener, monkeypatch, STATE_RULES[name], provider, nudges=True)
    with_workflow.runtime().start()
    right = Replay(with_workflow, monkeypatch)
    STATE_RULES[name](with_workflow, right, provider)
    assert differences(left.record(), right.record(), nudges=True) == [], "the agent would have seen the same, and the record says the same"


def two_agents(app, replay: Replay, provider: str) -> None:
    """The steps: two agents in one environment, the first idle and the second awaiting a worker; a message arrives, then the worker reports."""
    hook_as(app, provider, "SessionStart")
    console = app.console()
    console.run(["environment", "here"], AGENT)
    hook_as(app, provider, "SessionStart", session="s2")
    second = Where("main", "s2")
    console.run(["environment", "here"], second)
    console.run(["task", "create", "the parser", "--start"], second)
    console.run(["worker", "dispatch", "Lady Lovelace", "write the parser", "--model", "fast"], second)
    console.run(["worker", "wait", "1"], second)
    hook_as(app, provider, "Stop")
    replay.step("one idle, one awaiting")
    console.run(["message", "send", "how is it going?"], USER)
    app.runtime().deferred.drain()
    replay.step("a message arrives")
    console.run(["worker", "report", "1", "parser done"], Where("main", "w1"))
    app.runtime().deferred.drain()
    replay.step("the worker reports")


def two_lines_on_one_write(app, replay: Replay, provider: str) -> None:
    """The steps: with the log held after two edits, a task in hand, two writes, a message read and left unanswered, then a write that is held twice over."""
    app.container.get(Settings).set("tasks.log_after", 2, Actor.system())
    hook_as(app, provider, "SessionStart")
    console = app.console()
    console.run(["environment", "here"], AGENT)
    console.run(["task", "create", "the footer", "--start"], AGENT)
    for i in (1, 2):
        replay.step(f"write {i}", hook_as(app, provider, "PreToolUse", tool_name=TOOLS[provider].write, tool_input={"file_path": "a.py"})[1])
    console.run(["message", "send", "how is it going?"], USER)
    console.run(["message", "read", "1"], AGENT)
    replay.step("a message read and owed")
    replay.step("a write held twice over", hook_as(app, provider, "PreToolUse", tool_name=TOOLS[provider].write, tool_input={"file_path": "a.py"})[1])


def test_two_agents_in_one_environment_each_walk_as_their_own_state_and_a_line_is_typed_once(journals, monkeypatch):
    with_listener, with_workflow, provider = journals
    left = recorded(f"two_agents_{provider}", with_listener, monkeypatch, two_agents, provider, nudges=True)
    with_workflow.runtime().start()
    right = Replay(with_workflow, monkeypatch)
    two_agents(with_workflow, right, provider)
    by_name = {s["name"]: s for s in left.record()}
    assert by_name["a message arrives"]["typed"] == ["[journal] new message 1"], "named once for the environment"
    assert by_name["the worker reports"]["typed"] == ["[journal] worker 1, Lady Lovelace, reported in the chat", "[journal] what you waited on came back: carry on"], "the awaiting agent is told and released, once"
    assert with_workflow.container.get(Machine).current("s2").task_id == 1 and with_workflow.container.get(Machine).current("s1").name == "idle"
    assert differences(left.record(), right.record(), nudges=True) == [], "the agent would have seen the same, and the record says the same"


def test_two_lines_on_one_write_the_first_hold_wins(journals, monkeypatch):
    with_listener, with_workflow, provider = journals
    left = recorded(f"two_lines_on_one_write_{provider}", with_listener, monkeypatch, two_lines_on_one_write, provider, nudges=True)
    with_workflow.runtime().start()
    right = Replay(with_workflow, monkeypatch)
    two_lines_on_one_write(with_workflow, right, provider)
    held = right.record()[-1]["answer"]["error"]
    assert "answer message 1 first" in held, "the hold over the unanswered message runs first in the order and wins the write"
    assert differences(left.record(), right.record(), nudges=True) == [], "the agent would have seen the same, in the same order"


def test_a_count_survives_a_stop_a_prompt_and_a_session_start(journals, monkeypatch):
    with_listener, with_workflow, provider = journals
    left = recorded(f"count_survives_events_{provider}", with_listener, monkeypatch, count_survives_events, provider, nudges=True)
    with_workflow.runtime().start()
    right = Replay(with_workflow, monkeypatch)
    count_survives_events(with_workflow, right, provider)
    by_name = {s["name"]: s for s in right.record()}
    assert "new message 1" in str(by_name["read 3, the third use since the message"]["answer"]) and "new message 1" in str(by_name["read 6, the sixth"]["answer"]), "the uses since the message are read from the record across the stop, the prompt and the session start: the third and the sixth name it"
    assert differences(left.record(), right.record(), nudges=True) == [], "the record says the same"
