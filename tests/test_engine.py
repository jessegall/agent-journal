"""Phase five: the machine. A write in Idle is refused with how to declare work; after task start a stop says carry on, once; done makes the agent idle again; stuck pauses and a tool use lifts it; the state survives a new server."""

import json
from pathlib import Path
from urllib.error import HTTPError
from urllib.request import Request as HttpRequest, urlopen

import pytest

from journal.app import App
from journal.config import Config
from journal.console.where import Where
from journal.engine.machine import Machine
from journal.features.tasks.states.stuck import Stuck
from journal.features.tasks.states.idle import Idle
from journal.features.tasks.states.working import Working
from journal.models.setting import Setting
from journal.models.actor import Actor
from journal.repositories.settings import Settings

AGENT = Where("main", "s1")


@pytest.fixture
def app(journal_root: Path):
    app = App(Config(journal_root, port=0))
    app.container.get(Settings).save(Setting(environment_id=0, key="features.skills", value=False), Actor.system())
    app.runtime().start()
    yield app
    app.runtime().stop()


def hook(app, kind: str, **body):
    data = json.dumps({"hook_event_name": kind, "session_id": "s1", **body}).encode()
    request = HttpRequest(f"http://127.0.0.1:{app.server().port}/hooks/claude", data=data, method="POST", headers={"Content-Type": "application/json", "X-Journal-Env": "main"})
    try:
        with urlopen(request, timeout=5) as reply:
            return reply.status, json.loads(reply.read())
    except HTTPError as error:
        return error.code, json.loads(error.read())


def write(app):
    return hook(app, "PreToolUse", tool_name="Write", tool_input={"file_path": "a.py"})


def test_task_start_moves_the_agent_to_working_and_every_stop_says_carry_on(app):
    hook(app, "SessionStart")
    app.console().run(["environment", "here"], AGENT)
    app.console().run(["task", "create", "ship it", "--start"], AGENT)
    assert app.container.get(Machine).current("s1").task_id == 1
    assert write(app)[0] == 200
    status, body = hook(app, "Stop")
    assert body.get("decision") == "block" and "task 1 is in hand, last logged just now: carry on" in body["reason"], "a stop with work in hand is held, which is how Claude is told to go on"
    assert hook(app, "Stop")[1].get("decision") == "block", "every fresh stop with work in hand is held, until a stuck"
    assert hook(app, "PreCompact")[1] == {}, "a compaction hook carries nothing to the agent; the marks said it"


def test_done_makes_the_agent_idle_again(app):
    hook(app, "SessionStart")
    app.console().run(["environment", "here"], AGENT)
    app.console().run(["task", "create", "t", "--start"], AGENT)
    app.console().run(["task", "done", "1"], AGENT)
    assert isinstance(app.container.get(Machine).current("s1"), Idle)
    assert hook(app, "Stop")[1] == {}


def test_stuck_pauses_and_the_next_tool_use_goes_back_to_where_it_was(app):
    hook(app, "SessionStart")
    app.console().run(["environment", "here"], AGENT)
    app.console().run(["task", "create", "t", "--start"], AGENT)
    app.console().run(["stuck", "stuck on the login"], AGENT)
    machine = app.container.get(Machine)
    assert isinstance(machine.current("s1"), Stuck) and machine.current("s1").why == "stuck on the login"
    assert hook(app, "Stop")[1] == {}
    hook(app, "PreToolUse", tool_name="Read", tool_input={})
    assert machine.current("s1").task_id == 1


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
    first.console().run(["environment", "here"], AGENT)
    first.console().run(["task", "create", "t", "--start"], AGENT)
    first.runtime().stop()
    second = App(Config(tmp_path, port=0))
    second.runtime().start()
    try:
        assert second.container.get(Machine).current("s1").task_id == 1
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
    app.console().run(["environment", "here"], AGENT)
    console = app.console()
    console.run(["task", "create", "first", "--start"], AGENT)
    console.run(["task", "create", "second"], AGENT)
    refused = console.run(["task", "start", "2"], AGENT)
    assert refused.code == 1 and "task 1 is in progress" in refused.err
    console.run(["task", "park", "1", "waiting for the designer"], AGENT)
    assert isinstance(app.container.get(Machine).current("s1"), Idle), "parked: nothing in hand"
    assert console.run(["task", "resume", "1"], AGENT).code == 0 and app.container.get(Machine).current("s1").task_id == 1
    assert console.run(["await", "the deploy to finish"], AGENT).code == 0
    assert app.container.get(Machine).current("s1").name == "expecting" and hook(app, "Stop")[1] == {}, "waiting is quiet at a stop"
    hook(app, "PreToolUse", tool_name="Read", tool_input={})
    assert app.container.get(Machine).current("s1").task_id == 1, "working again lifts the wait"


def test_edits_with_nothing_logged_are_asked_named_and_held_as_the_settings_say(app):
    from journal.models.actor import Actor
    from journal.models.setting import Setting
    from journal.repositories.settings import Settings
    for key, value in (("tasks.first_nudge_after", 5), ("tasks.name_every", 10), ("tasks.log_after", 20)):
        app.container.get(Settings).save(Setting(environment_id=0, key=key, value=value), Actor.system())
    hook(app, "SessionStart")
    app.console().run(["environment", "here"], AGENT)
    app.console().run(["task", "create", "t", "--start"], AGENT)
    answers = [write(app) for _ in range(21)]
    assert all(status == 200 for status, _ in answers[:20])
    assert "5 edits since you logged task 1: say where it stands" in json.dumps(answers[5][1]) and "logged" not in json.dumps(answers[4][1]), "the first ask after five"
    assert "task 1 in hand, 10 edits" in json.dumps(answers[10][1]), "named back every ten"
    assert answers[20][0] == 409 and "20 edits since you logged task 1" in answers[20][1]["error"]
    assert all(status == 200 for status, _ in [hook(app, "PreToolUse", tool_name="Read", tool_input={}) for _ in range(3)]), "a read is never held for a log"
    app.console().run(["task", "log", "1", "halfway"], AGENT)
    assert write(app)[0] == 200


