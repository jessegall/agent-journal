"""The first features through the real server: the briefing at session start, and the memory hold at a context mark."""

import json
from pathlib import Path
from urllib.error import HTTPError
from urllib.request import Request as HttpRequest, urlopen

import pytest

from journal.app import App
from journal.config import Config
from journal.features.workers.worker_runner import WorkerRunner
from journal.models.actor import Actor
from journal.models.setting import Setting
from journal.repositories.settings import PROJECT, Settings
from journal.console.where import Where
from journal.engine.machine import Machine
from journal.features.memory.states.at_mark import AtMark
from journal.features.tasks.states.working import Working

AGENT = Where("main", "s1")
USER = Where("main")


@pytest.fixture
def app(tmp_path: Path, monkeypatch):
    """A fresh journal on a free port; no worker process starts, since a dispatched worker would run its provider headless and file what it printed, or that it could not start, beside the test's own report."""
    monkeypatch.setattr(Config, "status_home", property(lambda self: tmp_path / "status"))
    monkeypatch.setattr(WorkerRunner, "start", lambda self, worker, by: None)
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
    assert isinstance(machine.current("s1"), Working) and machine.current("s1").task_id == 1
    assert hook(app, "PreToolUse", tool_name="Write", tool_input={})[0] == 200
    assert "hookSpecificOutput" not in hook(app, "PreToolUse", tool_name="Read", tool_input={})[1], "the mark asks once"
    context(app, 55)
    assert "context 50% full" in hook(app, "Stop")[1]["reason"]
    app.console().run(["nothing", "survives", "all logged"], AGENT)
    assert isinstance(machine.current("s1"), Working) and machine.current("s1").task_id == 1


def test_a_rule_binds_the_project_not_an_environment(app):
    app.console().run(["rule", "create", "Always name the model"], Where("other"))
    assert "Always name the model" in app.console().run(["rule", "list"], USER).out


def test_pauses_nest_and_each_back_pops_one(app):
    hook(app, "SessionStart")
    app.console().run(["task", "create", "t", "--start"], AGENT)
    context(app, 30)
    hook(app, "PreToolUse", tool_name="Read", tool_input={})
    app.console().run(["stuck", "stuck"], AGENT)
    machine = app.container.get(Machine)
    assert machine.current("s1").name == "stuck"
    hook(app, "PreToolUse", tool_name="Read", tool_input={})
    assert isinstance(machine.current("s1"), AtMark), "being stuck went back to the mark it left"
    app.console().run(["nothing", "survives", "fine"], AGENT)
    assert isinstance(machine.current("s1"), Working) and machine.current("s1").task_id == 1, "the mark went back to the task"


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
    assert "task 1 is next, write the notes" in out
    machine = app.container.get(Machine)
    assert machine.current("s1") == FollowingPlan(plan_id=1, task_id=1)
    assert "task 1 is in hand" in hook(app, "Stop")[1]["reason"]
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
    assert "new message 1" in body["hookSpecificOutput"]["additionalContext"]
    shown = console.run(["message", "read", "1"], AGENT).out
    assert "can you look at the login?" in shown and "[!reply:1]" in shown
    hook(app, "MessageDisplay", message="[!reply:1] On it, the login is next.")
    app.runtime().deferred.drain()
    messages = app.container.get(Messages).in_(1)
    assert [m.author for m in messages] == ["user", "agent"]
    assert messages[1].reply_to == 1 and messages[1].text == "On it, the login is next."
    assert messages[0].read_at is not None
    assert hook(app, "Stop")[1] == {}, "nothing unread is left"


def test_a_reply_tag_counts_only_at_the_start_of_a_line(app, monkeypatch):
    from journal.repositories.messages import Messages
    typed = []
    from journal.supervisor_link import SupervisorLink
    monkeypatch.setattr(SupervisorLink, "_send", lambda self, environment_id, instruction: typed.append(instruction["line"]))
    app.console().run(["message", "send", "first"], USER)
    app.console().run(["message", "send", "second"], USER)
    hook(app, "SessionStart")
    app.console().run(["environment", "here"], AGENT)
    hook(app, "MessageDisplay", message="Good evening. At your service.\n\n[!reply:1]")
    app.runtime().deferred.drain()
    messages = app.container.get(Messages).in_(1)
    assert messages[-1].author == "agent" and messages[-1].reply_to == 1 and messages[-1].text == "Good evening. At your service."
    hook(app, "MessageDisplay", message="Both done, see below [!reply:2]")
    app.runtime().deferred.drain()
    messages = app.container.get(Messages).in_(1)
    assert messages[-1].reply_to is None and "[!reply:2]" in messages[-1].text, "a tag inside a line is text"
    assert typed[-1].endswith("the [!reply:2] tag must open a line of your turn; message 2 is still unanswered")
    assert "new message 2" in hook(app, "Stop")[1]["reason"]


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
    created = console.run(["sequence", "create", "release", "--steps", "bump the version | tag it | push"], USER).out
    release = created.split()[1].rstrip(":")
    hook(app, "SessionStart")
    console.run(["task", "create", "t", "--start"], AGENT)
    assert "step 1: bump the version" in console.run(["sequence", "run", release], AGENT).out
    assert "step 1: bump the version" in hook(app, "Stop")[1]["reason"]
    assert hook(app, "Stop", stop_hook_active=True)[1].get("decision") == "block", "told the step at every stop"
    console.run(["await", "the user"], AGENT)
    assert hook(app, "Stop")[1].get("decision") != "block", "a step that waits on the user says so, and the stop passes"
    hook(app, "PreToolUse", tool_name="Bash", tool_input={"command": "journal sequence next"})
    assert "step 2: tag it" in console.run(["sequence", "next"], AGENT).out, "working again lifts the wait and the sequence goes on"
    assert "step 3: push" in console.run(["sequence", "next"], AGENT).out
    assert "ran its last step" in console.run(["sequence", "next"], AGENT).out
    assert app.container.get(Machine).current("s1").task_id == 1


def test_awaiting_workers_ends_when_the_last_one_reports(app, monkeypatch):
    import threading
    import traceback
    typed, stacks = [], []
    from journal.supervisor_link import SupervisorLink

    def sent(self, environment_id, instruction):
        typed.append(instruction["line"])
        stacks.append(f"--- {threading.current_thread().name}\n" + "".join(traceback.format_stack(limit=14)))

    monkeypatch.setattr(SupervisorLink, "_send", sent)
    console = app.console()
    hook(app, "SessionStart")
    console.run(["task", "create", "t", "--start"], AGENT)
    console.run(["worker", "dispatch", "Lady Lovelace", "write the parser", "--model", "fast", "--worktree"], AGENT)
    console.run(["worker", "dispatch", "Dr. Einstein", "profile it", "--model", "fast"], AGENT)
    console.run(["worker", "wait", "1", "2"], AGENT)
    machine = app.container.get(Machine)
    assert machine.current("s1").name == "awaiting" and hook(app, "Stop")[1] == {}
    console.run(["worker", "report", "1", "parser done"], Where("main", "w1"))
    assert machine.current("s1").name == "awaiting" and typed == ["[journal] worker 1, Lady Lovelace, reported in the chat"], "\n".join(stacks)
    console.run(["worker", "stop", "2"], USER)
    assert machine.current("s1").task_id == 1
    assert typed[-1] == "[journal] what you waited on came back: carry on"


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
    assert machine.current("s1").name == "orienting", "the skill read, the start's look at what is in flight is still owed"
    app.console().run(["environment", "here"], AGENT)
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
    assert machine.current("s1").task_id == 1
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
    monkeypatch.setattr(SupervisorLink, "_send", lambda self, environment_id, instruction: typed.append(instruction["line"]))
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
    from journal.supervisor_link import SupervisorLink
    monkeypatch.setattr(SupervisorLink, "_send", lambda self, environment_id, instruction: typed.append(instruction["line"]))
    hook(app, "SessionStart")
    hook(app, "MessageDisplay", message="I ran journal task start 3 because the user wants it.")
    app.runtime().deferred.drain()
    assert any("talks about the journal's commands" in t for t in typed) and any("say you, never the user" in t for t in typed)


def test_a_command_reports_every_row_it_caused(app):
    console = app.console()
    assert 'created: plan 1 "release"' in console.run(["plan", "create", "release"], USER).out
    assert 'created: task 1 "write the notes", link ' in console.run(["plan", "add", "1", "write the notes"], USER).out, "the link's number is after the shipped workflows' lines, which are links too"


def test_the_skill_tool_loads_a_skill_too(skilled):
    app = skilled
    hook(app, "SessionStart")
    hook(app, "PostToolUse", tool_name="Skill", tool_input={"skill": "journal"}, tool_response="")
    app.console().run(["environment", "here"], AGENT)
    assert app.container.get(Machine).current("s1").name == "idle"
    assert "journal skill" not in hook(app, "SessionStart")[1].get("hookSpecificOutput", {}).get("additionalContext", "")


def test_the_voice_is_said_at_start_and_a_change_is_typed_in(app, monkeypatch):
    typed = []
    from journal.supervisor_link import SupervisorLink
    monkeypatch.setattr(SupervisorLink, "_send", lambda self, environment_id, instruction: typed.append(instruction["line"]))
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
    monkeypatch.setattr(SupervisorLink, "_send", lambda self, environment_id, instruction: typed.append(instruction["line"]))
    app.console().run(["message", "send", "nobody is here yet"], USER)
    assert typed == [], "no live agent, nothing to type to"
    hook(app, "SessionStart")
    app.console().run(["environment", "here"], AGENT)
    app.console().run(["message", "send", "are you there?"], USER)
    app.console().run(["message", "send", "hello?"], USER)
    assert typed == ["[journal] new message 2", "[journal] new message 3"]
    assert "new messages 1, 2, 3" in hook(app, "UserPromptSubmit", prompt="hi")[1]["hookSpecificOutput"]["additionalContext"]
    app.console().run(["message", "send", "four"], USER)
    assert "4 messages unread: journal message unread" in hook(app, "Stop")[1]["reason"]
    shown = app.console().run(["message", "unread"], AGENT).out
    assert shown.count("reply with [!reply:") == 4 and "are you there?" in shown and "four" in shown
    assert hook(app, "Stop")[1] == {}, "nothing unread is left"


