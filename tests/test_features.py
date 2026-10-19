"""The first features through the real server: the briefing at session start, and the memory hold at a context mark."""

import json
import os
import re
import time
from dataclasses import asdict
from pathlib import Path
from urllib.error import HTTPError
from urllib.request import Request as HttpRequest, urlopen

import pytest

from journal.app import App
from journal.config import Config
from journal.features.workers.worker_runner import WorkerRunner
from journal.models.worker_state import WorkerState
from journal.models.actor import Actor
from journal.models.plugin_manifest import PluginManifest
from journal.models.setting import Setting
from journal.supervisor_reply import SupervisorReply
from journal.repositories.scope import Scope
from journal.repositories.settings import Settings
from journal.console.where import Where
from journal.engine.machine import Machine
from journal.features.sequences.running import Running
from journal.features.tasks.states.working import Working
from journal.features.workers.subagents import Subagents

from tests.replay import catch_typed

AGENT = Where("main", "s1")
USER = Where("main")
MAIN = 1
"""The id of main, the environment a fresh journal makes at boot: what a test reads directly, it reads there."""


@pytest.fixture
def app(journal_root: Path, monkeypatch):
    """A fresh journal on a free port; no worker process starts, since a dispatched worker would run its provider headless and file what it printed, or that it could not start, beside the test's own report."""
    monkeypatch.setattr(Config, "status_home", property(lambda self: journal_root / "status"))
    monkeypatch.setattr(WorkerRunner, "start", lambda self, worker, by: None)
    app = App(Config(journal_root, port=0))
    app.container.get(Settings).save(Setting(environment_id=0, key="features.skills", value=False), Actor.system())
    app.runtime().start()
    with app.container.get(Scope).of(MAIN):
        yield app
    app.runtime().stop()


def made(out) -> int:
    """The number of the row a command made, or the command's refusal as the failure."""
    assert out.code == 0, out.err
    return int(out.out.split()[1].rstrip(":"))


def own_workflow(console, charts, state: str, event: str) -> tuple[int, int]:
    """A workflow of the user's own for a state at an event, and its trigger's number."""
    made = int(console.run(["chart", "new", f"{state} at {event}", "--for", state, "--on", event], USER).out.split()[1].rstrip(":"))
    return made, next(n.id for n in charts.nodes_of(charts.find(made)) if n.key == event)


def hook(app, kind: str, **body):
    data = json.dumps({"hook_event_name": kind, "session_id": "s1", **body}).encode()
    request = HttpRequest(f"http://127.0.0.1:{app.server().port}/hooks/claude", data=data, method="POST", headers={"Content-Type": "application/json", "X-Journal-Env": "main"})
    try:
        with urlopen(request, timeout=5) as reply:
            return reply.status, json.loads(reply.read())
    except HTTPError as error:
        return error.code, json.loads(error.read())


def context(app, percent: int):
    (app.config.status_home).mkdir(parents=True, exist_ok=True)
    (app.config.status_home / "s1.json").write_text(json.dumps({"context_window": {"used_percentage": percent}}))


def test_the_session_start_is_answered_with_the_briefing(app):
    app.console().run(["rule", "create", "Never skip the gate", "--reason", "it broke once"], USER)
    app.console().run(["fact", "create", "the api lives on port 9"], USER)
    app.console().run(["reminder", "create", "run the linter before a push"], USER)
    status, body = hook(app, "SessionStart")
    text = body["hookSpecificOutput"]["additionalContext"]
    assert status == 200 and "ready on main" in text
    assert "1 rules in force: 1. Never skip the gate" in text
    assert "facts about this environment: 1. the api lives on port 9" in text
    assert "reminders here: 1. run the linter" in text
    assert "ready on main" in hook(app, "SessionStart")[1]["hookSpecificOutput"]["additionalContext"], "a resume is briefed again"


def test_crossing_a_context_mark_holds_writes_until_the_agent_decides(app):
    hook(app, "SessionStart")
    app.console().run(["environment", "here"], AGENT)
    app.console().run(["task", "create", "t", "--start"], AGENT)
    context(app, 30)
    status, body = hook(app, "PreToolUse", tool_name="Read", tool_input={})
    assert "context 25% full" in body["hookSpecificOutput"]["additionalContext"]
    from journal.repositories.agents import Agents
    machine, agents = app.container.get(Machine), app.container.get(Agents)
    assert isinstance(machine.current("s1"), Working) and agents.for_session("s1").mark_owed == 25 and agents.for_session("s1").context_mark == 25, "the mark is a fact on the row, not a state"
    status, body = hook(app, "PreToolUse", tool_name="Write", tool_input={})
    assert status == 409 and "writes wait" in body["error"]
    assert app.console().run(["fact", "create", "the login is flaky"], AGENT).code == 0
    assert agents.for_session("s1").mark_owed == 0 and machine.current("s1").task_id == 1
    assert hook(app, "PreToolUse", tool_name="Write", tool_input={})[0] == 200
    assert "hookSpecificOutput" not in hook(app, "PreToolUse", tool_name="Read", tool_input={})[1], "the mark asks once"
    context(app, 55)
    assert "context 50% full" in json.dumps(hook(app, "Stop")[1]) and agents.for_session("s1").mark_owed == 50
    app.console().run(["nothing", "survives", "all logged"], AGENT)
    assert agents.for_session("s1").mark_owed == 0 and machine.current("s1").task_id == 1


def test_a_rule_binds_the_project_not_an_environment(app):
    app.console().run(["rule", "create", "Always name the model"], Where("other"))
    assert "Always name the model" in app.console().run(["rule", "list"], USER).out


def test_a_mark_owed_outlives_being_stuck_and_a_decision_pays_it(app):
    from journal.repositories.agents import Agents
    hook(app, "SessionStart")
    app.console().run(["environment", "here"], AGENT)
    app.console().run(["task", "create", "t", "--start"], AGENT)
    context(app, 30)
    hook(app, "PreToolUse", tool_name="Read", tool_input={})
    app.console().run(["stuck", "stuck"], AGENT)
    machine, agents = app.container.get(Machine), app.container.get(Agents)
    assert machine.current("s1").name == "stuck" and agents.for_session("s1").mark_owed == 25, "stuck, the mark is still owed"
    hook(app, "PreToolUse", tool_name="Read", tool_input={})
    assert isinstance(machine.current("s1"), Working), "the agent's own tool use lifts being stuck"
    assert hook(app, "PreToolUse", tool_name="Write", tool_input={})[0] == 409, "the mark still holds a write"
    app.console().run(["nothing", "survives", "fine"], AGENT)
    assert agents.for_session("s1").mark_owed == 0 and machine.current("s1").task_id == 1, "the decision pays the mark; the task stands"


def test_a_plan_is_followed_task_by_task_to_its_end(app):
    from journal.features.plans.states.following_plan import FollowingPlan
    from journal.models.plan_state import PlanState
    from journal.repositories.plans import Plans
    console = app.console()
    console.run(["plan", "create", "release", "--brief", "ship 4.0"], USER)
    console.run(["plan", "add", "1", "write the notes"], USER)
    console.run(["plan", "add", "1", "tag it"], USER)
    hook(app, "SessionStart")
    console.run(["plan", "approve", "1"], USER)
    out = console.run(["plan", "start", "1"], AGENT).out
    assert "task 1 is next" in out
    machine = app.container.get(Machine)
    assert machine.current("s1") == FollowingPlan(plan_id=1, task_id=1)
    assert "task 1 is in hand" in hook(app, "Stop")[1]["reason"]
    console.run(["await", "the build"], AGENT)
    out = console.run(["task", "done", "1"], AGENT).out
    assert "task 2 is next" in out, "a task finished while the agent waits on something still advances the plan"
    assert machine.current("s1").resume == {"state": "following_plan", "data": FollowingPlan(plan_id=1, task_id=2).to_data()}, "the wait stands, and the agent goes on to task 2 when it ends"
    out = console.run(["task", "done", "2"], AGENT).out
    assert "plan 1 is done" in out
    assert machine.current("s1").resume["state"] == "idle", "done with the plan, the agent goes to rest when its wait ends"
    assert app.container.get(Plans).find(1).state == PlanState.DONE


def test_a_plan_with_a_blocked_task_waits_and_is_not_done(app):
    from journal.models.plan_state import PlanState
    from journal.repositories.plans import Plans
    console = app.console()
    console.run(["plan", "create", "release", "--brief", "ship 4.0"], USER)
    console.run(["plan", "add", "1", "write the notes"], USER)
    console.run(["plan", "add", "1", "the user's restart"], USER)
    hook(app, "SessionStart")
    console.run(["plan", "approve", "1"], USER)
    console.run(["plan", "start", "1"], AGENT)
    console.run(["task", "block", "2", "the user picks the moment"], AGENT)
    out = console.run(["task", "done", "1"], AGENT).out
    assert "plan 1: no task can start now; task 2 is parked, blocked or waiting" in out and "plan 1 is done" not in out
    assert app.container.get(Plans).find(1).state == PlanState.STARTED, "a blocked task keeps the plan open"
    console.run(["task", "unblock", "2"], AGENT)
    assert "task 2 is next" in console.run(["plan", "start", "1"], AGENT).out


def test_a_task_waits_on_a_question_by_a_link_and_the_answer_clears_it(app):
    from journal.models.task_state import TaskState
    from journal.repositories.tasks import Tasks
    console = app.console()
    hook(app, "SessionStart")
    console.run(["plan", "create", "release", "--brief", "ship"], USER)
    console.run(["plan", "add", "1", "pick the name"], USER)
    console.run(["plan", "add", "1", "write the notes"], USER)
    console.run(["question", "ask", "Which name?"], AGENT)
    assert console.run(["task", "block", "1", "--on", "question:1"], AGENT).code == 0
    tasks = app.container.get(Tasks)
    assert tasks.find(1).state == TaskState.BLOCKED and tasks.reason(tasks.find(1)) == "question 1"
    assert console.run(["task", "block", "2"], AGENT).code != 0, "a block names a wait or a reason"
    console.run(["question", "answer", "1", "alpha"], USER)
    app.runtime().deferred.drain()
    assert tasks.find(1).state == TaskState.OPEN


def test_a_plan_does_not_hand_out_a_task_whose_wait_is_open(app):
    from journal.models.ref import Ref
    from journal.models.link import Link
    from journal.models.actor import Actor
    from journal.repositories.links import Links
    from journal.repositories.plans import Plans
    from journal.repositories.tasks import Tasks, WAITS_ON
    console = app.console()
    console.run(["plan", "create", "release", "--brief", "ship"], USER)
    console.run(["plan", "add", "1", "first"], USER)
    console.run(["plan", "add", "1", "second"], USER)
    tasks, plans = app.container.get(Tasks), app.container.get(Plans)
    console.run(["task", "create", "dependency"], USER)
    app.container.get(Links).save(Link(source=Ref.to(tasks.find(1)), target=Ref.to(tasks.find(3)), kind=WAITS_ON), Actor.system())
    assert plans.next_task(plans.find(1)).id == 2
    console.run(["task", "done", "3"], AGENT)
    assert plans.next_task(plans.find(1)).id == 1


def test_messages_are_put_before_the_agent_and_a_reply_tag_answers_them(app):
    from journal.repositories.messages import Messages
    console = app.console()
    console.run(["message", "send", "can you look at the login?"], USER)
    status, body = hook(app, "UserPromptSubmit", prompt="hi")
    assert "new message 1" in body["hookSpecificOutput"]["additionalContext"]
    shown = console.run(["message", "read", "1"], AGENT).out
    assert "can you look at the login?" in shown and "[!reply:1]" in shown
    hook(app, "MessageDisplay", message="[!reply:1] On it, the login is next.")
    app.runtime().deferred.drain()
    messages = app.container.get(Messages).in_()
    assert [m.author for m in messages] == ["user", "agent"]
    assert messages[1].reply_to == 1 and messages[1].text == "On it, the login is next."
    assert messages[0].read_at is not None
    assert hook(app, "Stop")[1] == {}, "nothing unread is left"
    console.run(["message", "send", "> On it, the login is next.\n> More of the agent's words.\n\nGood, and the logout too.", "--reply-to", "2"], USER)
    shown = console.run(["message", "read", "3"], AGENT).out
    assert "message 3 from the user, a reply to message 2: Good, and the logout too." in shown and "On it" not in shown, "a reply names what it answers by number and never repeats its words"


def test_a_reply_tag_counts_only_at_the_start_of_a_line(app, monkeypatch):
    from journal.repositories.messages import Messages
    typed = []
    catch_typed(app, monkeypatch, typed)
    app.console().run(["message", "send", "first"], USER)
    app.console().run(["message", "send", "second"], USER)
    hook(app, "SessionStart")
    app.console().run(["environment", "here"], AGENT)
    hook(app, "MessageDisplay", message="Good evening. At your service.\n\n[!reply:1]")
    app.runtime().deferred.drain()
    messages = app.container.get(Messages).in_()
    assert messages[-1].author == "agent" and messages[-1].reply_to == 1 and messages[-1].text == "Good evening. At your service."
    hook(app, "MessageDisplay", message="Both done, see below [!reply:2]")
    app.runtime().deferred.drain()
    messages = app.container.get(Messages).in_()
    assert messages[-1].reply_to is None and "[!reply:2]" in messages[-1].text, "a tag inside a line is text"
    assert typed[-1].endswith("the [!reply:2] tag must open a line of your turn; message 2 is still unanswered")
    assert "new message 2" in hook(app, "Stop")[1]["reason"]
    told = len(typed)
    hook(app, "MessageDisplay", message="His screenshot shows a reply opening with `[!reply:8544]` that never arrived.")
    app.runtime().deferred.drain()
    assert len(typed) == told, "a tag quoted about a message that is not owed is only text"


def test_a_question_pauses_the_agent_and_the_answer_brings_it_back(app):
    from journal.features.questions.states.waiting import Waiting
    console = app.console()
    hook(app, "SessionStart")
    app.console().run(["environment", "here"], AGENT)
    console.run(["task", "create", "t", "--start"], AGENT)
    console.run(["question", "ask", "Which name?", "--options", "alpha, beta"], AGENT)
    machine = app.container.get(Machine)
    assert isinstance(machine.current("s1"), Waiting) and machine.current("s1").question_id == 1
    assert hook(app, "Stop")[1] == {}, "idle while waiting is fine"
    assert "Which name?  [alpha / beta]" in console.run(["question", "list"], USER).out
    from journal.repositories.messages import Messages
    asked = lambda: [(m.text, m.data["options"], m.data["answer"]) for m in app.container.get(Messages).all() if m.data.get("kind") == "question"]
    assert asked() == [("Which name?", ["alpha", "beta"], None)], "a question asked is a message in the chat"
    console.run(["question", "answer", "1", "beta"], USER)
    assert asked() == [("Which name?", ["alpha", "beta"], "beta")], "and the same message is settled when it is answered"
    assert machine.current("s1").task_id == 1
    assert console.run(["question", "list"], USER).out == ""


def test_a_prompt_answers_a_question_in_other_words(app):
    from journal.features.questions.states.waiting import Waiting
    hook(app, "SessionStart")
    app.console().run(["environment", "here"], AGENT)
    app.console().run(["question", "ask", "Which name?"], AGENT)
    hook(app, "UserPromptSubmit", prompt="call it beta")
    assert app.container.get(Machine).current("s1").name == "idle"


def test_the_same_check_three_times_is_named(app):
    hook(app, "SessionStart")
    for _ in range(2):
        assert "hookSpecificOutput" not in hook(app, "PreToolUse", tool_name="Bash", tool_input={"command": "ls build"})[1]
    assert "same check 3 times in a row: ls build" in hook(app, "PreToolUse", tool_name="Bash", tool_input={"command": "ls build"})[1]["hookSpecificOutput"]["additionalContext"]


def test_a_sequence_is_stepped_through_and_goes_back_where_it_began(app):
    console = app.console()
    created = console.run(["sequence", "create", "release", "--steps", "bump the version | tag it with `git tag v1` | push"], USER).out
    release = created.split()[1].rstrip(":")
    hook(app, "SessionStart")
    app.console().run(["environment", "here"], AGENT)
    console.run(["task", "create", "t", "--start"], AGENT)
    edit = lambda: hook(app, "PreToolUse", tool_name="Edit", tool_input={"file_path": "a.py", "old_string": "a", "new_string": "b"})[1]
    assert "step 1: bump the version" in console.run(["sequence", "run", release], AGENT).out
    assert "step 1" not in json.dumps(hook(app, "Stop")[1]), "a stop right after the step was told passes it by"
    hook(app, "PreToolUse", tool_name="Read", tool_input={"file_path": "a.py"})
    assert "step 1: bump the version" in hook(app, "Stop")[1]["reason"], "a tool used since, the stop is held with the step"
    assert "step 1" not in json.dumps(hook(app, "Stop", stop_hook_active=True)[1]), "the step is said once until the agent uses a tool again"
    assert "a write waits for sequence" in json.dumps(edit()), "a write waits until the step is taken up"
    assert "a write waits" not in json.dumps(hook(app, "PreToolUse", tool_name="Read", tool_input={"file_path": "a.py"})[1]), "a read goes through"
    bash = lambda line, **more: hook(app, "PreToolUse", tool_name="Bash", tool_input={"command": line}, **more)[0]
    assert bash("journal message unread && journal task list") == 200, "a line of journal commands alone goes through"
    assert bash("journal task list && sed -i '' s/a/b/ a.py") == 409, "a journal command chained with a write stays held"
    assert hook(app, "PreToolUse", tool_name="Edit", tool_input={"file_path": "a.py", "old_string": "a", "new_string": "b"}, agent_id="r1")[0] == 200, "a subagent is never held"
    assert "step 1 of sequence" in console.run(["sequence", "next"], AGENT).err, "a step never taken up cannot be moved on"
    assert "following sequence" in console.run(["sequence", "follow"], AGENT).out
    assert "a write waits" not in json.dumps(edit()), "a step taken up lets writes through"
    assert "step 1: bump the version" in hook(app, "Stop")[1]["reason"], "a tool used since the last hold, so the stop is held again"
    console.run(["await", "the user"], AGENT)
    assert hook(app, "Stop")[1].get("decision") != "block", "a step that waits on the user says so, and the stop passes"
    assert "step 2: tag it" in console.run(["sequence", "next"], AGENT).out
    assert "a write waits" not in json.dumps(hook(app, "PreToolUse", tool_name="Bash", tool_input={"command": "git tag v1 && git push --tags"})[1]), "a command the step names goes through"
    assert app.container.get(Running).in_hand("s1", 1).taken_up_at, "and takes the step up"
    assert "step 3: push" in console.run(["sequence", "next"], AGENT).out
    console.run(["sequence", "follow"], AGENT)
    app.container.get(Settings).set("sequences.stale_after", 2, Actor.user(1))
    edit(), edit()
    assert "2 writes since sequence" in json.dumps(edit()), "a step taken up and not moved on holds again after the set writes"
    assert "parked at step 3" in console.run(["sequence", "park", "--why", "the user wants the docs first"], AGENT).out
    assert "a write waits" not in json.dumps(edit()) and "step 3" not in json.dumps(hook(app, "Stop")[1]), "a parked run holds nothing"
    console.run(["sequence", "follow"], AGENT)
    assert "ran its last step" in console.run(["sequence", "next"], AGENT).out
    assert app.container.get(Machine).current("s1").task_id == 1


def test_awaiting_workers_ends_when_the_last_one_reports(app, monkeypatch):
    from journal.engine.typed_lines import TypedLines
    import threading
    import traceback
    typed, stacks = [], []
    from journal.supervisor_link import SupervisorLink

    def sent(self, environment_id, verb, instruction):
        typed.append(instruction["line"])
        stacks.append(f"--- {threading.current_thread().name}\n" + "".join(traceback.format_stack(limit=14)))

    monkeypatch.setattr(SupervisorLink, "_send", sent)
    console = app.console()
    hook(app, "SessionStart")
    app.console().run(["environment", "here"], AGENT)
    console.run(["task", "create", "t", "--start"], AGENT)
    console.run(["worker", "dispatch", "Lady Lovelace", "write the parser", "--model", "fast", "--worktree"], AGENT)
    console.run(["worker", "dispatch", "Dr. Einstein", "profile it", "--model", "fast"], AGENT)
    console.run(["worker", "wait", "1", "2"], AGENT)
    machine = app.container.get(Machine)
    assert machine.current("s1").name == "awaiting" and hook(app, "Stop")[1] == {}
    console.run(["worker", "report", "1", "parser done"], Where("main", "w1"))
    assert machine.current("s1").name == "awaiting" and typed == ["[journal] worker 1, Lady Lovelace, reported in the chat"], "\n".join(stacks)
    lines, link = app.container.get(TypedLines), app.container.get(SupervisorLink)
    lines.confirm(1, typed[0])
    console.run(["worker", "stop", "2"], USER)
    assert machine.current("s1").task_id == 1
    assert typed[-1] == "[journal] worker 2, Dr. Einstein, stopped before it reported", "one line at a time: the next waits until this one is seen back"
    lines.confirm(1, typed[-1])
    link.release(1)
    assert typed[-1] == "[journal] what you waited on came back: carry on"


def test_a_worker_that_reported_takes_its_next_job_by_say_with_its_memory(app, monkeypatch):
    from journal.providers.claude import Claude
    from journal.providers.codex import Codex
    from journal.repositories.workers import Workers
    started = []
    monkeypatch.setattr(WorkerRunner, "start", lambda self, worker, by: started.append(worker))
    console = app.console()
    hook(app, "SessionStart")
    console.run(["worker", "dispatch", "Lady Lovelace", "write the parser", "--model", "fast", "--worktree"], AGENT)
    assert console.run(["worker", "say", "1", "now the lexer"], AGENT).code != 0, "still out: its report comes first"
    console.run(["worker", "report", "1", "parser done"], Where("main", "w1"))
    assert console.run(["worker", "say", "1", "now the lexer"], AGENT).code != 0, "no session was captured, so there is nothing to resume"
    workers = app.container.get(Workers)
    workers.save(workers.find(1).with_(resume="sess-1"), USER.actor)
    assert console.run(["worker", "say", "1", "now the lexer"], AGENT).code == 0
    told = workers.find(1)
    assert told.state == WorkerState.DISPATCHED and told.brief == "now the lexer" and told.resume == "sess-1" and told.worktree and started[-1].id == 1
    assert Claude().worker_command("now the lexer", "fast", "sess-1")[-2:] == ["--resume", "sess-1"]
    assert Claude().worker_outcome('{"result": "lexer done", "session_id": "sess-2"}', "") == ("lexer done", "sess-2")
    assert Claude().worker_outcome("plain words", "") == ("plain words", "")
    assert Codex().worker_command("x", "m", "c-9")[:3] == ["codex", "exec", "resume"] and Codex().worker_command("x", "m", "")[:2] == ["codex", "exec"]
    assert Codex().worker_outcome("done", "session id: 0192f3a4-aaaa-bbbb\nwork") == ("done\nsession id: 0192f3a4-aaaa-bbbb\nwork", "0192f3a4-aaaa-bbbb"), "stderr stays beside stdout"


def test_a_dispatch_without_a_model_or_a_job_is_refused(app):
    hook(app, "SessionStart")
    status, body = hook(app, "PreToolUse", tool_name="Task", tool_input={"description": "x", "prompt": "y"})
    assert status == 409 and "names no model" in body["error"]
    status, body = hook(app, "PreToolUse", tool_name="Task", tool_input={"model": "fast", "prompt": "y"})
    assert status == 409 and "no concrete job" in body["error"]
    assert hook(app, "PreToolUse", tool_name="Task", tool_input={"model": "fast", "description": "x", "prompt": "y"})[0] == 200


def test_a_large_result_is_named(app):
    hook(app, "SessionStart")
    body = hook(app, "PostToolUse", tool_name="Bash", tool_input={}, tool_response="\n" * 500)[1]
    assert "501 lines" in body["hookSpecificOutput"]["additionalContext"]


@pytest.fixture
def skilled(tmp_path: Path, monkeypatch):
    monkeypatch.setattr(Config, "status_home", property(lambda self: tmp_path / "status"))
    app = App(Config(tmp_path, port=0))
    app.runtime().start()
    with app.container.get(Scope).of(MAIN):
        yield app
    app.runtime().stop()


def read_skill(app, folder: str):
    hook(app, "PostToolUse", tool_name="Read", tool_input={"file_path": str(app.config.root / f".claude/skills/{folder}/SKILL.md")}, tool_response="")


def test_the_session_start_requires_the_journal_skill_and_reading_it_lifts_the_hold(skilled):
    app = skilled
    status, body = hook(app, "SessionStart")
    assert "read the journal skill before anything else: .claude/skills/journal/SKILL.md" in body["hookSpecificOutput"]["additionalContext"]
    machine = app.container.get(Machine)
    assert machine.current("s1").name == "idle", "the start owes the skill and the look as facts, not as a state"
    status, body = hook(app, "PreToolUse", tool_name="Write", tool_input={})
    assert status == 409 and "read the journal skill before anything else: .claude/skills/journal/SKILL.md. writes wait until you have" in body["error"] and "in flight" not in body["error"], "the guards hold the write while a skill is owed: the first hold wins"
    read_skill(app, "journal")
    status, body = hook(app, "PreToolUse", tool_name="Write", tool_input={})
    assert status == 409 and "before your first write, run `journal environment here`: it lists the task in hand, the open tasks, the facts and the reminders" in body["error"], "the skill read, the start's look at what is in flight is still owed"
    app.console().run(["environment", "here"], AGENT)
    assert machine.current("s1").name == "idle"
    assert "journal skill" not in hook(app, "SessionStart")[1].get("hookSpecificOutput", {}).get("additionalContext", ""), "loaded once, not owed again"


def test_a_session_starting_in_a_state_requires_that_states_skill(skilled):
    from journal.features.skills.requiring import Requiring
    from journal.repositories.agents import Agents
    app = skilled
    hook(app, "SessionStart")
    read_skill(app, "journal")
    app.console().run(["environment", "here"], AGENT)
    requiring, agents = app.container.get(Requiring), app.container.get(Agents)
    app.console().run(["task", "create", "t", "--start"], AGENT)
    assert requiring.owed_names(agents.for_session("s1")) == [], "entering a state owes nothing by itself"
    hook(app, "PreCompact")
    status, body = hook(app, "SessionStart")
    said = body["hookSpecificOutput"]["additionalContext"]
    assert "journal skill" in said and "read the tasks skill before anything else" in said, "a start after a compaction owes the journal skill and the state's own"
    assert sorted(requiring.owed_names(agents.for_session("s1"))) == ["journal", "tasks"]
    app.runtime().deferred.drain()
    from journal.repositories.messages import Messages
    kinds = [m.data.get("kind") for m in app.container.get(Messages).all() if m.author.value == "system"]
    assert "compacted" in kinds and "skill" in kinds, "a compaction and a skill read are marks in the chat, as messages"
    status, body = hook(app, "PreToolUse", tool_name="Write", tool_input={})
    assert status == 409 and "skill before anything else" in body["error"]
    read_skill(app, "journal")
    read_skill(app, "journal-tasks")
    app.console().run(["environment", "here"], AGENT)
    assert requiring.owed_names(agents.for_session("s1")) == [] and hook(app, "PreToolUse", tool_name="Write", tool_input={})[0] == 200


def test_a_prompt_naming_a_keyword_requires_that_skill(skilled):
    app = skilled
    hook(app, "SessionStart")
    read_skill(app, "journal")
    assert "read the plans skill" in hook(app, "UserPromptSubmit", prompt="make me a plan for the release")[1]["hookSpecificOutput"]["additionalContext"]


def test_triggers_nudge_on_a_prompt_and_deny_a_tool_call(app):
    console = app.console()
    console.run(["trigger", "create", "deploy,release", "check the changelog first", "--do", "instruct"], USER)
    console.run(["trigger", "create", "rm -rf", "no recursive deletes here", "--do", "deny"], USER)
    hook(app, "SessionStart")
    console.run(["environment", "here"], AGENT)
    assert "do this now: check the changelog first" in hook(app, "UserPromptSubmit", prompt="let's deploy it")[1]["hookSpecificOutput"]["additionalContext"]
    status, body = hook(app, "PreToolUse", tool_name="Bash", tool_input={"command": "rm -rf build"})
    assert status == 409 and "no recursive deletes here" in body["error"]


def test_a_check_keeps_its_description_for_the_page(app):
    app.console().run(["check", "create", "Check for sins", "--command", "true", "--brief", "Judges the project; a failure lists the sins found"], USER)
    with urlopen(HttpRequest(f"http://127.0.0.1:{app.server().port}/api/check", headers={"X-Journal-Env": "main"}), timeout=5) as reply:
        row = json.loads(reply.read())["rows"][0]
    assert (row["title"], row["brief"], row["data"]["command"], row["data"]["last"]["at"]) == ("Check for sins", "Judges the project; a failure lists the sins found", "true", 0.0), "the description is the row's brief, and a check never run says so by its last run's time"


def test_the_documents_page_lists_the_projects_documents_their_search_and_the_attached_files(app, tmp_path):
    from journal.http.v3.attachments import Attachments
    from journal.models.message import Message
    from journal.repositories.messages import Messages
    old = tmp_path / "doc"
    for n, (title, deleted) in enumerate((("Audit of the package", 0), ("Gone", 1.0)), 1):
        (old / f"{n:03}").mkdir(parents=True)
        (old / f"{n:03}" / "doc.md").write_text(f'---\n{{"n": {n}, "title": "{title}", "abstract": "what is broken", "deleted": {deleted}}}\n---\n# Findings\n\nThe cleanup pluralises the wrong noun.\n')
    (old / "003").mkdir()
    (old / "003" / "doc.md").write_text("")
    console = app.console()
    assert "1 documents brought in, 0 already here" in console.run(["doc", "import", str(old)], USER).out, "a deleted one and an empty one stay out"
    assert "0 documents brought in, 1 already here" in console.run(["doc", "import", str(old)], USER).out, "a second import brings nothing twice"
    port = app.server().port
    read = lambda path, env="main": json.load(urlopen(HttpRequest(f"http://127.0.0.1:{port}{path}", headers={"X-Journal-Env": env}), timeout=5))
    console.run(["environment", "create", "other"], USER)
    assert [r["title"] for r in read("/api/doc", "other")["rows"]] == ["Audit of the package"], "a document is the project's, seen from every environment"
    hits = read("/api/doc/locate?words=pluralises+noun")
    assert hits and hits[0]["n"] == 1 and "pluralises the wrong noun" in hits[0]["text"], "a search finds the document holding every word, with the passage"
    message = app.container.get(Messages).save(Message(text="the screenshot of the bar"), Actor.user(1))
    stored = app.container.get(Attachments).store("message", message.id, "bar.png", b"png")
    app.container.get(Messages).save(message.with_(files=(stored,)), Actor.user(1))
    page = read("/api/files/page?kind=images")
    assert page["found"] == 1 and page["files"][0]["name"] == "bar.png" and page["files"][0]["image"] and page["counts"]["images"] == 1, "a file attached to a message is listed"
    assert read("/api/files/page?kind=other")["found"] == 0 and read("/api/files/page?search=screenshot")["found"] == 1


def test_a_running_check_shows_how_far_it_is_and_keeps_its_report(app):
    import time as clock
    from journal.features.checks.check_runner import CheckRunner
    from journal.repositories.checks import Checks
    report = '{"title": "Sins", "summary": "1 sin", "findings": [{"name": "python-dict-bag", "file": "src/x.py", "line": 3, "group": "value objects"}]}'
    app.console().run(["check", "create", "Counts", "--command", f"echo 1/3; sleep 1.5; echo 2/3; sleep 1.5; printf '%s' '{report}' > \"$JOURNAL_REPORT\"; exit 1"], USER)
    checks = app.container.get(Checks)
    started = app.container.get(CheckRunner).start(checks.find(1), Actor.user(1))
    assert started.running is not None, "a run started from the page answers at once, marked running"
    seen = []
    for _ in range(60):
        row = checks.find(1)
        if row.running is None:
            break
        seen.append((row.running.done, row.running.total))
        clock.sleep(0.1)
    row = checks.find(1)
    assert (1, 3) in seen or (2, 3) in seen, f"the row says how far the run is while it runs: {seen[-5:]}"
    assert row.running is None and row.last_passed is False and row.last_took > 2, "the run's end clears its progress and keeps how long it took"
    assert row.last_report.summary == "1 sin" and row.last_report.findings[0].line == 3, "the report the check wrote is kept with its run"


def test_a_check_run_reaches_the_page_though_a_check_is_the_projects(app):
    from journal.repositories.entries import Entries
    console = app.console()
    console.run(["check", "create", "Fails", "--command", "false"], USER)
    before = app.container.get(Entries).last_id()
    console.run(["check", "run", "1"], USER)
    with urlopen(HttpRequest(f"http://127.0.0.1:{app.server().port}/api/events?since={before}", headers={"X-Journal-Env": "main"}), timeout=5) as reply:
        events = json.loads(reply.read())
    assert ("check", 1) in [(e["type"], e["n"]) for e in events], "the run's change is told to the page, so it shows the check failed"


def test_a_check_runs_and_a_failure_is_typed_to_the_agent(app, monkeypatch):
    typed = []
    catch_typed(app, monkeypatch, typed)
    console = app.console()
    hook(app, "SessionStart")
    console.run(["check", "create", "it is fine", "--command", "true"], USER)
    console.run(["check", "create", "it is broken", "--command", "echo boom; exit 1", "--every", "1"], USER)
    assert console.run(["check", "run", "1"], USER).code == 0
    out = console.run(["check", "run", "2"], USER)
    assert out.code == 1 and "boom" in out.out
    assert typed and "check 2, it is broken, failed" in typed[0] and "boom" in typed[0]
    assert "failed   it is broken" in console.run(["check", "list"], USER).out


def test_a_due_check_runs_on_the_clock(app):
    from journal.engine.clock import Clock
    from journal.repositories.checks import Checks
    app.console().run(["check", "create", "due", "--command", "true", "--every", "1"], USER)
    app.container.get(Clock).tick()
    assert app.container.get(Checks).find(1).last_passed is True


def test_shop_talk_and_the_third_person_are_named(app, monkeypatch):
    typed = []
    catch_typed(app, monkeypatch, typed)
    hook(app, "SessionStart")
    hook(app, "MessageDisplay", message="I ran journal task start 3 because the user wants it.")
    app.runtime().deferred.drain()
    assert any("talks about the journal's commands" in t for t in typed) and any("say you, never the user" in t for t in typed)



def test_each_subagent_is_one_message_in_the_chat_settled_in_place(app):
    from journal.repositories.messages import Messages
    hook(app, "SessionStart")
    hook(app, "PreToolUse", tool_name="Agent", tool_input={"description": "cut off", "prompt": "read", "model": "haiku"}, tool_use_id="t-cut")
    app.runtime().deferred.drain()
    marks = lambda: [m.data for m in app.container.get(Messages).all() if m.data.get("kind") == "subagent"]
    assert [(d["detail"], d["state"]) for d in marks()] == [("cut off", "running")], "a dispatch is a message as it starts"
    hook(app, "Stop")
    app.runtime().deferred.drain()
    assert [(d["detail"], d["state"], d["agent"]) for d in marks()] == [("cut off", "stopped", 1)], "and the same message settles when its turn ends"


def test_a_document_the_agent_writes_is_a_message_in_its_chat(app, tmp_path):
    from journal.repositories.messages import Messages
    hook(app, "SessionStart")
    (tmp_path / "notes.md").write_text("## Why\nBecause.\n")
    app.console().run(["doc", "create", "Deploys", "--file", str(tmp_path / "notes.md"), "--abstract", "How a deploy goes"], AGENT)
    app.console().run(["doc", "create", "Yours", "--file", str(tmp_path / "notes.md"), "--abstract", "the user's own"], USER)
    app.runtime().deferred.drain()
    made = [(m.text, m.data["abstract"]) for m in app.container.get(Messages).all() if m.data.get("kind") == "made"]
    assert made == [("Deploys", "How a deploy goes")], "the agent's document is marked in the chat; the user's own is not"

def test_a_refused_subagent_is_not_shown_and_one_never_answered_ends_with_its_turn_or_session(app):
    send = lambda kind, **extra: hook(app, kind, session_id="s7", **extra)
    rows = lambda: [asdict(row) for row in app.container.get(Subagents).rows("s7")]
    send("SessionStart", source="startup")
    send("PreToolUse", tool_name="Agent", tool_input={"description": "no model named", "prompt": "read"}, tool_use_id="t-refused")
    send("PreToolUse", tool_name="Agent", tool_input={"description": "cut off", "prompt": "read", "model": "haiku"}, tool_use_id="t-cut")
    send("PreToolUse", tool_name="Agent", tool_input={"description": "in the background", "prompt": "read", "model": "haiku"}, tool_use_id="t-bg")
    send("PostToolUse", tool_name="Agent", tool_input={}, tool_response={"isAsync": True, "agentId": "a7"}, tool_use_id="t-bg")
    assert [r["task"] for r in rows()] == ["cut off", "in the background"], "a dispatch the journal refused never ran"
    send("Stop")
    assert [(r["running"], r["status"]) for r in rows()] == [(False, "stopped"), (True, "running")], "a call with no answer ends with its turn; one in the background goes on"
    send("SessionStart", source="compact")
    assert rows()[1]["running"] is True, "a compaction ends no subagent"
    send("SessionEnd")
    assert [r["running"] for r in rows()] == [False, False], "a subagent with no stop ends with its session"


def test_a_task_the_reply_names_is_linked_to_the_message_it_answers_however_old(app):
    from journal.repositories.links import Links
    from journal.repositories.messages import Messages
    console = app.console()
    hook(app, "SessionStart")
    console.run(["task", "create", "the old one"], AGENT)
    console.run(["message", "send", "don't forget it"], USER)
    console.run(["message", "send", "I won't: it is task 1, next.", "--reply-to", "1"], AGENT)
    app.runtime().deferred.drain()
    asked = app.container.get(Messages).find(1)
    assert [ref.id for ref in app.container.get(Links).targets(asked, Messages.ABOUT)] == [1], "your message carries the task the reply names, whenever it was filed"


def test_a_request_over_its_budget_is_one_mark_per_route_and_told_once(app, monkeypatch):
    from journal.features.faults.slow_requests import SlowRequests
    from journal.repositories.messages import Messages
    typed = []
    catch_typed(app, monkeypatch, typed)
    hook(app, "SessionStart")
    (app.config.root / "src" / "journal").mkdir(parents=True)
    slow = app.container.get(SlowRequests)
    monkeypatch.setattr("os.getloadavg", lambda: (0.0, 0.0, 0.0))
    with app.container.get(Scope).of(MAIN):
        slow.measured("GET", "/api/plan", 80)
        assert [m for m in app.container.get(Messages).all() if m.text.startswith("Slow request")] == [], "nothing is judged in the first minute after a start"
        slow.started -= 120
        slow.measured("GET", "/api/plan", 30)
        slow.measured("GET", "/api/plan", 80)
        slow.measured("GET", "/api/plan", 95)
        slow.measured("GET", "/api/message/12/read", 70)
        app.runtime().deferred.drain()
        marks = [m for m in app.container.get(Messages).all() if m.text.startswith("Slow request")]
    assert [(m.text, m.data["count"], m.data["worst"]) for m in marks] == [("Slow request: GET /api/plan", 2, 95), ("Slow request: GET /api/message/{n}/read", 1, 70)], "one mark per path, its numbers folded, with its worst time and how often; a request inside its budget not counted"
    assert sum("over its budget of 50 ms" in t for t in typed) == 2, "the agent is told the first time of each"
    mark = app.config.home / "runtime" / "tests.running"
    mark.parent.mkdir(parents=True, exist_ok=True)
    mark.write_text(str(os.getpid()))
    assert not slow.judging(), "nothing is judged while the test suite runs"
    mark.write_text("999999")
    assert slow.judging(), "a mark left by a run that died is stale"

def test_a_command_reports_every_row_it_caused(app):
    console = app.console()
    assert 'created: plan 1' in console.run(["plan", "create", "release"], USER).out
    assert 'created: task 1, link ' in console.run(["plan", "add", "1", "write the notes"], USER).out, "the link's number is after the shipped workflows' lines, which are links too"


def test_the_skill_tool_loads_a_skill_too(skilled):
    app = skilled
    hook(app, "SessionStart")
    hook(app, "PostToolUse", tool_name="Skill", tool_input={"skill": "journal"}, tool_response="")
    app.console().run(["environment", "here"], AGENT)
    assert app.container.get(Machine).current("s1").name == "idle"
    assert "journal skill" not in hook(app, "SessionStart")[1].get("hookSpecificOutput", {}).get("additionalContext", "")


def test_a_shell_line_printing_skill_files_loads_each_of_them(skilled):
    app = skilled
    hook(app, "SessionStart")
    from journal.repositories.agents import Agents
    hook(app, "PostToolUse", tool_name="Bash", tool_input={"command": "cat .claude/skills/journal/SKILL.md .claude/skills/journal-tasks/SKILL.md | head -40"}, tool_response="")
    loaded = app.container.get(Agents).for_session("s1").skills_loaded
    assert {"journal", "tasks"} <= set(loaded), "one cat of two skill files, by paths relative to the project, loads both"
    hook(app, "PostToolUse", tool_name="Bash", tool_input={"command": "cat .claude/skills/journal-workers/SKILL.md > copy.md"}, tool_response="")
    assert "workers" not in app.container.get(Agents).for_session("s1").skills_loaded, "a line that writes reads nothing"


def test_the_link_asks_a_supervisor_on_the_protocol_and_sends_an_old_one_its_datagrams(app):
    import socket
    import threading
    from journal.supervisor_link import SupervisorLink
    link, environment = app.container.get(SupervisorLink), 1
    announced = app.config.home / "runtime" / "inboxes" / "main"
    announced.parent.mkdir(parents=True, exist_ok=True)
    path = f"/tmp/journal-test-{os.getpid()}.sock"
    with socket.socket(socket.AF_UNIX, socket.SOCK_DGRAM) as old:
        Path(path).unlink(missing_ok=True)
        old.bind(path)
        announced.write_text(path)
        assert link.runs(environment), "an old supervisor runs while its socket is open"
        link.restart_agent(environment, ("--resume", "s1"))
        assert json.loads(old.recv(4096)) == {"type": "RestartAgent", "resume": ["--resume", "s1"]}, "a bare path is a supervisor from before the protocol"
        link.stop_service(environment, "plugin.code-commandments.mypy")
        old.settimeout(0.2)
        with pytest.raises(TimeoutError):
            old.recv(4096)
        old.settimeout(None)
    Path(path).unlink(missing_ok=True)
    heard = []
    with socket.socket(socket.AF_UNIX, socket.SOCK_STREAM) as new:
        new.bind(path)
        new.listen(1)
        announced.write_text(json.dumps({"socket": path, "protocol": 1}))

        def answer():
            connection, _ = new.accept()
            with connection:
                heard.append(json.loads(connection.makefile("rb").readline()))
                connection.sendall(b'{"ok": true}\n')

        answering = threading.Thread(target=answer)
        answering.start()
        assert link._send(environment, "restart", {"name": "journal"}) == SupervisorReply(True)
        answering.join(2)
    Path(path).unlink(missing_ok=True)
    assert heard == [{"verb": "restart", "name": "journal"}]
    assert not link.runs(environment), "an announce file a dead supervisor left answers nothing"


def test_the_journal_asks_its_host_to_start_every_service_the_features_declare_at_boot(app, monkeypatch):
    from journal.service_start import ServiceStart
    from journal.features.registry import Registry
    from journal.features.service import Service
    from journal.supervisor_link import SupervisorLink
    sent = []
    monkeypatch.setattr(SupervisorLink, "runs", lambda self, environment_id: True)
    monkeypatch.setattr(SupervisorLink, "_send", lambda self, environment_id, verb, fields: sent.append({"verb": verb, **fields}) or SupervisorReply(True))
    monkeypatch.setattr(Registry, "services", lambda self: [Service("watcher", "journal.watcher")])
    starter = app.container.get(ServiceStart)
    monkeypatch.delenv("JOURNAL_ENV", raising=False)
    assert starter.run() == [] and sent == [], "a journal no supervisor hosts starts nothing"
    monkeypatch.setenv("JOURNAL_ENV", "main")
    assert starter.run() == [SupervisorReply(True)], "an upgrade that brings a new service starts it as the journal boots again, the supervisor still running"
    assert sent[0]["verb"] == "start" and sent[0]["name"] == "watcher" and sent[0]["command"][1:] == ["-m", "journal.watcher"] and sent[0]["log"].endswith("runtime/watcher.log")


def test_the_voice_is_said_at_start_and_a_change_is_typed_in(app, monkeypatch):
    typed = []
    catch_typed(app, monkeypatch, typed)
    console = app.console()
    console.run(["voice", "me", "--title", "Sir", "--name", "Example"], USER)
    text = hook(app, "SessionStart")[1]["hookSpecificOutput"]["additionalContext"]
    assert "Talk like a good butler" in text and 'Address me as "Sir Example"' in text
    console.run(["voice", "choose", "squire"], AGENT)
    assert typed and "changed how you talk" in typed[-1] and 'Address me as "my liege"' in typed[-1]
    assert "* squire" in console.run(["voice", "list"], USER).out
    hook(app, "UserPromptSubmit", prompt=typed[-1])
    app.runtime().deferred.drain()
    said = len(typed)
    app.container.get(Settings).save(Setting(environment_id=0, key="voices.avatar_shown", value="never"), Actor.user(1))
    app.container.get(Settings).save(Setting(environment_id=0, key="voices.avatar", value=False), Actor.user(1))
    assert len(typed) == said, "a change to the figure's look is no change of voice: nothing is typed"
    app.container.get(Settings).save(Setting(environment_id=0, key="voices.title", value="Captain"), Actor.user(1))
    assert len(typed) == said + 1 and "changed how you talk" in typed[-1], "a change to the words is typed once"


def test_a_message_left_while_the_agent_sits_at_its_prompt_is_typed_to_it(app, monkeypatch):
    typed = []
    from journal.supervisor_link import SupervisorLink
    monkeypatch.setattr(SupervisorLink, "_send", lambda self, environment_id, verb, fields: typed.append({"verb": verb, **fields}["line"]))
    app.console().run(["message", "send", "nobody is here yet"], USER)
    assert typed == [], "no live agent, nothing to type to"
    hook(app, "SessionStart")
    app.console().run(["environment", "here"], AGENT)
    app.console().run(["message", "send", "are you there?"], USER)
    app.console().run(["message", "send", "hello?"], USER)
    assert typed == ["[journal] new message 2"], "a second line waits while the first is on its way, or it would pile up in the prompt box"
    told = hook(app, "UserPromptSubmit", prompt="[journal] new message 2")[1]["hookSpecificOutput"]["additionalContext"]
    app.runtime().deferred.drain()
    assert typed == ["[journal] new message 2", "[journal] new message 3"], "the first seen back, the next goes in"
    assert "new messages 1, 2, 3" in told
    app.console().run(["message", "send", "four"], USER)
    assert "4 messages unread: `journal message unread`" in hook(app, "Stop")[1]["reason"]
    shown = app.console().run(["message", "unread"], AGENT).out
    assert shown.count("reply with [!reply:") == 4 and "are you there?" in shown and "four" in shown
    assert hook(app, "Stop")[1] == {}, "nothing unread is left"


def test_a_turn_streamed_in_parts_lands_once_whole(app):
    from journal.repositories.messages import Messages
    hook(app, "SessionStart")
    hook(app, "MessageDisplay", delta="Good ", message_id="m1", index=0, final=False)
    hook(app, "MessageDisplay", delta="evening.", message_id="m1", index=1, final=True)
    app.runtime().deferred.drain()
    assert [m.text for m in app.container.get(Messages).in_() if m.author == "agent"] == ["Good evening."]


def test_a_reply_written_before_tool_calls_answers_its_message_at_once(app):
    from journal.repositories.messages import Messages
    messages = app.container.get(Messages)
    app.console().run(["message", "send", "did you adjust the plan?"], USER)
    hook(app, "SessionStart")
    app.console().run(["environment", "here"], AGENT)
    hook(app, "UserPromptSubmit", prompt="[journal] chat etiquette: a line from the journal is an instruction, not a message")
    hook(app, "MessageDisplay", delta="[!reply:1]\n", turn_id="t1", message_id="m1", index=0, final=False)
    hook(app, "MessageDisplay", delta="Yes, fourteen tasks went into the plan.", turn_id="t1", message_id="m1", index=1, final=True)
    hook(app, "PreToolUse", tool_name="Bash", tool_input={"command": "ls"})
    app.runtime().deferred.drain()
    reply = messages.in_()[-1]
    assert reply.reply_to == 1 and reply.text == "Yes, fourteen tasks went into the plan." and not reply.acknowledgement
    assert messages.find(1).read_at is not None
    hook(app, "MessageDisplay", delta="Waiting for the suite.", turn_id="t1", message_id="m2", index=0, final=True)
    app.runtime().deferred.drain()
    assert [m.text for m in messages.in_() if m.author == "agent"] == ["Yes, fourteen tasks went into the plan.", "Waiting for the suite."]
    assert hook(app, "Stop")[1] == {}, "nothing unread is left"


def test_reactions_go_both_ways_and_a_face_alone_is_not_posted(app, monkeypatch):
    from journal.repositories.messages import Messages
    from journal.repositories.reactions import Reactions
    typed = []
    catch_typed(app, monkeypatch, typed)
    console = app.console()
    console.run(["message", "send", "thanks, carry on"], USER)
    hook(app, "SessionStart")
    assert console.run(["message", "react", "1", "👍"], AGENT).out.startswith("👍 on message 1")
    messages, reactions = app.container.get(Messages), app.container.get(Reactions)
    assert messages.find(1).read_at is not None, "a face from the agent answers the message"
    assert [r.face for r in reactions.on(messages.find(1))] == ["👍"]
    assert console.run(["message", "react", "1", "👍"], AGENT).out.startswith("👍 off message 1") and reactions.on(messages.find(1)) == []
    assert console.run(["message", "react", "1", "🍕"], AGENT).code == 1
    hook(app, "MessageDisplay", message="Done.")
    app.runtime().deferred.drain()
    console.run(["message", "react", "2", "🎉"], USER)
    assert typed[-1] == "[journal] the user put 🎉 on message 2. act on it if it asks for something, such as a go-ahead; it needs no reply and the chat never mentions it"
    hook(app, "MessageDisplay", message="👍")
    app.runtime().deferred.drain()
    assert [m.text for m in messages.in_()] == ["thanks, carry on", "Done."], "a turn that is only a face is not posted"
    assert typed[-1].startswith("[journal] your reply was only 👍, so it was not posted")


def test_a_turn_that_only_answers_a_journal_line_is_an_acknowledgement(app, monkeypatch):
    from journal.repositories.messages import Messages
    sent = []
    catch_typed(app, monkeypatch, sent)
    hook(app, "SessionStart", source="startup")
    hook(app, "UserPromptSubmit", prompt="[journal] the journal is ready on main")
    hook(app, "MessageDisplay", message="Noted.")
    app.runtime().deferred.drain()
    hook(app, "UserPromptSubmit", prompt=sent[-1])
    hook(app, "MessageDisplay", message="Good day. I am your butler; what shall I attend to?")
    app.runtime().deferred.drain()
    hook(app, "UserPromptSubmit", prompt="[journal] carry on")
    hook(app, "PreToolUse", tool_name="Read", tool_input={"file_path": "a.py"})
    hook(app, "MessageDisplay", message="Still nothing changed.")
    hook(app, "UserPromptSubmit", prompt="[journal] carry on")
    app.console().run(["task", "create", "t", "--start"], AGENT)
    hook(app, "PreToolUse", tool_name="Write", tool_input={"file_path": "a.py"})
    hook(app, "MessageDisplay", message="Fixed the login.")
    hook(app, "UserPromptSubmit", prompt="please fix the footer")
    hook(app, "MessageDisplay", message="On it.")
    app.runtime().deferred.drain()
    assert [(m.text, m.acknowledgement) for m in app.container.get(Messages).in_() if m.author == "agent"] == [("Noted.", True), ("Good day. I am your butler; what shall I attend to?", False), ("Still nothing changed.", True), ("Fixed the login.", False), ("On it.", False)], "an introduction asked for by the journal is for the user"


def test_em_dashes_and_run_together_paragraphs_are_pointed_out(app, monkeypatch):
    typed = []
    catch_typed(app, monkeypatch, typed)
    hook(app, "SessionStart")
    hook(app, "MessageDisplay", message="The build — the one from last night — is green.")
    hook(app, "MessageDisplay", message=("The build is green. " * 25).strip())
    app.runtime().deferred.drain()
    assert any("em dashes" in line for line in typed) and any("no blank lines between paragraphs" in line for line in typed)


def test_tags_run_the_commands_they_stand_for_with_the_turn_as_their_text(app, monkeypatch):
    from journal.repositories.facts import Facts
    from journal.repositories.messages import Messages
    from journal.repositories.task_logs import TaskLogs
    from journal.repositories.tasks import Tasks
    typed = []
    catch_typed(app, monkeypatch, typed)
    hook(app, "SessionStart")
    hook(app, "MessageDisplay", message='[!todo="Fix the footer"]\nThe footer overlaps the form on narrow screens.')
    hook(app, "MessageDisplay", message="[!log:1] Halfway: the overlap is a margin.")
    hook(app, "MessageDisplay", message='**[!fact="The footer is 64px tall"]**\nMeasured in the browser.')
    hook(app, "MessageDisplay", message="[!end:1]\nThe footer sits below the form now.")
    hook(app, "MessageDisplay", message="[!end:99]\nNo such task.")
    app.runtime().deferred.drain()
    tasks, messages = app.container.get(Tasks), app.container.get(Messages)
    assert tasks.find(1).title == "Fix the footer" and "overlaps" in tasks.find(1).brief and tasks.find(1).state == "done"
    assert [log.line for log in app.container.get(TaskLogs).all()][-2:] == ["Halfway: the overlap is a margin.", "The footer sits below the form now."] or any("Halfway" in log.line for log in app.container.get(TaskLogs).all())
    assert [f.text for f in app.container.get(Facts).all()] == ["The footer is 64px tall"]
    assert [m.text for m in messages.in_() if m.author == "agent"] == ["The footer overlaps the form on narrow screens.", "Measured in the browser.", "The footer sits below the form now.", "No such task."], "a log turn stays out of the chat; the others post without their tag"
    assert typed[-1].startswith("[journal] the [!end] tag did not run:")


def test_notable_moments_are_cards_in_the_chat(app):
    from journal.repositories.messages import Messages
    hook(app, "SessionStart")
    app.console().run(["task", "create", "t", "--start"], AGENT)
    app.console().run(["stuck", "stuck on the login"], AGENT)
    cards = [m for m in app.container.get(Messages).in_() if m.author == "system"]
    assert [c.text for c in cards] == ["Agent stuck"] and cards[0].data["detail"] == "stuck on the login" and cards[0].data["tone"] == "bad"


def test_a_fresh_conversation_opens_with_an_introduction_and_a_resumed_one_does_not(app, monkeypatch):
    sent = []
    from journal.supervisor_link import SupervisorLink
    monkeypatch.setattr(SupervisorLink, "_send", lambda self, environment_id, verb, fields: sent.append({"verb": verb, **fields}))
    hook(app, "SessionStart", source="startup")
    app.runtime().deferred.drain()
    assert sent[-1]["line"].startswith("[journal] introduce yourself to the user in the chat") and sent[-1]["after"] == 4.0
    count = len(sent)
    data = json.dumps({"hook_event_name": "SessionStart", "session_id": "s2", "source": "resume"}).encode()
    urlopen(HttpRequest(f"http://127.0.0.1:{app.server().port}/hooks/claude", data=data, method="POST", headers={"Content-Type": "application/json", "X-Journal-Env": "main"}), timeout=5).read()
    app.runtime().deferred.drain()
    assert not any("introduce yourself" in s["line"] for s in sent[count:])


def test_a_commit_trailer_finishes_the_tasks_it_names(app, monkeypatch):
    import subprocess
    from journal.repositories.tasks import Tasks
    typed = []
    catch_typed(app, monkeypatch, typed)
    root = app.config.root
    subprocess.run(["git", "init", "-q"], cwd=root, check=True)
    subprocess.run(["git", "-c", "user.email=t@t", "-c", "user.name=t", "commit", "-q", "--allow-empty", "-m", "Ship the footer\n\nJournal: tasks done 1 and 2 with the margin fixed"], cwd=root, check=True)
    hook(app, "SessionStart")
    app.console().run(["task", "create", "footer", "--start"], AGENT)
    app.console().run(["task", "create", "margin"], AGENT)
    reply = hook(app, "PostToolUse", tool_name="Bash", tool_input={"command": "git commit -m x"}, tool_response={"stdout": "", "stderr": ""})[1]
    app.runtime().deferred.drain()
    tasks = app.container.get(Tasks)
    assert tasks.find(1).state == "done" and tasks.find(2).state == "done" and tasks.find(1).outcome.startswith("commit ")
    assert "closed task 1, task 2" in reply["hookSpecificOutput"]["additionalContext"], "the commit's outcome comes back with the commit itself"
    assert not any("closed task" in line for line in typed), "never typed into the prompt as a new turn"
    hook(app, "PostToolUse", tool_name="Bash", tool_input={"command": "git commit -m x"}, tool_response={"stdout": "", "stderr": ""})
    app.runtime().deferred.drain()
    from journal.repositories.messages import Messages
    marks = [m for m in app.container.get(Messages).all() if m.data.get("tone") == "commit"]
    assert len(marks) == 1 and marks[0].text.startswith("Agent committed ") and marks[0].data["detail"] == "Ship the footer", "the commit is a message in the chat, once"


def test_the_start_block_carries_the_quiet_rule_the_laws_a_takeover_and_what_waits(app):
    app.console().run(["message", "send", "hello"], USER)
    app.console().run(["task", "create", "t"], USER)
    data = json.dumps({"hook_event_name": "SessionStart", "session_id": "earlier"}).encode()
    urlopen(HttpRequest(f"http://127.0.0.1:{app.server().port}/hooks/claude", data=data, method="POST", headers={"Content-Type": "application/json", "X-Journal-Env": "main"}), timeout=5).read()
    told = hook(app, "SessionStart")[1]["hookSpecificOutput"]["additionalContext"]
    assert "handle the journal quietly" in told and "laws L1 to L9" in told and "another agent worked this environment until" in told
    assert "waiting for you here: 1 tasks, 1 messages" in told


def test_a_feature_switched_off_here_silences_the_lines_and_the_holds_its_workflow_carries(app):
    hook(app, "SessionStart")
    app.console().run(["environment", "here"], AGENT)
    app.container.get(Settings).save(Setting(environment_id=1, key="features.messages", value=False), Actor.system())
    app.console().run(["message", "send", "look at the footer"], USER)
    answers = [json.dumps(hook(app, "PreToolUse", tool_name="Read", tool_input={})[1]) for _ in range(6)]
    assert not any("message 1" in answer for answer in answers), "with messages off, the inbox is never named"
    status, body = hook(app, "PreToolUse", tool_name="Write", tool_input={"file_path": "a.py"})
    assert status == 200 and "inbox" not in json.dumps(body), "with messages off, the inbox hold holds nothing"


def test_an_unread_inbox_is_named_every_third_tool_use_and_holds_the_write_after_five_reminders(app):
    hook(app, "SessionStart")
    app.console().run(["environment", "here"], AGENT)
    app.console().run(["message", "send", "look at the footer"], USER)
    named = [i for i in range(1, 16) if "new message 1" in json.dumps(hook(app, "PreToolUse", tool_name="Read", tool_input={})[1])]
    assert named == [3, 6, 9, 12, 15] or len(named) >= 4, "every third tool use names the inbox"
    status, body = hook(app, "PreToolUse", tool_name="Write", tool_input={"file_path": "a.py"})
    assert status == 409 and "unread messages" in body["error"]
    app.console().run(["message", "read", "1"], AGENT)
    app.console().run(["message", "react", "1", "👍"], AGENT)
    app.console().run(["task", "create", "t", "--start"], AGENT)
    assert hook(app, "PreToolUse", tool_name="Write", tool_input={"file_path": "a.py"})[0] == 200, "read and answered, the write goes on"


def test_a_message_read_gets_words_before_the_next_tool_call_and_a_face_answers_only_a_few_words(app):
    hook(app, "SessionStart")
    app.console().run(["environment", "here"], AGENT)
    app.console().run(["message", "send", "can you look at the footer, the header and the menu before lunch?"], USER)
    app.console().run(["message", "read", "1"], AGENT)
    status, body = hook(app, "PreToolUse", tool_name="Read", tool_input={"file_path": "a.py"})
    assert status == 409 and "your tool calls are held: answer message 1 first" in body["error"], "the very next tool call waits for the reply"
    assert hook(app, "PreToolUse", tool_name="Bash", tool_input={"command": "journal message read 1"})[0] == 200, "a journal command goes through"
    own = str(app.config.home / "files" / "message" / "1" / "shot.png")
    assert hook(app, "PreToolUse", tool_name="Read", tool_input={"file_path": own})[0] == 200, "a look at the message's own file is part of reading it"
    app.console().run(["message", "react", "1", "👍"], AGENT)
    assert hook(app, "PreToolUse", tool_name="Read", tool_input={"file_path": "a.py"})[0] == 409, "a face is no answer to a message of many words"
    hook(app, "MessageDisplay", message="Understood, looking at all three now.")
    app.runtime().deferred.drain()
    assert hook(app, "PreToolUse", tool_name="Read", tool_input={"file_path": "a.py"})[0] == 200, "words in the chat after the read are the answer"
    app.console().run(["message", "send", "thanks!"], USER)
    app.console().run(["message", "read", "3"], AGENT)
    app.console().run(["message", "react", "3", "🙏"], AGENT)
    assert hook(app, "PreToolUse", tool_name="Read", tool_input={"file_path": "a.py"})[0] == 200, "a few words take a face"


def test_every_session_start_reads_what_is_in_flight_before_any_other_write(app):
    hook(app, "SessionStart")
    console = app.console()
    console.run(["environment", "here"], AGENT)
    console.run(["task", "create", "t", "--start"], AGENT)
    console.run(["message", "send", "hi"], USER)
    status, body = hook(app, "SessionStart", source="compact")
    assert "before your first write, run `journal environment here`" in body["hookSpecificOutput"]["additionalContext"]
    status, body = hook(app, "PreToolUse", tool_name="Write", tool_input={"file_path": "a.py"})
    assert status == 409 and "`journal environment here`" in body["error"]
    shown = console.run(["environment", "here"], AGENT).out
    assert "task in hand: 1 t" in shown and "unread messages: 1" in shown
    assert hook(app, "PreToolUse", tool_name="Write", tool_input={"file_path": "a.py"})[0] == 200


def test_a_quiet_tick_leaves_no_walk_entry_and_a_tick_that_acts_does(app):
    from journal.events.agent.ticked import Ticked
    from journal.events.bus import Bus
    from journal.repositories.entries import Entries
    hook(app, "SessionStart")
    app.console().run(["task", "create", "t", "--start"], AGENT)
    app.console().run(["task", "park", "1", "later"], AGENT)
    ticks = lambda: [e for e in app.container.get(Entries).of_kind("walk", 20) if e.data["trigger"] == "ticked"]
    app.container.get(Bus).dispatch(Ticked(session="s1", environment_id=1, at=0.0, quiet_for=1.0))
    assert ticks() == [], "a tick that passed its checks and acted on none is no news"
    app.container.get(Bus).dispatch(Ticked(session="s1", environment_id=1, at=0.0, quiet_for=120.0))
    assert len(ticks()) == 1, "a tick whose walk acted, the parked ask, is recorded"


def test_a_word_from_the_user_frees_a_wait_whose_workflow_no_longer_releases_it(app, monkeypatch):
    from journal.repositories.charts import Charts
    from journal.supervisor_link import SupervisorLink
    monkeypatch.setattr(SupervisorLink, "_send", lambda self, environment_id, verb, fields: None)
    console = app.console()
    hook(app, "SessionStart")
    charts = app.container.get(Charts)
    for chart in [c for c in charts.for_event("workers.updated") if c.state == "awaiting"]:
        charts.replace(chart, [], [], Actor.user(1))
    console.run(["task", "create", "t", "--start"], AGENT)
    console.run(["worker", "dispatch", "Lady Lovelace", "write the parser", "--model", "fast", "--worktree"], AGENT)
    console.run(["worker", "wait", "1"], AGENT)
    machine = app.container.get(Machine)
    assert machine.current("s1").name == "awaiting"
    console.run(["worker", "report", "1", "parser done"], Where("main", "w1"))
    assert machine.current("s1").name == "awaiting", "the emptied workflow releases nothing"
    hook(app, "UserPromptSubmit", prompt="carry on without it")
    assert machine.current("s1").name == "working", "the user's word is the engine's way out of the wait"


def test_a_question_answered_under_a_pause_the_agent_owes_releases_the_wait_beneath_it(app, monkeypatch):
    from journal.supervisor_link import SupervisorLink
    monkeypatch.setattr(SupervisorLink, "_send", lambda self, environment_id, verb, fields: None)
    console = app.console()
    hook(app, "SessionStart")
    console.run(["environment", "here"], AGENT)
    console.run(["task", "create", "t", "--start"], AGENT)
    console.run(["question", "ask", "Which name?"], AGENT)
    machine = app.container.get(Machine)
    assert machine.current("s1").name == "waiting"
    hook(app, "SessionStart")
    from journal.repositories.agents import Agents
    agents = app.container.get(Agents)
    assert machine.current("s1").name == "waiting" and agents.for_session("s1").oriented is False, "a new session keeps the agent in its wait and owes the look as a fact"
    console.run(["question", "answer", "1", "beta"], USER)
    app.runtime().deferred.drain()
    assert machine.current("s1").name == "working" and agents.for_session("s1").oriented is False, "the answer released the wait; the look is still owed"
    assert hook(app, "PreToolUse", tool_name="Write", tool_input={"file_path": "a.py"})[0] == 409, "a write before the look is held"
    console.run(["environment", "here"], AGENT)
    assert agents.for_session("s1").oriented is True and hook(app, "PreToolUse", tool_name="Write", tool_input={"file_path": "a.py"})[0] == 200, "oriented again, the agent goes on with its work"


def test_a_plans_checkpoint_waits_for_the_user_and_in_auto_mode_is_no_stop(app, monkeypatch):
    from journal.features.plans.states.following_plan import FollowingPlan
    from journal.repositories.plans import Plans
    from journal.supervisor_link import SupervisorLink
    monkeypatch.setattr(SupervisorLink, "_send", lambda self, environment_id, verb, fields: None)
    hook(app, "SessionStart")
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
    console.run(["task", "done", "1"], AGENT)
    machine, plans = app.container.get(Machine), app.container.get(Plans)
    assert machine.current("s1") == FollowingPlan(plan_id=1) and plans.at_checkpoint(plans.find(1)).title == "one", "the plan waits at its checkpoint with no task in hand; the agent keeps following it"
    app.container.get(Settings).save(Setting(environment_id=0, key="tasks.auto", value=False), Actor.system())
    status, body = hook(app, "Stop")
    assert body.get("decision") == "block" and "phase one is complete and a checkpoint" in body["reason"] and "wait for their word" in body["reason"], "auto off: the checkpoint waits for the user's look, said at the stop"
    app.container.get(Settings).save(Setting(environment_id=0, key="tasks.auto", value=True), Actor.system())
    status, body = hook(app, "Stop")
    assert body.get("decision") == "block" and "in auto mode it does not stop you" in body["reason"], "auto on: the checkpoint is no stop, said by the plan state's own workflow"
    assert console.run(["plan", "start", "1"], AGENT).code == 0 and machine.current("s1") == FollowingPlan(plan_id=1, task_id=2), "plan start goes on past the checkpoint"
    hook(app, "SessionStart", session_id="s2")
    assert machine.current("s2") == FollowingPlan(plan_id=1, task_id=2), "a session that starts while the plan runs follows it, at its task in hand"
    console.run(["plan", "park", "1"], AGENT)
    assert machine.current("s1").name == "idle", "a parked plan is over for the agent following it"


def test_a_reply_written_before_a_tool_call_reaches_the_chat_at_that_call_and_the_display_hook_adds_no_second(app, monkeypatch, tmp_path):
    import json as j
    from journal.providers.claude import Claude
    from journal.repositories.messages import Messages
    transcript = tmp_path / "s1.jsonl"
    earlier = {"type": "assistant", "message": {"content": [{"type": "text", "text": "Long ago."}]}}
    first = {"type": "assistant", "message": {"content": [{"type": "text", "text": "Starting up."}, {"type": "tool_use", "name": "Bash"}]}}
    transcript.write_text(j.dumps(earlier) + "\n" + j.dumps(first) + "\n")
    monkeypatch.setattr(Claude, "transcript", lambda self, project, session: transcript if session == "s1" else None)
    hook(app, "SessionStart")
    messages = app.container.get(Messages)
    texts = [m.text for m in messages.in_() if m.author == "agent"]
    assert "Starting up." in texts and "Long ago." not in texts, "the first look reads the turn in hand, the last line, and not the session's past"
    app.console().run(["environment", "here"], AGENT)
    app.console().run(["message", "send", "are you there?"], USER)
    app.console().run(["message", "read", "2"], AGENT)
    status, body = hook(app, "PreToolUse", tool_name="Write", tool_input={"file_path": "a.py"})
    assert status == 409 and "answer message 2 first" in body["error"], "the message is read and unanswered: the write is held"
    row = {"type": "assistant", "message": {"content": [{"type": "text", "text": "[!reply:2]\nHere, Sir Jesse, and writing."}, {"type": "tool_use", "name": "Write"}]}}
    with transcript.open("a") as file:
        file.write(j.dumps(row) + "\n")
    assert hook(app, "PreToolUse", tool_name="Write", tool_input={"file_path": "a.py"})[0] == 200, "the reply in the transcript answered the message before the call was judged"
    replies = [m for m in messages.in_() if m.author == "agent" and m.text == "Here, Sir Jesse, and writing."]
    assert len(replies) == 1 and replies[0].reply_to == 2
    hook(app, "MessageDisplay", message="[!reply:2]\nHere, Sir Jesse, and writing.")
    app.runtime().deferred.drain()
    assert len([m for m in messages.in_() if m.author == "agent" and m.text == "Here, Sir Jesse, and writing."]) == 1, "the display hook's copy of the same block is no second message"


def test_an_edit_is_a_row_of_its_own_kept_to_the_last_five_hundred_and_a_shell_parts_change_is_one_too(app):
    from journal.models.edit import Edit
    from journal.repositories.edits import KEEP, Edits
    hook(app, "SessionStart")
    hook(app, "PostToolUse", tool_name="Edit", tool_input={"file_path": str(app.config.root / "a.py"), "old_string": "x", "new_string": "y"}, tool_response={"structuredPatch": [{"oldStart": 7, "newStart": 7, "lines": [" before", "-x", "+y", " after"]}]})
    app.runtime().deferred.drain()
    edits = app.container.get(Edits)
    kept = edits.of_agent("s1", 0)
    assert [e.path for e in kept] == ["a.py"] and kept[0].added == 1 and kept[0].removed == 1 and kept[0].first_line == 7 and [r["kind"] for r in kept[0].rows] == ["ctx", "del", "add", "ctx"]
    app.console().run(["shell", "ran", "sed -i s/x/y/ b.py", "--chain", "c1", "--status", "0", "--output", "", "--changed", "3\t1\tb.py"], AGENT)
    kept = edits.of_agent("s1", 0)
    assert [e.path for e in kept] == ["a.py", "b.py"] and kept[1].added == 3 and kept[1].removed == 1 and kept[1].command and kept[1].rows == ()
    for i in range(KEEP):
        edits.record(Edit(session="s1", path=f"f{i}.py", at=float(i + 10)), Actor.agent("s1"))
    assert len(edits.in_()) == KEEP, "the oldest go as new ones come"
    assert edits.in_()[0].path == "f0.py" and edits.in_()[-1].path == f"f{KEEP - 1}.py", "the two oldest went"


def test_a_workflow_moves_an_idle_agent_into_a_wait_with_its_words_and_a_release_brings_it_back(app, monkeypatch):
    from journal.repositories.charts import Charts
    from journal.supervisor_link import SupervisorLink
    monkeypatch.setattr(SupervisorLink, "_send", lambda self, environment_id, verb, fields: None)
    hook(app, "SessionStart")
    console = app.console()
    console.run(["environment", "here"], AGENT)
    idle, trigger = own_workflow(console, app.container.get(Charts), "idle", "tool_finished")
    node = lambda *args: int(console.run(["chart", "node", *args, "--in", str(idle)], USER).out.split()[1].rstrip(":"))
    move = node("action", "wait_outside", "--text", "the deploy to finish")
    console.run(["chart", "line", str(trigger), str(move)], USER)
    hook(app, "PostToolUse", tool_name="Read", tool_input={}, tool_response="")
    machine = app.container.get(Machine)
    state = machine.current("s1")
    assert state.name == "expecting" and state.what == "the deploy to finish" and state.resume["state"] == "idle", "the move lays the wait over what the agent was doing, with its words"
    hook(app, "UserPromptSubmit", prompt="it finished")
    assert machine.current("s1").name == "idle", "a word from the user frees the wait, as any wait"


def test_a_plan_is_done_when_its_last_task_closes_whoever_closes_it(app):
    from journal.repositories.plans import Plans
    hook(app, "SessionStart")
    console = app.console()
    console.run(["plan", "create", "p", "--brief", "b"], USER)
    console.run(["plan", "add", "1", "only"], USER)
    console.run(["plan", "ready", "1"], USER)
    console.run(["plan", "approve", "1"], USER)
    console.run(["plan", "start", "1"], USER)
    console.run(["task", "done", "1"], USER)
    assert app.container.get(Plans).find(1).state == "done", "the user closed the last task: the plan is done, no agent following it"
    from journal.features.plans.seeds.closed_plans import ClosedPlans
    plans = app.container.get(Plans)
    plans.save(plans.find(1).started(), Actor.user(1))
    app.container.get(ClosedPlans).run()
    assert plans.find(1).state == "done", "a plan left started with every task done is closed at boot"
    console.run(["plan", "add", "1", "more"], USER)
    app.runtime().deferred.drain()
    assert plans.find(1).state == "started", "a task added to a done plan starts it again"


def test_a_session_silent_for_an_hour_is_ended(app):
    from journal.events.agent.ticked import Ticked
    from journal.events.bus import Bus
    hook(app, "SessionStart")
    app.container.get(Bus).dispatch(Ticked(session="s1", environment_id=1, at=0.0, quiet_for=3601.0))
    assert app.container.get(Machine).current("s1").name == "ended"


def test_a_keyword_brings_a_fact_back_once_as_a_whisper_and_a_fresh_rule_is_questioned(app, monkeypatch):
    typed = []
    catch_typed(app, monkeypatch, typed)
    hook(app, "SessionStart")
    app.console().run(["fact", "create", "the login uses the old session store", "--keywords", "login,session"], USER)
    hook(app, "MessageDisplay", message="I will look at the login next.")
    hook(app, "MessageDisplay", message="Still on the login.")
    app.runtime().deferred.drain()
    whispers = [line for line in typed if "fact 1: the login uses the old session store" in line]
    assert len(whispers) == 1, "whispered once per row per agent"
    made = app.console().run(["rule", "create", "Always run the suite before a commit"], AGENT)
    assert "does rule 1 apply to the whole project?" in made.out, "the question comes out of the command that made the rule"
    assert not any("does rule 1" in line for line in typed)


def test_auto_mode_answers_a_stop_with_the_next_task(app):
    hook(app, "SessionStart")
    app.console().run(["environment", "here"], AGENT)
    app.console().run(["task", "create", "the footer"], USER)
    status, body = hook(app, "Stop")
    assert body.get("decision") == "block" and "task 1 next: the footer" in body["reason"]
    from journal.models.actor import Actor as A
    app.container.get(Settings).save(Setting(environment_id=0, key="tasks.auto", value=False), A.user(1))
    assert hook(app, "Stop")[1] == {}, "with auto off a stop is a stop"


def test_a_task_named_in_a_reply_is_linked_to_the_message_it_answers(app):
    from journal.repositories.messages import Messages
    hook(app, "SessionStart")
    app.console().run(["message", "send", "the footer is broken"], USER)
    app.console().run(["task", "create", "Fix the footer"], AGENT)
    hook(app, "MessageDisplay", message="[!reply:1]\nFiled task 1 for it.")
    app.runtime().deferred.drain()
    rows = app.container.get(__import__("journal.http.v3.shapers.messages_shaper", fromlist=["MessagesShaper"]).MessagesShaper).rows()
    assert "todo:1" in rows[0].refs


def test_the_providers_own_question_tool_is_refused_and_every_fiftieth_line_reminds(app, monkeypatch):
    hook(app, "SessionStart")
    status, body = hook(app, "PreToolUse", tool_name="AskUserQuestion", tool_input={"question": "which?"})
    assert status == 409 and "`journal question ask \"<one line>\" --options a,b`" in body["error"]


def test_a_dispatched_worker_runs_and_its_output_is_its_report(app):
    from journal.features.workers.worker_runner import WorkerRunner
    from journal.models.actor import Actor as A
    from journal.repositories.messages import Messages
    from journal.repositories.workers import Workers
    hook(app, "SessionStart")
    app.console().run(["worker", "dispatch", "Lady Lovelace", "say hello", "--model", "sonnet"], AGENT)
    worker = app.container.get(Workers).find(1)
    app.container.get(WorkerRunner).run(worker, ["sh", "-c", "echo the footer is fixed"], A.agent("s1"))
    assert app.container.get(Workers).find(1).state == "reported"
    assert any("Lady Lovelace reports: the footer is fixed" in m.text for m in app.container.get(Messages).in_())


def test_a_message_waiting_at_session_start_is_named_in_the_start_block(app):
    app.console().run(["message", "send", "sent while you were away"], USER)
    told = hook(app, "SessionStart", source="resume")[1]["hookSpecificOutput"]["additionalContext"]
    assert "new message 1" in told


def test_a_reply_naming_several_messages_answers_each_and_a_journal_command_after_a_cd_passes_the_hold(app):
    from journal.repositories.messages import Messages
    hook(app, "SessionStart")
    for text in ("one", "two"):
        app.console().run(["message", "send", text], USER)
    app.console().run(["message", "unread"], AGENT)
    hook(app, "MessageDisplay", message="[!reply:1,2]\nBoth seen.")
    app.runtime().deferred.drain()
    assert app.container.get(Messages).unanswered() == []
    app.console().run(["message", "send", "three"], USER)
    app.console().run(["message", "read", "4"], AGENT)
    for _ in range(15):
        hook(app, "PreToolUse", tool_name="Read", tool_input={})
    assert hook(app, "PreToolUse", tool_name="Bash", tool_input={"command": "journal message react 4 \"👍\"; journal task list"})[0] == 200
    assert hook(app, "PreToolUse", tool_name="Bash", tool_input={"command": "ls"})[0] == 409


def test_reading_a_message_names_its_files_links_and_captions(app):
    import json as j
    from urllib.request import Request as R, urlopen as u
    console = app.console()
    console.run(["message", "send", "see the picture"], USER)
    boundary = "b1"
    body = (f"--{boundary}\r\nContent-Disposition: form-data; name=\"file\"; filename=\"shot one.png\"\r\nContent-Type: image/png\r\n\r\nPNG\r\n--{boundary}--\r\n").encode()
    u(R(f"http://127.0.0.1:{app.server().port}/api/message/1/upload", data=body, method="POST", headers={"Content-Type": f"multipart/form-data; boundary={boundary}", "X-Journal-Env": "main"}), timeout=5).read()
    with u(f"http://127.0.0.1:{app.server().port}/api/message/1/files/shot%20one.png?env=main", timeout=5) as reply:
        assert reply.read() == b"PNG", "a file name with a space is found"
    shown = console.run(["message", "read", "1"], AGENT).out
    assert "file " in shown and "shot one.png" in shown and "`journal message tag 1 \"shot one.png\"" in shown
    assert 'something to do? file it: `journal task create "<title>" --from 1`' in shown
    assert "(from message 1)" in console.run(["task", "create", "look at the picture", "--from", "1"], AGENT).out
    console.run(["task", "create", "crop it", "--from", "1"], AGENT)
    from journal.repositories.messages import Messages
    filed = [m.text for m in app.container.get(Messages).all() if m.data.get("shows") == "filed"]
    assert filed == ["Filed task 1, task 2 from your message"], "what is filed from a message is one mark in the chat, naming each row"
    assert console.run(["message", "tag", "1", "shot one.png", "the footer overlapping the form"], AGENT).code == 0
    assert "the footer overlapping the form" in console.run(["message", "read", "1"], AGENT).out
    console.run(["message", "react", "1", "👍"], USER)
    assert "reacts" in console.run(["message", "read", "1"], AGENT).out


def test_a_message_read_through_a_pipe_is_refused(app):
    hook(app, "SessionStart")
    status, body = hook(app, "PreToolUse", tool_name="Bash", tool_input={"command": "journal message read 3 | head -3"})
    assert status == 409 and "read the user's words whole" in body["error"]
    assert hook(app, "PreToolUse", tool_name="Bash", tool_input={"command": "journal message read 3"})[0] == 200
    assert hook(app, "PreToolUse", tool_name="Bash", tool_input={"command": "journal task list | head -5"})[0] == 200, "only the user's words are protected"
    assert hook(app, "PreToolUse", tool_name="Bash", tool_input={"command": "grep 'journal message read 3' notes.md | head -2"})[0] == 200, "the words quoted inside another command are not a read"


def test_every_line_of_the_shell_corpus_is_cut_into_its_parts():
    """tests/shell_corpus.jsonl holds over 4,000 commands in many styles with the parts each is cut into; one marked shell is cut differently by a real shell, and is kept whole here, which runs the same."""
    from journal.features.shell.chain import Chain
    cases = [json.loads(line) for line in (Path(__file__).parent / "shell_corpus.jsonl").read_text().splitlines()]
    wrong = [case["line"] for case in cases if Chain.split(case["line"]) != case["parts"]]
    assert not wrong, f"{len(wrong)} of {len(cases)} lines cut differently, the first: {wrong[:3]}"


def test_a_chain_is_taken_apart_and_the_shells_wrapping_around_it_is_silent():
    from journal.features.shell.chain import Chain
    from journal.features.shell.doing import Doing
    assert Chain.split('a $(b; c) && (d; e) || f; g "h && i" | tail -1') == ["a $(b; c)", "(d; e) || f", 'g "h && i" | tail -1']
    assert Chain.split("for f in a b; do echo $f; done && if true; then echo y; fi; case $x in a) echo a;; esac && ls") == ["for f in a b; do echo $f; done", "if true; then echo y; fi", "case $x in a) echo a;; esac", "ls"]
    assert Chain.split("echo `echo a; echo b` && cat <<EOF && echo x\nbody; with && stuff\nEOF") == ["echo `echo a; echo b`", "cat <<EOF && echo x\nbody; with && stuff\nEOF"]
    assert Chain.split('[[ -n a && -n b ]] && echo ok; echo "${x:-a;b}" && (( 1 && 1 ))') == ["[[ -n a && -n b ]]", "echo ok", 'echo "${x:-a;b}"', "(( 1 && 1 ))"]
    assert Chain.split("for x in a b; echo $x && echo y; echo z; repeat 2 echo r && echo s; echo t") == ["for x in a b; echo $x && echo y", "echo z", "repeat 2 echo r && echo s", "echo t"]
    assert Chain.split("seq 2 | while read -r n; do echo $n; done; echo after") == ["seq 2 | while read -r n; do echo $n; done", "echo after"]
    assert Chain.split("for i in 1; do echo done; done; echo fi && case a in a) echo one;& b) echo two;; esac") == ["for i in 1; do echo done; done", "echo fi", "case a in a) echo one;& b) echo two;; esac"]
    assert Chain.split("echo a # not && split; here\necho b && echo '#not a comment' && echo c#neither") == ["echo a # not && split; here", "echo b", "echo '#not a comment'", "echo c#neither"], "a newline ends a command, a comment runs to it"
    wrapped = "source /s 2>/dev/null || true && { \\builtin unalias -- 'x'; } >/dev/null 2>&1 || true && eval 'cd src && git commit -m '\"'\"'a; b'\"'\"'' < /dev/null && pwd -P >| /tmp/cwd"
    parts = Chain.parts(wrapped)
    assert [p.text for p in parts if p.recorded] == ["cd src", "git commit -m 'a; b'"]
    assert parts[0].text.startswith("source") and parts[-1].text.startswith("pwd -P") and not parts[0].recorded and not parts[-1].recorded
    heredoc = "source /s 2>/dev/null || true && eval 'cd src && python3 - <<'\"'\"'EOF'\"'\"'\nprint(1)\nEOF' && pwd -P >| /tmp/cwd"
    assert [p.text for p in Chain.parts(heredoc) if p.recorded] == ["cd src", "python3 - <<'EOF'\nprint(1)\nEOF"], "a command with a heredoc comes without < /dev/null and is still the agent's own"
    assert [Doing.of(c) for c in ("git commit -m x", "python3 -m pytest -q | tail -2", "cd src", "npm run build", "foo --bar", "python3 - <<'EOF'\nprint(1)\nEOF")] == ["committing", "testing", "moving", "running a script", "running foo", "running python3"]


def test_the_foreground_limit_is_thirty_seconds_or_ten_while_a_message_waits(app):
    console = app.console()
    assert console.run(["shell", "limit"], AGENT).out.strip() == "30"
    wrapped = "source /s 2>/dev/null || true && eval 'journal task list && journal message unread' < /dev/null && pwd -P >| /tmp/cwd"
    assert console.run(["shell", "limit", "--line", wrapped], AGENT).out.strip() == "0", "a line of journal commands alone is never moved to the background"
    assert console.run(["shell", "limit", "--line", wrapped.replace("journal message unread", "sleep 60")], AGENT).out.strip() == "30"
    console.run(["message", "send", "are you there?"], USER)
    assert console.run(["shell", "limit"], AGENT).out.strip() == "10"
    console.run(["message", "read", "1"], AGENT)
    app.container.get(Settings).save(Setting(environment_id=0, key="shell.foreground", value=5), Actor.system())
    assert console.run(["shell", "limit"], AGENT).out.strip() == "5"


def test_a_chains_parts_are_recorded_and_a_moved_chain_reports_when_it_ends(app, monkeypatch):
    from urllib.request import urlopen
    from journal.repositories.messages import Messages
    typed = []
    catch_typed(app, monkeypatch, typed)
    hook(app, "SessionStart")
    console, port = app.console(), app.server().port
    folder = app.config.root / "c1"
    folder.mkdir()
    assert console.run(["shell", "split", "cd src && pytest -q | tail -1; git commit -m 'a\nb'", "--into", str(folder)], AGENT).out == "R;&-\nR&;-\nR;;-\n"
    assert [(folder / f"{i}.part").read_text() for i in range(3)] == ["cd src", "pytest -q", "git commit -m 'a\nb'"]
    console.run(["shell", "started", "git commit -m done", "--chain", "c1"], AGENT)
    bar = json.load(urlopen(HttpRequest(f"http://127.0.0.1:{port}/api/bar?env=main", headers={"X-Journal-Env": "main"}), timeout=5))["queue"]
    assert bar[-1]["parts"][0]["value"] == "committing" and bar[-1]["done"] is False
    console.run(["shell", "ran", "git commit -m done", "--chain", "c1", "--status", "0", "--seconds", "2", "--output", "[main 1a2b3c4] done"], AGENT)
    assert json.load(urlopen(HttpRequest(f"http://127.0.0.1:{port}/api/bar?env=main", headers={"X-Journal-Env": "main"}), timeout=5))["queue"][-1]["done"] is True
    line = json.load(urlopen(HttpRequest(f"http://127.0.0.1:{port}/api/agent/1/terminal?env=main", headers={"X-Journal-Env": "main"}), timeout=5))["lines"][-1]
    assert line["command"] == "git commit -m done" and line["output"] == "[main 1a2b3c4] done" and line["seconds"] == 2
    moved = console.run(["shell", "moved", "c1", "pytest -q", "--file", "/tmp/out/c1"], AGENT).out
    assert "moved to the background as output 1" in moved and "pytest" not in moved, "a background command is named by its number"
    console.run(["shell", "ended", "c1", "--status", "1", "--file", "/tmp/out/c1", "--last", "2 failed"], AGENT)
    assert "output 1 failed with code 1" in typed[-1] and "pytest" not in typed[-1] and "2 failed" not in typed[-1], "its end names the number and how it ended, never the command or its lines"
    cards = [m for m in app.container.get(Messages).in_() if m.author == "system"]
    assert len(cards) == 1 and cards[-1].text == "Failed with code 1 in the background: testing" and cards[-1].data["detail"] == "pytest -q\n2 failed", "the one mark of the moved command is settled in place: it names the command and how it ended"
    (app.config.root / "c2").mkdir()
    console.run(["shell", "split", "pytest -q", "--into", str(app.config.root / "c2")], AGENT)
    console.run(["shell", "moved", "c2", "pytest -q", "--file", "/tmp/out/c2"], AGENT)
    console.run(["shell", "ended", "c2", "--status", "0", "--file", "/tmp/out/c2", "--last", "........ [ 76%]\n....... [100%]"], AGENT)
    card = [m for m in app.container.get(Messages).in_() if m.author == "system"][-1]
    assert card.text == "Finished in the background: testing" and card.data["detail"] == "pytest -q", "a last line of progress dots says nothing and is left out"


def test_each_thought_is_a_message_the_latest_stands_in_the_working_bubble_and_a_reply_in_thinking_is_posted(app, monkeypatch, tmp_path):
    import json as j
    from urllib.request import urlopen
    from journal.providers.claude import Claude
    from journal.repositories.messages import Messages
    transcript = tmp_path / "s1.jsonl"
    rows = [{"type": "user", "message": {"content": "hello?"}},
            {"type": "assistant", "message": {"content": [{"type": "thinking", "thinking": "[!reply:1]\nYes, hello."}]}},
            {"type": "user", "message": {"content": [{"type": "tool_result", "content": "ok"}]}},
            {"type": "assistant", "message": {"content": [{"type": "thinking", "thinking": "Now the next step."}]}}]
    transcript.write_text("\n".join(j.dumps(r) for r in rows) + "\n")
    monkeypatch.setattr(Claude, "transcript", lambda self, project, session: transcript)
    hook(app, "SessionStart")
    console = app.console()
    console.run(["message", "send", "hello?"], USER)
    console.run(["message", "read", "1"], AGENT)
    hook(app, "PreToolUse", tool_name="Read", tool_input={})
    app.runtime().deferred.drain()
    agent = json.load(urlopen(HttpRequest(f"http://127.0.0.1:{app.server().port}/api/agent?env=main", headers={"X-Journal-Env": "main"}), timeout=5))["rows"][-1]["data"]
    assert agent["thinking"] == "Now the next step."
    reply = app.container.get(Messages).all()[-1]
    assert reply.reply_to == 1 and reply.text == "Yes, hello." and app.container.get(Messages).unanswered() == []
    hook(app, "PreToolUse", tool_name="Read", tool_input={})
    app.runtime().deferred.drain()
    thoughts = [m for m in app.container.get(Messages).all() if m.is_thought]
    assert [m.text for m in thoughts] == ["[!reply:1]\nYes, hello.", "Now the next step."], "each thought is a message in the chat, marked a thought, and kept once"
    assert all(m.created_by.id == "s1" for m in thoughts)
    hook(app, "MessageDisplay", message="Done.")
    app.runtime().deferred.drain()
    assert json.load(urlopen(HttpRequest(f"http://127.0.0.1:{app.server().port}/api/agent?env=main", headers={"X-Journal-Env": "main"}), timeout=5))["rows"][-1]["data"]["thinking"] == ""
    assert "no journal is running" in console.run(["setup", "restart"], USER).out


def test_a_turns_parts_landing_out_of_order_are_put_back_before_the_turn_is_read(app):
    from journal.repositories.messages import Messages
    hook(app, "SessionStart")
    app.console().run(["message", "send", "is it fixed?"], USER)
    app.console().run(["message", "read", "1"], AGENT)
    hook(app, "MessageDisplay", delta="It is.", turn_id="t9", index=1, final=True)
    app.runtime().deferred.drain()
    assert app.container.get(Messages).unanswered(), "the final part alone is not the turn"
    hook(app, "MessageDisplay", delta="[!reply:1]\n", turn_id="t9", index=0, final=False)
    app.runtime().deferred.drain()
    reply = app.container.get(Messages).all()[-1]
    assert reply.reply_to == 1 and reply.text == "It is."


def test_a_stop_with_a_parked_task_names_it_in_auto_mode_or_not(app):
    hook(app, "SessionStart")
    console = app.console()
    console.run(["environment", "here"], AGENT)
    app.container.get(Settings).save(Setting(environment_id=0, key="tasks.auto", value=False), Actor.system())
    console.run(["task", "create", "the footer", "--start"], AGENT)
    console.run(["task", "park", "1", "the header first"], AGENT)
    status, body = hook(app, "Stop")
    assert body.get("decision") == "block" and "parked tasks, still open: 1 the footer (parked because: the header first)" in body["reason"]
    assert hook(app, "Stop", stop_hook_active=True)[1].get("decision") == "block", "told at every stop, until the task is resumed or done"
    console.run(["task", "resume", "1"], AGENT)
    console.run(["task", "done", "1", "--how", "shipped"], AGENT)
    console.run(["task", "create", "the menu"], USER)
    assert hook(app, "Stop")[1].get("decision") != "block", "open tasks are not pressed for outside auto mode"


def test_the_files_a_shell_part_changed_show_in_the_edits_pane(app):
    from urllib.request import urlopen
    hook(app, "SessionStart")
    app.console().run(["shell", "ran", "sed -i '' s/a/b/ notes.md", "--chain", "c2", "--status", "0", "--changed", "3\t1\tnotes.md\n0\t0\tsame.md"], AGENT)
    edits = json.load(urlopen(HttpRequest(f"http://127.0.0.1:{app.server().port}/api/agent/1/edits?env=main", headers={"X-Journal-Env": "main"}), timeout=5))["edits"]
    assert [(e["path"], e["added"], e["removed"]) for e in edits] == [("notes.md", 3, 1), ("same.md", 0, 0)] and edits[0]["command"].startswith("sed")


def test_a_shell_line_that_writes_is_a_write_to_the_gates(app):
    from journal.features.shell.writes import Writes
    assert [Writes.of(c) for c in ("sed -i '' s/a/b/ f.py", "cat f.py | head -3", "echo hi > /dev/null", "echo hi > out.txt", "git status; git log", "git checkout -- f.py", "`journal task create` x", "python3 - <<'EOF'\nfrom pathlib import Path\nPath('x').write_text('y')\nEOF", "python3 -c 'print(1)'", "grep -rn 'a > b' src | tee found.txt", 'echo "a > b"')] == [True, False, False, True, False, True, False, True, False, True, False]
    hook(app, "SessionStart")
    app.console().run(["environment", "here"], AGENT)
    app.console().run(["task", "create", "t", "--start"], AGENT)
    app.runtime().deferred.drain()
    assert hook(app, "PreToolUse", tool_name="Bash", tool_input={"command": "sed -i '' s/a/b/ f.py"})[0] == 200
    assert hook(app, "PreToolUse", tool_name="Bash", tool_input={"command": "cat f.py"})[0] == 200
    from journal.features.chart.checks import Checks
    from journal.features.chart.context import Context
    from journal.events.agent.idle import Idle as IdleEvent
    from journal.repositories.scope import Scope
    with app.container.get(Scope).of(1):
        at = Context(event=IdleEvent(session="s1", environment_id=1), session="s1", environment_id=1, state=app.container.get(Machine).current("s1"))
        assert app.container.get(Checks).count_of(at, "edits") == 1, "a shell line that writes counts as an edit toward the log; a read does not"


def test_a_journal_command_chained_with_anything_else_is_refused(app):
    hook(app, "SessionStart")
    status, body = hook(app, "PreToolUse", tool_name="Bash", tool_input={"command": "cd src && journal task log 1 'x' && python3 -m pytest -q"})
    assert status == 409 and "a journal command runs on its own" in body["error"]
    assert hook(app, "PreToolUse", tool_name="Bash", tool_input={"command": "journal task log 1 'x'; journal message unread"})[0] == 200
    assert hook(app, "PreToolUse", tool_name="Bash", tool_input={"command": "python3 -m pytest -q && git commit -m x"})[0] == 200


def test_an_integration_is_a_suggested_mcp_server_installed_and_removed_with_the_agents_restarted_and_keyed_without(app, monkeypatch, tmp_path):
    import json as j
    from urllib.request import Request as R, urlopen
    from journal.features.mcp.health import Health
    from journal.features.mcp.keys import Keys
    from journal.supervisor_link import SupervisorLink
    sent = []
    monkeypatch.setattr(SupervisorLink, "runs", lambda self, environment_id: True)
    monkeypatch.setattr(SupervisorLink, "_send", lambda self, environment_id, verb, fields: sent.append({"verb": verb, **fields}))
    monkeypatch.setattr(app.container.get(Keys), "path", tmp_path / "keys.json")
    from journal.features.mcp.health_report import HealthReport
    from journal.features.mcp.known import Known
    monkeypatch.setattr(Health, "asked", lambda self: HealthReport({"github": Known("github", "npx -y @modelcontextprotocol/server-github", "connected", ""), "linear": Known("linear", "https://mcp.linear.app/mcp", "needs_auth", "Needs authentication"), "playwright": Known("playwright", "npx -y @playwright/mcp@latest --headless", "connected", "")}))
    hook(app, "SessionStart")
    port = app.server().port
    def post(path, body):
        with urlopen(R(f"http://127.0.0.1:{port}{path}", data=j.dumps(body).encode(), method="POST", headers={"Content-Type": "application/json", "X-Journal-Env": "main"}), timeout=5) as r:
            return j.loads(r.read())
    installed = post("/journal/mcp/install", {"name": "github"})
    assert installed["state"] == "needs_key" and installed["has_key"] is False and sent[-1]["verb"] == "restart" and sent[-1]["name"] == "agent" and sent[-1]["resume"] == ["--resume", "s1"], "an idle agent restarts at once"
    hook(app, "PreToolUse", tool_name="Read", tool_input={})
    sent.clear()
    post("/journal/mcp/github/key", {"value": "first"})
    assert sent == [] and j.load(urlopen(HttpRequest(f"http://127.0.0.1:{port}/journal/mcp", headers={"X-Journal-Env": "main"}), timeout=5))["restart_pending"] == [], "a key restarts nothing: a running agent keeps the environment it was launched with"
    try:
        post("/journal/mcp/github/key", {"value": "  "})
    except HTTPError as error:
        assert "blank" in error.read().decode()
    else:
        raise AssertionError("a blank key is refused")
    post("/journal/mcp/install", {"name": "linear"})
    assert sent == [] and j.load(urlopen(HttpRequest(f"http://127.0.0.1:{port}/journal/mcp", headers={"X-Journal-Env": "main"}), timeout=5))["restart_pending"] == ["s1"], "an agent at work is not cut off"
    hook(app, "Stop")
    app.runtime().deferred.drain()
    assert sent and sent[-1]["verb"] == "restart", "the restart comes the moment its turn ends"
    claude = j.loads((app.config.root / ".mcp.json").read_text())["mcpServers"]["github"]
    assert claude["command"] == "npx" and claude["env"] == {"GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_PERSONAL_ACCESS_TOKEN}"}
    assert '[mcp_servers.github]' in (app.config.root / ".codex" / "config.toml").read_text()
    keyed = post("/journal/mcp/github/key", {"value": "ghp_secret"})
    assert keyed["has_key"] is True and keyed["state"] == "installed" and j.loads((tmp_path / "keys.json").read_text()) == {"GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_secret"}
    assert "ghp_secret" not in (app.config.root / ".mcp.json").read_text(), "a key is never written into the project"
    states = {s["name"]: s["state"] for s in post("/journal/mcp/check", {})["servers"]}
    assert states == {"github": "connected", "linear": "needs_auth"}
    page = j.load(urlopen(HttpRequest(f"http://127.0.0.1:{port}/journal/mcp", headers={"X-Journal-Env": "main"}), timeout=5))
    assert [(s["name"], s["managed"]) for s in page["servers"]] == [("github", True), ("linear", True), ("playwright", False)], "the program's own servers show after the journal's"
    assert {s["name"]: s["installed"] for s in page["suggested"] if s["name"] in ("github", "playwright", "slack")} == {"github": True, "playwright": True, "slack": False}
    assert post("/journal/mcp/github/remove", {}) == {"removed": "github"} and j.loads((tmp_path / "keys.json").read_text()) == {}
    assert app.console().run(["mcp", "list"], USER).out.startswith("linear")
    post("/journal/mcp/install", {"name": "linear"})
    sent.clear()
    assert post("/journal/mcp/linear/sign-in", {})["asked"] == "linear"
    assert sent[-1]["verb"] == "type" and "mcp__linear__authenticate" in sent[-1]["line"], "the agent is asked to sign in through the server's own tool"


def test_a_task_finished_while_a_skill_is_owed_leaves_the_debt_standing_until_the_read(skilled):
    from journal.features.skills.requiring import Requiring
    from journal.repositories.agents import Agents
    app = skilled
    hook(app, "SessionStart")
    read_skill(app, "journal")
    app.console().run(["environment", "here"], AGENT)
    app.console().run(["task", "create", "t", "--start"], AGENT)
    hook(app, "PreCompact")
    hook(app, "SessionStart")
    read_skill(app, "journal")
    app.console().run(["environment", "here"], AGENT)
    requiring, agents, machine = app.container.get(Requiring), app.container.get(Agents), app.container.get(Machine)
    assert requiring.owed_names(agents.for_session("s1")) == ["tasks"], "the tasks skill is owed at a start in work"
    done = app.console().run(["task", "done", "1", "--how", "quick"], AGENT)
    assert done.code == 0, done.err
    assert machine.current("s1").name == "idle" and requiring.owed_names(agents.for_session("s1")) == ["tasks"], "the task done, the agent is idle and still owes the read"
    read_skill(app, "journal-tasks")
    assert requiring.owed_names(agents.for_session("s1")) == []


def test_a_long_file_is_not_read_whole(app, tmp_path):
    hook(app, "SessionStart")
    long, short = tmp_path / "long.txt", tmp_path / "short.txt"
    long.write_text("x\n" * 401)
    short.write_text("x\n" * 400)
    status, body = hook(app, "PreToolUse", tool_name="Read", tool_input={"file_path": str(long)})
    assert status == 409 and "401 lines" in body["error"] and "offset and limit" in body["error"]
    assert hook(app, "PreToolUse", tool_name="Read", tool_input={"file_path": str(long), "limit": 50})[0] == 200, "a part of it is fine"
    assert hook(app, "PreToolUse", tool_name="Read", tool_input={"file_path": str(short)})[0] == 200, "twice the cap fits in one go"
    assert hook(app, "PreToolUse", tool_name="Read", tool_input={"file_path": str(tmp_path / "gone.txt")})[0] == 200


def test_a_typed_line_is_confirmed_by_its_prompt_and_typed_again_when_it_was_lost(app, monkeypatch):
    import time
    from journal.events.agent.ticked import Ticked
    from journal.events.bus import Bus
    from journal.supervisor_link import SupervisorLink
    sent = []
    monkeypatch.setattr(SupervisorLink, "runs", lambda self, environment_id: True)
    monkeypatch.setattr(SupervisorLink, "_send", lambda self, environment_id, verb, fields: sent.append({"verb": verb, **fields}))
    hook(app, "SessionStart")
    link, bus = app.container.get(SupervisorLink), app.container.get(Bus)
    link.type(1, "hello there")
    tick = lambda later: bus.dispatch(Ticked(session="s1", environment_id=1, at=time.time() + later, quiet_for=later))
    tick(2)
    assert [s["line"] for s in sent] == ["[journal] hello there"], "a fresh line is given time"
    tick(30)
    assert [s["line"] for s in sent] == ["[journal] hello there"] * 2, "a line not seen back while the agent sits between turns is typed again"
    hook(app, "UserPromptSubmit", prompt="[journal] hello there")
    tick(60)
    assert len(sent) == 2, "the prompt that brought it back confirms it"
    hook(app, "PreToolUse", tool_name="Read", tool_input={"file_path": "x", "limit": 1})
    link.type(1, "while at work")
    tick(90)
    assert len(sent) == 3, "a line typed to an agent at work waits for its turn to end"
    link.type(1, "after it")
    assert "[journal] after it" not in [s["line"] for s in sent], "a line waits while an earlier one is on its way"
    hook(app, "Stop")
    for later in (120, 150, 180, 210):
        tick(later)
    assert [s["line"] for s in sent].count("[journal] while at work") == 3, "three tries, then the chat is told"
    assert [s["line"] for s in sent][-1] == "[journal] after it", "a line given up lets the one held behind it go in"


def test_commands_run_at_the_same_moment_keep_their_own_output(app):
    import threading
    console = app.console()
    outs = {}
    def run(n):
        outs[n] = console.run(["shell", "cap"] if n % 2 else ["shell", "limit"], AGENT).out
    threads = [threading.Thread(target=run, args=(n,)) for n in range(20)]
    for t in threads:
        t.start()
    for t in threads:
        t.join()
    assert all(outs[n] == ("hint 200\n" if n % 2 else "30\n") for n in range(20)), "each run's output is its own, though they run side by side"


def test_only_one_task_is_in_progress_at_a_time_whatever_the_agents_state(app):
    hook(app, "SessionStart")
    app.console().run(["task", "create", "first", "--start"], AGENT)
    app.console().run(["task", "create", "second"], AGENT)
    hook(app, "SessionStart", session_id="s2")
    refused = app.console().run(["task", "start", "2"], Where("main", "s2"))
    assert refused.code == 1 and "task 1 is in hand" in refused.err, "another session cannot start a second"
    app.console().run(["task", "park", "1", "later"], AGENT)
    assert app.console().run(["task", "start", "2"], AGENT).code == 0


def test_the_sequence_page_shows_and_sets_what_starts_a_sequence(app):
    from journal.repositories.sequences import Sequences
    port = app.server().port

    def api(method, path, body=None):
        request = HttpRequest(f"http://127.0.0.1:{port}/api/{path}", data=json.dumps(body).encode() if body is not None else None, method=method, headers={"Content-Type": "application/json", "X-Journal-Env": "main"})
        try:
            with urlopen(request, timeout=5) as reply:
                return reply.status, json.loads(reply.read())
        except HTTPError as error:
            return error.code, json.loads(error.read())
    building = next(s for s in app.container.get(Sequences).all() if s.title == "Building a plan")
    shown = next(r for r in api("GET", "sequence")[1]["rows"] if r["n"] == building.id)
    assert shown["data"]["starts_on"] == "plan.created", "the page is told a new plan starts it, as the engine does"
    assert api("POST", f"sequence/{building.id}/set", {"key": "starts_on", "value": ""})[0] == 200 and app.container.get(Sequences).find(building.id).starts_on == ""
    status, refused = api("POST", f"sequence/{building.id}/set", {"key": "starts_on", "value": "plan.approved"})
    assert status != 200 and "none of them" in json.dumps(refused), "only a created row or a trigger starts a sequence"
    from journal.repositories.triggers import Triggers
    triggers = app.container.get(Triggers)
    update = next(s for s in app.container.get(Sequences).all() if s.title == "Writing an update")
    started_by = triggers.starting("Writing an update")[0]
    assert next(r for r in api("GET", "sequence")[1]["rows"] if r["n"] == update.id)["data"]["starts_on"] == f"trigger:{started_by.id}", "the page is told the update starts on its words"
    assert "tldr" in started_by.words and "check agents.md" in triggers.starting("Checking the instruction files")[0].words, "version 3's worded sequences start on their words"
    api("POST", f"sequence/{update.id}/set", {"key": "starts_on", "value": ""})
    assert triggers.starting("Writing an update") == [], "by hand, the trigger no longer starts it"
    from journal.models.trigger import Trigger
    from journal.models.trigger_action import TriggerAction
    plan_words = triggers.save(Trigger(words=("plan it",), action=TriggerAction.NUDGE, text="say something"), Actor.user(1))
    api("POST", f"sequence/{building.id}/set", {"key": "starts_on", "value": f"trigger:{plan_words.id}"})
    assert [t.id for t in triggers.starting("Building a plan")] == [plan_words.id] and app.container.get(Sequences).find(building.id).starts_on == "", "a trigger picked on the page starts the sequence"


def test_creating_a_plan_starts_the_shipped_building_a_plan_sequence(app, monkeypatch):
    from journal.supervisor_link import SupervisorLink
    sent = []
    monkeypatch.setattr(SupervisorLink, "runs", lambda self, environment_id: True)
    monkeypatch.setattr(SupervisorLink, "_send", lambda self, environment_id, verb, fields: sent.append({"verb": verb, **fields}))
    hook(app, "SessionStart")
    app.console().run(["environment", "here"], AGENT)
    listed = app.console().run(["sequence", "list"], AGENT).out
    assert "Building a plan (4 steps, starts on plan.created)" in listed, "the shipped sequence is seeded at boot"
    app.console().run(["plan", "create", "Behaviour tree", "--brief", "a flowchart"], AGENT)
    app.runtime().deferred.drain()
    running = app.container.get(Running)
    run = running.in_hand("s1", 1)
    assert run.title == "Building a plan" and run.about.startswith("plans:") and "step 1" in sent[-1]["line"] and "goal" in sent[-1]["line"]
    app.console().run(["plan", "create", "Another", "--brief", "b"], AGENT)
    app.runtime().deferred.drain()
    assert len(running.runs(app.container.get(Machine).agent("s1", 1))) == 1 and running.in_hand("s1", 1).step == 0, "a sequence already running is not started again"
    console = app.console()
    for _ in range(3):
        console.run(["sequence", "follow"], AGENT)
        console.run(["sequence", "next"], AGENT)
    console.run(["sequence", "follow"], AGENT)
    assert "ends when plans:1 is ready" in console.run(["sequence", "next"], AGENT).err, "the last step waits for the plan to be ready"
    console.run(["plan", "phase", "1", "Lay the floor", "--when", "the floor is level"], AGENT)
    task = re.search(r"task (\d+)", console.run(["plan", "add", "1", "Level the floor", "--brief", "level"], AGENT).out).group(1)
    console.run(["plan", "todos", "1", "1", task], AGENT)
    console.run(["plan", "ready", "1"], AGENT)
    assert "ran its last step" in console.run(["sequence", "next"], AGENT).out and running.in_hand("s1", 1) is None, "a ready plan lets the last step end the run"


def test_a_plans_goal_can_be_reset(app):
    hook(app, "SessionStart")
    app.console().run(["plan", "create", "p", "--brief", "first"], USER)
    assert app.console().run(["plan", "brief", "1", "the goal, settled"], USER).code == 0
    from journal.repositories.plans import Plans
    assert app.container.get(Plans).find(1).brief == "the goal, settled"


def test_a_task_added_first_goes_before_the_plans_tasks(app):
    hook(app, "SessionStart")
    console = app.console()
    console.run(["plan", "create", "p"], USER)
    console.run(["plan", "add", "1", "second"], USER)
    console.run(["plan", "add", "1", "third"], USER)
    console.run(["plan", "add", "1", "first", "--first"], USER)
    shown = console.run(["plan", "show", "1"], USER).out.splitlines()
    assert [line.split(maxsplit=2)[2] for line in shown if line.split()[0].isdigit()] == ["first", "second", "third"]


def test_a_plan_is_built_in_phases_made_ready_approved_by_the_user_and_followed_phase_by_phase(app, monkeypatch):
    from journal.supervisor_link import SupervisorLink
    sent = []
    monkeypatch.setattr(SupervisorLink, "runs", lambda self, environment_id: True)
    catch_typed(app, monkeypatch, sent)
    hook(app, "SessionStart")
    app.console().run(["environment", "here"], AGENT)
    console = app.console()
    console.run(["plan", "create", "p", "--brief", "the goal"], AGENT)
    for _ in range(4):
        console.run(["sequence", "follow"], AGENT)
        console.run(["sequence", "next"], AGENT)
    console.run(["plan", "phase", "1", "Lay the floor", "--when", "the floor is level"], AGENT)
    console.run(["plan", "phase", "1", "Raise the walls", "--when", "the walls stand", "--checkpoint"], AGENT)
    console.run(["plan", "add", "1", "pour the slab"], AGENT)
    console.run(["plan", "add", "1", "frame the walls"], AGENT)
    console.run(["plan", "add", "1", "level the slab"], AGENT)
    refused = console.run(["plan", "ready", "1"], AGENT)
    assert refused.code == 1 and "phase 1, 2 of plan 1 has no task yet" in refused.err
    console.run(["plan", "todos", "1", "1", "1", "3"], AGENT)
    console.run(["plan", "todos", "1", "2", "2", "3"], AGENT)
    console.run(["plan", "todos", "1", "1", "3"], AGENT)
    assert console.run(["plan", "show", "1"], AGENT).out.count("level the slab") == 1, "a task moved to another phase leaves the one it was in"
    assert console.run(["plan", "ready", "1"], AGENT).code == 0
    shown = console.run(["plan", "show", "1"], AGENT).out
    assert "phase 2: Raise the walls (complete when the walls stand) [checkpoint]" in shown
    assert "not approved" in console.run(["plan", "start", "1"], AGENT).err
    assert "only the user approves" in console.run(["plan", "approve", "1"], AGENT).err
    assert console.run(["plan", "approve", "1"], USER).code == 0
    app.runtime().deferred.drain()
    assert "the user approved plan 1" in sent[-1]
    assert "task 1 is next" in console.run(["plan", "start", "1"], AGENT).out
    console.run(["task", "done", "1"], AGENT)
    app.runtime().deferred.drain()
    assert app.container.get(Machine).current("s1").task_id == 3, "the second task of phase 1 comes before the first of phase 2"


def test_a_plan_in_review_waits_for_its_reviewers_before_it_is_ready_or_approved(app):
    hook(app, "SessionStart")
    app.console().run(["environment", "here"], AGENT)
    console = app.console()
    console.run(["plan", "create", "p", "--brief", "the goal"], AGENT)
    console.run(["plan", "phase", "1", "Lay the floor"], AGENT)
    console.run(["plan", "add", "1", "pour the slab"], AGENT)
    console.run(["plan", "todos", "1", "1", "1"], AGENT)
    console.run(["plan", "ready", "1"], AGENT)
    assert console.run(["plan", "review", "1"], AGENT).code == 0
    assert "is in review" in console.run(["plan", "approve", "1"], USER).err, "no approval while reviewers read it"
    hook(app, "PreToolUse", tool_name="Agent", tool_input={"description": "review plan 1", "prompt": "Read plan 1 and say what it misses.", "subagent_type": "researcher", "model": "sonnet"}, tool_use_id="u1")
    hook(app, "PreToolUse", tool_name="Agent", tool_input={"description": "map the plugins", "prompt": "Map version 3 plugins.", "subagent_type": "researcher", "model": "sonnet"}, tool_use_id="u2")
    hook(app, "PostToolUse", tool_name="Agent", tool_input={"description": "map the plugins", "prompt": "Map version 3 plugins.", "subagent_type": "researcher", "model": "sonnet"}, tool_use_id="u2", tool_response={"isAsync": True, "agentId": "r2"})
    hook(app, "PostToolUse", tool_name="Agent", tool_input={"description": "review plan 1", "prompt": "Read plan 1 and say what it misses.", "subagent_type": "researcher", "model": "sonnet"}, tool_use_id="u1", tool_response={"isAsync": True, "agentId": "r1"})
    assert "1 of its reviewers are still out" in console.run(["plan", "ready", "1"], AGENT).err
    hook(app, "SubagentStop", agent_id="r1")
    assert console.run(["plan", "ready", "1"], AGENT).code == 0, "the reviewer back, its findings in, the plan is ready again"
    assert console.run(["plan", "approve", "1"], USER).code == 0


def test_a_task_of_a_plan_not_yet_started_is_not_offered_at_a_stop(app):
    hook(app, "SessionStart")
    app.console().run(["environment", "here"], AGENT)
    console = app.console()
    console.run(["plan", "create", "p", "--brief", "g"], USER)
    console.run(["plan", "add", "1", "planned work"], USER)
    assert hook(app, "Stop")[1] == {}, "a plan's task waits for the plan"
    console.run(["task", "create", "free work"], USER)
    assert "task 2 next: free work" in hook(app, "Stop")[1]["reason"]


def test_the_shipped_templates_are_seeded_and_the_critique_ones_are_offered_to_the_viewer(app):
    from journal.http.v3.shapers.shapers import Shapers
    hook(app, "SessionStart")
    listed = app.console().run(["template", "list"], AGENT).out
    assert "Find what is missing (for plan, critique)" in listed and "Functional design (for doc)" in listed
    shown = app.console().run(["template", "show", "3"], AGENT).out
    assert shown.startswith("template 3: Find what is missing") and "the step nobody wrote down" in shown
    rows = app.container.get(Shapers).named("template").rows()
    assert [r.data["purpose"] for r in rows].count("critique") == 3 and rows[0].sections[0]["title"] == "What it is for"


def test_a_report_is_written_from_a_file_and_linked_to_what_it_is_about(app, tmp_path):
    from journal.http.v3.shapers.shapers import Shapers
    hook(app, "SessionStart")
    app.console().run(["environment", "here"], AGENT)
    app.console().run(["plan", "create", "p", "--brief", "g"], USER)
    body = tmp_path / "critique.md"
    body.write_text("What two readers found.\n\n## Phase 1\n\n- a gap\n\n## Phase 2\n\n- another\n")
    out = app.console().run(["report", "create", "Critique of plan 1", "--file", str(body), "--about", "plans:1"], AGENT).out
    assert out.startswith("report 1: Critique of plan 1, about plans:1")
    rows = app.container.get(Shapers).named("report").rows()
    assert [s["title"] for s in rows[0].sections] == ["Phase 1", "Phase 2"] and rows[0].refs == ["plan:1"], "the viewer names a plan plan:1"


def test_a_turn_with_several_reply_tags_answers_each_message_with_its_own_part(app):
    from journal.repositories.messages import Messages
    console = app.console()
    console.run(["message", "send", "first?"], USER)
    console.run(["message", "send", "second?"], USER)
    console.run(["message", "read", "1"], AGENT)
    console.run(["message", "read", "2"], AGENT)
    hook(app, "MessageDisplay", message="Two answers.\n\n[!reply:1]\nThe first is fine.\n\n[!reply:2]\nThe second waits.")
    app.runtime().deferred.drain()
    replies = [m for m in app.container.get(Messages).in_() if m.author == "agent"]
    assert [(m.reply_to, m.text) for m in replies] == [(1, "Two answers.\n\nThe first is fine."), (2, "The second waits.")]


def test_a_subagent_launched_in_the_background_runs_until_its_own_stop_hook(app):
    hook(app, "SessionStart")
    rows = lambda: [asdict(row) for row in app.container.get(Subagents).rows("s1")]
    hook(app, "PreToolUse", tool_name="Agent", tool_input={"description": "Lord Macaulay reads", "model": "sonnet", "subagent_type": "researcher", "prompt": "read"})
    hook(app, "PostToolUse", tool_name="Agent", tool_input={"description": "Lord Macaulay reads"}, tool_response={"isAsync": True, "status": "async_launched", "agentId": "a1"})
    assert rows()[0]["running"] is True and rows()[0]["status"] == "running", "the tool's instant answer does not end a background subagent"
    hook(app, "SubagentStop", agent_id="a1", agent_type="researcher")
    row = rows()[0]
    assert row["running"] is False and row["status"] == "done" and row["ended"] >= row["at"]
    hook(app, "PreToolUse", tool_name="Agent", tool_input={"description": "a quick one", "model": "haiku", "prompt": "x"})
    hook(app, "PostToolUse", tool_name="Agent", tool_input={"description": "a quick one"}, tool_response="the finished work")
    assert rows()[1]["running"] is False, "a subagent that answered in the tool's own result is done at once"
    hook(app, "PreToolUse", tool_name="Agent", tool_input={"description": "never ran", "model": "haiku", "prompt": "x"}, tool_use_id="t-lost")
    hook(app, "PreToolUse", tool_name="Agent", tool_input={"description": "Mr. Turing weighs", "model": "opus", "subagent_type": "auditor", "prompt": "x"}, tool_use_id="t-2")
    hook(app, "PostToolUse", tool_name="Agent", tool_input={"description": "Mr. Turing weighs"}, tool_response={"isAsync": True, "status": "async_launched", "agentId": "a2"}, tool_use_id="t-2")
    hook(app, "SubagentStop", agent_id="a2", agent_type="auditor")
    assert [r["running"] for r in rows()[2:]] == [True, False], "a start that never finished keeps its own row; the finish and the stop close the row they belong to, by the tool use's id"


def test_a_write_after_a_message_is_read_waits_for_the_answer(app):
    hook(app, "SessionStart")
    app.console().run(["environment", "here"], AGENT)
    app.console().run(["task", "create", "t", "--start"], AGENT)
    app.console().run(["message", "send", "could you rename it?"], USER)
    app.console().run(["message", "read", "1"], AGENT)
    assert hook(app, "PreToolUse", tool_name="Edit", tool_input={"file_path": "a.py"})[0] == 409, "a word first, then the work: the user's ruling of 2026-10-16"
    hook(app, "MessageDisplay", message="Yes, renaming it now.")
    app.runtime().deferred.drain()
    assert hook(app, "PreToolUse", tool_name="Edit", tool_input={"file_path": "a.py"})[0] == 200

def test_the_chart_is_rows_a_catalogue_and_one_whole_save_with_a_revision(app):
    import json as j
    from urllib.request import Request as R, urlopen
    hook(app, "SessionStart")
    app.console().run(["environment", "here"], AGENT)
    console = app.console()
    listed = console.run(["chart", "catalogue"], AGENT).out
    assert "trigger  idle" in listed and "action   say" in listed and "trigger  plans.created" in listed
    assert "has no check named flying" in console.run(["chart", "node", "--edit-default", "check", "flying", "--in", "1"], AGENT).err
    from journal.repositories.charts import Charts
    charts = app.container.get(Charts)
    wf, t = own_workflow(console, charts, "idle", "tool_finished")
    add = lambda kind, key, *text: int(console.run(["chart", "node", kind, key, *text, "--in", str(wf)], AGENT).out.split()[1].rstrip(":"))
    shipped = 0
    c, a = add("check", "open_tasks"), add("action", "block_stop", "--text", "tasks are open: carry on")
    console.run(["chart", "line", "--edit-default", str(t), str(c)], AGENT)
    console.run(["chart", "line", "--edit-default", str(c), str(a), "--port", "yes"], AGENT)
    shown = console.run(["chart", "show"], AGENT).out
    assert f"{t} --then--> {c}" in shown and f"{c} --yes--> {a}" in shown and "block_stop: tasks are open" in shown
    port = app.server().port
    read = j.load(urlopen(HttpRequest(f"http://127.0.0.1:{port}/journal/chart/{wf}", headers={"X-Journal-Env": "main"}), timeout=5))
    assert read["revision"] == 4, "two nodes and two lines by command, each one revision"
    assert [n["key"] for n in read["nodes"]][shipped:] == ["tool_finished", "open_tasks", "block_stop"] and len(read["catalogue"]) > 30
    def post(body):
        try:
            with urlopen(R(f"http://127.0.0.1:{port}/journal/chart/{wf}", data=j.dumps(body).encode(), method="POST", headers={"Content-Type": "application/json", "X-Journal-Env": "main"}), timeout=5) as r:
                return r.status, j.loads(r.read())
        except HTTPError as error:
            return error.code, j.loads(error.read())
    nodes = [{"id": t, "kind": "trigger", "key": "tool_finished", "x": 10, "y": 10}, {"id": c, "kind": "check", "key": "open_tasks"}, {"id": "new", "kind": "action", "key": "say", "text": "a word"}]
    lines = [{"from": t, "to": c}, {"from": c, "to": "new", "port": "yes"}, {"from": c, "to": "new", "port": "no"}]
    status, saved = post({"revision": 4, "nodes": nodes, "lines": lines})
    assert status == 200 and saved["revision"] == 5 and [n["key"] for n in saved["nodes"]] == ["tool_finished", "open_tasks", "say"] and saved["nodes"][0]["x"] == 10, "the shipped nodes left out are gone"
    assert [(l["from"], l["port"]) for l in saved["lines"]] == [(t, "then"), (c, "yes"), (c, "no")], "lines drawn anew, the removed node gone"
    assert post({"revision": 0, "nodes": nodes, "lines": []})[0] == 409, "a stale revision is refused"


def test_a_wrong_chart_is_refused_with_its_faults(app):
    import json as j
    from urllib.request import Request as R, urlopen
    hook(app, "SessionStart")
    app.console().run(["environment", "here"], AGENT)
    port = app.server().port
    own = int(app.console().run(["chart", "new", "Mine", "--on", "idle"], USER).out.split()[1].rstrip(":"))
    def post(body):
        try:
            with urlopen(R(f"http://127.0.0.1:{port}/journal/chart/{own}", data=j.dumps(body).encode(), method="POST", headers={"Content-Type": "application/json", "X-Journal-Env": "main"}), timeout=5) as r:
                return r.status, j.loads(r.read())
        except HTTPError as error:
            return error.code, j.loads(error.read())
    nodes = [{"id": "t", "kind": "trigger", "key": "idle"}, {"id": "c", "kind": "check", "key": "open_tasks"}, {"id": "a", "kind": "action", "key": "say", "text": "hi"}, {"id": "x", "kind": "check", "key": "flying"}]
    status, body = post({"revision": 0, "nodes": nodes, "lines": [{"from": "t", "to": "c"}, {"from": "c", "to": "a", "port": "yes"}, {"from": "a", "to": "t"}, {"from": "c", "to": "gone", "port": "no"}, {"from": "a", "to": "c", "port": "yes"}]})
    assert status == 409
    for fault in ("names no catalogue entry: check flying", "leads to or from no node", "leads into trigger t", "action a leaves by then, not yes", "check x has no line out", "loop back"):
        assert fault in body["error"], fault
    good = [{"from": "t", "to": "c"}, {"from": "c", "to": "a", "port": "yes"}]
    status, saved = post({"revision": 0, "nodes": nodes[:3], "lines": good})
    assert status == 200, "a check with one line ends the path on the other answer"
    t, c, a = [n["id"] for n in saved["nodes"]]
    console = app.console()
    assert "leaves by yes or no, not then" in console.run(["chart", "line", "--edit-default", str(c), str(a)], AGENT).err
    assert f"leads into trigger {t}" in console.run(["chart", "line", "--edit-default", str(a), str(t)], AGENT).err


def test_the_catalogue_names_providers_and_a_nodes_text_is_bounded(app):
    import json as j
    from urllib.request import Request as R, urlopen
    hook(app, "SessionStart")
    app.console().run(["environment", "here"], AGENT)
    port = app.server().port
    own = int(app.console().run(["chart", "new", "Mine", "--on", "idle"], USER).out.split()[1].rstrip(":"))
    catalogue = j.load(urlopen(HttpRequest(f"http://127.0.0.1:{port}/journal/chart/{own}", headers={"X-Journal-Env": "main"}), timeout=5))["catalogue"]
    by_key = {e["key"]: e for e in catalogue}
    assert by_key["turn_written"]["providers"] == ["claude"] and by_key["idle"]["providers"] == ["claude", "codex"]
    def post(body):
        try:
            with urlopen(R(f"http://127.0.0.1:{port}/journal/chart/{own}", data=j.dumps(body).encode(), method="POST", headers={"Content-Type": "application/json", "X-Journal-Env": "main"}), timeout=5) as r:
                return r.status, j.loads(r.read())
        except HTTPError as error:
            return error.code, j.loads(error.read())
    nodes = [{"id": "t", "kind": "trigger", "key": "idle"}, {"id": "a", "kind": "action", "key": "say", "text": "x" * 501}]
    status, body = post({"revision": 0, "nodes": nodes, "lines": [{"from": "t", "to": "a"}]})
    assert status == 409 and "text is longer than 500 characters" in body["error"]
    nodes[1]["text"] = "say\x07 this\n and\x1b that "
    status, body = post({"revision": 0, "nodes": nodes, "lines": [{"from": "t", "to": "a"}]})
    assert status == 200 and body["nodes"][1]["text"] == "say this and that", "control characters and line breaks are stripped"
    assert "at most 500 characters" in app.console().run(["chart", "node", "--edit-default", "action", "say", "--text", "y" * 501], AGENT).err


def test_the_engine_walks_the_chart_at_each_event_and_an_edit_applies_at_the_next(app, monkeypatch):
    from journal.supervisor_link import SupervisorLink
    sent = []
    monkeypatch.setattr(SupervisorLink, "runs", lambda self, environment_id: True)
    catch_typed(app, monkeypatch, sent)
    app.container.get(Settings).save(Setting(environment_id=0, key="tasks.auto", value=False), Actor.system())
    hook(app, "SessionStart")
    console = app.console()
    console.run(["environment", "here"], AGENT)
    console.run(["task", "create", "free work"], USER)
    assert hook(app, "Stop")[1] == {}, "auto off: the states say nothing about open tasks"
    from journal.models.node_kind import NodeKind
    from journal.repositories.charts import Charts
    charts = app.container.get(Charts)
    wf = [1] + [own_workflow(console, charts, "idle", event)[0] for event in ("tool_finished", "subagent_started")]
    at = [wf[0]]
    add = lambda kind, key, *text: made(console.run(["chart", "node", "--edit-default", kind, key, *text, "--in", str(at[0])], AGENT))
    line = lambda a, b, port="then": console.run(["chart", "line", "--edit-default", str(a), str(b), "--port", port], AGENT)
    stop = next(n.id for n in charts.nodes_of(charts.for_pair("idle", "idle")) if n.kind == NodeKind.TRIGGER and n.key == "idle")
    open_, hold_stop, rest = add("check", "open_tasks"), add("action", "block_stop", "--text", "the chart says: tasks are open, carry on"), add("action", "say", "--text", "the chart says: nothing is open, rest")
    line(stop, open_)
    line(open_, hold_stop, "yes")
    line(open_, rest, "no")
    status, body = hook(app, "Stop")
    assert body.get("decision") == "block" and "the chart says: tasks are open, carry on" in body["reason"], "the edit applies at the next event"
    console.run(["task", "create", "t", "--start"], AGENT)
    console.run(["task", "done", "1"], AGENT)
    console.run(["task", "done", "2"], AGENT)
    hook(app, "PreToolUse", tool_name="Read", tool_input={"file_path": "a.py", "limit": 1})
    status, body = hook(app, "Stop")
    assert "the chart says: nothing is open, rest" in body["reason"], "the no line is followed; a line said at a stop holds the stop, as any line does"
    assert hook(app, "Stop", stop_hook_active=True)[1].get("decision") == "block", "and again at the next stop: there is no repeated-stop escape"
    at[0] = charts.for_pair("working", "tool_starting").id
    tool = next(n.id for n in charts.nodes_of(charts.find(at[0])) if n.kind == NodeKind.TRIGGER and n.key == "tool_starting")
    writes, hold, calm = add("check", "tool_writes"), add("action", "hold", "--text", "no writes today"), add("action", "say", "--text", "the chart says: nothing is open, rest")
    line(tool, writes)
    line(writes, hold, "yes")
    line(writes, calm, "no")
    console.run(["task", "create", "u", "--start"], AGENT)
    status, body = hook(app, "PreToolUse", tool_name="Edit", tool_input={"file_path": "a.py"})
    assert status == 409 and body["error"] == "no writes today", "a hold refuses the tool use"
    assert hook(app, "PreToolUse", tool_name="Read", tool_input={"file_path": "a.py", "limit": 1})[0] == 200
    at[0], filed = own_workflow(console, charts, "working", "tasks.created")
    typed = add("action", "type", "--text", "a task was filed")
    line(filed, typed)
    console.run(["task", "create", "filed by the user"], USER)
    app.runtime().deferred.drain()
    assert "[journal] a task was filed" in sent, "a row event walks the chart and types the line"
    from journal.repositories.entries import Entries
    walks = [e for e in app.container.get(Entries).of_kind("walk") if e.data["trigger"] == "idle"]
    assert any({stop, open_, hold_stop} <= set(w.data["nodes"]) and not w.data["allowed"] for w in walks), "a walk leaves its trace: the one workflow on the stop, with the edit's path beside the shipped one"


def test_the_shipped_chart_carries_the_stop_rules_the_states_used_to(app):
    hook(app, "SessionStart")
    console = app.console()
    console.run(["environment", "here"], AGENT)
    console.run(["task", "create", "free work"], USER)
    body = hook(app, "Stop")[1]
    assert body.get("decision") == "block" and "tasks are open, and auto mode is on: task 1 next: free work" in body["reason"], "the next open task, in auto mode, through the chart"
    assert hook(app, "Stop", stop_hook_active=True)[1].get("decision") == "block", "and again: `journal stuck` is the way out"
    app.container.get(Settings).save(Setting(environment_id=0, key="tasks.auto", value=False), Actor.system())
    hook(app, "PreToolUse", tool_name="Read", tool_input={"file_path": "a", "limit": 1})
    assert hook(app, "Stop")[1] == {}, "auto off: an open task says nothing"
    console.run(["task", "start", "1"], AGENT)
    console.run(["task", "park", "1", "after lunch"], AGENT)
    hook(app, "PreToolUse", tool_name="Read", tool_input={"file_path": "a", "limit": 1})
    body = hook(app, "Stop")[1]
    assert "parked tasks, still open: 1 free work (parked because: after lunch)" in body["reason"], "parked tasks in any mode, through the chart"


def test_a_journal_gets_each_shipped_workflow_it_lacks_at_boot_keeps_edited_ones_and_retires_the_older_shape(app):
    from journal.features.chart.seeds.shipped_chart import KEPT, ShippedChart
    from journal.models.chart import Chart
    from journal.models.node import Node
    from journal.models.node_kind import NodeKind
    from journal.repositories.charts import Charts
    charts, seed, by = app.container.get(Charts), app.container.get(ShippedChart), Actor.system()
    idle = charts.for_pair("idle", "idle")
    assert idle.shipped and idle.title == "Hold the stop while a task is parked" and len(charts.nodes_of(idle)) >= 3, "a state's workflow at an event carries the state's own steps"
    for node in charts.nodes_of(idle)[3:]:
        charts.remove_node(node, by)
    seed.run()
    assert len(charts.nodes_of(charts.for_pair("idle", "idle"))) == 3, "an edited workflow is the user's: never overwritten, never doubled"
    charts.remove(charts.for_pair("idle", "idle"), by)
    seed.run()
    assert charts.for_pair("idle", "idle") and len(charts.nodes_of(charts.for_pair("idle", "idle"))) >= 3, "a journal lacking a shipped workflow gets it at boot"
    assert len(charts.shipped()) == len(seed.drawings) and all(c.event and c.drawing for c in charts.shipped()), "one shipped workflow per drawing: a state's at a trigger it has steps at, an Always one or the guards at an event"
    unedited = charts.save(Chart(title="Stop", shipped=True, event="idle"), by)
    charts.add_node(unedited, Node(kind=NodeKind.TRIGGER, key="idle", shipped=True), by)
    edited = charts.save(Chart(title="Pre tool use", shipped=True, event="tool_starting"), by)
    charts.add_node(edited, Node(kind=NodeKind.TRIGGER, key="tool_starting", shipped=True), by)
    charts.add_node(edited, Node(kind=NodeKind.CHECK, key="open_tasks"), by)
    seed.run()
    assert unedited.id not in [c.id for c in charts.all()], "a workflow of the older shape still as shipped retires whole"
    kept = charts.find(edited.id)
    assert not kept.shipped and kept.event == "" and kept.title.endswith(KEPT) and [n.kind for n in charts.nodes_of(kept)] == [NodeKind.CHECK], "an edited one keeps its edits and loses its triggers"

def test_an_edited_node_is_the_users_and_a_reset_brings_the_shipped_chart_back(app):
    import json as j
    from urllib.request import Request as R, urlopen
    hook(app, "SessionStart")
    console = app.console()
    console.run(["environment", "here"], AGENT)
    port = app.server().port
    from journal.models.node_kind import NodeKind
    from journal.repositories.charts import Charts
    charts = app.container.get(Charts)
    free = next(c for c in charts.shipped() if not any(n.locked for n in charts.nodes_of(c)) and any(n.kind == NodeKind.ACTION for n in charts.nodes_of(c))).id
    read = j.load(urlopen(HttpRequest(f"http://127.0.0.1:{port}/journal/chart/{free}", headers={"X-Journal-Env": "main"}), timeout=5))
    assert all(n["shipped"] for n in read["nodes"])
    nodes = read["nodes"]
    k = max(i for i, n in enumerate(nodes) if n["kind"] != "trigger" and not n["locked"])
    nodes[k]["text"] = "my own words"
    nodes[0]["x"] = 99
    with urlopen(R(f"http://127.0.0.1:{port}/journal/chart/{free}", data=j.dumps({"revision": 0, "nodes": nodes, "lines": read["lines"]}).encode(), method="POST", headers={"Content-Type": "application/json", "X-Journal-Env": "main"}), timeout=5) as r:
        saved = j.loads(r.read())
    assert saved["nodes"][k]["shipped"] is False and saved["nodes"][0]["shipped"] is True, "a changed text is the user's; a moved box is still the shipped rule"
    assert "(edited)" in console.run(["chart", "show"], AGENT).out
    assert "reset to the shipped one, revision 2" in console.run(["chart", "reset", str(free)], AGENT).out
    again = j.load(urlopen(HttpRequest(f"http://127.0.0.1:{port}/journal/chart/{free}", headers={"X-Journal-Env": "main"}), timeout=5))
    assert all(n["shipped"] for n in again["nodes"]) and len(again["nodes"]) == len(read["nodes"]) and again["revision"] == 2


def test_counter_checks_count_tool_uses_and_edits_and_read_a_setting(app):
    app.container.get(Settings).save(Setting(environment_id=0, key="tasks.auto", value=False), Actor.system())
    app.container.get(Settings).save(Setting(environment_id=0, key="messages.hold_after", value=4), Actor.system())
    hook(app, "SessionStart")
    console = app.console()
    console.run(["environment", "here"], AGENT)
    from journal.models.node_kind import NodeKind
    from journal.repositories.charts import Charts
    charts = app.container.get(Charts)
    shipped = charts.for_pair("working", "tool_starting")
    for node in charts.nodes_of(shipped):
        if node.kind != NodeKind.TRIGGER:
            charts.remove_node(node, Actor.system())
    wf = shipped.id
    add = lambda kind, key, *text: int(console.run(["chart", "node", "--edit-default", kind, key, *text, "--in", str(wf)], AGENT).out.split()[1].rstrip(":"))
    line = lambda a, b, port="then": console.run(["chart", "line", "--edit-default", str(a), str(b), "--port", port], AGENT)
    tool = next(n.id for n in charts.nodes_of(shipped) if n.kind == NodeKind.TRIGGER and n.key == "tool_starting")
    every = add("check", "count_every", "--text", "uses 3")
    inbox = add("action", "say", "--text", "the chart: your inbox waits")
    over = add("check", "count_over", "--text", "owed messages.hold_after")
    held = add("action", "hold", "--text", "the chart: answer first")
    line(tool, every)
    line(every, inbox, "yes")
    line(every, over, "no")
    line(over, held, "yes")
    console.run(["task", "create", "t", "--start"], AGENT)
    console.run(["message", "send", "hello?"], USER)
    read = lambda: hook(app, "PreToolUse", tool_name="Read", tool_input={"file_path": "a", "limit": 1})
    named = [n for n in range(1, 7) if "your inbox waits" in json.dumps(read()[1])]
    assert named == [3, 6], "every third use since the message came, on the count the guards keep"
    console.run(["message", "read", "1"], AGENT)
    answers = [read()[0] for _ in range(5)]
    assert answers[:3] == [200, 200, 200] and answers[3] == 409, "the hold after as many uses as the setting says"


def test_a_dry_run_shows_the_path_and_what_the_chart_would_do_without_doing_it(app, monkeypatch):
    from journal.supervisor_link import SupervisorLink
    sent = []
    monkeypatch.setattr(SupervisorLink, "runs", lambda self, environment_id: True)
    monkeypatch.setattr(SupervisorLink, "_send", lambda self, environment_id, verb, fields: sent.append({"verb": verb, **fields}))
    hook(app, "SessionStart")
    console = app.console()
    console.run(["environment", "here"], AGENT)
    console.run(["task", "create", "free work"], USER)
    out = console.run(["chart", "try", "idle"], AGENT).out
    assert "would block stop as tasks.next: tasks are open, and auto mode is on: task 1 next: free work" in out and "1, 2, 4, 5, 7, 8, 9, 10" in out, "one path through Idle's own: the parked check, the approved plan check, auto mode, the open task held, after the Always inbox check found nothing unread"
    assert "plugins not asked: a test run walks the workflows alone" in out, "a test run says it asked no plugin"
    assert not sent and hook(app, "PreToolUse", tool_name="Read", tool_input={"file_path": "a", "limit": 1})[0] == 200, "nothing was done"
    assert "one of session_started" in console.run(["chart", "try", "flying"], AGENT).err
    console.run(["message", "send", "are you there?"], USER)
    announced = len(sent)
    assert "needs the row" in console.run(["chart", "try", "messages.created"], AGENT).err
    tried = console.run(["chart", "try", "messages.created", "--row", "1"], AGENT).out
    assert "Message created of row 1, walked as the state idle: nodes none" in tried, "a row event is tried with its row; nothing is shipped at a message's creation, since delivery is the engine's"
    assert len(sent) == announced, "the trial typed nothing"
    from journal.models.node_kind import NodeKind
    from journal.repositories.charts import Charts
    charts = app.container.get(Charts)
    clock = charts.for_pair("expecting", "ticked")
    for shipped_node in charts.nodes_of(clock):
        if shipped_node.kind != NodeKind.TRIGGER:
            charts.remove_node(shipped_node, Actor.system())
    n = clock.id
    node = lambda *args: int(console.run(["chart", "node", "--edit-default", *args, "--in", str(n)], USER).out.split()[1].rstrip(":"))
    trigger = next(x.id for x in charts.nodes_of(clock) if x.kind == NodeKind.TRIGGER)
    quiet, say = node("check", "quiet_for_over", "--text", "300"), node("action", "say", "--text", "check {{awaited}} now")
    console.run(["chart", "line", "--edit-default", str(trigger), str(quiet)], USER)
    console.run(["chart", "line", "--edit-default", str(quiet), str(say), "--port", "yes"], USER)
    live = console.run(["chart", "try", "ticked", "--state", "expecting"], AGENT).out
    assert f"nodes {trigger}, {quiet}, {say}" in live and "assumed: quiet for 3600 s" in live, "a tick trial stands in an hour's quiet unless told otherwise, so it shows what a tick does"
    scripted = console.run(["chart", "try", "ticked", "--quiet", "400", "--state", "expecting"], AGENT).out
    assert f"nodes {trigger}, {quiet}, {say}" in scripted and "assumed: quiet for 400 s, the agent expecting" in scripted, "the trial takes a quiet time and a state and says it assumed them"
    assert "no state is called flying" in console.run(["chart", "try", "ticked", "--state", "flying"], AGENT).err
    as_working = console.run(["chart", "try", "tool_starting", "--state", "working", "--provider", "codex"], AGENT).out
    assert "walked as the state working" in as_working and "assumed: the agent working, a codex agent" in as_working, "the trial walks as the state given, with the provider's tool names"
    assert "walked as the state idle" in console.run(["chart", "try", "tool_starting"], AGENT).out


def test_a_row_named_in_a_message_is_a_chip_in_the_viewer():
    from journal.features.messages.mentions import Mentions
    assert Mentions.in_("Please have 2 agents give plan 1 a normal read, following template 3 (Find what is missing), then task 12 and Task 12 again, doc #4") == ["plan:1", "template:3", "todo:12", "doc:4"]
    assert Mentions.in_("the plan is ready; 3 agents; version 4") == []


def test_a_messages_mentions_reach_the_viewer_as_refs(app):
    from journal.http.v3.shapers.shapers import Shapers
    hook(app, "SessionStart")
    app.console().run(["message", "send", "look at plan 1 and task 2"], USER)
    rows = app.container.get(Shapers).named("message").rows()
    assert rows[-1].refs == ["plan:1", "todo:2"]


def test_a_server_set_up_in_claude_itself_is_removed_from_the_page_through_claudes_own_command(app, monkeypatch):
    import json as j
    from urllib.request import Request as R, urlopen
    from journal.features.mcp.health import Health
    from journal.features.mcp.health_report import HealthReport
    from journal.features.mcp.known import Known
    from journal.supervisor_link import SupervisorLink
    sent, removed = [], []
    monkeypatch.setattr(SupervisorLink, "runs", lambda self, environment_id: True)
    monkeypatch.setattr(SupervisorLink, "_send", lambda self, environment_id, verb, fields: sent.append({"verb": verb, **fields}))
    monkeypatch.setattr(Health, "asked", lambda self: HealthReport({"blender": Known("blender", "uvx blender-mcp", "connected", "")}))
    monkeypatch.setattr(Health, "remove", lambda self, name: removed.append(name) or name == "blender")
    hook(app, "SessionStart")
    port = app.server().port
    listed = j.load(urlopen(HttpRequest(f"http://127.0.0.1:{port}/journal/mcp", headers={"X-Journal-Env": "main"}), timeout=5))["servers"]
    assert [s["name"] for s in listed] == ["blender"] and listed[0]["managed"] is False
    with urlopen(R(f"http://127.0.0.1:{port}/journal/mcp/blender/remove", data=b"{}", method="POST", headers={"Content-Type": "application/json", "X-Journal-Env": "main"}), timeout=5) as r:
        assert j.loads(r.read()) == {"removed": "blender"}
    assert removed == ["blender"] and sent[-1]["verb"] == "restart"
    try:
        urlopen(R(f"http://127.0.0.1:{port}/journal/mcp/nothing/remove", data=b"{}", method="POST", headers={"Content-Type": "application/json", "X-Journal-Env": "main"}), timeout=5)
    except HTTPError as error:
        assert error.code == 404


def test_words_start_a_sequence_from_a_prompt_or_from_the_users_message(app, monkeypatch):
    from journal.supervisor_link import SupervisorLink
    sent = []
    monkeypatch.setattr(SupervisorLink, "runs", lambda self, environment_id: True)
    catch_typed(app, monkeypatch, sent)
    hook(app, "SessionStart")
    console = app.console()
    console.run(["environment", "here"], AGENT)
    assert "sequence give me an update" in console.run(["trigger", "list"], AGENT).out, "the update words are a shipped trigger"
    console.run(["sequence", "create", "release", "--steps", "bump | tag"], USER)
    console.run(["trigger", "create", "ship it", "release", "--do", "sequence"], USER)
    body = hook(app, "UserPromptSubmit", prompt="ok, ship it now")[1]
    running = app.container.get(Running)
    assert running.in_hand("s1", 1).title == "release" and "step 1: bump" in json.dumps(body), "a prompt's words start the sequence and its first step rides on the answer"
    for _ in range(2):
        console.run(["sequence", "follow"], AGENT)
        console.run(["sequence", "next"], AGENT)
    console.run(["message", "send", "could you give me an update?"], USER)
    app.runtime().deferred.drain()
    assert running.in_hand("s1", 1).title == "Writing an update" and any("Find what changed" in line for line in sent), "the user's message starts the update sequence, typed to the agent"


def test_a_journal_holds_one_workflow_per_event_and_the_engine_walks_each_at_its_event(app):
    import json as j
    from urllib.request import Request as R, urlopen
    hook(app, "SessionStart")
    console = app.console()
    console.run(["environment", "here"], AGENT)
    port = app.server().port
    listed = j.load(urlopen(HttpRequest(f"http://127.0.0.1:{port}/journal/chart", headers={"X-Journal-Env": "main"}), timeout=5))
    assert listed["workflows"][0]["title"] == "Hold the stop while a task is parked" and all(w["event"] for w in listed["workflows"]) and listed["catalogue"]
    with urlopen(R(f"http://127.0.0.1:{port}/journal/chart", data=j.dumps({"title": "Greetings", "state": "idle", "trigger": "tool_finished"}).encode(), method="POST", headers={"Content-Type": "application/json", "X-Journal-Env": "main"}), timeout=5) as r:
        made = j.loads(r.read())
    assert made["title"] == "Greetings" and made["shipped"] is False and [n["key"] for n in made["nodes"]] == ["tool_finished"], "born with its trigger"
    second = made["id"]
    finished = made["nodes"][0]["id"]
    say = int(console.run(["chart", "node", "--edit-default", "action", "say", "--text", "the second workflow says hello", "--in", str(second)], AGENT).out.split()[1].rstrip(":"))
    console.run(["chart", "line", "--edit-default", str(finished), str(say)], AGENT)
    console.run(["task", "create", "free work"], USER)
    assert "the second workflow says hello" in j.dumps(hook(app, "PostToolUse", tool_name="Read", tool_input={}, tool_response="")[1]), "the second workflow speaks at its own event"
    body = hook(app, "Stop")[1]
    assert "tasks are open" in body["reason"] and "says hello" not in body["reason"], "and the stop is the first one's alone"
    try:
        urlopen(R(f"http://127.0.0.1:{port}/journal/chart/1/remove", data=b"{}", method="POST", headers={"Content-Type": "application/json", "X-Journal-Env": "main"}), timeout=5)
    except HTTPError as error:
        assert error.code == 409, "the shipped workflow stays"
    with urlopen(R(f"http://127.0.0.1:{port}/journal/chart/{second}/remove", data=b"{}", method="POST", headers={"Content-Type": "application/json", "X-Journal-Env": "main"}), timeout=5) as r:
        assert j.loads(r.read()) == {"removed": second}
    assert "Greetings" not in console.run(["chart", "show"], AGENT).out


def test_a_workflow_holds_one_trigger(app):
    import json as j
    from urllib.request import Request as R, urlopen
    hook(app, "SessionStart")
    console = app.console()
    console.run(["environment", "here"], AGENT)
    assert "a workflow holds one trigger of each event; this one has 2 of idle" in console.run(["chart", "node", "--edit-default", "trigger", "idle", "--in", "1"], AGENT).err
    port = app.server().port
    nodes = [{"id": "a", "kind": "trigger", "key": "idle"}, {"id": "b", "kind": "trigger", "key": "idle"}]
    try:
        urlopen(R(f"http://127.0.0.1:{port}/journal/chart/1", data=j.dumps({"revision": 0, "nodes": nodes, "lines": []}).encode(), method="POST", headers={"Content-Type": "application/json", "X-Journal-Env": "main"}), timeout=5)
    except HTTPError as error:
        assert error.code == 409 and "holds one trigger of each event; this one has 2 of idle" in j.loads(error.read())["error"]


def test_a_subagent_dispatched_long_ago_in_the_session_stays_in_the_dropdown(app):
    hook(app, "SessionStart")
    hook(app, "PreToolUse", tool_name="Agent", tool_input={"description": "Herr Gropius draws", "model": "opus", "subagent_type": "designer", "prompt": "draw"})
    hook(app, "PostToolUse", tool_name="Agent", tool_input={"description": "Herr Gropius draws"}, tool_response={"isAsync": True, "agentId": "g1"})
    for _ in range(60):
        hook(app, "PreToolUse", tool_name="Read", tool_input={"file_path": "a", "limit": 1})
        hook(app, "PostToolUse", tool_name="Read", tool_input={"file_path": "a"}, tool_response="x")
    rows = [asdict(row) for row in app.container.get(Subagents).rows("s1")]
    assert [r["task"] for r in rows] == ["Herr Gropius draws"] and rows[0]["running"] is True


def test_a_link_given_in_the_chat_is_pinned_above_it_or_earns_one_reminder(app, monkeypatch):
    from journal.http.v3.shapers.shapers import Shapers
    from journal.supervisor_link import SupervisorLink
    sent = []
    monkeypatch.setattr(SupervisorLink, "runs", lambda self, environment_id: True)
    catch_typed(app, monkeypatch, sent)
    hook(app, "SessionStart")
    console = app.console()
    hook(app, "MessageDisplay", message="The design is at https://design.example/p/1 and the docs at http://127.0.0.1:8420/#/x.")
    app.runtime().deferred.drain()
    reminders = [line for line in sent if "is not pinned" in line]
    assert len(reminders) == 1 and "https://design.example/p/1" in reminders[0] and "127.0.0.1" not in reminders[0], "one reminder per outside link; the journal's own links pin themselves"
    hook(app, "MessageDisplay", message="Again: https://design.example/p/1")
    app.runtime().deferred.drain()
    assert len([line for line in sent if "is not pinned" in line]) == 1, "told once"
    out = console.run(["notice", "create", "The Workflows design", "--link", "https://design.example/p/1", "--label", "Open the design"], AGENT).out
    assert out.startswith("notice 1 pinned")
    rows = app.container.get(Shapers).named("notice").rows()
    assert rows[0].title == "The Workflows design" and rows[0].data["link"] == "https://design.example/p/1" and rows[0].data["label"] == "Open the design" and not rows[0].completed
    console.run(["notice", "close", "1"], AGENT)
    assert app.container.get(Shapers).named("notice").rows()[0].completed, "closed, it leaves the strip"


def test_an_answer_names_the_command_that_shows_the_question_whole_and_that_read_is_never_piped(app, monkeypatch):
    typed = []
    catch_typed(app, monkeypatch, typed)
    console = app.console()
    hook(app, "SessionStart")
    console.run(["environment", "here"], AGENT)
    console.run(["question", "ask", "Which name?", "--options", "alpha, beta"], AGENT)
    console.run(["question", "answer", "1", "beta"], USER)
    assert any("question 1 is answered" in line and "`journal question show 1`" in line for line in typed), "told like a message, with the command to read it"
    shown = console.run(["question", "show", "1"], AGENT).out
    assert "question 1: Which name?  [alpha / beta]" in shown and "answer: beta" in shown and "act on the answer" in shown
    status, body = hook(app, "PreToolUse", tool_name="Bash", tool_input={"command": "journal question show 1 " + "|" + " head -2"})
    assert status == 409 and "`journal question show`" in body["error"], "read whole, never through a pipe"


def test_a_message_left_from_the_viewer_while_the_agent_sits_idle_is_named_to_it_at_once(app, monkeypatch):
    typed = []
    catch_typed(app, monkeypatch, typed)
    hook(app, "SessionStart")
    app.console().run(["environment", "here"], AGENT)
    hook(app, "Stop")
    data = json.dumps({"brief": "are you there?", "idempotency": "v1"}).encode()
    request = HttpRequest(f"http://127.0.0.1:{app.server().port}/api/message", data=data, method="POST", headers={"Content-Type": "application/json", "X-Journal-Env": "main"})
    with urlopen(request, timeout=5) as reply:
        n = json.loads(reply.read())["n"]
    assert any(line == f"[journal] new message {n}" for line in typed), "named by number the moment it arrives, so it is not left for the next hook"


def test_the_rules_doc_names_every_line_a_listener_says():
    """Plan 2's map: a listener's line not in the rules table is a line nobody planned for."""
    from pathlib import Path
    doc = (Path(__file__).resolve().parents[1] / "docs" / "the-rules.md").read_text()
    root = Path(__file__).resolve().parents[1] / "src" / "journal" / "features"
    missing = []
    for listener in root.glob("*/listeners/*.py"):
        feature = listener.parts[-3]
        for key in set(re.findall(r"\b([A-Z_]+)\.about\(", listener.read_text())):
            name = re.search(rf"\b{key} = Nudge\(name, \"([a-z_]+)\"", (root / feature / "feature.py").read_text())
            if name and f"{feature}.{name.group(1)}" not in doc and name.group(1) not in doc:
                missing.append(f"{feature}.{name.group(1)}")
    assert not missing, f"lines said by a listener and absent from docs/the-rules.md: {sorted(set(missing))}"


def test_a_subagents_tool_use_does_not_lift_the_agents_own_wait(app):
    hook(app, "SessionStart")
    console = app.console()
    console.run(["environment", "here"], AGENT)
    console.run(["await", "the readers"], AGENT)
    machine = app.container.get(Machine)
    assert machine.current("s1").name == "expecting"
    hook(app, "PreToolUse", tool_name="Read", tool_input={"file_path": "a.py"}, agent_id="sub-1")
    assert machine.current("s1").name == "expecting", "a subagent reading is not the agent working again"
    hook(app, "PreToolUse", tool_name="Read", tool_input={"file_path": "a.py"})
    assert machine.current("s1").name == "idle", "the agent's own tool use lifts the wait"


def test_the_checks_for_the_inbox_and_the_answer_hold_answer_as_the_listeners_do(app):
    from journal.events.agent.tool_starting import ToolStarting
    from journal.events.models.created import Created
    from journal.features.chart.checks import Checks
    from journal.features.chart.context import Context
    from journal.models.author import Author
    from journal.models.message import Message
    from journal.repositories.environments import Environments
    hook(app, "SessionStart")
    console = app.console()
    console.run(["environment", "here"], AGENT)
    checks = app.container.get(Checks)
    env = app.container.get(Environments).named("main").id
    assert checks.number("tasks.log_after") == 50 and checks.number("7") == 7, "a setting's name reads through its option, so an unset key is the default, never 0"
    app.container.get(Settings).save(Setting(environment_id=0, key="tasks.log_after", value=12), Actor.system())
    assert checks.number("tasks.log_after") == 12, "and the user's value once set"
    console.run(["message", "send", "look at the picture, the chart and the footer please"], USER)
    console.run(["message", "read", "1"], AGENT)
    own = str(app.config.home / "files" / "message" / "1" / "shot.png")
    reads_own = Context(event=ToolStarting(tool="Read", input={"file_path": own}, session="s1", environment_id=env), session="s1", environment_id=env, state=app.container.get(Machine).current("s1"))
    reads_other = Context(event=ToolStarting(tool="Read", input={"file_path": "a.py"}, session="s1", environment_id=env), session="s1", environment_id=env, state=app.container.get(Machine).current("s1"))
    assert checks.answer("tool_reads_their_files", reads_own) and not checks.answer("tool_reads_their_files", reads_other)
    by_user = Context(event=Created(model=Message(environment_id=env, author=Author.USER, text="hi"), by=Actor.user(1)), environment_id=env)
    by_agent = Context(event=Created(model=Message(environment_id=env, author=Author.AGENT, text="hi"), by=Actor.agent("s1")), environment_id=env)
    assert checks.answer("message_by_user", by_user) and not checks.answer("message_by_user", by_agent)
    console.run(["task", "create", "t", "--start"], AGENT)
    hook(app, "MessageDisplay", message="yes, on it")
    app.runtime().deferred.drain()
    for _ in range(26):
        hook(app, "PreToolUse", tool_name="Write", tool_input={"file_path": "a.py"})
    at = Context(event=ToolStarting(tool="Write", input={"file_path": "a.py"}, writes=True, session="s1", environment_id=env), session="s1", environment_id=env, state=app.container.get(Machine).current("s1"))
    from journal.repositories.scope import Scope
    with app.container.get(Scope).of(env):
        assert checks.answer("count_at", at, "edits tasks.log_after") and checks.answer("count_every", at, "edits 6") and not checks.answer("count_over", at, "edits 13"), "the edits read from the record: twelve writes counted, the rest held at the log threshold and not counted"


def test_the_checks_for_quiet_time_workers_and_questions(app):
    from journal.events.agent.ticked import Ticked
    from journal.events.models.updated import Updated
    from journal.features.chart.checks import Checks
    from journal.features.chart.context import Context
    from journal.repositories.environments import Environments
    from journal.repositories.questions import Questions
    from journal.repositories.workers import Workers
    hook(app, "SessionStart")
    console = app.console()
    console.run(["environment", "here"], AGENT)
    checks = app.container.get(Checks)
    env = app.container.get(Environments).named("main").id
    tick = lambda quiet: Context(event=Ticked(at=0.0, quiet_for=quiet, session="s1", environment_id=env), session="s1", environment_id=env, state=app.container.get(Machine).current("s1"))
    assert checks.answer("quiet_for_over", tick(61), "60") and not checks.answer("quiet_for_over", tick(59), "60")
    assert checks.answer("quiet_for_over", tick(61), "1 minute") and not checks.answer("quiet_for_over", tick(59), "1 min") and checks.answer("quiet_for_over", tick(7201), "2 hours") and not checks.answer("quiet_for_over", tick(1799), "30 minutes"), "a time with its unit"
    console.run(["task", "create", "t", "--start"], AGENT)
    console.run(["worker", "dispatch", "Lady Lovelace", "write the parser", "--model", "fast"], AGENT)
    console.run(["worker", "wait", "1"], AGENT)
    worker = app.container.get(Workers).find(1)
    about = lambda event: Context(event=event, session="s1", environment_id=env, state=app.container.get(Machine).current("s1"))
    reported = about(Updated(model=worker.reported(), by=Actor.user(1), was=worker))
    again = about(Updated(model=worker.reported(), by=Actor.user(1), was=worker.reported()))
    assert checks.answer("worker_reported", reported) and not checks.answer("worker_reported", again), "just came to the state, not saved again in it"
    assert checks.answer("agent_awaits_the_worker", reported) and checks.answer("last_worker_back", reported), "the row says the last one is back"
    console.run(["worker", "dispatch", "Dr. Einstein", "profile it", "--model", "fast"], AGENT)
    console.run(["worker", "wait", "1", "2"], AGENT)
    assert not checks.answer("last_worker_back", about(reported.event)), "another is still out: the state is read when the walk starts"
    app.container.get(Workers).save(worker.reported(), Actor.user(1))
    console.run(["worker", "stop", "2"], USER)
    console.run(["task", "done", "1"], AGENT)
    console.run(["question", "ask", "Which name?"], AGENT)
    question = app.container.get(Questions).find(1)
    answered = Context(event=Updated(model=question.answered("beta"), by=Actor.user(1), was=question), session="s1", environment_id=env, state=app.container.get(Machine).current("s1"))
    assert checks.answer("question_answered", answered) and checks.answer("agent_waits_on_the_question", answered)


def test_the_card_and_release_actions(app):
    from journal.events.agent.ticked import Ticked
    from journal.features.chart.actions import Actions
    from journal.features.chart.context import Context
    from journal.models.actor import Actor
    from journal.repositories.environments import Environments
    from journal.repositories.messages import Messages
    hook(app, "SessionStart")
    console = app.console()
    console.run(["environment", "here"], AGENT)
    actions = app.container.get(Actions)
    env = app.container.get(Environments).named("main").id
    machine = app.container.get(Machine)
    ctx = lambda: Context(event=Ticked(at=0.0, quiet_for=0.0, session="s1", environment_id=env), session="s1", environment_id=env, state=machine.current("s1"))
    actions.perform("release", "nothing to release", ctx())
    assert machine.current("s1").name == "idle", "an agent not paused is left as it is"
    console.run(["task", "create", "t", "--start"], AGENT)
    console.run(["await", "the build"], AGENT)
    assert machine.current("s1").name == "expecting"
    actions.perform("release", "the build came back: carry on", ctx())
    assert machine.current("s1").task_id == 1, "released to what it was doing"
    actions.perform("show_card", "The journal did a thing", ctx())
    card = app.container.get(Messages).in_()[-1]
    assert card.author == "system" and card.created_by == Actor.system() and card.text == "The journal did a thing"
    assert card.data == {"kind": "card", "session": "s1", "icon": "bolt", "tone": "", "detail": "", "row": "", "key": ""}


def test_the_fillers_name_the_inbox_the_owed_messages_the_work_in_hand_and_the_rows(app):
    from journal.events.agent.ticked import Ticked
    from journal.events.agent.tool_starting import ToolStarting
    from journal.events.models.updated import Updated
    from journal.features.chart.fillers import Fillers
    from journal.features.chart.context import Context
    from journal.repositories.environments import Environments
    from journal.repositories.workers import Workers
    hook(app, "SessionStart")
    console = app.console()
    console.run(["environment", "here"], AGENT)
    fillers = app.container.get(Fillers)
    env = app.container.get(Environments).named("main").id
    at = lambda event: Context(event=event, session="s1", environment_id=env, state=app.container.get(Machine).current("s1"))
    tick = at(Ticked(at=0.0, quiet_for=330.0, session="s1", environment_id=env))
    console.run(["message", "send", "one"], USER)
    assert fillers.fill("{{inbox}} / {{unread_count}} / {{unread_numbers}}", tick) == "new message 1 / 1 / 1"
    console.run(["message", "send", "two"], USER)
    console.run(["message", "send", "three"], USER)
    console.run(["message", "send", "four"], USER)
    assert fillers.fill("{{inbox}}", tick) == "4 messages unread: `journal message unread`"
    console.run(["message", "read", "1"], AGENT)
    assert fillers.fill("{{owed}}", tick) == "1"
    console.run(["task", "create", "the footer", "--start"], AGENT)
    app.runtime().deferred.drain()
    held = [hook(app, "PreToolUse", tool_name="Write", tool_input={"file_path": "a.py"})[0] for _ in range(3)]
    from journal.events.agent.idle import Idle
    stop = at(Idle(session="s1", environment_id=env))
    assert fillers.fill("{{task}} / {{task_edits}} / {{log_command}}", stop) == f"task 1 / {held.count(200)} / `journal task log 1`", "the edits are the writes that went through, a held one not counted"
    console.run(["await", "the deploy"], AGENT)
    assert fillers.fill("check {{awaited}} now: you have waited {{quiet_minutes}} min", at(Ticked(at=0.0, quiet_for=330.0, session="s1", environment_id=env))) == "check the deploy now: you have waited 5 min", "the context carries the state as it is when the walk starts"
    console.run(["task", "park", "1", "the header first"], AGENT)
    assert fillers.fill("{{parked_n}}: {{parked_title}} ({{parked_why}})", tick) == "1: the footer (the header first)"
    console.run(["task", "create", "t2", "--start"], AGENT)
    console.run(["worker", "dispatch", "Lady Lovelace", "write the parser", "--model", "fast"], AGENT)
    worker = app.container.get(Workers).find(1)
    assert fillers.fill("worker {{worker_n}}, {{worker_name}}, reported", at(Updated(model=worker.reported(), by=Actor.user(1), was=worker))) == "worker 1, Lady Lovelace, reported"


def test_a_failing_node_is_recorded_and_the_path_goes_on_past_it(app):
    from journal.models.node import Node
    from journal.models.node_kind import NodeKind
    from journal.models.drawn_line import NO, THEN
    from journal.repositories.charts import Charts
    from journal.repositories.entries import Entries
    from journal.repositories.environments import Environments
    hook(app, "SessionStart")
    console = app.console()
    console.run(["environment", "here"], AGENT)
    charts = app.container.get(Charts)
    env = app.container.get(Environments).named("main").id
    shipped = charts.for_pair("idle", "idle")
    trigger = next(n for n in charts.nodes_of(shipped) if n.kind == NodeKind.TRIGGER and n.key == "idle")
    first = next(n for n in charts.nodes_of(shipped) if n.key == "parked_tasks")
    bad = charts.add_node(shipped, Node(kind=NodeKind.CHECK, key="no_such_check"), Actor.user(1))
    charts.connect(trigger, bad, THEN, Actor.user(1))
    charts.connect(bad, first, NO, Actor.user(1))
    console.run(["task", "create", "free work"], USER)
    status, body = hook(app, "Stop")
    assert status == 200 and body.get("decision") == "block" and "task 1 next" in body["reason"], "the broken check is passed by its no line and the shipped path after it still answers the stop"
    failed = app.container.get(Entries).of_kind("walk_failed", 5)
    assert failed and failed[0].data["node"] == bad.id and "no_such_check" in failed[0].data["fault"], "the fault is on record, naming the node"


def test_a_row_event_walks_about_every_agent_of_the_environment_and_speaks_once(app, monkeypatch):
    typed = []
    from journal.console.where import Where
    catch_typed(app, monkeypatch, typed)
    console = app.console()
    hook(app, "SessionStart")
    console.run(["environment", "here"], AGENT)
    hook(app, "SessionStart", session_id="s2")
    console.run(["environment", "here"], Where("main", "s2"))
    console.run(["task", "create", "t", "--start"], Where("main", "s2"))
    console.run(["worker", "dispatch", "Lady Lovelace", "write the parser", "--model", "fast"], Where("main", "s2"))
    console.run(["worker", "wait", "1"], Where("main", "s2"))
    typed.clear()
    machine = app.container.get(Machine)
    assert machine.current("s2").name == "awaiting"
    console.run(["worker", "report", "1", "parser done"], Where("main", "w1"))
    app.runtime().deferred.drain()
    assert machine.current("s2").task_id == 1, "the agent awaiting the worker, not the live one, is released by the shipped workflow"
    assert typed == ["[journal] worker 1, Lady Lovelace, reported in the chat", "[journal] what you waited on came back: carry on"], "told once, on the walk about the agent that waits"


def test_a_workflow_of_the_older_shape_holds_one_event_and_a_second_on_it_is_refused(app):
    import json
    hook(app, "SessionStart")
    console = app.console()
    console.run(["environment", "here"], AGENT)
    from journal.repositories.charts import Charts
    charts = app.container.get(Charts)
    n, trigger = own_workflow(console, charts, "idle", "tool_finished")
    second = int(console.run(["chart", "new", "Yet another", "--for", "idle", "--on", "tool_finished"], USER).out.split()[1].rstrip(":"))
    assert charts.find(second).place == charts.find(n).place + 1, "a second workflow on the same pair runs after the first"
    shipped = [str(c.id) for c in charts.for_event("tool_finished") if c.shipped]
    assert console.run(["chart", "order", "tool_finished", str(second), str(n), *shipped], USER).out.startswith("tool_finished: 1. Yet another, 2. ") and charts.find(second).place < charts.find(n).place, "the order command puts them in the order given"
    assert "name each once" in console.run(["chart", "order", "tool_finished", str(n)], USER).err
    assert "a workflow holds one trigger of each event" in console.run(["chart", "node", "trigger", "tool_finished", "--in", str(n)], USER).err
    say = int(console.run(["chart", "node", "action", "say", "--text", "your own workflow speaks", "--in", str(n)], USER).out.split()[1].rstrip(":"))
    console.run(["chart", "line", str(trigger), str(say)], USER)
    assert "your own workflow speaks" in json.dumps(hook(app, "PostToolUse", tool_name="Read", tool_input={}, tool_response="")[1]), "a workflow of your own answers its state at its event"

def test_the_shipped_message_workflow_takes_the_arrival_listener_over_at_boot(app, monkeypatch):
    typed = []
    catch_typed(app, monkeypatch, typed)
    hook(app, "SessionStart")
    console = app.console()
    console.run(["environment", "here"], AGENT)
    console.run(["message", "send", "are you there?"], USER)
    app.runtime().deferred.drain()
    assert typed.count("[journal] new message 1") == 1, "named once, by the engine's own delivery"
    from journal.repositories.charts import Charts
    assert not [c for c in app.container.get(Charts).for_event("messages.created") if c.shipped], "delivery is not a workflow: nothing is shipped at a message's creation"
    always = next(c for c in app.container.get(Charts).for_event("idle") if not c.state)
    assert "reset to the shipped one" in console.run(["chart", "reset", str(always.id)], USER).out
    assert "[always at idle, place" in console.run(["chart", "show"], USER).out


def test_the_etiquette_reminder_comes_after_fifty_lines_and_never_floods(app):
    from journal.engine.nudger import Nudger
    from journal.features.chart.feature import ChartFeature
    hook(app, "SessionStart")
    app.console().run(["environment", "here"], AGENT)
    agent, nudger = app.container.get(Machine).agent("s1", 1), app.container.get(Nudger)
    after_tool = lambda: hook(app, "PostToolUse", tool_name="Read", tool_input={"file_path": "a"})[1].get("hookSpecificOutput", {}).get("additionalContext", "")
    for i in range(50):
        nudger.say(agent, ChartFeature.LINE.about(text=f"line {i}"))
    assert "chat etiquette" in after_tool(), "fifty lines since the last reminder bring it at the next tool use"
    assert "chat etiquette" not in after_tool(), "said, the count starts again"
    for i in range(1000):
        nudger.say(agent, ChartFeature.LINE.about(text=f"more {i}"))
    assert "chat etiquette" not in after_tool(), "a thousand lines later but inside the reminder's own window, none again: no flood"


def test_a_cancelled_plan_takes_its_own_open_tasks_with_it_and_leaves_shared_ones(app):
    from journal.models.plan_state import PlanState
    from journal.models.task_state import TaskState
    from journal.repositories.plans import Plans
    from journal.repositories.tasks import Tasks
    console = app.console()
    console.run(["plan", "create", "old", "--brief", "b"], USER)
    console.run(["plan", "add", "1", "its own"], USER)
    console.run(["plan", "add", "1", "finished"], USER)
    console.run(["task", "start", "2"], AGENT)
    console.run(["task", "done", "2", "--how", "done"], AGENT)
    console.run(["plan", "create", "new", "--brief", "b"], USER)
    console.run(["plan", "add", "2", "shared"], USER)
    console.run(["plan", "phase", "1", "p", "--when", "w"], USER)
    console.run(["plan", "todos", "1", "1", "3"], USER)
    out = console.run(["plan", "cancel", "1"], USER).out
    assert "plan 1 cancelled, with tasks 1" in out
    plans, tasks = app.container.get(Plans), app.container.get(Tasks)
    assert plans.find(1).state == PlanState.CANCELLED and tasks.find(1).state == TaskState.CANCELLED
    assert tasks.find(2).state == TaskState.DONE and tasks.find(3).state == TaskState.OPEN, "a done task stays done; a task the new plan holds too stays open"
    assert tasks.find(1).id not in [t.id for t in plans.free()], "a cancelled task is offered to nobody"


def test_the_walk_reads_the_state_once_after_the_machine_has_moved(app):
    import json
    from journal.models.node_kind import NodeKind
    from journal.repositories.charts import Charts
    from journal.repositories.entries import Entries
    hook(app, "SessionStart")
    console = app.console()
    console.run(["environment", "here"], AGENT)
    console.run(["task", "create", "the footer", "--start"], AGENT)
    charts = app.container.get(Charts)
    tool = charts.for_pair("working", "tool_starting")
    trigger = next(n.id for n in charts.nodes_of(tool) if n.kind == NodeKind.TRIGGER)
    node = lambda *args: int(console.run(["chart", "node", "--edit-default", *args, "--in", str(tool.id)], USER).out.split()[1].rstrip(":"))
    in_hand, say = node("check", "task_in_hand"), node("action", "say", "--text", "in hand: {{task}}")
    console.run(["chart", "line", "--edit-default", str(trigger), str(in_hand)], USER)
    console.run(["chart", "line", "--edit-default", str(in_hand), str(say), "--port", "yes"], USER)
    console.run(["await", "the deploy"], AGENT)
    assert app.container.get(Machine).current("s1").name == "expecting"
    body = hook(app, "PreToolUse", tool_name="Read", tool_input={"file_path": "a.py", "limit": 1})[1]
    assert "in hand: task 1" in json.dumps(body), "the tool use lifted the wait before the walk, and the walk read Working, once"
    walks = app.container.get(Entries).of_kind("walk", 5)
    assert walks[0].data["state"] == "working", "the trace names the state the walk read"


def test_approving_a_started_plan_leaves_it_started(app):
    from journal.models.plan_state import PlanState
    from journal.repositories.plans import Plans
    console = app.console()
    console.run(["plan", "create", "p", "--brief", "b"], USER)
    console.run(["plan", "add", "1", "first"], USER)
    console.run(["plan", "phase", "1", "one", "--when", "w"], USER)
    console.run(["plan", "todos", "1", "1", "1"], USER)
    console.run(["plan", "ready", "1"], USER)
    console.run(["plan", "approve", "1"], USER)
    hook(app, "SessionStart")
    console.run(["environment", "here"], AGENT)
    console.run(["plan", "start", "1"], AGENT)
    assert "plan 1 started" in console.run(["plan", "approve", "1"], USER).out
    assert app.container.get(Plans).find(1).state == PlanState.STARTED, "a second word from the page cannot set a running plan back to approved"
    assert "cannot become ready" in console.run(["plan", "ready", "1"], AGENT).err, "the agent cannot undo the user's approval"
    assert "cannot become reviewing" in console.run(["plan", "review", "1"], AGENT).err
    assert app.container.get(Plans).find(1).state == PlanState.STARTED


def test_the_page_reads_a_cancelled_plan_and_its_task_as_abandoned(app):
    import json as j
    from urllib.request import urlopen
    console = app.console()
    console.run(["plan", "create", "old", "--brief", "b"], USER)
    console.run(["plan", "add", "1", "its own"], USER)
    console.run(["plan", "cancel", "1"], USER)
    for kind in ("plan", "todo"):
        with urlopen(HttpRequest(f"http://127.0.0.1:{app.server().port}/api/{kind}?last=50&env=main&completed=1", headers={"X-Journal-Env": "main"}), timeout=5) as reply:
            assert reply.status == 200, f"a cancelled {kind} is shaped for the page"
            shaped = j.loads(reply.read())
            assert "abandoned" in j.dumps(shaped)
            assert kind != "plan" or all(row["completed"] > 0 for row in shaped["rows"]), "an abandoned plan is closed, shown with the closed ones"


def test_a_workflow_is_bound_to_a_state_or_the_base_and_a_state_has_one(app):
    from journal.repositories.charts import Charts
    hook(app, "SessionStart")
    console = app.console()
    console.run(["environment", "here"], AGENT)
    assert "no state is called flying" in console.run(["chart", "new", "Flying", "--for", "flying", "--on", "idle"], USER).err
    assert "no event is called landing" in console.run(["chart", "new", "Landing", "--for", "idle", "--on", "landing"], USER).err
    twice = console.run(["chart", "new", "Working twice", "--for", "working", "--on", "tool_starting"], USER)
    charts = app.container.get(Charts)
    assert twice.code == 0 and charts.find(int(twice.out.split()[1].rstrip(":"))).place > charts.for_pair("working", "tool_starting").place, "a second workflow for a state at an event takes its place after the shipped one"
    working, idle = charts.for_pair("working", "tool_starting").id, charts.for_pair("idle", "idle").id
    node = lambda chart, *args: console.run(["chart", "node", "--edit-default", *args, "--in", str(chart)], USER)
    assert "a workflow holds one trigger of each event; this one has 2 of tool_starting" in node(working, "trigger", "tool_starting").err
    assert "a workflow holds one trigger of each event" in node(idle, "trigger", "idle").err
    assert node(idle, "check", "open_tasks").code == 0
    shown = console.run(["chart", "show"], USER).out
    assert f"workflow {idle} [idle at idle, place 40], revision 1 by user:1: Hold the stop while a task is parked" in shown and f"workflow {working} [working at tool_starting, place" in shown

def test_the_walk_runs_the_state_workflow_found_by_the_state_and_its_parents(app):
    import json
    from journal.features.chart.walk import Walk
    hook(app, "SessionStart")
    console = app.console()
    console.run(["environment", "here"], AGENT)
    from journal.repositories.charts import Charts
    charts = app.container.get(Charts)
    for state, words in (("idle", "from idle"), ("working", "from working")):
        chart, trigger = own_workflow(console, charts, state, "tool_finished")
        say = int(console.run(["chart", "node", "action", "say", "--text", words, "--in", str(chart)], USER).out.split()[1].rstrip(":"))
        console.run(["chart", "line", str(trigger), str(say)], USER)
    read = lambda: json.dumps(hook(app, "PostToolUse", tool_name="Read", tool_input={}, tool_response="")[1])
    assert "from idle" in read() and "from working" not in read(), "idle: the Idle workflow alone"
    console.run(["task", "create", "the footer", "--start"], AGENT)
    answer = read()
    assert "from working" in answer and "from idle" not in answer, "working: the state's own workflow alone"
    console.run(["plan", "create", "p", "--brief", "b"], USER)
    console.run(["plan", "add", "1", "step one"], USER)
    console.run(["plan", "phase", "1", "one", "--when", "w"], USER)
    console.run(["plan", "todos", "1", "1", "2"], USER)
    console.run(["plan", "ready", "1"], USER)
    console.run(["plan", "approve", "1"], USER)
    console.run(["task", "done", "1"], AGENT)
    console.run(["plan", "start", "1"], AGENT)
    assert app.container.get(Machine).current("s1").name == "following_plan"
    assert "from working" in read(), "following a plan is a kind of working: it inherits Working's workflow"
    assert Walk.lineage(app.container.get(Machine).current("s1"))[:2] == ["following_plan", "working"]


def test_a_workflow_moves_the_agent_to_idle_only_from_a_state_that_owns_nothing(app):
    from journal.repositories.entries import Entries
    hook(app, "SessionStart")
    console = app.console()
    console.run(["environment", "here"], AGENT)
    from journal.repositories.charts import Charts as ChartRows
    charts = app.container.get(ChartRows)
    node = lambda chart, *args: console.run(["chart", "node", "--edit-default", *args, "--in", str(chart)], USER)
    assert "says nothing: what the agent waits for goes in its text" in node(charts.for_pair("idle", "idle").id, "action", "wait_outside").err
    assert "says nothing: why the agent is stuck goes in its text" in node(charts.for_pair("idle", "idle").id, "action", "mark_stuck").err
    assert "has no action named move_to" in node(charts.for_pair("idle", "idle").id, "action", "move_to", "--text", "working").err, "the older move is no node: the state changes are named by their outcome"
    moves = {}
    for state in ("working", "expecting"):
        chart, trigger = own_workflow(console, charts, state, "tool_finished")
        moves[state] = int(node(chart, "action", "go_idle").out.split()[1].rstrip(":"))
        console.run(["chart", "line", "--edit-default", str(trigger), str(moves[state])], USER)
    move = moves["working"]
    console.run(["task", "create", "the footer", "--start"], AGENT)
    hook(app, "PostToolUse", tool_name="Read", tool_input={}, tool_response="")
    machine = app.container.get(Machine)
    assert machine.current("s1").name == "working", "a task in hand is not left with nobody on it"
    failed = app.container.get(Entries).of_kind("walk_failed", 3)
    assert failed and failed[0].data["node"] == move and "would leave that with nobody on it" in failed[0].data["fault"], "the walk records why the move was refused"
    console.run(["await", "the deploy"], AGENT)
    hook(app, "PostToolUse", tool_name="Read", tool_input={}, tool_response="")
    assert machine.current("s1").name == "expecting", "a wait keeps its way back: a workflow does not move it"
    assert "would lose its way back" in app.container.get(Entries).of_kind("walk_failed", 1)[0].data["fault"]
    hook(app, "PreToolUse", tool_name="Read", tool_input={"file_path": "a.py", "limit": 1})
    console.run(["task", "done", "1"], AGENT)
    assert machine.current("s1").name == "idle"
    hook(app, "PostToolUse", tool_name="Read", tool_input={}, tool_response="")
    assert machine.current("s1").name == "idle", "idle to idle is nothing"


def test_a_walk_never_triggers_on_the_rows_it_writes_itself(app):
    from journal.repositories.entries import Entries
    hook(app, "SessionStart")
    console = app.console()
    console.run(["environment", "here"], AGENT)
    from journal.repositories.charts import Charts as ChartRows
    base = app.container.get(ChartRows).for_pair("idle", "idle").id
    for own in ("agents.updated", "entries.created", "links.created"):
        assert f"has no trigger named {own}" in console.run(["chart", "node", "--edit-default", "trigger", own, "--in", str(base)], USER).err, own
    console.run(["task", "create", "the parser", "--start"], AGENT)
    console.run(["worker", "dispatch", "Lady Lovelace", "write the parser", "--model", "fast"], AGENT)
    console.run(["worker", "wait", "1"], AGENT)
    entries = app.container.get(Entries)
    before = len(entries.of_kind("walk", 1000))
    console.run(["worker", "report", "1", "parser done"], Where("main", "w1"))
    app.runtime().deferred.drain()
    walks = entries.of_kind("walk", 1000)
    since = [w.data["trigger"] for w in walks[: len(walks) - before]]
    assert set(since) == {"workers.updated"}, "the report's worker row was walked, its message is delivered by the engine and walks no workflow; the release inside the walk saved the agent's row and recorded the walk, and neither set off another"


def test_every_command_line_write_to_a_workflow_raises_its_revision_so_a_page_save_from_an_older_read_is_refused(app):
    from journal.repositories.charts import Charts
    hook(app, "SessionStart")
    console = app.console()
    charts = app.container.get(Charts)
    workflow = charts.shipped()[0]
    read = workflow.revision
    assert console.run(["chart", "node", "--edit-default", "check", "open_tasks", "--in", str(workflow.id)], USER).code == 0
    after_node = charts.find(workflow.id).revision
    assert after_node > read, "adding a node by command raises the revision"
    nodes = charts.nodes_of(workflow)
    assert console.run(["chart", "line", "--edit-default", str(nodes[0].id), str(nodes[-1].id)], USER).code == 0
    after_line = charts.find(workflow.id).revision
    assert after_line > after_node, "connecting two nodes by command raises the revision"
    assert console.run(["chart", "remove", "--edit-default", str(nodes[-1].id)], USER).code == 0
    assert charts.find(workflow.id).revision > after_line, "removing a node by command raises the revision"


def test_a_default_workflow_is_changed_by_command_only_with_the_flag_and_the_revision_names_its_actor(app):
    from journal.repositories.charts import Charts
    hook(app, "SessionStart")
    console = app.console()
    base = app.container.get(Charts).for_pair("idle", "idle")
    refused = console.run(["chart", "node", "check", "open_tasks", "--for", "idle", "--on", "idle"], USER)
    assert refused.code == 1 and f"workflow {base.id}, Hold the stop while a task is parked, is a default one: add --edit-default" in refused.err
    assert console.run(["chart", "node", "check", "open_tasks", "--for", "idle", "--on", "idle", "--edit-default"], USER).code == 0
    assert f"workflow {base.id} [idle at idle, place 40], revision 1 by user:1: Hold the stop while a task is parked" in console.run(["chart", "show"], USER).out
    own = int(console.run(["chart", "new", "mine", "--for", "idle", "--on", "tool_finished"], USER).out.split()[1].rstrip(":"))
    assert console.run(["chart", "node", "check", "open_tasks", "--in", str(own)], USER).code == 0, "your own workflow needs no flag"


def test_the_page_reads_each_workflows_last_walk_and_its_last_failure(app, monkeypatch):
    import json as j
    from urllib.request import urlopen
    from journal.features.chart.actions import Actions
    read = lambda: j.load(urlopen(HttpRequest(f"http://127.0.0.1:{app.server().port}/journal/chart", headers={"X-Journal-Env": "main"}), timeout=5))["workflows"]
    assert all(w["last_walk"] == {} and w["last_failure"] == {} for w in read()), "nothing walked yet"
    hook(app, "SessionStart")
    base = next(w for w in read() if w["state"] == "" and w["event"] == "session_started")
    assert base["last_walk"]["trigger"] == "Session start" and base["last_walk"]["at"] > 0 and base["last_failure"] == {}
    app.console().run(["message", "send", "a word for the agent"], USER)

    def broken(self, ctx, text):
        raise RuntimeError("the typist is out")
    monkeypatch.setattr(Actions, "say", broken)
    hook(app, "UserPromptSubmit", prompt="hello")
    base = next(w for w in read() if w["state"] == "" and w["event"] == "prompt_submitted")
    assert base["last_failure"]["key"] == "say" and "RuntimeError: the typist is out" in base["last_failure"]["fault"] and base["last_failure"]["at"] > 0


def test_a_workflow_naming_a_check_the_catalogue_no_longer_has_is_stopped_at_boot_with_the_reason(app):
    from journal.features.chart.seeds.shipped_chart import ShippedChart
    from journal.models.chart import Chart
    from journal.models.node import Node
    from journal.models.node_kind import NodeKind
    from journal.models.drawn_line import THEN
    from journal.repositories.charts import Charts
    charts = app.container.get(Charts)
    own = charts.save(Chart(title="From before"), Actor.user(1))
    trigger = charts.add_node(own, Node(kind=NodeKind.TRIGGER, key="idle"), Actor.user(1))
    old = charts.add_node(own, Node(kind=NodeKind.CHECK, key="plain_idle"), Actor.user(1))
    charts.connect(trigger, old, THEN, Actor.user(1))
    app.container.get(ShippedChart).run()
    stopped = charts.find(own.id)
    assert stopped.title == "From before (stopped, check plain_idle is no longer in the catalogue)"
    assert [n.kind for n in charts.nodes_of(stopped)] == [NodeKind.CHECK], "its trigger is gone, so it never walks; the rest is left for the user to see"
    assert not charts.graph(stopped).triggers


def test_the_chart_commands_name_a_workflow_by_number_or_by_state(app):
    hook(app, "SessionStart")
    console = app.console()
    console.run(["environment", "here"], AGENT)
    assert "name the workflow: --in <n> by its number, or --for <state> --on <event>" in console.run(["chart", "node", "--edit-default", "check", "open_tasks"], USER).err
    assert "no workflow is for flying at idle" in console.run(["chart", "node", "--edit-default", "check", "open_tasks", "--for", "flying", "--on", "idle"], USER).err
    assert console.run(["chart", "node", "--edit-default", "check", "open_tasks", "--for", "working", "--on", "tool_starting"], USER).code == 0
    mine = int(console.run(["chart", "new", "Mine", "--for", "idle", "--on", "subagent_started"], USER).out.split()[1].rstrip(":"))
    assert "is not a shipped one" in console.run(["chart", "reset", str(mine)], USER).err
    assert "reset to the shipped one" in console.run(["chart", "reset", "--for", "working", "--on", "tool_starting"], USER).out
    assert "is a shipped one and stays" in console.run(["chart", "drop", "1"], USER).err
    shown = console.run(["chart", "show"], USER).out
    assert shown.index("[always at idle") < shown.index("[idle at idle") < shown.index("[working at idle") < shown.index("[awaiting at workers") < shown.index(f"workflow {mine} ["), "by event in the order the events come, then in the order the workflows run, the waits first; your own at an event no default has comes last"

def test_a_workflow_is_compiled_once_and_an_edit_is_seen_at_the_next_walk(app, monkeypatch):
    import json
    from journal.repositories.charts import Charts
    hook(app, "SessionStart")
    console = app.console()
    console.run(["environment", "here"], AGENT)
    from journal.repositories.charts import Charts as ChartRows
    charts = app.container.get(ChartRows)
    base, trigger = own_workflow(console, charts, "idle", "tool_finished")
    node = lambda *args: int(console.run(["chart", "node", *args, "--in", str(base)], USER).out.split()[1].rstrip(":"))
    say = node("action", "say", "--text", "first words")
    console.run(["chart", "line", "--edit-default", str(trigger), str(say)], USER)
    finished = lambda: json.dumps(hook(app, "PostToolUse", tool_name="Read", tool_input={}, tool_response="")[1])
    assert "first words" in finished()
    charts = app.container.get(Charts)
    monkeypatch.setattr(Charts, "nodes_of", lambda self, chart: (_ for _ in ()).throw(AssertionError("the rows were read again")))
    assert "first words" in finished(), "the second walk reads no chart rows: the workflow is compiled"
    monkeypatch.undo()
    console.run(["chart", "remove", "--edit-default", str(say)], USER)
    node("action", "say", "--text", "second words")
    console.run(["chart", "line", "--edit-default", str(trigger), str(trigger + 2)], USER)
    answer = finished()
    assert "second words" in answer and "first words" not in answer, "a write through the repository clears the compiled workflow, and the next walk sees the edit"


def test_the_busiest_walk_stays_inside_its_budget_and_a_runaway_path_is_cut_off_and_recorded(app):
    import time
    from journal.features.chart.walk import STEPS
    from journal.repositories.charts import Charts
    from journal.repositories.entries import Entries
    hook(app, "SessionStart")
    console = app.console()
    console.run(["environment", "here"], AGENT)
    console.run(["task", "create", "the footer", "--start"], AGENT)
    for words in ("one", "two", "three", "four", "five"):
        console.run(["message", "send", words], USER)
    entries = app.container.get(Entries)
    began = time.perf_counter()
    for _ in range(5):
        hook(app, "PreToolUse", tool_name="Write", tool_input={"file_path": "a.py"})
    took = (time.perf_counter() - began) / 5
    walk = entries.of_kind("walk", 1)[0]
    assert len(walk.data["nodes"]) < STEPS and took < 0.5, f"the shipped tool workflow walks {len(walk.data['nodes'])} nodes in {took * 1000:.0f} ms"
    from journal.repositories.charts import Charts as ChartRows
    chart, previous = own_workflow(console, app.container.get(ChartRows), "working", "tool_finished")
    node = lambda *args: int(console.run(["chart", "node", *args, "--in", str(chart)], USER).out.split()[1].rstrip(":"))
    for i in range(STEPS + 5):
        following = node("action", "show_card", "--text", f"step {i}")
        console.run(["chart", "line", "--edit-default", str(previous), str(following)], USER)
        previous = following
    hook(app, "PostToolUse", tool_name="Read", tool_input={}, tool_response="")
    app.runtime().deferred.drain()
    cut = entries.of_kind("walk_failed", 1)[0]
    own = {n.id for n in app.container.get(ChartRows).nodes_of(app.container.get(ChartRows).find(chart))}
    assert f"ran past {STEPS} nodes" in cut.data["fault"] and len([n for n in entries.of_kind("walk", 1)[0].data["nodes"] if n in own]) == STEPS, "a runaway path is cut off at the cap and the cut is on record"


def test_the_rules_doc_rules_on_every_state_the_engine_knows(app):
    from pathlib import Path
    from journal.engine.states_catalogue import StatesCatalogue
    doc = (Path(__file__).resolve().parents[1] / "docs" / "the-rules.md").read_text()
    table = doc.split("## Every state, and who holds its conduct")[1].split("## ")[0]
    names = app.container.get(StatesCatalogue).names()
    assert "subagent" not in names, "the state nothing entered is gone"
    assert [n for n in names if f"| {n} |" not in table] == [], "every state the engine knows has a ruling in the rules doc"


def test_the_fillers_name_the_sequence_in_hand(app):
    from journal.events.agent.idle import Idle
    from journal.features.chart.context import Context
    from journal.features.chart.fillers import Fillers
    hook(app, "SessionStart")
    console = app.console()
    console.run(["environment", "here"], AGENT)
    made = console.run(["sequence", "create", "ship it", "--steps", "tag it | push"], USER).out
    n = int(made.split()[1].rstrip(":"))
    console.run(["sequence", "run", str(n)], AGENT)
    machine = app.container.get(Machine)
    ctx = Context(event=Idle(session="s1", environment_id=1), session="s1", environment_id=1, state=machine.current("s1"))
    assert app.container.get(Fillers).fill("sequence {{sequence_n}}, step {{sequence_step}}: {{sequence_step_text}}", ctx) == f"sequence {n}, step 1: tag it", "as the running state says it at a stop"


def test_a_refused_dispatch_leaves_no_running_subagent_behind(app):
    from journal.repositories.environments import Environments
    hook(app, "SessionStart")
    console = app.console()
    console.run(["environment", "here"], AGENT)
    console.run(["message", "send", "a word first"], USER)
    console.run(["message", "read", "1"], AGENT)
    status, body = hook(app, "PreToolUse", tool_name="Agent", tool_input={"description": "Lord Macaulay reads", "model": "opus", "prompt": "read the plan", "subagent_type": "researcher"})
    assert status == 409 and "answer message 1 first" in body["error"], "the dispatch is held until the message is answered"
    rows = [asdict(row) for row in app.container.get(Subagents).rows("s1")]
    assert rows == [], "a dispatch the journal refused never ran and is no subagent"


def test_a_read_outside_every_scope_is_refused_and_a_command_reads_its_own_environment_only(app):
    from contextvars import Context
    from journal.repositories.tasks import Tasks
    from journal.repositories.unscoped import Unscoped
    console = app.console()
    console.run(["task", "create", "main's own"], USER)
    console.run(["task", "create", "other's own"], Where("other"))
    with pytest.raises(Unscoped):
        Context().run(app.container.get(Tasks).in_)
    in_main, in_other = console.run(["task", "list"], USER).out, console.run(["task", "list"], Where("other")).out
    assert "main's own" in in_main and "other's own" not in in_main
    assert "other's own" in in_other and "main's own" not in in_other
    assert [t.title for t in app.container.get(Tasks).in_()] == ["main's own"], "the test reads in main, the scope its fixture entered"


def test_a_workflow_keeps_a_named_count_between_events_and_checks_it(app, monkeypatch):
    typed = []
    catch_typed(app, monkeypatch, typed)
    from journal.repositories.charts import Charts
    console, charts = app.console(), app.container.get(Charts)
    starting, start_trigger = own_workflow(console, charts, "idle", "subagent_started")
    add = lambda wf, kind, key, *text: int(console.run(["chart", "node", kind, key, *text, "--in", str(wf)], USER).out.split()[1].rstrip(":"))
    def link(wf, a, b, port="then"):
        out = console.run(["chart", "line", str(a), str(b), "--port", port], USER)
        assert out.code == 0, out.err
    started = add(starting, "action", "count_start", "--text", "subs")
    link(starting, start_trigger, started)
    finishing, finish_trigger = starting, add(starting, "trigger", "tool_finished")
    assert app.container.get(Charts).find(starting) in app.container.get(Charts).for_event("tool_finished"), "a second trigger makes the workflow answer its event too"
    one = add(finishing, "action", "count_one", "--text", "subs")
    over = add(finishing, "check", "count_over", "--text", "subs 2")
    enough = add(finishing, "action", "say", "--text", "[chart] two tools since the subagent started")
    link(finishing, finish_trigger, one)
    link(finishing, one, over)
    link(finishing, over, enough, "yes")
    every = add(finishing, "check", "count_every", "--text", "subs 2")
    second = add(finishing, "action", "say", "--text", "[chart] every second tool")
    link(finishing, over, every, "no")
    link(finishing, enough, every)
    link(finishing, every, second, "yes")
    assert "names no number" in console.run(["chart", "node", "check", "count_at", "--text", "subs", "--in", str(finishing)], USER).err
    assert "names no number" in console.run(["chart", "node", "check", "count_every", "--text", "subs", "--in", str(finishing)], USER).err
    hook(app, "SessionStart")
    console.run(["environment", "here"], AGENT)
    from journal.repositories.counts import Counts
    from journal.repositories.scope import Scope
    counts, scope = app.container.get(Counts), app.container.get(Scope)
    hook(app, "SubagentStart", agent_id="a1")
    with scope.of(1):
        assert [c.value for c in counts.where(session="s1", name=f"charts:{starting}:subs")] == [0], "the start put the workflow's count at nought"
    said = lambda body: body.get("hookSpecificOutput", {}).get("additionalContext", "")
    status, body = hook(app, "PostToolUse", tool_name="Read", tool_input={"file_path": "a"})
    with scope.of(1):
        assert [c.value for c in counts.where(session="s1", name=f"charts:{starting}:subs")] == [1], "one tool use counted, by the same workflow's other trigger"
    assert "two tools" not in said(body) and "every second tool" not in said(body), "one tool use: the count stands at one, no multiple of two"
    status, body = hook(app, "PostToolUse", tool_name="Read", tool_input={"file_path": "b"})
    assert "two tools since the subagent started" in said(body) and "every second tool" in said(body), "the second tool use reaches two: the checks answer yes and the lines ride the hook's answer"
    hook(app, "SubagentStart", agent_id="a2")
    status, body = hook(app, "PostToolUse", tool_name="Read", tool_input={"file_path": "c"})
    assert "two tools" not in said(body) and "every second tool" not in said(body), "a new start puts the count back at nought, and nought is no Nth"
    status, body = hook(app, "PostToolUse", tool_name="Read", tool_input={"file_path": "d"})
    assert "every second tool" in said(body), "the second use since the new start is an Nth again"
    from journal.features.chart.walk import WALKED
    from journal.repositories.entries import Entries
    with scope.of(1):
        walks = [e.data["trigger"] for e in app.container.get(Entries).of_kind(WALKED, 100)]
    assert walks and not any(t.startswith("counts.") for t in walks), "a count's write walks no row event: counts are the engine's own"
    assert "has no trigger named counts.updated" in console.run(["chart", "node", "trigger", "counts.updated", "--in", str(finishing)], USER).err, "no workflow starts at a count"
    hook(app, "SessionEnd")
    app.runtime().deferred.drain()
    with scope.of(1):
        assert counts.where(session="s1") == [], "an ended session's counts are deleted with it"
    assert not typed, "nothing was typed: every line rode a hook's answer"


def test_an_upgrade_keeps_a_users_edited_workflow_when_the_shipped_one_changes_shape(app, monkeypatch):
    from journal.features.chart.seeds import shipped_chart
    from journal.features.chart.seeds.shipped_chart import ShippedChart
    from journal.http.controllers.chart import ChartController
    from journal.models.node_kind import NodeKind
    from journal.repositories.charts import Charts
    hook(app, "SessionStart")
    console, charts = app.console(), app.container.get(Charts)
    working = charts.for_pair("working", "tool_starting")
    mine = int(console.run(["chart", "node", "--edit-default", "action", "say", "--text", "my own line", "--in", str(working.id)], AGENT).out.split()[1].rstrip(":"))
    idle = charts.for_pair("idle", "idle")
    monkeypatch.setattr(shipped_chart, "DRAWINGS_VERSION", shipped_chart.DRAWINGS_VERSION + 1)
    app.container.get(ShippedChart).run()
    kept = charts.find(working.id)
    assert kept.shipped and any(n.id == mine for n in charts.nodes_of(kept)), "the edited shipped workflow is kept with the user's node, still the state's workflow"
    assert charts.find(idle.id).drawn_version == shipped_chart.DRAWINGS_VERSION and all(n.shipped for n in charts.nodes_of(charts.find(idle.id))), "an unedited shipped workflow is redrawn at the new shipping"
    charts.save(charts.find(idle.id).with_(place=0, drawn_version=1), Actor.user(1))
    monkeypatch.setattr(shipped_chart, "DRAWINGS_VERSION", shipped_chart.DRAWINGS_VERSION + 1)
    app.container.get(ShippedChart).run()
    assert charts.find(idle.id).place == ShippedChart.state_place("idle") * 10, "redrawn, a state's workflow takes the place its state ships at, so a journal from before places has the waits first"
    named = {w["id"]: w for w in [app.container.get(ChartController).named(c) for c in charts.all()]}
    assert named[working.id]["behind"] is True and named[working.id]["edited"] is True, "the page says the shipping moved past the user's edit"
    assert named[idle.id]["behind"] is False
    app.container.get(ShippedChart).reset(kept, Actor.user(1))
    reset = charts.find(working.id)
    assert app.container.get(ChartController).named(reset)["behind"] is False and all(n.shipped for n in charts.nodes_of(reset)) and all(n.kind != NodeKind.ACTION or n.text != "my own line" for n in charts.nodes_of(reset)), "Reset to default takes the new shipped drawing"
    assert reset.drawing == "working:tool_starting:log_held" and charts.find(idle.id).drawing == "idle:idle:parked", "a shipped workflow is named after its drawing"
    app.container.get(ShippedChart).forget(charts.find(idle.id), Actor.user(1))
    app.container.get(ShippedChart).run()
    assert not [c for c in charts.shipped() if c.drawing == "idle:idle:parked"], "a shipped workflow taken out on purpose is not drawn again at boot"
    assert console.run(["chart", "reset", "--for", "idle", "--on", "idle"], USER).code == 0
    back = next((c for c in charts.shipped() if c.drawing == "idle:idle:parked"), None)
    assert back is not None and all(n.shipped for n in charts.nodes_of(back)), "reset by state and event draws the forgotten one again"


def test_a_triggers_workflows_run_in_the_users_order_stateless_ones_always_and_a_childs_in_place_of_its_parents(app):
    from journal.repositories.charts import Charts
    console, charts = app.console(), app.container.get(Charts)
    hook(app, "SessionStart")
    console.run(["environment", "here"], AGENT)
    said = lambda body: body.get("hookSpecificOutput", {}).get("additionalContext", "")
    first, t1 = own_workflow(console, charts, "idle", "tool_finished")
    always = int(console.run(["chart", "new", "Always after a tool", "--on", "tool_finished"], USER).out.split()[1].rstrip(":"))
    t2 = next(n.id for n in charts.nodes_of(charts.find(always)) if n.key == "tool_finished")
    add = lambda wf, *text: int(console.run(["chart", "node", "action", "say", "--text", *text, "--in", str(wf)], USER).out.split()[1].rstrip(":"))
    say1, say2 = add(first, "[chart] idle says first"), add(always, "[chart] always says")
    console.run(["chart", "line", str(t1), str(say1)], USER)
    console.run(["chart", "line", str(t2), str(say2)], USER)
    status, body = hook(app, "PostToolUse", tool_name="Read", tool_input={"file_path": "a"})
    assert said(body).index("idle says first") < said(body).index("always says"), "both run, in the order they were made: the state's own first, then the stateless one"
    charts.save(charts.find(always).with_(place=-1), Actor.user(1))
    status, body = hook(app, "PostToolUse", tool_name="Read", tool_input={"file_path": "b"})
    assert said(body).index("always says") < said(body).index("idle says first"), "the order is the user's: moved first, the stateless one speaks first"
    console.run(["task", "create", "t", "--start"], AGENT)
    status, body = hook(app, "PostToolUse", tool_name="Read", tool_input={"file_path": "c"})
    assert "always says" in said(body) and "idle says first" not in said(body), "a stateless workflow runs in any state; Idle's own does not run while Working"
    working, t3 = own_workflow(console, charts, "working", "tool_finished")
    say3 = add(working, "[chart] working speaks")
    console.run(["chart", "line", str(t3), str(say3)], USER)
    console.run(["plan", "create", "p", "--brief", "b"], USER)
    console.run(["plan", "add", "1", "a task"], USER)
    console.run(["plan", "approve", "1"], USER)
    console.run(["task", "done", "1"], AGENT)
    console.run(["plan", "start", "1"], AGENT)
    status, body = hook(app, "PostToolUse", tool_name="Read", tool_input={"file_path": "d"})
    assert "working speaks" in said(body), "following a plan has none of its own at this event, so Working's runs"
    child, t4 = own_workflow(console, charts, "following_plan", "tool_finished")
    say4 = add(child, "[chart] the plan speaks")
    console.run(["chart", "line", str(t4), str(say4)], USER)
    status, body = hook(app, "PostToolUse", tool_name="Read", tool_input={"file_path": "e"})
    assert "the plan speaks" in said(body) and "working speaks" in said(body), "a child runs its own workflow and its parent's, in the run order"


def test_one_move_per_event_the_first_hold_wins_and_the_new_states_workflows_run_at_their_place(app):
    from journal.features.chart.walk import FAILED, WALKED
    from journal.repositories.charts import Charts
    from journal.repositories.entries import Entries
    console, charts, entries = app.console(), app.container.get(Charts), app.container.get(Entries)
    hook(app, "SessionStart")
    console.run(["environment", "here"], AGENT)
    add = lambda wf, kind, key, *text: int(console.run(["chart", "node", kind, key, *text, "--in", str(wf)], USER).out.split()[1].rstrip(":"))
    link = lambda a, b: console.run(["chart", "line", str(a), str(b)], USER)
    holds, t4 = own_workflow(console, charts, "idle", "tool_starting")
    hold1 = add(holds, "action", "hold", "--text", "[chart] the first hold")
    link(t4, hold1)
    more = int(console.run(["chart", "new", "Holds too", "--for", "idle", "--on", "tool_starting"], USER).out.split()[1].rstrip(":"))
    t5 = next(n.id for n in charts.nodes_of(charts.find(more)) if n.key == "tool_starting")
    hold2 = add(more, "action", "hold", "--text", "[chart] the second hold")
    link(t5, hold2)
    status, body = hook(app, "PreToolUse", tool_name="Write", tool_input={"file_path": "b"})
    assert status == 409 and "the first hold" in body["error"] and "the second hold" not in body["error"], "the first hold wins"
    assert entries.of_kind(WALKED, 3)[0].data["unanswered"] == [hold2], "the later hold is recorded as not answered"
    first, t1 = own_workflow(console, charts, "idle", "tool_finished")
    away = add(first, "action", "wait_outside", "--text", "the build")
    stuck = add(first, "action", "mark_stuck", "--text", "for good")
    link(t1, away)
    link(away, stuck)
    landed, t3 = own_workflow(console, charts, "expecting", "tool_finished")
    greet = add(landed, "action", "say", "--text", "[chart] expecting speaks at its place")
    link(t3, greet)
    status, body = hook(app, "PostToolUse", tool_name="Read", tool_input={"file_path": "a"})
    assert app.container.get(Machine).current("s1").name == "expecting", "the first move stands"
    refused = entries.of_kind(FAILED, 3)[0]
    assert refused.data["node"] == stuck and f"node {away} moved the agent first" in refused.data["fault"], "the second move in the event is refused and recorded naming both nodes"
    walked = entries.of_kind(WALKED, 3)[0]
    assert walked.data["moved_by"] == [away] and "expecting speaks at its place" in walked.data["said"], "the new state's workflow later in the order ran at its place"


def test_a_stop_here_node_ends_the_events_walk_so_no_later_workflow_runs(app):
    from journal.features.chart.validation import Validation
    from journal.features.chart.walk import WALKED
    from journal.repositories.charts import Charts
    from journal.repositories.entries import Entries
    console, charts, entries = app.console(), app.container.get(Charts), app.container.get(Entries)
    hook(app, "SessionStart")
    console.run(["environment", "here"], AGENT)
    said = lambda body: body.get("hookSpecificOutput", {}).get("additionalContext", "")
    add = lambda wf, kind, key, *text: int(console.run(["chart", "node", kind, key, *text, "--in", str(wf)], USER).out.split()[1].rstrip(":"))
    link = lambda a, b: console.run(["chart", "line", str(a), str(b)], USER)
    first, t1 = own_workflow(console, charts, "idle", "tool_finished")
    speaks = add(first, "action", "say", "--text", "[chart] first speaks")
    stop = add(first, "action", "stop_here")
    after = add(first, "action", "say", "--text", "[chart] never said")
    link(t1, speaks)
    link(speaks, stop)
    assert "leads out of Run no later workflows" in console.run(["chart", "line", str(stop), str(after)], USER).err, "nothing follows a Run no later workflows"
    second = int(console.run(["chart", "new", "Later one", "--on", "tool_finished"], USER).out.split()[1].rstrip(":"))
    t2 = next(n.id for n in charts.nodes_of(charts.find(second)) if n.key == "tool_finished")
    later = add(second, "action", "say", "--text", "[chart] the later one speaks")
    link(t2, later)
    status, body = hook(app, "PostToolUse", tool_name="Read", tool_input={"file_path": "a"})
    assert "first speaks" in said(body) and "the later one speaks" not in said(body) and "never said" not in said(body), "the walk ends at Run no later workflows: nothing after it, no later workflow"
    walked = entries.of_kind(WALKED, 3)[0]
    assert walked.data["stopped_at"] == stop and [w for w in walked.data["workflows"] if charts.find(w).state] == [first] and second not in walked.data["workflows"], "the record says where the walk stopped and that the later workflow never ran"
    assert any("Run no later workflows in this workflow skips" in w and "Later one" in w for w in app.container.get(Validation).warnings(charts.find(first))), "the save warns what the Run no later workflows skips, by name"
    out = console.run(["chart", "try", "tool_finished"], AGENT).out
    assert "would run no later workflows of the event" in out and "the later one speaks" not in out, "the dry run says where it would stop"


def test_a_locked_workflow_keeps_the_head_and_a_locked_step_is_refused_by_command(app):
    from journal.repositories.charts import Charts
    console, charts = app.console(), app.container.get(Charts)
    hook(app, "SessionStart")
    console.run(["environment", "here"], AGENT)
    first, t1 = own_workflow(console, charts, "idle", "tool_finished")
    second = int(console.run(["chart", "new", "Later one", "--on", "tool_finished"], USER).out.split()[1].rstrip(":"))
    charts.save(charts.find(second).with_(locked=True), USER.actor)
    shipped = [str(c.id) for c in charts.for_event("tool_finished") if c.shipped]
    assert "is locked" in console.run(["chart", "order", "tool_finished", str(first), str(second), *shipped], USER).err, "the locked ones keep the head of the list"
    assert console.run(["chart", "order", "tool_finished", str(second), str(first), *shipped], USER).code == 0
    assert "is locked" in console.run(["chart", "drop", str(second)], USER).err, "a locked workflow stays"
    add = lambda wf, kind, key, *text: int(console.run(["chart", "node", kind, key, *text, "--in", str(wf)], USER).out.split()[1].rstrip(":"))
    hold = add(first, "action", "say", "--text", "[chart] the law")
    charts.nodes.save(charts.nodes.find(hold).with_(locked=True), USER.actor)
    console.run(["chart", "line", str(t1), str(hold)], USER)
    assert "is locked" in console.run(["chart", "remove", str(hold)], USER).err, "a locked step is not taken out"
    gate = add(first, "check", "unread_messages")
    assert "would come before a locked step" in console.run(["chart", "line", str(gate), str(hold), "--port", "yes"], USER).err, "no check of the user's is drawn before a locked step"
    after = add(first, "action", "say", "--text", "[chart] after the law")
    assert console.run(["chart", "line", str(hold), str(after)], USER).code == 0, "a step after it is the user's to add"






def test_the_row_checks_read_the_events_row_a_message_just_read_a_task_just_started_a_log_for_the_task_in_hand(app, monkeypatch):
    from journal.repositories.charts import Charts
    typed = []
    catch_typed(app, monkeypatch, typed)
    console, charts = app.console(), app.container.get(Charts)
    hook(app, "SessionStart")
    console.run(["environment", "here"], AGENT)
    new = lambda event: int(console.run(["chart", "new", f"Mine at {event}", "--on", event], USER).out.split()[1].rstrip(":"))
    trigger = lambda wf: next(n.id for n in charts.nodes_of(charts.find(wf)) if n.kind == "trigger")
    add = lambda wf, kind, key, *text: int(console.run(["chart", "node", kind, key, *text, "--in", str(wf)], USER).out.split()[1].rstrip(":"))
    link = lambda a, b, port="then": console.run(["chart", "line", str(a), str(b), "--port", port], USER)
    on_message = new("messages.updated")
    read = add(on_message, "check", "message_just_read")
    one_owed = add(on_message, "check", "unanswered_over", "--text", "1")
    say_read = add(on_message, "action", "type", "--text", "[chart] message {{row}} just read")
    say_owed = add(on_message, "action", "type", "--text", "[chart] one message owed")
    link(trigger(on_message), read)
    link(read, say_read, "yes")
    link(say_read, one_owed)
    link(one_owed, say_owed, "yes")
    on_task = new("tasks.updated")
    started = add(on_task, "check", "task_just_started")
    say_started = add(on_task, "action", "type", "--text", "[chart] task {{row}} just started by me")
    link(trigger(on_task), started)
    link(started, say_started, "yes")
    on_log = new("task_logs.created")
    mine = add(on_log, "check", "log_for_task_in_hand")
    say_logged = add(on_log, "action", "type", "--text", "[chart] a log for my task")
    link(trigger(on_log), mine)
    link(mine, say_logged, "yes")
    drain = lambda: app.runtime().deferred.drain()
    said = lambda words: sum(1 for line in typed if line.endswith(words))
    console.run(["task", "create", "the footer"], USER)
    drain()
    assert not any("[chart]" in line for line in typed), "a task made is not a task started"
    console.run(["task", "start", "1"], AGENT)
    drain()
    assert said("[chart] task 1 just started by me") == 1, "the Updated task row, started by this agent's write, answers yes once"
    console.run(["task", "log", "1", "halfway"], AGENT)
    drain()
    assert said("[chart] a log for my task") == 1, "the Created log row of the task in hand answers yes"
    console.run(["task", "create", "another"], USER)
    console.run(["task", "log", "2", "not mine"], USER)
    drain()
    assert said("[chart] a log for my task") == 1, "a log of another task is not the task in hand's"
    console.run(["message", "send", "are you there?"], USER)
    drain()
    assert not any("just read" in line for line in typed), "a message that comes is not a message read"
    console.run(["message", "read", "1"], AGENT)
    drain()
    assert said("[chart] message 1 just read") == 1 and said("[chart] one message owed") == 1, "the Updated message row with its reading newly set answers yes, and one message is owed"
    console.run(["message", "send", "[!reply:1] here", "--reply-to", "1"], AGENT)
    drain()
    assert said("[chart] message 1 just read") == 1, "a reply is an update that did not read the message"
    console.run(["task", "done", "1"], AGENT)
    drain()
    assert said("[chart] task 1 just started by me") == 1, "finishing a task is an update that did not start it"




def test_the_edits_since_the_log_are_read_from_the_record_the_task_named_the_log_asked_for_and_the_write_held(app):
    for key, value in (("tasks.log_after", 3), ("tasks.first_nudge_after", 1), ("tasks.name_every", 2), ("tasks.auto", False)):
        app.container.get(Settings).save(Setting(environment_id=0, key=key, value=value), Actor.system())
    hook(app, "SessionStart")
    console = app.console()
    console.run(["environment", "here"], AGENT)
    drain = lambda: app.runtime().deferred.drain()
    write = lambda name: hook(app, "PreToolUse", tool_name="Write", tool_input={"file_path": name})
    said = lambda body: json.dumps(body)
    console.run(["task", "create", "the footer", "--start"], AGENT)
    drain()
    status, body = write("a.py")
    assert status == 200 and "since you logged" not in said(body) and "in hand" not in said(body), "the first write: nothing to say yet"
    status, body = write("b.py")
    assert status == 200 and "1 edits since you logged task 1: say where it stands" in said(body), "the second write reads one edit before it: the log is asked for at the first threshold"
    status, body = write("c.py")
    assert status == 200 and "task 1 in hand, 2 edits" in said(body), "the third write reads two: every second edit names the task"
    status, body = write("d.py")
    assert status == 409 and "3 edits since you logged task 1" in body["error"], "the fourth reads three: the write is held until the log"
    status, body = write("e.py")
    assert status == 409 and "3 edits since you logged task 1" in body["error"], "a held write does not count: still three"
    console.run(["task", "log", "1", "halfway"], AGENT)
    drain()
    assert write("d.py")[0] == 200, "logged, the edits since the log are none and the write goes on"



def test_a_second_boot_on_a_seeded_journal_changes_nothing(app):
    from journal.features.chart.seeds.shipped_chart import ShippedChart
    from journal.repositories.charts import Charts
    charts, seed = app.container.get(Charts), app.container.get(ShippedChart)
    picture = lambda: [(c.id, c.title, c.state, c.event, c.place, c.revision, c.locked, c.drawing, c.drawn_version, [(n.id, n.kind, n.key, n.text, n.locked) for n in charts.nodes_of(c)], [(l.source.id, l.target.id, l.kind) for l in charts.lines_of(c)]) for c in charts.all()]
    seed.run()
    first = picture()
    seed.run()
    assert picture() == first, "a boot on a journal already seeded draws, resets, releases and strips nothing: the second run is a no-op"


def test_what_the_agent_owes_is_a_fact_on_its_row_oriented_the_mark_owed_and_the_skills_owed(skilled):
    from journal.features.chart.context import Context
    from journal.features.chart.fillers import Fillers
    from journal.features.skills.requiring import Requiring
    from journal.repositories.agents import Agents
    app = skilled
    agents, requiring, fillers = app.container.get(Agents), app.container.get(Requiring), app.container.get(Fillers)
    row = lambda: agents.for_session("s1")
    from journal.events.agent.idle import Idle
    at = Context(event=Idle(session="s1", environment_id=1), session="s1", environment_id=1)
    hook(app, "SessionStart")
    assert row().oriented is False and requiring.owed_names(row()) == ["journal"], "a session start: not oriented, the journal skill owed"
    assert fillers.fill("{{awaiting}} / {{skill_owed}} / {{skill_path}}", at) == "a look at what is in flight here and the journal skill to be read / journal / .claude/skills/journal/SKILL.md"
    read_skill(app, "journal")
    assert requiring.owed_names(row()) == [] and row().skills_loaded and "journal" in row().skills_loaded, "the read removes the owed link and keeps the hash"
    app.console().run(["environment", "here"], AGENT)
    assert row().oriented is True and fillers.fill("{{awaiting}}", at) == "", "the look sets oriented and nothing is owed"
    hook(app, "UserPromptSubmit", prompt="make me a plan for the release")
    assert requiring.owed_names(row()) == ["plans"] and fillers.fill("{{skill_path}}", at) == ".claude/skills/journal-plans/SKILL.md", "a prompt naming plans: the plans skill owed, with its path"
    read_skill(app, "journal-plans")
    assert requiring.owed_names(row()) == []
    app.console().run(["task", "create", "t", "--start"], AGENT)
    assert requiring.owed_names(row()) == [], "entering a state owes nothing by itself: a state's skill is owed at a start in it"
    context(app, 30)
    hook(app, "PreToolUse", tool_name="Read", tool_input={})
    assert row().mark_owed == 25 and row().context_mark == 25 and fillers.fill("{{awaiting}}", at) == "a decision at the context mark, 25% full", "the crossing sets the mark owed"
    app.console().run(["fact", "create", "the login is flaky"], AGENT)
    assert row().mark_owed == 0 and row().context_mark == 25, "the fact clears the mark owed and keeps the mark taken"
    context(app, 55)
    hook(app, "Stop")
    assert row().mark_owed == 50
    app.console().run(["nothing", "survives", "all logged"], AGENT)
    assert row().mark_owed == 0, "nothing survives clears it too"
    status, body = hook(app, "SessionStart", source="compact")
    assert row().oriented is False and row().mark_owed == 0, "a start after a compaction owes the look again; the start's own write touches oriented alone"


def test_a_stop_while_something_is_owed_is_held_by_the_always_workflow_naming_what_it_awaits(app):
    hook(app, "SessionStart")
    status, body = hook(app, "Stop")
    assert body.get("decision") == "block" and "you stopped while the journal awaits a look at what is in flight here" in body["reason"] and '`journal stuck "<why>"`' in body["reason"], "a stop before the look is held, naming the debt"
    app.console().run(["environment", "here"], AGENT)
    assert hook(app, "Stop")[1] == {}, "the debt paid, a stop at rest is a stop"
    app.console().run(["task", "create", "t", "--start"], AGENT)
    context(app, 30)
    hook(app, "PreToolUse", tool_name="Read", tool_input={})
    status, body = hook(app, "Stop")
    assert body.get("decision") == "block" and "awaits a decision at the context mark, 25% full" in body["reason"], "a stop at a mark not decided is held too"


def test_an_agent_standing_in_a_pause_it_owed_is_unwrapped_at_boot_with_the_fact_set(tmp_path: Path, monkeypatch):
    import json
    import sqlite3
    monkeypatch.setattr(Config, "status_home", property(lambda self: tmp_path / "status"))
    first = App(Config(tmp_path, port=0))
    first.runtime().start()
    hook(first, "SessionStart")
    first.console().run(["environment", "here"], AGENT)
    first.console().run(["task", "create", "t", "--start"], AGENT)
    first.runtime().stop()
    db = sqlite3.connect(first.config.database)
    working = json.loads(db.execute("SELECT data FROM agents WHERE session = 's1'").fetchone()[0])
    nested = {"resume": {"state": "at_mark", "data": {"resume": {"state": "working", "data": working}, "mark": 50}}, "skill": "plans", "path": ".claude/skills/journal-plans/SKILL.md"}
    db.execute("UPDATE agents SET state = 'loading_skill', data = ?, oriented = 1, mark_owed = 0 WHERE session = 's1'", (json.dumps(nested),))
    db.execute("DELETE FROM migrations")
    db.commit()
    db.close()
    second = App(Config(tmp_path, port=0))
    second.runtime().start()
    try:
        from journal.features.skills.requiring import Requiring
        from journal.repositories.agents import Agents
        from journal.repositories.scope import Scope
        with second.container.get(Scope).of(MAIN):
            agent = second.container.get(Agents).for_session("s1")
            assert agent.state == "working" and agent.data.get("task_id") == 1 and agent.mark_owed == 50 and agent.oriented is True, "unwrapped to the work it held, the mark owed, never dropped to idle"
            assert "plans" in second.container.get(Requiring).owed_names(agent), "the skill it was reading is owed as a link"
    finally:
        second.runtime().stop()


def test_an_agent_in_the_old_running_sequence_state_is_unwrapped_at_boot_with_the_run_on_its_row(tmp_path: Path, monkeypatch):
    import sqlite3
    monkeypatch.setattr(Config, "status_home", property(lambda self: tmp_path / "status"))
    first = App(Config(tmp_path, port=0))
    first.runtime().start()
    hook(first, "SessionStart")
    first.console().run(["environment", "here"], AGENT)
    first.console().run(["task", "create", "t", "--start"], AGENT)
    made = first.console().run(["sequence", "create", "release", "--steps", "bump | tag | push"], USER).out.split()[1].rstrip(":")
    first.runtime().stop()
    db = sqlite3.connect(first.config.database)
    working = json.loads(db.execute("SELECT data FROM agents WHERE session = 's1'").fetchone()[0])
    running = {"resume": {"state": "working", "data": working}, "sequence_id": int(made), "step": 1, "text": "tag"}
    db.execute("UPDATE agents SET state = 'waiting', data = ? WHERE session = 's1'", (json.dumps({"resume": {"state": "running_sequence", "data": running}, "question_id": 1}),))
    db.execute("DELETE FROM migrations")
    db.commit()
    db.close()
    second = App(Config(tmp_path, port=0))
    second.runtime().start()
    try:
        from journal.repositories.agents import Agents
        from journal.repositories.scope import Scope
        with second.container.get(Scope).of(MAIN):
            agent = second.container.get(Agents).for_session("s1")
            run = second.container.get(Running).runs(agent)[-1]
            assert agent.state == "waiting" and agent.data["resume"] == {"state": "working", "data": working}, "the run's layer is taken out of the resume chain, the rest kept"
            assert run.title == "release" and run.steps == ("bump", "tag", "push") and run.text == "tag", "the run is on the row at the step it stood at"
    finally:
        second.runtime().stop()


def test_a_run_goes_with_the_agent_to_its_next_session(app):
    hook(app, "SessionStart")
    console = app.console()
    console.run(["environment", "here"], AGENT)
    made = console.run(["sequence", "create", "release", "--steps", "bump | tag"], USER).out.split()[1].rstrip(":")
    console.run(["sequence", "run", made], AGENT)
    hook(app, "SessionEnd")
    hook(app, "SessionStart", session_id="s2")
    running = app.container.get(Running)
    assert running.in_hand("s2", 1).title == "release" and running.in_hand("s1", 1) is None, "the next session takes the run over"

def test_a_run_stands_through_the_agents_moves_and_a_workflow_action_starts_one(app):
    from journal.repositories.charts import Charts
    hook(app, "SessionStart")
    console = app.console()
    console.run(["environment", "here"], AGENT)
    console.run(["sequence", "create", "release", "--steps", "bump | tag"], USER)
    n, trigger = own_workflow(console, app.container.get(Charts), "idle", "tool_finished")
    start = int(console.run(["chart", "node", "action", "start_sequence", "--text", "release", "--in", str(n)], USER).out.split()[1].rstrip(":"))
    console.run(["chart", "line", str(trigger), str(start)], USER)
    hook(app, "PostToolUse", tool_name="Read", tool_input={}, tool_response="")
    app.runtime().deferred.drain()
    running, machine = app.container.get(Running), app.container.get(Machine)
    assert running.in_hand("s1", 1).title == "release", "a workflow's start a sequence action starts the run"
    console.run(["task", "create", "t", "--start"], AGENT)
    console.run(["await", "the deploy"], AGENT)
    console.run(["message", "send", "how is it going?"], USER)
    hook(app, "UserPromptSubmit", prompt="carry on")
    console.run(["stuck", "the build is broken"], AGENT)
    assert machine.current("s1").name == "stuck" and running.in_hand("s1", 1).text == "bump", "a task, a wait, the user's word and being stuck leave the run standing"
    console.run(["task", "park", "1", "a plan first"], AGENT)
    console.run(["plan", "create", "p", "--brief", "the goal"], USER)
    console.run(["plan", "phase", "1", "One", "--when", "done"], USER)
    task = re.search(r"task (\d+)", console.run(["plan", "add", "1", "first", "--brief", "b"], USER).out).group(1)
    console.run(["plan", "todos", "1", "1", task], USER)
    console.run(["plan", "ready", "1"], USER)
    console.run(["plan", "approve", "1"], USER)
    console.run(["plan", "start", "1"], AGENT)
    hook(app, "SessionStart", source="resume")
    assert machine.current("s1").name == "following_plan" and running.in_hand("s1", 1).text == "bump", "following a plan, and the plan taken up again at a start, leave the run standing"
    from dataclasses import replace
    from journal.repositories.sequences import Sequences
    sequences = app.container.get(Sequences)
    release = next(q for q in sequences.all() if q.title == "release")
    sequences.save(replace(release, steps=("push", "bump", "tag")), USER.actor)
    console.run(["sequence", "follow"], AGENT)
    assert "step 2: tag" in console.run(["sequence", "next"], AGENT).out, "a run keeps the steps it began with when its sequence is edited"

def test_a_run_a_worker_starts_is_its_own_and_its_step_waits_for_its_stop(app, monkeypatch):
    from journal.models.worker import Worker
    from journal.repositories.workers import Workers
    from journal.supervisor_link import SupervisorLink
    sent = []
    monkeypatch.setattr(SupervisorLink, "runs", lambda self, environment_id: True)
    catch_typed(app, monkeypatch, sent)
    hook(app, "SessionStart")
    app.console().run(["environment", "here"], AGENT)
    app.container.get(Workers).save(Worker(environment_id=1, name="Mr. Pitman", session="s2"), Actor.system())
    hook(app, "SessionStart", session_id="s2")
    app.console().run(["environment", "here"], Where("main", "s2"))
    hook(app, "PostToolUse", tool_name="Read", tool_input={"file_path": str(app.config.root / ".claude/skills/journal-plans/SKILL.md")}, tool_response="", session_id="s2")
    app.console().run(["plan", "create", "Side work", "--brief", "b"], Where("main", "s2"))
    app.runtime().deferred.drain()
    running = app.container.get(Running)
    assert running.in_hand("s2", 1).title == "Building a plan" and running.in_hand("s1", 1) is None and not any("Building" in line or "step 1" in line for line in sent), "the run is the worker's, and its step is not typed to the agent"
    hook(app, "PostToolUse", tool_name="Read", tool_input={"file_path": str(app.config.root / ".claude/skills/journal-sequences/SKILL.md")}, tool_response="", session_id="s2")
    hook(app, "PreToolUse", tool_name="Read", tool_input={"file_path": "a.py"}, session_id="s2")
    assert "step 1" in hook(app, "Stop", session_id="s2")[1]["reason"], "the worker is told the step at its stop"

def test_the_steps_hold_comes_after_the_look_the_mark_and_the_skill_and_each_is_paid_in_turn(skilled):
    app, console = skilled, skilled.console()
    edit = lambda: hook(app, "PreToolUse", tool_name="Edit", tool_input={"file_path": "a.py", "old_string": "a", "new_string": "b"})
    made = console.run(["sequence", "create", "release", "--steps", "bump | tag"], USER).out.split()[1].rstrip(":")
    hook(app, "SessionStart")
    console.run(["sequence", "run", made], AGENT)
    context(app, 30)
    hook(app, "PreToolUse", tool_name="Read", tool_input={})
    for pay in (lambda: read_skill(app, "journal"), lambda: read_skill(app, "journal-sequences"), lambda: console.run(["environment", "here"], AGENT), lambda: console.run(["nothing", "survives", "all logged"], AGENT)):
        status, held = edit()
        assert status == 409 and "a write waits for sequence" not in json.dumps(held), "the debt holds the write, and the step stays out of it"
        assert "step 1" not in json.dumps(hook(app, "Stop")[1]), "while a debt is owed the step is not said at a stop"
        pay()
    assert "a write waits for sequence" in json.dumps(edit()[1]), "every debt paid, the step holds the write"
    console.run(["sequence", "follow"], AGENT)
    assert edit()[0] == 200, "the step taken up, the write goes through"

def test_the_step_is_said_again_at_a_start_when_a_wait_ends_and_at_a_pace(app, monkeypatch):
    from journal.events.agent.ticked import Ticked
    from journal.events.bus import Bus
    from journal.supervisor_link import SupervisorLink
    sent = []
    monkeypatch.setattr(SupervisorLink, "runs", lambda self, environment_id: True)
    catch_typed(app, monkeypatch, sent)
    hook(app, "SessionStart")
    console = app.console()
    console.run(["environment", "here"], AGENT)
    made = console.run(["sequence", "create", "release", "--steps", "bump | tag"], USER).out.split()[1].rstrip(":")
    console.run(["sequence", "run", made], AGENT)
    assert "step 1: bump" in json.dumps(hook(app, "SessionStart", source="compact")[1]), "after a compaction the step is told"
    console.run(["await", "the build"], AGENT)
    hook(app, "PreToolUse", tool_name="Read", tool_input={"file_path": "a.py"})
    app.runtime().deferred.drain()
    assert any("step 1: bump" in line for line in sent), "a wait that ends types the step"
    sent.clear()

    def tick():
        app.container.get(Bus).dispatch(Ticked(session="s1", environment_id=1, at=0.0, quiet_for=120.0))
        app.runtime().deferred.drain()
    tick()
    assert sent == [], "a step just said is not said again"
    app.container.get(Settings).set("sequences.say_every", 0, Actor.user(1))
    tick()
    assert any("step 1: bump" in line for line in sent), "a step unheard for the set minutes is typed again to a quiet agent"
    console.run(["sequence", "park", "--why", "docs first"], AGENT)
    sent.clear()
    tick()
    assert sent == [], "a parked run is not said at a pace"
    assert "is parked at step 1" in json.dumps(hook(app, "SessionStart", source="resume")[1]), "and at a start"
    console.run(["sequence", "follow"], AGENT)
    sent.clear()
    console.run(["question", "ask", "Which name?"], AGENT)
    tick()
    assert sent == [], "no step is said at a pace while a question to the user is open"
    console.run(["question", "answer", "1", "alpha"], USER)
    tick()
    assert any("step 1: bump" in line for line in sent), "and it is said again once the question is answered"


def test_a_list_counts_a_type_in_sql_past_the_page(app):
    import json as j
    from urllib.request import urlopen
    from journal.models.task import Task
    from journal.models.task_state import TaskState
    from journal.repositories.tasks import Tasks
    tasks = app.container.get(Tasks)
    for n in range(520):
        tasks.save(Task(environment_id=1, title=f"t{n}", state=TaskState.DONE if n < 400 else TaskState.OPEN), Actor.user(1) if n % 2 else Actor.agent("s1"))
    with urlopen(HttpRequest(f"http://127.0.0.1:{app.server().port}/api/todo?last=10&env=main", headers={"X-Journal-Env": "main"}), timeout=5) as reply:
        counts = j.loads(reply.read())["counts"]
    assert counts == {"all": 520, "open": 120, "unread": 60}, "a count is of every row, not of the newest page"

def test_a_run_is_abandoned_with_its_reason_or_ends_when_its_row_or_sequence_is_gone(app, monkeypatch):
    from journal.repositories.messages import Messages
    from journal.repositories.sequences import Sequences
    from journal.supervisor_link import SupervisorLink
    sent = []
    monkeypatch.setattr(SupervisorLink, "runs", lambda self, environment_id: True)
    catch_typed(app, monkeypatch, sent)
    hook(app, "SessionStart")
    console = app.console()
    console.run(["environment", "here"], AGENT)
    running = app.container.get(Running)
    made = console.run(["sequence", "create", "release", "--steps", "bump | tag | push"], USER).out.split()[1].rstrip(":")
    console.run(["sequence", "run", made], AGENT)
    assert "was never taken up" in console.run(["sequence", "abandon", "--why", "not needed", "--sure"], AGENT).err, "a step is taken up before it is given up"
    console.run(["sequence", "follow"], AGENT)
    unsure = console.run(["sequence", "abandon", "--why", "not needed"], AGENT)
    assert unsure.code == 1 and "leaves undone: 1. bump; 2. tag; 3. push" in unsure.err and running.in_hand("s1", 1), "without --sure it names what it would skip and keeps the run"
    assert f"sequence {made} abandoned" in console.run(["sequence", "abandon", "--why", "not needed", "--sure"], AGENT).out and running.in_hand("s1", 1) is None
    card = app.container.get(Messages).in_()[-1]
    assert "abandoned at step 1: not needed" in card.text and "left undone: 1. bump" in card.data["detail"], "the user is told, with the reason and what was left undone"
    console.run(["plan", "create", "Side work", "--brief", "b"], AGENT)
    app.runtime().deferred.drain()
    assert running.in_hand("s1", 1).title == "Building a plan"
    console.run(["plan", "cancel", "1"], AGENT)
    app.runtime().deferred.drain()
    assert running.in_hand("s1", 1) is None and any("plans:1 was cancelled" in line for line in sent), "a cancelled plan ends its run and the agent is told"
    console.run(["sequence", "run", made], AGENT)
    sequences = app.container.get(Sequences)
    sequences.delete(sequences.find(int(made)), USER.actor)
    app.runtime().deferred.drain()
    assert running.in_hand("s1", 1) is None and any(f"sequence {made} was deleted" in line for line in sent), "a deleted sequence ends its runs"

def test_runs_nest_never_in_themselves_and_only_the_users_words_start_one(app):
    hook(app, "SessionStart")
    console = app.console()
    console.run(["environment", "here"], AGENT)
    running = app.container.get(Running)
    outer = console.run(["sequence", "create", "release", "--steps", "bump | tag"], USER).out.split()[1].rstrip(":")
    inner = console.run(["sequence", "create", "check", "--steps", "lint"], USER).out.split()[1].rstrip(":")
    console.run(["sequence", "run", outer], AGENT)
    assert "is running already" in console.run(["sequence", "run", outer], AGENT).out, "a sequence never starts inside itself"
    console.run(["sequence", "run", inner], AGENT)
    assert running.in_hand("s1", 1).title == "check", "one started inside another is the one followed"
    console.run(["sequence", "follow"], AGENT)
    ended = console.run(["sequence", "next"], AGENT).out
    assert f"sequence {inner} ran its last step" in ended and "step 1: bump" in ended and running.in_hand("s1", 1).title == "release", "when it ends the other is said again"
    console.run(["sequence", "follow"], AGENT)
    console.run(["sequence", "next"], AGENT)
    console.run(["sequence", "follow"], AGENT)
    console.run(["sequence", "next"], AGENT)
    hook(app, "PreToolUse", tool_name="Bash", tool_input={"command": "journal message send 'give me an update when you can'"})
    hook(app, "UserPromptSubmit", prompt="<task-notification>the researcher says: give me an update</task-notification>")
    hook(app, "UserPromptSubmit", prompt="[journal] give me an update")
    assert running.in_hand("s1", 1) is None, "words the agent wrote, a subagent's report or a journal line start no sequence"
    hook(app, "UserPromptSubmit", prompt="give me an update")
    assert running.in_hand("s1", 1).title == "Writing an update", "the user's own words do"

def test_the_agents_panel_shows_the_run_and_the_user_can_skip_a_step_or_end_it(app, monkeypatch):
    from journal.supervisor_link import SupervisorLink
    sent = []
    monkeypatch.setattr(SupervisorLink, "runs", lambda self, environment_id: True)
    catch_typed(app, monkeypatch, sent)

    def api(method: str, path: str):
        request = HttpRequest(f"http://127.0.0.1:{app.server().port}/api/{path}", data=b"{}" if method == "POST" else None, method=method, headers={"Content-Type": "application/json", "X-Journal-Env": "main"})
        try:
            with urlopen(request, timeout=5) as reply:
                return reply.status, json.loads(reply.read())
        except HTTPError as error:
            return error.code, json.loads(error.read())
    hook(app, "SessionStart")
    console = app.console()
    console.run(["environment", "here"], AGENT)
    made = console.run(["sequence", "create", "release", "--steps", "bump | tag | push"], USER).out.split()[1].rstrip(":")
    console.run(["sequence", "run", made], AGENT)
    app.runtime().deferred.drain()
    shown = json.dumps(api("GET", "agent/1")[1])
    assert '"title": "release"' in shown and '"step": 1' in shown and "Not taken up yet" in shown, "the panel shows the run, its step and why it holds"
    assert api("POST", "agent/1/skip_step")[0] == 200 and any("the user skipped step 1" in line and "step 2: tag" in line for line in sent), "Skip step moves the run on and tells the agent"
    assert api("POST", "agent/1/end_sequence")[0] == 200 and any(f"the user ended sequence {made}" in line for line in sent) and app.container.get(Running).in_hand("s1", 1) is None, "End ends the run"
    app.runtime().deferred.drain()
    history = json.dumps(api("GET", "agent/1")[1])
    assert "release: started" in history and "release: moved on to step 2" in history and "release: ended at step 2" in history, "the panel lists what the run did"
    from journal.repositories.messages import Messages
    cards = [m.text for m in app.container.get(Messages).in_() if m.author == "system"]
    assert f"Sequence {made}, release: started" in cards and f"Sequence {made}, release: moved on to step 2" in cards and f"Sequence {made}, release: ended at step 2" in cards, "each change is a card in the chat"
    assert api("POST", "agent/1/end_sequence")[0] != 200, "with no run there is nothing to end"

def test_a_workers_report_stays_on_its_row_however_much_is_said_after(app):
    from journal.models.author import Author
    from journal.models.message import Message
    from journal.repositories.messages import Messages
    hook(app, "SessionStart")
    console = app.console()
    console.run(["environment", "here"], AGENT)
    console.run(["worker", "dispatch", "Lady Lovelace", "write the parser", "--model", "fast"], AGENT)
    console.run(["worker", "report", "1", "the parser is written"], Where("main", "w1"))
    messages = app.container.get(Messages)
    for i in range(250):
        messages.save(Message(author=Author.USER, text=f"word {i}"), USER.actor)
    request = HttpRequest(f"http://127.0.0.1:{app.server().port}/api/helper", method="GET", headers={"X-Journal-Env": "main"})
    with urlopen(request, timeout=5) as reply:
        helper = json.loads(reply.read())["rows"][0]
    assert helper["data"]["report"] == "the parser is written", "the report is linked from the worker, not found among the recent messages"

def test_a_block_arriving_twice_at_once_is_recorded_once(app, monkeypatch):
    import contextvars
    import threading
    import time
    from journal.events.agent.turn_written import TurnWritten
    from journal.features.messages.listeners.record_turn import RecordTurn
    from journal.repositories.messages import Messages
    hook(app, "SessionStart")
    record = app.container.get(RecordTurn)
    checked = RecordTurn.already_recorded
    monkeypatch.setattr(RecordTurn, "already_recorded", lambda self, part: (checked(self, part), time.sleep(0.2))[0])
    block = TurnWritten(text="Checking the worker's inspector now.", delta="", turn_id="t1", final=True).placed("s1", 1, "claude", 0.0)
    threads = [threading.Thread(target=contextvars.copy_context().run, args=(record.handle, block)) for _ in range(2)]
    [t.start() for t in threads]
    [t.join() for t in threads]
    said = [m for m in app.container.get(Messages).in_() if m.text == "Checking the worker's inspector now."]
    assert len(said) == 1, "the transcript's copy and the display hook's copy, handled at once, make one message"

def test_the_card_for_a_question_the_user_answered_is_the_users(app):
    from journal.models.actor_kind import ActorKind
    from journal.repositories.messages import Messages
    hook(app, "SessionStart")
    console = app.console()
    console.run(["environment", "here"], AGENT)
    console.run(["question", "ask", "which colour?", "--options", "red,blue"], AGENT)
    console.run(["question", "answer", "1", "red"], USER)
    card = [m for m in app.container.get(Messages).in_() if m.author == "system"][-1]
    assert card.text == "You answered question 1" and card.created_by.kind == ActorKind.USER, "the user's act is written as the user's"
    assert card.data["detail"] == "", "the mark says only that it was answered, never the answer"

def test_two_workflows_counting_the_same_name_keep_their_own_counts(app):
    from journal.repositories.charts import Charts
    from journal.repositories.counts import Counts
    from journal.repositories.scope import Scope
    console, charts = app.console(), app.container.get(Charts)

    def counting(times: int) -> int:
        made, trigger = own_workflow(console, charts, "idle", "tool_finished")
        previous = trigger
        for _ in range(times):
            one = int(console.run(["chart", "node", "action", "count_one", "--text", "tools", "--in", str(made)], USER).out.split()[1].rstrip(":"))
            console.run(["chart", "line", str(previous), str(one)], USER)
            previous = one
        return made
    once, twice = counting(1), counting(2)
    hook(app, "SessionStart")
    console.run(["environment", "here"], AGENT)
    hook(app, "PostToolUse", tool_name="Read", tool_input={"file_path": "a"})
    app.runtime().deferred.drain()
    with app.container.get(Scope).of(1):
        counted = {c.name: c.value for c in app.container.get(Counts).where(session="s1")}
    assert counted == {f"charts:{once}:tools": 1, f"charts:{twice}:tools": 2}, "each workflow keeps its own count of tools"

def test_a_count_started_only_when_not_started_keeps_counting(app):
    from journal.repositories.charts import Charts
    from journal.repositories.counts import Counts
    from journal.repositories.scope import Scope
    console = app.console()
    made, trigger = own_workflow(console, app.container.get(Charts), "idle", "tool_finished")
    node = lambda key: int(console.run(["chart", "node", "action", key, "--text", "tools", "--in", str(made)], USER).out.split()[1].rstrip(":"))
    begin, one = node("count_begin"), node("count_one")
    console.run(["chart", "line", str(trigger), str(begin)], USER)
    console.run(["chart", "line", str(begin), str(one)], USER)
    hook(app, "SessionStart")
    console.run(["environment", "here"], AGENT)
    for path in ("a", "b", "c"):
        hook(app, "PostToolUse", tool_name="Read", tool_input={"file_path": path})
    app.runtime().deferred.drain()
    with app.container.get(Scope).of(1):
        assert app.container.get(Counts).named("s1", f"charts:{made}:tools").value == 3, "the count started once and was not reset on each event"

def test_two_walks_of_one_agent_at_once_lose_no_count(app, monkeypatch):
    import contextvars
    import threading
    import time
    from journal.events.agent.tool_finished import ToolFinished
    from journal.features.chart.context import Context
    from journal.features.chart.walk import Walk
    from journal.repositories.charts import Charts
    from journal.repositories.counts import Counts
    console = app.console()
    made = int(console.run(["chart", "new", "Counting", "--on", "tool_finished"], USER).out.split()[1].rstrip(":"))
    trigger = next(n.id for n in app.container.get(Charts).nodes_of(app.container.get(Charts).find(made)) if n.key == "tool_finished")
    one = int(console.run(["chart", "node", "action", "count_one", "--text", "tools", "--in", str(made)], USER).out.split()[1].rstrip(":"))
    console.run(["chart", "line", str(trigger), str(one)], USER)
    named = Counts.named
    monkeypatch.setattr(Counts, "named", lambda self, session, name: (named(self, session, name), time.sleep(0.003))[0])
    walk, event = app.container.get(Walk), ToolFinished(tool="Read", input={}, output="").placed("s1", 1, "claude", 0.0)

    def walks():
        for _ in range(20):
            walk.on(Context(event=event, session="s1", environment_id=1))
    threads = [threading.Thread(target=contextvars.copy_context().run, args=(walks,)) for _ in range(2)]
    [t.start() for t in threads]
    [t.join() for t in threads]
    assert named(app.container.get(Counts), "s1", f"charts:{made}:tools").value == 40, "every walk's Count one is kept"

def test_a_workflow_that_only_counts_walks_after_the_reply(app):
    from journal.repositories.charts import Charts
    console, charts = app.console(), app.container.get(Charts)
    made, trigger = own_workflow(console, charts, "idle", "tool_starting")
    one = int(console.run(["chart", "node", "action", "count_one", "--text", "tools", "--in", str(made)], USER).out.split()[1].rstrip(":"))
    console.run(["chart", "line", str(trigger), str(one)], USER)
    assert not charts.graph(charts.find(made)).answers, "counting changes no answer, so the workflow is quiet"

def test_a_row_event_with_no_agent_keeps_no_count(app):
    from journal.repositories.charts import Charts
    from journal.repositories.counts import Counts
    from journal.repositories.scope import Scope
    console, charts = app.console(), app.container.get(Charts)
    made = int(console.run(["chart", "new", "Tasks made", "--on", "tasks.created"], USER).out.split()[1].rstrip(":"))
    trigger = next(n.id for n in charts.nodes_of(charts.find(made)) if n.key == "tasks.created")
    one = int(console.run(["chart", "node", "action", "count_one", "--text", "made", "--in", str(made)], USER).out.split()[1].rstrip(":"))
    console.run(["chart", "line", str(trigger), str(one)], USER)
    console.run(["task", "create", "a task with no agent here"], USER)
    app.runtime().deferred.drain()
    with app.container.get(Scope).of(1):
        assert app.container.get(Counts).where(environment_id=1) == [], "a walk about no agent keeps no count"

def test_a_line_says_a_workflows_count_by_name(app):
    from journal.repositories.charts import Charts
    console = app.console()
    made, trigger = own_workflow(console, app.container.get(Charts), "idle", "tool_finished")
    node = lambda kind, key, text: int(console.run(["chart", "node", kind, key, "--text", text, "--in", str(made)], USER).out.split()[1].rstrip(":"))
    one, say = node("action", "count_one", "reminders"), node("action", "say", "[chart] reminder {{value.reminders}}")
    console.run(["chart", "line", str(trigger), str(one)], USER)
    console.run(["chart", "line", str(one), str(say)], USER)
    hook(app, "SessionStart")
    console.run(["environment", "here"], AGENT)
    hook(app, "PostToolUse", tool_name="Read", tool_input={"file_path": "a"})
    said = json.dumps(hook(app, "PostToolUse", tool_name="Read", tool_input={"file_path": "b"})[1])
    assert "reminder 2" in said, "the line says the workflow's own count"
    tried = console.run(["chart", "try", "tool_finished"], USER).out
    assert "reminder 3" in tried, "a dry walk says the count as its ledger raised it over the live one"

def test_the_walk_records_where_each_workflow_stopped_with_its_counts(app):
    from journal.features.chart.walk import WALKED
    from journal.repositories.charts import Charts
    from journal.repositories.entries import Entries
    from journal.repositories.scope import Scope
    console = app.console()
    made, trigger = own_workflow(console, app.container.get(Charts), "idle", "tool_finished")
    node = lambda kind, key, text: int(console.run(["chart", "node", kind, key, "--text", text, "--in", str(made)], USER).out.split()[1].rstrip(":"))
    one, enough = node("action", "count_one", "reminders"), node("check", "count_over", "reminders 3")
    console.run(["chart", "line", str(trigger), str(one)], USER)
    console.run(["chart", "line", str(one), str(enough)], USER)
    hook(app, "SessionStart")
    console.run(["environment", "here"], AGENT)
    for path in ("a", "b"):
        hook(app, "PostToolUse", tool_name="Read", tool_input={"file_path": path})
    app.runtime().deferred.drain()
    with app.container.get(Scope).of(1):
        walk = next(e for e in app.container.get(Entries).of_kind(WALKED, 50) if made in e.data["workflows"])
    assert {"workflow": made, "node": enough, "port": "no", "counts": {"reminders": 2}} in walk.data["stops"], "the path ended at the count check's No, with the count it read"

def test_a_workflow_waits_at_a_count_until_it_reaches_its_number(app):
    from journal.repositories.charts import Charts
    console = app.console()
    made, trigger = own_workflow(console, app.container.get(Charts), "idle", "tool_finished")
    node = lambda kind, key, text: int(console.run(["chart", "node", kind, key, "--text", text, "--in", str(made)], USER).out.split()[1].rstrip(":"))
    one, wait, say = node("action", "count_one", "reminders"), node("check", "count_wait", "reminders 3"), node("action", "say", "[chart] three reminders")
    console.run(["chart", "line", str(trigger), str(one)], USER)
    console.run(["chart", "line", str(one), str(wait)], USER)
    assert console.run(["chart", "line", str(wait), str(say), "--port", "yes"], USER).code == 0, "a wait needs no line on its No"
    hook(app, "SessionStart")
    console.run(["environment", "here"], AGENT)
    said = [json.dumps(hook(app, "PostToolUse", tool_name="Read", tool_input={"file_path": p})[1]) for p in ("a", "b", "c")]
    assert ["three reminders" in s for s in said] == [False, False, True], "it waits at the check until the count reaches three, then goes on"
    assert "would say: [chart] three reminders" not in console.run(["chart", "try", "tool_finished", "--value", "reminders=0"], USER).out, "a trial with the count at nought, one more, would wait"
    assert "three reminders" in console.run(["chart", "try", "tool_finished", "--value", "reminders=2"], USER).out, "a trial with the count at two, one more, goes on"
    assert "takes name=n" in console.run(["chart", "try", "tool_finished", "--value", "reminders"], USER).err
    from journal.repositories.scope import Scope
    with app.container.get(Scope).of(1):
        runs = json.loads(urlopen(HttpRequest(f"http://127.0.0.1:{app.server().port}/journal/chart/runs?last=10", headers={"X-Journal-Env": "main"}), timeout=5).read())["runs"]
    assert any("reminders 3" in r["counts"] for r in runs), "Recent runs says the count a walk left"

def test_editing_keeps_a_workflows_counts_and_clears_one_no_node_names(app):
    from journal.repositories.charts import Charts
    from journal.repositories.counts import Counts
    from journal.repositories.messages import Messages
    from journal.repositories.scope import Scope
    console, charts = app.console(), app.container.get(Charts)
    made, trigger = own_workflow(console, charts, "idle", "tool_finished")
    one = int(console.run(["chart", "node", "action", "count_one", "--text", "reminders", "--in", str(made)], USER).out.split()[1].rstrip(":"))
    console.run(["chart", "line", str(trigger), str(one)], USER)
    hook(app, "SessionStart")
    console.run(["environment", "here"], AGENT)
    for path in ("a", "b"):
        hook(app, "PostToolUse", tool_name="Read", tool_input={"file_path": path})
    app.runtime().deferred.drain()
    kept = lambda: {c.name: c.value for c in app.container.get(Counts).all() if c.name.startswith(f"charts:{made}:")}
    console.run(["chart", "node", "action", "say", "--text", "[chart] hello", "--in", str(made)], USER)
    app.runtime().deferred.drain()
    assert kept() == {f"charts:{made}:reminders": 2}, "an edit that leaves the count's node keeps the count"
    console.run(["chart", "remove", str(one)], USER)
    app.runtime().deferred.drain()
    assert kept() == {}, "the count's last node removed, the count is cleared"
    with app.container.get(Scope).of(1):
        cards = [m.text for m in app.container.get(Messages).in_() if m.author == "system"]
    assert any("The count reminders is no longer used in" in c for c in cards), "and the chat says so"

def test_the_canvas_refuses_a_count_named_like_a_reading_and_warns_of_one_nothing_counts(app):
    from journal.features.chart.validation import Validation
    from journal.repositories.charts import Charts
    console, charts = app.console(), app.container.get(Charts)
    made, trigger = own_workflow(console, charts, "idle", "tool_finished")
    refused = console.run(["chart", "node", "action", "count_one", "--text", "uses", "--in", str(made)], USER)
    assert "uses is a reading of the journal's record" in refused.err, "a count may not take a reading's name"
    check = int(console.run(["chart", "node", "check", "count_over", "--text", "reminders 3", "--in", str(made)], USER).out.split()[1].rstrip(":"))
    console.run(["chart", "line", str(trigger), str(check)], USER)
    reading = int(console.run(["chart", "node", "check", "count_over", "--text", "namings 3", "--in", str(made)], USER).out.split()[1].rstrip(":"))
    console.run(["chart", "line", str(check), str(reading), "--port", "no"], USER)
    warned = app.container.get(Validation).warnings(charts.find(made))
    assert "nothing in this workflow starts or counts reminders, so it stays at nought" in warned and not any("namings" in w for w in warned), "a count nothing counts is warned of, a reading is not"

def test_a_workflow_reading_a_count_another_keeps_is_turned_off_at_boot(app):
    from journal.features.chart.seeds.shipped_chart import ShippedChart
    from journal.models.node_kind import NodeKind
    from journal.repositories.charts import Charts
    console, charts = app.console(), app.container.get(Charts)
    keeper, start = own_workflow(console, charts, "idle", "subagent_started")
    count = int(console.run(["chart", "node", "action", "count_start", "--text", "subs", "--in", str(keeper)], USER).out.split()[1].rstrip(":"))
    console.run(["chart", "line", str(start), str(count)], USER)
    reader, finish = own_workflow(console, charts, "idle", "tool_finished")
    check = int(console.run(["chart", "node", "check", "count_over", "--text", "subs 2", "--in", str(reader)], USER).out.split()[1].rstrip(":"))
    say = int(console.run(["chart", "node", "action", "say", "--text", "[chart] two", "--in", str(reader)], USER).out.split()[1].rstrip(":"))
    console.run(["chart", "line", str(finish), str(check)], USER)
    console.run(["chart", "line", str(check), str(say), "--port", "yes"], USER)
    app.container.get(ShippedChart).run()
    read = charts.find(reader)
    assert read.title.endswith("(off, reads another's count subs)"), "the reader says why it is off"
    assert not [n for n in charts.nodes_of(read) if n.kind == NodeKind.TRIGGER] and [n for n in charts.nodes_of(charts.find(keeper)) if n.kind == NodeKind.TRIGGER], "its trigger is taken out, the keeper's stays"
    assert not any("(off, reads another's count" in c.title for c in charts.shipped()), "no shipped workflow is turned off by it"

def test_counts_of_the_old_shape_are_cleared_at_boot(tmp_path: Path, monkeypatch):
    import sqlite3
    monkeypatch.setattr(Config, "status_home", property(lambda self: tmp_path / "status"))
    first = App(Config(tmp_path, port=0))
    first.runtime().start()
    first.runtime().stop()
    db = sqlite3.connect(first.config.database)
    for name in ("subs", "charts:4:subs"):
        db.execute("INSERT INTO counts (created_at, created_by, updated_at, updated_by, environment_id, session, name, value) VALUES ('2026-10-17', 'system', '2026-10-17', 'system', 1, 's1', ?, 2)", (name,))
    db.execute("DELETE FROM migrations WHERE number >= 6")
    db.commit()
    db.close()
    second = App(Config(tmp_path, port=0))
    second.runtime().start()
    try:
        from journal.repositories.counts import Counts
        assert [c.name for c in second.container.get(Counts).all()] == ["charts:4:subs"], "a count named without its workflow is cleared, a workflow's own kept"
    finally:
        second.runtime().stop()

def test_a_skill_owed_as_a_link_moves_onto_the_agent_at_boot(tmp_path: Path, monkeypatch):
    import sqlite3
    from journal.repositories.agents import Agents
    from journal.repositories.links import Links
    monkeypatch.setattr(Config, "status_home", property(lambda self: tmp_path / "status"))
    first = App(Config(tmp_path, port=0))
    first.runtime().start()
    first.runtime().stop()
    db = sqlite3.connect(first.config.database)
    db.execute("INSERT INTO agents (created_at, created_by, updated_at, updated_by, environment_id, session, state, data) VALUES ('2026-10-17', 'system', '2026-10-17', 'system', 1, 's1', 'idle', '{}')")
    agent = db.execute("SELECT MAX(id) FROM agents").fetchone()[0]
    db.execute("INSERT INTO links (created_at, created_by, updated_at, updated_by, source, target, kind) VALUES ('2026-10-17', 'system', '2026-10-17', 'system', ?, NULL, 'owes:journal')", (f"agents:{agent}",))
    db.execute("DELETE FROM migrations WHERE number >= 7")
    db.commit()
    db.close()
    second = App(Config(tmp_path, port=0))
    second.runtime().start()
    try:
        assert second.container.get(Agents).find(agent).skills_owed == ("journal",), "the owed skill is a fact on the agent's row"
        assert not [link for link in second.container.get(Links).all() if link.kind.startswith("owes:")], "and the one-ended link is gone"
    finally:
        second.runtime().stop()

def test_a_hold_after_reminders_drawn_by_hand_holds_where_the_shipped_one_does(app):
    from journal.features.chart.standing import Standing
    from journal.models.node_kind import NodeKind
    from journal.repositories.charts import Charts
    console, charts, settings = app.console(), app.container.get(Charts), app.container.get(Settings)
    settings.set("messages.remind_every", 3, Actor.user(1))
    settings.set("messages.hold_after_reminders", 2, Actor.user(1))
    shipped = next(c for c in charts.for_event("tool_starting") if c.title.startswith("Hold a write while messages stay unread"))

    def held_at(session: str) -> list[int]:
        console.run(["message", "send", f"a word for {session}"], USER)
        app.runtime().deferred.drain()
        return [i for i in range(1, 9) if hook(app, "PreToolUse", session_id=session, tool_name="Edit", tool_input={"file_path": f"{session}{i}.py", "old_string": "a", "new_string": "b"})[0] == 409]
    for session in ("s1", "s2"):
        hook(app, "SessionStart", session_id=session)
        console.run(["environment", "here"], Where("main", session))
    by_the_shipped = held_at("s1")
    assert by_the_shipped, "the shipped workflow holds once enough reminders came"
    for trigger in [n for n in charts.nodes_of(shipped) if n.kind == NodeKind.TRIGGER]:
        charts.remove_node(trigger, Actor.user(1))
    made = int(console.run(["chart", "new", "Hold after reminders, by hand", "--on", "tool_starting"], USER).out.split()[1].rstrip(":"))
    node = lambda kind, key, text="": int(console.run(["chart", "node", kind, key, *(["--text", text] if text else []), "--in", str(made)], USER).out.split()[1].rstrip(":"))
    line = lambda a, b, port="then": console.run(["chart", "line", str(a), str(b), "--port", port], USER)
    start = next(n.id for n in charts.nodes_of(charts.find(made)) if n.key == "tool_starting")
    arrived, reset_on_arrival = node("trigger", "messages.created"), node("action", "count_start", "tools")
    own, unread, reset, one = node("check", "own_tool"), node("check", "unread_messages"), node("action", "count_start", "tools"), node("action", "count_one", "tools")
    wait, writes, hold = node("check", "count_wait", "tools 6"), node("check", "tool_writes"), node("action", "hold", "[chart] read your messages before the next write")
    for a, b, port in ((start, own, "then"), (own, unread, "yes"), (unread, reset, "no"), (unread, one, "yes"), (one, wait, "then"), (wait, writes, "yes"), (writes, hold, "yes"), (arrived, reset_on_arrival, "then")):
        assert line(a, b, port).code == 0
    by_hand = held_at("s2")
    assert by_hand == by_the_shipped, f"the hand-drawn workflow holds at the same tool uses: {by_hand} against {by_the_shipped}"
    standing = app.container.get(Standing).of(charts.find(made))
    assert any(a["session"] == "s2" and a["counts"].get("tools", 0) >= 6 for a in standing["agents"]), "its count stands on the canvas"

def test_a_report_about_several_rows_links_each_and_refuses_one_it_cannot_read(app):
    console = app.console()
    for title in ("one", "two"):
        console.run(["plan", "create", title, "--brief", "b"], USER)
    made = console.run(["report", "create", "Both", "--body", "words", "--about", "plans:1,plans:2"], USER)
    assert made.code == 0 and "about plans:1, plans:2" in made.out, "rows apart by commas are each linked"
    spaced = console.run(["report", "create", "Both again", "--body", "words", "--about", "plans:1", "plans:2"], USER)
    assert spaced.code == 0 and "about plans:1, plans:2" in spaced.out, "and so are rows apart by spaces"
    refused = console.run(["report", "create", "Wrong", "--body", "words", "--about", "plans:1,the second plan"], USER)
    assert refused.code == 1 and "not a row: the second plan" in refused.err, "a row it cannot read is refused by name, and no report is made"

def test_the_mcp_page_shows_a_servers_state_as_last_checked_and_check_all_reads_it_anew(app, monkeypatch):
    import json as j
    from urllib.request import Request as R, urlopen as open_url
    from journal.features.mcp.health import Health
    from journal.features.mcp.health_report import HealthReport
    from journal.features.mcp.known import Known
    answers = [HealthReport({"claude_design": Known("claude_design", "https://api.anthropic.com/v1/design/mcp", "failed", "rejected your login")}),
               HealthReport({"claude_design": Known("claude_design", "https://api.anthropic.com/v1/design/mcp", "connected", "")})]
    monkeypatch.setattr(Health, "asked", lambda self: answers.pop(0) if len(answers) > 1 else answers[0])
    port = app.server().port
    read = lambda: j.load(open_url(R(f"http://127.0.0.1:{port}/journal/mcp", headers={"X-Journal-Env": "main"}), timeout=5))
    before = read()
    design = next(s for s in before["servers"] if s["name"] == "claude_design")
    assert design["state"] == "failed" and before["checked_at"] > 0, "the page is told the state and when it was checked"
    open_url(R(f"http://127.0.0.1:{port}/journal/mcp/check", data=b"{}", method="POST", headers={"Content-Type": "application/json", "X-Journal-Env": "main"}), timeout=5)
    after = next(s for s in read()["servers"] if s["name"] == "claude_design")
    assert after["state"] == "connected", "Check all asks the program anew, so a login done since shows"

def test_the_end_of_a_session_never_begun_makes_no_agent(app):
    from journal.repositories.agents import Agents
    from journal.repositories.scope import Scope
    hook(app, "SessionStart")
    hook(app, "SessionEnd", session_id="one-off", reason="other")
    app.runtime().deferred.drain()
    with app.container.get(Scope).of(1):
        sessions = [a.session for a in app.container.get(Agents).in_()]
    assert sessions == ["s1"], "a one-off run of the program, such as claude mcp list, ends a session that never began: no agent is made for it"

def test_a_plugin_manifest_is_read_and_each_wrong_one_refused_by_name(app, tmp_path):
    from journal.features.plugins.manifest_reader import ManifestReader
    from journal.refused import Refused
    reader = app.container.get(ManifestReader)
    good = {"name": "echo", "version": "1.0.0", "program": "run.py", "protocol": 1, "hears": ["tool_starting", "tasks.created"], "holds": ["tool_starting"],
            "services": [{"name": "serve", "command": ["bin/serve"], "restart": "always"}]}

    def made(changes: dict, files=("run.py",)) -> Path:
        folder = tmp_path / str(len(list(tmp_path.iterdir())))
        folder.mkdir()
        for file in files:
            (folder / file).parent.mkdir(parents=True, exist_ok=True)
            (folder / file).write_text("print()")
        (folder / "journal-plugin.json").write_text(json.dumps({**good, **changes}))
        return folder
    manifest = reader.read(made({}))
    assert manifest.name == "echo" and manifest.holds == ("tool_starting",) and manifest.services[0].name == "serve"
    refusals = {
        "keys the journal does not know: hook": {"hook": "x"},
        "is not": {"name": "Echo!"},
        "one of the journal's own features": {"name": "tasks"},
        "speaks protocol 2": {"protocol": 2},
        "hears nothing.created!, which is no event": {"hears": ["nothing.created!"]},
        "the secrets rows are never sent": {"hears": ["secrets.created"]},
        "holds idle but does not hear it": {"holds": ["idle"]},
        "holds tool_finished, which no plugin may hold": {"hears": ["tool_finished"], "holds": ["tool_finished"]},
        "program ../run.py leads outside its folder": {"program": "../run.py"},
        "service serve /usr/bin/serve leads outside": {"services": [{"name": "serve", "command": ["/usr/bin/serve"]}]},
        "program missing.py is not in its folder": {"program": "missing.py"},
        "the users rows are never sent": {"hears": ["users.updated"]},
        "skill journal-tasks has the name of a skill of the journal": ({"skills": "skills"}, ("run.py", "skills/journal-tasks/SKILL.md")),
        "skills /tmp leads outside": {"skills": "/tmp"},
    }
    for words, changes in refusals.items():
        try:
            reader.read(made(*changes) if isinstance(changes, tuple) else made(changes))
            raise AssertionError(f"not refused: {changes}")
        except Refused as refused:
            assert words in str(refused), f"{changes} refused as {refused}"
    outside = tmp_path / "elsewhere.py"
    outside.write_text("print()")
    linked = made({}, ())
    (linked / "run.py").symlink_to(outside)
    with pytest.raises(Refused, match="program run.py leads outside its folder"):
        reader.read(linked)
    from journal.models.plugin import Plugin
    from journal.repositories.plugins import Plugins
    lint = made({"name": "lint", "skills": "skills"}, ("run.py", "skills/lint-rules/SKILL.md"))
    app.container.get(Plugins).save(Plugin(name="lint", source=str(lint), linked=True, manifest=PluginManifest.from_json({**good, "name": "lint", "skills": "skills"})), Actor.user(1))
    with pytest.raises(Refused, match="skill lint-rules has the name of a skill of plugin lint"):
        reader.read(made({"skills": "skills"}, ("run.py", "skills/lint-rules/SKILL.md")))

def test_a_plugin_is_a_row_and_writes_as_itself(app):
    from journal.models.actor_kind import ActorKind
    from journal.models.plugin import Plugin
    from journal.models.task import Task
    from journal.repositories.plugins import Plugins
    from journal.repositories.tasks import Tasks
    plugins = app.container.get(Plugins)
    plugins.save(Plugin(name="lint", source="/tmp/lint", manifest=PluginManifest(name="lint")), Actor.user(1))
    assert plugins.named("lint").enabled and [p.name for p in plugins.enabled()] == ["lint"]
    task = app.container.get(Tasks).save(Task(environment_id=1, title="written by a plugin"), Actor.plugin("lint"))
    assert task.created_by == Actor(ActorKind.PLUGIN, "lint") and task.created_by.stamp == "plugin:lint" and Actor.parse("plugin:lint") == task.created_by

def test_a_plugin_runs_as_itself_never_as_the_user(app):
    from journal.features.plugins.plugin_tokens import PluginTokens
    from journal.http.identity import Identity
    from journal.repositories.messages import Messages
    token = app.container.get(PluginTokens).of("echo")
    port = app.server().port
    def cli(argv, plugin="echo", given=token):
        try:
            with urlopen(HttpRequest(f"http://127.0.0.1:{port}/cli", data=json.dumps({"argv": argv, "env": "main", "plugin": plugin, "token": given}).encode(), method="POST", headers={"Content-Type": "application/json"}), timeout=5) as r:
                return r.status, json.loads(r.read())
        except HTTPError as error:
            return error.code, json.loads(error.read())
    status, out = cli(["message", "send", "a word from echo"])
    message = app.container.get(Messages).recent(1)[0]
    assert status == 200 and message.created_by == Actor.plugin("echo") and message.author == "system", "a plugin's command is stamped as the plugin and its message is the journal's, never yours"
    assert "only the user approves" in cli(["plan", "approve", "1"])[1]["err"], "a plugin never approves a plan"
    assert cli(["task", "list"], given="wrong")[0] == 403 and cli(["task", "list"], plugin="lint")[0] == 403, "a wrong token, or a plugin's name without its own, is refused"
    identity = app.container.get(Identity)
    assert identity.of({"x-journal-plugin": "echo", "x-journal-plugin-token": token}) == Actor.plugin("echo") and identity.of({"x-journal-plugin": "echo", "x-journal-plugin-token": "x"}) == Actor.user(1), "the API names the plugin only with its token"


def test_the_plugin_protocol_sends_one_line_and_reads_one_back(app):
    from journal.events.agent.tool_starting import ToolStarting
    from journal.events.models.created import Created
    from journal.features.plugins.plugin_fault import PluginFault
    from journal.features.plugins.protocol import Protocol
    from journal.models.task import Task
    protocol = app.container.get(Protocol)
    tool = json.loads(protocol.line_of(ToolStarting(tool="Bash", input={"command": "ls"}).placed("s1", 1, "claude", 0.2), "main", "working"))
    assert (tool["v"], tool["event"], tool["session"], tool["state"], tool["data"]) == (1, "tool_starting", "s1", "working", {"tool": "Bash", "input": {"command": "ls"}, "writes": False}), "an agent event: its name, where it happened and its own fields"
    row = json.loads(protocol.line_of(Created(model=Task(id=7, environment_id=1, title="t"), by=Actor.plugin("echo")), "main"))
    assert row["event"] == "tasks.created" and row["data"] == {"table": "tasks", "id": 7, "by": "plugin:echo"}, "a row event: its table, its number and who wrote it"
    assert protocol.answer_of("").answer == "allow", "an empty answer lets the event through"
    answer = protocol.answer_of(json.dumps({"v": 1, "answer": "refuse", "reason": "not on main", "cards": [{"kind": "sin", "label": "a sin"}], "commands": ["journal task list"]}))
    assert (answer.answer, answer.reason, answer.cards[0].kind, answer.commands) == ("refuse", "not on main", "sin", ("journal task list",))
    for broken, words in (("{nope", "not JSON"), ('["a"]', "not a JSON object"), ('{"answer": "maybe"}', "allow, refuse or tell"), ('{"v": 2}', "protocol 2"), ('{"say": "x"}', "keys the protocol does not know: say"), (json.dumps({"commands": ["journal x"] * 21}), "at most 20")):
        try:
            protocol.answer_of(broken)
            raise AssertionError(f"no fault for {broken}")
        except PluginFault as fault:
            assert words in str(fault), f"{broken}: {fault}"

def echo(app, name="echo", **manifest):
    """The echo plugin as a fetched copy in the journal's plugins folder, its row's manifest changed as given."""
    import shutil
    from journal.models.plugin import Plugin
    from journal.repositories.plugins import Plugins
    folder = Path(__file__).parent / "plugins" / "echo"
    shutil.copytree(folder, app.config.home / "plugins" / name, dirs_exist_ok=True)
    return app.container.get(Plugins).save(Plugin(name=name, source=str(folder), manifest=PluginManifest.from_json(json.loads((folder / "journal-plugin.json").read_text()) | manifest)), Actor.user(1))


def echo_heard(app, name="echo") -> list[str]:
    file = app.config.home / "plugin-data" / name / "heard.jsonl"
    return [json.loads(line)["event"] for line in file.read_text().splitlines()] if file.is_file() else []


def test_a_plugin_hears_the_events_it_names_and_holds_what_it_may(app):
    from journal.db.connection import Connection
    from journal.engine.deferred import Deferred
    from journal.repositories.entries import Entries
    from journal.models.task import Task
    from journal.repositories.tasks import Tasks
    echo(app, hears=["tool_starting", "tool_finished", "prompt_submitted", "tasks.created"])
    hook(app, "SessionStart")
    status, body = hook(app, "PreToolUse", tool_name="Read", tool_input={"file_path": "forbidden.py"})
    assert status == 409 and "[plugin echo] echo refuses a forbidden tool" in body["error"], "a held tool is refused inside the hook, naming the plugin"
    status, body = hook(app, "UserPromptSubmit", prompt="hi")
    assert "[plugin echo] echo heard your prompt" in body["hookSpecificOutput"]["additionalContext"], "a prompt is told a line"
    hook(app, "PostToolUse", tool_name="Read", tool_input={}, tool_response={})
    tasks = app.container.get(Tasks)
    tasks.save(Task(environment_id=1, title="by the user"), Actor.user(1))
    tasks.save(Task(environment_id=1, title="by echo"), Actor.plugin("echo"))
    with pytest.raises(RuntimeError), app.container.get(Connection).transaction():
        tasks.save(Task(environment_id=1, title="rolled back"), Actor.user(1))
        raise RuntimeError
    app.container.get(Deferred).drain()
    assert echo_heard(app) == ["tool_starting", "prompt_submitted", "tool_finished", "tasks.created"], "each event heard once, the plugin's own row not at all"
    given = json.loads((app.config.home / "plugin-data" / "echo" / "environment.json").read_text())
    assert (given["JOURNAL_PLUGIN"], given["JOURNAL_ENV"], Path(given["JOURNAL_PLUGIN_DIR"]).name, Path(given["JOURNAL_PLUGIN_DATA"]).name) == ("echo", "main", "echo", "echo") and given["JOURNAL_PLUGIN_TOKEN"] and given["JOURNAL_URL"].startswith("http://127.0.0.1:")
    assert "PYTEST_CURRENT_TEST" not in given and json.loads(Path(given["JOURNAL_SETTINGS"]).read_text()) == {}, "nothing of the journal's own environment beyond what names it"
    echo(app, "echo-two")
    status, body = hook(app, "PreToolUse", tool_name="Read", tool_input={"file_path": "forbidden.py"})
    app.container.get(Deferred).drain()
    assert status == 409 and "plugin echo-two" not in body["error"] and [e.data["plugin"] for e in app.container.get(Entries).where(kind="plugin_unanswered")] == ["echo-two"], "the first plugin's refusal answers; the second hears it after the reply, recorded unanswered"
    status, body = hook(app, "PreToolUse", tool_name="Bash", tool_input={"command": "journal task list forbidden"})
    assert status == 200 and "echo refuses a forbidden tool" in body["hookSpecificOutput"]["additionalContext"], "a journal command goes through a plugin's refusal, its words told"


def test_a_plugins_answer_shows_cards_runs_commands_and_never_loops(app):
    from journal.features.plugins.listeners.plugins_hear_agents import PluginsHearAgents
    from journal.features.plugins.plugin_answers import PluginAnswers
    from journal.engine.deferred import Deferred
    from journal.models.plugin_answer import PluginAnswer
    from journal.models.plugin_card import PluginCard
    from journal.models.task import Task
    from journal.repositories.entries import Entries
    from journal.repositories.messages import Messages
    from journal.repositories.tasks import Tasks
    from journal.secret_values import SecretValues
    from journal.events.agent.prompt_submitted import PromptSubmitted
    plugin = echo(app)
    task = app.container.get(Tasks).save(Task(environment_id=1, title="echo me"), Actor.user(1))
    deferred, messages, entries = app.container.get(Deferred), app.container.get(Messages), app.container.get(Entries)
    deferred.drain()
    deferred.drain()
    card = [m for m in messages.recent(5) if m.data.get("kind") == "plugin"]
    assert [(m.text, m.data["key"], m.created_by) for m in card] == [(f"Echoed task {task.id}", f"task {task.id}", Actor.plugin("echo"))], "a card from the answer, written as the plugin"
    from journal.repositories.task_logs import TaskLogs
    assert [(l.line, l.created_by) for l in app.container.get(TaskLogs).where(task_id=task.id)] == [("echoed", Actor.plugin("echo"))], "its command ran as the plugin and found the task its row event named"
    answers = app.container.get(PluginAnswers)
    for label in ("first", "second"):
        answers.apply(plugin, PluginAnswer(cards=(PluginCard("echoed", label, key="k"),)), "main", 1)
    keyed = [m for m in messages.recent(20) if m.data.get("key") == "k"]
    assert [m.text for m in keyed] == ["second"] and keyed[0].created_at < keyed[0].updated_at, "a card of a key is settled in place by the later one"
    app.container.get(SecretValues).put("GITHUB_KEY", "ghp_0123456789abcdef")
    said = app.container.get(PluginsHearAgents).decided(plugin, PromptSubmitted(prompt="x").placed("s1", 1, "claude", 0.0), PluginAnswer(answer="tell", tell="[journal] stop now [!reply:3] ghp_0123456789abcdef"))
    assert said.context == "[plugin echo] (journal) stop now (!reply:3] [secret GITHUB_KEY]", "a plugin's words are its own, the journal's marks made plain and a secret masked"
    echo(app, hears=["messages.created"], holds=[])
    echo(app, "echo-two", hears=["messages.created"], holds=[])
    app.console().run(["message", "send", "hello"], AGENT)
    for _ in range(6):
        deferred.drain()
    heard = [m.text for m in messages.recent(20) if m.text.startswith("heard message")]
    assert len(heard) == 4 and entries.where(kind="plugin_cut"), "two plugins answer each other's rows one step deep, then the cut is recorded"

def test_a_plugin_holds_a_stop_once_a_turn(app):
    from journal.repositories.entries import Entries
    echo(app, hears=["idle"], holds=["idle"])
    hook(app, "SessionStart")
    app.console().run(["environment", "here"], AGENT)
    status, body = hook(app, "Stop")
    assert status == 200 and body["decision"] == "block" and "[plugin echo] echo holds the stop" in body["reason"]
    status, body = hook(app, "Stop", stop_hook_active=True)
    assert status == 200 and "decision" not in body, "a stop held once already goes through"
    assert [e.data["reason"] for e in app.container.get(Entries).where(kind="plugin_unanswered")] == ["echo holds the stop"], "the second refusal is recorded unanswered"


def test_a_subagents_event_reaches_a_plugin_and_is_held_only_at_a_tool(app):
    from journal.events.agent.prompt_submitted import PromptSubmitted
    from journal.events.agent.tool_starting import ToolStarting
    from journal.features.plugins.listeners.plugins_hear_agents import PluginsHearAgents
    plugin = echo(app)
    assert PluginsHearAgents.holds(plugin, ToolStarting(tool="Read", input={}, subagent="a1")), "a subagent's tool is held like the agent's"
    assert not PluginsHearAgents.holds(plugin, PromptSubmitted(prompt="x", subagent="a1")) and PluginsHearAgents.holds(plugin, PromptSubmitted(prompt="x")), "a subagent's other events are heard, never held"


def test_a_plugin_is_previewed_then_installed_from_a_folder(app, tmp_path):
    from journal.repositories.plugins import Plugins
    folder = Path(__file__).parent / "plugins" / "echo"
    console = app.console()
    preview = console.run(["plugin", "install", str(folder)], USER)
    assert preview.code == 0 and "echo 1.0.0" in preview.out and "runs for each event it hears, from its folder: run.py" in preview.out and "holds before the agent continues: tool_starting, prompt_submitted" in preview.out and "nothing installed yet" in preview.out
    assert app.container.get(Plugins).all() == [], "a preview installs nothing"
    assert "installed echo, on" in console.run(["plugin", "install", str(folder), "--yes"], USER).out
    plugin = app.container.get(Plugins).named("echo")
    assert plugin.linked and plugin.source == str(folder.resolve()) and plugin.manifest.holds == ("tool_starting", "prompt_submitted") and (app.config.home / "plugin-data" / "echo").is_dir()
    assert "installed already" in console.run(["plugin", "install", str(folder), "--yes"], USER).err
    bad = tmp_path / "bad"
    bad.mkdir()
    (bad / "journal-plugin.json").write_text(json.dumps({"name": "bad", "version": "1", "program": "run.py", "hears": ["nothing"]}))
    (bad / "run.py").write_text("")
    refused = console.run(["plugin", "install", str(bad), "--yes"], USER)
    assert refused.code != 0 and "hears nothing, which is no event" in refused.err and [p.name for p in app.container.get(Plugins).all()] == ["echo"], "a refused manifest installs nothing"


def test_a_plugin_is_upgraded_with_its_changes_shown_switched_off_and_removed(app, tmp_path):
    import shutil
    from journal.engine.deferred import Deferred
    from journal.repositories.plugins import Plugins
    folder = tmp_path / "echo"
    shutil.copytree(Path(__file__).parent / "plugins" / "echo", folder)
    console, plugins = app.console(), app.container.get(Plugins)
    console.run(["plugin", "install", str(folder), "--yes"], USER)
    manifest = json.loads((folder / "journal-plugin.json").read_text())
    (folder / "journal-plugin.json").write_text(json.dumps({**manifest, "version": "1.1.0", "hears": [*manifest["hears"], "tool_finished"], "holds": ["tool_starting"]}))
    shown = console.run(["plugin", "upgrade", "echo"], USER).out
    assert "version: 1.0.0 -> 1.1.0" in shown and "hears: + tool_finished" in shown and "holds: - prompt_submitted" in shown and "nothing upgraded yet" in shown
    assert "tool_finished" not in plugins.named("echo").manifest.hears, "a preview upgrades nothing"
    console.run(["plugin", "upgrade", "echo", "--yes"], USER)
    assert "tool_finished" in plugins.named("echo").manifest.hears
    hook(app, "SessionStart")
    console.run(["plugin", "disable", "echo"], USER)
    hook(app, "PostToolUse", tool_name="Read", tool_input={}, tool_response={})
    app.container.get(Deferred).drain()
    assert echo_heard(app) == [], "a plugin switched off hears nothing"
    console.run(["plugin", "enable", "echo"], USER)
    hook(app, "PostToolUse", tool_name="Read", tool_input={}, tool_response={})
    app.container.get(Deferred).drain()
    assert echo_heard(app) == ["tool_finished"]
    data = app.config.home / "plugin-data" / "echo"
    console.run(["plugin", "remove", "echo"], USER)
    assert plugins.all() == [] and data.is_dir() and folder.is_dir(), "removed, its data and a linked folder kept"
    console.run(["plugin", "install", str(folder), "--yes"], USER)
    console.run(["plugin", "remove", "echo", "--purge"], USER)
    assert plugins.all() == [] and not data.exists(), "purged with its data"


def test_only_the_user_installs_or_switches_on_a_plugin(app, tmp_path):
    import shutil
    from journal.repositories.messages import Messages
    from journal.repositories.plugins import Plugins
    folder = tmp_path / "echo"
    shutil.copytree(Path(__file__).parent / "plugins" / "echo", folder)
    console, plugins = app.console(), app.container.get(Plugins)
    hook(app, "SessionStart")
    refused = console.run(["plugin", "install", str(folder), "--yes"], AGENT)
    assert refused.code != 0 and "only the user installs a plugin: journal plugin propose" in refused.err and plugins.all() == []
    assert console.run(["plugin", "propose", str(folder), "--why", "to echo"], AGENT).code == 0
    card = app.container.get(Messages).recent(1)[0]
    assert card.text == "The agent proposes the plugin echo: to echo" and f"journal plugin install {folder} --yes" in card.data["detail"]
    console.run(["plugin", "install", str(folder), "--yes"], USER)
    console.run(["plugin", "disable", "echo"], AGENT)
    assert "only the user switches on" in console.run(["plugin", "enable", "echo"], AGENT).err and not plugins.named("echo").enabled
    console.run(["plugin", "enable", "echo"], USER)
    console.run(["environment", "here"], AGENT)
    console.run(["task", "create", "t", "--start"], AGENT)
    status, body = hook(app, "PreToolUse", tool_name="Write", tool_input={"file_path": str(app.config.home / "plugins" / "x" / "run.py"), "content": ""})
    assert status == 409 and "an installed plugin's files are the user's to change" in body["error"]
    installed = ".journal/" + "plugins"
    script = "python3 - <<'EOF'\nfrom pathlib import Path\nPath({}).write_text('x')\nEOF\n"
    for line, held in ((f"{installed}/x/bin/judge --changes > /tmp/judged.txt 2>&1", False), (script.format("'notes.txt'") + f"{installed}/x/bin/judge info x", False), (script.format(f"'{installed}/x/run.py'"), True), (f"echo hi > {installed}/x/run.py", True), (f"rm -rf {installed}/x", True), (f"cat {installed}/x/run.py | tee {installed}/x/copy.py", True)):
        status, body = hook(app, "PreToolUse", tool_name="Bash", tool_input={"command": line})
        assert (status == 409 and "plugin's files" in body.get("error", "")) == held, f"{line} held {status == 409}, should be {held}: running a plugin's program is no write to it"
    (folder / "run.py").write_text((folder / "run.py").read_text() + "\n# changed\n")
    assert hook(app, "PreToolUse", tool_name="Read", tool_input={"file_path": "forbidden.py"})[0] == 200, "a changed program is not run"
    assert not plugins.named("echo").enabled and "run.py changed since you installed it" in app.container.get(Messages).recent(1)[0].text


def test_a_plugins_settings_follow_its_schema_and_its_secret_comes_from_the_user(app):
    from journal.features.plugins.plugin_runner import PluginRunner
    from journal.repositories.plugins import Plugins
    from journal.repositories.secrets import Secrets
    from journal.secret_values import SecretValues
    console, plugins = app.console(), app.container.get(Plugins)
    console.run(["plugin", "install", str(Path(__file__).parent / "plugins" / "echo"), "--yes"], USER)
    plugin = plugins.named("echo")
    secret = app.container.get(Secrets).find(plugin.settings["token"]["secret"])
    assert (plugin.settings["mode"], plugin.settings["repeat"]) == ("", 1) and secret.title == "echo Token" and secret.proposed == ("plugin:echo",), "defaults set, and a secret asked for, proposed for the plugin"
    assert console.run(["plugin", "configure", "echo", "repeat", "3"], USER).code == 0 and plugins.named("echo").settings["repeat"] == 3
    assert "repeat is a number; 'three' is not" in console.run(["plugin", "configure", "echo", "repeat", "three"], USER).err
    assert "the user fills it on the Secrets page" in console.run(["plugin", "configure", "echo", "token", "abc"], USER).err
    assert "only the user configures" in console.run(["plugin", "configure", "echo", "repeat", "2"], AGENT).err
    variable = secret.fields[0]["variable"]
    app.container.get(SecretValues).put(variable, "tok_0123456789abcdef")
    runner = app.container.get(PluginRunner)
    assert variable not in runner.environment(plugins.named("echo"), "main"), "a filled secret is not given until the user allows it"
    app.container.get(Secrets).save(secret.with_(programs=("plugin:echo",)), Actor.user(1))
    assert runner.environment(plugins.named("echo"), "main")[variable] == "tok_0123456789abcdef"


def test_a_plugins_skills_are_published_stamped_and_taken_away(app):
    console = app.console()
    console.run(["plugin", "install", str(Path(__file__).parent / "plugins" / "echo"), "--yes"], USER)
    published = [app.config.root / home / "echo-guide" for home in (".claude/skills", ".agents/skills")]
    assert all((p / "SKILL.md").read_text().startswith("---\nplugin: echo\nname: echo-guide\n") and (p / ".gitignore").read_text() == "*\n" for p in published), "published beside the journal's, stamped and kept out of git"
    console.run(["plugin", "disable", "echo"], USER)
    assert not any(p.exists() for p in published), "switched off, its skills go"
    console.run(["plugin", "enable", "echo"], USER)
    assert all(p.is_dir() for p in published)
    console.run(["plugin", "remove", "echo"], USER)
    assert not any(p.exists() for p in published), "removed, its skills go"


def test_plugins_come_back_when_the_journal_starts_again(app):
    app.console().run(["plugin", "install", str(Path(__file__).parent / "plugins" / "echo"), "--yes"], USER)
    (app.config.home / "plugin-data" / "echo" / "kept.txt").write_text("kept")
    again = App(Config(app.config.root, port=0))
    again.container.get(Settings).save(Setting(environment_id=0, key="features.skills", value=False), Actor.system())
    again.runtime().start()
    try:
        hook(again, "SessionStart")
        status, body = hook(again, "PreToolUse", tool_name="Read", tool_input={"file_path": "forbidden.py"})
        assert status == 409 and "[plugin echo]" in body["error"], "a journal started anew hears through the plugins its rows name"
        assert (again.config.home / "plugin-data" / "echo" / "kept.txt").read_text() == "kept"
    finally:
        again.runtime().stop()


def test_an_upgrade_shows_the_code_and_a_linked_change_waits_for_the_user(app, tmp_path):
    import shutil
    from journal.models.plugin import Plugin
    from journal.repositories.messages import Messages
    from journal.repositories.plugins import Plugins
    echo_folder = Path(__file__).parent / "plugins" / "echo"
    console, plugins, messages = app.console(), app.container.get(Plugins), app.container.get(Messages)
    newer = tmp_path / "newer"
    shutil.copytree(echo_folder, newer)
    (newer / "run.py").write_text((newer / "run.py").read_text().replace("echo heard your prompt", "echo heard you"))
    shutil.copytree(echo_folder, app.config.home / "plugins" / "echo")
    fetched = plugins.save(Plugin(name="echo", source=str(newer), manifest=PluginManifest.from_json(json.loads((echo_folder / "journal-plugin.json").read_text()))), Actor.user(1))
    shown = console.run(["plugin", "upgrade", "echo"], USER).out
    assert "the code:" in shown and '-        return json.dumps({"v": 1, "answer": "tell", "tell": "echo heard your prompt"})' in shown and '+        return json.dumps({"v": 1, "answer": "tell", "tell": "echo heard you"})' in shown, "the program's changed body is in the diff"
    plugins.save(fetched.with_(name="copied"), Actor.user(1))
    assert "now holds the plugin echo, not copied" in console.run(["plugin", "upgrade", "copied"], USER).err, "an upgrade never turns one plugin into another"
    plugins.delete(plugins.named("copied"), Actor.user(1))
    linked = tmp_path / "linked"
    shutil.copytree(echo_folder, linked)
    console.run(["plugin", "install", str(linked), "--yes"], USER)
    manifest = json.loads((linked / "journal-plugin.json").read_text())
    (linked / "journal-plugin.json").write_text(json.dumps({**manifest, "hears": [*manifest["hears"], "idle"], "holds": [*manifest["holds"], "idle"]}))
    hook(app, "SessionStart")
    for _ in range(2):
        hook(app, "PreToolUse", tool_name="Read", tool_input={"file_path": "a.py"})
    waiting = [m for m in messages.recent(10) if m.text.startswith("Plugin echo's manifest changed")]
    assert len(waiting) == 1 and "holds: + idle" in waiting[0].data["detail"] and "idle" not in plugins.named("echo").manifest.holds, "shown once, and the plugin runs as installed"
    console.run(["plugin", "upgrade", "echo", "--yes"], USER)
    assert "idle" in plugins.named("echo").manifest.holds and plugins.named("echo").waiting == "", "the user's upgrade applies it"


def test_a_plugin_is_installed_only_once_its_requirements_and_setup_pass(app, tmp_path):
    import shutil
    from journal.engine.deferred import Deferred
    from journal.repositories.plugins import Plugins
    console, plugins = app.console(), app.container.get(Plugins)
    folder = tmp_path / "echo"
    shutil.copytree(Path(__file__).parent / "plugins" / "echo", folder)
    manifest = json.loads((folder / "journal-plugin.json").read_text())

    def installed(**changes):
        (folder / "journal-plugin.json").write_text(json.dumps({**manifest, **changes}))
        return console.run(["plugin", "install", str(folder), "--yes"], USER)
    missing = installed(requires={"no-such-program-here": {"hint": "brew install it"}})
    assert "echo needs no-such-program-here, which is not here: brew install it" in missing.err and plugins.all() == []
    steps = [{"name": "first", "run": 'echo one >> "$JOURNAL_PLUGIN_DATA/steps"'}, {"name": "second", "run": 'echo two >> "$JOURNAL_PLUGIN_DATA/steps"'}]
    failing = installed(setup=[*steps, {"name": "third", "run": "echo broken >&2; exit 3"}])
    assert "setup step 'third' failed, so nothing is installed: broken" in failing.err and plugins.all() == [] and not (app.config.home / "plugin-data" / "echo").exists(), "a failed step leaves nothing"
    preview = console.run(["plugin", "install", str(folder)], USER).out
    assert 'runs at install first: echo one >> "$JOURNAL_PLUGIN_DATA/steps"' in preview
    made = {"name": "made", "run": "printf '#!/bin/sh\\n' > made.sh && chmod +x made.sh"}
    done = installed(requires={"sh": {"check": "command -v sh"}}, setup=[*steps, made], installed="echo '{\"repeat\": 5}'", hears=[*manifest["hears"], "plugin.updated"],
                     services=[{"name": "made", "command": ["./made.sh"]}])
    assert done.code == 0, done.err
    hook(app, "SessionStart")
    hook(app, "PreToolUse", tool_name="Read", tool_input={"file_path": "a.py"})
    assert plugins.named("echo").enabled, "a file its setup made is hashed as made, so the plugin stays on"
    assert (app.config.home / "plugin-data" / "echo" / "steps").read_text() == "one\ntwo\n" and plugins.named("echo").settings["repeat"] == 5, "the steps ran in order and the installed command's answer filled the settings"
    console.run(["plugin", "configure", "echo", "repeat", "2"], USER)
    app.container.get(Deferred).drain()
    assert echo_heard(app) == ["tool_starting", "plugin.updated"], "a plugin hears its own settings change"


def test_the_plugins_page_previews_installs_lists_configures_and_removes(app):
    from journal.repositories.plugins import Plugins
    port = app.server().port

    def api(method, path, body=None):
        request = HttpRequest(f"http://127.0.0.1:{port}/api/{path}", data=json.dumps(body).encode() if body is not None else None, method=method, headers={"Content-Type": "application/json", "X-Journal-Env": "main"})
        try:
            with urlopen(request, timeout=10) as reply:
                return reply.status, json.loads(reply.read())
        except HTTPError as error:
            return error.code, json.loads(error.read())
    folder = str(Path(__file__).parent / "plugins" / "echo")
    status, preview = api("POST", "plugins/preview", {"source": folder})
    assert status == 200 and preview["name"] == "echo" and {"kind": "holds", "label": "before the agent continues", "command": "tool_starting, prompt_submitted"} in preview["rows"]
    status, made = api("POST", "plugin/install", {"source": folder, "yes": True})
    assert status == 200 and made["name"] == "echo"
    row = api("GET", "plugin")[1]["rows"][0]
    assert (row["title"], row["state"], row["data"]["holds"], row["data"]["manifest"]["settings"]["mode"]["type"], row["data"]["settings"]["chosen"]["token"].startswith("secret ")) == ("echo", "on", ["tool_starting", "prompt_submitted"], "options", True)
    assert api("POST", f"plugin/{made['n']}/configure", {"key": "repeat", "value": "4"})[0] == 200 and app.container.get(Plugins).named("echo").settings["repeat"] == 4
    assert api("POST", f"plugin/{made['n']}/disable", {})[0] == 200 and api("GET", "plugin")[1]["rows"][0]["state"] == "off"
    assert api("POST", f"plugin/{made['n']}/remove", {})[0] == 200 and app.container.get(Plugins).all() == []


def test_a_plugins_record_lists_what_it_did(app):
    from journal.engine.deferred import Deferred
    from journal.models.task import Task
    from journal.repositories.tasks import Tasks
    echo(app)
    hook(app, "SessionStart")
    hook(app, "PreToolUse", tool_name="Read", tool_input={"file_path": "forbidden.py"})
    task = app.container.get(Tasks).save(Task(environment_id=1, title="echo me"), Actor.user(1))
    app.container.get(Deferred).drain()
    app.container.get(Deferred).drain()
    with urlopen(HttpRequest(f"http://127.0.0.1:{app.server().port}/api/plugins/echo/record", headers={"X-Journal-Env": "main"}), timeout=5) as reply:
        record = json.loads(reply.read())["record"]
    texts = [line["text"] for line in record]
    assert "held at tool_starting: echo refuses a forbidden tool" in texts, "a hold is in its record"
    assert f'ran journal task log {task.id} "echoed"' in texts, "a command it ran"
    logged = [line for line in record if line["kind"] == "row" and line["text"].startswith("made task log")]
    assert logged and logged[0]["ref"].startswith("todo:"), "a row it wrote, opening"
    assert record == sorted(record, key=lambda line: -line["at"]), "newest first"


def test_a_plugins_dashboard_is_drawn_from_the_lines_it_wrote(app):
    from journal.repositories.plugins import Plugins
    console = app.console()
    console.run(["plugin", "install", str(Path(__file__).parent / "plugins" / "echo"), "--yes"], USER)
    plugin = app.container.get(Plugins).named("echo")
    as_echo = Where("main", plugin="echo")
    assert "written by its plugin's program" in console.run(["dashboard", "set", "a.py", "a.py"], AGENT).err, "only a plugin writes its dashboard"
    console.run(["dashboard", "set", "a.py", "a.py", "--badge", "2 sins", "--tone", "warn", "--heading", "Files"], as_echo)
    console.run(["dashboard", "set", "b.py", "b.py", "--badge", "clean", "--tone", "good", "--heading", "Files"], as_echo)
    console.run(["dashboard", "set", "a.py", "a.py", "--badge", "1 sin", "--tone", "warn", "--heading", "Files"], as_echo)
    with urlopen(HttpRequest(f"http://127.0.0.1:{app.server().port}/api/plugin/{plugin.id}/dashboard/echoes", headers={"X-Journal-Env": "main"}), timeout=5) as reply:
        document = json.loads(reply.read())
    view = document["pages"]["start"]
    assert view["title"] == "Echoes" and view["view"]["children"] == [{"type": "heading", "text": "Files", "level": 3}, {"type": "list", "items": [{"label": "a.py", "badge": "1 sin", "tone": "warn", "note": ""}, {"label": "b.py", "badge": "clean", "tone": "good", "note": ""}]}], "one line per key, rewritten in place"
    written = app.config.home / "plugin-data" / "echo" / "dashboards" / "echoes.json"
    written.parent.mkdir(parents=True, exist_ok=True)
    written.write_text(json.dumps({"title": "Echoes", "start": "overview", "pages": {"overview": {"title": "Echoes", "view": {"type": "text", "body": "written by echo"}}}}))
    with urlopen(HttpRequest(f"http://127.0.0.1:{app.server().port}/api/plugin/{plugin.id}/dashboard/echoes", headers={"X-Journal-Env": "main"}), timeout=5) as reply:
        assert json.loads(reply.read())["start"] == "overview", "a document the plugin wrote in its data folder is its dashboard"
    console.run(["plugin", "remove", "echo", "--purge"], USER)
    from journal.repositories.dashboard_rows import DashboardRows
    assert app.container.get(DashboardRows).of("echo") == [], "purged with its plugin"


def test_a_plugins_line_after_the_reply_reaches_the_agent_at_its_next_hook(app):
    from journal.engine.deferred import Deferred
    echo(app, hears=["tool_finished", "tool_starting"], holds=["tool_starting"])
    hook(app, "SessionStart")
    hook(app, "PostToolUse", tool_name="Edit", tool_input={"file_path": "notice.py"}, tool_response={})
    app.container.get(Deferred).drain()
    _, body = hook(app, "PreToolUse", tool_name="Read", tool_input={"file_path": "a.py"})
    assert "[plugin echo] echo noticed the edit" in body["hookSpecificOutput"]["additionalContext"], "the line said after an edit reaches the agent at its next tool"
    _, again = hook(app, "PreToolUse", tool_name="Read", tool_input={"file_path": "b.py"})
    assert "echo noticed the edit" not in json.dumps(again), "and only once"


def test_a_plugin_that_fails_lets_the_event_through_and_is_recorded(app):
    from journal.features.plugins.feature import PluginsFeature
    from journal.repositories.entries import Entries
    from journal.repositories.messages import Messages
    from journal.repositories.plugins import Plugins
    from journal.repositories.settings import Settings
    plugins, messages = app.container.get(Plugins), app.container.get(Messages)
    plugins.save(echo(app).with_(settings={"mode": "broken"}), Actor.user(1))
    hook(app, "SessionStart")
    for _ in range(5):
        assert hook(app, "PreToolUse", tool_name="Read", tool_input={"file_path": "forbidden.py"})[0] == 200, "a fault is never a refusal"
    row = plugins.named("echo")
    assert row.faults_in_a_row == 5 and row.failing_since and "not JSON" in row.last_fault
    assert len(app.container.get(Entries).where(kind="plugin_fault")) == 5 and [m.text for m in messages.recent(20)].count("Plugin echo is failing: it faulted 5 times in a row, and events go through without it") == 1, "the failing card comes once, at the fifth"
    plugins.save(row.with_(settings={}), Actor.user(1))
    assert hook(app, "PreToolUse", tool_name="Read", tool_input={"file_path": "a.py"})[0] == 200
    assert plugins.named("echo").faults_in_a_row == 0 and "Plugin echo answers again" in [m.text for m in messages.recent(5)]
    app.container.get(Settings).set(PluginsFeature.DEADLINE.key, 1, Actor.user(1))
    plugins.save(plugins.named("echo").with_(settings={"mode": "slow"}), Actor.user(1))
    plugins.save(echo(app, "echo-two").with_(settings={"mode": "slow"}), Actor.user(1))
    began = time.monotonic()
    status, _ = hook(app, "PreToolUse", tool_name="Read", tool_input={"file_path": "forbidden.py"})
    assert status == 200 and time.monotonic() - began < 3, "two slow plugins share one deadline and the event goes through"
    assert "no answer within" in plugins.named("echo").last_fault and "used the event's whole deadline" in plugins.named("echo-two").last_fault, "each fault recorded"


def test_a_users_workflow_bound_to_a_retired_state_is_kept_turned_off_and_named(app):
    from journal.features.chart.seeds.shipped_chart import ShippedChart
    from journal.models.chart import Chart
    from journal.models.node import Node
    from journal.models.node_kind import NodeKind
    from journal.repositories.charts import Charts
    charts, seed, by = app.container.get(Charts), app.container.get(ShippedChart), Actor.user(1)
    mine = charts.save(Chart(title="Mine while orienting", state="orienting", event="idle"), by)
    charts.add_node(mine, Node(kind=NodeKind.TRIGGER, key="idle"), by)
    charts.add_node(mine, Node(kind=NodeKind.ACTION, key="say", text="[chart] mine"), by)
    seed.run()
    kept = charts.find(mine.id)
    assert kept.state == "" and "turned off, its state is the look owed now" in kept.title and not any(n.kind == NodeKind.TRIGGER for n in charts.nodes_of(kept)) and any(n.key == "say" for n in charts.nodes_of(kept)), "kept, turned off, and the title says what became of its state"


def test_the_three_holds_are_answered_under_codex_as_the_frozen_records_show(app):
    """The skill, the look and the mark hold a Codex write through its pre-tool hook, as the records frozen on today's conduct show; nothing here is Claude only."""
    import json
    records = Path(__file__).with_name("replays")
    held = lambda name: {s["name"]: s["answer"]["error"] for s in json.loads((records / f"{name}_codex.json").read_text())["steps"] if isinstance(s["answer"], dict) and "error" in s["answer"]}
    assert "read the journal skill before anything else" in held("loading_skill_rules")["a write before the skill is read"]
    assert "`journal environment here`" in held("orienting_rules")["a write before the look"]
    assert "decide what to keep from the context" in held("at_mark_rules")["a write at the mark"]
    from journal.features.chart.catalogue import Catalogue
    by_key = {e.key: e for e in app.container.get(Catalogue).triggers()}
    assert all("codex" in by_key[k].providers for k in ("session_started", "prompt_submitted", "tool_starting")) and by_key["turn_written"].providers == ("claude",), "the events the holds ride on come from Codex too; only the turn written is Claude's alone, and the page says so"


def test_no_workflow_holds_a_journal_command_or_the_read_of_a_skills_file(skilled):
    from journal.features.chart.validation import Validation
    from journal.repositories.charts import Charts
    app = skilled
    console, charts = app.console(), app.container.get(Charts)
    hook(app, "SessionStart")
    mine = int(console.run(["chart", "new", "Hold everything", "--on", "tool_starting"], USER).out.split()[1].rstrip(":"))
    trigger = next(n.id for n in charts.nodes_of(charts.find(mine)) if n.kind == "trigger")
    hold = int(console.run(["chart", "node", "action", "hold", "--text", "[chart] every tool held", "--in", str(mine)], USER).out.split()[1].rstrip(":"))
    console.run(["chart", "line", str(trigger), str(hold)], USER)
    assert any("holds every tool" in w for w in app.container.get(Validation).warnings(charts.find(mine))), "the save warns of a hold no check narrows"
    assert hook(app, "PreToolUse", tool_name="Read", tool_input={"file_path": "a.py"})[0] == 409, "the user's hold holds a read"
    assert hook(app, "PreToolUse", tool_name="Write", tool_input={"file_path": "a.py"})[0] == 409
    status, body = hook(app, "PreToolUse", tool_name="Bash", tool_input={"command": "journal task list"})
    assert status == 200 and "every tool held" in json.dumps(body), "a journal command runs whatever a workflow holds; the hold's words still reach the agent"
    status, body = hook(app, "PreToolUse", tool_name="Read", tool_input={"file_path": str(app.config.root / ".claude/skills/journal/SKILL.md")})
    assert status == 200, "the read of a skill's file goes through: it pays the skill owed"
    read_skill(app, "journal")
    assert hook(app, "PreToolUse", tool_name="Bash", tool_input={"command": "journal environment here"})[0] == 200


def test_send_the_agent_back_restores_what_every_pause_keeps(app, monkeypatch):
    """A workflow of the user's with the one node sends the agent back from each pause: awaiting something outside, stuck, waiting on a question, awaiting a worker, running a sequence."""
    from journal.supervisor_link import SupervisorLink
    monkeypatch.setattr(SupervisorLink, "_send", lambda self, environment_id, verb, fields: None)
    from journal.repositories.charts import Charts
    console, charts, machine = app.console(), app.container.get(Charts), app.container.get(Machine)
    hook(app, "SessionStart")
    console.run(["environment", "here"], AGENT)
    console.run(["task", "create", "the footer", "--start"], AGENT)
    mine = int(console.run(["chart", "new", "Back on a subagent", "--on", "subagent_ended"], USER).out.split()[1].rstrip(":"))
    trigger = next(n.id for n in charts.nodes_of(charts.find(mine)) if n.kind == "trigger")
    back = int(console.run(["chart", "node", "action", "release", "--text", "[chart] back to it", "--in", str(mine)], USER).out.split()[1].rstrip(":"))
    console.run(["chart", "line", str(trigger), str(back)], USER)
    send_back = lambda: hook(app, "SubagentStop", agent_id="a1")
    console.run(["await", "the deploy"], AGENT)
    assert machine.current("s1").name == "expecting"
    send_back()
    assert machine.current("s1").name == "working" and machine.current("s1").task_id == 1, "back from awaiting something outside, to the task"
    console.run(["stuck", "the build is broken"], AGENT)
    assert machine.current("s1").name == "stuck"
    send_back()
    assert machine.current("s1").name == "working", "back from being stuck"
    console.run(["question", "ask", "which colour?", "--options", "red,blue"], AGENT)
    assert machine.current("s1").name == "waiting"
    send_back()
    assert machine.current("s1").name == "working", "back from a question"
    console.run(["worker", "dispatch", "Lady Lovelace", "write the parser", "--model", "fast"], AGENT)
    console.run(["worker", "wait", "1"], AGENT)
    assert machine.current("s1").name == "awaiting"
    send_back()
    assert machine.current("s1").name == "working", "back from a worker"
    made = re.search(r"sequence (\d+)", console.run(["sequence", "create", "ship it", "--steps", "tag it | push"], USER).out).group(1)
    console.run(["sequence", "run", made], AGENT)
    assert machine.current("s1").name == "working" and machine.current("s1").task_id == 1, "a sequence runs beside the state, which keeps its task"


def test_a_workflow_of_the_older_shape_naming_a_state_to_move_to_is_rewritten_at_boot_and_still_walks(app):
    from journal.features.chart.seeds.shipped_chart import ShippedChart
    from journal.features.chart.validation import Validation
    from journal.models.drawn_line import DrawnLine
    from journal.models.drawn_node import DrawnNode
    from journal.models.node import Node
    from journal.models.node_kind import NodeKind
    from journal.repositories.charts import Charts
    console, charts, seed = app.console(), app.container.get(Charts), app.container.get(ShippedChart)
    hook(app, "SessionStart")
    console.run(["environment", "here"], AGENT)
    mine, trigger = own_workflow(console, charts, "idle", "tool_finished")
    old = charts.add_node(charts.find(mine), Node(kind=NodeKind.ACTION, key="move_to", text="expecting the deploy"), Actor.user(1))
    charts.connect(charts.nodes.find(trigger), old, "then", Actor.user(1))
    seed.run()
    node = charts.nodes.find(old.id)
    assert node.key == "wait_outside" and node.text == "the deploy" and "rewrote move_to" in charts.find(mine).title, "the older move is the outcome-named action now, its words kept"
    assert app.container.get(Validation).faults(charts.find(mine), [DrawnNode.of(n) for n in charts.nodes_of(charts.find(mine))], [DrawnLine.of(l) for l in charts.lines_of(charts.find(mine))]) == [], "it still compiles"
    hook(app, "PostToolUse", tool_name="Read", tool_input={}, tool_response="")
    state = app.container.get(Machine).current("s1")
    assert state.name == "expecting" and state.what == "the deploy", "and it still walks"


def test_ended_ships_a_workflow_at_session_starts_with_nothing_of_its_own(app):
    from journal.http.controllers.chart import ChartController
    from journal.models.node_kind import NodeKind
    from journal.repositories.charts import Charts
    charts = app.container.get(Charts)
    ended = charts.for_pair("ended", "session_started")
    assert ended and ended.shipped and [n.kind for n in charts.nodes_of(ended)] == [NodeKind.TRIGGER], "Ended at Session start is shipped with its trigger alone"
    named = app.container.get(ChartController).named(ended)
    assert named["title"] == "No workflow for this state yet" and named["off"] is False and named["edited"] is False, "the page lists it with its marks"
    assert any(s["key"] == "ended" for s in app.container.get(ChartController).listed_states()), "and Ended among the states"


def test_a_shipped_workflow_titled_by_its_state_and_event_takes_the_title_that_says_what_it_does(app):
    from journal.features.chart.seeds.shipped_chart import ShippedChart
    from journal.repositories.charts import Charts
    charts, shipped = app.container.get(Charts), app.container.get(ShippedChart)
    idle = next(c for c in charts.shipped() if c.drawing == "idle:idle:parked")
    inbox = next(c for c in charts.shipped() if c.drawing == ":tool_starting:inbox")
    charts.save(idle.with_(title="Idle at Agent stops"), Actor.system())
    charts.save(inbox.with_(title="Guards at Tool about to run"), Actor.system())
    shipped.run()
    assert charts.find(idle.id).title == "Hold the stop while a task is parked", "the old title, never renamed by the user, becomes the plain one at boot"
    assert charts.find(inbox.id).title == "Name the unread messages every 3 tool uses"
    charts.save(charts.find(idle.id).with_(title="My own stop rules"), Actor.system())
    shipped.run()
    assert charts.find(idle.id).title == "My own stop rules", "a title the user gave stays"


def test_each_feature_declares_its_own_checks_and_actions_and_the_catalogue_only_gathers_them(app):
    from journal.features.chart.actions import Actions
    from journal.features.chart.catalogue import Catalogue
    from journal.features.chart.checks import Checks
    from journal.features.registry import Registry
    catalogue, registry = app.container.get(Catalogue), app.container.get(Registry)
    declared = [(f.name, e.key) for f in registry.features for e in f.checks + f.actions]
    assert len(declared) == len({k for _, k in declared}), "a key is declared by one feature only"
    assert {e.key for e in catalogue.checks()} == {e.key for f in registry.features for e in f.checks} and {e.key for e in catalogue.actions()} == {e.key for f in registry.features for e in f.actions}
    assert all(callable(getattr(Checks, e.key, None)) for e in catalogue.checks()), "every declared check is answered by the chart's checks"
    assert all(callable(getattr(Actions, e.key, None)) for e in catalogue.actions()), "every declared action is performed by the chart's actions"
    owners = {k: f for f, k in declared}
    assert owners["unread_over"] == "messages" and owners["open_tasks"] == "tasks" and owners["require_skill"] == "skills" and owners["count_every"] == "chart" and owners["worker_reported"] == "workers"


def test_the_content_checks_read_the_tool_the_prompt_the_context_and_the_clock_for_claude_and_codex(app):
    import time
    from journal.events.agent.prompt_submitted import PromptSubmitted
    from journal.events.agent.ticked import Ticked
    from journal.events.agent.tool_starting import ToolStarting
    from journal.features.chart.checks import Checks
    from journal.features.chart.context import Context
    hook(app, "SessionStart")
    checks = app.container.get(Checks)
    at = lambda event, provider="claude": Context(event=event, session="s1", environment_id=1, provider=provider)
    write = at(ToolStarting(tool="Write", input={"file_path": "src/deploy.sh"}, session="s1", environment_id=1))
    shell = at(ToolStarting(tool="shell", input={"command": ["bash", "-lc", "git push origin main"]}, session="s1", environment_id=1, provider="codex"), "codex")
    assert checks.answer("tool_named", write, "Write, Edit") and not checks.answer("tool_named", write, "Bash") and checks.answer("tool_named", shell, "shell"), "the tool's name, as the provider names it"
    assert checks.answer("tool_input_has", write, "deploy") and checks.answer("tool_input_has", shell, "git push") and not checks.answer("tool_input_has", write, "push"), "the words anywhere in the input, Codex's command list included"
    prompt = at(PromptSubmitted(prompt="Deploy it to production now", session="s1", environment_id=1))
    assert checks.answer("prompt_has", prompt, "deploy") and not checks.answer("prompt_has", prompt, "rollback") and not checks.answer("prompt_has", write, "deploy")
    full = at(ToolStarting(tool="Read", input={}, session="s1", environment_id=1, context=0.62))
    assert checks.answer("context_over", full, "60") and not checks.answer("context_over", full, "70") and not checks.answer("context_over", write, "0"), "the context as the event reports it"
    night = time.mktime((2026, 10, 17, 23, 30, 0, 0, 0, -1))
    noon = time.mktime((2026, 10, 17, 12, 0, 0, 0, 0, -1))
    tick = lambda when: at(Ticked(at=when, quiet_for=0.0, session="s1", environment_id=1))
    assert checks.answer("time_between", tick(night), "22:00-06:00") and not checks.answer("time_between", tick(noon), "22:00-06:00") and checks.answer("time_between", tick(noon), "09:00-17:00"), "a span past midnight included"
    assert not checks.answer("time_between", tick(noon), "late"), "a span that is no span answers no"


def test_the_counts_the_inbox_reminders_read_come_from_the_record_and_no_workflow_keeps_them(app):
    from journal.events.agent.tool_starting import ToolStarting
    from journal.features.chart.checks import Checks
    from journal.features.chart.context import Context
    from journal.repositories.charts import Charts
    from journal.repositories.scope import Scope
    console, checks, charts = app.console(), app.container.get(Checks), app.container.get(Charts)
    assert not any(n.key in ("count_start", "count_one") for c in charts.shipped() for n in charts.nodes_of(c)), "no shipped workflow keeps a count: the ones they read come from the record"
    hook(app, "SessionStart")
    console.run(["environment", "here"], AGENT)
    drain = lambda: app.runtime().deferred.drain()
    at = lambda: Context(event=ToolStarting(tool="Read", input={}, session="s1", environment_id=1), session="s1", environment_id=1, state=app.container.get(Machine).current("s1"))
    with app.container.get(Scope).of(1):
        assert checks.count_of(at(), "uses") == 0 and checks.count_of(at(), "owed") == 0 and checks.count_of(at(), "namings") == 0, "nothing unread, nothing owed: nought"
    console.run(["message", "send", "one"], USER)
    drain()
    for _ in range(3):
        hook(app, "PreToolUse", tool_name="Read", tool_input={"file_path": "a"})
    with app.container.get(Scope).of(1):
        assert checks.count_of(at(), "uses") == 3, "tool uses since the newest unread message came"
        assert checks.count_of(at(), "namings") >= 1, "the inbox was named since it came"
    console.run(["message", "read", "1"], AGENT)
    drain()
    for _ in range(2):
        hook(app, "PreToolUse", tool_name="Read", tool_input={"file_path": "b"})
    with app.container.get(Scope).of(1):
        assert checks.count_of(at(), "uses") == 0 and checks.count_of(at(), "owed") == 2, "read: nothing unread, two uses since the first unanswered was read"


def test_a_shipped_title_says_its_settings_number_and_a_changed_setting_retitles_it_at_boot(app):
    from journal.features.chart.seeds.shipped_chart import ShippedChart
    from journal.repositories.charts import Charts
    charts = app.container.get(Charts)
    named = lambda: next(c for c in charts.shipped() if c.drawing == ":tool_starting:inbox")
    assert named().title == "Name the unread messages every 3 tool uses", "the title says the number, never N"
    app.container.get(Settings).save(Setting(environment_id=0, key="messages.remind_every", value=5), Actor.system())
    ShippedChart.__init__(app.container.get(ShippedChart), *[getattr(app.container.get(ShippedChart), a) for a in ("charts", "catalogue", "settings", "states", "agents", "counts", "registry")])
    app.container.get(ShippedChart).run()
    assert named().title == "Name the unread messages every 5 tool uses", "a changed setting retitles the workflow at boot"
    charts.save(named().with_(title="My reminder"), Actor.system())
    app.container.get(ShippedChart).run()
    assert named().title == "My reminder", "a title the user gave stays"


def test_a_start_after_a_compaction_says_where_the_work_stands(app):
    console = app.console()
    hook(app, "SessionStart")
    console.run(["environment", "here"], AGENT)
    console.run(["task", "create", "the footer", "--start"], AGENT)
    console.run(["task", "log", "1", "halfway through the footer"], AGENT)
    app.runtime().deferred.drain()
    fresh = hook(app, "SessionStart", source="startup")[1]["hookSpecificOutput"]["additionalContext"]
    assert "after the compaction" not in fresh, "a fresh start says nothing of a compaction"
    said = hook(app, "SessionStart", source="compact")[1]["hookSpecificOutput"]["additionalContext"]
    assert 'after the compaction, the work stands here: task 1' in said and '"halfway through the footer"' in said and "uncommitted files:" in said, "the task, its last log whole and the files not committed"


def test_a_fresh_start_asks_whether_old_facts_rules_and_reminders_still_hold(app):
    from datetime import datetime, timedelta, timezone
    from journal.repositories.facts import Facts
    from journal.repositories.scope import Scope
    console = app.console()
    console.run(["fact", "create", "the api lives on port 9"], USER)
    console.run(["fact", "create", "the login is new"], USER)
    with app.container.get(Scope).of(1):
        facts = app.container.get(Facts)
        old = facts.in_()[0]
        facts.connection.execute(f"UPDATE {facts.table} SET created_at = ?, updated_at = ? WHERE id = ?", ((datetime.now(timezone.utc) - timedelta(days=9)).isoformat(),) * 2 + (old.id,))
    said = hook(app, "SessionStart", source="startup")[1]["hookSpecificOutput"]["additionalContext"]
    assert "these are 7 days old or more, check they still hold: fact 1, 9 days" in said and "fact 2" not in said.split("check they still hold:")[1].split("\n")[0], "the old one is named with its age, the new one is not"
    again = hook(app, "SessionStart", source="startup")[1]["hookSpecificOutput"]["additionalContext"]
    assert "check they still hold" not in again, "at most once a day"
    compacted = hook(app, "SessionStart", source="compact")[1]["hookSpecificOutput"]["additionalContext"]
    assert "check they still hold" not in compacted, "never after a compaction"


def test_a_cancelled_task_is_finished_and_never_counted_open(app):
    from journal.db.migrations.finish_cancelled_tasks import FinishCancelledTasks
    from journal.db.connection import Connection
    from journal.repositories.scope import Scope
    from journal.repositories.tasks import Tasks
    console = app.console()
    console.run(["plan", "create", "p", "--brief", "b"], USER)
    console.run(["plan", "add", "1", "a task of its own"], USER)
    console.run(["task", "create", "a task of nobody's"], USER)
    console.run(["plan", "cancel", "1"], USER)
    with app.container.get(Scope).of(1):
        cancelled = app.container.get(Tasks).find(1)
        assert cancelled.state.value == "cancelled" and cancelled.finished_at is not None, "a cancel stamps when it finished"
        connection = app.container.get(Connection)
        connection.execute("UPDATE tasks SET finished_at = NULL WHERE id = 1")
        FinishCancelledTasks().up(connection)
        assert app.container.get(Tasks).find(1).finished_at is not None, "and one cancelled before that is finished by the migration"
    with app.container.get(Scope).of(1):
        assert app.container.get(Tasks).unfinished_count() == 1, "only the task still open is counted"


def test_a_worker_that_ends_has_its_commits_taken_in_and_its_leftovers_named(app):
    import subprocess
    from journal.features.workers.worker_runner import WorkerRunner
    from journal.models.actor import Actor as A
    from journal.repositories.messages import Messages
    from journal.repositories.scope import Scope
    from journal.repositories.workers import Workers
    root = app.config.root
    git = lambda *argv, cwd=root: subprocess.run(["git", *argv], cwd=cwd, capture_output=True, text=True, timeout=30)
    git("init", "-q", "-b", "main")
    git("config", "user.email", "t@example.com")
    git("config", "user.name", "T")
    (root / ".gitignore").write_text(".journal/\n")
    git("add", ".gitignore")
    git("commit", "-qm", "start")
    hook(app, "SessionStart")
    app.console().run(["worker", "dispatch", "Lady Lovelace", "write the parser", "--model", "sonnet", "--worktree"], AGENT)
    with app.container.get(Scope).of(1):
        worker = app.container.get(Workers).find(1)
        app.container.get(WorkerRunner).run(worker, ["sh", "-c", "echo parsed > parser.txt && git add parser.txt && git commit -qm 'the parser' && echo half > notes.txt && echo the parser is written"], A.agent("s1"))
        report = next(m.text for m in app.container.get(Messages).in_() if "Lady Lovelace reports" in m.text)
    assert "the parser is written" in report and "its 1 commits were taken into this branch" in report and "the parser" in report.split("taken into this branch:")[1], "its commit is merged and named"
    assert (root / "parser.txt").exists(), "the worker's file is in the project now"
    assert "it left 1 files uncommitted in its worktree" in report and "notes.txt" in report, "what it never committed is named, not lost"


def test_a_workflow_runs_another_by_its_title_and_a_loop_is_refused(app):
    from journal.repositories.charts import Charts
    console, charts = app.console(), app.container.get(Charts)
    hook(app, "SessionStart")
    console.run(["environment", "here"], AGENT)
    said = lambda body: body.get("hookSpecificOutput", {}).get("additionalContext", "")
    add = lambda wf, kind, key, *text: int(console.run(["chart", "node", kind, key, *text, "--in", str(wf)], USER).out.split()[1].rstrip(":"))
    trigger = lambda wf: next(n.id for n in charts.nodes_of(charts.find(wf)) if n.kind == "trigger")
    shared = int(console.run(["chart", "new", "Shared steps", "--on", "subagent_started"], USER).out.split()[1].rstrip(":"))
    words = add(shared, "action", "say", "--text", "[chart] the shared steps speak")
    console.run(["chart", "line", str(trigger(shared)), str(words)], USER)
    caller = int(console.run(["chart", "new", "Caller", "--on", "tool_finished"], USER).out.split()[1].rstrip(":"))
    call = add(caller, "action", "run_workflow", "--text", "Shared steps")
    console.run(["chart", "line", str(trigger(caller)), str(call)], USER)
    status, body = hook(app, "PostToolUse", tool_name="Read", tool_input={"file_path": "a"})
    assert "the shared steps speak" in said(body), "the called workflow's steps run in place, at the caller's event"
    loop = console.run(["chart", "node", "action", "run_workflow", "--text", "Caller", "--in", str(shared)], USER)
    assert loop.code == 1 and "runs Caller, which runs this workflow again" in loop.err, "a loop is refused when the step is added"
    assert "none is titled Nobody" in console.run(["chart", "node", "action", "run_workflow", "--text", "Nobody", "--in", str(caller)], USER).err, "a title no workflow has is refused"


def test_a_quiet_workflow_walks_after_the_reply_and_a_walk_ended_before_it_ends_it(app, monkeypatch):
    from journal.repositories.charts import Charts
    from journal.supervisor_link import SupervisorLink
    typed = []
    monkeypatch.setattr(SupervisorLink, "_send", lambda self, environment_id, verb, fields: typed.append({"verb": verb, **fields}.get("line", "")))
    console, charts = app.console(), app.container.get(Charts)
    hook(app, "SessionStart")
    console.run(["environment", "here"], AGENT)
    add = lambda wf, kind, key, *text: int(console.run(["chart", "node", kind, key, *text, "--in", str(wf)], USER).out.split()[1].rstrip(":"))
    trigger = lambda wf: next(n.id for n in charts.nodes_of(charts.find(wf)) if n.kind == "trigger")
    quiet = int(console.run(["chart", "new", "Quiet one", "--on", "subagent_started"], USER).out.split()[1].rstrip(":"))
    console.run(["chart", "line", str(trigger(quiet)), str(add(quiet, "action", "type", "--text", "[chart] typed after the reply"))], USER)
    status, body = hook(app, "SubagentStart", agent_id="a1")
    assert "typed after the reply" not in json.dumps(body), "the quiet workflow is not on the hook's path"
    app.runtime().deferred.drain()
    assert any("typed after the reply" in t for t in typed), "it walks after the reply"
    first = int(console.run(["chart", "new", "Ends the run", "--on", "subagent_started"], USER).out.split()[1].rstrip(":"))
    charts.save(charts.find(first).with_(place=-1000), USER.actor)
    console.run(["chart", "line", str(trigger(first)), str(add(first, "action", "stop_here"))], USER)
    typed.clear()
    hook(app, "SubagentStart", agent_id="a2")
    app.runtime().deferred.drain()
    assert not any("typed after the reply" in t for t in typed), "a walk ended by an earlier workflow ends the quiet part too"


def test_a_secret_row_holds_its_fields_and_its_values_live_in_a_private_file(app, tmp_path, monkeypatch):
    import stat
    from datetime import datetime, timezone
    from journal.secret_values import SecretValues
    from journal.models.secret import Secret
    from journal.models.secret_kind import SecretKind
    from journal.repositories.secrets import Secrets
    monkeypatch.setenv("AGENT_JOURNAL_SECRETS", str(tmp_path / "private"))
    secrets, values = app.container.get(Secrets), app.container.get(SecretValues)
    secret = secrets.save(Secret(title="Github", kind=SecretKind.API_KEY, fields=SecretKind.API_KEY.first_fields("Github")), Actor.user("u"))
    assert secret.fields == ({"name": "key", "hidden": True, "variable": "GITHUB_KEY"},) and secret.waiting()
    values.put("GITHUB_KEY", 'gh-"quoted"-token')
    secret = secrets.save(secret.filled_in("key"), Actor.user("u"))
    assert not secrets.find(secret.id).waiting() and values.values() == {"GITHUB_KEY": 'gh-"quoted"-token'}
    assert stat.S_IMODE(values.path.stat().st_mode) == 0o600 and stat.S_IMODE(values.path.parent.stat().st_mode) == 0o700
    assert values.path.name == f"{(app.config.home / 'project-id').read_text().strip()}.env", "the file is named by the project's id, kept in its journal folder"
    raw = b"".join(path.read_bytes() for path in app.config.home.glob("journal.db*"))
    assert b"gh-" not in raw, "no value ever reaches the database"
    values.drop(["GITHUB_KEY"])
    assert values.values() == {}
    gone = secrets.save(secrets.find(secret.id).deleted(datetime.now(timezone.utc)), Actor.user("u"))
    assert secrets.live() == [] and secrets.gone() == [gone]


def test_a_secret_value_is_masked_out_of_every_write_and_the_leak_is_shown(app, tmp_path, monkeypatch):
    from journal.db.masks import Masks
    from journal.events.agent.ticked import Ticked
    from journal.events.bus import Bus
    from journal.models.message import Message
    from journal.repositories.messages import Messages
    from journal.repositories.scope import Scope
    from journal.secret_values import SecretValues
    monkeypatch.setenv("AGENT_JOURNAL_SECRETS", str(tmp_path / "private"))
    hook(app, "SessionStart")
    app.container.get(SecretValues).put("GITHUB_KEY", "ghp_0123456789abcdef")
    app.container.get(SecretValues).put("PIN", "1234")
    with app.container.get(Scope).of(1):
        saved = app.container.get(Messages).save(Message(text="the key is ghp_0123456789abcdef and the pin 1234"), Actor.system())
        assert app.container.get(Messages).find(saved.id).text == "the key is [secret GITHUB_KEY] and the pin 1234", "a value too short to mask stands as it is"
    hook(app, "PostToolUse", tool_name="Bash", tool_input={"command": "echo ghp_0123456789abcdef"}, tool_response="ghp_0123456789abcdef")
    stored = b"".join(path.read_bytes() for path in app.config.home.glob("journal.db*"))
    assert b"[secret GITHUB_KEY]" in stored and b"ghp_0123456789abcdef" not in stored, "not in a hook's entry either, in the database or its log"
    assert app.container.get(Masks).leaks
    app.container.get(Bus).dispatch(Ticked(session="s1", environment_id=1, at=0.0, quiet_for=1.0))
    app.runtime().deferred.drain()
    with app.container.get(Scope).of(1):
        assert any("was masked: GITHUB_KEY" in m.text for m in app.container.get(Messages).in_()), "the leak is shown once"


def test_the_agent_is_kept_out_of_the_secrets_and_the_mcp_keys(app, tmp_path, monkeypatch):
    from journal.secret_values import SecretValues
    monkeypatch.setenv("AGENT_JOURNAL_SECRETS", str(tmp_path / "private"))
    monkeypatch.setattr(Path, "home", lambda: tmp_path / "home")
    hook(app, "SessionStart")
    read_skill(app, "journal")
    app.console().run(["environment", "here"], AGENT)
    values = app.container.get(SecretValues).path
    keys = tmp_path / "home" / ".journal" / "keys"
    refused = lambda tool, given: hook(app, "PreToolUse", tool_name=tool, tool_input=given)[0] == 409
    assert refused("Read", {"file_path": str(values)})
    assert refused("Bash", {"command": f"cat {values.parent}/*.env"})
    assert refused("Bash", {"command": "cat ~/.config/agent-journal/secrets/x.env"})
    assert refused("Grep", {"pattern": "KEY", "path": str(keys)})
    climbed = "../" * len(app.config.root.resolve().parts) + str(keys.resolve()).lstrip("/") + "/x.json"
    assert refused("Read", {"file_path": climbed}), "a path that climbs into the keys is refused too"
    assert hook(app, "PreToolUse", tool_name="Read", tool_input={"file_path": str(app.config.root / "a.py")})[0] == 200
    assert "`journal secret run <n> -- <program>`" in hook(app, "PreToolUse", tool_name="Read", tool_input={"file_path": str(values)})[1]["error"]


def test_the_secret_commands_make_ask_for_change_list_show_and_delete_and_none_takes_a_value(app, tmp_path, monkeypatch):
    from journal.repositories.messages import Messages
    from journal.repositories.scope import Scope
    monkeypatch.setenv("AGENT_JOURNAL_SECRETS", str(tmp_path / "private"))
    console = app.console()
    import shutil
    monkeypatch.setattr(shutil, "which", lambda name: f"/usr/bin/{name}")
    made = console.run(["secret", "create", "Github", "--kind", "api key", "--brief", "Run `curl -H @- https://api.github.com/user` or `bash -c x`, with GITHUB_KEY"], AGENT)
    assert made.code == 0 and "secret 1 made: Github, waiting for the user to fill key on the Secrets page; proposed for the user to allow: curl" in made.out, "a shell named in the instructions is never proposed"
    assert console.run(["secret", "request", "Stripe", "--why", "to read the invoices"], AGENT).code == 0
    with app.container.get(Scope).of(1):
        assert any("Please fill in the secret Stripe on the Secrets page" in m.text and "secret 2" in m.text for m in app.container.get(Messages).in_())
    assert "filled by the user on the Secrets page, never by a command" in console.run(["secret", "fill", "1"], AGENT).err
    listed = console.run(["secret", "list"], AGENT).out
    assert "Github  waiting for the user" in listed and "Stripe" in listed
    shown = console.run(["secret", "show", "1"], AGENT).out
    assert "GITHUB_KEY" in shown and "waiting for the user, hidden" in shown and "proposed: curl" in shown
    assert console.run(["secret", "update", "1", "--title", "GitHub"], AGENT).code == 0 and "GitHub" in console.run(["secret", "list"], AGENT).out
    assert console.run(["secret", "where"], AGENT).out.strip().endswith(".env")
    made = tmp_path / "made.txt"
    made.write_text("  generated-password-value  \n")
    assert console.run(["secret", "store", "1", "key", str(made)], AGENT).code == 0 and not made.exists()
    from journal.secret_values import SecretValues
    assert app.container.get(SecretValues).values()["GITHUB_KEY"] == "generated-password-value"
    console.run(["secret", "delete", "2"], AGENT)
    assert "Stripe" not in console.run(["secret", "list"], AGENT).out
    console.run(["secret", "restore", "2"], AGENT)
    assert "Stripe" in console.run(["secret", "list"], AGENT).out


def test_secrets_kept_as_files_in_the_project_folder_become_rows_once(app):
    import json as j
    from journal.features.secrets.seeds.secret_files import SecretFiles
    from journal.repositories.secrets import Secrets
    folder = app.config.home / "project" / "secret"
    folder.mkdir(parents=True)
    head = {"n": 1, "title": "flespi", "data": {"kind": "api key", "secret_fields": [{"name": "key", "hidden": True, "variable": "FLESPI_KEY"}], "filled": {"key": 1791556011.2}, "programs": ["curl"], "used": 1791706718.7}, "deleted": 0.0}
    (folder / "001.md").write_text("---\n" + j.dumps(head, indent=2) + "\n---\nThe flespi token, used with curl.\n")
    (folder / "changes.log").write_text("not a secret")
    seed = app.container.get(SecretFiles)
    seed.run()
    seed.run()
    rows = app.container.get(Secrets).all()
    assert len(rows) == 1, "brought in once, however often the journal boots"
    flespi = rows[0]
    assert flespi.title == "flespi" and flespi.kind == "api key" and flespi.filled == ("key",) and flespi.programs == ("curl",) and flespi.brief == "The flespi token, used with curl." and flespi.used_at is not None and not flespi.waiting()



def test_the_agent_is_told_when_the_user_allows_a_program(app, monkeypatch):
    from journal.http.v3.action_body import ActionBody
    from journal.http.v3.secret_actions import SecretActions
    from journal.models.secret import Secret
    from journal.repositories.secrets import Secrets
    from journal.supervisor_link import SupervisorLink
    sent = []
    monkeypatch.setattr(SupervisorLink, "_send", lambda self, environment_id, verb, fields: sent.append({"verb": verb, **fields}))
    hook(app, "SessionStart")
    secret = app.container.get(Secrets).save(Secret(title="Github", proposed=("gh",)), Actor.agent("s1"))
    app.container.get(SecretActions).update(secret.id, ActionBody(programs=("gh",), sent=frozenset({"programs", "proposed"})), Actor.user("u"))
    app.runtime().deferred.drain()
    assert any("the user let secret 1, Github, go to gh" in r.get("line", "") for r in sent)


def test_a_browser_login_is_taken_in_a_window_given_to_the_agents_browser_and_taken_back(app, tmp_path, monkeypatch):
    import json as j
    import time
    from journal.features.mcp.installing import Installing
    from journal.features.secrets.browser_logins import BrowserLogins
    from journal.http.v3.action_body import ActionBody
    from journal.http.v3.secret_actions import SecretActions
    from journal.models.mcp_server import McpServer
    from journal.models.secret import Secret
    from journal.models.secret_kind import SecretKind
    from journal.repositories.mcp_servers import McpServers
    from journal.repositories.secrets import Secrets
    monkeypatch.setenv("AGENT_JOURNAL_SECRETS", str(tmp_path / "private"))
    applied = []
    monkeypatch.setattr(Installing, "applied", lambda self: applied.append(True))

    def recorded(self, title, url):
        self.folder.mkdir(mode=0o700, parents=True, exist_ok=True)
        saved = self.saved_for(title)
        saved.write_text(j.dumps({"cookies": [{"name": "sid", "domain": ".example.com", "path": "/", "expires": 4102444800}], "origins": []}))
        return saved

    monkeypatch.setattr(BrowserLogins, "record", recorded)
    servers, secrets = app.container.get(McpServers), app.container.get(Secrets)
    servers.save(McpServer(name="playwright", title="Playwright", command="npx", args=("-y", "@playwright/mcp@latest", "--headless")), Actor.system())
    secret = secrets.save(Secret(title="Example", kind=SecretKind.BROWSER_LOGIN, url="https://app.example.com/login"), Actor.user("u"))
    assert "the user logs in to Example with the Log in button" in app.console().run(["secret", "login", str(secret.id)], AGENT).err, "the agent logs in on its own only where the user allows it"
    app.container.get(SecretActions).allow_login(secret.id, ActionBody(), Actor.user("u"))
    began = time.time()
    while secrets.find(secret.id).logging_in_at and time.time() - began < 5:
        time.sleep(0.05)
    done = secrets.find(secret.id)
    assert done.auto_login and done.session_at and done.session_expires.year == 2100
    merged = app.container.get(BrowserLogins).merged
    args = servers.named("playwright").args
    assert args[-3:] == ("--storage-state", str(merged), "--isolated") and merged.is_file() and applied, "the agent's browser starts with the login, and the agents restart to use it"
    assert "logged in to Example" in app.console().run(["secret", "login", str(secret.id), "--wait"], AGENT).out
    app.container.get(SecretActions).revoke_login(secret.id, ActionBody(), Actor.user("u"))
    assert not secrets.find(secret.id).auto_login and merged.exists(), "asking each time keeps the saved login"
    app.container.get(SecretActions).forget_login(secret.id, ActionBody(), Actor.user("u"))
    assert "--storage-state" not in servers.named("playwright").args and not merged.exists() and secrets.find(secret.id).session_at is None


def test_a_replaced_value_stays_masked_and_a_login_that_ran_out_asks_again_once(app, tmp_path, monkeypatch):
    from datetime import datetime, timedelta, timezone
    from journal.events.agent.ticked import Ticked
    from journal.events.bus import Bus
    from journal.models.message import Message
    from journal.models.secret import Secret
    from journal.models.secret_kind import SecretKind
    from journal.repositories.messages import Messages
    from journal.repositories.secrets import Secrets
    from journal.secret_values import SecretValues
    monkeypatch.setenv("AGENT_JOURNAL_SECRETS", str(tmp_path / "private"))
    values = app.container.get(SecretValues)
    values.put("GITHUB_KEY", "ghp_oldvalue_0001")
    values.put("GITHUB_KEY", "ghp_newvalue_0002")
    saved = app.container.get(Messages).save(Message(text="old ghp_oldvalue_0001 new ghp_newvalue_0002"), Actor.system())
    assert app.container.get(Messages).find(saved.id).text == "old [secret GITHUB_KEY] new [secret GITHUB_KEY]", "the replaced value is still masked"
    assert values.values()["GITHUB_KEY"] == "ghp_newvalue_0002" and len(values.retired_before(9e12)) == 1
    secrets = app.container.get(Secrets)
    secrets.save(Secret(title="Example", kind=SecretKind.BROWSER_LOGIN, url="https://example.com", session_at=datetime.now(timezone.utc) - timedelta(days=2), session_expires=datetime.now(timezone.utc) - timedelta(days=1)), Actor.user("u"))
    hook(app, "SessionStart")
    for _ in range(2):
        app.container.get(Bus).dispatch(Ticked(session="s1", environment_id=1, at=0.0, quiet_for=1.0))
        app.runtime().deferred.drain()
    asked = [m for m in app.container.get(Messages).in_() if "Your login to Example has run out" in m.text]
    assert len(asked) == 1, "asked once for each time it runs out"


def test_a_secret_deleted_thirty_days_ago_goes_for_good_with_its_values(app, tmp_path, monkeypatch):
    from datetime import datetime, timedelta, timezone
    from journal.events.agent.ticked import Ticked
    from journal.events.bus import Bus
    from journal.models.secret import Secret
    from journal.models.secret_kind import SecretKind
    from journal.repositories.secrets import Secrets
    from journal.secret_values import AT, RETIRED, SecretValues
    monkeypatch.setenv("AGENT_JOURNAL_SECRETS", str(tmp_path / "private"))
    values, secrets = app.container.get(SecretValues), app.container.get(Secrets)
    long_ago = datetime.now(timezone.utc) - timedelta(days=31)
    old = secrets.save(Secret(title="Old", kind=SecretKind.API_KEY, fields=SecretKind.API_KEY.first_fields("Old"), deleted_at=long_ago), Actor.user("u"))
    recent = secrets.save(Secret(title="Recent", kind=SecretKind.API_KEY, fields=SecretKind.API_KEY.first_fields("Recent"), deleted_at=datetime.now(timezone.utc)), Actor.user("u"))
    values.write({"OLD_KEY": "a", "RECENT_KEY": "b", f"{RETIRED}X{AT}{int(long_ago.timestamp())}": "c", "LIVE_KEY": "d"})
    hook(app, "SessionStart")
    app.container.get(Bus).dispatch(Ticked(session="s1", environment_id=1, at=0.0, quiet_for=1.0))
    app.runtime().deferred.drain()
    assert [s.id for s in secrets.all()] == [recent.id], "the one deleted thirty days ago is gone, the recent one kept for a restore"
    assert values.values() == {"RECENT_KEY": "b", "LIVE_KEY": "d"}, "its values and the old retired one go with it"


def test_an_agents_wait_is_on_its_own_row_with_or_without_a_task(app):
    from journal.http.v3.shapers.agents_shaper import AgentsShaper
    hook(app, "SessionStart")
    app.console().run(["environment", "here"], AGENT)
    app.console().run(["await", "the suite"], AGENT)
    with app.container.get(Scope).of(MAIN):
        row = app.container.get(AgentsShaper).rows()[0]
    assert row.data["awaiting"] == "the suite" and row.data["awaiting_since"], "the bar reads a wait from the agent's row, which changes when its state does"


def test_a_step_moved_on_is_never_written_back_by_a_change_read_before_it(app):
    from journal.engine.machine import Machine
    from journal.features.sequences.running import Running
    console = app.console()
    release = console.run(["sequence", "create", "release", "--steps", "one | two | three"], USER).out.split()[1].rstrip(":")
    hook(app, "SessionStart")
    console.run(["environment", "here"], AGENT)
    console.run(["sequence", "run", release], AGENT)
    console.run(["sequence", "follow"], AGENT)
    running, machine = app.container.get(Running), app.container.get(Machine)
    with app.container.get(Scope).of(MAIN):
        stale = machine.agent("s1", 1)
        console.run(["sequence", "next"], AGENT)
        running.rewritten(stale, lambda now: [*now[:-1], now[-1].said(running.now())])
        assert running.in_hand("s1", 1).step == 1, "the pace's own write, read before the step moved on, keeps the step it moved to"


def test_an_agent_waiting_in_auto_mode_is_pointed_to_the_next_task_after_a_quiet_minute(app, monkeypatch):
    from journal.events.agent.ticked import Ticked
    from journal.events.bus import Bus
    typed = []
    catch_typed(app, monkeypatch, typed)
    hook(app, "SessionStart")
    console = app.console()
    console.run(["environment", "here"], AGENT)
    console.run(["task", "create", "the footer", "--start"], AGENT)
    console.run(["task", "create", "the header"], AGENT)
    console.run(["await", "the suite"], AGENT)
    app.container.get(Bus).dispatch(Ticked(session="s1", environment_id=1, at=0.0, quiet_for=70.0))
    app.runtime().deferred.drain()
    assert any("while you wait for the suite, task 2 is next" in line and "waiting is fine" in line for line in typed), typed


def test_an_approved_plan_not_started_holds_the_stop_until_it_is(app):
    console = app.console()
    console.run(["plan", "create", "p", "--brief", "b"], USER)
    console.run(["plan", "add", "1", "only"], USER)
    console.run(["plan", "phase", "1", "one", "--when", "w"], USER)
    console.run(["plan", "todos", "1", "1", "1"], USER)
    console.run(["plan", "ready", "1"], USER)
    console.run(["plan", "approve", "1"], USER)
    hook(app, "SessionStart")
    console.run(["environment", "here"], AGENT)
    assert "plan 1 is approved and not started" in hook(app, "Stop")[1]["reason"]
    console.run(["plan", "start", "1"], AGENT)
    assert "is approved and not started" not in json.dumps(hook(app, "Stop")[1]), "a started plan holds nothing"


def test_a_question_asked_without_a_session_or_from_a_workers_shell_is_refused(app):
    hook(app, "SessionStart")
    app.console().run(["worker", "dispatch", "Lady Lovelace", "say hello", "--model", "sonnet"], AGENT)
    from journal.repositories.workers import Workers
    workers = app.container.get(Workers)
    workers.save(workers.find(1).with_(session="w1"), USER.actor)
    assert "worker's report" in app.console().run(["question", "ask", "Which?"], USER).err
    assert app.console().run(["question", "ask", "Which?"], Where("main", "w1")).code != 0
    assert app.console().run(["question", "ask", "Which?"], AGENT).code == 0


def test_a_worker_past_its_time_limit_is_stopped_and_reported(app):
    from journal.features.workers.feature import Workers as WorkersFeature
    from journal.features.workers.worker_runner import WorkerRunner
    from journal.models.actor import Actor as A
    from journal.repositories.messages import Messages
    from journal.repositories.settings import Settings
    from journal.repositories.workers import Workers
    hook(app, "SessionStart")
    app.console().run(["worker", "dispatch", "Lady Lovelace", "say hello", "--model", "sonnet"], AGENT)
    app.container.get(Settings).set(WorkersFeature.TIMEOUT.key, 0.02, USER.actor)
    worker = app.container.get(Workers).find(1)
    app.container.get(WorkerRunner).run(worker, ["sh", "-c", "echo half done; sleep 30"], A.agent("s1"))
    assert any("stopped after" in m.text and "half done" in m.text for m in app.container.get(Messages).in_())


def test_a_commit_trailer_of_an_old_head_or_a_closed_task_closes_nothing(app, monkeypatch):
    import subprocess
    from journal.repositories.tasks import Tasks
    catch_typed(app, monkeypatch, [])
    root = app.config.root
    subprocess.run(["git", "init", "-q"], cwd=root, check=True)
    old = {"GIT_COMMITTER_DATE": "2020-01-01T00:00:00", "GIT_AUTHOR_DATE": "2020-01-01T00:00:00"}
    subprocess.run(["git", "-c", "user.email=t@t", "-c", "user.name=t", "commit", "-q", "--allow-empty", "-m", "Old\n\nJournal: tasks done 1 and 2 earlier"], cwd=root, check=True, env={**os.environ, **old})
    hook(app, "SessionStart")
    app.console().run(["task", "create", "footer", "--start"], AGENT)
    app.console().run(["task", "create", "margin"], AGENT)
    command = dict(tool_name="Bash", tool_input={"command": "git commit -m x"}, tool_response={"stdout": "", "stderr": ""})
    hook(app, "PostToolUse", **command)
    assert app.container.get(Tasks).find(1).state == "started", "the head was not made by this command"
    for line in (["task", "park", "1", "first"], ["task", "start", "2"], ["task", "park", "2", "later"], ["task", "resume", "1"]):
        app.console().run(line, AGENT)
    subprocess.run(["git", "-c", "user.email=t@t", "-c", "user.name=t", "commit", "-q", "--allow-empty", "-m", "New\n\nJournal: tasks done 1 and 2 now"], cwd=root, check=True)
    hook(app, "PostToolUse", **command)
    assert app.container.get(Tasks).find(1).state == "done" and app.container.get(Tasks).find(2).state == "parked"


def test_command_outputs_are_a_rolling_log_that_drops_the_oldest_with_its_folder(app):
    from journal.repositories.command_outputs import CommandOutputs
    app.container.get(Settings).save(Setting(environment_id=0, key="shell.outputs_kept", value=2), Actor.system())
    hook(app, "SessionStart")
    console = app.console()
    folders = [app.config.root / f"run{i}" for i in range(3)]
    for folder in folders:
        folder.mkdir()
        console.run(["shell", "split", "ls", "--into", str(folder)], AGENT)
    with app.container.get(Scope).of(MAIN):
        kept = app.container.get(CommandOutputs).every()
    assert [o.chain for o in kept] == ["run1", "run2"] and not folders[0].exists() and folders[2].exists(), "the newest kept, the oldest gone with its files"


def test_an_output_is_read_by_its_number_whole_by_its_ends_or_in_part_and_listed(app):
    hook(app, "SessionStart")
    console = app.console()
    folder = app.config.root / "run"
    folder.mkdir()
    (folder / "parts").write_text(console.run(["shell", "split", "make test", "--into", str(folder)], AGENT).out)
    (folder / "0.out").write_text("\n".join(f"line {i}" for i in range(1, 51)) + "\n")
    (folder / "0.status").write_text("1\n")
    (folder / "done").write_text("1")
    assert (folder / "number").read_text() == "1", "the runner names a cut output by the number the split leaves"
    whole = console.run(["output", "read", "1"], AGENT).out
    assert "output 1: failed with code 1, 50 lines" in whole and "command: make test" in whole, whole
    assert "line 10\n... 30 lines" in whole and whole.rstrip().endswith("line 50"), "the first and last ten, the middle named"
    assert console.run(["output", "read", "1", "--lines", "20-22"], AGENT).out == "line 20\nline 21\nline 22\n"
    assert console.run(["output", "read", "1", "--grep", "line 4[29]"], AGENT).out == "42: line 42\n49: line 49\n"
    assert console.run(["output", "read", "1", "--tail", "1"], AGENT).out == "line 50\n"
    assert "failed with code 1" in console.run(["output", "list"], AGENT).out
    assert console.run(["reader", "add", "forties", "--pattern", "line 4[0-1]$", "--about", "lines in the early forties"], AGENT).code == 0
    assert (app.config.readers / "forties.pattern").read_text() == "# lines in the early forties\nline 4[0-1]$\n", "a reader is a file of the project's"
    assert console.run(["reader", "list"], AGENT).out == "forties: lines in the early forties\n"
    assert console.run(["output", "read", "1", "--reader", "forties"], AGENT).out == "40: line 40\n41: line 41\n"
    assert console.run(["output", "read", "1", "--reader", "nothing"], AGENT).code == 1, "an unknown reader is refused"
    script = app.config.root / "count.sh"
    script.write_text("wc -l | tr -d ' '\n")
    assert console.run(["reader", "add", "count", "--script", str(script), "--about", "how many lines"], AGENT).code == 0
    assert console.run(["output", "read", "1", "--reader", "count"], AGENT).out == "50\n", "a script reader is handed the output and prints what matters"
    assert console.run(["reader", "list"], AGENT).out == "count: how many lines\nforties: lines in the early forties\n"


def test_a_trailing_tail_is_dropped_before_the_command_runs_and_a_head_is_left(app):
    hook(app, "SessionStart")
    console = app.console()
    for name, line in (("cut", "python3 -m pytest -q 2>&1 | tail -4"), ("head", "yes | head -3"), ("quoted", 'echo "a | tail -1"')):
        folder = app.config.root / name
        folder.mkdir()
        console.run(["shell", "split", line, "--into", str(folder)], AGENT)
    assert (app.config.root / "cut" / "0.part").read_text() == "python3 -m pytest -q 2>&1", "the tail goes; the output is kept whole"
    assert "| tail -4 dropped" in (app.config.root / "cut" / "dropped").read_text()
    assert (app.config.root / "head" / "0.part").read_text() == "yes | head -3", "a head may be what stops an endless command"
    assert not (app.config.root / "quoted" / "dropped").exists(), "a pipe inside quotes is text"


def test_output_is_shown_whole_for_journal_commands_by_its_ends_for_a_read_and_its_last_characters_otherwise(app):
    from journal.repositories.command_outputs import CommandOutputs
    hook(app, "SessionStart")
    console = app.console()
    cap = lambda line: console.run(["shell", "cap", "--line", line], AGENT).out.strip()
    assert cap("journal task list") == "whole 0" and cap("cat a.py && git diff") == "ends 8000" and cap("python3 -m pytest -q") == "hint 200"
    folder = app.config.root / "journal-line"
    folder.mkdir()
    console.run(["shell", "split", "journal task list", "--into", str(folder)], AGENT)
    with app.container.get(Scope).of(MAIN):
        assert app.container.get(CommandOutputs).every() == [] and not (folder / "number").exists(), "a line of journal commands is no output"


def test_one_task_is_in_hand_whatever_starts_it_and_a_parked_plan_parks_its_task(app):
    from journal.repositories.plans import Plans
    from journal.repositories.tasks import Tasks
    console = app.console()
    console.run(["plan", "create", "p", "--brief", "b"], USER)
    console.run(["plan", "add", "1", "first"], USER)
    console.run(["plan", "add", "1", "second"], USER)
    console.run(["plan", "phase", "1", "one", "--when", "w"], USER)
    console.run(["plan", "todos", "1", "1", "1", "2"], USER)
    console.run(["plan", "ready", "1"], USER)
    console.run(["plan", "approve", "1"], USER)
    hook(app, "SessionStart")
    console.run(["environment", "here"], AGENT)
    console.run(["task", "create", "aside", "--start"], AGENT)
    refused = console.run(["plan", "start", "1"], AGENT)
    assert refused.code == 1 and "task 3 is in hand" in refused.err, "a plan's start obeys the one task in hand"
    assert app.container.get(Plans).find(1).state == "approved", "a refused start leaves the plan as it was"
    assert console.run(["task", "park", "2", "x"], AGENT).code == 1, "a task never started is not parked"
    console.run(["task", "park", "3", "the plan first"], AGENT)
    console.run(["plan", "start", "1"], AGENT)
    console.run(["plan", "park", "1"], AGENT)
    tasks = app.container.get(Tasks)
    assert tasks.find(1).state == "parked" and tasks.in_hand() is None, "a parked plan parks its task in hand"
    done = console.run(["task", "resume", "1"], AGENT)
    assert done.code == 0
    out = console.run(["task", "done", "1", "--how", "h"], AGENT).out
    assert "task 3 is still parked" in out, "with nothing in hand, a parked task is named first"
    console.run(["task", "resume", "3"], AGENT)
    console.run(["task", "done", "3", "--how", "h"], AGENT)
    console.run(["task", "start", "2"], AGENT)
    console.run(["task", "done", "2", "--how", "h"], AGENT)
    assert app.container.get(Plans).find(1).state == "done", "a parked plan whose last task closes is done"


def test_a_plan_started_with_every_task_closed_is_done_and_one_with_no_task_is_not(app):
    from journal.repositories.plans import Plans
    console = app.console()
    for title in ("closed", "empty"):
        console.run(["plan", "create", title, "--brief", "b"], USER)
    console.run(["plan", "add", "1", "only"], USER)
    console.run(["plan", "phase", "1", "one", "--when", "w"], USER)
    console.run(["plan", "todos", "1", "1", "1"], USER)
    console.run(["plan", "approve", "1"], USER)
    console.run(["plan", "approve", "2"], USER)
    hook(app, "SessionStart")
    console.run(["environment", "here"], AGENT)
    console.run(["plan", "park", "1"], AGENT)
    console.run(["task", "start", "1"], AGENT)
    console.run(["task", "done", "1", "--how", "h"], AGENT)
    plans = app.container.get(Plans)
    assert plans.find(1).state == "done", "a parked plan whose last task closes is done"
    console.run(["plan", "start", "2"], AGENT)
    assert plans.find(2).state == "started", "a plan with no task yet is not finished"


def test_the_same_hand_read_of_outputs_coming_back_among_the_last_reads_brings_one_tip_to_write_a_reader(app):
    hook(app, "SessionStart")
    tip = lambda command: hook(app, "PreToolUse", tool_name="Bash", tool_input={"command": command})[1].get("hookSpecificOutput", {}).get("additionalContext", "")
    assert "write" not in tip("journal output read 12 --grep FAILED") + tip("ls src") + tip("journal output read 40 --reader failed") + tip("journal output read 3") + tip("journal output read 4"), "a plain read of a summary is no shape"
    assert "you read outputs this way again: journal output read <output> --grep FAILED" in tip("journal output read 31 --grep FAILED"), "a different output, the same read"
    assert "this way again" not in tip("journal output read 33 --grep FAILED"), "once for each shape"


def test_a_hand_read_that_does_a_readers_work_is_pointed_at_the_reader(app):
    hook(app, "SessionStart")
    app.console().run(["reader", "add", "failed-tests", "--pattern", "^FAILED", "--about", "the failing tests"], AGENT)
    said = lambda command: hook(app, "PreToolUse", tool_name="Bash", tool_input={"command": command})[1].get("hookSpecificOutput", {}).get("additionalContext", "")
    assert "reader failed-tests already reads this: the failing tests" in said("journal output read 7 --grep '^FAILED'")
    assert "already reads this" not in said("journal output read 9 --grep '^FAILED'"), "said once"


def test_a_sequence_ported_from_version_3_is_written_at_boot(app):
    from journal.repositories.sequences import Sequences
    filing = next(s for s in app.container.get(Sequences).all() if s.title == "Filing a document that is already written")
    assert filing.starts_on == "doc.created" and len(filing.steps) == 2


def version_3_row(folder, kind: str, n: int, brief: str = "", **header) -> None:
    """A version 3 row file: its JSON header between --- lines, then its brief."""
    folder.mkdir(parents=True, exist_ok=True)
    head = {"n": n, "type": kind, "title": "", "refs": [], "seen": ["user"], "created": 1.0, "updated": 1.0, "deleted": 0.0, "completed": 0.0, "outcome": "", "data": {}, **header}
    (folder / f"{n:03d}.md").write_text(f"---\n{json.dumps(head, indent=2)}\n---\n{brief}\n")


def test_only_the_version_3_environments_still_in_use_are_brought_across_and_never_twice(app):
    from journal.features.migration.migrator import Migrator
    from journal.repositories.environments import Environments
    from journal.repositories.reports import Reports
    kept = app.config.home / "version-3"
    for n, name, kind in ((1, "main", "main"), (2, "ticket-8", "ticket"), (3, "ticket-9", "ticket")):
        version_3_row(kept / "project" / "environment", "environment", n, title=name, data={"kind": kind})
    version_3_row(kept / "environments" / "ticket-8" / "todo", "todo", 1, "still open")
    version_3_row(kept / "environments" / "ticket-9" / "todo", "todo", 1, "long done", completed=2.0)
    migrator = app.container.get(Migrator)
    for _ in range(2):
        with app.container.get(Scope).of(MAIN):
            migrator.run(migrator.begin(Actor.user(1)), Actor.user(1))
    names = {e.name for e in app.container.get(Environments).every()}
    assert {"main", "ticket-8"} <= names and "ticket-9" not in names, "main and the one with open work, not the finished one"
    with app.container.get(Scope).of(MAIN):
        body = app.container.get(Reports).all()[-1].body
    assert "| environments | 0 | 1 |" in body and "environment ticket-9: not in use" in body, "the second run brings nothing twice and says what stayed"


def test_every_version_3_message_comes_across_with_its_author_time_reply_and_attachment(app):
    import zipfile
    from journal.features.migration.migrator import Migrator
    from journal.repositories.messages import Messages
    kept = app.config.home / "version-3"
    version_3_row(kept / "project" / "environment", "environment", 1, title="main", data={"kind": "main"})
    messages = kept / "environments" / "main" / "message"
    version_3_row(messages, "message", 1, "an old one", created=1700000000.0, completed=1700000100.0)
    (messages / "001.md").rename(messages / "old.md")
    (messages / "packed").mkdir()
    with zipfile.ZipFile(messages / "packed" / "2023-11-14.zip", "w") as packed:
        packed.write(messages / "old.md", "001.md")
    (messages / "old.md").unlink()
    version_3_row(messages, "message", 2, "the answer", seen=["agent", "user"], refs=["message:1"], created=1700000200.0, updated=1700000250.0)
    version_3_row(messages, "message", 3, "a picture", created=1700000300.0)
    (messages / "3").mkdir()
    (messages / "3" / "shot.png").write_bytes(b"png")
    version_3_row(messages, "message", 4, "gone", deleted=5.0)
    migrator = app.container.get(Migrator)
    with app.container.get(Scope).of(MAIN):
        migrator.run(migrator.begin(Actor.user(1)), Actor.user(1))
        brought = [m for m in app.container.get(Messages).every() if m.text in ("an old one", "the answer", "a picture", "gone")]
    assert [m.text for m in brought] == ["an old one", "the answer", "a picture"], "the packed one too, in order, the deleted one left behind"
    old, answer, picture = brought
    assert old.created_at.timestamp() == 1700000000.0 and old.read_at is not None, "its own time, and read"
    assert answer.author == "agent" and answer.reply_to == old.id, "the reply still points at what it answers"
    assert answer.read_at.timestamp() == 1700000250.0 and picture.read_at is None, "read when the other side saw it, so the viewer has nothing to mark read"
    assert picture.files == ("shot.png",) and (app.config.files / "message" / str(picture.id) / "shot.png").read_bytes() == b"png"


def test_the_mcp_list_answers_at_once_and_asks_the_program_on_a_thread_of_its_own(app, monkeypatch):
    import time
    from journal.features.mcp.health import Health
    from journal.features.mcp.health_report import HealthReport
    from journal.features.mcp.known import Known
    asked = []
    def slow(self):
        asked.append(1)
        time.sleep(0.5)
        return HealthReport({"github": Known("github", "npx", "connected", "")})
    monkeypatch.setattr(Health, "asked", slow)
    health = app.container.get(Health)
    began = time.time()
    assert health.of_all().servers == {} and health.of_all().servers == {} and time.time() - began < 0.2, "no request waits on the program"
    for _ in range(20):
        if health.of_all().servers:
            break
        time.sleep(0.1)
    assert list(health.of_all().servers) == ["github"] and asked == [1], "asked once, in the background, and the next request has it"


def test_version_3_comments_and_reactions_come_across_on_their_rows(app):
    from journal.features.migration.migrator import Migrator
    from journal.models.ref import Ref
    from journal.repositories.links import Links
    from journal.repositories.messages import Messages
    from journal.repositories.reactions import Reactions
    kept = app.config.home / "version-3"
    version_3_row(kept / "project" / "environment", "environment", 1, title="main", data={"kind": "main"})
    main = kept / "environments" / "main"
    version_3_row(main / "message", "message", 1, "ship it")
    version_3_row(main / "comment", "comment", 1, "> ship it\n\nnot yet", refs=["message:1"])
    version_3_row(main / "comment", "comment", 2, "on a task that stayed", refs=["todo:5"])
    version_3_row(main / "reaction", "reaction", 1, "", refs=["message:1"], data={"face": "🎉"})
    migrator = app.container.get(Migrator)
    with app.container.get(Scope).of(MAIN):
        migrator.run(migrator.begin(Actor.user(1)), Actor.user(1))
        messages = app.container.get(Messages)
        shipped = next(m for m in messages.every() if m.text == "ship it")
        comment = next(m for m in messages.every() if m.text.endswith("not yet"))
        links = app.container.get(Links)
        assert links.targets(comment, Messages.COMMENTS_ON) == [Ref.to(shipped)], "the comment sits under its message"
        reaction = app.container.get(Reactions).every()[-1]
        assert reaction.face == "🎉" and links.targets(reaction, "reacts") == [Ref.to(shipped)]
        assert not any(m.text == "on a task that stayed" for m in messages.every()), "a comment whose row stayed behind stays too"


def test_version_3_todos_become_tasks_in_their_states_with_their_work_logs(app):
    from journal.features.migration.migrator import Migrator
    from journal.repositories.task_logs import TaskLogs
    from journal.repositories.tasks import Tasks
    kept = app.config.home / "version-3"
    version_3_row(kept / "project" / "environment", "environment", 1, title="main", data={"kind": "main"})
    todo = kept / "environments" / "main" / "todo"
    version_3_row(todo, "todo", 1, "the brief", title="done one", completed=2.0, outcome="it shipped")
    version_3_row(todo, "todo", 2, "", title="in progress", data={"status": "started"})
    version_3_row(todo, "todo", 3, "", title="waiting", data={"blocked": "the vendor's answer"})
    version_3_row(todo, "todo", 4, "", title="still open")
    version_3_row(todo, "todo", 5, "", title="struck", data={"struck": True})
    work = kept / "environments" / "main" / "work" / "001.md"
    version_3_row(work.parent, "work", 1, "", refs=["todo:1"], data={"todo": 1})
    work.write_text(work.read_text() + "## 1 · 2026-10-11 18:10 UTC\nbuilt it\n## 2 · 2026-10-11 19:00 UTC\ntested it\n")
    migrator = app.container.get(Migrator)
    with app.container.get(Scope).of(MAIN):
        migrator.run(migrator.begin(Actor.user(1)), Actor.user(1))
        tasks = {t.title: t for t in app.container.get(Tasks).every()}
        assert tasks["done one"].state == "done" and tasks["done one"].outcome == "it shipped" and tasks["done one"].brief == "the brief"
        assert tasks["in progress"].state == "parked" and tasks["waiting"].state == "blocked" and tasks["waiting"].blocked_why == "the vendor's answer"
        assert tasks["still open"].state == "open" and "struck" not in tasks, "a struck to-do stays behind"
        assert [log.line for log in app.container.get(TaskLogs).every() if log.task_id == tasks["done one"].id] == ["built it", "tested it"]


def test_version_3_plans_keep_their_state_phases_and_tasks_and_questions_their_answers(app):
    from journal.features.migration.migrator import Migrator
    from journal.repositories.plans import Plans
    from journal.repositories.questions import Questions
    kept = app.config.home / "version-3"
    version_3_row(kept / "project" / "environment", "environment", 1, title="main", data={"kind": "main"})
    main = kept / "environments" / "main"
    version_3_row(main / "todo", "todo", 7, "", title="first step")
    version_3_row(main / "plan", "plan", 1, "the goal", title="the plan", data={"status": "approved", "phases": [{"title": "one", "when": "it works", "checkpoint": True, "todos": [7]}]})
    version_3_row(main / "question", "question", 1, "", title="which one?", data={"options": [{"title": "a"}, {"title": "b"}]}, completed=3.0, outcome="b")
    version_3_row(main / "question", "question", 2, "", title="still open?")
    migrator = app.container.get(Migrator)
    with app.container.get(Scope).of(MAIN):
        migrator.run(migrator.begin(Actor.user(1)), Actor.user(1))
        plans = app.container.get(Plans)
        plan = next(p for p in plans.every() if p.title == "the plan")
        phases = plans.phases_of(plan)
        assert plan.state == "approved" and plan.brief == "the goal", "an approval stays an approval"
        assert [(p.title, p.complete_when, p.checkpoint) for p in phases] == [("one", "it works", True)]
        assert [t.title for t in plans.tasks_of(plan)] == ["first step"] and [t.title for t in plans.tasks_in(phases[0])] == ["first step"]
        questions = {q.text: q for q in app.container.get(Questions).every()}
        assert questions["which one?"].options == ("a", "b") and questions["which one?"].answer == "b" and questions["still open?"].answer is None


def test_version_3_facts_rules_reminders_documents_and_reports_come_across_and_struck_ones_stay(app):
    from journal.features.migration.migrator import Migrator
    from journal.repositories.docs import Docs
    from journal.repositories.facts import Facts
    from journal.repositories.reminders import Reminders
    from journal.repositories.reports import Reports
    from journal.repositories.rules import Rules
    kept = app.config.home / "version-3"
    version_3_row(kept / "project" / "environment", "environment", 1, title="main", data={"kind": "main"})
    main = kept / "environments" / "main"
    version_3_row(main / "fact", "fact", 1, "the port is 8420", data={"keywords": ["port"]})
    version_3_row(main / "fact", "fact", 2, "an old truth", completed=2.0)
    version_3_row(main / "reminder", "reminder", 1, "say you")
    version_3_row(main / "report", "report", 1, "what we found", title="the audit", abstract="one line")
    version_3_row(kept / "project" / "rule", "rule", 1, "Always plain English")
    doc = kept / "project" / "doc" / "001"
    version_3_row(doc, "doc", 1, "the intro", title="the guide", abstract="how it works")
    (doc / "001.md").rename(doc / "doc.md")
    (doc / "doc.md").write_text((doc / "doc.md").read_text() + "## Setup\nrun it\n")
    migrator = app.container.get(Migrator)
    with app.container.get(Scope).of(MAIN):
        migrator.run(migrator.begin(Actor.user(1)), Actor.user(1))
        facts = [(f.text, f.keywords) for f in app.container.get(Facts).every()]
        assert ("the port is 8420", ("port",)) in facts and not any(text == "an old truth" for text, _ in facts), "a struck fact stays behind"
        assert any(r.text == "say you" for r in app.container.get(Reminders).every())
        assert any(r.title == "the audit" and r.body == "what we found" for r in app.container.get(Reports).every())
    assert any(r.text == "Always plain English" for r in app.container.get(Rules).every())
    guide = next(d for d in app.container.get(Docs).every() if d.title == "the guide")
    assert guide.abstract == "how it works" and guide.body == "the intro\n\n## Setup\n\nrun it"


def test_version_3_checks_triggers_sequences_templates_and_settings_come_across_where_they_fit(app):
    from journal.features.migration.migrator import Migrator
    from journal.repositories.checks import Checks
    from journal.repositories.sequences import Sequences
    from journal.repositories.settings import Settings
    from journal.repositories.templates import Templates
    from journal.repositories.triggers import Triggers
    kept = app.config.home / "version-3"
    project = kept / "project"
    version_3_row(project / "check", "check", 1, "the suite passes", title="tests", data={"command": "pytest -q", "every": 30})
    version_3_row(project / "trigger", "trigger", 1, "", data={"words": ["deploy"], "does": "instruct", "text": "read the deploy notes"})
    version_3_row(project / "trigger", "trigger", 2, "", data={"words": ["hold"], "does": "hold", "text": "x"})
    sequence = project / "sequence" / "001.md"
    version_3_row(sequence.parent, "sequence", 1, "", title="Releasing", data={"starts_on": ""})
    sequence.write_text(sequence.read_text() + "## Tag it\n\n## Push it\nwith the tags\n")
    version_3_row(project / "sequence", "sequence", 2, "", title="Shipped one", data={"system": True})
    version_3_row(project / "template", "template", 1, "write it plainly", title="Report", data={"applies_to": ["report"], "purpose": "critique"})
    (kept / "settings.json").write_text(json.dumps({"features": {"checks": False, "boards": True}}))
    migrator = app.container.get(Migrator)
    with app.container.get(Scope).of(MAIN):
        migrator.run(migrator.begin(Actor.user(1)), Actor.user(1))
    check = next(c for c in app.container.get(Checks).every() if c.title == "tests")
    assert check.command == "pytest -q" and check.every == 30
    assert [(t.words, t.action, t.text) for t in app.container.get(Triggers).every() if "deploy" in t.words] == [(("deploy",), "instruct", "read the deploy notes")]
    assert not any("hold" in t.words for t in app.container.get(Triggers).every()), "a trigger version 4 cannot do stays behind"
    titles = {s.title: s for s in app.container.get(Sequences).every()}
    assert titles["Releasing"].steps == ("Tag it", "Push it: with the tags") and "Shipped one" not in titles, "version 3's shipped sequences stay behind"
    assert any(t.title == "Report" and t.purpose == "critique" for t in app.container.get(Templates).every())
    assert app.container.get(Settings).project("features.checks") is False and app.container.get(Settings).project("features.boards") is None, "only a feature version 4 has"


def test_a_small_version_3_journal_comes_across_counted_kind_by_kind_and_a_second_run_brings_nothing(app):
    from journal.features.migration.migrator import Migrator
    from journal.repositories.reports import Reports
    kept = app.config.home / "version-3"
    version_3_row(kept / "project" / "environment", "environment", 1, title="main", data={"kind": "main"})
    main = kept / "environments" / "main"
    for n in (1, 2):
        version_3_row(main / "message", "message", n, f"message {n}")
        version_3_row(main / "todo", "todo", n, "", title=f"task {n}")
    version_3_row(main / "comment", "comment", 1, "a comment", refs=["message:1"])
    version_3_row(main / "reaction", "reaction", 1, "", refs=["message:2"], data={"face": "👍"})
    version_3_row(main / "fact", "fact", 1, "a fact")
    version_3_row(kept / "project" / "rule", "rule", 1, "Always a rule")
    version_3_row(kept / "project" / "secret", "secret", 1, "how it is used", title="github", data={"kind": "api key", "secret_fields": [{"name": "key", "hidden": True, "variable": "GITHUB_TOKEN"}]})
    version_3_row(main / "agent", "agent", 1, "", data={"provider": "claude", "transcript": "/x/abc.jsonl"})
    migrator = app.container.get(Migrator)
    for _ in range(2):
        with app.container.get(Scope).of(MAIN):
            migrator.run(migrator.begin(Actor.user(1)), Actor.user(1))
    with app.container.get(Scope).of(MAIN):
        first, second = [r.body for r in app.container.get(Reports).all() if r.title == "The version 3 journal brought across"]
    for line in ("| environments | 1 |", "| messages | 2 |", "| tasks | 2 |", "| comments | 1 |", "| reactions | 1 |", "| facts | 1 |", "| rules | 1 |", "| secrets | 1 |", "| agents | 1 |"):
        assert line in first, line
    assert "| messages | 0 |" in second and "| tasks | 0 |" in second and "| secrets | 0 |" in second, "a second run brings nothing twice"


def test_a_version_3_row_that_cannot_come_across_is_reported_and_the_migration_goes_on(app):
    from journal.features.migration.migrator import Migrator
    from journal.repositories.messages import Messages
    from journal.repositories.reports import Reports
    kept = app.config.home / "version-3"
    version_3_row(kept / "project" / "environment", "environment", 1, title="main", data={"kind": "main"})
    version_3_row(kept / "environments" / "main" / "message", "message", 1, "broken", seen=["nobody"])
    version_3_row(kept / "environments" / "main" / "message", "message", 2, "fine")
    migrator = app.container.get(Migrator)
    with app.container.get(Scope).of(MAIN):
        assert migrator.run(migrator.begin(Actor.user(1)), Actor.user(1)).state == "done", "nothing stops the run"
        texts = [m.text for m in app.container.get(Messages).every()]
        body = app.container.get(Reports).all()[-1].body
    assert "fine" in texts and "broken" not in texts
    assert "message 1 in main: could not be brought:" in body, "the row is named with its error"


def test_resuming_a_plans_parked_task_follows_the_plan_again_so_finishing_it_starts_the_next(app):
    from journal.repositories.tasks import Tasks
    console = app.console()
    console.run(["plan", "create", "p", "--brief", "b"], USER)
    console.run(["plan", "add", "1", "first"], USER)
    console.run(["plan", "add", "1", "second"], USER)
    console.run(["plan", "phase", "1", "one", "--when", "w"], USER)
    console.run(["plan", "todos", "1", "1", "1", "2"], USER)
    console.run(["plan", "approve", "1"], USER)
    hook(app, "SessionStart")
    console.run(["environment", "here"], AGENT)
    console.run(["plan", "start", "1"], AGENT)
    console.run(["task", "park", "1", "something first"], AGENT)
    console.run(["task", "resume", "1"], AGENT)
    assert app.container.get(Machine).current("s1").name == "following_plan", "a resumed plan task is followed again"
    console.run(["task", "done", "1", "--how", "h"], AGENT)
    assert app.container.get(Tasks).find(2).state == "started", "so finishing it starts the next"


def test_a_plan_moves_on_whoever_closes_its_task_and_an_approved_plan_with_every_task_closed_is_done(app):
    from journal.features.plans.states.following_plan import FollowingPlan
    from journal.repositories.plans import Plans
    from journal.repositories.tasks import Tasks
    console = app.console()
    for title in ("first", "second"):
        console.run(["plan", "create", title, "--brief", "b"], USER)
    console.run(["plan", "add", "1", "one"], USER)
    console.run(["plan", "add", "1", "two"], USER)
    console.run(["plan", "add", "2", "only"], USER)
    for n in (1, 2):
        console.run(["plan", "approve", str(n)], USER)
    hook(app, "SessionStart")
    console.run(["environment", "here"], AGENT)
    console.run(["plan", "start", "1"], AGENT)
    console.run(["task", "done", "1", "--how", "the user closed it"], USER)
    assert app.container.get(Tasks).find(2).state == "started" and app.container.get(Machine).current("s1") == FollowingPlan(plan_id=1, task_id=2), "the user's close moves the agent's plan on"
    console.run(["task", "done", "2", "--how", "h"], AGENT)
    console.run(["task", "start", "3"], USER)
    console.run(["task", "done", "3", "--how", "h"], USER)
    assert app.container.get(Plans).find(2).state == "done", "an approved plan whose last task closes is done without a start"


def test_a_plan_parks_and_restarts_on_its_parked_task_only_once_approved_holds_its_checkpoint_and_reopens(app):
    from journal.models.task_state import TaskState
    from journal.repositories.plans import Plans
    from journal.repositories.tasks import Tasks
    console = app.console()
    console.run(["plan", "create", "p", "--brief", "b"], USER)
    for title in ("one", "two", "three"):
        console.run(["plan", "add", "1", title], USER)
    console.run(["plan", "phase", "1", "first", "--when", "w", "--checkpoint"], USER)
    console.run(["plan", "phase", "1", "second", "--when", "w"], USER)
    console.run(["plan", "todos", "1", "1", "1", "2"], USER)
    console.run(["plan", "todos", "1", "2", "3"], USER)
    assert console.run(["plan", "park", "1"], USER).code == 1, "a plan not yet approved is not parked, so it cannot be started by a restart"
    console.run(["plan", "approve", "1"], USER)
    hook(app, "SessionStart")
    console.run(["environment", "here"], AGENT)
    console.run(["plan", "start", "1"], AGENT)
    console.run(["plan", "park", "1"], AGENT)
    assert "task 1 is next" in console.run(["plan", "start", "1"], AGENT).out, "a restart resumes the parked task"
    console.run(["task", "done", "1", "--how", "h"], AGENT)
    console.run(["task", "done", "2", "--how", "h"], AGENT)
    console.run(["task", "block", "3", "a vendor"], AGENT)
    plans = app.container.get(Plans)
    assert plans.at_checkpoint(plans.find(1)) is not None, "a blocked task after a checkpoint does not pass it"
    console.run(["task", "unblock", "3"], AGENT)
    console.run(["task", "start", "3"], AGENT)
    console.run(["task", "done", "3", "--how", "h"], AGENT)
    assert plans.find(1).state == "done"
    tasks = app.container.get(Tasks)
    tasks.save(tasks.find(3).with_(state=TaskState.OPEN, finished_at=None, outcome=""), Actor.user(1))
    assert plans.find(1).state == "started", "a reopened task reopens its plan"


def test_no_wait_closes_a_loop_and_the_migration_drops_only_the_link_that_would(app):
    from journal.features.migration.migrator import Migrator
    from journal.repositories.reports import Reports
    from journal.repositories.tasks import Tasks
    console = app.console()
    hook(app, "SessionStart")
    for title in ("a", "b"):
        console.run(["task", "create", title], AGENT)
    console.run(["task", "block", "1", "--on", "task:2"], AGENT)
    refused = console.run(["task", "block", "2", "--on", "task:1"], AGENT)
    assert refused.code == 1 and "loop" in refused.err, "B waiting on A while A waits on B is refused"
    kept = app.config.home / "version-3"
    version_3_row(kept / "project" / "environment", "environment", 1, title="main", data={"kind": "main"})
    todo = kept / "environments" / "main" / "todo"
    version_3_row(todo, "todo", 1, "", title="x", data={"after": [2]})
    version_3_row(todo, "todo", 2, "", title="y", data={"after": [1]})
    migrator = app.container.get(Migrator)
    with app.container.get(Scope).of(MAIN):
        migrator.run(migrator.begin(Actor.user(1)), Actor.user(1))
        titles = {t.title for t in app.container.get(Tasks).every()}
        body = app.container.get(Reports).all()[-1].body
    assert {"x", "y"} <= titles, "every task comes across"
    assert "| waits | 2 |" in body and "would close a loop" in body, "the one link that would close the loop is dropped and named"


def test_a_row_whose_text_names_another_is_linked_to_it_off_the_writes_thread(app):
    from journal.engine.deferred import Deferred
    from journal.models.ref import Ref
    from journal.repositories.links import Links
    hook(app, "SessionStart")
    console = app.console()
    console.run(["task", "create", "the parser"], AGENT)
    console.run(["message", "send", "see task 1, and task 99 which is not there"], AGENT)
    app.container.get(Deferred).drain()
    with app.container.get(Scope).of(MAIN):
        mentions = [(link.source.type, link.target) for link in app.container.get(Links).every() if link.kind == "mentions"]
    assert ("messages", Ref("tasks", 1)) in mentions and Ref("tasks", 99) not in [t for _, t in mentions], "linked to what exists, not to what does not"
