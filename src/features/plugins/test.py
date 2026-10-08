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
from types import SimpleNamespace

from controllers.types import CONTROLLERS, Agents, Plugins
from tests.kit import handle
from engine.keeper import ServiceState
from engine.runtime import folder as runtime_folder
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


def git_head(origin):
    return subprocess.run(["git", "rev-parse", "HEAD"], cwd=origin, capture_output=True, text=True, timeout=30, check=True).stdout.strip()


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
    from features.format import formatted
    installed(record, "spelling", "true\n", chat=[{"find": "colour", "as": "color"}])
    assert formatted("the colour of it", record) == "the color of it", "a plugin's chat rule rewrites what the chat shows"
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


def test_a_guard_that_fails_or_hangs_never_stops_the_agent(monkeypatch):
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
    from features.plugins import queue as lines, run as running
    assert running.call("true", broken.root.parent / "nowhere", {}, {})[0] is False, "a command that cannot be started is a failure, not a crash"
    stubborn_ok, stubborn_why = running.call("trap '' TERM; while :; do sleep 1; done", broken.root.parent, dict(os.environ), {}, 0.2)
    assert (stubborn_ok, "still running" in stubborn_why) == (False, True), "a command that will not stop when asked is killed, and the plugin is told it ran over"
    assert running.stop(SimpleNamespace(pid=2 ** 22 + 1)) is None, "stopping something that is already gone is no error"
    assert [running.read(""), running.read("[]"), running.read("5")[0], running.read("nope")[0]] == [(True, {}), (True, {}), False, False], \
        "an empty reply or an empty list says nothing, and a reply that is no object is a failure"
    with socket.socket(socket.AF_UNIX, socket.SOCK_STREAM) as silent:
        quiet = plugin_socket(broken.root, "quiet")
        quiet.parent.mkdir(parents=True, exist_ok=True)
        quiet.unlink(missing_ok=True)
        silent.bind(str(quiet))
        silent.listen()
        ok, why = running.asked(quiet, {}, 0.2)
        assert (ok, "did not answer" in why) == (False, True), "a service that takes the line and never answers is given up on"
    monkeypatch.setattr(lines, "command_line", lambda: SimpleNamespace(run=lambda argv: (_ for _ in ()).throw(SystemExit(2))))
    assert lines.ran(broken.root, broken.env, "todo list") == (False, "the words were not a journal command (2)"), "a line the command line exits on is refused in words"
    monkeypatch.setattr(lines, "command_line", lambda: SimpleNamespace(run=lambda argv: 1 / 0))
    assert lines.ran(broken.root, broken.env, "todo list") == (False, "division by zero"), "a line that crashes is refused with the reason"
    monkeypatch.undo()
    assert [lines.ran(broken.root, broken.env, line)[0] for line in ("echo 'open", "", "todo list --env x", "no-such-noun", "todo create")] == [False, True, False, False, False], \
        "a queued line that is badly quoted, names an environment, is no journal command or lacks its words is not run, and an empty one is nothing to run"