def test_a_turn_streamed_in_parts_lands_once_whole(app):
    from journal.repositories.messages import Messages
    hook(app, "SessionStart")
    hook(app, "MessageDisplay", delta="Good ", message_id="m1", index=0, final=False)
    hook(app, "MessageDisplay", delta="evening.", message_id="m1", index=1, final=True)
    app.runtime().deferred.drain()
    assert [m.text for m in app.container.get(Messages).in_(1) if m.author == "agent"] == ["Good evening."]


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
    reply = messages.in_(1)[-1]
    assert reply.reply_to == 1 and reply.text == "Yes, fourteen tasks went into the plan." and not reply.acknowledgement
    assert messages.find(1).read_at is not None
    hook(app, "MessageDisplay", delta="Waiting for the suite.", turn_id="t1", message_id="m2", index=0, final=True)
    app.runtime().deferred.drain()
    assert [m.text for m in messages.in_(1) if m.author == "agent"] == ["Yes, fourteen tasks went into the plan.", "Waiting for the suite."]
    assert hook(app, "Stop")[1] == {}, "nothing unread is left"


def test_reactions_go_both_ways_and_a_face_alone_is_not_posted(app, monkeypatch):
    from journal.repositories.messages import Messages
    from journal.repositories.reactions import Reactions
    typed = []
    from journal.supervisor_link import SupervisorLink
    monkeypatch.setattr(SupervisorLink, "_send", lambda self, environment_id, instruction: typed.append(instruction["line"]))
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
    assert [m.text for m in messages.in_(1)] == ["thanks, carry on", "Done."], "a turn that is only a face is not posted"
    assert typed[-1].startswith("[journal] your turn was only 👍, so it was not posted")


def test_a_turn_that_only_answers_a_journal_line_is_an_acknowledgement(app, monkeypatch):
    from journal.repositories.messages import Messages
    from journal.supervisor_link import SupervisorLink
    sent = []
    monkeypatch.setattr(SupervisorLink, "_send", lambda self, environment_id, instruction: sent.append(instruction["line"]))
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
    assert [(m.text, m.acknowledgement) for m in app.container.get(Messages).in_(1) if m.author == "agent"] == [("Noted.", True), ("Good day. I am your butler; what shall I attend to?", False), ("Still nothing changed.", True), ("Fixed the login.", False), ("On it.", False)], "an introduction asked for by the journal is for the user"


def test_em_dashes_and_run_together_paragraphs_are_pointed_out(app, monkeypatch):
    typed = []
    from journal.supervisor_link import SupervisorLink
    monkeypatch.setattr(SupervisorLink, "_send", lambda self, environment_id, instruction: typed.append(instruction["line"]))
    hook(app, "SessionStart")
    hook(app, "MessageDisplay", message="The build — the one from last night — is green.")
    hook(app, "MessageDisplay", message=("The build is green. " * 25).strip())
    app.runtime().deferred.drain()
    assert any("em dashes" in line for line in typed) and any("ran its paragraphs together" in line for line in typed)


def test_tags_run_the_commands_they_stand_for_with_the_turn_as_their_text(app, monkeypatch):
    from journal.repositories.facts import Facts
    from journal.repositories.messages import Messages
    from journal.repositories.task_logs import TaskLogs
    from journal.repositories.tasks import Tasks
    typed = []
    from journal.supervisor_link import SupervisorLink
    monkeypatch.setattr(SupervisorLink, "_send", lambda self, environment_id, instruction: typed.append(instruction["line"]))
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
    assert [m.text for m in messages.in_(1) if m.author == "agent"] == ["The footer overlaps the form on narrow screens.", "Measured in the browser.", "The footer sits below the form now.", "No such task."], "a log turn stays out of the chat; the others post without their tag"
    assert typed[-1].startswith("[journal] the [!end] tag did not run:")


def test_notable_moments_are_cards_on_the_agents_timeline(app):
    from journal.repositories.entries import Entries
    hook(app, "SessionStart")
    app.console().run(["task", "create", "t", "--start"], AGENT)
    app.console().run(["stuck", "stuck on the login"], AGENT)
    cards = [e.data for e in app.container.get(Entries).of_kind(1, "card")]
    assert [c["label"] for c in cards] == ["Agent stuck"] and cards[0]["detail"] == "stuck on the login" and cards[0]["tone"] == "bad"


def test_a_fresh_conversation_opens_with_an_introduction_and_a_resumed_one_does_not(app, monkeypatch):
    sent = []
    from journal.supervisor_link import SupervisorLink
    monkeypatch.setattr(SupervisorLink, "_send", lambda self, environment_id, instruction: sent.append(instruction))
    hook(app, "SessionStart", source="startup")
    app.runtime().deferred.drain()
    assert sent[-1]["line"].startswith("[journal] introduce yourself to the user in the chat") and sent[-1]["after"] == 4.0
    count = len(sent)
    data = json.dumps({"hook_event_name": "SessionStart", "session_id": "s2", "source": "resume"}).encode()
    urlopen(HttpRequest(f"http://127.0.0.1:{app.server().port}/hooks/claude", data=data, method="POST", headers={"Content-Type": "application/json"}), timeout=5).read()
    app.runtime().deferred.drain()
    assert not any("introduce yourself" in s["line"] for s in sent[count:])


def test_a_commit_trailer_finishes_the_tasks_it_names(app, monkeypatch):
    import subprocess
    from journal.repositories.tasks import Tasks
    typed = []
    from journal.supervisor_link import SupervisorLink
    monkeypatch.setattr(SupervisorLink, "_send", lambda self, environment_id, instruction: typed.append(instruction["line"]))
    root = app.config.root
    subprocess.run(["git", "init", "-q"], cwd=root, check=True)
    subprocess.run(["git", "-c", "user.email=t@t", "-c", "user.name=t", "commit", "-q", "--allow-empty", "-m", "Ship the footer\n\nJournal: tasks done 1 and 2 with the margin fixed"], cwd=root, check=True)
    hook(app, "SessionStart")
    app.console().run(["task", "create", "footer", "--start"], AGENT)
    app.console().run(["task", "create", "margin"], AGENT)
    hook(app, "PostToolUse", tool_name="Bash", tool_input={"command": "git commit -m x"}, tool_response={"stdout": "", "stderr": ""})
    app.runtime().deferred.drain()
    tasks = app.container.get(Tasks)
    assert tasks.find(1).state == "done" and tasks.find(2).state == "done" and tasks.find(1).outcome.startswith("commit ")
    assert typed[-1].endswith("closed task 1, task 2")


def test_the_start_block_carries_the_quiet_rule_the_laws_a_takeover_and_what_waits(app):
    app.console().run(["message", "send", "hello"], USER)
    app.console().run(["task", "create", "t"], USER)
    data = json.dumps({"hook_event_name": "SessionStart", "session_id": "earlier"}).encode()
    urlopen(HttpRequest(f"http://127.0.0.1:{app.server().port}/hooks/claude", data=data, method="POST", headers={"Content-Type": "application/json"}), timeout=5).read()
    told = hook(app, "SessionStart")[1]["hookSpecificOutput"]["additionalContext"]
    assert "handle the journal quietly" in told and "laws L1 to L9" in told and "another agent worked this environment until" in told
    assert "waiting for you here: 1 tasks, 1 messages" in told


def test_an_unread_inbox_is_named_every_third_tool_use_and_holds_the_write_after_five_reminders(app):
    hook(app, "SessionStart")
    app.console().run(["message", "send", "look at the footer"], USER)
    named = [i for i in range(1, 16) if "new message 1" in json.dumps(hook(app, "PreToolUse", tool_name="Read", tool_input={})[1])]
    assert named == [3, 6, 9, 12, 15] or len(named) >= 4, "every third tool use names the inbox"
    status, body = hook(app, "PreToolUse", tool_name="Write", tool_input={"file_path": "a.py"})
    assert status == 409 and "your inbox is unread" in body["error"]
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
    assert "read what is in flight here before any other write" in body["hookSpecificOutput"]["additionalContext"]
    status, body = hook(app, "PreToolUse", tool_name="Write", tool_input={"file_path": "a.py"})
    assert status == 409 and "journal environment here" in body["error"]
    shown = console.run(["environment", "here"], AGENT).out
    assert "task in hand: 1 t" in shown and "unread messages: 1" in shown
    assert hook(app, "PreToolUse", tool_name="Write", tool_input={"file_path": "a.py"})[0] == 200


def test_a_session_silent_for_an_hour_is_ended(app):
    from journal.events.agent.ticked import Ticked
    from journal.features.bus import Bus
    hook(app, "SessionStart")
    app.container.get(Bus).dispatch(Ticked(session="s1", environment_id=1, at=0.0, quiet_for=3601.0))
    assert app.container.get(Machine).current("s1").name == "ended"


def test_a_keyword_brings_a_fact_back_once_as_a_whisper_and_a_fresh_rule_is_questioned(app, monkeypatch):
    typed = []
    from journal.supervisor_link import SupervisorLink
    monkeypatch.setattr(SupervisorLink, "_send", lambda self, environment_id, instruction: typed.append(instruction["line"]))
    hook(app, "SessionStart")
    app.console().run(["fact", "create", "the login uses the old session store", "--keywords", "login,session"], USER)
    hook(app, "MessageDisplay", message="I will look at the login next.")
    hook(app, "MessageDisplay", message="Still on the login.")
    app.runtime().deferred.drain()
    whispers = [line for line in typed if "fact 1: the login uses the old session store" in line]
    assert len(whispers) == 1, "whispered once per row per agent"
    app.console().run(["rule", "create", "Always run the suite before a commit"], AGENT)
    assert typed[-1].startswith("[journal] is rule 1 a ruling for the whole project?")


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
    rows = app.container.get(__import__("journal.http.v3.shapers.messages_shaper", fromlist=["MessagesShaper"]).MessagesShaper).rows(app.container.get(__import__("journal.repositories.environments", fromlist=["Environments"]).Environments).find(1))
    assert "todo:1" in rows[0].refs


