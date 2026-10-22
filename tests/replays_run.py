# The replays boot a journal each and run for minutes, so they are not in the default run: python3 -m pytest tests/replays_run.py, before any commit that touches a state or a conduct; REPLAY_FREEZE=1 writes the records anew where the conduct changed on purpose.

from pathlib import Path

import pytest

from shell_verbs import ShellVerbs
from worker_dispatch import dispatched

from journal.app import App
from journal.engine.support.session_agents import SessionAgents
from journal.config import Config
from journal.support.caller import Caller
from journal.engine.state_machine import StateMachine
from journal.features.questions.support.answer_delivery import AnswerDelivery
from journal.features.workers.support.worker_runner import WorkerRunner
from journal.models.message import Message
from journal.support.actor import Actor
from journal.models.author import Author
from journal.models.setting import Setting
from journal.repositories.agents import Agents
from journal.repositories.environments import Environments
from journal.repositories.messages import Messages
from journal.repositories.questions import Questions
from journal.repositories.scope import Scope
from journal.repositories.setting_rows import SettingRows
from tests.replay import PROVIDERS, TOOLS, Replay, hook_as, pass_time, played, tick_after
from tests.test_features import AGENT, MAIN, USER, context


@pytest.fixture(params=PROVIDERS)
def journal(tmp_path: Path, monkeypatch, request):
    """One fresh journal and the provider whose agent the steps play; it starts and stops with the test."""
    monkeypatch.setattr(Config, "status_home", property(lambda self: self.root / "status"))
    monkeypatch.setattr(WorkerRunner, "start", lambda self, worker, actor: None)
    app = App(Config(tmp_path / "journal", port=0))
    app.container.get(SettingRows).save(Setting(environment_id=0, key="features.skills", value=False), Actor.system())
    app.container.get(SettingRows).save(Setting(environment_id=0, key="delivery.batch_seconds", value=0), Actor.system())
    with app.container.get(Scope).environment(MAIN):
        yield [app, request.param]
    app.runtime().stop()


def prompts_with_unread(app, replay: Replay, provider: str) -> None:
    """The steps: a session starts, messages arrive while the agent sits at its prompt, and it sends a prompt after one, after three and after four, twice."""
    hook_as(app, provider, "SessionStart")
    app.console().run(["environment", "overview"], AGENT)
    replay.step("session starts")
    for n, text in ((1, "one"), (2, "two"), (3, "three"), (4, "four")):
        app.console().run(["message", "send", text], USER)
        replay.step(f"message {n} arrives")
        if n in (1, 3, 4):
            replay.step(f"a prompt after {n}", hook_as(app, provider, "UserPromptSubmit", prompt="working")[1])
    replay.step("a prompt again after 4", hook_as(app, provider, "UserPromptSubmit", prompt="still working")[1])


def test_prompt_sent_matches_its_record(journal, monkeypatch):
    app, provider = journal
    replay, rows = played(f"prompt_sent_{provider}", app, monkeypatch, prompts_with_unread, provider, nudges=True)
    answers = [s["answer"] for s in replay.record() if s["answer"] is not None]
    assert "new message 1" in str(answers[0]) and "new messages 1, 3, 4" in str(answers[1]) and "4 messages unread" in str(answers[2]) and "unread" not in str(answers[3]), "the listener names one, a few, many, and not again inside the window"
    assert rows == [], "the agent would have seen the same, and the record says the same"


def tool_uses_with_the_inbox(app, replay: Replay, provider: str) -> None:
    """The steps: with a task in hand a message arrives; sixteen reads and a write go by unread; the message is read and a read, a journal command, a look at its files and a read after the reply follow."""
    hook_as(app, provider, "SessionStart")
    console = app.console()
    console.run(["environment", "overview"], AGENT)
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


def tool_uses_across_events(app, replay: Replay, provider: str) -> None:
    """The steps: a message arrives, two reads, a stop, a prompt, a third read that names the inbox since the count of uses survived the stop and the prompt, a session start, then three reads more, the sixth naming again."""
    hook_as(app, provider, "SessionStart")
    console = app.console()
    console.run(["environment", "overview"], AGENT)
    console.run(["message", "send", "one"], USER)
    app.runtime().deferred.drain()
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
    console.run(["environment", "overview"], AGENT)
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
    hook_as(app, provider, "SessionStart")
    console = app.console()
    console.run(["environment", "overview"], AGENT)
    tick = lambda silent: tick_after(app, silent)
    hook_as(app, provider, "Stop")
    replay.step("idle")
    for name, silent in (("a minute", 60.0), ("half an hour", 1800.0), ("half an hour again", 1800.0)):
        tick(silent)
        replay.step(f"quiet for {name}")
    console.run(["task", "create", "the footer", "--start"], AGENT)
    console.run(["task", "suspend", "1", "the header first"], AGENT)
    hook_as(app, provider, "Stop")
    replay.step("a task parked")
    for name in ("a minute with a task parked", "a minute more"):
        tick(60.0)
        replay.step(name)
    console.run(["task", "resume", "1"], AGENT)
    console.run(["await", "the deploy", "--until", "false"], AGENT)
    replay.step("awaiting the deploy")
    for name in ("five quiet minutes awaiting", "five more awaiting"):
        tick(300.0)
        replay.step(name)
    replay.step("the agent's own tool use lifts the wait", hook_as(app, provider, "PreToolUse", tool_name=TOOLS[provider].read, tool_input={"file_path": "a.py", "limit": 1})[1])


def test_clock_ticks_matches_its_record(journal, monkeypatch):
    app, provider = journal
    replay, rows = played(f"the_clock_ticks_{provider}", app, monkeypatch, the_clock_ticks, provider, nudges=True)
    name_index = {s["name"]: s for s in replay.record()}
    assert name_index["quiet for a minute"]["typed"] == [] and "nothing has happened for half an hour" in str(name_index["quiet for half an hour"]["typed"]) and name_index["quiet for half an hour again"]["typed"] == [], "the listener checks in at half an hour, once inside the window"
    assert "task 1 is still parked" in str(name_index["a minute with a task parked"]["typed"]) and name_index["a minute more"]["typed"] == [], "and asks after the parked task, once inside the window"
    assert rows == [], "the agent would have seen the same, and the record says the same"