def test_a_failing_setup_step_installs_nothing_and_says_which_step_failed(tmp_path):
    broken = fresh("broken")
    rows = Plugins(broken, actor=AGENT)
    why = refused(lambda: rows.action("install")(repository(tmp_path, {**WORKS, "name": "broken", "setup": [{"name": "list", "run": ["echo", "listed in {dir}"]}, {"name": "build", "run": "echo building; exit 3"}]}), yes=True))
    assert ("setup step 'build' failed (3): echo building; exit 3" in why, "the whole output is in" in why) == (True, True), \
        "the failing step, its code and its command are named"
    assert "$ echo building; exit 3\nbuilding\n" in log(broken.root, "broken").read_text(), "the log holds each command and the output it printed, as it came"
    assert (rows.all(), [p.name for p in home(broken.root).iterdir()] if home(broken.root).exists() else []) == ([], []), \
        "and nothing is left behind"
    from tests.kit import dispatch
    looked = dispatch("POST", f"/api/{broken.env}/plugins/preview", broken.root, {}, {"source": repository(tmp_path, WORKS, name="looked")})
    assert (looked.code, looked.body["name"]) == (200, "works"), "the viewer previews a plugin before installing it"
    assert [p.name for p in home(broken.root).glob(".staging-*")] == [], "and the preview takes away the copy it fetched"
    fine = fresh("fine")
    plugins = Plugins(fine, actor=AGENT)
    source = repository(tmp_path, WORKS, name="upgraded")
    assert "Nothing is installed yet" in plugins.action("install")(source), "an install shows what it would do before it does it"
    row = plugins.action("install")(source, yes=True)
    assert "is installed from" in refused(lambda: plugins.action("install")(source, yes=True)), "a plugin is installed once"
    assert "is already at" in plugins.action("upgrade")(row.n), "an upgrade with nothing new says so"
    from tests.kit import dispatch
    looking = lambda: dispatch("POST", f"/api/{fine.env}/plugins/{row.n}/upgrade-preview", fine.root, {}, {}).body["current"]
    assert looking() is True, "the viewer's upgrade preview says when the plugin is current"
    git("commit", "-q", "--allow-empty", "-m", "two", cwd=tmp_path / "upgraded")
    assert "Nothing has changed yet" in plugins.action("upgrade")(row.n), "an upgrade shows what it would change before it does it"
    assert looking() is False, "and when there is something new"
    git("tag", "v1.1.0", cwd=tmp_path / "upgraded")
    pinned = plugins.action("upgrade")(row.n, yes=True, ref=git_head(tmp_path / "upgraded"))
    assert (pinned.commit != row.commit, pinned.revision) == (True, ""), "and moves the plugin to the new commit, the commit that confirmed it never becoming the ref it follows"
    git("commit", "-q", "--allow-empty", "-m", "three", cwd=tmp_path / "upgraded")
    git("tag", "v1.2.0", cwd=tmp_path / "upgraded")
    assert looking() is False, "a later check fetches the newest release the source gained, not the commit it was upgraded to"
    assert plugins.action("upgrade")(row.n, yes=True, ref=git_head(tmp_path / "upgraded")).commit == git_head(tmp_path / "upgraded"), "and the upgrade lands on it"
    assert (plugins.action("disable")(row.n).enabled, plugins.action("enable")(row.n).enabled) == (False, True), "a plugin is switched off and on again"
    assert "remove it first" in refused(lambda: plugins.action("purge")(row.n)), "what an installed plugin keeps is never purged"
    plugins.complete(row.n, "removed")
    assert "is gone" in plugins.action("purge")(row.n), "once removed, what it kept can be purged"
    again = plugins.action("install")(source, yes=True)
    assert (again.n, bool(again.completed), len(Plugins(fine, actor=SYSTEM).rows.every())) == (row.n, False, 1), "a plugin removed and installed again comes back as the same row"
    copy = Plugins(fine, actor=SYSTEM).create(again.title, manifest=again.manifest, source=again.source)
    Plugins(fine, actor=SYSTEM).complete(copy.n, "removed")
    from migrations.m0075_plugins_installed_once import run as fold
    assert (len(fold(fine.root)), [kept.n for kept in Plugins(fine, actor=SYSTEM).rows.every(deleted=True)]) == (1, [row.n]), \
        "an upgrade folds the copies of a plugin installed twice into the one still installed"
    plugins.complete(row.n, "removed")
    newer = Plugins(fine, actor=SYSTEM).create(again.title, manifest=again.manifest, source=again.source)
    Plugins(fine, actor=SYSTEM).complete(newer.n, "removed")
    assert (len(fold(fine.root)), [kept.n for kept in Plugins(fine, actor=SYSTEM).rows.every(deleted=True)], fold(fine.root)) == (1, [newer.n], []), \
        "with every copy removed the newest is kept, and a second upgrade finds nothing to fold"
    from features.plugins import staging
    assert staging.address("owner/repo") == "https://github.com/owner/repo", "an owner and a repository name is a repository on GitHub"
    assert "neither a repository URL" in refused(lambda: staging.address("no such place")), "a source that is no repository and no folder is refused"
    assert "Could not reach" in refused(lambda: plugins.action("install")((tmp_path / "missing").as_uri(), yes=True)), "a repository that cannot be fetched is refused and leaves nothing behind"
    badly = repository(tmp_path, {"name": "X Y"}, name="badly")
    assert "name must be" in refused(lambda: plugins.action("install")(badly, yes=True)), "a repository whose manifest is wrong is refused"
    assert list(home(fine.root).glob(".staging-*")) == [], "and the copy fetched for it is taken away"
    linked = tmp_path / "linked"
    (linked / MANIFEST).parent.mkdir(parents=True)
    (linked / MANIFEST).write_text(json.dumps({**WORKS, "name": "linked", "setup": [], "requires": {"nothere": {"check": "false", "hint": "install nothere"}}}))
    assert "needs nothere: install nothere" in refused(lambda: plugins.action("install")(str(linked), yes=True)), "a tool a plugin requires and the machine lacks is named with how to get it"
    (linked / MANIFEST).write_text(json.dumps({**WORKS, "name": "linked", "setup": []}))
    shown = plugins.action("preview")(repository(tmp_path, WORKS, name="peeked"))
    assert "works" in shown.lower() and "peeked" not in str(list(home(fine.root).glob(".staging-*"))), "a plugin can be looked at without installing it, and leaves no copy"
    in_place = plugins.action("install")(str(linked), yes=True)
    assert in_place.linked, "a folder on this machine is installed in place, not copied"
    assert plugins.action("upgrade")(in_place.n, again=True).linked, "a plugin installed in place is read again, and its setup run again, on request"
    from features.plugins.lifecycle import clear, difference
    link = tmp_path / "a-link"
    link.symlink_to(linked)
    clear(link)
    assert (link.exists(), linked.exists()) == (False, True), "taking a plugin's place removes a link, never the folder it points to"
    old_commands, new_commands = Manifest.of({"name": "x", "setup": [{"name": "build", "run": "make old"}]}), Manifest.of({"name": "x", "setup": [{"name": "build", "run": "make new"}]})
    assert (difference(old_commands, new_commands).splitlines()[1:], difference(old_commands, old_commands)) == (
        ["  no longer: setup build: make old", "  now also: setup build: make new"], "It runs the same commands as the version you have."), \
        "an upgrade says which commands the plugin no longer runs and which it newly runs"
    ghost = Plugins(fine, actor=SYSTEM).create("ghost", enabled=True, token="t", settings={}, manifest={})
    Plugins(fine, actor=SYSTEM).complete(ghost.n, "removed")
    assert "never named itself" in refused(lambda: plugins.action("purge")(ghost.n)), "a plugin that never named itself kept nothing to purge"
    held = staging.alone(fine.root, "twice")
    assert "is being installed already" in refused(lambda: staging.alone(fine.root, "twice")), "the same plugin is not installed twice at once"
    held.close()