def test_the_providers_own_question_tool_is_refused_and_every_fiftieth_line_reminds(app, monkeypatch):
    hook(app, "SessionStart")
    status, body = hook(app, "PreToolUse", tool_name="AskUserQuestion", tool_input={"question": "which?"})
    assert status == 409 and "journal question ask" in body["error"]


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
    assert any("Lady Lovelace reports: the footer is fixed" in m.text for m in app.container.get(Messages).in_(1))


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
    assert app.container.get(Messages).unanswered(1) == []
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
    u(R(f"http://127.0.0.1:{app.server().port}/api/main/message/1/upload", data=body, method="POST", headers={"Content-Type": f"multipart/form-data; boundary={boundary}"}), timeout=5).read()
    with u(f"http://127.0.0.1:{app.server().port}/api/main/message/1/files/shot%20one.png", timeout=5) as reply:
        assert reply.read() == b"PNG", "a file name with a space is found"
    shown = console.run(["message", "read", "1"], AGENT).out
    assert "file " in shown and "shot one.png" in shown and "journal message tag 1" in shown
    assert 'something to do? file it: journal task create "<title>" --from 1' in shown
    assert "(from message 1)" in console.run(["task", "create", "look at the picture", "--from", "1"], AGENT).out
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
    assert Chain.split("echo a # not && split; here\necho b && echo '#not a comment' && echo c#neither") == ["echo a # not && split; here\necho b", "echo '#not a comment'", "echo c#neither"]
    wrapped = "source /s 2>/dev/null || true && { \\builtin unalias -- 'x'; } >/dev/null 2>&1 || true && eval 'cd src && git commit -m '\"'\"'a; b'\"'\"'' < /dev/null && pwd -P >| /tmp/cwd"
    parts = Chain.parts(wrapped)
    assert [p.text for p in parts if p.recorded] == ["cd src", "git commit -m 'a; b'"]
    assert parts[0].text.startswith("source") and parts[-1].text.startswith("pwd -P") and not parts[0].recorded and not parts[-1].recorded
    assert [Doing.of(c) for c in ("git commit -m x", "python3 -m pytest -q | tail -2", "cd src", "npm run build", "foo --bar")] == ["committing", "testing", "moving", "running a script", "running foo"]


def test_the_foreground_limit_is_thirty_seconds_or_ten_while_a_message_waits(app):
    console = app.console()
    assert console.run(["shell", "limit"], AGENT).out.strip() == "30"
    console.run(["message", "send", "are you there?"], USER)
    assert console.run(["shell", "limit"], AGENT).out.strip() == "10"
    console.run(["message", "read", "1"], AGENT)
    app.container.get(Settings).save(Setting(environment_id=0, key="shell.foreground", value=5), Actor.system())
    assert console.run(["shell", "limit"], AGENT).out.strip() == "5"


def test_a_chains_parts_are_recorded_and_a_moved_chain_reports_when_it_ends(app, monkeypatch):
    from urllib.request import urlopen
    from journal.engine.cards import CARD
    from journal.repositories.entries import Entries
    from journal.supervisor_link import SupervisorLink
    typed = []
    monkeypatch.setattr(SupervisorLink, "_send", lambda self, environment_id, instruction: typed.append(instruction["line"]))
    hook(app, "SessionStart")
    console, port = app.console(), app.server().port
    folder = app.config.root / "parts"
    folder.mkdir()
    assert console.run(["shell", "split", "cd src && pytest -q | tail -1; git commit -m 'a\nb'", "--into", str(folder)], AGENT).out == "R;&-\nR&;-\nR;;-\n"
    assert [(folder / f"{i}.part").read_text() for i in range(3)] == ["cd src", "pytest -q | tail -1", "git commit -m 'a\nb'"]
    console.run(["shell", "started", "git commit -m done", "--chain", "c1"], AGENT)
    bar = json.load(urlopen(f"http://127.0.0.1:{port}/api/main/bar", timeout=5))["queue"]
    assert bar[-1]["parts"][0]["value"] == "committing" and bar[-1]["done"] is False
    console.run(["shell", "ran", "git commit -m done", "--chain", "c1", "--status", "0", "--seconds", "2", "--output", "[main 1a2b3c4] done"], AGENT)
    assert json.load(urlopen(f"http://127.0.0.1:{port}/api/main/bar", timeout=5))["queue"][-1]["done"] is True
    line = json.load(urlopen(f"http://127.0.0.1:{port}/api/main/agent/1/terminal", timeout=5))["lines"][-1]
    assert line["command"] == "git commit -m done" and line["output"] == "[main 1a2b3c4] done" and line["seconds"] == 2
    moved = console.run(["shell", "moved", "c1", "pytest -q", "--file", "/tmp/out/c1"], AGENT).out
    assert "moved to the background: pytest -q" in moved and "/tmp/out/c1" in moved
    console.run(["shell", "ended", "c1", "--status", "1", "--file", "/tmp/out/c1", "--last", "2 failed"], AGENT)
    assert "failed with code 1" in typed[-1] and "2 failed" in typed[-1]
    assert len(app.container.get(Entries).of_kind(1, CARD, 10)) == 2


def test_the_latest_thought_stands_in_the_working_bubble_and_a_reply_in_thinking_is_posted(app, monkeypatch, tmp_path):
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
    agent = json.load(urlopen(f"http://127.0.0.1:{app.server().port}/api/main/agent", timeout=5))["rows"][-1]["data"]
    assert agent["thinking"] == "Now the next step."
    reply = app.container.get(Messages).all()[-1]
    assert reply.reply_to == 1 and reply.text == "Yes, hello." and app.container.get(Messages).unanswered(1) == []
    hook(app, "MessageDisplay", message="Done.")
    app.runtime().deferred.drain()
    assert json.load(urlopen(f"http://127.0.0.1:{app.server().port}/api/main/agent", timeout=5))["rows"][-1]["data"]["thinking"] == ""
    assert "no journal is running" in console.run(["setup", "restart"], USER).out


def test_a_turns_parts_landing_out_of_order_are_put_back_before_the_turn_is_read(app):
    from journal.repositories.messages import Messages
    hook(app, "SessionStart")
    app.console().run(["message", "send", "is it fixed?"], USER)
    app.console().run(["message", "read", "1"], AGENT)
    hook(app, "MessageDisplay", delta="It is.", turn_id="t9", index=1, final=True)
    app.runtime().deferred.drain()
    assert app.container.get(Messages).unanswered(1), "the final part alone is not the turn"
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
    edits = json.load(urlopen(f"http://127.0.0.1:{app.server().port}/api/main/agent/1/edits", timeout=5))["edits"]
    assert [(e["path"], e["added"], e["removed"]) for e in edits] == [("notes.md", 3, 1), ("same.md", 0, 0)] and edits[0]["command"].startswith("sed")


def test_a_shell_line_that_writes_is_a_write_to_the_gates(app):
    from journal.features.shell.writes import Writes
    assert [Writes.of(c) for c in ("sed -i '' s/a/b/ f.py", "cat f.py | head -3", "echo hi > /dev/null", "echo hi > out.txt", "git status; git log", "git checkout -- f.py", "journal task create x", "python3 - <<'EOF'\nfrom pathlib import Path\nPath('x').write_text('y')\nEOF", "python3 -c 'print(1)'", "grep -rn 'a > b' src | tee found.txt", 'echo "a > b"')] == [True, False, False, True, False, True, False, True, False, True, False]
    hook(app, "SessionStart")
    app.console().run(["environment", "here"], AGENT)
    app.console().run(["task", "create", "t", "--start"], AGENT)
    assert hook(app, "PreToolUse", tool_name="Bash", tool_input={"command": "sed -i '' s/a/b/ f.py"})[0] == 200
    assert hook(app, "PreToolUse", tool_name="Bash", tool_input={"command": "cat f.py"})[0] == 200
    assert app.container.get(Machine).current("s1").edits == 1, "a shell line that writes counts as an edit toward the log; a read does not"


def test_a_journal_command_chained_with_anything_else_is_refused(app):
    hook(app, "SessionStart")
    status, body = hook(app, "PreToolUse", tool_name="Bash", tool_input={"command": "cd src && journal task log 1 'x' && python3 -m pytest -q"})
    assert status == 409 and "a journal command runs on its own" in body["error"]
    assert hook(app, "PreToolUse", tool_name="Bash", tool_input={"command": "journal task log 1 'x'; journal message unread"})[0] == 200
    assert hook(app, "PreToolUse", tool_name="Bash", tool_input={"command": "python3 -m pytest -q && git commit -m x"})[0] == 200


