"""The first features through the real server: the briefing at session start, and the memory hold at a context mark."""

import json
from pathlib import Path
from urllib.error import HTTPError
from urllib.request import Request as HttpRequest, urlopen

import pytest

from journal.app import App
from journal.config import Config
from journal.models.actor import Actor
from journal.models.setting import Setting
from journal.repositories.settings import Settings
from journal.console.where import Where
from journal.engine.machine import Machine
from journal.features.memory.states.at_mark import AtMark
from journal.features.tasks.states.working import Working

AGENT = Where("main", "s1")
USER = Where("main")


@pytest.fixture
def app(tmp_path: Path, monkeypatch):
    monkeypatch.setattr(Config, "status_home", property(lambda self: tmp_path / "status"))
    app = App(Config(tmp_path, port=0))
    app.container.get(Settings).save(Setting(environment_id=0, key="features.skills", value=False), Actor.system())
    app.runtime().start()
    yield app
    app.runtime().stop()


def hook(app, kind: str, **body):
    data = json.dumps({"hook_event_name": kind, "session_id": "s1", **body}).encode()
    request = HttpRequest(f"http://127.0.0.1:{app.server().port}/hooks/claude", data=data, method="POST", headers={"Content-Type": "application/json"})
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
    app.console().run(["task", "create", "t", "--start"], AGENT)
    context(app, 30)
    status, body = hook(app, "PreToolUse", tool_name="Read", tool_input={})
    assert "context 25% full" in body["hookSpecificOutput"]["additionalContext"]
    machine = app.container.get(Machine)
    assert isinstance(machine.current("s1"), AtMark) and machine.current("s1").mark == 25
    status, body = hook(app, "PreToolUse", tool_name="Write", tool_input={})
    assert status == 409 and "writes wait" in body["error"]
    assert app.console().run(["fact", "create", "the login is flaky"], AGENT).code == 0
    assert machine.current("s1") == Working(task_id=1)
    assert hook(app, "PreToolUse", tool_name="Write", tool_input={})[0] == 200
    assert "hookSpecificOutput" not in hook(app, "PreToolUse", tool_name="Read", tool_input={})[1], "the mark asks once"
    context(app, 55)
    assert "context 50% full" in hook(app, "Stop")[1]["error"]
    app.console().run(["nothing", "survives", "all logged"], AGENT)
    assert machine.current("s1") == Working(task_id=1)


def test_a_rule_binds_the_project_not_an_environment(app):
    app.console().run(["rule", "create", "Always name the model"], Where("other"))
    assert "Always name the model" in app.console().run(["rule", "list"], USER).out


def test_pauses_nest_and_each_back_pops_one(app):
    hook(app, "SessionStart")
    app.console().run(["task", "create", "t", "--start"], AGENT)
    context(app, 30)
    hook(app, "PreToolUse", tool_name="Read", tool_input={})
    app.console().run(["halt", "now", "stuck"], AGENT)
    machine = app.container.get(Machine)
    assert machine.current("s1").name == "halted"
    hook(app, "PreToolUse", tool_name="Read", tool_input={})
    assert isinstance(machine.current("s1"), AtMark), "the halt went back to the mark it left"
    app.console().run(["nothing", "survives", "fine"], AGENT)
    assert machine.current("s1") == Working(task_id=1), "the mark went back to the task"


def test_a_plan_is_followed_task_by_task_to_its_end(app):
    from journal.features.plans.states.following_plan import FollowingPlan
    from journal.models.plan_state import PlanState
    from journal.repositories.plans import Plans
    console = app.console()
    console.run(["plan", "create", "release", "--brief", "ship 4.0"], USER)
    console.run(["plan", "add", "1", "write the notes"], USER)
    console.run(["plan", "add", "1", "tag it"], USER)
    hook(app, "SessionStart")
    out = console.run(["plan", "start", "1"], AGENT).out
    assert "task 1 is next, write the notes" in out
    machine = app.container.get(Machine)
    assert machine.current("s1") == FollowingPlan(plan_id=1, task_id=1)
    assert "task 1 is in hand" in hook(app, "Stop")[1]["error"]
    out = console.run(["task", "done", "1"], AGENT).out
    assert "task 2 is next, tag it" in out
    assert machine.current("s1") == FollowingPlan(plan_id=1, task_id=2)
    out = console.run(["task", "done", "2"], AGENT).out
    assert "plan 1 is done" in out
    assert machine.current("s1").name == "idle"
    assert app.container.get(Plans).find(1).state == PlanState.DONE


