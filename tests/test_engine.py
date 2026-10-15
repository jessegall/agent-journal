"""Phase five: the machine. A write in Idle is refused with how to declare work; after task start a stop says carry on, once; done makes the agent idle again; halt pauses and a tool use lifts it; the state survives a new server."""

import json
from pathlib import Path
from urllib.error import HTTPError
from urllib.request import Request as HttpRequest, urlopen

import pytest

from journal.app import App
from journal.config import Config
from journal.console.where import Where
from journal.engine.machine import Machine
from journal.features.tasks.states.halted import Halted
from journal.features.tasks.states.idle import Idle
from journal.features.tasks.states.working import Working
from journal.models.setting import Setting
from journal.models.actor import Actor
from journal.repositories.settings import Settings

AGENT = Where("main", "s1")


@pytest.fixture
def app(tmp_path: Path):
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


def write(app):
    return hook(app, "PreToolUse", tool_name="Write", tool_input={"file_path": "a.py"})


def test_a_write_with_no_work_declared_is_refused_and_a_read_is_not(app):
    status, body = write(app)
    assert status == 409 and "no work declared" in body["error"] and "journal task start" in body["error"]
    assert hook(app, "PreToolUse", tool_name="Read", tool_input={})[0] == 200
    assert isinstance(app.container.get(Machine).current("s1"), Idle)


def test_task_start_moves_the_agent_to_working_and_a_stop_says_carry_on_once(app):
    hook(app, "SessionStart")
    app.console().run(["task", "create", "ship it", "--start"], AGENT)
    assert app.container.get(Machine).current("s1") == Working(task_id=1)
    assert write(app)[0] == 200
    status, body = hook(app, "Stop")
    assert status == 409 and "task 1 is in hand: carry on" in body["error"], "a stop with work in hand is refused, which is how Claude is told to go on"
    assert hook(app, "Stop")[1] == {}, "the same line is not said twice within the window"
    assert hook(app, "PreCompact")[1] == {}, "a compaction hook carries nothing to the agent; the marks said it"


def test_done_makes_the_agent_idle_again(app):
    hook(app, "SessionStart")
    app.console().run(["task", "create", "t", "--start"], AGENT)
    app.console().run(["task", "done", "1"], AGENT)
    assert isinstance(app.container.get(Machine).current("s1"), Idle)
    assert hook(app, "Stop")[1] == {}


def test_halt_pauses_and_the_next_tool_use_goes_back_to_where_it_was(app):
    hook(app, "SessionStart")
    app.console().run(["task", "create", "t", "--start"], AGENT)
    app.console().run(["halt", "now", "stuck on the login"], AGENT)
    machine = app.container.get(Machine)
    assert isinstance(machine.current("s1"), Halted) and machine.current("s1").why == "stuck on the login"
    assert hook(app, "Stop")[1] == {}
    hook(app, "PreToolUse", tool_name="Read", tool_input={})
    assert machine.current("s1") == Working(task_id=1)


def test_a_feature_switched_off_takes_its_gate_with_it(app):
    app.container.get(Settings).save(Setting(environment_id=0, key="features.tasks", value=False), Actor.user(1))
    app.console().run(["task", "create", "t", "--start"], AGENT)
    assert hook(app, "Stop")[1] == {}


def test_the_session_end_ends_the_agent_and_a_new_start_of_the_same_session_revives_it(app):
    hook(app, "SessionStart")
    hook(app, "SessionEnd")
    assert app.container.get(Machine).current("s1").name == "ended"
    hook(app, "SessionStart")
    app.console().run(["environment", "here"], AGENT)
    assert app.container.get(Machine).current("s1").name == "idle"


def test_the_state_is_in_the_database_so_a_new_server_finds_it(tmp_path):
    first = App(Config(tmp_path, port=0))
    first.container.get(Settings).save(Setting(environment_id=0, key="features.skills", value=False), Actor.system())
    first.runtime().start()
    hook(first, "SessionStart")
    first.console().run(["task", "create", "t", "--start"], AGENT)
    first.runtime().stop()
    second = App(Config(tmp_path, port=0))
    second.runtime().start()
    try:
        assert second.container.get(Machine).current("s1") == Working(task_id=1)
        assert write(second)[0] == 200
    finally:
        second.runtime().stop()


def test_a_tick_reaches_the_machine_without_a_hook(app):
    from journal.engine.clock import Clock
    hook(app, "SessionStart")
    app.console().run(["environment", "here"], AGENT)
    app.container.get(Clock).tick()
    assert isinstance(app.container.get(Machine).current("s1"), Idle)


def test_one_task_in_hand_park_resume_and_await(app):
    hook(app, "SessionStart")
    console = app.console()
    console.run(["task", "create", "first", "--start"], AGENT)
    console.run(["task", "create", "second"], AGENT)
    refused = console.run(["task", "start", "2"], AGENT)
    assert refused.code == 1 and "task 1 is in hand" in refused.err
    console.run(["task", "park", "1", "waiting for the designer"], AGENT)
    assert isinstance(app.container.get(Machine).current("s1"), Idle) and write(app)[0] == 409, "parked: nothing in hand, writes wait again"
    assert console.run(["task", "resume", "1"], AGENT).code == 0 and app.container.get(Machine).current("s1") == Working(task_id=1)
    assert console.run(["task", "await", "1", "the deploy to finish"], AGENT).code == 0
    assert app.container.get(Machine).current("s1").name == "expecting" and hook(app, "Stop")[1] == {}, "waiting is quiet at a stop"
    hook(app, "PreToolUse", tool_name="Read", tool_input={})
    assert app.container.get(Machine).current("s1") == Working(task_id=1), "working again lifts the wait"


def test_twenty_edits_with_nothing_logged_hold_the_next_write_and_every_tenth_names_the_task(app):
    hook(app, "SessionStart")
    app.console().run(["task", "create", "t", "--start"], AGENT)
    answers = [write(app) for _ in range(20)]
    assert all(status == 200 for status, _ in answers)
    assert "task 1 in hand" in answers[9][1]["hookSpecificOutput"]["additionalContext"]
    status, body = write(app)
    assert status == 409 and "20 edits since task 1 was last logged" in body["error"]
    app.console().run(["task", "log", "1", "halfway"], AGENT)
    assert write(app)[0] == 200


def test_a_stop_in_a_paused_state_says_what_the_journal_awaits_once(app):
    status, body = hook(app, "SessionStart")
    status, body = hook(app, "Stop")
    assert status == 409 and "you stopped while the journal awaits a look at what is in flight here" in body["error"]
    assert hook(app, "Stop", stop_hook_active=True)[0] == 200