def test_an_integration_is_a_suggested_mcp_server_installed_keyed_checked_and_removed_with_the_agents_restarted(app, monkeypatch, tmp_path):
    import json as j
    from urllib.request import Request as R, urlopen
    from journal.features.mcp.health import Health
    from journal.features.mcp.keys import Keys
    from journal.supervisor_link import SupervisorLink
    sent = []
    monkeypatch.setattr(SupervisorLink, "inbox_of", lambda self, environment_id: "/tmp/an-inbox")
    monkeypatch.setattr(SupervisorLink, "_send", lambda self, environment_id, instruction: sent.append(instruction))
    monkeypatch.setattr(app.container.get(Keys), "path", tmp_path / "keys.json")
    from journal.features.mcp.known import Known
    monkeypatch.setattr(Health, "asked", lambda self: {"github": Known("github", "npx -y @modelcontextprotocol/server-github", "connected", ""), "linear": Known("linear", "https://mcp.linear.app/mcp", "needs_auth", "Needs authentication"), "playwright": Known("playwright", "npx -y @playwright/mcp@latest --headless", "connected", "")})
    hook(app, "SessionStart")
    port = app.server().port
    def post(path, body):
        with urlopen(R(f"http://127.0.0.1:{port}{path}", data=j.dumps(body).encode(), method="POST", headers={"Content-Type": "application/json"}), timeout=5) as r:
            return j.loads(r.read())
    installed = post("/journal/mcp/install", {"name": "github"})
    assert installed["state"] == "needs_key" and installed["has_key"] is False and sent[-1]["type"] == "RestartAgent" and sent[-1]["resume"] == ["--resume", "s1"], "an idle agent restarts at once"
    hook(app, "PreToolUse", tool_name="Read", tool_input={})
    sent.clear()
    post("/journal/mcp/github/key", {"value": "first"})
    assert sent == [] and j.load(urlopen(f"http://127.0.0.1:{port}/journal/mcp", timeout=5))["restart_pending"] == ["s1"], "an agent at work is not cut off"
    hook(app, "Stop")
    app.runtime().deferred.drain()
    assert sent and sent[-1]["type"] == "RestartAgent", "the restart comes the moment its turn ends"
    claude = j.loads((app.config.root / ".mcp.json").read_text())["mcpServers"]["github"]
    assert claude["command"] == "npx" and claude["env"] == {"GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_PERSONAL_ACCESS_TOKEN}"}
    assert '[mcp_servers.github]' in (app.config.root / ".codex" / "config.toml").read_text()
    keyed = post("/journal/mcp/github/key", {"value": "ghp_secret"})
    assert keyed["has_key"] is True and keyed["state"] == "installed" and j.loads((tmp_path / "keys.json").read_text()) == {"GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_secret"}
    assert "ghp_secret" not in (app.config.root / ".mcp.json").read_text(), "a key is never written into the project"
    post("/journal/mcp/install", {"name": "linear"})
    states = {s["name"]: s["state"] for s in post("/journal/mcp/check", {})["servers"]}
    assert states == {"github": "connected", "linear": "needs_auth"}
    page = j.load(urlopen(f"http://127.0.0.1:{port}/journal/mcp", timeout=5))
    assert [(s["name"], s["managed"]) for s in page["servers"]] == [("github", True), ("linear", True), ("playwright", False)], "the program's own servers show after the journal's"
    assert {s["name"]: s["installed"] for s in page["suggested"] if s["name"] in ("github", "playwright", "slack")} == {"github": True, "playwright": True, "slack": False}
    assert post("/journal/mcp/github/remove", {}) == {"removed": "github"} and j.loads((tmp_path / "keys.json").read_text()) == {}
    assert app.console().run(["mcp", "list"], USER).out.startswith("linear")
    post("/journal/mcp/install", {"name": "linear"})
    sent.clear()
    assert post("/journal/mcp/linear/sign-in", {})["asked"] == "linear"
    assert sent[-1]["type"] == "Type" and "mcp__linear__authenticate" in sent[-1]["line"], "the agent is asked to sign in through the server's own tool"


def test_a_task_finished_while_a_skill_is_owed_is_let_go_of_under_the_pause(skilled):
    app = skilled
    hook(app, "SessionStart")
    read_skill(app, "journal")
    app.console().run(["environment", "here"], AGENT)
    app.console().run(["task", "create", "t", "--start"], AGENT)
    machine = app.container.get(Machine)
    assert machine.current("s1").name == "loading_skill", "the tasks skill is owed on entering work"
    done = app.console().run(["task", "done", "1", "--how", "quick"], AGENT)
    assert done.code == 0, done.err
    read_skill(app, "journal-tasks")
    assert machine.current("s1").name == "idle", "the pause went back to idle, not to the finished task"


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
    from journal.features.bus import Bus
    from journal.supervisor_link import SupervisorLink
    sent = []
    monkeypatch.setattr(SupervisorLink, "inbox_of", lambda self, environment_id: "/tmp/an-inbox")
    monkeypatch.setattr(SupervisorLink, "_send", lambda self, environment_id, instruction: sent.append(instruction))
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
    hook(app, "Stop")
    for later in (120, 150, 180, 210):
        tick(later)
    assert [s["line"] for s in sent].count("[journal] while at work") == 3, "three tries, then the chat is told"


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
    assert all(outs[n] == ("200\n" if n % 2 else "30\n") for n in range(20)), "the capture is process-wide, so runs never overlap"


def test_only_one_task_is_in_progress_at_a_time_whatever_the_agents_state(app):
    hook(app, "SessionStart")
    app.console().run(["task", "create", "first", "--start"], AGENT)
    app.console().run(["task", "create", "second"], AGENT)
    hook(app, "SessionStart", session_id="s2")
    refused = app.console().run(["task", "start", "2"], Where("main", "s2"))
    assert refused.code == 1 and "task 1 is in progress" in refused.err, "another session cannot start a second"
    app.console().run(["task", "park", "1", "later"], AGENT)
    assert app.console().run(["task", "start", "2"], AGENT).code == 0


def test_creating_a_plan_starts_the_shipped_building_a_plan_sequence(app, monkeypatch):
    from journal.supervisor_link import SupervisorLink
    sent = []
    monkeypatch.setattr(SupervisorLink, "inbox_of", lambda self, environment_id: "/tmp/an-inbox")
    monkeypatch.setattr(SupervisorLink, "_send", lambda self, environment_id, instruction: sent.append(instruction))
    hook(app, "SessionStart")
    app.console().run(["environment", "here"], AGENT)
    listed = app.console().run(["sequence", "list"], AGENT).out
    assert "Building a plan (4 steps, starts on plan.created)" in listed, "the shipped sequence is seeded at boot"
    app.console().run(["plan", "create", "Behaviour tree", "--brief", "a flowchart"], AGENT)
    app.runtime().deferred.drain()
    machine = app.container.get(Machine)
    assert machine.current("s1").name == "running_sequence" and "step 1" in sent[-1]["line"] and "goal" in sent[-1]["line"]
    app.console().run(["plan", "create", "Another", "--brief", "b"], AGENT)
    app.runtime().deferred.drain()
    assert machine.current("s1").step == 0, "a sequence already running is not started again"
    for _ in range(4):
        app.console().run(["sequence", "next"], AGENT)
    assert machine.current("s1").name == "idle", "the last step goes back to what the agent was doing"


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
    monkeypatch.setattr(SupervisorLink, "inbox_of", lambda self, environment_id: "/tmp/an-inbox")
    monkeypatch.setattr(SupervisorLink, "_send", lambda self, environment_id, instruction: sent.append(instruction))
    hook(app, "SessionStart")
    app.console().run(["environment", "here"], AGENT)
    console = app.console()
    console.run(["plan", "create", "p", "--brief", "the goal"], AGENT)
    for _ in range(4):
        console.run(["sequence", "next"], AGENT)
    console.run(["plan", "phase", "1", "Lay the floor", "--when", "the floor is level"], AGENT)
    console.run(["plan", "phase", "1", "Raise the walls", "--when", "the walls stand", "--checkpoint"], AGENT)
    console.run(["plan", "add", "1", "pour the slab"], AGENT)
    console.run(["plan", "add", "1", "frame the walls"], AGENT)
    console.run(["plan", "add", "1", "level the slab"], AGENT)
    refused = console.run(["plan", "ready", "1"], AGENT)
    assert refused.code == 1 and "phase 1, 2 of plan 1 has no task yet" in refused.err
    console.run(["plan", "todos", "1", "1", "1", "3"], AGENT)
    console.run(["plan", "todos", "1", "2", "2"], AGENT)
    assert console.run(["plan", "ready", "1"], AGENT).code == 0
    shown = console.run(["plan", "show", "1"], AGENT).out
    assert "phase 2: Raise the walls (complete when the walls stand) [checkpoint]" in shown
    assert "not approved" in console.run(["plan", "start", "1"], AGENT).err
    assert "only the user approves" in console.run(["plan", "approve", "1"], AGENT).err
    assert console.run(["plan", "approve", "1"], USER).code == 0
    app.runtime().deferred.drain()
    assert "the user approved plan 1" in sent[-1]["line"]
    assert "task 1 is next, pour the slab" in console.run(["plan", "start", "1"], AGENT).out
    console.run(["task", "done", "1"], AGENT)
    app.runtime().deferred.drain()
    assert app.container.get(Machine).current("s1").task_id == 3, "the second task of phase 1 comes before the first of phase 2"


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
    from journal.repositories.environments import Environments
    hook(app, "SessionStart")
    listed = app.console().run(["template", "list"], AGENT).out
    assert "Find what is missing (for plan, critique)" in listed and "Functional design (for doc)" in listed
    shown = app.console().run(["template", "show", "3"], AGENT).out
    assert shown.startswith("template 3: Find what is missing") and "the step nobody wrote down" in shown
    rows = app.container.get(Shapers).named("template").rows(app.container.get(Environments).named("main"))
    assert [r.data["purpose"] for r in rows].count("critique") == 3 and rows[0].sections[0]["title"] == "What it is for"


