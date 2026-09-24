import json
import shutil
import socket
import subprocess
import threading
import time

from controllers.types import CONTROLLERS, Agents, Plugins
from engine.hooks import handle
from engine.services import Manager, status_file
from features.plugins.commands import ClearLog
from features.plugins.declared import Manifest
from features.plugins.manifest import MANIFEST
from features.plugins.source import alone, folder, home, log, plugin_socket
from providers import PROVIDERS
from resources.base import AGENT, SYSTEM, USER
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


def answer_once(listening, reply=b'{"refuse": "from its service"}\n'):
    taken, _ = listening.accept()
    with taken:
        json.loads(taken.makefile().readline())
        taken.sendall(reply)


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
    served = alone("served")
    installed(served, "served", "read x; echo '{\"refuse\": \"from the command\"}'\n", refuse_socket="hooks", services={"hooks": {"run": "true"}})
    assert writing(served) == {"decision": "block", "reason": "served: from the command"}, "with nothing listening on its socket the command is run"
    with socket.socket(socket.AF_UNIX, socket.SOCK_STREAM) as listening:
        path = plugin_socket(served.root, "served")
        path.unlink(missing_ok=True)
        listening.bind(str(path))
        listening.listen()
        threading.Thread(target=lambda: answer_once(listening), daemon=True).start()
        assert writing(served) == {"decision": "block", "reason": "served: from its service"}, "a plugin's running service answers without a process started"
        threading.Thread(target=lambda: answer_once(listening, b"garbled\n"), daemon=True).start()
        assert writing(served) == {"decision": "block", "reason": "served: from the command"}, "a service that answers nonsense is passed over for the command"
        path.unlink()


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
    why = refused(lambda: rows.action("install")(repository(tmp_path, {**WORKS, "name": "broken", "setup": [{"name": "build", "run": "echo building; exit 3"}]}), yes=True))
    assert ("setup step 'build' failed (3): echo building; exit 3" in why, "the whole output is in" in why) == (True, True), \
        "the failing step, its code and its command are named"
    assert "$ echo building; exit 3\nbuilding\n" in log(broken.root, "broken").read_text(), "the log holds each command and the output it printed, as it came"
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
    assert environment(record.root, "linter", Manifest.of(row.manifest), row.token)["QUIET"] == "", "unchanged, a setting is its default"
    Configure().run(None, plugins, row.n, "quiet", "SourceReminder")
    chosen = (plugins.load(row.n).settings or {}).get(CHOSEN)
    assert environment(record.root, "linter", Manifest.of(row.manifest), row.token, chosen=chosen)["QUIET"] == "SourceReminder", "and a chosen value reaches its env"
    assert "has no setting" in refused(lambda: Configure().run(None, plugins, row.n, "loud", "x"))
    typed = installed(record, "typed", "exit 0", settings={"on": {"type": "flag", "default": "true"}, "level": {"type": "options", "options": ["low", "high"]}},
                      events={"sin-found": {"title": "Sin found", "tone": "warn", "card": {"icon": "warn"}}})
    assert "true or false" in refused(lambda: Configure().run(None, plugins, typed.n, "on", "yes")), "a switch takes true or false"
    assert "one of low, high" in refused(lambda: Configure().run(None, plugins, typed.n, "level", "mid")), "options take one of theirs"
    from features.plugins.answer import apply
    apply(record, None, "typed", "", {"settings": {"level": "high", "made-up": "x"}})
    assert (plugins.load(typed.n).settings or {}).get(CHOSEN) == {"level": "high"}, "a plugin may fill in a setting it worked out, and only its own"
    from features import FEATURES
    from engine import bus
    heard = []
    Agents(record, actor=AGENT).create("s-1")
    off = bus.on("typed.sin-found", lambda event, record: heard.append(event.data["brief"]))
    apply(record, FEATURES["plugins"].journal, "typed", "", {"raise": {"event": "sin-found", "brief": "deep-nesting at src/A.php:12"}})
    raised = [e for e in record.events() if e.action == "raised"][-1]
    assert (raised.data["title"], raised.data["tone"], raised.data["brief"], heard) == ("Sin found", "warn", "deep-nesting at src/A.php:12", ["deep-nesting at src/A.php:12"]), \
        "a plugin raises an event it declared, styled from its manifest, and anything listening by its name hears it"
    card = Agents(record, actor=SYSTEM).primary().data["cards"][-1]
    assert (card["label"], card["tone"], card["icon"], card["detail"]) == ("Sin found", "warn", "warn", "deep-nesting at src/A.php:12"), \
        f"an event whose declaration carries a card puts it in the chat, looking as the manifest says: {card}"
    from commands.dispatch import shaped
    from features.format import VIEWER
    viewed = shaped(Agents(record, actor=SYSTEM).primary(), record, VIEWER)["data"]["cards"][-1]["detail"]
    assert "[[file src/A.php" in viewed, f"its words pass the formatters like any brief, so a file is a chip: {viewed}"
    from features.plugins.commands import Raise
    Raise().run(None, plugins, "typed", "sin-found", "again at src/B.php:3")
    assert heard[-1] == "again at src/B.php:3", "journal plugin raise, from the queue, raises the same declared event"
    assert "declares no event" in refused(lambda: Raise().run(None, plugins, "typed", "made-up", "")), "and refuses one it does not declare"
    off()
    assert apply(record, FEATURES["plugins"].journal, "typed", "", {"raise": {"event": "made-up"}}) == [], "an event the manifest does not declare is refused"
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
    from engine.services import lock_file, log_file, want
    record = fresh()
    restarted = subprocess.Popen(["/bin/sh", "-c", "sleep 30 & wait"], start_new_session=True)
    status_file(record.root, "fresh.web").parent.mkdir(parents=True, exist_ok=True)
    status_file(record.root, "fresh.web").write_text(json.dumps({"state": "ready", "keeper": restarted.pid, "pgid": restarted.pid}))
    for place in (lock_file, log_file):
        place(record.root, "fresh.web").write_text("old")
    want(record.root, "fresh.web", "up", nonce=time.time())
    Manager(record.root).remove("fresh.web")
    assert restarted.wait(timeout=5) is not None, "a restart first stops the old run"
    assert [place(record.root, "fresh.web").exists() for place in (status_file, lock_file, log_file)] == [False, False, False], \
        "and removes what it left, so the new run starts from nothing of the old one's"
    from engine.keeper import ServiceSpec
    from engine.services import files_for
    kept = subprocess.Popen(["/bin/sh", "-c", "sleep 30 & wait"], start_new_session=True)
    asked = time.time()
    want(record.root, "kept.web", "up", nonce=asked)
    status_file(record.root, "kept.web").write_text(json.dumps({"state": "ready", "keeper": kept.pid, "pgid": kept.pid, "nonce": asked}))
    Manager(record.root).one(ServiceSpec(id="kept.web", plugin="kept", service="web", run=["true"], **files_for(record.root, "kept.web")))
    assert kept.poll() is None, "a restart already carried out is never carried out again by the next agent's manager"
    kept.kill()


