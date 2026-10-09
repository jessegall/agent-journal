import fcntl
from dataclasses import replace
import json
import os
import subprocess
from pathlib import Path
import tarfile
import time

import pytest
from types import SimpleNamespace

import features.auto_update.check as updates
import features.auto_update.relaunch as relaunching
from engine.heal import ledger
from engine.stored import write_json
from controllers.types import Features
from features import load
from resources.base import SYSTEM
from tests.conftest import fresh
from features.journal_laws import managed


def test_the_update_check_tells_the_agent_of_a_newer_version_once_when_it_does_not_install_itself(monkeypatch):
    load()
    record = fresh()
    Features(record, actor=SYSTEM).switch("auto_update", False)
    record.set_setting("triggers", {"auto_update": {"every": 0, "unit": "minutes"}})
    sent = []
    check = updates.UpdateCheck(SimpleNamespace(record=record, driver=SimpleNamespace(send=sent.append)))
    monkeypatch.setattr(updates, "upstream", lambda root: "99.0.0")
    check.tick()
    check.tick()
    assert [line for line in sent if line.startswith("journal 99.0.0 is out")] == sent and len(sent) == 1, "told once, with the version it would install"
    monkeypatch.setattr(updates, "upstream", lambda root: "0.0.1")
    check.tick()
    assert len(sent) == 1, "an older published version says nothing"
    write_json(ledger(record.root), {"builds": ["journal-98.0.0-0123456789.pyz"], "at": {"journal-98.0.0-0123456789.pyz": time.time()}})
    monkeypatch.setattr(updates, "upstream", lambda root: "98.0.0")
    check.tick()
    check.checked_at = 0.0
    check.tick()
    assert ([line for line in sent if "98.0.0 is out" in line], len([line for line in sent if "98.0.0" in line])) == ([], 1), \
        "a version that would not start here is never offered again, and its failure is told once"
    del sent[1:]
    Features(record, actor=SYSTEM).switch("auto_update", True)
    record.set_setting("auto_update", {"installs": "patches"})
    installing = []
    monkeypatch.setattr(updates, "version", lambda: "2.249.6")
    monkeypatch.setattr(check, "install", lambda feature, latest: installing.append(latest))
    monkeypatch.setattr(updates, "stale", lambda root: False)
    monkeypatch.setattr(updates, "upstream", lambda root: "2.249.7")
    check.checked_at = 0.0
    assert check.tick() == "installing 2.249.7", "a patch installs by itself when patches are chosen"
    monkeypatch.setattr(updates, "upstream", lambda root: "2.250.0")
    check.checked_at = 0.0
    assert check.tick() == "told of 2.250.0" and sent[-1].startswith("journal 2.250.0 is out"), "a minor version waits for the user"
    record.set_setting("auto_update", {"installs": "sometimes"})
    monkeypatch.setattr(updates, "upstream", lambda root: "3.0.0")
    check.checked_at = 0.0
    assert check.tick() == "installing 3.0.0", "a value that is not one of the choices reads as the default, always"
    from controllers.types import Notices
    from features import FEATURES
    monkeypatch.setattr(updates, "installed", lambda root, yes, version: "package not refreshed: the network was down")
    updates.UpdateCheck.install(check, FEATURES["auto_update"], "3.0.0")
    assert sent[-1].startswith("installing journal 3.0.0 failed") and [n.title for n in Notices(record).all()][-1] == "The journal could not update to 3.0.0", \
        "a failed install is told to the agent and filed as a notice"
    told = len(sent)
    monkeypatch.setattr(updates, "installed", lambda root, yes, version: "")
    updates.UpdateCheck.install(check, FEATURES["auto_update"], "3.0.0")
    assert len(sent) == told, "an install that went well tells nothing; the restart says the rest"
    assert updates.claimed(record.root, "3.0.1", "patches") and not updates.claimed(record.root, "3.0.1", "patches"), "a release just tried waits before it is tried again"
    monkeypatch.setattr(updates, "changed_managed", lambda project, root: [project / "CLAUDE.md"])
    monkeypatch.setattr(updates, "upstream", lambda root: "3.0.2")
    check.checked_at = 0.0
    assert check.tick() == "update held for changed files", "files the user changed hold an update until they say what to do"
    with updates.ledger(record.root).changing() as tried:
        tried["3.0.2"] = {"at": __import__("time").time() - 3600, "tries": 2, "ok": False}
    assert not updates.claimed(record.root, "3.0.2", "major versions") and updates.claimed(record.root, "3.0.2", "always"), \
        "Always tries a failed install again after 30 minutes however often it failed, major versions wait longer each time"
    from tests.kit import dispatch
    monkeypatch.setattr(updates, "journal_repository", lambda project: True)
    assert dispatch("POST", "/api/update", record.root, {}, {}).code == 400, "the journal's own repository is never updated from a release"
    monkeypatch.setattr(updates, "journal_repository", lambda project: False)
    assert dispatch("POST", "/api/update", record.root, {}, {}).body == {"updating": True}, "the viewer's Update button starts an install"
    from features.auto_update import routes
    monkeypatch.setattr(routes, "upstream", lambda root: "99.0.0")
    release = dispatch("GET", "/api/upstream", record.root, {}, {}).body
    assert (release["latest"], release["newer"], release["changed"]) == ("99.0.0", True, []), "the viewer is told the newest release, that it is newer, and which managed files were changed"
    assert dispatch("GET", "/api/changelog", record.root, {}, {}).body["changelog"] == routes.data("CHANGELOG.md").read_text(), \
        "the changelog is the running code's own, whatever journal it serves"
    monkeypatch.setattr(routes, "CHANGELOG", record.root / "CHANGELOG.md")
    assert dispatch("GET", "/api/changelog", record.root, {}, {}).code == 404, "running code without a changelog says so"
    (record.root / "CHANGELOG.md").write_text("# 99.0.0\n")
    page = dispatch("GET", "/api/changelog", record.root, {}, {}).body
    assert (page["changelog"], page["updating"], page["repository"]) == ("# 99.0.0\n", False, False), "the viewer reads the changelog with whether an update is running"
    import install
    installer = record.root / "src" / "install.py"
    installer.parent.mkdir(parents=True, exist_ok=True)
    installer.write_text("generated\n")
    managed.remember_managed(record.root.parent, record.root)
    installer.write_text("changed by hand\n")
    assert dispatch("POST", "/api/update", record.root, {}, {}).body["changed"] == [".journal/src/install.py"], \
        "the Update button refuses files changed by hand"
    assert "--yes" in install.upgrade(record.root.parent, record.root)[0] and installer.read_text() == "changed by hand\n", \
        "journal upgrade refuses the same changed file before touching it"
    assert dispatch("GET", "/api/changelog", record.root, {}, {}).body["changed"] == [".journal/src/install.py"], "the updates page is told which files changed"
    announced = dispatch("GET", "/api/new-feature", record.root, {}, {})
    assert (announced.code, isinstance(announced.body, list)) == (200, True), "the viewer asks the server which new features are not yet seen, and an empty list means none"
    from features.auto_update import new_feature
    notes = ('## 2.9.0 — Two\n<!-- new-feature {"id": "owl", "title": "Owl", "text": "Hoot", "button": "Use it"} -->\n\n'
             '## 2.8.0 — One\n<!-- new-feature {"id": "squire", "title": "Squire", "text": "Hail", "button": "Use it"} -->\n')
    assert [one.id for one in new_feature.unseen(record.root, notes)] == ["squire", "owl"], "the new features of releases an update skipped over queue, oldest first"
    new_feature.mark_seen(record.root, "squire")
    new_feature.mark_seen(record.root, "squire")
    assert ([one.id for one in new_feature.unseen(record.root, notes)], new_feature.seen(record.root)) == (["owl"], ["squire"]), \
        "a new feature seen on the server is not announced again, wherever the viewer is opened next"
    assert dispatch("POST", "/api/new-feature", record.root, {}, {"id": "owl"}).code == 200 and new_feature.unseen(record.root, notes) == [], \
        "the viewer tells the server which new feature it has shown"
    from controllers.types import Agents
    from engine import runtime
    from features.auto_update.waiting import running, wait_for_commands
    from tests.kit import report
    started = time.time()
    report(record, "working", "PreToolUse", session="claude-9", provider="claude", commands=[{"command": "npm test", "tool": "Bash", "at": started}],
           running={"command": "npm test", "tool": "Bash", "at": started})
    steps = []
    gave_up = wait_for_commands(record.root, steps.append, wait=0.05, every=0.01)
    closed = Agents(record, actor=SYSTEM).by_session("claude-9")
    assert (len(running(record.root)), bool(closed.running.get("done")), steps[:1], gave_up[0].startswith("gave up waiting for `npm test`")) == \
        (0, True, ["Waiting for 1 running command to finish"], True), "an update waits a bounded time for the commands in flight, then names the one it gave up on and marks it ended"
    assert wait_for_commands(record.root, steps.append, wait=0.05, every=0.01) == [], "with nothing running the update does not wait"
    import threading
    from features.auto_update import countdown
    assert (countdown.wait(record.root, "2.9.0", seconds=0.1, every=0.01), countdown.remaining(record.root)) == (True, {"version": "2.9.0", "seconds": 0, "starting": True}), \
        "an automatic update that is not cancelled runs after its countdown, and is reported as starting until its upgrade holds the mark"
    runtime.upgrade_mark(record.root).write_text("Preparing the update")
    assert countdown.remaining(record.root) == {}, "once the upgrade holds the mark the steps take over from the countdown"
    runtime.upgrade_mark(record.root).unlink()
    countdown.cancel(record.root)
    counted = []
    runner = threading.Thread(target=lambda: counted.append(countdown.wait(record.root, "2.9.1", seconds=5, every=0.01)))
    runner.start()
    time.sleep(0.1)
    assert countdown.remaining(record.root)["version"] == "2.9.1" and dispatch("GET", "/api/summary", record.root, {}, {}).body["countdown"]["version"] == "2.9.1", \
        "the viewer is told which update is counting down"
    assert dispatch("POST", "/api/update/cancel", record.root, {}, {}).code == 200
    runner.join(2)
    assert (counted, countdown.remaining(record.root)) == ([False], {}), "cancelling the countdown skips that update"
    from engine import inputs
    from engine.sessions import Sessions
    from features.auto_update import pausing
    for session, pid in (("claude-1", 1111), ("claude-2", 4242)):
        Sessions(record.root).write(session, pid=pid)
    monkeypatch.setattr(pausing, "live", lambda root: [(None, SimpleNamespace(session=name, provider="claude")) for name in ("claude-1", "claude-2")])
    monkeypatch.setattr(pausing, "ancestors", lambda: {4242})

    def queued() -> list:
        return sorted((one.session, one.action, one.value) for one in (inputs.read_json(path, inputs.Input.from_json, None) for path in runtime.inputs(record.root).glob("*.json")) if one)

    assert pausing.pause_all(record.root) == ["paused 1 agent for the update"] and queued()[-1:] == [("claude-1", inputs.PAUSE, inputs.UPDATE)], \
        "an update pauses every live agent for the update, but the one whose own command runs it"
    runtime.upgrade_mark(record.root).write_text("Installing the new files")
    assert (pausing.resume_when_done(record.root), len(pausing.paused(record.root))) == (0, 1), "the agents stay paused while the update runs"
    runtime.upgrade_mark(record.root).unlink()
    assert (pausing.resume_when_done(record.root), pausing.paused(record.root), ("claude-1", inputs.RESUME, inputs.UPDATE) in queued()) == (1, [], True), \
        "once the update is over they are resumed, each told so, once"
    assert pausing.resume_when_done(record.root) == 0
    from features.auto_update import waiting
    report(record, "working", "PreToolUse", session="claude-8", provider="claude", commands=[{"command": "python3 src/journal.py --root .journal upgrade --yes", "tool": "Bash", "at": time.time()}],
           running={"command": "python3 src/journal.py --root .journal upgrade --yes", "tool": "Bash", "at": time.time()})
    began = time.time()
    assert (wait_for_commands(record.root, steps.append, wait=5, every=0.01), time.time() - began < 1) == ([], True), \
        "the command that runs the upgrade is never waited for, nor marked ended"
    report(record, "working", "PreToolUse", session="claude-8", provider="claude", commands=[{"command": "npm test", "tool": "Bash", "at": time.time()}],
           running={"command": "npm test", "tool": "Bash", "at": time.time()})
    kept = waiting.ancestors, waiting.pid_of
    waiting.ancestors, waiting.pid_of = lambda: {4242}, lambda sessions, row: 4242
    try:
        began = time.time()
        assert (wait_for_commands(record.root, steps.append, wait=5, every=0.01), time.time() - began < 1) == ([], True), \
            "a command run by an agent that is a parent of the upgrade is the upgrade's own, and is never waited for"
    finally:
        waiting.ancestors, waiting.pid_of = kept
    runtime.upgrade_mark(record.root).write_text("Migrating the record")
    assert runtime.upgrade_step(record.root) == "Migrating the record", "the running upgrade says which step it is on, in the mark it holds"
    runtime.upgrade_mark(record.root).unlink()
    monkeypatch.setattr(routes, "release_versions", lambda: ["2.263.0", "2.262.0", "2.250.0"])
    monkeypatch.setattr(routes, "version", lambda: "2.263.0")
    assert dispatch("GET", "/api/releases", record.root, {}, {}).body == {"versions": ["2.262.0", "2.250.0"]}, "the updates page lists the released versions except the one running"
    asked = []
    monkeypatch.setattr(updates, "installed", lambda root, yes, version: asked.append((yes, version)) or "")
    assert dispatch("POST", "/api/update", record.root, {}, {"yes": True, "version": "1.0.0"}).code == 400, "a version that was never released is refused"
    dispatch("POST", "/api/update", record.root, {}, {"yes": True, "version": "2.250.0"})
    for _ in range(100):
        if asked:
            break
        time.sleep(0.05)
    assert asked == [(True, "2.250.0")], "picking an earlier version installs exactly that version"
    agents = record.root.parent / "AGENTS.md"
    from features.journal_laws.briefing import brief
    installer.write_text("generated\n")
    brief(record.root.parent, record)
    managed.remember_managed(record.root.parent, record.root)
    agents.write_text(agents.read_text() + "\nA line of the project's own.\n")
    assert managed.changed_managed(record.root.parent, record.root) == [], "a line outside the journal's block is not a change to its file"
    bytecode = record.root / "src" / "engine" / "__pycache__" / "numbers.cpython-314.pyc"
    bytecode.parent.mkdir(parents=True, exist_ok=True)
    bytecode.write_bytes(b"compiled")
    assert bytecode not in managed.managed_paths(record.root.parent, record.root) and managed.changed_managed(record.root.parent, record.root) == [], \
        "bytecode Python writes beside the code is neither managed nor read, so a write racing the read cannot fail it"
    assert managed.managed_hash(record.root / "src" / "removed.py") == managed.managed_hash(record.root / "src" / "never.py"), \
        "a file an upgrade removed between listing and reading holds nothing, and is no error"
    from engine import runtime
    agents.write_text(agents.read_text().replace("form 2 (auto-generated", "form 2 (edited by hand"))
    runtime.upgrade_mark(record.root).touch()
    assert managed.changed_managed(record.root.parent, record.root) == [], "while an upgrade holds its mark, nothing is checked against the files it is rewriting"
    runtime.upgrade_mark(record.root).unlink()
    agents.write_text(agents.read_text().replace("form 2 (edited by hand", "form 2 (auto-generated"))
    agents.write_text(agents.read_text().replace("form 2 (auto-generated", "form 2 (edited by hand"))
    installer.write_text("changed by hand\n")
    assert install.archive_changed(record.root.parent, record.root, managed.changed_managed(record.root.parent, record.root)).is_file(), "updating anyway copies the changed files to the attic first"
    installer.write_text("generated\n")
    check.checked_at = 0.0
    assert check.tick() == "update held for changed files", "automatic updates wait for a decision about changed files"
    installer.write_text("generated\n")
    Features(record, actor=SYSTEM).switch("auto_update", False)
    record.set_setting("triggers", {"auto_update": {"every": 5, "unit": "minutes"}})
    monkeypatch.setattr(updates, "stale", lambda root: True)
    check.checked_at = 0.0
    check.tick()
    assert 5 * 60 - updates.REFETCH_WAIT - 2 < time.time() - check.checked_at, "a stale published version is looked at again once it is fetched, not five minutes later"
    from controllers.types import Agents
    from engine import runtime
    from resources.types import IDLE
    from engine.sessions import Sessions
    from agents.terminal import LAUNCH
    row = Agents(record).by_session("conversation-1")
    driver = SimpleNamespace(session="claude-1", last_report=lambda: Agents(record).load(row.n))
    state = {"now": "working"}
    relaunch = relaunching.Relaunch(SimpleNamespace(record=record, driver=driver, state=lambda: state["now"]))
    Sessions(record.root).write("claude-1", launch=LAUNCH - 1)
    assert relaunch.tick() == "" and not runtime.relaunch_file(record.root, "claude-1").exists(), "a busy agent is never restarted"
    state["now"] = IDLE
    assert relaunch.tick() == "relaunching", "an idle agent launched the old way is restarted"
    assert "conversation-1" in json.loads(runtime.relaunch_file(record.root, "claude-1").read_text())["command"], "in the same conversation"
    Sessions(record.root).write("claude-1", launch=LAUNCH)
    assert relaunch.tick() == "", "one launched the current way is left alone"
    from supervisor import stop
    stubborn = subprocess.Popen(["sh", "-c", "trap '' HUP TERM; sleep 30"])
    began = time.time()
    stop(stubborn.pid, grace=0.2)
    assert stubborn.poll() is not None and time.time() - began < 5, "an agent that ignores the polite signals is still stopped, so a restart never hangs"