def a_worker_reports(app, replay: Replay, provider: str) -> None:
    """The steps: two workers dispatched and awaited; one reports, the other is stopped."""
    hook_as(app, provider, "SessionStart")
    console = app.console()
    console.run(["environment", "overview"], AGENT)
    console.run(["task", "create", "the footer", "--start"], AGENT)
    dispatched(console, ["Lady Lovelace", "write the parser", "--profile", "journal-medior", "--model", "fast"], AGENT)
    dispatched(console, ["Dr. Einstein", "profile it", "--profile", "journal-medior", "--model", "fast"], AGENT)
    console.run(["worker", "wait", "1", "2"], AGENT)
    hook_as(app, provider, "Stop")
    replay.step("awaiting two workers")
    console.run(["worker", "report", "1", "parser done"], Caller.agent("main", "w1", "claude"))
    app.runtime().deferred.drain()
    replay.step("worker 1 reports")
    console.run(["worker", "stop", "2"], USER)
    app.runtime().deferred.drain()
    replay.step("worker 2 is stopped")


def a_question_is_answered(app, replay: Replay, provider: str) -> None:
    """The steps: a question asked and waited on, then answered by the user."""
    hook_as(app, provider, "SessionStart")
    console = app.console()
    console.run(["environment", "overview"], AGENT)
    console.run(["task", "create", "the footer", "--start"], AGENT)
    console.run(["question", "ask", "which colour?", "--options", "red", "blue"], AGENT)
    hook_as(app, provider, "Stop")
    replay.step("waiting on the question")
    console.run(["question", "answer", "1", "blue"], USER)
    app.runtime().deferred.drain()
    replay.step("answered")


def test_worker_reports_matches_its_record(journal, monkeypatch):
    app, provider = journal
    replay, rows = played(f"a_worker_reports_{provider}", app, monkeypatch, a_worker_reports, provider, nudges=True)
    name_index = {s["name"]: s for s in replay.record()}
    assert name_index["worker 1 reports"]["typed"] == ["[journal] worker 1, Lady Lovelace, reported in the chat"]
    stopped = name_index["worker 2 is stopped"]["typed"]
    assert stopped[0].startswith("[journal] the wait for worker 1, worker 2 is over: worker 1, Lady Lovelace, reported; worker 2, Dr. Einstein, stopped before it reported") and stopped[1] == "[journal] worker 2, Dr. Einstein, stopped before it reported" and len(stopped) == 2
    assert app.container.get(SessionAgents).top("s1").task_id == 1, "the last worker back popped the wait to the task"
    assert rows == [], "the agent would have seen the same, and the record says the same"


def test_question_answered_matches_its_record(journal, monkeypatch):
    app, provider = journal
    replay, rows = played(f"a_question_is_answered_{provider}", app, monkeypatch, a_question_is_answered, provider)
    keystrokes = replay.record()[-1]["typed"]
    assert keystrokes == ["[journal] question 1 is answered. `journal question show 1` reads it whole, with the messages linked to it; act on the answer"], "the answer is typed, and the work beneath goes on in silence"
    assert app.container.get(SessionAgents).top("s1").task_id == 1, "the wait popped back to the task"
    assert rows == [], "the agent would have seen the same; the line is on record"


def stops_with_unread(app, replay: Replay, provider: str) -> None:
    """The steps: the agent stops with one message unread, then with four."""
    hook_as(app, provider, "SessionStart")
    console = app.console()
    console.run(["environment", "overview"], AGENT)
    console.run(["message", "send", "one"], USER)
    replay.step("message 1 arrives")
    replay.step("a stop with one unread", hook_as(app, provider, "Stop")[1])
    for text in ("two", "three", "four"):
        console.run(["message", "send", text], USER)
    replay.step("three more arrive")
    replay.step("a stop with four unread", hook_as(app, provider, "Stop")[1])


def starts_with_unread(app, replay: Replay, provider: str) -> None:
    """The steps: two messages are left before any session, then a session starts."""
    console = app.console()
    console.run(["environment", "overview"], USER)
    console.run(["message", "send", "one"], USER)
    console.run(["message", "send", "two"], USER)
    replay.step("two messages wait")
    replay.step("a session starts", hook_as(app, provider, "SessionStart")[1])


def test_the_stop_workflow_carries_the_inbox_matches_its_record(journal, monkeypatch):
    app, provider = journal
    replay, rows = played(f"stops_with_unread_{provider}", app, monkeypatch, stops_with_unread, provider, nudges=True)
    name_index = {s["name"]: s for s in replay.record()}
    assert "new message 1" in str(name_index["a stop with one unread"]["answer"]) and "4 messages unread" in str(name_index["a stop with four unread"]["answer"])
    assert rows == [], "the agent would have seen the same, and the record says the same"


def test_the_start_workflow_carries_the_inbox_matches_its_record(journal, monkeypatch):
    app, provider = journal
    replay, rows = played(f"starts_with_unread_{provider}", app, monkeypatch, starts_with_unread, provider, nudges=True)
    assert "new messages 1, 2" in str(replay.record()[-1]["answer"]), "the listener names the inbox at a start"
    assert rows == [], "the agent would have seen the same, and the record says the same"


TOOL_LISTENERS = ("HoldUnread", "HoldUnanswered", "LogCadence")


def tool_uses_with_changed_settings(app, replay: Replay, provider: str) -> None:
    """The steps, with the cadences changed: the answer asked for after two uses and held after four; the task named every two edits, the log asked for at three and held at six."""
    settings = app.container.get(SettingRows)
    for key, value in (("messages.nudge_after", 2), ("messages.hold_after", 4), ("tasks.name_every", 2), ("tasks.first_nudge_after", 3), ("tasks.log_after", 6)):
        settings.set(key, value, Actor.system())
    hook_as(app, provider, "SessionStart")
    console = app.console()
    console.run(["environment", "overview"], AGENT)
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