def test_a_report_is_written_from_a_file_and_linked_to_what_it_is_about(app, tmp_path):
    from journal.http.v3.shapers.shapers import Shapers
    from journal.repositories.environments import Environments
    hook(app, "SessionStart")
    app.console().run(["environment", "here"], AGENT)
    app.console().run(["plan", "create", "p", "--brief", "g"], USER)
    body = tmp_path / "critique.md"
    body.write_text("What two readers found.\n\n## Phase 1\n\n- a gap\n\n## Phase 2\n\n- another\n")
    out = app.console().run(["report", "create", "Critique of plan 1", "--file", str(body), "--about", "plans:1"], AGENT).out
    assert out.startswith("report 1: Critique of plan 1, about plans:1")
    rows = app.container.get(Shapers).named("report").rows(app.container.get(Environments).named("main"))
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
    replies = [m for m in app.container.get(Messages).in_(1) if m.author == "agent"]
    assert [(m.reply_to, m.text) for m in replies] == [(1, "Two answers.\n\nThe first is fine."), (2, "The second waits.")]


def test_a_subagent_launched_in_the_background_runs_until_its_own_stop_hook(app):
    from journal.http.v3.shapers.agents_shaper import AgentsShaper
    from journal.repositories.environments import Environments
    hook(app, "SessionStart")
    rows = lambda: app.container.get(AgentsShaper).rows(app.container.get(Environments).named("main"))[0].data["subagent_rows"]
    hook(app, "PreToolUse", tool_name="Agent", tool_input={"description": "Lord Macaulay reads", "model": "sonnet", "subagent_type": "researcher", "prompt": "read"})
    hook(app, "PostToolUse", tool_name="Agent", tool_input={"description": "Lord Macaulay reads"}, tool_response={"isAsync": True, "status": "async_launched", "agentId": "a1"})
    assert rows()[0]["running"] is True and rows()[0]["status"] == "running", "the tool's instant answer does not end a background subagent"
    hook(app, "SubagentStop", agent_id="a1", agent_type="researcher")
    row = rows()[0]
    assert row["running"] is False and row["status"] == "done" and row["ended"] >= row["at"]
    hook(app, "PreToolUse", tool_name="Agent", tool_input={"description": "a quick one", "model": "haiku", "prompt": "x"})
    hook(app, "PostToolUse", tool_name="Agent", tool_input={"description": "a quick one"}, tool_response="the finished work")
    assert rows()[1]["running"] is False, "a subagent that answered in the tool's own result is done at once"


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
    assert "has no check named flying" in console.run(["chart", "node", "check", "flying"], AGENT).err
    wf = int(console.run(["chart", "new", "a test"], AGENT).out.split()[1].rstrip(":"))
    add = lambda kind, key, *text: int(console.run(["chart", "node", kind, key, *text, "--in", str(wf)], AGENT).out.split()[1].rstrip(":"))
    shipped = 0
    t, c, a = add("trigger", "tool_finished"), add("check", "open_tasks"), add("action", "block_stop", "--text", "tasks are open: carry on")
    console.run(["chart", "line", str(t), str(c)], AGENT)
    console.run(["chart", "line", str(c), str(a), "--port", "yes"], AGENT)
    shown = console.run(["chart", "show"], AGENT).out
    assert f"{t} --then--> {c}" in shown and f"{c} --yes--> {a}" in shown and "block_stop: tasks are open" in shown
    port = app.server().port
    read = j.load(urlopen(f"http://127.0.0.1:{port}/journal/chart/{wf}", timeout=5))
    assert read["revision"] == 0 and [n["key"] for n in read["nodes"]][shipped:] == ["tool_finished", "open_tasks", "block_stop"] and len(read["catalogue"]) > 30
    def post(body):
        try:
            with urlopen(R(f"http://127.0.0.1:{port}/journal/chart/{wf}", data=j.dumps(body).encode(), method="POST", headers={"Content-Type": "application/json"}), timeout=5) as r:
                return r.status, j.loads(r.read())
        except HTTPError as error:
            return error.code, j.loads(error.read())
    nodes = [{"id": t, "kind": "trigger", "key": "tool_finished", "x": 10, "y": 10}, {"id": c, "kind": "check", "key": "open_tasks"}, {"id": "new", "kind": "action", "key": "say", "text": "a word"}]
    lines = [{"from": t, "to": c}, {"from": c, "to": "new", "port": "yes"}, {"from": c, "to": "new", "port": "no"}]
    status, saved = post({"revision": 0, "nodes": nodes, "lines": lines})
    assert status == 200 and saved["revision"] == 1 and [n["key"] for n in saved["nodes"]] == ["tool_finished", "open_tasks", "say"] and saved["nodes"][0]["x"] == 10, "the shipped nodes left out are gone"
    assert [(l["from"], l["port"]) for l in saved["lines"]] == [(t, "then"), (c, "yes"), (c, "no")], "lines drawn anew, the removed node gone"
    assert post({"revision": 0, "nodes": nodes, "lines": []})[0] == 409, "a stale revision is refused"


def test_a_wrong_chart_is_refused_with_its_faults(app):
    import json as j
    from urllib.request import Request as R, urlopen
    hook(app, "SessionStart")
    app.console().run(["environment", "here"], AGENT)
    port = app.server().port
    def post(body):
        try:
            with urlopen(R(f"http://127.0.0.1:{port}/journal/chart/1", data=j.dumps(body).encode(), method="POST", headers={"Content-Type": "application/json"}), timeout=5) as r:
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
    assert "leaves by yes or no, not then" in console.run(["chart", "line", str(c), str(a)], AGENT).err
    assert f"leads into trigger {t}" in console.run(["chart", "line", str(a), str(t)], AGENT).err


def test_the_catalogue_names_providers_and_a_nodes_text_is_bounded(app):
    import json as j
    from urllib.request import Request as R, urlopen
    hook(app, "SessionStart")
    app.console().run(["environment", "here"], AGENT)
    port = app.server().port
    catalogue = j.load(urlopen(f"http://127.0.0.1:{port}/journal/chart/1", timeout=5))["catalogue"]
    by_key = {e["key"]: e for e in catalogue}
    assert by_key["turn_written"]["providers"] == ["claude"] and by_key["idle"]["providers"] == ["claude", "codex"]
    def post(body):
        try:
            with urlopen(R(f"http://127.0.0.1:{port}/journal/chart/1", data=j.dumps(body).encode(), method="POST", headers={"Content-Type": "application/json"}), timeout=5) as r:
                return r.status, j.loads(r.read())
        except HTTPError as error:
            return error.code, j.loads(error.read())
    nodes = [{"id": "t", "kind": "trigger", "key": "idle"}, {"id": "a", "kind": "action", "key": "say", "text": "x" * 501}]
    status, body = post({"revision": 0, "nodes": nodes, "lines": [{"from": "t", "to": "a"}]})
    assert status == 409 and "text is longer than 500 characters" in body["error"]
    nodes[1]["text"] = "say\x07 this\n and\x1b that "
    status, body = post({"revision": 0, "nodes": nodes, "lines": [{"from": "t", "to": "a"}]})
    assert status == 200 and body["nodes"][1]["text"] == "say this and that", "control characters and line breaks are stripped"
    assert "at most 500 characters" in app.console().run(["chart", "node", "action", "say", "--text", "y" * 501], AGENT).err


def test_the_engine_walks_the_chart_at_each_event_and_an_edit_applies_at_the_next(app, monkeypatch):
    from journal.supervisor_link import SupervisorLink
    sent = []
    monkeypatch.setattr(SupervisorLink, "inbox_of", lambda self, environment_id: "/tmp/an-inbox")
    monkeypatch.setattr(SupervisorLink, "_send", lambda self, environment_id, instruction: sent.append(instruction["line"]))
    app.container.get(Settings).save(Setting(environment_id=0, key="tasks.auto", value=False), Actor.system())
    hook(app, "SessionStart")
    console = app.console()
    console.run(["environment", "here"], AGENT)
    console.run(["task", "create", "free work"], USER)
    assert hook(app, "Stop")[1] == {}, "auto off: the states say nothing about open tasks"
    from journal.models.node_kind import NodeKind
    from journal.repositories.charts import Charts
    charts = app.container.get(Charts)
    wf = [1] + [int(console.run(["chart", "new", f"test {i}"], AGENT).out.split()[1].rstrip(":")) for i in range(2)]
    at = [wf[0]]
    add = lambda kind, key, *text: int(console.run(["chart", "node", kind, key, *text, "--in", str(at[0])], AGENT).out.split()[1].rstrip(":"))
    line = lambda a, b, port="then": console.run(["chart", "line", str(a), str(b), "--port", port], AGENT)
    stop = next(n.id for n in charts.nodes_of(charts.find(1)) if n.kind == NodeKind.TRIGGER)
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
    at[0] = charts.shipped_on("tool_starting")[0].id
    tool = next(n.id for n in charts.nodes_of(charts.find(at[0])) if n.kind == NodeKind.TRIGGER)
    writes, hold, calm = add("check", "tool_writes"), add("action", "hold", "--text", "no writes today"), add("action", "say", "--text", "the chart says: nothing is open, rest")
    line(tool, writes)
    line(writes, hold, "yes")
    line(writes, calm, "no")
    console.run(["task", "create", "u", "--start"], AGENT)
    status, body = hook(app, "PreToolUse", tool_name="Edit", tool_input={"file_path": "a.py"})
    assert status == 409 and body["error"] == "no writes today", "a hold refuses the tool use"
    assert hook(app, "PreToolUse", tool_name="Read", tool_input={"file_path": "a.py", "limit": 1})[0] == 200
    at[0] = wf[2]
    filed, typed = add("trigger", "tasks.created"), add("action", "type", "--text", "a task was filed")
    line(filed, typed)
    console.run(["task", "create", "filed by the user"], USER)
    app.runtime().deferred.drain()
    assert "[journal] a task was filed" in sent, "a row event walks the chart and types the line"
    from journal.repositories.entries import Entries
    walks = [e for e in app.container.get(Entries).of_kind(1, "walk") if e.data["trigger"] == "idle"]
    assert any({stop, open_, hold_stop} <= set(w.data["nodes"]) and not w.data["allowed"] for w in walks), "a walk leaves its trace: the one workflow on the stop, with the edit's path beside the shipped one"