def test_the_installed_command_runs_quietly_before_any_server_has_started(tmp_path, monkeypatch):
    import sys
    from install import launcher
    script = tmp_path / "said.py"
    script.write_text("print('ran')")
    shim = tmp_path / "journal"
    shim.write_text(launcher(sys.executable, script, tmp_path / ".journal"))
    ran = subprocess.run(["sh", str(shim), "todo", "all"], capture_output=True, text=True, timeout=20)
    assert (ran.stdout.strip(), ran.stderr) == ("ran", ""), "no heartbeat file yet: it falls through to the package without an error"
    import time
    (tmp_path / ".journal" / "runtime").mkdir(parents=True)
    (tmp_path / ".journal" / "runtime" / "heartbeat").write_text(f"{int(time.time())} http://127.0.0.1:9/\n")
    ran = subprocess.run(["sh", str(shim), "todo", "all"], capture_output=True, text=True, timeout=20)
    assert (ran.stdout.strip(), ran.stderr) == ("ran", ""), "a fresh heartbeat but no server answering, as during a restart: it falls through too"
    from install import ON_PATH, put_on_path
    home = tmp_path / "home"
    (home / ".local" / "bin").mkdir(parents=True)
    for name, value in (("HOME", str(home)), ("SHELL", "/bin/bash"), ("PATH", "/usr/bin:/bin")):
        monkeypatch.setenv(name, value)
    told = put_on_path(home / ".local" / "bin")
    put_on_path(home / ".local" / "bin")
    profile = (home / ".bash_profile").read_text()
    assert "open a new terminal" in told and profile.count(ON_PATH) == 1 and 'export PATH="$HOME/.local/bin:$PATH"' in profile, \
        "a journal command off the PATH puts its folder on the PATH once, in the shell's own profile, and says so"
    monkeypatch.setenv("PATH", f"{home / '.local' / 'bin'}:/usr/bin")
    assert put_on_path(home / ".local" / "bin") == "", "a folder already on the PATH is left as it is"