def test_a_chosen_setting_reaches_the_plugins_commands():
    from features.plugins.commands import Configure
    from features.plugins.declared import settings_of
    from features.plugins.environment import environment
    record = alone()
    row = installed(record, "linter", "exit 0", settings={"quiet": {"title": "Quiet", "default": "", "env": "QUIET"}})
    plugins = Plugins(record, actor=SYSTEM)
    assert environment(record.root, "linter", Manifest.of(row.manifest), row.token)["QUIET"] == "", "unchanged, a setting is its default"
    from tests.kit import dispatch
    light = dispatch("GET", f"/api/{record.env}/dashboard", record.root, {"types": "plugin"}, {}).body["rows"]["plugin"]["rows"][0]["data"]["manifest"]
    whole = dispatch("GET", f"/api/{record.env}/plugin", record.root, {}, {}).body["rows"][0]["data"]["manifest"]
    assert (light["name"], "settings" in light, "settings" in whole) == ("linter", False, True), \
        "the dashboard's plugin rows leave out the manifest's settings, and the plugin's own list keeps them"
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
    Path(queued).write_text('todo create "Elsewhere again" --env ' + record.env + "\n")
    assert host.drained(["linter"]) == 1 and len(Notices(Record(record.root, "other"), actor=SYSTEM).all()) == 1, \
        "the host drains a plugin's queue in turn, and what it refuses is told through the same notice"
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
                      events={"sin-found": {"title": "Sin found", "tone": "warn", "card": {"icon": "warn"}}, "checked": {"title": "Checked"}})
    assert "true or false" in refused(lambda: Configure().run(None, plugins, typed.n, "on", "yes")), "a switch takes true or false"
    assert "one of low, high" in refused(lambda: Configure().run(None, plugins, typed.n, "level", "mid")), "options take one of theirs"
    from features.secrets.values import ValuesFile
    from resources.base import USER
    ValuesFile(record.root).put("STRIPE_TEST_KEY", "sk-test-plugin-77")
    payer = installed(record, "payer", "exit 0", settings={"stripe": {"type": "secret", "env": "STRIPE_KEY"}})
    given = lambda: environment(record.root, "payer", Manifest.of(payer.manifest), payer.token, chosen=settings_of(plugins.load(payer.n)).chosen)["STRIPE_KEY"]
    assert given() == "", "a plugin gets no secret until it is given one"
    from features.plugins import manifest
    assert manifest.typed({"stripe": {"type": "secret", "env": "STRIPE_KEY"}})["stripe"]["type"] == "secret", "a plugin.json may ask for a secret"
    assert "only you give payer a secret" in refused(lambda: Configure().run(None, plugins, payer.n, "stripe", "STRIPE_TEST_KEY")), "an agent never gives one"
    Configure().run(None, Plugins(record, actor=USER), payer.n, "stripe", "STRIPE_TEST_KEY")
    assert given() == "sk-test-plugin-77", "once you pick the secret for it, its services get the value in their variable"
    from features.plugins.answer import KEYS, apply
    from features.plugins.environment import ports_for
    from features.plugins.declared import Setting
    assert [Setting(key="a", env="HOME").summary, Setting(key="a", title="Title").summary, Setting(key="a").summary] == ["reads HOME", "Title", "a"], \
        "a setting is summed up by the variable it reads, else its title, else its key"
    assert "is a number" in refused(lambda: Setting(key="n", kind="number").check("x")) and Setting(key="n", kind="number").check("-3.5") is None, "a number setting takes numbers"
    before = settings_of(plugins.load(typed.n)).chosen
    apply(record, None, "nobody-installed", "", {"settings": {"level": "high"}})
    assert settings_of(plugins.load(typed.n)).chosen == before, "a plugin that is not installed fills in nothing"
    from features.plugins.payload import resource
    assert [resource(record, SimpleNamespace(type="nothing", n=1)), resource(record, SimpleNamespace(type="todo", n=99999))] == [None, None], \
        "an event of a type nobody controls, or of a row that is gone, carries no row"
    assert isinstance(ports_for(record.root, Manifest.of({"name": "portly", "services": {"web": {"run": "true", "port": "auto"}}}))["web"], int), "a service that asks for a port is given one"
    apply(record, None, "typed", "", {"settings": {"level": "high", "made-up": "x"}})
    assert settings_of(plugins.load(typed.n)).chosen == {"level": "high"}, "a plugin may fill in a setting it worked out, and only its own"
    stamp = plugins.load(typed.n).updated
    apply(record, None, "typed", "", {"settings": {"level": "high"}})
    assert plugins.load(typed.n).updated == stamp, "a setting filled in with the value it has changes nothing"
    from features import FEATURES
    from engine import bus
    apply(record, FEATURES["plugins"].journal, "typed", "", {"raise": {"event": "sin-found", "brief": "before any agent"}, "say": "before any agent"})
    assert Agents(record, actor=SYSTEM).all() == [], "with no agent to tell, a plugin's card and words wait for nobody"
    heard = []
    Agents(record, actor=AGENT).create("s-1")
    off = bus.on("typed.sin-found", lambda event, record: heard.append(event.data["brief"]))
    apply(record, FEATURES["plugins"].journal, "typed", "", {"raise": {"event": "sin-found", "brief": "deep-nesting at src/A.php:12"}})
    raised = [e for e in record.event_log.events() if e.action == "raised"][-1]
    assert (raised.data["title"], raised.data["tone"], raised.data["brief"], heard) == ("Sin found", "warn", "deep-nesting at src/A.php:12", ["deep-nesting at src/A.php:12"]), \
        "a plugin raises an event it declared, styled from its manifest, and anything listening by its name hears it"
    apply(record, FEATURES["plugins"].journal, "typed", "", {"raise": {"event": "checked", "brief": "all clean"}})
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
    Raise().run(None, plugins, "typed", "sin-found", "keyed one", key="sin:1")
    Raise().run(None, plugins, "typed", "sin-found", "keyed two", key="sin:2")
    from features.plugins.commands import Settle
    Settle().run(None, plugins, "typed", "sin:1", "repented")
    marks = {card["detail"]: card for card in Agents(record, actor=SYSTEM).primary().data["cards"] if card["detail"].startswith("keyed")}
    assert (marks["keyed one"]["tone"], marks["keyed one"]["settled"], marks["keyed two"]["tone"], "settled" in marks["keyed two"]) == ("good", "repented", "warn", False), \
        "journal plugin settle turns only the cards with that key good and keeps their text"
    first = Agents(record, actor=SYSTEM).rows.standing()[0]
    Agents(record, actor=SYSTEM).card(first.n, label="old mark", plugin="typed", settle="sin:9")
    for n in range(30):
        Agents(record, actor=SYSTEM).create(f"s-more-{n}")
    Settle().run(None, plugins, "typed", "sin:9", "repented")
    assert Agents(record, actor=SYSTEM).load(first.n).data["cards"][-1]["settled"] == "repented", \
        "settle reaches a mark on the oldest agent row, past the last 25 rows"
    off()
    assert apply(record, FEATURES["plugins"].journal, "typed", "", {"raise": {"event": "made-up"}}) == [], "an event the manifest does not declare is refused"
    everything = {"whisper": "psst", "say": "hello", "notify": {"title": "Heads up", "brief": "b"}, "notice": "A notice", "todo": {"title": "From a plugin"},
                  "hold": "wait", "raise": [{"event": "sin-found"}, {"event": "sin-found"}], "settings": "not a dict"}
    assert apply(record, FEATURES["plugins"].journal, "typed", "", everything) == list(KEYS), "a plugin's answer may whisper, say, notify, notice, file a to-do, hold and raise"
    assert "From a plugin" in [t.title for t in Todos(record, actor=SYSTEM).all()], "a to-do a plugin answers with is filed"
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
        ({"name": "pp", "journal": "99.0.0", "fitz": {}}, "this is 2.0.0: upgrade the journal"),
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
        ({"name": "pp", "requires": {"a": 5}}, "requires.a is an object with"),
        ({"name": "pp", "on": {"todo.created": {"post": ""}}}, 'is a command, or {"post"'),
        ({"name": "pp", "pages": "x"}, "pages is a list"), ({"name": "pp", "pages": ["x"]}, "each page is an object"),
        ({"name": "pp", "services": {"web": {"run": "x"}}, "pages": [{"service": "api"}]}, "names service 'api', which is not declared"),
        ({"name": "pp", "dashboards": "x"}, "dashboards is a list"), ({"name": "pp", "dashboards": [{"title": "T"}]}, "each dashboard is an object with a name"),
    ]:
        (bad / MANIFEST).parent.mkdir(parents=True, exist_ok=True)
        (bad / MANIFEST).write_text(given if isinstance(given, str) else json.dumps(given))
        assert words in refused(lambda: read(bad, "2.0.0")), (given, words)
    (bad / MANIFEST).write_text(json.dumps({"name": "pp", "setup": ["echo a", {"run": ["echo", "b"], "cwd": "sub"}], "cancels": {"agent.command.long": "true"},
                                            "services": {"web": {"run": "true"}}, "chat": [{"find": "x", "as": "y"}], "refuse": ["true"],
                                            "on": {"todo.created": {"post": "http://x"}}, "pages": [{"service": "web"}]}))
    made = read(bad, "2.0.0")
    assert [(page.name, page.title, page.path) for page in made.pages] == [("web", "Pp", "/")], "a page is named after its service and opens at the root unless it says"
    assert (made.setup[0].name, made.setup[1].cwd, made.refuse, made.chat[0].replacement) == ("step 1", "sub", ["true"], "y"), \
        "a manifest may give setup as bare commands or steps, a refuse as a word list, a chat rule and a post handler"


