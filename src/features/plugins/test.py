from pathlib import Path
import json
import os
import shutil
import socket
import subprocess
import sys
import threading
import time
import pytest

from controllers.types import CONTROLLERS, Agents, Plugins
from tests.kit import handle
from engine.keeper import ServiceState
from engine.services import UP, Manager, allocate, status, status_file, want
from features.plugins.services import plugin_services
from features.plugins.commands import ClearLog
from features.plugins.declared import Manifest
from features.plugins.manifest import MANIFEST
from features.plugins.paths import folder, home, log, plugin_socket
from features.plugins.staging import alone
from providers import PROVIDERS
from resources.base import AGENT, SYSTEM, USER, Refused
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
    assert writing(record) == CLAUDE.blocking("guardian: src/Generated is generated; edit the stub instead"), \
        "the plugin's reason is given to the agent, under its name"
    assert reading(record) == {}, "a read is not asked about unless the plugin says it reads too"
    guardian = Plugins(record, actor=SYSTEM).rows.by_title("guardian")
    assert "src/Generated is generated" in log(record.root, "guardian").read_text(), "every answer the plugin gives is written to its log"
    with pytest.raises(Refused):
        log(record.root, "..%2Foutside")
    with pytest.raises(Refused):
        log(record.root, "../outside")
    ClearLog().run(None, Plugins(record, actor=SYSTEM), guardian.n)
    assert not log(record.root, "guardian").exists(), "and the log can be emptied"
    served = alone("served")
    installed(served, "served", "read x; echo '{\"refuse\": \"from the command\"}'\n", refuse_socket="hooks", services={"hooks": {"run": "true"}})
    assert writing(served) == CLAUDE.blocking("served: from the command"), "with nothing listening on its socket the command is run"
    with socket.socket(socket.AF_UNIX, socket.SOCK_STREAM) as listening:
        path = plugin_socket(served.root, "served")
        path.unlink(missing_ok=True)
        listening.bind(str(path))
        listening.listen()
        threading.Thread(target=lambda: answer_once(listening), daemon=True).start()
        assert writing(served) == CLAUDE.blocking("served: from its service"), "a plugin's running service answers without a process started"
        threading.Thread(target=lambda: answer_once(listening, b"garbled\n"), daemon=True).start()
        assert writing(served) == CLAUDE.blocking("served: from the command"), "a service that answers nonsense is passed over for the command"
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
    from engine import viewer
    asked = []
    real = viewer.identity
    viewer.identity = lambda url, timeout=0.05: asked.append(url) or real(url, timeout)
    try:
        viewer.lately_running(broken.root)
        probed = len(asked)
        viewer.lately_running(broken.root)
        assert len(asked) == probed, "a lookup that found no viewer is not repeated by every guard within its few seconds"
        viewer.remember(broken.root, 8999)
        assert (viewer.lately_running(broken.root), len(asked)) == ("http://127.0.0.1:8999/", probed), \
            "the serving process knows its own address without asking itself over HTTP"
    finally:
        viewer.identity = real
        viewer.SERVING.clear()


def test_a_failing_setup_step_installs_nothing_and_says_which_step_failed(tmp_path):
    broken = fresh("broken")
    rows = Plugins(broken, actor=AGENT)
    why = refused(lambda: rows.action("install")(repository(tmp_path, {**WORKS, "name": "broken", "setup": [{"name": "build", "run": "echo building; exit 3"}]}), yes=True))
    assert ("setup step 'build' failed (3): echo building; exit 3" in why, "the whole output is in" in why) == (True, True), \
        "the failing step, its code and its command are named"
    assert "$ echo building; exit 3\nbuilding\n" in log(broken.root, "broken").read_text(), "the log holds each command and the output it printed, as it came"
    assert (rows.all(), [p.name for p in home(broken.root).iterdir()] if home(broken.root).exists() else []) == ([], []), \
        "and nothing is left behind"
    from tests.kit import dispatch
    looked = dispatch("POST", f"/api/{broken.env}/plugins/preview", broken.root, {}, {"source": repository(tmp_path, WORKS, name="looked")})
    assert (looked.code, looked.body["name"]) == (200, "works"), "the viewer previews a plugin before installing it"
    assert [p.name for p in home(broken.root).glob(".staging-*")] == [], "and the preview takes away the copy it fetched"