def test_the_journals_hook_py_runs_the_current_hook_for_an_older_command_that_passes_nothing(tmp_path):
    import sys
    from install import HOOK
    (tmp_path / "src").mkdir()
    (tmp_path / "src" / "hook.sh").write_text('echo "$1 $2"\n')
    (tmp_path / "hook.py").write_text(HOOK)
    ran = subprocess.run([sys.executable, str(tmp_path / "hook.py")], capture_output=True, text=True, timeout=20)
    assert ran.stdout.strip() == f"claude {tmp_path.resolve()}", "no provider given: Claude, on the journal hook.py sits in"
    from install import ENTRYPOINTS
    assert all(text.startswith("#!/usr/bin/env python3") for text in ENTRYPOINTS.values()), "an entry made executable runs with Python, never the shell"


def test_an_install_over_version_1_leaves_only_its_own_hooks(tmp_path):
    import json
    from install import configure
    (tmp_path / ".claude").mkdir()
    (tmp_path / ".git" / "hooks").mkdir(parents=True)
    walk = 'd="${CLAUDE_PROJECT_DIR:-$PWD}"; if [ -x "$d/.journal/hook.py" ]; then exec "$d/.journal/hook.py"; fi'
    direct = f"python3 {tmp_path}/.journal/hook.py claude"
    mine = {"type": "command", "command": "echo not the journal"}
    (tmp_path / ".claude" / "settings.json").write_text(json.dumps({"hooks": {"Stop": [{"hooks": [{"type": "command", "command": walk}]},
                                                                                  {"hooks": [{"type": "command", "command": direct}]}, {"hooks": [mine]}]}}))
    (tmp_path / ".git" / "hooks" / "post-commit").write_text('#!/bin/sh\n# agent-journal: a commit that names a to-do closes it.\n"$top/.journal/journal.py" todos from-commit HEAD\n')
    configure(tmp_path, tmp_path / ".journal")
    commands = lambda name: [h["command"] for block in json.loads((tmp_path / ".claude" / name).read_text())["hooks"]["Stop"] for h in block["hooks"]]
    assert commands("settings.json") == ["echo not the journal"], "the shared file keeps only what is not the journal's"
    assert [c.split("/")[-1] for c in commands("settings.local.json")] == [".journal"], "the journal's hook is wired per person, where every worktree reads it"
    assert not (tmp_path / ".git" / "hooks" / "post-commit").exists(), "version 1's git hook calls a command that is gone"