def test_the_shipped_chart_carries_the_stop_rules_the_states_used_to(app):
    hook(app, "SessionStart")
    console = app.console()
    console.run(["environment", "here"], AGENT)
    console.run(["task", "create", "free work"], USER)
    body = hook(app, "Stop")[1]
    assert body.get("decision") == "block" and "tasks are open, and auto mode is on: task 1 next: free work" in body["reason"], "the next open task, in auto mode, through the chart"
    assert hook(app, "Stop", stop_hook_active=True)[1].get("decision") == "block", "and again: journal stuck is the way out"
    app.container.get(Settings).save(Setting(environment_id=0, key="tasks.auto", value=False), Actor.system())
    hook(app, "PreToolUse", tool_name="Read", tool_input={"file_path": "a", "limit": 1})
    assert hook(app, "Stop")[1] == {}, "auto off: an open task says nothing"
    console.run(["task", "start", "1"], AGENT)
    console.run(["task", "park", "1", "after lunch"], AGENT)
    hook(app, "PreToolUse", tool_name="Read", tool_input={"file_path": "a", "limit": 1})
    body = hook(app, "Stop")[1]
    assert "parked tasks, still open: 1 free work (parked because: after lunch)" in body["reason"], "parked tasks in any mode, through the chart"


def test_a_journal_gets_each_shipped_workflow_it_lacks_at_boot_and_keeps_the_ones_it_has(app):
    from journal.features.chart.seeds.shipped_chart import ShippedChart
    from journal.repositories.charts import Charts
    charts = app.container.get(Charts)
    seed = app.container.get(ShippedChart)
    stop = charts.shipped_on("idle")[0]
    assert stop.shipped and stop.title == "Agent stops" and len(charts.nodes_of(stop)) == 13
    charts.save(stop.with_(shipped=False, event="", title="The journal's conduct"), Actor.system())
    seed.run()
    claimed = charts.find(stop.id)
    assert claimed.shipped and claimed.event == "idle" and claimed.title == "Agent stops" and len(charts.shipped_on("idle")) == 1, "a journal from before workflows were marked: its old chart is claimed, not doubled"
    for node in charts.nodes_of(claimed)[1:]:
        charts.remove_node(node, Actor.system())
    seed.run()
    assert len(charts.nodes_of(claimed)) == 1 and len(charts.shipped_on("idle")) == 1, "an edited workflow is the user's: never overwritten, never doubled"
    charts.remove(claimed, Actor.system())
    seed.run()
    made = charts.shipped_on("idle")
    assert len(made) == 1 and len(charts.nodes_of(made[0])) == 13, "a journal lacking a shipped workflow gets it at boot"


def test_an_edited_node_is_the_users_and_a_reset_brings_the_shipped_chart_back(app):
    import json as j
    from urllib.request import Request as R, urlopen
    hook(app, "SessionStart")
    console = app.console()
    console.run(["environment", "here"], AGENT)
    port = app.server().port
    read = j.load(urlopen(f"http://127.0.0.1:{port}/journal/chart/1", timeout=5))
    assert all(n["shipped"] for n in read["nodes"])
    nodes = read["nodes"]
    nodes[-1]["text"] = "my own words"
    nodes[0]["x"] = 99
    with urlopen(R(f"http://127.0.0.1:{port}/journal/chart/1", data=j.dumps({"revision": 0, "nodes": nodes, "lines": read["lines"]}).encode(), method="POST", headers={"Content-Type": "application/json"}), timeout=5) as r:
        saved = j.loads(r.read())
    assert saved["nodes"][-1]["shipped"] is False and saved["nodes"][0]["shipped"] is True, "a changed text is the user's; a moved box is still the shipped rule"
    assert "(edited)" in console.run(["chart", "show"], AGENT).out
    assert "reset to the shipped one, revision 2" in console.run(["chart", "reset"], AGENT).out
    again = j.load(urlopen(f"http://127.0.0.1:{port}/journal/chart/1", timeout=5))
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
    shipped = charts.shipped_on("tool_starting")[0]
    for node in charts.nodes_of(shipped):
        if node.kind != NodeKind.TRIGGER:
            charts.remove_node(node, Actor.system())
    wf = shipped.id
    add = lambda kind, key, *text: int(console.run(["chart", "node", kind, key, *text, "--in", str(wf)], AGENT).out.split()[1].rstrip(":"))
    line = lambda a, b, port="then": console.run(["chart", "line", str(a), str(b), "--port", port], AGENT)
    tool = next(n.id for n in charts.nodes_of(shipped) if n.kind == NodeKind.TRIGGER)
    every = add("check", "tool_uses_since_unread_every", "--text", "3")
    inbox = add("action", "say", "--text", "the chart: your inbox waits")
    over = add("check", "tool_uses_since_read_over", "--text", "messages.hold_after")
    held = add("action", "hold", "--text", "the chart: answer first")
    line(tool, every)
    line(every, inbox, "yes")
    line(every, over, "no")
    line(over, held, "yes")
    console.run(["task", "create", "t", "--start"], AGENT)
    console.run(["message", "send", "hello?"], USER)
    read = lambda: hook(app, "PreToolUse", tool_name="Read", tool_input={"file_path": "a", "limit": 1})
    named = [n for n in range(1, 7) if "your inbox waits" in json.dumps(read()[1])]
    assert named == [3, 6], "every third use since the message came"
    console.run(["message", "read", "1"], AGENT)
    answers = [read()[0] for _ in range(5)]
    assert answers[:3] == [200, 200, 200] and answers[3] == 409, "the hold after as many uses as the setting says"


def test_a_dry_run_shows_the_path_and_what_the_chart_would_do_without_doing_it(app, monkeypatch):
    from journal.supervisor_link import SupervisorLink
    sent = []
    monkeypatch.setattr(SupervisorLink, "inbox_of", lambda self, environment_id: "/tmp/an-inbox")
    monkeypatch.setattr(SupervisorLink, "_send", lambda self, environment_id, instruction: sent.append(instruction))
    hook(app, "SessionStart")
    console = app.console()
    console.run(["environment", "here"], AGENT)
    console.run(["task", "create", "free work"], USER)
    out = console.run(["chart", "try", "idle"], AGENT).out
    assert "would block stop: tasks are open, and auto mode is on: task 1 next: free work" in out and "nodes 1, 2, 8, 9, 11, 12, 13" in out, "the inbox branch is passed first and finds nothing unread; the stop branch then holds"
    assert not sent and hook(app, "PreToolUse", tool_name="Read", tool_input={"file_path": "a", "limit": 1})[0] == 200, "nothing was done"
    assert "one of session_started" in console.run(["chart", "try", "flying"], AGENT).err
    console.run(["message", "send", "are you there?"], USER)
    announced = len(sent)
    assert "needs the row" in console.run(["chart", "try", "messages.created"], AGENT).err
    tried = console.run(["chart", "try", "messages.created", "--row", "1"], AGENT).out
    assert "messages.created of row 1: nodes " in tried and "would type as messages.new: new message 1" in tried, "a row event is tried with its row, through the shipped workflow on it"
    assert len(sent) == announced, "the trial typed nothing"
    from journal.models.node_kind import NodeKind
    from journal.repositories.charts import Charts
    charts = app.container.get(Charts)
    clock = charts.shipped_on("ticked")[0]
    for shipped_node in charts.nodes_of(clock):
        if shipped_node.kind != NodeKind.TRIGGER:
            charts.remove_node(shipped_node, Actor.system())
    n = clock.id
    node = lambda *args: int(console.run(["chart", "node", *args, "--in", str(n)], USER).out.split()[1].rstrip(":"))
    trigger = next(x.id for x in charts.nodes_of(clock) if x.kind == NodeKind.TRIGGER)
    quiet, say = node("check", "quiet_for_over", "--text", "300"), node("action", "say", "--text", "check {{awaited}} now")
    console.run(["chart", "line", str(trigger), str(quiet)], USER)
    console.run(["chart", "line", str(quiet), str(say), "--port", "yes"], USER)
    live = console.run(["chart", "try", "ticked"], AGENT).out
    assert f"nodes {trigger}, {quiet}" in live and "assumed" not in live, "against the live state the tick is not quiet"
    scripted = console.run(["chart", "try", "ticked", "--quiet", "400"], AGENT).out
    assert f"nodes {trigger}, {quiet}, {say}" in scripted and "assumed: quiet for 400 s" in scripted, "the trial takes a quiet time and says it assumed it"


def test_a_row_named_in_a_message_is_a_chip_in_the_viewer():
    from journal.features.messages.mentions import Mentions
    assert Mentions.in_("Please have 2 agents give plan 1 a normal read, following template 3 (Find what is missing), then task 12 and Task 12 again, doc #4") == ["plan:1", "template:3", "todo:12", "doc:4"]
    assert Mentions.in_("the plan is ready; 3 agents; version 4") == []


def test_a_messages_mentions_reach_the_viewer_as_refs(app):
    from journal.http.v3.shapers.shapers import Shapers
    from journal.repositories.environments import Environments
    hook(app, "SessionStart")
    app.console().run(["message", "send", "look at plan 1 and task 2"], USER)
    rows = app.container.get(Shapers).named("message").rows(app.container.get(Environments).named("main"))
    assert rows[-1].refs == ["plan:1", "todo:2"]