def test_a_plugins_skills_and_dashboards_are_published_as_its_own():
    from features.plugins.skills import published, withdrawn
    from providers.base import LIBRARY
    record = alone()
    project = record.root.parent
    shipped = folder(record.root, "teacher") / "out"
    for name in ("teacher-one", "teacher-two"):
        (shipped / name).mkdir(parents=True, exist_ok=True)
        (shipped / name / "SKILL.md").write_text(f"---\nname: {name}\n---\n\nbody\n")
    (project / LIBRARY / "teacher-mine").mkdir(parents=True, exist_ok=True)
    (project / LIBRARY / "teacher-mine" / "SKILL.md").write_text("---\nname: teacher-mine\n---\n")
    published(record.root, "teacher", Manifest.of({"name": "teacher", "skills": "out"}))
    assert "plugin: teacher" in (project / LIBRARY / "teacher-one" / "SKILL.md").read_text(), "a published skill says which plugin it came from"
    assert (project / ".claude" / "skills" / "teacher-one").is_symlink(), "and every agent reads it"
    shutil.rmtree(shipped / "teacher-two")
    published(record.root, "teacher", Manifest.of({"name": "teacher", "skills": "out"}))
    assert not (project / LIBRARY / "teacher-two").exists(), "an upgrade that drops a skill takes it back"
    assert withdrawn(record.root, "teacher") == ["teacher-one"], "removing the plugin takes back exactly its own skills"
    assert (project / LIBRARY / "teacher-mine").is_dir(), "a skill it did not publish is left alone"
    import commands.http  # noqa: F401
    from commands.dispatch import dispatch
    from features.plugins.source import data
    from controllers.types import Plugins
    row = Plugins(record, actor=SYSTEM).create("teacher", enabled=True, token="t0ken", settings={},
                                               manifest={"name": "teacher", "dashboards": [{"name": "sins", "title": "Sins"}]})
    ask = lambda: dispatch("GET", f"/api/{record.env}/plugin/{row.n}/dashboard/sins", record.root, {}, {}).body
    assert "has not written" in ask()["missing"], "a declared dashboard the plugin has not written yet says so"
    (data(record.root, "teacher") / "dashboards").mkdir(parents=True)
    written = {"pages": {"overview": {"title": "Sins", "view": {"type": "stack", "children": [
        {"type": "stat", "label": "Sins", "value": 3, "open": "sin/deep-nesting"}]}},
        "sin/deep-nesting": {"title": "deep-nesting", "view": {"type": "text", "body": "why"}}}}
    (data(record.root, "teacher") / "dashboards" / "sins.json").write_text(json.dumps(written))
    assert (ask()["title"], ask()["start"]) == ("Sins", "overview"), "it is served from the plugin's data folder, starting at its first page"
    written["pages"]["overview"]["view"]["children"].append({"type": "chart"})
    (data(record.root, "teacher") / "dashboards" / "sins.json").write_text(json.dumps(written))
    assert "pages.overview.view.children[1]" in ask()["broken"], "a node that does not fit the format is named by its place"
    import os
    import time
    from features.plugins.lifecycle import changed_on_disk, reread
    plugins = Plugins(record, actor=SYSTEM)
    plugins.update(row.n, linked=True, read_at=time.time())
    given = folder(record.root, "teacher") / MANIFEST
    given.parent.mkdir(parents=True, exist_ok=True)
    given.write_text(json.dumps({"name": "teacher", "dashboards": [{"name": "sins", "title": "Sins"}, {"name": "trend", "title": "Trend"}]}))
    os.utime(given, (time.time() + 5, time.time() + 5))
    assert changed_on_disk(plugins, plugins.load(row.n)), "a linked plugin's manifest changed in place is noticed"
    reread(plugins, plugins.load(row.n))
    assert [d["name"] for d in plugins.load(row.n).manifest["dashboards"]] == ["sins", "trend"], "and read again without an upgrade"