def test_changed_settings_keep_their_meaning_in_the_tool_workflow(journal, monkeypatch):
    app, provider = journal
    replay, rows = played(f"tool_uses_with_changed_settings_{provider}", app, monkeypatch, tool_uses_with_changed_settings, provider, nudges=True)
    name_index = {s["name"]: s for s in replay.record()}
    assert name_index["read 1 while owed"]["answer"] == {} and "wait for your answer to message 1: 1" in str(name_index["read 2 while owed"]["answer"]) and "your next tool call waits for your answer to message 1" in str(name_index["read 3 while owed"]["answer"]), "with the setting changed, the countdown starts later and still ends on the last use"
    assert "error" in name_index["read 4 while owed"]["answer"] and "error" in name_index["read 5 while owed"]["answer"], "and holds after four"
    assert "in hand, 2 edits" in str(name_index["write 3"]["answer"]) and "3 edits since you logged task 1: say where it stands" in str(name_index["write 4"]["answer"]) and "in hand, 4 edits" in str(name_index["write 5"]["answer"]) and name_index["write 6"]["answer"] == {} and "error" in name_index["write 7"]["answer"], "the task is named every two edits, the log asked at three and held at six"
    assert rows == [], "the agent would have seen the same, and the record says the same"


def test_tool_about_to_run_matches_its_record_on_the_inbox(journal, monkeypatch):
    app, provider = journal
    replay, rows = played(f"tool_uses_with_the_inbox_{provider}", app, monkeypatch, tool_uses_with_the_inbox, provider, nudges=True)
    name_index = {s["name"]: s for s in replay.record()}
    assert "wait for message 1: 3" in str(name_index["read 1"]["answer"]) and "wait for message 1: 1" in str(name_index["read 3"]["answer"]) and "your next write waits for message 1" in str(name_index["read 4"]["answer"]), "each tool use counts down the uses left before the writes wait, then names the hold"
    assert "you have 1 unread messages" in str(name_index["a write at 17"]["answer"]), "and holds the write after five namings"
    assert name_index["a read while owed"]["answer"] == {} and name_index["a journal command while owed"]["answer"] == {} and name_index["a look at its files"]["answer"] == {} and name_index["a read after the reply"]["answer"] == {}, "a read message has its grace of five uses before a word is asked for"
    assert rows == [], "the agent would have seen the same, and the record says the same"


def test_tool_about_to_run_matches_its_record_on_the_log_cadence(journal, monkeypatch):
    app, provider = journal
    replay, rows = played(f"writes_over_the_log_{provider}", app, monkeypatch, writes_over_the_log, provider, nudges=True)
    name_index = {s["name"]: s for s in replay.record()}
    assert "25 edits since you logged task 1" in str(name_index["write 26"]["answer"]) and name_index["write 27"]["answer"] == {}, "the listener asks for a log at the first threshold"
    assert "50 edits since you logged task 1" in str(name_index["write 51 after the log"]["answer"]) and "error" in name_index["write 51 after the log"]["answer"], "and holds the write when the log is overdue"
    assert rows == [], "the agent would have seen the same, and the record says the same"


def message_arrives(app, replay: Replay, provider: str) -> None:
    """The steps: a session starts, the user leaves a message while the agent sits at its prompt."""
    hook_as(app, provider, "SessionStart")
    app.console().run(["environment", "overview"], AGENT)
    replay.step("session starts")
    app.console().run(["message", "send", "are you there?"], USER)
    replay.step("a message arrives")


def test_message_arrives_matches_its_record(journal, monkeypatch):
    app, provider = journal
    replay, rows = played(f"message_arrives_{provider}", app, monkeypatch, message_arrives, provider, nudges=True)
    assert replay.record()[-1]["typed"] == ["[journal] new message 1"], "the listener names the message"
    assert rows == [], "the agent would have seen the same, and the record says the same"


def the_phone_talks(app, replay: Replay, provider: str) -> None:
    """The steps: a session starts, the paired phone leaves a message, the agent asks a question and the phone answers it, through what the phone's forwarded requests reach."""
    phone = Actor.phone(1)
    hook_as(app, provider, "SessionStart")
    console = app.console()
    console.run(["environment", "overview"], AGENT)
    replay.step("session starts")
    app.container.get(Messages).save(Message(author=Author.USER, text="from the train"), phone)
    replay.step("the phone leaves a message")
    console.run(["task", "create", "the footer", "--start"], AGENT)
    console.run(["question", "ask", "which colour?", "--options", "red", "blue"], AGENT)
    hook_as(app, provider, "Stop")
    replay.step("waiting on the question")
    app.container.get(AnswerDelivery).answer(app.container.get(Questions).find(1), "blue", phone)
    app.runtime().deferred.drain()
    replay.step("the phone answers")


def test_the_phone_is_heard_as_the_user_is(journal, monkeypatch):
    app, provider = journal
    replay, rows = played(f"the_phone_talks_{provider}", app, monkeypatch, the_phone_talks, provider, nudges=True)
    name_index = {s["name"]: s for s in replay.record()}
    assert name_index["the phone leaves a message"]["typed"] == ["[journal] new message 1"], "a message from the phone is named as the user's is"
    assert "question 1 is answered" in str(name_index["the phone answers"]["typed"]), "and an answer from the phone releases the wait"
    assert app.container.get(SessionAgents).top("s1").task_id == 1, "the agent is working its task again"
    assert rows == [], "the agent would have seen the same, and the record says the same"


def tick(app, silent: float) -> None:
    """A tick as the clock gives it, dispatched to every listener; the machine types what a state says on it."""
    tick_after(app, silent)


def working_rules(app, replay: Replay, provider: str) -> None:
    """The steps: a task in hand, then a stop, a session starting again and a quarter of an hour's quiet: what the Working state says of its own."""
    hook_as(app, provider, "SessionStart")
    console = app.console()
    console.run(["environment", "overview"], AGENT)
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
    console.run(["environment", "overview"], AGENT)
    console.run(["task", "create", "the footer", "--start"], AGENT)
    console.run(["await", "the deploy", "--until", "false"], AGENT)
    replay.step("awaiting the deploy")
    for name in ("five quiet minutes", "five more"):
        tick(app, 330.0)
        replay.step(name)
    replay.step("a tool use lifts the wait", hook_as(app, provider, "PreToolUse", tool_name=TOOLS[provider].read, tool_input={"file_path": "a.py", "limit": 1})[1])