def test_a_new_version_is_announced_to_the_user_without_breaking_the_server():
    from controllers.types import Notifications
    from features.auto_update.announcing import announce
    from features.journal_laws.managed import LEGACY_COPY_MARKER
    record = fresh()
    announce(record.root, "1.0.0")
    copy_note = record.root / "runtime" / LEGACY_COPY_MARKER
    copy_note.parent.mkdir(parents=True, exist_ok=True)
    copy_note.write_text(".journal/attic/before-update-1.0.0-123")
    assert announce(record.root, "1.0.1") == "1.0.1"
    from engine.runtime import default_env
    from engine.record import Record
    notified = [n for n in Notifications(Record(record.root, default_env(record.root))).rows.every() if n.title == "Journal updated to 1.0.1"]
    from features.auto_update.new_feature import new_features
    notes = ('# Changelog\n\n## 2.9.0 — A voice\n- It talks.\n<!-- new-feature {"id": "squire", "title": "New chat voice: the Squire", "text": "Hail!", '
             '"button": "Use the Squire voice", "profile": "Squire", "art": "squire.png"} -->\n\n## 2.8.0 — Fixes\n- Fixed.\n\n'
             '## 2.7.0 — Broken\n<!-- new-feature {not json} -->\n')
    found = new_features(notes)
    assert ([(one.id, one.version, one.profile, one.art, one.eyebrow) for one in found]
            == [("squire", "2.9.0", "Squire", "announcements/squire.png", "Hey, new feature")]), \
        "a changelog entry announces a new feature beside its notes, with the artwork file shipped with it; an entry that announces none or announces it wrong adds nothing"
    assert (len(notified), "user" in notified[0].seen) == (1, True), "announced once, already seen"
    assert ".journal/attic/before-update-1.0.0-123" in notified[0].brief and not copy_note.exists(), \
        "the update notice names the copy of legacy managed files once"


def test_a_launch_installs_a_newer_version_first_and_starts_again_on_it(monkeypatch):
    import features
    from tests.kit import launch_update as launch
    features.load()
    record = fresh()
    ran = []
    monkeypatch.setattr(launch, "fetched", lambda cache: cache.parent.mkdir(parents=True, exist_ok=True) or cache.write_text("99.0.0"))
    monkeypatch.setattr("install.upgrade", lambda project, root: ran.append("upgrade") or ["package refreshed"])
    monkeypatch.setattr(launch.os, "execv", lambda python, argv: ran.append("started again"))
    Features(record, actor=SYSTEM).switch("auto_update", False)
    launch.latest_first(record)
    assert ran == [], "with auto-update off, the launch leaves the newer version to the banner"
    Features(record, actor=SYSTEM).switch("auto_update", True)
    launch.latest_first(record)
    assert ran == ["upgrade", "started again"], "with auto-update on, a newer published version is installed, then the launch starts again on it"
    ran.clear()
    monkeypatch.setattr(launch, "fetched", lambda cache: cache.write_text("0.0.1"))
    assert (launch.latest_first(record), ran) == ("", []), "already current: the launch goes straight on"
    monkeypatch.setattr(launch, "fetched", lambda cache: cache.write_text("99.0.0"))
    monkeypatch.setattr("install.upgrade", lambda project, root: ["! the package could not be fetched"])
    monkeypatch.setattr(launch, "failure_in", lambda lines: lines[0])
    assert (launch.latest_first(record), ran) == ("! the package could not be fetched", []), "a failed install is said and the launch goes on, never started again"
    monkeypatch.setattr(launch, "fetched", lambda cache: 1 / 0)
    assert "the update check did not finish" in launch.latest_first(record), "an update check that breaks is said, and the launch goes on"
    monkeypatch.setattr(launch, "journal_repository", lambda project: True)
    assert launch.latest_first(record) == "", "the journal's own repository is never updated over itself"
    import sys
    from types import SimpleNamespace
    from features.auto_update import check
    upgrade = lambda code, script: [sys.executable, "-c", f"import sys, time\n{script}\nsys.exit({code})"]
    monkeypatch.setattr(check, "entry", lambda name: upgrade(3, "print('could not start')\nprint('')"))
    assert check.installed(record.root, True, "") == "could not start", "a failed upgrade reports the last line it printed"
    monkeypatch.setattr(check, "entry", lambda name: upgrade(3, "pass"))
    assert check.installed(record.root, False, "") == "journal upgrade failed with exit 3", "a failed upgrade that printed nothing still names its exit"
    monkeypatch.setattr(check, "entry", lambda name: upgrade(0, "time.sleep(30)"))
    monkeypatch.setattr(check, "INSTALL_WAIT", 1)
    assert "was stopped after" in check.installed(record.root, False, ""), "an upgrade that never finishes is stopped"
    monkeypatch.setattr(check, "entry", lambda name: upgrade(0, "print('install failed halfway')"))
    assert check.installed(record.root, False, "") == "install failed halfway", "an upgrade that exits well but says it failed is a failure"
    monkeypatch.setattr(check, "entry", lambda name: upgrade(0, "print('all done')"))
    assert check.installed(record.root, False, "") == "", "an upgrade that says nothing is wrong has not failed"
    updating = check.UpdateCheck(SimpleNamespace(record=record))
    updating.installing.acquire()
    assert updating.install(None, "99.0.0") is None, "an install already running is not started a second time"
    assert [check.first_refusal(record.root, "9.9.9"), check.first_refusal(record.root, "9.9.9")] == [True, False], "a refused version is told once"
    from tests.conftest import refused
    feature = features.FEATURES["auto_update"]
    assert "takes ['latest', 'why']" in refused(lambda: feature.line_text("failed", latest="9.9.9")), "a line is filled with every value it names and no other"
    assert "no line named 'nothing'" in refused(lambda: feature.line_text("nothing")), "a feature says plainly when it has no such line"


def test_a_launch_repairs_a_half_done_upgrade_and_says_when_records_were_lost(tmp_path, monkeypatch):
    import json
    import shutil
    import sys
    from pathlib import Path
    import features
    from tests.kit import launch_update as launch
    from controllers.types import Notices
    from engine.record import Record
    from install import git_env, version_file
    here = Path(__file__).resolve().parents[2]
    release = tmp_path / "release"
    shutil.copytree(here, release / "src", ignore=shutil.ignore_patterns("__pycache__", "node_modules"))
    shutil.copy2(version_file(here), release / "VERSION")
    for step in (["init", "-q"], ["add", "-A"], ["commit", "-q", "-m", "release"], ["tag", f"v{version_file(here).read_text().strip()}"]):
        subprocess.run(["git", "-c", "user.name=t", "-c", "user.email=t@t", *step], cwd=release, capture_output=True, timeout=60, env=git_env())
    monkeypatch.setenv("AGENT_JOURNAL_REPO", str(release))
    project = tmp_path / "project"
    project.mkdir()
    subprocess.run([sys.executable, str(here / "install.py"), "upgrade", str(project)], env={"HOME": str(tmp_path), "PATH": "/usr/bin:/bin", "AGENT_JOURNAL_BOOTSTRAPPED": "1", "AGENT_JOURNAL_REPO": str(release)},
                   capture_output=True, timeout=120)
    root = project / ".journal"
    shutil.copy2(here / "__main__.py", root / "src" / "__main__.py")
    features.load()
    record = Record(root, "main")
    monkeypatch.setattr(launch, "restart", lambda root: None)
    launch.repaired(record)
    assert not (root / "src" / "__main__.py").exists() and (root / "journal.pyz").resolve().name.startswith("journal-"), "a half-done install is packed at launch"
    ledger = json.loads((root / "migrations.json").read_text())
    (root / "migrations.json").write_text(json.dumps({**ledger, "m0000_project_resources": {"result": "project records moved into resources/: doc"}}))
    shutil.rmtree(root / "project")
    assert launch.repaired(record) == launch.LOST and launch.repaired(record) == "", "records lost to 2.84.0 are said once, plainly"
    assert [n.title for n in Notices(record, actor="system").all()].count(launch.LOST) == 1