def test_a_row_a_plugin_creates_is_its_own_locked_and_goes_with_it():
    from commands.cli import run
    record = alone()
    plugin = installed(record, "checker", "exit 0")
    assert run(["--root", str(record.root), "--plugin", "checker", "check", "create", "The code keeps its shape", "--set", "command=sh check.sh"]) == 0
    assert run(["--root", str(record.root), "--plugin", "checker", "check", "create", "The code keeps its shape", "--set", "command=sh check-v2.sh"]) == 0
    assert [c.data["command"] for c in CONTROLLERS["check"](record, actor=USER).all()] == ["sh check-v2.sh"], \
        "running its setup again updates the row it owns instead of making a second one"
    check = next(r for r in CONTROLLERS["check"](record, actor=USER).all())
    assert (check.data.get("plugin"), check.data.get("locked")) == ("checker", True), "a row a plugin creates is stamped as its own and locked"
    assert "belongs to the checker plugin" in refused(lambda: CONTROLLERS["check"](record, actor=USER).delete(check.n, "tidy")), "nobody else removes it"
    Plugins(record, actor=USER).complete(plugin.n, "removed")
    assert [r.n for r in CONTROLLERS["check"](record, actor=USER).all(deleted=True, completed=True)] == [], "removing the plugin removes what it created"


def test_the_installed_step_fills_the_settings_before_the_install_returns(tmp_path):
    record = fresh("scanner")
    rows = Plugins(record, actor=AGENT)
    manifest = {**WORKS, "name": "scanner", "settings": {"folders": {"type": "list", "default": ""}},
                "installed": "sh scan.sh"}
    made = rows.action("install")(repository(tmp_path, manifest, {"scan.sh": "echo '{\"settings\": {\"folders\": \"src\"}}'\n"}), yes=True)
    assert (rows.load(made.n).settings or {}).get("chosen") == {"folders": "src"}, "what the plugin found is chosen by the time the install is done"