def sequence_rules(app, replay: Replay, provider: str) -> None:
    """The steps: a sequence of two steps run; a write before the step is taken up, a stop after a tool use, the step followed and a write, then a stop at step two."""
    hook_as(app, provider, "SessionStart")
    console = app.console()
    console.run(["environment", "overview"], AGENT)
    produced = console.run(["sequence", "create", "ship it", "--steps", "tag it | push"], USER).text.split()[1].rstrip(":")
    console.run(["sequence", "run", produced], AGENT)
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
    console.run(["environment", "overview"], AGENT)
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
    replay.step("the last step refused before the plan is ready", {"err": console.run(["sequence", "next"], AGENT).error})
    console.run(["plan", "ready", "1"], AGENT)
    replay.step("the last step once it is ready", {"out": console.run(["sequence", "next"], AGENT).text})


def owed_pause_rules(app, replay: Replay, provider: str) -> None:
    """The steps: a stop before the agent has looked at what is in flight, then a context mark reached and a stop under it."""
    hook_as(app, provider, "SessionStart")
    replay.step("a stop before orienting", hook_as(app, provider, "Stop")[1])
    app.console().run(["environment", "overview"], AGENT)
    context(app, 95)
    replay.step("a tool use at the mark", hook_as(app, provider, "PreToolUse", tool_name=TOOLS[provider].read, tool_input={"file_path": "a.py", "limit": 1})[1])
    replay.step("a stop under the mark", hook_as(app, provider, "Stop")[1])


def waiting_rules(app, replay: Replay, provider: str) -> None:
    """The steps: a question asked and waited on, then a prompt from the user's side while it waits."""
    hook_as(app, provider, "SessionStart")
    console = app.console()
    console.run(["environment", "overview"], AGENT)
    console.run(["task", "create", "the footer", "--start"], AGENT)
    console.run(["question", "ask", "which colour?", "--options", "red", "blue"], AGENT)
    replay.step("waiting on the question")
    replay.step("a prompt while waiting", hook_as(app, provider, "UserPromptSubmit", prompt="carry on with the rest")[1])


def stuck_rules(app, replay: Replay, provider: str) -> None:
    """The steps: a task in hand, the agent declares itself stuck, stops, then works again."""
    hook_as(app, provider, "SessionStart")
    console = app.console()
    console.run(["environment", "overview"], AGENT)
    console.run(["task", "create", "the footer", "--start"], AGENT)
    console.run(["stuck", "the build is broken"], AGENT)
    replay.step("stuck")
    replay.step("a stop while stuck", hook_as(app, provider, "Stop")[1])
    replay.step("a tool use while stuck", hook_as(app, provider, "PreToolUse", tool_name=TOOLS[provider].read, tool_input={"file_path": "a.py", "limit": 1})[1])


def read_skill(app, provider: str, folder: str):
    return hook_as(app, provider, "PostToolUse", tool_name=TOOLS[provider].read, tool_input={"file_path": str(app.config.root / f".claude/skills/{folder}/SKILL.md")}, tool_response="")[1]


def loading_skill_rules(app, replay: Replay, provider: str) -> None:
    """The steps, with the skills on: a session starts and requires the journal skill, a write is held until the file is read, the start's look follows; a message arrives and a prompt naming plans requires that skill, the inbox named under the hold, a write held until the file is read, then allowed."""
    app.container.get(SettingRows).save(Setting(environment_id=0, key="features.skills", value=True), Actor.system())
    write = lambda: hook_as(app, provider, "PreToolUse", tool_name=TOOLS[provider].write, tool_input={"file_path": "a.py"})[1]
    replay.step("the session starts", hook_as(app, provider, "SessionStart")[1])
    replay.step("a write before the skill is read", write())
    replay.step("the journal skill read", read_skill(app, provider, "journal"))
    replay.step("a write before the look", write())
    app.console().run(["environment", "overview"], AGENT)
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
    app.console().run(["environment", "overview"], AGENT)
    replay.step("looked at what is in flight")
    replay.step("a write after the look", write())
    app.console().run(["task", "create", "t", "--start"], AGENT)
    app.console().run(["message", "send", "hi"], USER)
    replay.step("the session starts again after a compaction", hook_as(app, provider, "SessionStart", source="compact")[1])
    replay.step("a write before the second look", write())
    app.console().run(["environment", "overview"], AGENT)
    replay.step("looked again")
    replay.step("a write after the second look", write())


def at_mark_rules(app, replay: Replay, provider: str) -> None:
    """The steps: with a task in hand the context crosses the first mark, a read is told, a write is held, a fact recorded lets it through and the mark asks once; the context crosses the second mark at a stop, and nothing survives lets it through."""
    hook_as(app, provider, "SessionStart")
    app.console().run(["environment", "overview"], AGENT)
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
    app.console().run(["memory", "skip", "all logged"], AGENT)
    replay.step("nothing survives")
    replay.step("a write after", write())


def plan_rules(app, replay: Replay, provider: str) -> None:
    """The steps: a plan of two phases, the first a checkpoint, approved and started; its first task done, a stop with auto off then on, the next phase started, a second session starting under the plan, the plan parked, then a second plan started and cancelled."""
    hook_as(app, provider, "SessionStart")
    console = app.console()
    console.run(["environment", "overview"], AGENT)
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
    console.run(["task", "complete", "1"], AGENT)
    app.runtime().deferred.drain()
    replay.step("the first task is done, the phase a checkpoint")
    app.container.get(SettingRows).save(Setting(environment_id=0, key="tasks.auto", value=False), Actor.system())
    replay.step("a stop at the checkpoint, auto off", hook_as(app, provider, "Stop")[1])
    app.container.get(SettingRows).save(Setting(environment_id=0, key="tasks.auto", value=True), Actor.system())
    replay.step("a stop at the checkpoint, auto on", hook_as(app, provider, "Stop")[1])
    console.run(["plan", "start", "1"], AGENT)
    replay.step("the next phase started")
    replay.step("a second session starts under the plan", hook_as(app, provider, "SessionStart", session="s2")[1])
    console.run(["plan", "suspend", "1"], AGENT)
    app.runtime().deferred.drain()
    replay.step("the plan is parked")
    console.run(["plan", "create", "q", "--brief", "b"], USER)
    console.run(["plan", "add", "2", "third"], USER)
    console.run(["plan", "ready", "2"], USER)
    console.run(["plan", "approve", "2"], USER)
    console.run(["plan", "start", "2"], Caller.agent("main", "s2", provider))
    console.run(["plan", "cancel", "2"], USER)
    app.runtime().deferred.drain()
    replay.step("a second plan started and cancelled")
    replay.step("a stop after", hook_as(app, provider, "Stop")[1])