def test_an_upgrade_reads_a_package_under_src_and_never_empties_an_install(tmp_path, monkeypatch):
    import install
    moved, flat, empty, target = tmp_path / "moved", tmp_path / "flat", tmp_path / "empty", tmp_path / "target"
    for base in (moved / "src", flat):
        (base / "engine").mkdir(parents=True)
        (base / "install.py").write_text("# installer\n")
        (base / "engine" / "clock.py").write_text("TICK = 1\n")
    empty.mkdir()
    (target / "engine").mkdir(parents=True)
    (target / "engine" / "clock.py").write_text("TICK = 0\n")
    install.refresh(moved, target)
    assert (target / "engine" / "clock.py").read_text() == "TICK = 1\n", "a release that keeps its code under src/ is read from there"
    install.refresh(flat, target)
    assert (target / "install.py").is_file(), "a release laid out the old way still installs"
    with pytest.raises(OSError, match="holds no journal package"):
        install.refresh(empty, target)
    assert (target / "engine" / "clock.py").is_file(), "a source with no package retires nothing"
    root = tmp_path.resolve()
    assert install.installed_here(root, root / "journal-2.1.0-abc.pyz"), "an older build beside the record fetches the release rather than reading itself"
    assert not install.installed_here(root, moved), "a checkout elsewhere is read as the package"
    journal = tmp_path / "project" / ".journal"
    (journal / "environments" / "main").mkdir(parents=True)
    (journal / "environments" / "main" / "todo.json").write_text("{}")
    (journal / "runtime").mkdir()
    kept = install.keep_copy(journal)
    saved = list((journal / "attic").glob("before-*.tar.gz"))
    assert len(saved) == 1 and kept.startswith("a copy of the record is kept in"), "an upgrade starts by keeping a copy of the record in the attic"
    with tarfile.open(saved[0]) as archive:
        assert "environments/main/todo.json" in archive.getnames() and not any(name.startswith(("runtime", "attic")) for name in archive.getnames()), \
            "the copy holds the record and nothing of the runtime or earlier copies"
    assert "under an hour old" in install.keep_copy(journal) and len(list((journal / "attic").glob("before-*.tar.gz"))) == 1, \
        "a copy of the record that is under an hour old is not made again"
    with (journal / "runtime" / "upgrade.lock").open("a") as held:
        fcntl.flock(held, fcntl.LOCK_EX | fcntl.LOCK_NB)
        assert install.upgrade(journal.parent, journal) == ["another upgrade of this journal is running; this one stepped aside"], \
            "an upgrade started while another holds the lock steps aside and changes nothing"
    monkeypatch.setattr(install, "PACKAGE", journal.resolve() / "journal.pyz")
    monkeypatch.delenv(install.BOOTSTRAPPED, raising=False)
    monkeypatch.setenv(install.REPOSITORY_ENV, str(tmp_path / "no-such-repository"))
    refused = install.upgrade(journal.parent, journal)
    assert refused[-1].startswith("package not refreshed:"), f"a repository that cannot be fetched is named, not installed: {refused}"

    assert install.refresh(target, target) == (set(), set()), "a package refreshed from itself changes nothing"
    (moved / "src" / "web").mkdir()
    with pytest.raises(OSError, match="no finished viewer build"):
        install.refresh(moved, target)
    (moved / "src" / "web" / "dist").mkdir()
    (moved / "src" / "web" / "dist" / "index.html").write_text("<html>")
    (target / "engine" / "old.py").write_text("GONE = 1\n")
    (target / "hook.py").write_text("retired")
    (target / "support").mkdir()
    (target / "support" / "tool.py").write_text("retired")
    changed, gone = install.refresh(moved, target)
    assert (Path("engine/old.py") in gone, Path("web/dist/index.html") in changed, (target / "hook.py").exists(), (target / "support").exists()) == (True, True, False, False), \
        "a refresh retires files the release dropped and the old entry points, and brings the viewer build"
    assert install.retire(target) >= 2 and (target / "journal.py").read_text() == install.ENTRYPOINTS["journal.py"], "retiring leaves only the entry points of a journal"

    assert (install.with_token("https://github.com/a/b.git", "s3"), install.with_token("https://elsewhere.org/a", "s3"), install.with_token("https://github.com/a", "")) == \
        ("https://x-access-token:s3@github.com/a/b.git", "https://elsewhere.org/a", "https://github.com/a"), "a token goes into a github address only"
    assert (install.redacted("fatal: s3 was refused", "s3"), install.redacted("unchanged", "")) == ("fatal: the token was refused", "unchanged"), "a token never reaches a message"
    monkeypatch.setattr(install.shutil, "which", lambda name: None)
    assert install.token() == "", "without the github tool there is no token"
    monkeypatch.setattr(install.shutil, "which", lambda name: "/usr/bin/gh")
    results = iter([OSError("no gh"), SimpleNamespace(returncode=1, stdout="nope"), SimpleNamespace(returncode=0, stdout="abc\n")])

    def ran(*args, **kwargs):
        result = next(results)
        if isinstance(result, Exception):
            raise result
        return result
    monkeypatch.setattr(install.subprocess, "run", ran)
    assert [install.token(), install.token(), install.token()] == ["", "", "abc"], "a token comes only from a gh that answers well"
    monkeypatch.undo()
    assert install.fetch(tmp_path / "nowhere", str(tmp_path / "no-such-source"))[1], "a fetch that git refuses reports why and installs nothing"
    for k in range(3):
        (journal / "attic" / f"before-1.0.{k}-{k}.tar.gz").write_text("old")
        os.utime(journal / "attic" / f"before-1.0.{k}-{k}.tar.gz", (k + 1, k + 1))
    install.keep_copy(journal)
    assert len(list((journal / "attic").glob("before-*.tar.gz"))) == install.KEPT_COPIES, "only the newest copy of the record is kept"
    assert install.keep_copy(tmp_path / "no-record") == "", "a project with no record keeps no copy"

    import sys
    site = tmp_path / "site"
    site_root = site / ".journal"
    (site_root / "src").mkdir(parents=True)
    with monkeypatch.context() as patch:
        patch.setattr(install.subprocess, "run", lambda *args, **kwargs: (_ for _ in ()).throw(OSError("no git here")))
        assert install.fetch(tmp_path / "nowhere") == ("", "no git here"), "a git that cannot start is a failed fetch with its reason, not a crash"
    with monkeypatch.context() as patch:
        patch.setattr(install, "keep_copy", lambda record: "")
        patch.setattr(install, "installed_here", lambda *args: True)
        patch.delenv(install.BOOTSTRAPPED, raising=False)
        patch.setattr(install, "released", lambda *args: "9.9.9")
        patch.setattr(install, "fetch", lambda into, repository=None, ref="": ("", "offline"))
        assert install.upgrading(site, site_root) == ["package not refreshed: offline"], "an upgrade that cannot fetch the release stops with the reason"
        patch.setattr(install, "fetch", lambda into, repository=None, ref="": (into.mkdir(parents=True), ("sha", ""))[1])
        assert install.upgrading(site, site_root)[-1].startswith("package not refreshed: ") and "holds no journal package" in install.upgrading(site, site_root)[-1], \
            "a fetched release that holds no package is refused and nothing is emptied"
        patch.setattr(install, "refresh", lambda source, target: ([], []))
        patch.setattr(install, "version_in", lambda folder, missing="": "1.0.0")
        assert install.upgrading(site, site_root)[-1] == "package refreshed but failed to reach the release: installed 1.0.0, not 9.9.9", \
            "an install that did not reach the release says which version it holds"
        patch.setattr(install, "version_in", lambda folder, missing="": "9.9.9")
        patch.setattr(install, "handed_over", lambda site, site_root, marks=(): ["handed over"])
        assert install.upgrading(site, site_root)[-1] == "handed over", "an install that reached the release hands the rest to its own installer"
    checkout = tmp_path / "checkout"
    subprocess.run(["git", "init", "-q", str(checkout)], check=True, timeout=30)
    with monkeypatch.context() as patch:
        patch.setattr(install, "keep_copy", lambda record: "")
        patch.setattr(install, "PACKAGE", checkout)
        patch.setattr(install, "installed_here", lambda *args: False)
        patch.setattr(install, "refresh", lambda source, target: (_ for _ in ()).throw(OSError("disk full")))
        lines = install.upgrading(site, site_root)
        assert lines[0].startswith("package not pulled") and lines[-1] == "package not refreshed: disk full", \
            "a checkout that cannot pull says so and a refresh that cannot write is reported"
    with monkeypatch.context() as patch:
        patch.setattr(install, "PACKAGE", site_root)
        refreshed = []

        def refuse_a_fetched_package(source, target):
            if source == site_root:
                return refreshed.append(source) or ([], [])
            raise OSError("disk full")
        patch.setattr(install, "refresh", refuse_a_fetched_package)
        patch.setattr(install, "fetch", lambda into, repository=None, ref="": ("", ""))
        patch.setattr(install, "handed_over", lambda *args: ["handed over"])
        patch.setattr(install, "complete", lambda folder: False)
        patch.delenv(install.REPAIRED, raising=False)
        patch.setattr(install, "configure", lambda site, site_root: ["configured"])
        stand_in = replace(install.loaded(), migrate=lambda site_root: [], ship_sequences=lambda site_root: "sequences", ship_profiles=lambda site_root: "profiles",
                           stop_ended=lambda site_root: "no ended session was left running", managed=managed)
        patch.setattr(install, "loaded", lambda: stand_in)
        patch.setattr(install, "retire", lambda site_root: 3)
        patch.setattr(install, "pack", lambda site_root: "packed")
        patch.setattr(managed, "remember_managed", lambda site, site_root: None)
        lines = install.finish(site, site_root)
        assert "package files an older installer did not know: disk full" in lines and "package moved into src/: 3 files out of the record" in lines and lines[-1] == "packed", \
            "a repair that cannot write is said, and the install still configures and packs"
        assert refreshed == [site_root], "a package that is the record itself is refreshed in place"
        (install.code(site_root) / "CHANGELOG.md").write_text('## 2.8.0 — One\n<!-- new-feature {"id": "squire", "title": "Squire", "text": "Hail", "button": "Use it"} -->\n')
        from features.auto_update import new_feature
        assert new_feature.seen(site_root) == [], "nothing is seen before the install ends"
        install.finish(site, site_root)
        assert new_feature.seen(site_root) == ["squire"], "a first install has nothing new to announce: its own changelog's features are seen from the start"
        (site_root / "migrations.json").write_text("{}")
        (install.code(site_root) / "CHANGELOG.md").write_text('## 2.9.0 — Two\n<!-- new-feature {"id": "owl", "title": "Owl", "text": "Hoot", "button": "Use it"} -->\n')
        install.finish(site, site_root)
        assert new_feature.seen(site_root) == ["squire"], "an update of an existing install marks nothing as seen: the features it brings are announced"
        copies = []
        patch.setattr(install, "keep_copy", lambda root: copies.append(root) or "a copy of the record is kept")
        patch.setattr(install, "loaded", lambda: replace(stand_in, migrations_pending=lambda root: False))
        install.finish(site, site_root)
        assert copies == [], "an upgrade with no migration to run keeps no copy of the record"
        patch.setattr(install, "loaded", lambda: replace(stand_in, migrations_pending=lambda root: True))
        assert "a copy of the record is kept" in install.finish(site, site_root) and copies == [site_root], "one that is about to migrate the record keeps a copy first"
        patch.setattr(install, "loaded", lambda: stand_in)
        import importlib.util
        spec = importlib.util.spec_from_file_location("install_unpatched", install.__file__)
        real = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(real)
        packing = site_root.parent / "packing" / ".journal"
        (packing / "src" / "engine").mkdir(parents=True)

        def written(changed: str) -> None:
            for stub in (packing / "src").rglob("*.py"):
                stub.unlink()
            (packing / "src" / "__main__.py").write_text("print('main')\n")
            (packing / "src" / "engine" / "__init__.py").write_text("")
            (packing / "src" / "engine" / "clock.py").write_text(f"NOW = {changed!r}\n")

        compiling = []
        real_compiled = real.compiled
        patch.setattr(real, "compiled", lambda source, name, stamp: compiling.append(name) or real_compiled(source, name, stamp))
        patch.setattr(real, "start_refused", lambda built, root: "")
        patch.setattr(real, "loaded", lambda: SimpleNamespace(held_builds=lambda root: set(), point=lambda root, built: (
            (root / real.ARCHIVE).unlink(missing_ok=True), (root / real.ARCHIVE).symlink_to(built))))
        written("one")
        real.pack(packing)
        first = real.previous_entries(packing)
        assert len(compiling) == 3 and set(first) == {"__main__.py", "engine/__init__.py", "engine/clock.py"}, "the first pack compiles every file"
        compiling.clear()
        written("two")
        real.pack(packing)
        second = real.previous_entries(packing)
        assert (compiling, second["__main__.py"] == first["__main__.py"], second["engine/clock.py"].source) == ([str(packing / real.ARCHIVE / "engine/clock.py")], True, b"NOW = 'two'\n"), \
            "a pack after a change compiles only the file that changed and keeps the other entries as they were"
        patch.setattr(install, "retire", lambda site_root: 0)
        assert "migrations run" not in " ".join(lines) and "record already in shape" in lines, "a record already in shape is said so"
        patch.setattr(managed, "changed_managed", lambda site, site_root: ["a.md"])
        patch.setattr(install, "copy_legacy_managed", lambda site, site_root: ["copied"])
        patch.setattr(managed, "changed_message", lambda site, changed: "files you changed")
        assert install.install(site, site_root) == ["files you changed"], "an install over files the user changed asks first"
        kept = []
        patch.setattr(install, "archive_changed", lambda site, site_root, changed: kept.append(changed))
        patch.setattr(install, "refresh", lambda source, target: ([], []))
        assert install.install(site, site_root, yes=True) == ["copied", "configured"] and kept == [["a.md"]], "a confirmed install keeps the changed files and configures"
    with monkeypatch.context() as patch:
        class Absent:
            def present(self, site):
                return False
        ghostly = replace(install.loaded(), providers={"ghost": Absent})
        patch.setattr(install, "loaded", lambda: ghostly)
        assert install.configure(site, site_root)[-1] == "no agent found here: neither Ghost", "a site with no agent in it is told so"
    broken = tmp_path / "broken"
    broken.mkdir()
    (broken / "install.py").write_text((Path(install.__file__)).read_text())
    ran = subprocess.run([sys.executable, str(broken / "install.py")], env={"PATH": "/usr/bin:/bin", install.HEALED: "1"}, capture_output=True, text=True, timeout=60)
    assert ran.returncode != 0 and "ModuleNotFoundError" in ran.stderr, "an install that was already healed and still has no package fails loudly instead of looping"
    ran = subprocess.run([sys.executable, str(broken / "install.py")], env={"PATH": "/usr/bin:/bin", install.REPOSITORY_ENV: str(tmp_path / "no-repository")}, capture_output=True, text=True, timeout=60)
    assert "could not be fetched" in str(ran.stderr), "an installer with no package beside it and no source to fetch from says what is missing"

    project = tmp_path / "legacy"
    legacy = project / ".journal"
    (legacy / "src").mkdir(parents=True)
    (legacy / "src" / "VERSION").write_text("2.1.0")
    (project / "CLAUDE.md").write_text("# Notes\n")
    assert install.copy_legacy_managed(project, legacy)[0].startswith("Managed files from before this update were copied to .journal/attic/before-update-2.1.0-"), \
        "managed files an older build never recorded are copied aside before the first update that records them"
    assert (legacy / "runtime" / managed.LEGACY_COPY_MARKER).read_text().startswith(".journal/attic/"), "and the copy is named for the announcement"
    managed.remember_managed(project, legacy)
    assert install.copy_legacy_managed(project, legacy) == [], "once the files are recorded nothing more is copied"
    (project / "CLAUDE.md").write_text("# Notes, rewritten by the journal\n")
    managed.remember_rewritten(project, legacy, project / "CLAUDE.md")
    assert managed.changed_managed(project, legacy) == [] and managed.remembered_unchanged(project, legacy, project / "CLAUDE.md"), \
        "a file the journal rewrote itself is remembered as it now is, not taken for the user's change"

    with monkeypatch.context() as patch:
        patch.setattr(install, "listed_variables", lambda: (_ for _ in ()).throw(OSError("no git")))
        assert install.repository_variables() == frozenset(), "without git no variable is dropped"
    silent = tmp_path / "silent.py"
    silent.write_text("import sys\nsys.exit(3)\n")
    assert install.start_refused(silent, legacy) == "it exited with 3 and printed nothing", "a build that will not start and says nothing is named by its exit"
    assert install.pack(legacy) == f"the Python is already in {install.ARCHIVE}", "a journal whose Python is already packed is not packed again"
    with monkeypatch.context() as patch:
        patch.setattr(install, "finish", lambda site, site_root: [f"finished {site.name} in {site_root.name}"])
        assert install.main(["finish", str(project)]) == ["finished legacy in .journal"], "the finish word ends an install begun by an older installer"

    started = []

    class Replaced(Exception):
        pass

    def replaced(program, argv):
        started.append(argv[1])
        raise Replaced()
    with monkeypatch.context() as patch:
        package = tmp_path / "healing"
        (package / install.SRC).mkdir(parents=True)
        (package / install.SRC / "install.py").write_text("# moved\n")
        patch.setattr(install, "PACKAGE", package)
        patch.setattr(install.os, "execv", replaced)
        patch.setattr(install.os, "execve", lambda program, argv, env: started.append((argv[1], env[install.HEALED])))
        with pytest.raises(Replaced):
            install.heal()
        (package / install.SRC / "install.py").unlink()
        patch.setattr(install, "fetch", lambda into: ("", "no network"))
        with pytest.raises(SystemExit, match="could not be fetched: no network"):
            install.heal()
        patch.setattr(install, "fetch", lambda into: ("abc", ""))
        patch.setattr(install, "refresh", lambda source, target: ([], []))
        install.heal()
    assert started == [str(package / install.SRC / "install.py"), (str(package / "install.py"), "1")], \
        "a heal runs the installer under src/ when it is there, else fetches the package and runs again marked as healed"


