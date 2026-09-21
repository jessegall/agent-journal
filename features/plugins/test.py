import features
import json
import pytest
import subprocess
import time

from controllers.types import Plugins
from engine.hooks import handle
from features.plugins.source import folder, home
from providers import PROVIDERS
from resources.base import SYSTEM
from tests.conftest import fresh
from controllers.types import Agents, Notices, Nudges, Plugins, Todos
from features.plugins.host import Host, PATIENCE
from features.plugins.source import folder, home, log
from resources.base import AGENT, PLUGIN, SYSTEM
from controllers.types import Notifications, Plugins
from features.plugins.manifest import MANIFEST
from features.plugins.source import alone, data, folder, home
from resources.base import AGENT
from tests.conftest import fresh, refused


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


WORKS = {"name": "works", "title": "Works", "version": "1.0.0", "description": "does its job",
         "setup": [{"name": "greet", "run": "echo hello > greeting.txt"}], "on": {"todo.created": "echo {}"}}


def git(*args, cwd):
    subprocess.run(["git", "-c", "user.email=t@t", "-c", "user.name=t", *args], cwd=cwd, capture_output=True, text=True, timeout=30, check=True)


def repository(tmp_path, manifest, extra=None, name="plugin"):
    origin = tmp_path / name
    (origin / MANIFEST).parent.mkdir(parents=True)
    (origin / MANIFEST).write_text(json.dumps(manifest))
    for filename, text in (extra or {}).items():
        (origin / filename).write_text(text)
    git("init", "-q", "-b", "main", cwd=origin)
    git("add", "-A", cwd=origin)
    git("commit", "-q", "-m", "one", cwd=origin)
    return origin.as_uri()


def test_a_plugin_may_refuse_a_write_and_its_words_reach_the_agent():
    record = alone()
    installed(record, "guardian", "read x; echo '{\"refuse\": \"src/Generated is generated; edit the stub instead\"}'\n")
    assert writing(record) == {"decision": "block", "reason": "guardian: src/Generated is generated; edit the stub instead"}, \
        "the plugin's reason is given to the agent, under its name"
    assert reading(record) == {}, "a read is not asked about unless the plugin says it reads too"


def test_a_guard_that_fails_or_hangs_never_stops_the_agent():
    broken = alone("broken")
    installed(broken, "broken", "exit 9\n")
    assert writing(broken) == {}, "a guard that crashes lets the write through"
    slow = alone("slow")
    installed(slow, "slow", "sleep 30\n", refuse_seconds=0.4)
    started = time.monotonic()
    answered = writing(slow)
    assert (answered, time.monotonic() - started < 3) == ({}, True), "a guard that hangs is given up on, quickly, and the write goes through"


def test_events_reach_a_listening_plugin_from_the_moment_it_is_installed():
    record = fresh()
    Agents(record, actor=SYSTEM).by_session("claude-1")
    seen = folder(record.root, "works") / "seen.jsonl"
    installed(record, {"name": "works", "on": {"todo.created": {"run": "sh handler.sh"}}},
              handler=f"cat >> {seen}\necho '{{\"whisper\": \"a row was filed\"}}'\n")
    host = Host(record.root)
    todos = Todos(record, actor=AGENT)

    todos.create("before the plugin was listening")
    assert (host.step(), seen.exists()) == (0, False), "nothing old is delivered on the first step"

    made = todos.create("fix the header")
    assert (host.step(), host.step()) == (1, 0), "the matching event is delivered once"
    payload = json.loads(seen.read_text().splitlines()[0])
    assert (payload["event"], payload["n"], payload["resource"]["title"]) == ("todo.created", made.n, "fix the header"), \
        "the plugin is handed the event and the row"
    assert [n.brief for n in Nudges(record).all()] == ["a row was filed"], "its answer was applied"

    todos.update(made.n, brief="still wrapping")
    assert (host.step(), len(seen.read_text().splitlines())) == (0, 1), \
        "an event with no handler is passed over, and nothing more reaches the plugin"

    Todos(record, actor=PLUGIN).create("filed by the plugin", plugin="works")
    host.step()
    assert len(seen.read_text().splitlines()) == 1, "the plugin's own row is not sent back to it"


def test_a_failing_setup_step_installs_nothing_and_says_which_step_failed(tmp_path):
    broken = fresh("broken")
    rows = Plugins(broken, actor=AGENT)
    why = refused(lambda: rows.action("install")(repository(tmp_path, {**WORKS, "name": "broken", "setup": [{"name": "build", "run": "exit 3"}]}), yes=True))
    assert ("setup step 'build' failed (3): exit 3" in why, "the whole output is in" in why) == (True, True), \
        "the failing step, its code and its command are named"
    assert (rows.all(), [p.name for p in home(broken.root).iterdir()] if home(broken.root).exists() else []) == ([], []), \
        "and nothing is left behind"