def awaiting_rules(app, replay: Replay, provider: str) -> None:
    """The steps: two workers dispatched and awaited; a stop while awaiting; the first reports and the agent still waits; the last reports and the agent is released; a stop after."""
    hook_as(app, provider, "SessionStart")
    console = app.console()
    console.run(["environment", "overview"], AGENT)
    console.run(["task", "create", "the footer", "--start"], AGENT)
    dispatched(console, ["Lady Lovelace", "write the parser", "--profile", "journal-medior", "--model", "fast"], AGENT)
    dispatched(console, ["Dr. Einstein", "profile it", "--profile", "journal-medior", "--model", "fast"], AGENT)
    console.run(["worker", "wait", "1", "2"], AGENT)
    replay.step("awaiting two workers", hook_as(app, provider, "Stop")[1])
    console.run(["worker", "report", "1", "parser done"], Caller.agent("main", "w1", "claude"))
    app.runtime().deferred.drain()
    replay.step("the first reports", hook_as(app, provider, "Stop")[1])
    console.run(["worker", "report", "2", "profiled"], Caller.agent("main", "w2", "claude"))
    app.runtime().deferred.drain()
    replay.step("the last one back")
    replay.step("a stop after", hook_as(app, provider, "Stop")[1])


def pause_exits(app, replay: Replay, provider: str) -> None:
    """The steps: with a task in hand, each remaining pause is entered and left by what ends it: awaiting something outside by the agent's own tool use, being stuck by its own tool use, waiting on a question by the answer, awaiting a worker by its report, running a sequence by its last step; a stop after each shows the way back."""
    hook_as(app, provider, "SessionStart")
    console = app.console()
    console.run(["environment", "overview"], AGENT)
    console.run(["task", "create", "the footer", "--start"], AGENT)
    read = lambda: hook_as(app, provider, "PreToolUse", tool_name=TOOLS[provider].read, tool_input={"file_path": "a.py", "limit": 1})[1]
    console.run(["await", "the deploy", "--until", "false"], AGENT)
    replay.step("awaiting something outside")
    replay.step("a tool use lifts the await", read())
    replay.step("a stop back at work", hook_as(app, provider, "Stop")[1])
    console.run(["stuck", "the build is broken"], AGENT)
    replay.step("stuck")
    replay.step("a tool use lifts being stuck", read())
    console.run(["question", "ask", "which colour?", "--options", "red", "blue"], AGENT)
    replay.step("waiting on a question", hook_as(app, provider, "Stop")[1])
    console.run(["question", "answer", "1", "red"], USER)
    app.runtime().deferred.drain()
    replay.step("the answer releases the wait", hook_as(app, provider, "Stop")[1])
    dispatched(console, ["Lady Lovelace", "write the parser", "--profile", "journal-medior", "--model", "fast"], AGENT)
    console.run(["worker", "wait", "1"], AGENT)
    replay.step("awaiting a worker", hook_as(app, provider, "Stop")[1])
    console.run(["worker", "report", "1", "parser done"], Caller.agent("main", "w1", "claude"))
    app.runtime().deferred.drain()
    replay.step("the report releases the wait", hook_as(app, provider, "Stop")[1])
    import re
    produced = re.search(r"sequence (\d+)", console.run(["sequence", "create", "ship it", "--steps", "tag it | push"], USER).text).group(1)
    console.run(["sequence", "run", produced], AGENT)
    replay.step("running a sequence", hook_as(app, provider, "Stop")[1])
    console.run(["sequence", "next"], AGENT)
    console.run(["sequence", "next"], AGENT)
    replay.step("the last step ends the sequence", hook_as(app, provider, "Stop")[1])


def ended_restarts(app, replay: Replay, provider: str) -> None:
    """The steps: a session with a task in hand ends, a write and a stop while ended, the same session starts again, the look, a write and a stop back at work."""
    hook_as(app, provider, "SessionStart")
    console = app.console()
    console.run(["environment", "overview"], AGENT)
    console.run(["task", "create", "the footer", "--start"], AGENT)
    write = lambda: hook_as(app, provider, "PreToolUse", tool_name=TOOLS[provider].write, tool_input={"file_path": "a.py"})[1]
    ended = hook_as(app, provider, "SessionEnd")[1]
    app.runtime().deferred.drain()
    replay.step("the session ends", ended)
    replay.step("a write while ended", write())
    replay.step("a stop while ended", hook_as(app, provider, "Stop")[1])
    replay.step("the session starts again", hook_as(app, provider, "SessionStart")[1])
    console.run(["environment", "overview"], AGENT)
    replay.step("looked at what is in flight")
    replay.step("a write back at work", write())
    replay.step("a stop back at work", hook_as(app, provider, "Stop")[1])


def session_starts(app, replay: Replay, provider: str) -> None:
    """The steps: the whole start block as a session starts fresh with rules, facts, reminders and a task in hand on record; a second session taking the environment over, which ends the first; the first starting again after a compaction, then resumed."""
    console = app.console()
    console.run(["rule", "create", "Never skip the gate", "--reason", "it broke once"], USER)
    console.run(["fact", "create", "the login is flaky"], USER)
    console.run(["reminder", "create", "tag the release"], USER)
    console.run(["task", "create", "the footer"], USER)
    console.run(["message", "send", "one"], USER)
    resolved = lambda answer: (app.runtime().deferred.drain(), answer)[1]
    replay.step("a fresh start with rows on record", resolved(hook_as(app, provider, "SessionStart", source="startup")[1]))
    console.run(["environment", "overview"], AGENT)
    console.run(["task", "start", "1"], AGENT)
    replay.step("a second session takes the environment over", resolved(hook_as(app, provider, "SessionStart", session="s2", source="startup")[1]))
    replay.step("the first starts again after a compaction", resolved(hook_as(app, provider, "SessionStart", source="compact")[1]))
    console.run(["environment", "overview"], AGENT)
    replay.step("the first resumed", resolved(hook_as(app, provider, "SessionStart", source="resume")[1]))