def test_a_hook_never_waits_more_than_a_moment_for_a_server_that_is_down_slow_or_refusing(tmp_path):
    import http.server
    import socket
    import threading
    import time
    from pathlib import Path
    hook = Path(__file__).resolve().parents[2] / "hook.sh"
    with socket.socket() as probe:
        probe.bind(("127.0.0.1", 0))
        port = probe.getsockname()[1]
    (tmp_path / "runtime").mkdir()
    env = {"PATH": "/usr/bin:/bin:/usr/local/bin:/opt/homebrew/bin", "AGENT_JOURNAL_ACTIVE": "1", "JOURNAL_ENV": "main"}

    def run() -> tuple[subprocess.CompletedProcess, float]:
        began = time.time()
        ran = subprocess.run(["sh", str(hook), "claude", str(tmp_path)], input='{"hook_event_name": "PreToolUse"}', capture_output=True, text=True, env=env, timeout=20)
        return ran, time.time() - began

    def beat(age: int) -> None:
        (tmp_path / "runtime" / "heartbeat").write_text(f"{int(time.time()) - age} http://127.0.0.1:{port}/\n")

    class Answer(http.server.BaseHTTPRequestHandler):
        pause = 0.0

        def do_POST(self):
            self.rfile.read(int(self.headers["Content-Length"]))
            time.sleep(self.pause)
            self.send_response(200)
            self.end_headers()
            self.wfile.write(b'{"reason": "served"}')

        def log_message(self, *_):
            pass

    beat(0)
    (tmp_path / "runtime" / "upgrading").write_text("")
    refused, took = run()
    assert (refused.stdout, took < 1.0) == ("", True), "a server that refuses while it upgrades does not hold the agent: the hook goes on at once"
    (tmp_path / "runtime" / "upgrading").unlink()
    (tmp_path / "runtime" / "hook-failures.log").unlink()
    Answer.pause = 3.0
    server = http.server.ThreadingHTTPServer(("127.0.0.1", port), Answer)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    beat(60)
    slow, took = run()
    assert (slow.stdout, took < 1.0) == ("", True), "a server too slow to beat is asked once, briefly, and the hook goes on"
    logged = (tmp_path / "runtime" / "hook-failures.log").read_text().split()
    assert (logged[1:4], float(logged[4]) >= 0) == (["down", "claude", "main"], True), "and says so in the log, with the machine's load at that moment"
    Answer.pause = 0.0
    beat(0)
    served, _ = run()
    server.shutdown()
    assert served.stdout.strip() == '{"reason": "served"}', "a server that is beating and answers is waited for as before"
    (tmp_path / "runtime" / "heartbeat").unlink()
    gone, took = run()
    assert (gone.stdout, took < 1.0) == ("", True), "with no heartbeat at all the hook goes on at once"