def test_a_service_no_plugin_declares_is_stopped_and_forgotten(monkeypatch):
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
    from features import FEATURES
    from features.plugins.services import notice_stopped
    from controllers.types import Notices
    installed(record, "server", "exit 0", services={"web": {"run": "serve {port} {dir}", "port": "auto", "env": {"WHERE": "{dir}"}}},
              pages=[{"name": "home", "title": "Home", "service": "web", "path": "/start"}])
    spec, = plugin_services(record.root, set())
    assert (spec.id, spec.run, spec.env["WHERE"]) == ("server.web", f"serve {spec.port} {folder(record.root, 'server')}", str(folder(record.root, "server"))), \
        "a service a plugin declares runs on a port of its own, with its port and folder filled into its command and env"
    status_file(record.root, "server.web").write_text(json.dumps({"state": "failed", "why": "it crashed"}))
    assert notice_stopped(record.root, FEATURES["plugins"]) == ["server.web"] and notice_stopped(record.root, FEATURES["plugins"]) == [], "a service that stops is told once"
    status_file(record.root, "server.web").write_text(json.dumps({"state": "ready"}))
    notice_stopped(record.root, FEATURES["plugins"])
    assert [n.title for n in Notices(record, actor=SYSTEM).all() if not n.completed and "server.web" in n.title] == [], "and the notice goes once it runs again"
    from tests.kit import dispatch
    page, = dispatch("GET", "/api/pages", record.root, {}, {}).body
    assert (page["plugin"], page["title"], page["state"], page["url"].endswith("/start")) == ("server", "Home", "ready", True), \
        "the viewer lists a plugin's pages with the state of the service behind each"
    from engine.services import DOWN, service_spec, want_file
    with socket.socket() as probe:
        probe.bind(("127.0.0.1", 0))
        held_port = probe.getsockname()[1]
    status_file(record.root, "held.web").write_text(json.dumps({"state": "ready", "port": held_port}))
    assert allocate(record.root, "held.web", "auto", set()) == (held_port, ""), "a service that already had a free port keeps it"
    assert allocate(record.root, "held.web", "auto", {held_port})[0] != held_port, "unless another service has taken it in the meantime"

    now, started = [1000.0], []
    nowhere = 4194999
    keeper = Manager(record.root, clock=lambda: now[0], start=lambda spec, lifeline: started.append(spec.id) or 0, living=lambda pid: pid == nowhere)
    spec = lambda sid, **fields: service_spec(record.root, sid, plugin="w", service=sid, run=["true"], **fields)
    down = spec("down.web")
    status_file(record.root, "down.web").write_text(json.dumps({"state": "ready", "keeper": nowhere}))
    want_file(record.root, "down.web").write_text(json.dumps({"want": DOWN}))
    assert keeper.one(down) is False and started == [], "a service the user took down is asked to stop and not started"
    blocked = spec("blocked.web", blocked="no token set")
    assert keeper.one(blocked) is False and status(record.root, "blocked.web").why == "no token set", "a service that cannot start says why"
    status_file(record.root, "booting.web").write_text(json.dumps({"state": "starting", "keeper": 0, "at": now[0]}))
    assert keeper.one(spec("booting.web")) is False and started == [], "a service that was only just started is given time to come up"
    status_file(record.root, "never.web").write_text(json.dumps({"state": "exited"}))
    never = spec("never.web", restart="never")
    keeper.one(never)
    now[0] += 5.0
    assert keeper.one(never) is False and started == [], "a service that must never restart stays down once it has ended"
    for number in range(5):
        status_file(record.root, "flaky.web").write_text(json.dumps({"state": "exited", "at": now[0]}))
        keeper.seen.clear()
        keeper.one(spec("flaky.web"))
        now[0] += 1.0
    assert status(record.root, "flaky.web").state == "failed" and keeper.waiting["flaky.web"] > now[0], "a service that keeps dying is marked failed and tried again after a wait"
    assert keeper.one(spec("flaky.web")) is False, "and is left alone until the wait is over"
    asked = spec("asked.web", when="exit 3")
    assert "answered 3" in keeper.unneeded(asked, now[0]) and "answered 3" in keeper.unneeded(asked, now[0] + 1.0), "a service that is not needed here says what the check answered, and the answer is kept for a while"
    marker = record.root / "release-binary"
    unready = spec("unready.web", when=f"test -e {marker} || exit 127")
    assert "not ready yet" in keeper.unneeded(unready, now[0]), "a check whose command is not there yet says the service is not ready, not that it is not needed"
    marker.write_text("")
    assert keeper.unneeded(unready, now[0] + 16.0) == "", "and is asked again within seconds, so the service starts once the plugin's setup has written the command"
    from engine import services
    monkeypatch.setattr(services, "ASKED_WITHIN", 0.2)
    unaskable = spec("unaskable.web", when="sleep 5")
    assert "could not be asked" in keeper.unneeded(unaskable, now[0]), "a check that cannot answer in time is not a reason to start the service"
    stray = subprocess.Popen(["sleep", "30"], start_new_session=True)
    status_file(record.root, "stray.web").write_text(json.dumps({"state": "running", "keeper": 0, "pgid": stray.pid}))
    assert keeper.sweep() == [stray.pid] and stray.wait(timeout=5) is not None and status(record.root, "stray.web").why == "its keeper is gone", \
        "a process group whose keeper is gone is stopped and its service marked stopped"


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
    (record.root.parent / "app.csproj").write_text("")
    for sid, when in (("idle.web", "echo no C# here; exit 1"), ("busy.web", "test -f app.csproj")):
        manager.one(ServiceSpec(id=sid, plugin=sid.split(".")[0], service="web", run=["true"], cwd=str(record.root / "plugins"), when=when,
                                **files_for(record.root, sid)))
    idle = json.loads(status_file(record.root, "idle.web").read_text())
    assert (started, idle["state"], "no C# here" in idle["why"]) == (["busy.web"], "not needed", True), \
        ("a service whose when-command fails is left unstarted as not needed, with the command's own words; one that answers 0 starts, "
         "asked in the project's folder rather than the service's own")
    want(record.root, "busy.web", UP, nonce=time.time())
    manager.one(ServiceSpec(id="busy.web", plugin="busy", service="web", run=["true"], when="echo none here; exit 1", **files_for(record.root, "busy.web")))
    assert json.loads(status_file(record.root, "busy.web").read_text())["state"] == "not needed", \
        "a restart, as after a plugin upgrade, asks the when-command again instead of keeping the old answer"
    def keeper_ends_at_once(spec, lifeline):
        ServiceState(state="stopped", why="the agent session that started it ended", keeper=4242).write(spec.status)
        return 4242
    Manager(record.root, start=keeper_ends_at_once).one(ServiceSpec(id="quick.web", plugin="quick", service="web", run=["true"], **files_for(record.root, "quick.web")))
    assert (status(record.root, "quick.web").state, status(record.root, "quick.web").why) == ("stopped", "the agent session that started it ended"), \
        "a keeper that ends before the manager has returned from starting it keeps its own state and reason, never overwritten by the manager"
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
    kept = subprocess.Popen([*entry("keeper"), str(lifeline), str(spec_file(record.root, "held.web"))], pass_fds=(lifeline,), stdin=subprocess.DEVNULL,
                            stdout=subprocess.DEVNULL, stderr=subprocess.PIPE, start_new_session=True)
    os.close(lifeline)
    deadline = time.time() + 15
    while time.time() < deadline and status(record.root, "held.web").state != "starting":
        time.sleep(0.1)
    assert (kept.poll(), status(record.root, "held.web").state) == (None, "starting"), "a keeper that finds the lock taken waits for the old holder to let go instead of giving up"
    os.close(writer)
    kept.wait(timeout=15)
    assert "session" in status(record.root, "held.web").why, "a service that stops because the agent session ended says so"
    assert b"RuntimeWarning" not in kept.stderr.read(), "a keeper starts once, with no warning that its module was imported before it ran"
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
    (project / ".git" / "info").mkdir(parents=True, exist_ok=True)
    for name in ("teacher-one", "teacher-two", "teacher-mine"):
        (shipped / name).mkdir(parents=True, exist_ok=True)
        (shipped / name / "SKILL.md").write_text(f"---\nname: {name}\n---\n\nbody\n")
    (project / LIBRARY / "teacher-mine").mkdir(parents=True, exist_ok=True)
    (project / LIBRARY / "teacher-mine" / "SKILL.md").write_text("---\nname: teacher-mine\n---\n")
    published(record.root, "teacher", Manifest.of({"name": "teacher", "skills": "out"}))
    assert "plugin: teacher" in (project / LIBRARY / "teacher-one" / "SKILL.md").read_text(), "a published skill says which plugin it came from"
    assert (project / ".claude" / "skills" / "teacher-one").is_symlink(), "and every agent reads it"
    assert "/teacher-one" in (project / ".git" / "info" / "exclude").read_text(), "a published skill is kept out of the project's commits"
    assert "plugin:" not in (project / LIBRARY / "teacher-mine" / "SKILL.md").read_text(), "a skill of the user's own with the same name is not overwritten"
    from features.plugins.skills import owner, stamped
    assert (stamped("plain body\n", "teacher").startswith("---\nplugin: teacher\n---\nplain"), owner(project / "no-such-skill")) == (True, ""), \
        "a skill with no heading gets one naming its plugin, and a folder with no skill has no owner"
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
    from features.plugins.dashboard import checked as dashboard_checked
    lone = lambda view, **more: {"pages": {"p": {"title": "P", "view": view}}, **more}
    for document, words in [
        ([], "a dashboard is a JSON object"), ({"pages": {}}, "an object of pages"), (lone({"type": "text", "body": "x"}, start="gone"), "is not one of the pages"),
        ({"pages": {"p": []}}, "a page is an object with a title and a view"), (lone({"type": "stat", "label": "L"}), "needs 'value'"),
        (lone({"type": "stat", "label": "L", "value": 1, "tone": "loud"}), "tone is one of"), (lone({"type": "stat", "label": "L", "value": 1, "open": "nowhere"}), "which the dashboard does not have"),
        (lone({"type": "text", "body": "x", "children": []}), "holds no children"), (lone({"type": "list", "items": ["x"]}), "an item is an object with"),
        (lone({"type": "list", "items": [{"label": "a", "tone": "loud"}]}), "tone is one of"),
        (lone({"type": "table", "columns": ["a"], "rows": [{"cells": ["x"], "open": "nowhere"}]}), "rows[0]"),
    ]:
        assert words in refused(lambda: dashboard_checked(document)), (document, words)
    import os
    import time
    from features.plugins.lifecycle import changed_on_disk
    plugins = Plugins(record, actor=SYSTEM)
    plugins.update(row.n, linked=True, read_at=time.time())
    given = folder(record.root, "teacher") / MANIFEST
    given.parent.mkdir(parents=True, exist_ok=True)
    given.write_text(json.dumps({"name": "teacher", "dashboards": [{"name": "sins", "title": "Sins"}, {"name": "trend", "title": "Trend"}]}))
    os.utime(given, (time.time() + 5, time.time() + 5))
    assert changed_on_disk(plugins, plugins.load(row.n)), "a linked plugin's manifest changed in place is noticed"
    from tests.kit import tick
    tick(record)
    assert [d["name"] for d in plugins.load(row.n).manifest["dashboards"]] == ["sins", "trend"], "and read again without an upgrade"