def silent_session_ends(app, replay: Replay, provider: str) -> None:
    """The steps: a session with a task in hand goes quiet; the clock at a quarter of an hour, then at an hour, which ends it; a stop and a write after; the same session starting again."""
    hook_as(app, provider, "SessionStart")
    console = app.console()
    console.run(["environment", "overview"], AGENT)
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


@pytest.mark.parametrize("name", sorted(STATE_RULES))
def test_a_states_conduct_matches_its_record(journal, monkeypatch, name):
    app, provider = journal
    replay, rows = played(f"{name}_{provider}", app, monkeypatch, STATE_RULES[name], provider, nudges=True)
    assert rows == [], "the agent would have seen the same, and the record says the same"


def still_open_after_quiet(app, replay: Replay, provider: str) -> None:
    """The steps: a task in hand, the agent stops, and the clock finds it quiet for a quarter of an hour, then longer."""
    hook_as(app, provider, "SessionStart")
    console = app.console()
    console.run(["environment", "overview"], AGENT)
    console.run(["task", "create", "the footer", "--start"], AGENT)
    hook_as(app, provider, "Stop")
    replay.step("stopped with a task in hand")
    for name, silent in (("fourteen quiet minutes", 840.0), ("sixteen quiet minutes", 960.0), ("twenty quiet minutes", 1200.0)):
        tick(app, silent)
        app.runtime().deferred.drain()
        replay.step(name)


def blocked_after_an_hour(app, replay: Replay, provider: str) -> None:
    """The steps: a blocked task nothing opens by itself, the agent idle, the clock at most of an hour and past it."""
    hook_as(app, provider, "SessionStart")
    console = app.console()
    console.run(["environment", "overview"], AGENT)
    console.run(["task", "create", "the footer", "--start"], AGENT)
    console.run(["task", "block", "1", "the designer's answer"], AGENT)
    hook_as(app, provider, "Stop")
    replay.step("a task blocked, the agent idle")
    for name, silent in (("fifty quiet minutes", 3000.0), ("an hour and a minute", 3660.0)):
        tick(app, silent)
        app.runtime().deferred.drain()
        replay.step(name)


def meanwhile_while_waiting(app, replay: Replay, provider: str) -> None:
    """The steps: in auto mode, an open task beside the one in hand, the agent waits on something outside and the clock ticks past a minute."""
    hook_as(app, provider, "SessionStart")
    console = app.console()
    console.run(["environment", "overview"], AGENT)
    console.run(["task", "create", "the footer", "--start"], AGENT)
    console.run(["task", "create", "the header"], AGENT)
    console.run(["await", "the build", "--until", "false"], AGENT)
    replay.step("waiting on the build")
    for name, silent in (("half a minute", 30.0), ("a minute and a half", 90.0), ("two minutes", 120.0)):
        tick(app, silent)
        app.runtime().deferred.drain()
        replay.step(name)


def background_every_five_minutes(app, replay: Replay, provider: str) -> None:
    """The steps: a command moves to the background, the clock passes five and ten minutes of it, it ends, and the clock ticks again."""
    hook_as(app, provider, "SessionStart")
    console = app.console()
    console.run(["environment", "overview"], AGENT)
    folder = app.config.root / "c7"
    folder.mkdir()
    ShellVerbs(app).split("pytest -q", str(folder))
    ShellVerbs(app).moved("c7", "pytest -q", str(folder / "out"))
    replay.step("a command in the background")
    for name, silent in (("four minutes", 240.0), ("five minutes and some", 310.0), ("ten minutes and some", 610.0)):
        tick(app, silent)
        app.runtime().deferred.drain()
        replay.step(name)
    ShellVerbs(app).ended("c7", 0, str(folder / "out"))
    replay.step("it ended")
    tick(app, 910.0)
    app.runtime().deferred.drain()
    replay.step("fifteen minutes, nothing running")


def log_ask_at_stop_and_start(app, replay: Replay, provider: str) -> None:
    """The steps: a task taken in hand, a stop at once, a stop and a start eleven minutes later, a log, and a stop just after it."""
    hook_as(app, provider, "SessionStart")
    console = app.console()
    console.run(["environment", "overview"], AGENT)
    console.run(["task", "create", "the footer", "--start"], AGENT)
    replay.step("a stop just after the start", hook_as(app, provider, "Stop")[1])
    pass_time(app, 660.0)
    replay.step("a stop eleven minutes on", hook_as(app, provider, "Stop")[1])
    replay.step("a start eleven minutes on", hook_as(app, provider, "SessionStart", source="resume")[1])
    console.run(["task", "log", "1", "the margin is fixed"], AGENT)
    replay.step("a stop just after the log", hook_as(app, provider, "Stop")[1])


def line_reminder(app, replay: Replay, provider: str) -> None:
    """The steps, with the reminder every three lines: messages arrive and are named, and the agent's own tool uses come after."""
    app.container.get(SettingRows).set("etiquette.remind_every", 3, Actor.system())
    hook_as(app, provider, "SessionStart")
    console = app.console()
    console.run(["environment", "overview"], AGENT)
    for n in range(1, 5):
        console.run(["message", "send", f"note {n}"], USER)
        replay.step(f"message {n}", hook_as(app, provider, "PostToolUse", tool_name=TOOLS[provider].read, tool_input={"file_path": "a.py"})[1])