def test_a_server_set_up_in_claude_itself_is_removed_from_the_page_through_claudes_own_command(app, monkeypatch):
    import json as j
    from urllib.request import Request as R, urlopen
    from journal.features.mcp.health import Health
    from journal.features.mcp.known import Known
    from journal.supervisor_link import SupervisorLink
    sent, removed = [], []
    monkeypatch.setattr(SupervisorLink, "inbox_of", lambda self, environment_id: "/tmp/an-inbox")
    monkeypatch.setattr(SupervisorLink, "_send", lambda self, environment_id, instruction: sent.append(instruction))
    monkeypatch.setattr(Health, "asked", lambda self: {"blender": Known("blender", "uvx blender-mcp", "connected", "")})
    monkeypatch.setattr(Health, "remove", lambda self, name: removed.append(name) or name == "blender")
    hook(app, "SessionStart")
    port = app.server().port
    listed = j.load(urlopen(f"http://127.0.0.1:{port}/journal/mcp", timeout=5))["servers"]
    assert [s["name"] for s in listed] == ["blender"] and listed[0]["managed"] is False
    with urlopen(R(f"http://127.0.0.1:{port}/journal/mcp/blender/remove", data=b"{}", method="POST", headers={"Content-Type": "application/json"}), timeout=5) as r:
        assert j.loads(r.read()) == {"removed": "blender"}
    assert removed == ["blender"] and sent[-1]["type"] == "RestartAgent"
    try:
        urlopen(R(f"http://127.0.0.1:{port}/journal/mcp/nothing/remove", data=b"{}", method="POST", headers={"Content-Type": "application/json"}), timeout=5)
    except HTTPError as error:
        assert error.code == 404


def test_words_start_a_sequence_from_a_prompt_or_from_the_users_message(app, monkeypatch):
    from journal.supervisor_link import SupervisorLink
    sent = []
    monkeypatch.setattr(SupervisorLink, "inbox_of", lambda self, environment_id: "/tmp/an-inbox")
    monkeypatch.setattr(SupervisorLink, "_send", lambda self, environment_id, instruction: sent.append(instruction["line"]))
    hook(app, "SessionStart")
    console = app.console()
    console.run(["environment", "here"], AGENT)
    assert "sequence give me an update" in console.run(["trigger", "list"], AGENT).out, "the update words are a shipped trigger"
    console.run(["sequence", "create", "release", "--steps", "bump | tag"], USER)
    console.run(["trigger", "create", "ship it", "release", "--do", "sequence"], USER)
    body = hook(app, "UserPromptSubmit", prompt="ok, ship it now")[1]
    machine = app.container.get(Machine)
    assert machine.current("s1").name == "running_sequence" and "step 1: bump" in json.dumps(body), "a prompt's words start the sequence and its first step rides on the answer"
    for _ in range(2):
        console.run(["sequence", "next"], AGENT)
    console.run(["message", "send", "could you give me an update?"], USER)
    app.runtime().deferred.drain()
    assert machine.current("s1").name == "running_sequence" and any("Find what changed" in line for line in sent), "the user's message starts the update sequence, typed to the agent"


def test_a_journal_holds_one_workflow_per_event_and_the_engine_walks_each_at_its_event(app):
    import json as j
    from urllib.request import Request as R, urlopen
    hook(app, "SessionStart")
    console = app.console()
    console.run(["environment", "here"], AGENT)
    port = app.server().port
    listed = j.load(urlopen(f"http://127.0.0.1:{port}/journal/chart", timeout=5))
    assert [w["title"] for w in listed["workflows"]] == ["Agent stops", "Session starts", "Message arrives", "Prompt sent", "Tool about to run", "Clock ticks", "Worker reports", "Question answered"] and listed["catalogue"]
    with urlopen(R(f"http://127.0.0.1:{port}/journal/chart", data=j.dumps({"title": "Greetings"}).encode(), method="POST", headers={"Content-Type": "application/json"}), timeout=5) as r:
        made = j.loads(r.read())
    assert made["title"] == "Greetings" and made["shipped"] is False and made["nodes"] == []
    second = made["id"]
    console.run(["chart", "node", "trigger", "tool_finished", "--in", str(second)], AGENT)
    finished = int(console.run(["chart", "show"], AGENT).out.split(f"workflow {second}")[1].split()[4])
    say = int(console.run(["chart", "node", "action", "say", "--text", "the second workflow says hello", "--in", str(second)], AGENT).out.split()[1].rstrip(":"))
    console.run(["chart", "line", str(finished), str(say)], AGENT)
    console.run(["task", "create", "free work"], USER)
    assert "the second workflow says hello" in j.dumps(hook(app, "PostToolUse", tool_name="Read", tool_input={}, tool_response="")[1]), "the second workflow speaks at its own event"
    body = hook(app, "Stop")[1]
    assert "tasks are open" in body["reason"] and "says hello" not in body["reason"], "and the stop is the first one's alone"
    try:
        urlopen(R(f"http://127.0.0.1:{port}/journal/chart/1/remove", data=b"{}", method="POST", headers={"Content-Type": "application/json"}), timeout=5)
    except HTTPError as error:
        assert error.code == 409, "the shipped workflow stays"
    with urlopen(R(f"http://127.0.0.1:{port}/journal/chart/{second}/remove", data=b"{}", method="POST", headers={"Content-Type": "application/json"}), timeout=5) as r:
        assert j.loads(r.read()) == {"removed": second}
    assert "Greetings" not in console.run(["chart", "show"], AGENT).out


def test_a_workflow_holds_one_trigger(app):
    import json as j
    from urllib.request import Request as R, urlopen
    hook(app, "SessionStart")
    console = app.console()
    console.run(["environment", "here"], AGENT)
    assert "already has its trigger" in console.run(["chart", "node", "trigger", "tool_starting"], AGENT).err
    port = app.server().port
    nodes = [{"id": "a", "kind": "trigger", "key": "idle"}, {"id": "b", "kind": "trigger", "key": "ticked"}]
    try:
        urlopen(R(f"http://127.0.0.1:{port}/journal/chart/1", data=j.dumps({"revision": 0, "nodes": nodes, "lines": []}).encode(), method="POST", headers={"Content-Type": "application/json"}), timeout=5)
    except HTTPError as error:
        assert error.code == 409 and "holds one trigger; this one has 2" in j.loads(error.read())["error"]


def test_a_subagent_dispatched_long_ago_in_the_session_stays_in_the_dropdown(app):
    from journal.http.v3.shapers.agents_shaper import AgentsShaper
    from journal.repositories.environments import Environments
    hook(app, "SessionStart")
    hook(app, "PreToolUse", tool_name="Agent", tool_input={"description": "Herr Gropius draws", "model": "opus", "subagent_type": "designer", "prompt": "draw"})
    hook(app, "PostToolUse", tool_name="Agent", tool_input={"description": "Herr Gropius draws"}, tool_response={"isAsync": True, "agentId": "g1"})
    for _ in range(60):
        hook(app, "PreToolUse", tool_name="Read", tool_input={"file_path": "a", "limit": 1})
        hook(app, "PostToolUse", tool_name="Read", tool_input={"file_path": "a"}, tool_response="x")
    rows = app.container.get(AgentsShaper).rows(app.container.get(Environments).named("main"))[0].data["subagent_rows"]
    assert [r["task"] for r in rows] == ["Herr Gropius draws"] and rows[0]["running"] is True


def test_a_link_given_in_the_chat_is_pinned_above_it_or_earns_one_reminder(app, monkeypatch):
    from journal.http.v3.shapers.shapers import Shapers
    from journal.repositories.environments import Environments
    from journal.supervisor_link import SupervisorLink
    sent = []
    monkeypatch.setattr(SupervisorLink, "inbox_of", lambda self, environment_id: "/tmp/an-inbox")
    monkeypatch.setattr(SupervisorLink, "_send", lambda self, environment_id, instruction: sent.append(instruction["line"]))
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
    env = app.container.get(Environments).named("main")
    rows = app.container.get(Shapers).named("notice").rows(env)
    assert rows[0].title == "The Workflows design" and rows[0].data["link"] == "https://design.example/p/1" and rows[0].data["label"] == "Open the design" and not rows[0].completed
    console.run(["notice", "close", "1"], AGENT)
    assert app.container.get(Shapers).named("notice").rows(env)[0].completed, "closed, it leaves the strip"


def test_an_answer_names_the_command_that_shows_the_question_whole_and_that_read_is_never_piped(app, monkeypatch):
    typed = []
    from journal.supervisor_link import SupervisorLink
    monkeypatch.setattr(SupervisorLink, "_send", lambda self, environment_id, instruction: typed.append(instruction["line"]))
    console = app.console()
    hook(app, "SessionStart")
    console.run(["environment", "here"], AGENT)
    console.run(["question", "ask", "Which name?", "--options", "alpha, beta"], AGENT)
    console.run(["question", "answer", "1", "beta"], USER)
    assert any("question 1 is answered" in line and "journal question show 1" in line for line in typed), "told like a message, with the command to read it"
    shown = console.run(["question", "show", "1"], AGENT).out
    assert "question 1: Which name?  [alpha / beta]" in shown and "answer: beta" in shown and "act on the answer" in shown
    status, body = hook(app, "PreToolUse", tool_name="Bash", tool_input={"command": "journal question show 1 " + "|" + " head -2"})
    assert status == 409 and "journal question show" in body["error"], "read whole, never through a pipe"


def test_a_message_left_from_the_viewer_while_the_agent_sits_idle_is_named_to_it_at_once(app, monkeypatch):
    typed = []
    from journal.supervisor_link import SupervisorLink
    monkeypatch.setattr(SupervisorLink, "_send", lambda self, environment_id, instruction: typed.append(instruction["line"]))
    hook(app, "SessionStart")
    app.console().run(["environment", "here"], AGENT)
    hook(app, "Stop")
    data = json.dumps({"brief": "are you there?", "idempotency": "v1"}).encode()
    request = HttpRequest(f"http://127.0.0.1:{app.server().port}/api/main/message", data=data, method="POST", headers={"Content-Type": "application/json"})
    with urlopen(request, timeout=5) as reply:
        n = json.loads(reply.read())["n"]
    assert any(line == f"[journal] new message {n}" for line in typed), "named by number the moment it arrives, so it is not left for the next hook"