def test_the_release_is_read_from_version_files_and_tags_and_installed_by_its_tag(tmp_path):
    from pathlib import Path
    from engine.version import version
    from install import fetch, released
    repository = Path(__file__).resolve().parents[3]
    assert ((repository / "VERSION").read_text().strip(), (repository / "src" / "VERSION").exists()) == (version(), False), \
        "the release is kept in the root VERSION file alone; installs copy it into the package"
    origin = tmp_path / "origin"
    origin.mkdir()
    git = lambda *args: subprocess.run(["git", "-c", "user.name=t", "-c", "user.email=t@t", *args], cwd=origin, capture_output=True, check=True, timeout=30)
    git("init", "-q")
    for version in ("2.9.0", "2.10.0"):
        (origin / "VERSION").write_text(version)
        git("add", "-A")
        git("commit", "-qm", version)
        git("tag", f"v{version}")
    (origin / "VERSION").write_text("2.11.0-unreleased")
    git("commit", "-qam", "work after the release")
    source = str(origin)
    assert released(source) == "2.10.0", "the newest release is chosen by version, not by name"
    _, failed = fetch(tmp_path / "copy", source, f"refs/tags/v{released(source)}")
    assert (failed, (tmp_path / "copy" / "VERSION").read_text()) == ("", "2.10.0"), "the release tag is installed, not the commits after it"
    import socket
    import time
    import install
    stub = tmp_path / "bin"
    stub.mkdir()
    seen = tmp_path / "prompt"
    (stub / "git").write_text(f'#!/bin/sh\necho "$GIT_TERMINAL_PROMPT" > {seen}\nexit 1\n')
    (stub / "git").chmod(0o755)
    with pytest.MonkeyPatch.context() as patched:
        patched.setenv("PATH", f"{stub}:{__import__('os').environ['PATH']}")
        install.released(source)
    assert seen.read_text().strip() == "0", "a credential prompt never opens over the launch menu"
    hanging = socket.socket()
    hanging.bind(("127.0.0.1", 0))
    hanging.listen(5)
    began = time.time()
    with pytest.MonkeyPatch.context() as patched:
        patched.setattr(install, "LOOKUP_SECONDS", 1)
        waited = install.released(f"http://127.0.0.1:{hanging.getsockname()[1]}/x.git")
    hanging.close()
    assert (waited, time.time() - began < 5) == ("", True), "an unanswering remote costs a bounded wait and no release"

    from engine.record import Record
    from controllers.types import Docs, Facts, Messages, Notifications, Questions, Rules, Todos
    from features.plans.controller import Plans
    from migrations.m0001_the_old_record import run as read_old_record
    old = tmp_path / "old"
    home = old / "environments" / "main"
    (home / "todo").mkdir(parents=True)
    (home / "todo" / "001-first.md").write_text("---\ntitle: First task\nat: 2026-01-01T10:00:00Z\ndone: 2026-01-02T10:00:00Z\nhow: shipped\npriority: 150\nafter: todo 2\n---\nthe body")
    (home / "todo" / "002-second.md").write_text("no front matter at all")
    (home / "pins").mkdir()
    (home / "pins" / "one.md").write_text("pin body")
    write_json(home / "pins.json", {"pins": [{"fact": "A struck claim", "body": "one.md", "struck": "was wrong", "at": "2026-01-01T00:00:00Z"}, {"fact": "A standing claim"}]})
    write_json(home / "reminders.json", {"reminders": [{"text": "Check the logs", "until": "tomorrow", "done": "2026-01-03T00:00:00Z"}]})
    write_json(home / "inbox.json", {"inbox": [{"text": "Please look at this", "kind": "ask", "replies": [{"text": "Looking"}],
                                               "parts": [{"excerpt": "look", "became": ["todo:1", "todo:2"]}, {"excerpt": "also", "became": "doc:1"}]}]})
    write_json(home / "questions.json", {"questions": [{"text": "Which one?", "description": "context", "pick": 1, "answer": "the first",
                                                      "options": [{"label": "A", "description": "a"}, {"label": "B"}], "links": ["inbox:1", "todos:2"]}]})
    write_json(home / "work.json", {"work": [{"subject": "Old work", "ended": "2026-01-04T00:00:00Z", "notes": [{"at": "2026-01-03T09:00:00Z", "text": "began"}]}]})
    write_json(home / "plans.json", {"plans": [{"title": "Old plan", "goal": "done", "status": "active", "body": "why",
                                              "phases": [{"title": "One", "todos": [1]}, {"title": "Two", "todos": [], "checkpoint": True}, {"title": "Three", "todos": [9]}]},
                                             {"title": "Odd plan", "status": "mystery"}]})
    write_json(home / "reports.json", {"reports": [{"title": "A report", "body": "found", "about": "todos:1", "archived": "kept"}, {"title": "Loose report"}]})
    write_json(home / "notifications.json", {"notifications": [{"text": "Read already", "read_at": "2026-01-05T00:00:00Z"}, {"text": "Unread"}]})
    (old / "environments" / "second").mkdir()
    (old / "rules").mkdir()
    (old / "rules" / "001-first.md").write_text("---\ntitle: Never push\n---\nrule body")
    (old / "rules" / "002-second.md").write_text("only a body")
    write_json(old / "record.json", {"rules": [{"fact": "Never push", "struck": "dropped"}, {"fact": "Struck rule", "struck": "dropped"}, {"fact": "Added later"}]})
    doc = old / "docs" / "first"
    (doc / "files").mkdir(parents=True)
    (doc / "files" / "note.txt").write_text("attached")
    (doc / "index.md").write_text("---\nn: 4\ntitle: Old doc\nabstract: about it\nstatus: final\n---\nthe intro")
    (doc / "01-part.md").write_text("---\ntitle: Part one\n---\npart body")
    (old / "docs" / "empty").mkdir()
    (old / "docs" / "numberless").mkdir()
    (old / "docs" / "numberless" / "index.md").write_text("---\ntitle: No number\n---\nbody")
    (old / "docs" / "stray.txt").write_text("not a folder")
    assert read_old_record(old) == 20, "the old record is read into the rows of today"
    record = Record(old, "main")
    assert (Todos(record, actor=SYSTEM).load(1).title, Todos(record, actor=SYSTEM).load(1).outcome, Todos(record, actor=SYSTEM).load(2).after) == ("First task", "shipped", []), \
        "an old to-do keeps its title and how it closed"
    assert [Facts(record, actor=SYSTEM).load(n).title for n in (1, 2)] == ["A struck claim", "A standing claim"] and Facts(record, actor=SYSTEM).load(1).brief == "pin body", "pins become facts with their body"
    assert Messages(record, actor=SYSTEM).load(1).sections[0]["body"] == "todo:1, todo:2" and Questions(record, actor=SYSTEM).load(1).refs == ["message:1", "todo:2"], \
        "messages keep what their parts became and questions link to today's names"
    assert Plans(record, actor=SYSTEM).load(1).data["current"] == 2 and Plans(record, actor=SYSTEM).load(2).data["status"] == "draft", "a plan resumes at its first open phase and an unknown status is a draft"
    assert Docs(record, actor=SYSTEM).load(4).title == "Old doc" and (Docs(record, actor=SYSTEM).folder(4) / "note.txt").read_text() == "attached", "an old doc keeps its parts and its files"
    assert [Rules(record, actor=SYSTEM).load(n).title for n in (1, 2, 3)] == ["Never push", "Struck rule", "Added later"], "rules come from their files named by the old record, then from the rest of the record"
    assert ("user" in Notifications(record, actor=SYSTEM).load(1).seen, "user" in Notifications(record, actor=SYSTEM).load(2).seen) == (True, False), "a notification read in the old record stays read and an unread one stays unread"
    assert read_old_record(old) == 0, "a record that has rows of every type is not read again"