def test_every_stop_with_a_task_in_hand_says_carry_on_and_stuck_is_the_way_out(app):
    hook(app, "SessionStart")
    app.console().run(["environment", "here"], AGENT)
    app.console().run(["task", "create", "t", "--start"], AGENT)
    answers = [hook(app, "Stop", stop_hook_active=i > 0) for i in range(4)]
    assert all(a[1].get("decision") == "block" and "task 1 is in hand, last logged just now: carry on" in a[1]["reason"] for a in answers), "there is no repeated-stop escape"
    app.console().run(["stuck", "I cannot reach the service"], AGENT)
    assert hook(app, "Stop")[1] == {}, "stuck lets the agent stop"
def test_a_blocked_task_waits_on_something_outside_and_is_neither_offered_nor_nudged(app):
    from journal.models.task_state import TaskState
    from journal.repositories.tasks import Tasks
    hook(app, "SessionStart")
    console = app.console()
    console.run(["environment", "here"], AGENT)
    console.run(["task", "create", "the tree", "--start"], AGENT)
    assert "waiting on: a talk with the user" in console.run(["task", "block", "1", "a talk with the user"], AGENT).out
    assert app.container.get(Tasks).find(1).state == TaskState.BLOCKED and app.container.get(Machine).current("s1").name == "idle"
    assert hook(app, "Stop")[1].get("decision") != "block", "a blocked task is not offered, in auto mode or not"
    assert "blocked tasks, waiting on something outside: 1 the tree (waiting on: a talk with the user)" in console.run(["environment", "here"], AGENT).out
    assert "open again" in console.run(["task", "unblock", "1"], AGENT).out and app.container.get(Tasks).find(1).state == TaskState.OPEN


def test_a_write_needs_no_task(app):
    hook(app, "SessionStart")
    app.console().run(["environment", "here"], AGENT)
    assert write(app)[0] == 200, "a quick edit is the agent's own; a task is for work worth tracking"

def test_the_menu_watcher_confirms_what_the_journal_caused_closes_what_it_cannot_place_and_leaves_the_users_own(app, monkeypatch):
    import os
    import time
    from journal.engine.menu_watcher import MenuWatcher
    from journal.repositories.messages import Messages
    from journal.supervisor_link import SupervisorLink
    sent = []
    monkeypatch.setattr(SupervisorLink, "_send", lambda self, environment_id, verb, fields: sent.append({"verb": verb, **fields}))
    hook(app, "SessionStart")
    watcher, link = app.container.get(MenuWatcher), app.container.get(SupervisorLink)
    agent = app.container.get(Machine).agent("s1", 1)
    screens = app.config.home / "runtime" / "screens"
    screens.mkdir(parents=True, exist_ok=True)
    (app.config.home / "runtime" / "inboxes").mkdir(parents=True, exist_ok=True)
    (app.config.home / "runtime" / "inboxes" / "main").write_text(json.dumps({"socket": "/tmp/none.sock", "protocol": 1, "screen": str(screens / "main.out")}))
    def shown(text: str, still_for: float = 5.0) -> None:
        path = screens / "main.out"
        path.write_text(text)
        os.utime(path, (time.time() - still_for, time.time() - still_for))
    switch = "\x1b[1mSwitch model?\x1b[0m\r\nYour next response will be slower\r\n\r\n❯ 1. Yes, switch to Opus 5.5\r\n  2. No, go back\r\n"
    link.choose(1, "/model opus")
    shown(switch)
    assert watcher.look(agent) == "\r" and sent[-1] == {"verb": "keys", "name": "agent", "keys": "\r"}, "a confirmation the journal's pick caused is taken with Enter"
    assert watcher.look(agent) == "", "and answered once"
    shown("Something new?\r\n❯ 1. Turn it on\r\n  2. Leave it\r\n")
    assert watcher.look(agent) == "\x1b", "a menu it cannot place is closed with Escape"
    from journal.repositories.scope import Scope
    with app.container.get(Scope).of(1):
        assert any("closed it with Escape" in m.text for m in app.container.get(Messages).in_()), "and a card says so"
    (screens / "main.keyed").touch()
    shown("Pick a theme\r\n❯ 1. Dark\r\n  2. Light\r\n")
    assert watcher.look(agent) == "", "a menu that came up right after keys at the keyboard is the user's own"
    shown("Pick a colour\r\n❯ 1. Red\r\n  2. Blue\r\n", still_for=0.0)
    assert watcher.look(agent) == "", "a screen still changing is not answered yet"


def test_a_typed_line_goes_out_on_one_line(app, monkeypatch):
    """One with breaks would arrive as pasted text that never matches it, and be typed again."""
    from journal.supervisor_link import SupervisorLink
    sent = []
    monkeypatch.setattr(SupervisorLink, "_send", lambda self, environment_id, verb, fields: sent.append(fields))
    app.container.get(SupervisorLink).type(1, "the command finished: cat <<EOF\nx\nEOF")
    assert sent[-1]["line"] == "[journal] the command finished: cat <<EOF x EOF"