def test_removing_a_plugin_stops_its_services_and_takes_its_folder():
    from engine.services import DOWN, wanted
    record = alone()
    row = installed(record, "linter", "exit 0", services={"web": {"run": "sleep 30"}})
    Plugins(record, actor=SYSTEM).complete(row.n, how="removed")
    assert (wanted(record.root, "linter.web"), folder(record.root, "linter").exists()) == (DOWN, False), \
        "its service is asked to stop and its folder is gone"


def test_a_chosen_setting_reaches_the_plugins_commands():
    from features.plugins.commands import Configure
    from features.plugins.declared import settings_of
    from features.plugins.environment import environment
    record = alone()
    row = installed(record, "linter", "exit 0", settings={"quiet": {"title": "Quiet", "default": "", "env": "QUIET"}})
    plugins = Plugins(record, actor=SYSTEM)
    assert environment(record.root, "linter", Manifest.of(row.manifest), row.token)["QUIET"] == "", "unchanged, a setting is its default"
    from controllers.types import Environments, Todos
    from engine.record import Record
    from features.plugins.queue import drain
    Environments(record, actor=SYSTEM).create("other")
    queued = environment(record.root, "linter", Manifest.of(row.manifest), row.token, env="other")["JOURNAL_QUEUE"]
    Path(queued).parent.mkdir(parents=True, exist_ok=True)
    Path(queued).write_text('todo create "From the event"\ntodo create "Somewhere else" --env ' + record.env + "\n")
    done, refusals = drain(record.root, "linter", record.env)
    assert (done, [(r.env, "names no --env" in r.why) for r in refusals]) == (2, [("other", True)]), "the drain hands back what it refused, and why"
    from features import FEATURES
    from features.plugins.host import Host
    from controllers.types import Notices
    host = Host(record.root, FEATURES["plugins"].journal)
    for _ in range(2):
        host.refusal("linter", refusals[0])
    told = [n.title for n in Notices(Record(record.root, "other"), actor=SYSTEM).all()]
    assert told == ["Plugin linter queued a line the journal refused"], "a refusal is told once, as a notice, in the environment of the line"
    titles = lambda env: [t.title for t in Todos(Record(record.root, env), actor=SYSTEM).all()]
    assert (titles("other"), "Somewhere else" in titles(record.env)) == (["From the event"], False), \
        "what a plugin queues answering an event runs in that event's environment, and a queued --env is refused"
    Configure().run(None, plugins, row.n, "quiet", "SourceReminder")
    chosen = settings_of(plugins.load(row.n)).chosen
    assert environment(record.root, "linter", Manifest.of(row.manifest), row.token, chosen=chosen)["QUIET"] == "SourceReminder", "and a chosen value reaches its env"
    assert "has no setting" in refused(lambda: Configure().run(None, plugins, row.n, "loud", "x"))
    from features.plugins.manifest import typed
    assert typed({"php": {"type": "flag"}, "strict": {"parent": "php"}})["strict"]["parent"] == "php", "a setting sits under the switch that turns it on"
    assert "no flag setting" in refused(lambda: typed({"php": {"type": "text"}, "strict": {"parent": "php"}})), "only under a switch"
    typed = installed(record, "typed", "exit 0", settings={"on": {"type": "flag", "default": "true"}, "level": {"type": "options", "options": ["low", "high"]}},
                      events={"sin-found": {"title": "Sin found", "tone": "warn", "card": {"icon": "warn"}}})
    assert "true or false" in refused(lambda: Configure().run(None, plugins, typed.n, "on", "yes")), "a switch takes true or false"
    assert "one of low, high" in refused(lambda: Configure().run(None, plugins, typed.n, "level", "mid")), "options take one of theirs"
    from features.plugins.answer import apply
    apply(record, None, "typed", "", {"settings": {"level": "high", "made-up": "x"}})
    assert settings_of(plugins.load(typed.n)).chosen == {"level": "high"}, "a plugin may fill in a setting it worked out, and only its own"
    from features import FEATURES
    from engine import bus
    heard = []
    Agents(record, actor=AGENT).create("s-1")
    off = bus.on("typed.sin-found", lambda event, record: heard.append(event.data["brief"]))
    apply(record, FEATURES["plugins"].journal, "typed", "", {"raise": {"event": "sin-found", "brief": "deep-nesting at src/A.php:12"}})
    raised = [e for e in record.event_log.events() if e.action == "raised"][-1]
    assert (raised.data["title"], raised.data["tone"], raised.data["brief"], heard) == ("Sin found", "warn", "deep-nesting at src/A.php:12", ["deep-nesting at src/A.php:12"]), \
        "a plugin raises an event it declared, styled from its manifest, and anything listening by its name hears it"
    card = Agents(record, actor=SYSTEM).primary().data["cards"][-1]
    assert (card["label"], card["tone"], card["icon"], card["detail"]) == ("Sin found", "warn", "warn", "deep-nesting at src/A.php:12"), \
        f"an event whose declaration carries a card puts it in the chat, looking as the manifest says: {card}"
    from features.format import VIEWER, shaped
    viewed = shaped(Agents(record, actor=SYSTEM).primary(), record, VIEWER)["data"]["cards"][-1]["detail"]
    assert "[[file src/A.php" in viewed, f"its words pass the formatters like any brief, so a file is a chip: {viewed}"
    from features.plugins.commands import Raise
    Raise().run(None, plugins, "typed", "sin-found", "again at src/B.php:3", open="sins/sin/deep-nesting/src/B.php")
    assert heard[-1] == "again at src/B.php:3", "journal plugin raise, from the queue, raises the same declared event"
    assert Agents(record, actor=SYSTEM).primary().data["cards"][-1]["page"] == "sins/sin/deep-nesting/src/B.php", \
        "and a raise that names a dashboard page gives its card that page to open"
    assert "declares no event" in refused(lambda: Raise().run(None, plugins, "typed", "made-up", "")), "and refuses one it does not declare"
    off()
    assert apply(record, FEATURES["plugins"].journal, "typed", "", {"raise": {"event": "made-up"}}) == [], "an event the manifest does not declare is refused"
    from features.plugins.manifest import typed as checked
    shown = checked({"php": {"type": "flag"}, "vue": {"type": "flag"}, "sin": {"type": "flag", "when": {"php": True}},
                     "either": {"type": "flag", "when": [{"php": True}, {"vue": True}]}})
    assert [shown["sin"]["when"], shown["either"]["when"]] == [[{"php": True}], [{"php": True}, {"vue": True}]], \
        "a setting may be shown only while another has a value, or while any of several do"
    assert "names settings" in refused(lambda: checked({"sin": {"type": "flag", "when": {"ruby": True}}})), "a condition names a setting that exists"
    from features.plugins.manifest import read
    bad = record.root.parent / "bad-plugin"
    assert "not a journal plugin" in refused(lambda: read(bad, "2.0.0")), "a folder without a manifest is no plugin"
    for given, words in [
        ("not json", "is not JSON"), ([1], "holds one object"), ({"name": "X Y"}, "name must be"),
        ({"name": "messages"}, "is a built-in feature"), ({"name": "pp", "journal": "99.0.0"}, "needs journal 99.0.0 or newer"),
        ({"name": "pp", "wat": 1}, "unknown key 'wat'"), ({"name": "pp", "refuse_socket": "x"}, "refuse_socket names one of its services"),
        ({"name": "pp", "events": {"e": {"title": "E", "tone": "loud"}}}, "tone is one of"),
        ({"name": "pp", "events": {"e": {"title": "E", "card": {"size": 1}}}}, "unknown key 'size'"),
        ({"name": "pp", "cancels": {"todo.created": "x"}}, "events that can be cancelled"), ({"name": "pp", "installed": ["a"]}, "installed is one command"),
        ({"name": "pp", "skills": "/abs"}, "skills is a folder inside the plugin"), ({"name": "pp", "refuse_seconds": "x"}, "a number of seconds"),
        ({"name": "pp", "env": {"A": 1}}, "env names values"), ({"name": "pp", "requires": ["x"]}, "requires names one entry each"),
        ({"name": "pp", "requires": {"a": {"hint": "h"}}}, "requires.a needs check"), ({"name": "pp", "settings": {"a": {"type": "weird"}}}, "a setting is one of"),
        ({"name": "pp", "settings": {"a": {"type": "options"}}}, "needs a list of options"), ({"name": "pp", "settings": {"a": {"type": "flag", "when": 5}}}, "when names settings"),
        ({"name": "pp", "setup": "x"}, "setup is a list of steps"), ({"name": "pp", "setup": [5]}, "setup step 1 is a command"),
        ({"name": "pp", "services": ["web"]}, "names one service each"), ({"name": "pp", "services": {"Bad": {}}}, "lowercase words"),
        ({"name": "pp", "services": {"web": "x"}}, "is an object with"), ({"name": "pp", "services": {"web": {"run": "x", "port": "x"}}}, "takes a port number"),
        ({"name": "pp", "services": {"web": {"run": "x", "restart": "sometimes"}}}, "restarts always"),
        ({"name": "pp", "services": {"web": {"run": "x", "when": 5}}}, 'takes "when" as one shell command'),
        ({"name": "pp", "chat": {"find": "x"}}, "chat is a list"), ({"name": "pp", "chat": [{"find": "x"}]}, "each chat rule is"),
        ({"name": "pp", "chat": [{"find": "(", "as": "x"}]}, "is not a pattern"), ({"name": "pp", "load": ["s"]}, "load names"),
        ({"name": "pp", "load": {"nothing.here": ["s"]}}, "matches no event"), ({"name": "pp", "load": {"todo.created": "s"}}, "a list of skill names"),
        ({"name": "pp", "on": ["x"]}, "on names an event pattern"), ({"name": "pp", "on": {"nothing.here": "x"}}, "matches no event; a pattern is"),
        ({"name": "pp", "refuse": 5}, "is a command, a line or a list of words"),
    ]:
        (bad / MANIFEST).parent.mkdir(parents=True, exist_ok=True)
        (bad / MANIFEST).write_text(given if isinstance(given, str) else json.dumps(given))
        assert words in refused(lambda: read(bad, "2.0.0")), (given, words)


