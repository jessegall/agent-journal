import json
import subprocess
import time

from controllers.types import Plugins
from engine.hooks import handle
from engine.services import Manager, status_file
from features.plugins.commands import ClearLog
from features.plugins.manifest import MANIFEST
from features.plugins.source import alone, folder, home, log
from providers import PROVIDERS
from resources.base import AGENT, SYSTEM
from tests.conftest import fresh, refused


CLAUDE = PROVIDERS["claude"]()


def alone(env="t"):
    record = fresh(env)
    record.set_setting("features", {"gate": False, "work_tracking": False})
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
    guardian = Plugins(record, actor=SYSTEM)._titled("guardian")
    assert "src/Generated is generated" in log(record.root, "guardian").read_text(), "every answer the plugin gives is written to its log"
    ClearLog().run(None, Plugins(record, actor=SYSTEM), guardian.n)
    assert not log(record.root, "guardian").exists(), "and the log can be emptied"


def test_a_guard_that_fails_or_hangs_never_stops_the_agent():
    broken = alone("broken")
    installed(broken, "broken", "exit 9\n")
    assert writing(broken) == {}, "a guard that crashes lets the write through"
    slow = alone("slow")
    installed(slow, "slow", "sleep 30\n", refuse_seconds=0.4)
    started = time.monotonic()
    answered = writing(slow)
    assert (answered, time.monotonic() - started < 3) == ({}, True), "a guard that hangs is given up on, quickly, and the write goes through"


def test_a_failing_setup_step_installs_nothing_and_says_which_step_failed(tmp_path):
    broken = fresh("broken")
    rows = Plugins(broken, actor=AGENT)
    why = refused(lambda: rows.action("install")(repository(tmp_path, {**WORKS, "name": "broken", "setup": [{"name": "build", "run": "exit 3"}]}), yes=True))
    assert ("setup step 'build' failed (3): exit 3" in why, "the whole output is in" in why) == (True, True), \
        "the failing step, its code and its command are named"
    assert (rows.all(), [p.name for p in home(broken.root).iterdir()] if home(broken.root).exists() else []) == ([], []), \
        "and nothing is left behind"



def test_removing_a_plugin_stops_its_services_and_takes_its_folder():
    from engine.services import DOWN, wanted
    record = alone()
    row = installed(record, "linter", "exit 0", services={"web": {"run": "sleep 30"}})
    Plugins(record, actor=SYSTEM).complete(row.n, how="removed")
    assert (wanted(record.root, "linter.web"), folder(record.root, "linter").exists()) == (DOWN, False), \
        "its service is asked to stop and its folder is gone"


def test_a_chosen_setting_reaches_the_plugins_commands():
    from features.plugins.commands import Configure
    from features.plugins.source import CHOSEN, environment
    record = alone()
    row = installed(record, "linter", "exit 0", settings={"quiet": {"title": "Quiet", "default": "", "env": "QUIET"}})
    plugins = Plugins(record, actor=SYSTEM)
    assert environment(record.root, "linter", row.manifest, row.token)["QUIET"] == "", "unchanged, a setting is its default"
    Configure().run(None, plugins, row.n, "quiet", "SourceReminder")
    chosen = (plugins.load(row.n).settings or {}).get(CHOSEN)
    assert environment(record.root, "linter", row.manifest, row.token, chosen=chosen)["QUIET"] == "SourceReminder", "and a chosen value reaches its env"
    assert "has no setting" in refused(lambda: Configure().run(None, plugins, row.n, "loud", "x"))
    typed = installed(record, "typed", "exit 0", settings={"on": {"type": "flag", "default": "true"}, "level": {"type": "options", "options": ["low", "high"]}})
    assert "true or false" in refused(lambda: Configure().run(None, plugins, typed.n, "on", "yes")), "a switch takes true or false"
    assert "one of low, high" in refused(lambda: Configure().run(None, plugins, typed.n, "level", "mid")), "options take one of theirs"
    from features.plugins.manifest import typed as checked
    shown = checked({"php": {"type": "flag"}, "vue": {"type": "flag"}, "sin": {"type": "flag", "when": {"php": True}},
                     "either": {"type": "flag", "when": [{"php": True}, {"vue": True}]}})
    assert [shown["sin"]["when"], shown["either"]["when"]] == [[{"php": True}], [{"php": True}, {"vue": True}]], \
        "a setting may be shown only while another has a value, or while any of several do"
    assert "names settings" in refused(lambda: checked({"sin": {"type": "flag", "when": {"ruby": True}}})), "a condition names a setting that exists"


def test_a_service_no_plugin_declares_is_stopped_and_forgotten():
    record = fresh()
    left = subprocess.Popen(["sleep", "30"], start_new_session=True)
    status_file(record.root, "gone.web").parent.mkdir(parents=True, exist_ok=True)
    status_file(record.root, "gone.web").write_text(json.dumps({"state": "running", "keeper": left.pid, "pgid": left.pid}))
    Manager(record.root).tick()
    assert left.wait(timeout=5) is not None, "its process is stopped"
    assert not status_file(record.root, "gone.web").exists(), "and it is no longer listed"


def test_stopping_a_service_stops_every_process_it_forked():
    from engine.keeper import gone, teardown
    service = subprocess.Popen(["/bin/sh", "-c", "sleep 30 & sleep 30 & wait"], start_new_session=True)
    time.sleep(0.2)
    teardown(service.pid, 1.0)
    assert (service.wait(timeout=5) is not None, gone(service.pid)) == (True, True), \
        "the service and the workers it forked go together, as one process group"
