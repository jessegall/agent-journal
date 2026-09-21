import time

import pytest

import features
from controllers.types import Plugins
from engine.hooks import handle
from features.plugins.source import folder, home
from providers import PROVIDERS
from resources.base import SYSTEM
from tests.conftest import fresh

CLAUDE = PROVIDERS["claude"]()


@pytest.fixture(autouse=True)
def loaded_features():
    features.unload()
    features.load()
    yield
    features.unload()


def alone(env="t"):
    record = fresh(env)
    record.set_setting("features", {"gate": False, "work": False})
    return record


def installed(record, name, guard, **manifest):
    where = folder(record.root, name)
    home(record.root).mkdir(parents=True, exist_ok=True)
    where.mkdir(parents=True, exist_ok=True)
    (where / "guard.sh").write_text(guard)
    return Plugins(record, actor=SYSTEM).create(name, enabled=True, token="t0ken", settings={},
                                                manifest={"name": name, "refuse": "sh guard.sh", **manifest})


def writing(record, file="a.py"):
    return handle(CLAUDE, record.root, record.env, {"hook_event_name": "PreToolUse", "session_id": "claude-1", "tool_name": "Edit",
                                                     "cwd": str(record.root.parent), "tool_input": {"file_path": str(record.root.parent / file)}})


def reading(record):
    return handle(CLAUDE, record.root, record.env, {"hook_event_name": "PreToolUse", "session_id": "claude-1", "tool_name": "Read",
                                                     "cwd": str(record.root.parent), "tool_input": {"file_path": str(record.root.parent / "a.py")}})


def test_a_plugin_may_refuse_a_write_and_its_words_reach_the_agent():
    record = alone()
    installed(record, "guardian", "read x; echo '{\"refuse\": \"src/Generated is generated; edit the stub instead\"}'\n")
    assert writing(record) == {"decision": "block", "reason": "guardian: src/Generated is generated; edit the stub instead"}, \
        "the plugin's reason is given to the agent, under its name"
    assert reading(record) == {}, "a read is not asked about unless the plugin says it reads too"


def test_what_it_does_not_refuse_goes_through():
    quiet = alone("quiet")
    installed(quiet, "quiet", "read x; echo '{}'\n")
    assert writing(quiet) == {}, "an empty answer lets the write through"


def test_a_guard_that_fails_or_hangs_never_stops_the_agent():
    broken = alone("broken")
    installed(broken, "broken", "exit 9\n")
    assert writing(broken) == {}, "a guard that crashes lets the write through"
    slow = alone("slow")
    installed(slow, "slow", "sleep 30\n", refuse_seconds=0.4)
    started = time.monotonic()
    answered = writing(slow)
    assert (answered, time.monotonic() - started < 3) == ({}, True), "a guard that hangs is given up on, quickly, and the write goes through"


def test_a_plugin_that_is_off_or_removed_is_not_asked_at_all():
    off = alone("off")
    row = installed(off, "off", "read x; echo '{\"refuse\": \"no\"}'\n")
    Plugins(off, actor=SYSTEM).update(row.n, enabled=False)
    assert writing(off) == {}, "a plugin switched off is not asked"
    Plugins(off, actor=SYSTEM).update(row.n, enabled=True)
    Plugins(off, actor=SYSTEM).complete(row.n, "removed")
    assert writing(off) == {}, "a removed plugin is not asked"


def test_reads_are_asked_about_only_when_the_plugin_says_so():
    readers = alone("readers")
    installed(readers, "readers", "read x; echo '{\"refuse\": \"that file is secret\"}'\n", reads=True)
    assert reading(readers) == {"decision": "block", "reason": "readers: that file is secret"}, \
        "a plugin that asked for reads may refuse one"