def test_messages_are_put_before_the_agent_and_a_reply_tag_answers_them(app):
    from journal.repositories.messages import Messages
    console = app.console()
    console.run(["message", "send", "can you look at the login?"], USER)
    status, body = hook(app, "UserPromptSubmit", prompt="hi")
    assert "answer these messages before you do anything else: 1. can you look at the login?" in body["hookSpecificOutput"]["additionalContext"]
    hook(app, "MessageDisplay", message="[!reply:1] On it, the login is next.")
    app.runtime().deferred.drain()
    messages = app.container.get(Messages).in_(1)
    assert [m.author for m in messages] == ["user", "agent"]
    assert messages[1].reply_to == 1 and messages[1].text == "On it, the login is next."
    assert messages[0].read_at is not None
    assert hook(app, "Stop")[1] == {}, "nothing unread is left"


def test_a_question_pauses_the_agent_and_the_answer_brings_it_back(app):
    from journal.features.questions.states.waiting import Waiting
    console = app.console()
    hook(app, "SessionStart")
    console.run(["task", "create", "t", "--start"], AGENT)
    console.run(["question", "ask", "Which name?", "--options", "alpha, beta"], AGENT)
    machine = app.container.get(Machine)
    assert isinstance(machine.current("s1"), Waiting) and machine.current("s1").question_id == 1
    assert hook(app, "Stop")[1] == {}, "idle while waiting is fine"
    assert "Which name?  [alpha / beta]" in console.run(["question", "list"], USER).out
    console.run(["question", "answer", "1", "beta"], USER)
    assert machine.current("s1") == Working(task_id=1)
    assert console.run(["question", "list"], USER).out == ""


def test_a_prompt_answers_a_question_in_other_words(app):
    from journal.features.questions.states.waiting import Waiting
    hook(app, "SessionStart")
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
    console.run(["sequence", "create", "release", "--steps", "bump the version | tag it | push"], USER)
    hook(app, "SessionStart")
    console.run(["task", "create", "t", "--start"], AGENT)
    assert "step 1: bump the version" in console.run(["sequence", "run", "1"], AGENT).out
    assert "step 1: bump the version" in hook(app, "Stop")[1]["error"]
    assert "step 2: tag it" in console.run(["sequence", "next"], AGENT).out
    assert "step 3: push" in console.run(["sequence", "next"], AGENT).out
    assert "ran its last step" in console.run(["sequence", "next"], AGENT).out
    assert app.container.get(Machine).current("s1") == Working(task_id=1)


def test_awaiting_workers_ends_when_the_last_one_reports(app, monkeypatch):
    typed = []
    from journal.supervisor_link import SupervisorLink
    monkeypatch.setattr(SupervisorLink, "type", lambda self, line: typed.append(line))
    console = app.console()
    hook(app, "SessionStart")
    console.run(["task", "create", "t", "--start"], AGENT)
    console.run(["worker", "dispatch", "Lady Lovelace", "write the parser", "--model", "fast", "--worktree"], AGENT)
    console.run(["worker", "dispatch", "Dr. Einstein", "profile it", "--model", "fast"], AGENT)
    console.run(["worker", "wait", "1", "2"], AGENT)
    machine = app.container.get(Machine)
    assert machine.current("s1").name == "awaiting" and hook(app, "Stop")[1] == {}
    console.run(["worker", "report", "1", "parser done"], Where("main", "w1"))
    assert machine.current("s1").name == "awaiting" and typed == ["worker 1, Lady Lovelace, reported in the chat"]
    console.run(["worker", "stop", "2"], USER)
    assert machine.current("s1") == Working(task_id=1)
    assert typed[-1] == "what you waited on came back: carry on"


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
    yield app
    app.runtime().stop()


def read_skill(app, folder: str):
    hook(app, "PostToolUse", tool_name="Read", tool_input={"file_path": str(app.config.root / f".claude/skills/{folder}/SKILL.md")}, tool_response="")


def test_the_session_start_requires_the_journal_skill_and_reading_it_lifts_the_hold(skilled):
    from journal.features.skills.states.loading_skill import LoadingSkill
    app = skilled
    status, body = hook(app, "SessionStart")
    assert "read the journal skill before anything else: .claude/skills/journal/SKILL.md" in body["hookSpecificOutput"]["additionalContext"]
    machine = app.container.get(Machine)
    assert isinstance(machine.current("s1"), LoadingSkill)
    assert hook(app, "PreToolUse", tool_name="Write", tool_input={})[0] == 409
    read_skill(app, "journal")
    assert machine.current("s1").name == "idle"
    assert "journal skill" not in hook(app, "SessionStart")[1].get("hookSpecificOutput", {}).get("additionalContext", ""), "loaded once, not owed again"