def test_a_row_a_plugin_creates_is_its_own_locked_and_goes_with_it(monkeypatch):
    from engine.services import DOWN, wanted
    from tests.kit import run
    record = alone()
    plugin = installed(record, "checker", "exit 0", services={"web": {"run": "sleep 30"}})
    assert run(["--root", str(record.root), "--plugin", "checker", "check", "create", "The code keeps its shape", "--set", "command=sh check.sh"]) == 0
    assert run(["--root", str(record.root), "--plugin", "checker", "check", "create", "The code keeps its shape", "--set", "command=sh check-v2.sh"]) == 0
    assert [c.data["command"] for c in CONTROLLERS["check"](record, actor=USER).all()] == ["sh check-v2.sh"], \
        "running its setup again updates the row it owns instead of making a second one"
    check = next(r for r in CONTROLLERS["check"](record, actor=USER).all())
    assert (check.data.get("plugin"), check.data.get("locked")) == ("checker", True), "a row a plugin creates is stamped as its own and locked"
    assert "belongs to the checker plugin" in refused(lambda: CONTROLLERS["check"](record, actor=USER).delete(check.n, "tidy")), "nobody else removes it"
    Plugins(record, actor=USER).complete(plugin.n, "removed")
    assert [r.n for r in CONTROLLERS["check"](record, actor=USER).all(deleted=True, completed=True)] == [], "removing the plugin removes what it created"
    assert (wanted(record.root, "checker.web"), folder(record.root, "checker").exists()) == (DOWN, False), \
        "its service is asked to stop and its folder is gone"
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
    script.write_text("true\n")
    Todos(record, actor=SYSTEM).create("Answered with nothing")
    assert host.step(now + 61) == 1 and open_notices() == ["Seen the new to-do"], "an answer that says nothing changes nothing"
    from resources.base import PLUGIN
    Todos(record, actor=PLUGIN).create("Made by the answerer itself", plugin="answerer")
    assert host.step(now + 61) == 0, "a plugin is not told of the rows it made itself"
    installed(record, "watcher", "exit 0", on={"plugin.updated": "true"}, load={"todo.created": ["journal"]})
    Plugins(record, actor=SYSTEM).update(plugin.n, abstract="looked at again")
    Todos(record, actor=SYSTEM).create("One more for the watcher")
    assert host.step(now + 61) >= 1, "a plugin hears of other plugins changing, and the skills it loads on an event are asked for"
    installed(record, "poster", "exit 0", on={"todo.created": {"post": f"http://127.0.0.1:{server.server_port}/event"}})
    host.step(now + 61)
    Todos(record, actor=SYSTEM).create("Posted one")
    host.step(now + 61)
    server.shutdown()
    assert Answering.payloads[-1]["event"] == "todo.created" and "Posted the new to-do" in open_notices(), "an event can be posted to a plugin's server, and its reply is applied"
    import features.plugins.host as hosting
    from features.plugins.queue import Refusal
    ok, why = hosting.post(f"http://127.0.0.1:{server.server_port}/event", {}, "t0ken")
    assert (ok, "did not answer" in why) == (False, True), "a plugin server that is gone does not answer, and that is a failure, not a crash"
    Todos(record, actor=SYSTEM).create("Posted after it went away")
    host.step(now + 200)
    assert "poster" in host.trouble, "a plugin whose server does not answer is marked as in trouble"
    Todos(record, actor=SYSTEM).create("Far too old")
    assert host.step(now + 100000) == 0, "an event older than the replay window is passed over, not delivered late"
    told = lambda: [n.title for n in Notices(record, actor=SYSTEM).all() if n.title.endswith("a line the journal refused")]
    host.refusal("answerer", Refusal(record.env, "todo", "no such word"))
    host.refusal("answerer", Refusal(record.env, "todo", "no such word"))
    assert told() == ["Plugin answerer queued a line the journal refused"], "the same refusal of a plugin's line is told once"
    watched = []
    monkeypatch.setattr(hosting.Host, "step", lambda self, now=0.0: 1 / 0)
    monkeypatch.setattr(hosting, "threw", lambda root, env, where: watched.append(where))
    monkeypatch.setattr(hosting.time, "sleep", lambda seconds: (_ for _ in ()).throw(SystemExit))
    with pytest.raises(SystemExit):
        hosting.watch(record.root, FEATURES["plugins"].journal)
    assert watched == ["delivering events to plugins"], "a step that crashes is reported and the host carries on"
    import fcntl
    with (runtime_folder(record.root) / "plugins.lock").open("w") as held:
        fcntl.flock(held, fcntl.LOCK_EX | fcntl.LOCK_NB)
        assert hosting.watch(record.root, FEATURES["plugins"].journal) is None, "a second host in the same journal leaves at once"