def test_a_service_no_plugin_declares_is_stopped_and_forgotten():
    from engine.services import files_for
    record = fresh()
    left = subprocess.Popen(["sleep", "30"], start_new_session=True)
    status_file(record.root, "gone.web").parent.mkdir(parents=True, exist_ok=True)
    status_file(record.root, "gone.web").write_text(json.dumps({"state": "running", "keeper": left.pid, "pgid": left.pid}))
    keeping = Manager(record.root, sources=(plugin_services,))
    keeping.tick()
    assert left.wait(timeout=5) is not None, "its process is stopped"
    assert not status_file(record.root, "gone.web").exists(), "and it is no longer listed"
    other = subprocess.Popen(["sleep", "30"], start_new_session=True)
    status_file(record.root, "gone.web").write_text(json.dumps({"state": "running", "keeper": other.pid, "pgid": other.pid}))
    Manager(record.root, sources=(plugin_services,)).tick()
    assert other.poll() is None, "a second keeper of the same project keeps nothing while the first holds the services"
    keeping.tick()
    assert other.wait(timeout=5) is not None, "the one that holds them does"
    keeping.owned.close()
    started = []

    def broken(root, taken):
        raise Refused("a bad manifest")

    def fine(root, taken):
        from engine.keeper import ServiceSpec
        return [ServiceSpec(id="fine.web", plugin="fine", service="web", run=["true"], **files_for(record.root, "fine.web"))]
    status_file(record.root, "lost.web").write_text(json.dumps({"state": "ready", "keeper": 0}))
    Manager(record.root, start=lambda spec, lifeline: started.append(spec.id) or 0, sources=(broken, fine)).tick()
    assert started == ["fine.web"] and status_file(record.root, "lost.web").exists(), \
        "a source that throws starts nothing of its own, stops nothing and never keeps the other sources' services from running"
    from engine.services import Beat, beat_file
    clock, asked = [5000.0], []

    def counting(root, taken):
        asked.append(clock[0])
        return []
    first = Manager(record.root, clock=lambda: clock[0], sources=(counting,))
    second = Manager(record.root, clock=lambda: clock[0], sources=(counting,))
    first.tick()
    second.tick()
    assert len(asked) == 1 and Beat.read(record.root).token == first.token, "the manager that holds the lock writes a heartbeat, and a second one leaves the services to it"
    clock[0] += 31.0
    second.tick()
    assert len(asked) == 2 and Beat.read(record.root).token == second.token, "a manager that finds the lock held by a heartbeat older than 30 seconds takes over"
    first.tick()
    first.tick()
    assert len(asked) == 2, "the old holder, once it wakes and sees another's newer heartbeat, stops managing"
    clock[0] += 31.0
    first.tick()
    assert len(asked) == 3 and Beat.read(record.root).token == first.token, "and manages again when the one that took over has gone quiet in its turn"


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
    stray = subprocess.Popen(["sleep", "30"], start_new_session=True)
    lock_file(record.root, "stray.web").write_text(str(stray.pid))
    Manager(record.root).remove("stray.web")
    assert stray.wait(timeout=5) is not None, "a keeper the status no longer names but that still holds the lock is stopped before its lock is removed"
    from engine.keeper import ServiceSpec
    from engine.services import files_for
    kept = subprocess.Popen(["/bin/sh", "-c", "sleep 30 & wait"], start_new_session=True)
    asked = time.time()
    want(record.root, "kept.web", "up", nonce=asked)
    status_file(record.root, "kept.web").write_text(json.dumps({"state": "ready", "keeper": kept.pid, "pgid": kept.pid, "nonce": asked}))
    Manager(record.root).one(ServiceSpec(id="kept.web", plugin="kept", service="web", run=["true"], **files_for(record.root, "kept.web")))
    assert kept.poll() is None, "a restart already carried out is never carried out again by the next agent's manager"
    kept.kill()
    started = []
    manager = Manager(record.root, start=lambda spec, lifeline: started.append(spec.id) or 0)
    for sid, when in (("idle.web", "echo no C# here; exit 1"), ("busy.web", "exit 0")):
        manager.one(ServiceSpec(id=sid, plugin=sid.split(".")[0], service="web", run=["true"], when=when, **files_for(record.root, sid)))
    idle = json.loads(status_file(record.root, "idle.web").read_text())
    assert (started, idle["state"], "no C# here" in idle["why"]) == (["busy.web"], "not needed", True), \
        "a service whose when-command fails is left unstarted as not needed, with the command's own words; one that answers 0 starts"
    want(record.root, "busy.web", UP, nonce=time.time())
    manager.one(ServiceSpec(id="busy.web", plugin="busy", service="web", run=["true"], when="echo none here; exit 1", **files_for(record.root, "busy.web")))
    assert json.loads(status_file(record.root, "busy.web").read_text())["state"] == "not needed", \
        "a restart, as after a plugin upgrade, asks the when-command again instead of keeping the old answer"
    stuck = subprocess.Popen(["/bin/sh", "-c", "sleep 30 & wait"], start_new_session=True)
    status_file(record.root, "stuck.web").write_text(json.dumps({"state": "starting", "keeper": stuck.pid, "pgid": stuck.pid}))
    manager.one(ServiceSpec(id="stuck.web", plugin="stuck", service="web", run=["true"], when="exit 1", **files_for(record.root, "stuck.web")))
    assert (stuck.wait(5) is not None, json.loads(status_file(record.root, "stuck.web").read_text())["state"]) == (True, "not needed"), \
        "a service already running is stopped once its when-command says it is not needed"
    with socket.socket() as probe:
        probe.bind(("127.0.0.1", 0))
        port = probe.getsockname()[1]
    Manager(record.root).one(ServiceSpec(id="real.web", plugin="real", service="web", run=[sys.executable, "-m", "http.server", str(port), "--bind", "127.0.0.1"],
                                         port=port, url=f"http://127.0.0.1:{port}", **files_for(record.root, "real.web")))
    deadline = time.time() + 15
    while time.time() < deadline and json.loads(status_file(record.root, "real.web").read_text()).get("state") != "ready":
        time.sleep(0.2)
    assert json.loads(status_file(record.root, "real.web").read_text()).get("state") == "ready", \
        "the keeper it ships reads its spec from disk and brings a real service up, as it does for the phone's server and tunnel"
    Manager(record.root).remove("real.web")
    from engine.keeper import ServiceSpec as Spec
    from engine.package import entry
    from engine.services import lock_file, spec_file
    quiet = Spec(id="held.web", plugin="held", service="web", run=["sleep", "30"], **files_for(record.root, "held.web"))
    spec_file(record.root, "held.web").write_text(json.dumps(__import__("dataclasses").asdict(quiet)))
    lifeline, writer = os.pipe()
    holding = open(lock_file(record.root, "held.web"), "a")
    import fcntl
    fcntl.flock(holding, fcntl.LOCK_EX)
    threading.Timer(1.0, holding.close).start()
    kept = subprocess.Popen([*entry("engine.keeper"), str(lifeline), str(spec_file(record.root, "held.web"))], pass_fds=(lifeline,), stdin=subprocess.DEVNULL,
                            stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, start_new_session=True)
    os.close(lifeline)
    deadline = time.time() + 15
    while time.time() < deadline and status(record.root, "held.web").state != "starting":
        time.sleep(0.1)
    assert (kept.poll(), status(record.root, "held.web").state) == (None, "starting"), "a keeper that finds the lock taken waits for the old holder to let go instead of giving up"
    os.close(writer)
    kept.wait(timeout=15)
    assert "session" in status(record.root, "held.web").why, "a service that stops because the agent session ended says so"
    Manager(record.root).remove("held.web")
    with socket.socket() as busy:
        busy.bind(("127.0.0.1", 0))
        busy.listen()
        port = busy.getsockname()[1]
        status_file(record.root, "own.web").write_text(json.dumps({"state": "stopped", "port": port}))
        assert allocate(record.root, "own.web", None, set())[0] != port, \
            "a held port cannot be assigned to a service without proving which process owns it"
        status_file(record.root, "own.web").write_text(json.dumps({"state": "exited", "port": port}))
        assert allocate(record.root, "own.web", None, set())[0] != port, "one whose run broke with its port taken gets another"
    holding = subprocess.Popen(["sleep", "30"], start_new_session=True)
    lock_file(record.root, "held.web").write_text(str(holding.pid))
    status_file(record.root, "held.web").write_text(json.dumps({"state": "starting", "keeper": 999999}))
    spawned = []
    Manager(record.root, start=lambda spec, lifeline: spawned.append(spec.id) or 0).one(
        ServiceSpec(id="held.web", plugin="held", service="web", run=["true"], **files_for(record.root, "held.web")))
    assert spawned == [] and json.loads(status_file(record.root, "held.web").read_text())["keeper"] == holding.pid, \
        "a live keeper that holds the lock is adopted, never started again beside itself"
    holding.kill()
    running = subprocess.Popen(["sleep", "30"], start_new_session=True)
    rebuilt = ServiceSpec(id="moved.web", plugin="moved", service="web", run=["true"], env={"JOURNAL_BUILD": "port 8442"}, **files_for(record.root, "moved.web"))
    from dataclasses import asdict
    from engine.services import spec_file
    spec_file(record.root, "moved.web").write_text(json.dumps(asdict(rebuilt)))
    status_file(record.root, "moved.web").write_text(json.dumps({"state": "ready", "keeper": running.pid, "build": "port 8440"}))
    Manager(record.root, start=lambda spec, lifeline: 0).one(rebuilt)
    assert running.wait(timeout=5) is not None, "a keeper running another build than the one wanted is restarted, even when a failed start rewrote the spec file"
    quick = lambda spec, lifeline: status_file(record.root, spec.id).write_text(json.dumps({"state": "ready", "keeper": os.getpid()})) or os.getpid()
    Manager(record.root, start=quick).one(ServiceSpec(id="quick.web", plugin="quick", service="web", run=["true"], **files_for(record.root, "quick.web")))
    assert json.loads(status_file(record.root, "quick.web").read_text())["state"] == "ready", \
        "a keeper that is ready before its manager looks again keeps its ready, never overwritten with starting"
    now = [1000.0]
    began = []
    flaky = Manager(record.root, start=lambda spec, lifeline: began.append(now[0]) or 0, clock=lambda: now[0], living=lambda pid: False)
    crashing = ServiceSpec(id="crash.web", plugin="crash", service="web", run=["false"], **files_for(record.root, "crash.web"))

    def crash_state():
        return ServiceState.read(status_file(record.root, "crash.web"))

    def stop_and_look(after):
        status_file(record.root, "crash.web").write_text(json.dumps({"state": "exited", "at": now[0]}))
        now[0] += after
        return flaky.one(crashing)
    flaky.one(crashing)
    waited = []
    for _ in range(4):
        assert stop_and_look(0.5) is False, "a service that just stopped is not started again before its backoff is over"
        seen_at = now[0]
        now[0] += [1.0, 2.0, 4.0, 8.0][len(waited)] - 0.1
        assert flaky.one(crashing) is False, "and not a moment before it is over"
        now[0] += 0.1
        assert flaky.one(crashing) is True
        waited.append(began[-1] - seen_at)
    assert waited == [1.0, 2.0, 4.0, 8.0], "each stop doubles the wait before the next start"
    assert stop_and_look(0.5) is False and crash_state().state == "failed" and "stopped 5 times" in crash_state().why, \
        "a fifth stop in a row marks the service failed and says why"
    for _ in range(3):
        before = len(began)
        assert stop_and_look(0.5) is False and flaky.one(crashing) is False, "a failed service still waits out its backoff"
        now[0] += 30.0
        assert flaky.one(crashing) is True and len(began) == before + 1, "but it is tried again once the wait, never longer than 30 seconds, is over"
    now[0] += 1000.0
    flaky.one(crashing)
    assert len(flaky.crashes["crash.web"]) == 1, "a service that stayed up for a long while forgets its old stops"
    dead = []
    mourned = Manager(record.root, start=lambda spec, lifeline: dead.append(now[0]) or 424242, clock=lambda: now[0], living=lambda pid: False)
    dying = ServiceSpec(id="dies.web", plugin="dies", service="web", run=["true"], **files_for(record.root, "dies.web"))
    mourned.one(dying)
    now[0] += 0.1
    assert mourned.one(dying) is False, "a keeper that died before it wrote any state is a crash and waits out a backoff"
    now[0] += 1.2
    assert mourned.one(dying) is True and len(dead) == 2, "and is started again once the wait is over"
    now[0] += 0.1
    assert mourned.one(dying) is False and mourned.waiting["dies.web"] - now[0] > 1.5, "the next stop waits longer"
    never = ServiceSpec(id="once.web", plugin="once", service="web", run=["false"], restart="never", **files_for(record.root, "once.web"))
    status_file(record.root, "once.web").write_text(json.dumps({"state": "exited", "at": now[0]}))
    assert flaky.one(never) is False, "a service declared restart never stays stopped after it exits"
    from engine import services as services_module
    with socket.socket() as taken:
        taken.bind(("127.0.0.1", 0))
        taken.listen()
        busy = taken.getsockname()[1]
        assert allocate(record.root, "pinned.web", busy, set()) == (busy, f"port {busy} is in use"), "a port a service asks for that is in use blocks it, saying which"
        services_module.PORTS = range(busy, busy + 1)
        try:
            assert allocate(record.root, "none.web", None, set()) == (0, f"no port free from {busy} through {busy}"), "an exhausted port range blocks the service with its range"
        finally:
            services_module.PORTS = range(8440, 8500)


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
    from tests.kit import dispatch
    from features.plugins.paths import data
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
    from tests.kit import run
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
    from http.server import BaseHTTPRequestHandler, HTTPServer
    from features import FEATURES
    from features.plugins.host import Host
    from controllers.types import Notices, Todos

    class Answering(BaseHTTPRequestHandler):
        payloads = []

        def do_POST(self):
            Answering.payloads.append(json.loads(self.rfile.read(int(self.headers["Content-Length"]))))
            self.send_response(200)
            self.end_headers()
            self.wfile.write(b'{"notice": {"title": "Posted the new to-do"}}')

        def log_message(self, *_):
            pass
    server = HTTPServer(("127.0.0.1", 0), Answering)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    installed(record, "answerer", "exit 0", on={"todo.created": {"run": "sh answer.sh"}})
    script = folder(record.root, "answerer") / "answer.sh"
    script.write_text("exit 1\n")
    host, now = Host(record.root, FEATURES["plugins"].journal), time.time()
    host.step(now)
    open_notices = lambda: [n.title for n in Notices(record, actor=SYSTEM).all() if not n.completed]
    for _ in range(5):
        Todos(record, actor=SYSTEM).create("Something new")
        host.step(now)
    assert open_notices() == ["Plugin answerer is failing"], "a plugin that keeps failing on its events is named once"
    Todos(record, actor=SYSTEM).create("Something newer")
    assert host.step(now) == 0, "and is left alone for a while before the next event reaches it"
    script.write_text("""echo '{"notice": {"title": "Seen the new to-do"}}'\n""")
    assert host.step(now + 61) == 1 and open_notices() == ["Seen the new to-do"], "its answer is applied once it answers again, and the failing notice goes"
    installed(record, "poster", "exit 0", on={"todo.created": {"post": f"http://127.0.0.1:{server.server_port}/event"}})
    host.step(now + 61)
    Todos(record, actor=SYSTEM).create("Posted one")
    host.step(now + 61)
    server.shutdown()
    assert Answering.payloads[-1]["event"] == "todo.created" and "Posted the new to-do" in open_notices(), "an event can be posted to a plugin's server, and its reply is applied"