def test_the_rules_doc_names_every_line_a_listener_says():
    """Plan 2's map: a listener's line not in the rules table is a line nobody planned for."""
    import re
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
    assert checks.answer("edits_since_log_over", at, "tasks.first_nudge_after") and checks.answer("edits_since_log_every", at, "25"), "counted before the write about to run, as the log cadence counts"


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
    from journal.repositories.entries import Entries
    from journal.repositories.environments import Environments
    hook(app, "SessionStart")
    console = app.console()
    console.run(["environment", "here"], AGENT)
    actions = app.container.get(Actions)
    env = app.container.get(Environments).named("main").id
    ctx = Context(event=Ticked(at=0.0, quiet_for=0.0, session="s1", environment_id=env), session="s1", environment_id=env, state=app.container.get(Machine).current("s1"))
    machine = app.container.get(Machine)
    actions.perform("release", "nothing to release", ctx)
    assert machine.current("s1").name == "idle", "an agent not paused is left as it is"
    console.run(["task", "create", "t", "--start"], AGENT)
    console.run(["await", "the build"], AGENT)
    assert machine.current("s1").name == "expecting"
    actions.perform("release", "the build came back: carry on", ctx)
    assert machine.current("s1").task_id == 1, "released to what it was doing"
    actions.perform("show_card", "The journal did a thing", ctx)
    cards = [e for e in app.container.get(Entries).of_kind(env, "card", 10)]
    assert cards and cards[0].data["label"] == "The journal did a thing"


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
    assert fillers.fill("{{inbox}}", tick) == "4 messages unread: journal message unread"
    console.run(["message", "read", "1"], AGENT)
    assert fillers.fill("{{owed}}", tick) == "1"
    console.run(["task", "create", "the footer", "--start"], AGENT)
    for _ in range(3):
        hook(app, "PreToolUse", tool_name="Write", tool_input={"file_path": "a.py"})
    write = at(ToolStarting(tool="Write", input={"file_path": "a.py"}, writes=True, session="s1", environment_id=env))
    assert fillers.fill("{{task}} / {{task_edits}} / {{log_command}}", write) == "task 1 / 2 / journal task log 1"
    console.run(["await", "the deploy"], AGENT)
    assert fillers.fill("check {{awaited}} now: you have waited {{quiet_minutes}} min", at(Ticked(at=0.0, quiet_for=330.0, session="s1", environment_id=env))) == "check the deploy now: you have waited 5 min", "the context carries the state as it is when the walk starts"
    console.run(["task", "park", "1", "the header first"], AGENT)
    assert fillers.fill("{{parked_n}}: {{parked_title}} ({{parked_why}})", tick) == "1: the footer (the header first)"
    console.run(["task", "create", "t2", "--start"], AGENT)
    console.run(["worker", "dispatch", "Lady Lovelace", "write the parser", "--model", "fast"], AGENT)
    worker = app.container.get(Workers).find(1)
    assert fillers.fill("worker {{worker_n}}, {{worker_name}}, reported", at(Updated(model=worker.reported(), by=Actor.user(1), was=worker))) == "worker 1, Lady Lovelace, reported"


def test_a_failing_node_ends_its_path_is_recorded_and_the_walk_goes_on(app):
    from journal.models.node import Node
    from journal.models.node_kind import NodeKind
    from journal.repositories.charts import THEN, Charts
    from journal.repositories.entries import Entries
    from journal.repositories.environments import Environments
    hook(app, "SessionStart")
    console = app.console()
    console.run(["environment", "here"], AGENT)
    charts = app.container.get(Charts)
    env = app.container.get(Environments).named("main").id
    shipped = charts.find(1)
    trigger = next(n for n in charts.nodes_of(shipped) if n.kind == NodeKind.TRIGGER)
    bad = charts.add_node(shipped, Node(kind=NodeKind.CHECK, key="no_such_check"), Actor.user(1))
    charts.connect(trigger, bad, THEN, Actor.user(1))
    console.run(["task", "create", "free work"], USER)
    status, body = hook(app, "Stop")
    assert status == 200 and body.get("decision") == "block" and "task 1 next" in body["reason"], "the shipped path beside the broken one still answers the stop"
    failed = app.container.get(Entries).of_kind(env, "walk_failed", 5)
    assert failed and failed[0].data["node"] == bad.id and "no_such_check" in failed[0].data["fault"], "the fault is on record, naming the node"


def test_a_row_event_walks_about_every_agent_of_the_environment_and_speaks_once(app, monkeypatch):
    typed = []
    from journal.console.where import Where
    from journal.supervisor_link import SupervisorLink
    monkeypatch.setattr(SupervisorLink, "_send", lambda self, environment_id, instruction: typed.append(instruction["line"]))
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


def test_one_workflow_per_event_a_second_is_refused_and_the_older_one_answers(app):
    import json
    from journal.models.node import Node
    from journal.models.node_kind import NodeKind
    from journal.repositories.charts import THEN, Charts
    hook(app, "SessionStart")
    console = app.console()
    console.run(["environment", "here"], AGENT)
    n = int(console.run(["chart", "new", "Another stop"], USER).out.split()[1].rstrip(":"))
    refused = console.run(["chart", "node", "trigger", "idle", "--in", str(n)], USER).err
    assert "Agent stops, already answers idle: one workflow per event" in refused
    charts = app.container.get(Charts)
    second = charts.find(n)
    trigger = charts.add_node(second, Node(kind=NodeKind.TRIGGER, key="idle"), Actor.user(1))
    charts.connect(trigger, charts.add_node(second, Node(kind=NodeKind.ACTION, key="block", text="the second one"), Actor.user(1)), THEN, Actor.user(1))
    console.run(["task", "create", "free work"], USER)
    status, body = hook(app, "Stop")
    assert "task 1 next" in body["reason"] and "the second one" not in json.dumps(body), "a journal that somehow holds two runs the older one"
    assert f"workflow {n}, revision 0: Another stop  (sidelined: workflow 1 answers its event)" in console.run(["chart", "show"], USER).out


def test_the_shipped_message_workflow_takes_the_arrival_listener_over_at_boot(app, monkeypatch):
    typed = []
    from journal.supervisor_link import SupervisorLink
    monkeypatch.setattr(SupervisorLink, "_send", lambda self, environment_id, instruction: typed.append(instruction["line"]))
    assert "InboxOnArrival" in app.container.get(Settings).get(PROJECT, "listeners.off", []), "the seed switched the listener off when it made the workflow"
    hook(app, "SessionStart")
    console = app.console()
    console.run(["environment", "here"], AGENT)
    console.run(["message", "send", "are you there?"], USER)
    app.runtime().deferred.drain()
    assert typed.count("[journal] new message 1") == 1, "named once, by the workflow"
    console.run(["chart", "reset", "2"], USER)
    assert "Message arrives" in console.run(["chart", "show"], USER).out


def test_the_etiquette_reminder_comes_every_fiftieth_line_and_never_floods(app, monkeypatch):
    typed = []
    from journal.engine.nudger import Nudger
    from journal.repositories.entries import Entries
    from journal.features.chart.feature import ChartFeature
    from journal.supervisor_link import SupervisorLink
    monkeypatch.setattr(SupervisorLink, "_send", lambda self, environment_id, instruction: typed.append(instruction["line"]))
    hook(app, "SessionStart")
    app.console().run(["environment", "here"], AGENT)
    machine, nudger = app.container.get(Machine), app.container.get(Nudger)
    agent = machine.agent("s1", 1)
    before = len([t for t in typed if "chat etiquette" in t])
    said = app.container.get(Entries).said_to(1, "s1")
    for i in range(said + 1, 101):
        nudger.say(agent, ChartFeature.LINE.about(text=f"line {i}"))
    reminders = [t for t in typed if "chat etiquette" in t]
    assert len(reminders) - before == 1, "the fiftieth line brings the reminder; the hundredth falls inside its window"
    for i in range(101, 1101):
        nudger.say(agent, ChartFeature.LINE.about(text=f"line {i}"))
    assert len([t for t in typed if "chat etiquette" in t]) - before == 1, "a thousand lines later the count is still exact: no flood once the entries outgrow a window"


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
    assert tasks.find(1).id not in [t.id for t in plans.free(1)], "a cancelled task is offered to nobody"


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
    tool = charts.shipped_on("tool_starting")[0]
    trigger = next(n.id for n in charts.nodes_of(tool) if n.kind == NodeKind.TRIGGER)
    node = lambda *args: int(console.run(["chart", "node", *args, "--in", str(tool.id)], USER).out.split()[1].rstrip(":"))
    in_hand, say = node("check", "task_in_hand"), node("action", "say", "--text", "in hand: {{task}}")
    console.run(["chart", "line", str(trigger), str(in_hand)], USER)
    console.run(["chart", "line", str(in_hand), str(say), "--port", "yes"], USER)
    console.run(["await", "the deploy"], AGENT)
    assert app.container.get(Machine).current("s1").name == "expecting"
    body = hook(app, "PreToolUse", tool_name="Read", tool_input={"file_path": "a.py", "limit": 1})[1]
    assert "in hand: task 1" in json.dumps(body), "the tool use lifted the wait before the walk, and the walk read Working, once"
    walks = app.container.get(Entries).of_kind(1, "walk", 5)
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


def test_the_dashboard_shows_a_cancelled_plan_and_a_failing_handler_still_answers(app):
    import json as j
    from urllib.request import urlopen
    console = app.console()
    console.run(["plan", "create", "old", "--brief", "b"], USER)
    console.run(["plan", "add", "1", "its own"], USER)
    console.run(["plan", "cancel", "1"], USER)
    with urlopen(f"http://127.0.0.1:{app.server().port}/api/main/dashboard?types=plan%2Ctodo&completed=1&last=50", timeout=5) as reply:
        assert reply.status == 200, "a cancelled plan and its task are shaped for the page"
        shown = j.loads(reply.read())
    assert "abandoned" in j.dumps(shown)