def hold_after_namings(app, replay: Replay, provider: str) -> None:
    """The steps, the unread named every use and a write held after two namings: a message waits unread while the agent writes."""
    settings = app.container.get(SettingRows)
    for key, value in (("messages.remind_every", 1), ("messages.hold_after_reminders", 2)):
        settings.set(key, value, Actor.system())
    hook_as(app, provider, "SessionStart")
    console = app.console()
    console.run(["environment", "overview"], AGENT)
    console.run(["task", "create", "the footer", "--start"], AGENT)
    console.run(["message", "send", "are you there?"], USER)
    for i in range(1, 5):
        replay.step(f"write {i} with the message unread", hook_as(app, provider, "PreToolUse", tool_name=TOOLS[provider].write, tool_input={"file_path": "a.py"})[1])


def a_subagents_tool_use(app, replay: Replay, provider: str) -> None:
    """The steps, the unread named every use: a subagent's tool uses and writes are not the agent's, and the agent's own are."""
    app.container.get(SettingRows).set("messages.remind_every", 1, Actor.system())
    hook_as(app, provider, "SessionStart")
    console = app.console()
    console.run(["environment", "overview"], AGENT)
    console.run(["task", "create", "the footer", "--start"], AGENT)
    console.run(["message", "send", "are you there?"], USER)
    for i in range(1, 3):
        replay.step(f"the subagent's write {i}", hook_as(app, provider, "PreToolUse", tool_name=TOOLS[provider].write, tool_input={"file_path": "a.py"}, agent_id="sub1")[1])
    replay.step("the agent's own read", hook_as(app, provider, "PreToolUse", tool_name=TOOLS[provider].read, tool_input={"file_path": "a.py"})[1])


CONDUCT_RULES = {"still_open_after_quiet": still_open_after_quiet, "blocked_after_an_hour": blocked_after_an_hour, "meanwhile_while_waiting": meanwhile_while_waiting, "background_every_five_minutes": background_every_five_minutes,
                "log_ask_at_stop_and_start": log_ask_at_stop_and_start, "line_reminder": line_reminder, "hold_after_namings": hold_after_namings, "a_subagents_tool_use": a_subagents_tool_use}


@pytest.mark.parametrize("name", sorted(CONDUCT_RULES))
def test_a_conduct_matches_its_record(journal, monkeypatch, name):
    app, provider = journal
    replay, rows = played(f"{name}_{provider}", app, monkeypatch, CONDUCT_RULES[name], provider, nudges=True)
    assert rows == [], "the agent would have seen the same, and the record says the same"


def two_agents(app, replay: Replay, provider: str) -> None:
    """The steps: a second session starts in the environment of the first, which it ends, and awaits a worker; a message arrives, then the worker reports."""
    hook_as(app, provider, "SessionStart")
    console = app.console()
    console.run(["environment", "overview"], AGENT)
    hook_as(app, provider, "SessionStart", session="s2")
    second = Caller.agent("main", "s2", "claude")
    console.run(["environment", "overview"], second)
    console.run(["task", "create", "the parser", "--start"], second)
    dispatched(console, ["Lady Lovelace", "write the parser", "--profile", "journal-medior", "--model", "fast"], second)
    console.run(["worker", "wait", "1"], second)
    hook_as(app, provider, "Stop")
    replay.step("one idle, one awaiting")
    console.run(["message", "send", "how is it going?"], USER)
    app.runtime().deferred.drain()
    replay.step("a message arrives")
    console.run(["worker", "report", "1", "parser done"], Caller.agent("main", "w1", "claude"))
    app.runtime().deferred.drain()
    replay.step("the worker reports")


def two_lines_on_one_write(app, replay: Replay, provider: str) -> None:
    """The steps: with the log held after two edits and a read message at the first use, a task in hand, two writes, a message read and left unanswered, then a write that is held twice over."""
    app.container.get(SettingRows).set("tasks.log_after", 2, Actor.system())
    app.container.get(SettingRows).set("messages.hold_after", 0, Actor.system())
    hook_as(app, provider, "SessionStart")
    console = app.console()
    console.run(["environment", "overview"], AGENT)
    console.run(["task", "create", "the footer", "--start"], AGENT)
    for i in (1, 2):
        replay.step(f"write {i}", hook_as(app, provider, "PreToolUse", tool_name=TOOLS[provider].write, tool_input={"file_path": "a.py"})[1])
    console.run(["message", "send", "how is it going?"], USER)
    console.run(["message", "read", "1"], AGENT)
    replay.step("a message read and owed")
    replay.step("a write held twice over", hook_as(app, provider, "PreToolUse", tool_name=TOOLS[provider].write, tool_input={"file_path": "a.py"})[1])


def test_a_second_session_in_one_environment_takes_the_first_ones_place_and_a_line_is_typed_once(journal, monkeypatch):
    app, provider = journal
    replay, rows = played(f"two_agents_{provider}", app, monkeypatch, two_agents, provider, nudges=True)
    name_index = {s["name"]: s for s in replay.record()}
    assert name_index["a message arrives"]["typed"] == ["[journal] new message 3"], "named once for the environment; message 1 is the worker's card and 2 the job in the worker's own chat"
    reported = name_index["the worker reports"]["typed"]
    assert reported[0].startswith("[journal] the wait for worker 1 is over: worker 1, Lady Lovelace, reported") and reported[1] == "[journal] worker 1, Lady Lovelace, reported in the chat" and len(reported) == 2, "the awaiting agent is told and released, once"
    assert app.container.get(SessionAgents).top("s2").task_id == 1 and app.container.get(SessionAgents).top("s1").name == "ended", "an environment keeps one session: the second took the first one's place"
    assert rows == [], "the agent would have seen the same, and the record says the same"


def test_two_lines_on_one_write_the_first_hold_wins(journal, monkeypatch):
    app, provider = journal
    replay, rows = played(f"two_lines_on_one_write_{provider}", app, monkeypatch, two_lines_on_one_write, provider, nudges=True)
    blocked = replay.record()[-1]["answer"]["error"]
    assert "answer or react to message 1 first" in blocked, "the hold over the unanswered message runs first in the order and wins the write"
    assert rows == [], "the agent would have seen the same, in the same order"


