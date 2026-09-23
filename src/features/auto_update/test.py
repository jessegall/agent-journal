import json
import time

import pytest
from types import SimpleNamespace

import features.auto_update.check as updates
from engine.heal import ledger
from engine.stored import write_json
from features import load
from tests.conftest import fresh


def test_the_update_check_tells_the_agent_of_a_newer_version_once_when_it_does_not_install_itself(monkeypatch):
    load()
    record = fresh()
    record.set_setting("features", {**record.setting("features", {}), "auto_update.install": False})
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
    write_json(ledger(record.root), {"builds": ["journal-98.0.0-0123456789.pyz"]})
    monkeypatch.setattr(updates, "upstream", lambda root: "98.0.0")
    check.tick()
    assert len(sent) == 1, "a version that would not start here is never offered again"
    record.set_setting("triggers", {"auto_update": {"every": 5, "unit": "minutes"}})
    monkeypatch.setattr(updates, "stale", lambda root: True)
    check.checked_at = 0.0
    check.tick()
    assert 5 * 60 - updates.REFETCH_WAIT - 2 < time.time() - check.checked_at, "a stale published version is looked at again once it is fetched, not five minutes later"
    from controllers.types import Agents
    from engine import runtime
    from engine.actors import IDLE
    from engine.sessions import Sessions
    from engine.terminal import LAUNCH
    row = Agents(record).by_session("conversation-1")
    driver = SimpleNamespace(session="claude-1", last_report=lambda: Agents(record).load(row.n))
    state = {"now": "working"}
    relaunch = updates.Relaunch(SimpleNamespace(record=record, driver=driver, state=lambda: state["now"]))
    Sessions(record.root).write("claude-1", launch=LAUNCH - 1)
    assert relaunch.tick() == "" and not runtime.relaunch_file(record.root, "claude-1").exists(), "a busy agent is never restarted"
    state["now"] = IDLE
    assert relaunch.tick() == "relaunching", "an idle agent launched the old way is restarted"
    assert "conversation-1" in json.loads(runtime.relaunch_file(record.root, "claude-1").read_text())["command"], "in the same conversation"
    Sessions(record.root).write("claude-1", launch=LAUNCH)
    assert relaunch.tick() == "", "one launched the current way is left alone"
    import subprocess
    from supervisor import stop
    stubborn = subprocess.Popen(["sh", "-c", "trap '' HUP TERM; sleep 30"])
    began = time.time()
    stop(stubborn.pid, grace=0.2)
    assert stubborn.poll() is not None and time.time() - began < 5, "an agent that ignores the polite signals is still stopped, so a restart never hangs"


def test_the_installed_command_runs_quietly_before_any_server_has_started(tmp_path):
    import subprocess
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


def test_the_journals_hook_py_runs_the_current_hook_for_an_older_command_that_passes_nothing(tmp_path):
    import subprocess
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
    from surfaces.updates import announce
    record = fresh()
    announce(record.root, "1.0.0")
    assert announce(record.root, "1.0.1") == "1.0.1"
    from engine.hooks import default_env
    from engine.record import Record
    notified = [n for n in Notifications(Record(record.root, default_env(record.root)))._every() if n.title == "Journal updated to 1.0.1"]
    assert (len(notified), "user" in notified[0].seen) == (1, True), "announced once, already seen"


def test_a_launch_installs_a_newer_version_first_and_starts_again_on_it(monkeypatch):
    import features
    import features.auto_update.launch as launch
    features.load()
    record = fresh()
    ran = []
    monkeypatch.setattr(launch, "fetched", lambda cache: cache.parent.mkdir(parents=True, exist_ok=True) or cache.write_text("99.0.0"))
    monkeypatch.setattr("install.upgrade", lambda project, root: ran.append("upgrade") or ["package refreshed"])
    monkeypatch.setattr(launch.os, "execv", lambda python, argv: ran.append("started again"))
    launch.latest_first(record)
    assert ran == ["upgrade", "started again"], "a newer published version is installed, then the launch starts again on it"
    ran.clear()
    monkeypatch.setattr(launch, "fetched", lambda cache: cache.write_text("0.0.1"))
    assert (launch.latest_first(record), ran) == ("", []), "already current: the launch goes straight on"


def test_a_launch_repairs_a_half_done_upgrade_and_says_when_records_were_lost(tmp_path, monkeypatch):
    import json
    import shutil
    import subprocess
    import sys
    from pathlib import Path
    import features
    import features.auto_update.launch as launch
    from controllers.types import Notices
    from engine.record import Record
    here = Path(__file__).resolve().parents[2]
    project = tmp_path / "project"
    project.mkdir()
    subprocess.run([sys.executable, str(here / "install.py"), "upgrade", str(project)], env={"HOME": str(tmp_path), "PATH": "/usr/bin:/bin", "AGENT_JOURNAL_BOOTSTRAPPED": "1"},
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


def test_an_upgrade_reads_a_package_under_src_and_never_empties_an_install(tmp_path):
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


def test_a_hook_during_an_upgrade_waits_for_the_server_instead_of_failing(tmp_path):
    import http.server
    import socket
    import subprocess
    import threading
    import time
    from pathlib import Path
    hook = Path(__file__).resolve().parents[2] / "hook.sh"
    with socket.socket() as probe:
        probe.bind(("127.0.0.1", 0))
        port = probe.getsockname()[1]
    (tmp_path / "runtime").mkdir()
    (tmp_path / "runtime" / "heartbeat").write_text(f"{int(time.time())} http://127.0.0.1:{port}/\n")
    (tmp_path / "runtime" / "upgrading").write_text("")

    class Answer(http.server.BaseHTTPRequestHandler):
        def do_POST(self):
            self.rfile.read(int(self.headers["Content-Length"]))
            self.send_response(200)
            self.end_headers()
            self.wfile.write(b'{"reason": "served"}')

        def log_message(self, *_):
            pass

    def serve_late():
        time.sleep(1.2)
        server = http.server.HTTPServer(("127.0.0.1", port), Answer)
        server.handle_request()
        server.server_close()
    threading.Thread(target=serve_late, daemon=True).start()
    ran = subprocess.run(["sh", str(hook), "claude", str(tmp_path)], input='{"hook_event_name": "PreToolUse"}', capture_output=True, text=True,
                         env={"PATH": "/usr/bin:/bin:/usr/local/bin:/opt/homebrew/bin", "AGENT_JOURNAL_ACTIVE": "1"}, timeout=20)
    assert ran.stdout.strip() == '{"reason": "served"}', (ran.stdout, ran.stderr)
    assert not (tmp_path / "runtime" / "hook-failures.log").exists(), "no failure is logged for a server that was only restarting"


def test_the_version_files_older_installs_read_carry_the_release():
    from pathlib import Path
    from engine.version import version
    repository = Path(__file__).resolve().parents[3]
    assert [(repository / name).read_text().strip() for name in ("VERSION", "src/VERSION")] == [version(), version()], \
        "installs before 2.120.0 find a release through these files; newer ones read the release tags"