def test_entering_a_state_requires_its_feature_skill_in_the_command_output(skilled):
    from journal.features.skills.states.loading_skill import LoadingSkill
    app = skilled
    hook(app, "SessionStart")
    read_skill(app, "journal")
    out = app.console().run(["task", "create", "t", "--start"], AGENT).out
    assert "read the tasks skill before anything else" in out
    machine = app.container.get(Machine)
    assert isinstance(machine.current("s1"), LoadingSkill) and machine.current("s1").skill == "tasks"
    read_skill(app, "journal-tasks")
    assert machine.current("s1") == Working(task_id=1)
    hook(app, "PreCompact")
    assert "journal skill" in hook(app, "SessionStart")[1]["hookSpecificOutput"]["additionalContext"], "a compaction owes them again"


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
    assert "do this now: check the changelog first" in hook(app, "UserPromptSubmit", prompt="let's deploy it")[1]["hookSpecificOutput"]["additionalContext"]
    status, body = hook(app, "PreToolUse", tool_name="Bash", tool_input={"command": "rm -rf build"})
    assert status == 409 and "no recursive deletes here" in body["error"]


def test_a_check_runs_and_a_failure_is_typed_to_the_agent(app, monkeypatch):
    typed = []
    from journal.supervisor_link import SupervisorLink
    monkeypatch.setattr(SupervisorLink, "type", lambda self, line: typed.append(line))
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


def test_a_command_that_took_a_minute_is_sent_to_the_background_next_time(app):
    from journal.features.long_runs.listeners.time_runs import TimeRuns
    timing = app.container.get(TimeRuns)
    clock = [1000.0]
    timing.now = lambda: clock[0]
    hook(app, "SessionStart")
    hook(app, "PreToolUse", tool_name="Bash", tool_input={"command": "pytest"})
    clock[0] += 90
    hook(app, "PostToolUse", tool_name="Bash", tool_input={"command": "pytest"}, tool_response="ok")
    body = hook(app, "PreToolUse", tool_name="Bash", tool_input={"command": "pytest"})[1]
    assert "pytest took 90s last time" in body["hookSpecificOutput"]["additionalContext"]
    assert "took" not in hook(app, "PreToolUse", tool_name="Bash", tool_input={"command": "pytest", "run_in_background": True})[1].get("hookSpecificOutput", {}).get("additionalContext", "")


def test_shop_talk_and_the_third_person_are_named(app, monkeypatch):
    typed = []
    from journal.supervisor_link import SupervisorLink
    monkeypatch.setattr(SupervisorLink, "type", lambda self, line: typed.append(line))
    hook(app, "SessionStart")
    hook(app, "MessageDisplay", message="I ran journal task start 3 because the user wants it.")
    app.runtime().deferred.drain()
    assert any("talks about the journal's commands" in t for t in typed) and any("say you, never the user" in t for t in typed)


def test_a_command_reports_every_row_it_caused(app):
    console = app.console()
    assert 'created: plan 1 "release"' in console.run(["plan", "create", "release"], USER).out
    assert 'created: task 1 "write the notes", link 1' in console.run(["plan", "add", "1", "write the notes"], USER).out


def test_the_skill_tool_loads_a_skill_too(skilled):
    app = skilled
    hook(app, "SessionStart")
    hook(app, "PostToolUse", tool_name="Skill", tool_input={"skill": "journal"}, tool_response="")
    assert app.container.get(Machine).current("s1").name == "idle"
    assert "journal skill" not in hook(app, "SessionStart")[1].get("hookSpecificOutput", {}).get("additionalContext", "")


def test_the_voice_is_said_at_start_and_a_change_is_typed_in(app, monkeypatch):
    typed = []
    from journal.supervisor_link import SupervisorLink
    monkeypatch.setattr(SupervisorLink, "type", lambda self, line: typed.append(line))
    console = app.console()
    console.run(["voice", "me", "--title", "Sir", "--name", "Example"], USER)
    text = hook(app, "SessionStart")[1]["hookSpecificOutput"]["additionalContext"]
    assert "Talk like a good butler" in text and 'Address me as "Sir Example"' in text
    console.run(["voice", "choose", "squire"], AGENT)
    assert typed and "changed how you talk" in typed[-1] and 'Address me as "my liege"' in typed[-1]
    assert "* squire" in console.run(["voice", "list"], USER).out


def test_a_message_left_while_the_agent_sits_at_its_prompt_is_typed_to_it(app, monkeypatch):
    typed = []
    from journal.supervisor_link import SupervisorLink
    monkeypatch.setattr(SupervisorLink, "type", lambda self, line: typed.append(line))
    app.console().run(["message", "send", "nobody is here yet"], USER)
    assert typed == [], "no live agent, nothing to type to"
    hook(app, "SessionStart")
    app.console().run(["message", "send", "are you there?"], USER)
    app.console().run(["message", "send", "hello?"], USER)
    assert typed == ["the user left message 2: are you there?. answer it before anything else, with [!reply:2] in your turn",
                     "the user left message 3: hello?. answer it before anything else, with [!reply:3] in your turn"]