def test_the_installed_step_fills_the_settings_before_the_install_returns(tmp_path):
    record = fresh("scanner")
    rows = Plugins(record, actor=AGENT)
    manifest = {**WORKS, "name": "scanner", "settings": {"folders": {"type": "list", "default": ""}},
                "installed": "sh scan.sh"}
    made = rows.action("install")(repository(tmp_path, manifest, {"scan.sh": "echo '{\"settings\": {\"folders\": \"src\"}}'\n"}), yes=True)
    assert (rows.load(made.n).settings or {}).get("chosen") == {"folders": "src"}, "what the plugin found is chosen by the time the install is done"
    from engine.events.agents import SessionStarted
    from features.parts import AgentContext
    from features.plugins.recommended import SuggestFittingPlugins
    from features.suggestions.controller import Suggestions
    from tests.kit import project_on
    import features
    repo = project_on("work")
    (repo.project / "app.py").write_text("print('hi')\n")
    subprocess.run(["git", "add", "app.py"], cwd=repo.project, capture_output=True, timeout=30)
    row = Agents(repo.record, actor="system").by_session("claude-1")
    for _ in range(2):
        SuggestFittingPlugins().handle(AgentContext.of(features.FEATURES["plugins"], repo.record, row), SessionStarted())
    suggested = [s for s in Suggestions(repo.record, actor="system").rows.every() if s.title == "Install the Code Commandments plugin"]
    assert len(suggested) == 1 and "written in Python" in suggested[0].brief, \
        "a project written in a language a known plugin judges is offered that plugin once, as a suggestion the user takes or leaves"