def test_the_installed_step_fills_the_settings_before_the_install_returns(tmp_path, monkeypatch):
    record = fresh("scanner")
    rows = Plugins(record, actor=AGENT)
    manifest = {**WORKS, "name": "scanner", "settings": {"folders": {"type": "list", "default": ""}},
                "installed": "sh scan.sh"}
    made = rows.action("install")(repository(tmp_path, manifest, {"scan.sh": "echo '{\"settings\": {\"folders\": \"src\"}}'\n"}), yes=True)
    assert (rows.load(made.n).settings or {}).get("chosen") == {"folders": "src"}, "what the plugin found is chosen by the time the install is done"


def test_a_plugin_that_fits_the_project_is_suggested_and_installs_the_commit_it_showed(tmp_path, monkeypatch):
    from features.plugins import fitting
    from features.plugins.manifest import fits, read
    for given in ("PHP", {"languages": "PHP"}, {"language": ["PHP"]}, {"files": []}, {"files": [3]}):
        assert "plugin.json: fits" in refused(lambda: fits(given)), f"a plugin that declares {given!r} as the projects it fits is refused in plain words"
    declaring = tmp_path / "declaring"
    (declaring / MANIFEST).parent.mkdir(parents=True)
    (declaring / MANIFEST).write_text(json.dumps({**WORKS, "name": "declaring", "fits": {"languages": ["PHP"], "files": ["*.csproj"]}}))
    assert read(declaring).fits.found({"PHP"}, ["a/App.csproj", "b.txt"]) == ["PHP", "App.csproj"], "a declared fit names the languages and the files it matched"
    from engine.worktree import tracked_files
    spread = tmp_path / "spread"
    (spread / "shop").mkdir(parents=True)
    (spread / "shop" / "Order.cs").write_text("class Order {}\n")
    subprocess.run(["git", "init", "-q"], cwd=spread / "shop", capture_output=True, timeout=30)
    subprocess.run(["git", "add", "Order.cs"], cwd=spread / "shop", capture_output=True, timeout=30)
    assert fitting.written_in(tracked_files(spread)) == {"C#"}, \
        "a project that is no repository itself is read through the repositories inside it, so their languages count"
    from engine.events.engine import ClockTicked
    from features.parts import AgentContext
    from features.suggestions.controller import Suggestions
    from controllers.types import Todos
    from tests.kit import project_on
    import features
    fitting_manifest = {**WORKS, "fits": {"languages": ["Python"]}}
    listed = repository(tmp_path, [], {"plugins.json": json.dumps([
        {"source": repository(tmp_path, {**fitting_manifest, "name": "snake"}, name="snake"), "title": "Snake"},
        {"source": repository(tmp_path, {**WORKS, "name": "gem", "fits": {"languages": ["Ruby"], "files": ["Gemfile"]}}, name="gem"), "title": "Gem"},
        {"source": repository(tmp_path, {**fitting_manifest, "name": "broken", "setup": [{"name": "boom", "run": "echo no disk left >&2; exit 3"}]}, name="broken"), "title": "Broken"},
        {"source": str(tmp_path / "nowhere"), "title": "Nowhere"},
    ])}, name="official")
    monkeypatch.setenv("AGENT_JOURNAL_REPO", repository(tmp_path, [], {"plugins.json": "not a list"}, name="garbled"))
    assert fitting.official(tmp_path) == [], "an official list that does not read is no list"
    monkeypatch.setenv("AGENT_JOURNAL_REPO", listed)
    repo = project_on("work")
    (repo.project / "app.py").write_text("print('hi')\n")
    subprocess.run(["git", "add", "app.py"], cwd=repo.project, capture_output=True, timeout=30)
    agents = Agents(repo.record, actor="system")
    row = agents.by_session("claude-1")
    fresh_start = AgentContext.of(features.FEATURES["plugins"], repo.record, agents.stamp(row.n, started=time.time()))
    fitting.SuggestFittingPlugins().handle(fresh_start, ClockTicked())
    assert Suggestions(repo.record, actor="system").rows.every() == [], "a session that has just started is suggested nothing"
    from types import SimpleNamespace
    from controllers.types import Environments
    place = Environments(repo.record, actor="system").create(repo.record.env)
    assert (fitting.in_use_since(repo.record, SimpleNamespace(started=None)), fitting.in_use_since(repo.record, SimpleNamespace(started=place.created - 7200))) == \
        (place.created, place.created - 7200), "a project counts from whichever began first, its environment or the agent's session, so a project in use for an hour is suggested at once"
    row = agents.stamp(row.n, started=time.time() - fitting.WORKED_FIRST - 1)
    context = AgentContext.of(features.FEATURES["plugins"], repo.record, row)

    def started():
        fitting.SuggestFittingPlugins().handle(context, ClockTicked())
        for thread in [t for t in threading.enumerate() if t.name == "plugin-fit"]:
            thread.join(60)
        return {s.title: s for s in Suggestions(repo.record, actor="system").rows.every()}

    asked = []
    official = fitting.official
    monkeypatch.setattr(fitting, "official", lambda root: asked.append(root) or official(root))
    suggested = started()
    started()
    assert sorted(suggested) == ["Install the Broken plugin", "Install the Snake plugin"], \
        f"a listed plugin whose declared languages the project is written in is suggested, and one that declares other languages is not: {sorted(suggested)}"
    assert len(asked) == 1, "the official list is read once a day, not at every session start"
    from dataclasses import replace
    monkeypatch.setattr(fitting, "OPEN_SUGGESTIONS", 0)
    another = replace(next(o for o in fitting.offers_kept(repo.record.root) if o.title == "Snake"), source="elsewhere", title="Another snake")
    fitting.suggest(repo.record, [another])
    assert "Install the Another snake plugin" not in {s.title for s in Suggestions(repo.record, actor="system").rows.every()}, "no more suggestions wait than the cap allows"
    assert "written" not in suggested["Install the Snake plugin"].brief and "Python" in suggested["Install the Snake plugin"].brief, "the suggestion says which part of the project fits"
    snake = suggested["Install the Snake plugin"]
    assert len(snake.brief) < 160 and "setup" not in snake.brief and any("setup" in line for line in snake.data["runs"]), \
        f"the suggestion says in one short line why it fits, and keeps the commands it runs aside for 'See what it runs': {snake.brief}"
    pinned = snake.data["commit"]
    assert (len(pinned), snake.data["name"], [o["title"] for o in snake.data["options"]]) == (40, "Snake", ["Yes, I want this", "Change it first", "No, don't do this"]), \
        "a plugin suggestion names the commit it was read from, the plugin and the three answers"
    git("commit", "-q", "--allow-empty", "-m", "later", cwd=tmp_path / "snake")
    Suggestions(repo.record, actor=USER).install(snake.n)
    assert [(r.source, r.commit) for r in Plugins(repo.record, actor="system").rows.every()] == [(snake.data["plugin"], pinned)], \
        "yes installs exactly the commit the suggestion showed, right away"
    installed = Suggestions(repo.record, actor="system").load(snake.n)
    assert (Todos(repo.record, actor="system").rows.every(), installed.decision, installed.data["installed"]) == \
        ([], "install", Plugins(repo.record, actor="system").rows.every()[0].ref), "and no to-do stands between the yes and the install, which the suggestion links"
    marks = [c for c in Agents(repo.record, actor="system").primary().data["cards"] if c.get("side") == "user"]
    assert [(m["key"], m["label"], m["name"], m["state"]) for m in marks] == [(f"install:{snake.n}:1", "Installed", "snake", "done")], \
        f"the chat holds one install mark, on the user's side, that went from installing to installed: {marks}"
    broken = suggested["Install the Broken plugin"]
    why = refused(lambda: Suggestions(repo.record, actor=USER).install(broken.n))
    card = Agents(repo.record, actor="system").primary().data["cards"][-1]
    held = Suggestions(repo.record, actor="system").load(broken.n)
    assert ("boom" in why, "no disk left" in card["detail"], card["label"], card["name"], held.completed, held.data["install"]["state"]) == \
        (True, True, "Install failed for", "Broken", 0.0, "failed"), f"a failed install shows in the chat with its reason, and the suggestion stays open: {why} / {card}"
    assert [r.source for r in Plugins(repo.record, actor="system").rows.every()] == [snake.data["plugin"]], "and nothing is left half installed"
    release = threading.Event()
    monkeypatch.setattr(fitting, "official", lambda root: release.wait(30) and [])
    (repo.record.root / "runtime" / fitting.KEPT).unlink()
    began = time.monotonic()
    fitting.SuggestFittingPlugins().handle(context, ClockTicked())
    stalled = [t for t in threading.enumerate() if t.name == "plugin-fit"]
    assert time.monotonic() - began < 5 and stalled, "a session start returns at once while the official list is still being read"
    release.set()
    for thread in stalled:
        thread.join(60)
    monkeypatch.setenv("AGENT_JOURNAL_REPO", str(tmp_path / "nowhere"))
    monkeypatch.setattr(fitting, "official", official)
    (repo.record.root / "runtime" / fitting.KEPT).unlink()
    assert sorted(started()) == ["Install the Broken plugin", "Install the Snake plugin"], "a list that cannot be reached adds nothing and breaks nothing"