def test_the_inbox_is_named_on_the_third_tool_use_across_a_stop_a_prompt_and_a_start(journal, monkeypatch):
    app, provider = journal
    replay, rows = played(f"count_survives_events_{provider}", app, monkeypatch, tool_uses_across_events, provider, nudges=True)
    name_index = {s["name"]: s for s in replay.record()}
    assert "wait for message 1: 1" in str(name_index["read 3, the third use since the message"]["answer"]) and "your next write waits for message 1" in str(name_index["read 4"]["answer"]), "the uses since the message are counted across the stop, the prompt and the session start: the third is the last left, the fourth names the hold"
    assert rows == [], "the record says the same"


GIT_AT = {"GIT_AUTHOR_DATE": "2026-01-01T00:00:00Z", "GIT_COMMITTER_DATE": "2026-01-01T00:00:00Z"}


def project_with_git(app) -> Path:
    """The journal's project made a git repository with one commit, as a project with worktrees is."""
    root = app.config.root
    for argv in (["init", "-q", "-b", "trunk"], ["config", "user.email", "t@example.com"], ["config", "user.name", "T"]):
        git_at(root, *argv)
    (root / ".gitignore").write_text(".journal/\n.claude/\nstatus/\n")
    git_at(root, "add", ".gitignore")
    git_at(root, "commit", "-qm", "start")
    return root


def git_at(folder: Path, *argv: str) -> None:
    import os
    import subprocess
    subprocess.run(["git", *argv], cwd=folder, capture_output=True, timeout=30, env={**os.environ, **GIT_AT})


def session_in_a_worktree(app, replay: Replay, provider: str) -> None:
    """The steps: the environment's worktree is made, a session starts in it, the agent looks, writes inside the worktree and commits there with a trailer, then a merge lands the commit."""
    from journal.support.worktree import Worktree
    tree = Worktree(project_with_git(app), "main").created()
    replay.step("session starts in the worktree", hook_as(app, provider, "SessionStart")[1])
    app.console().run(["environment", "overview"], AGENT)
    app.console().run(["task", "create", "the page", "--start"], AGENT)
    replay.step("a write inside the worktree", hook_as(app, provider, "PreToolUse", tool_name=TOOLS[provider].write, tool_input={"file_path": str(tree / "page.py"), "content": "PAGE = 1"})[1])
    (tree / "page.py").write_text("PAGE = 1\n")
    git_at(tree, "add", "page.py")
    git_at(tree, "commit", "-qm", "the page\n\nJournal: tasks done 1")
    replay.step("a commit in the worktree", hook_as(app, provider, "PostToolUse", tool_name=TOOLS[provider].shell, tool_input={"command": "git commit -m 'the page'"}, tool_response={})[1])
    git_at(app.config.root, "merge", "-q", "worktree-main")
    replay.step("the merge that lands it", hook_as(app, provider, "PostToolUse", tool_name=TOOLS[provider].shell, tool_input={"command": "git merge worktree-main"}, tool_response={})[1])


def test_a_session_in_a_worktree_works_its_environment_and_its_commit_closes_its_task_when_merged(journal, monkeypatch):
    from journal.repositories.messages import Messages
    from journal.repositories.tasks import Tasks
    app, provider = journal
    replay, rows = played(f"session_in_a_worktree_{provider}", app, monkeypatch, session_in_a_worktree, provider, nudges=True)
    app.runtime().deferred.drain()
    name_index = {s["name"]: s for s in replay.record()}
    assert "error" not in name_index["a write inside the worktree"]["answer"], "the agent's own worktree is its to write in"
    assert "task 1" in str(name_index["the merge that lands it"]["answer"]) and app.container.get(Tasks).find(1).state.value == "done", "the trailer closes its task when the merge lands it"
    assert any(m.text.startswith("Working in the worktree main, on the branch worktree-main") for m in app.container.get(Messages).recent(30)), "the session is marked with its worktree and branch"
    assert rows == [], "the record says the same"


def worker_worktree_kept_out(app, replay: Replay, provider: str) -> None:
    """The steps: a worker is dispatched with a worktree, the agent tries to write in it, a subagent writes in a worktree of its own, and the agent writes in the project."""
    root = project_with_git(app)
    hook_as(app, provider, "SessionStart")
    app.console().run(["environment", "overview"], AGENT)
    app.console().run(["task", "create", "the parser", "--start"], AGENT)
    dispatched(app.console(), ["Lady Lovelace", "write the parser", "--profile", "journal-medior", "--model", "sonnet", "--worktree", "--no-libraries"], AGENT)
    replay.step("the worker is out")
    contained = app.config.home / "worktrees" / "1-Lady-Lovelace" / "parser.py"
    replay.step("a write in the worker's worktree", hook_as(app, provider, "PreToolUse", tool_name=TOOLS[provider].write, tool_input={"file_path": str(contained), "content": "x"})[1])
    isolated = root / ".claude" / "worktrees" / "agent-a1b2" / "a.py"
    hook_as(app, provider, "SubagentStart", agent_id="a1b2", agent_type="Explore")
    replay.step("a subagent writes in its own worktree", hook_as(app, provider, "PreToolUse", agent_id="a1b2", cwd=str(isolated.parent), tool_name=TOOLS[provider].write, tool_input={"file_path": str(isolated), "content": "x"})[1])
    hook_as(app, provider, "SubagentStop", agent_id="a1b2")
    replay.step("a write in the project", hook_as(app, provider, "PreToolUse", tool_name=TOOLS[provider].write, tool_input={"file_path": str(root / "elsewhere.py"), "content": "x"})[1])


def test_a_workers_worktree_is_its_own_and_a_subagents_worktree_never_moves_the_main_conversation(journal, monkeypatch):
    app, provider = journal
    replay, rows = played(f"worker_worktree_kept_out_{provider}", app, monkeypatch, worker_worktree_kept_out, provider, nudges=True)
    name_index = {s["name"]: s for s in replay.record()}
    assert "worker 1's worktree" in name_index["a write in the worker's worktree"]["answer"]["error"], "the worker's worktree is refused to the agent, with how to work there"
    assert "error" not in name_index["a subagent writes in its own worktree"]["answer"] and "error" not in name_index["a write in the project"]["answer"]
    stack = [layer["state"] for layer in app.container.get(Agents).session_agent("s1").stack]
    assert stack == ["idle", "working"], "the agent's own write lifted the wait on its worker; the subagent's worktree never moved the main conversation"
    assert rows == [], "the record says the same"
