import http.client
import json
import os
import shutil
import signal
import subprocess
import tarfile
import sys
import threading
import time
import types
import zipfile
from contextlib import contextmanager
from pathlib import Path

import pytest

import migrations
from agents.terminal import relaunch
from controllers.types import Todos
from engine import bus, heal, locks, runtime, viewer
from engine.heal import broken
from engine.package import code_stamp, point
from engine.sessions import alive, hold_build
from engine.stop import ask
from engine.stored import append_text, write_text
from install import STUBS
from providers import DRIVERS, PROVIDERS
from resources.base import SYSTEM
from scripts.boot_guard import PROJECT, WAIT, launches
from scripts.checks.imports import imports, missing
from serve import Handler, JournalServer
from tests.conftest import fresh

HERE = Path(__file__).resolve().parents[1]
CODE = HERE / "src"


def installed(place: Path) -> Path:
    for agent in (".claude", ".codex"):
        (place / PROJECT / agent).mkdir(parents=True)
    env = {**os.environ, "HOME": str(place / "home"), "AGENT_JOURNAL_BOOTSTRAPPED": "1"}
    subprocess.run([sys.executable, str(CODE / "install.py"), "upgrade", str(place / PROJECT)], env=env, capture_output=True, timeout=120)
    return place / PROJECT / ".journal"


def test_every_import_in_the_package_resolves():
    assert [f"{path.name}:{node.lineno}" for path, node in imports() for alias in node.names if missing(node.module, alias.name)] == []


@pytest.mark.parametrize("name", list(DRIVERS))
def test_every_agent_launches_under_the_journal_and_exits_cleanly(tmp_path, name):
    launches(tmp_path, CODE / "journal.py", name)


def test_a_restart_brings_the_agent_back_under_the_same_supervisor(tmp_path):
    root = tmp_path / PROJECT / ".journal"
    moved = []

    def restarted():
        folder = next((root / "runtime" / "sessions").glob("claude-*"))
        before = json.loads((folder / "launched.json").read_text())["pid"]
        relaunch(root, runtime.env(root), folder.name, "")
        began = time.time()
        while time.time() - began < WAIT and json.loads((folder / "launched.json").read_text())["pid"] == before:
            time.sleep(0.2)
        moved.append(json.loads((folder / "launched.json").read_text())["pid"] != before)

    launches(tmp_path, CODE / "journal.py", "claude", during=restarted)
    assert moved == [True], "the supervisor stops the agent and starts it again in the same session, and nothing is left running after"


def released(place: Path) -> Path:
    repository = place / "release"
    shipped = subprocess.run(["git", "ls-files", "-co", "--exclude-standard"], cwd=HERE, capture_output=True, text=True, timeout=WAIT).stdout.split()
    for name in shipped:
        if (HERE / name).is_file():
            (repository / name).parent.mkdir(parents=True, exist_ok=True)
            (repository / name).write_bytes((HERE / name).read_bytes())
    for step in (["init", "-q"], ["add", "-A"], ["-c", "user.name=t", "-c", "user.email=t@t", "commit", "-q", "-m", "release"]):
        subprocess.run(["git", *step], cwd=repository, capture_output=True, timeout=WAIT)
    return repository


def upgrade_from(repository: Path, root: Path) -> subprocess.CompletedProcess:
    env = {**os.environ, "HOME": str(root.parents[1] / "home"), "AGENT_JOURNAL_REPO": str(repository), "AGENT_JOURNAL_BOOTSTRAPPED": ""}
    return subprocess.run([sys.executable, str(root / "journal.py"), "--root", str(root), "upgrade"], cwd=root.parent, env=env, capture_output=True, text=True, timeout=180)


def test_an_installed_journal_keeps_its_records_and_upgrades_itself_from_a_release(tmp_path):
    place = tmp_path
    (place / PROJECT).mkdir()
    env = {**os.environ, "HOME": str(place / "home"), "AGENT_JOURNAL_BOOTSTRAPPED": "1"}
    upgraded = subprocess.run([sys.executable, str(CODE / "install.py"), "upgrade", str(place / PROJECT)], env=env, capture_output=True, text=True, timeout=120)
    root = place / PROJECT / ".journal"
    left = sorted(f.relative_to(root / "src").as_posix() for f in (root / "src").rglob("*.py"))
    assert ((root / "journal.pyz").is_file(), left) == (True, sorted(STUBS)), f"the Python is packed into one zip, a stub left at each old entry:\n{upgraded.stdout}{upgraded.stderr}"
    assert not runtime.upgrading(root), "an upgrade that has finished leaves no mark, so the supervisor may reload"
    (root / "runtime" / "upgrading").touch()
    assert runtime.upgrading(root), "while one is under way, the mark holds the supervisor's reload back"
    (root / "runtime" / "upgrading").unlink()
    journal = [sys.executable, str(root / "journal.py"), "--root", str(root)]
    subprocess.run([*journal, "doc", "create", "Kept across upgrades"], cwd=place / PROJECT, env=env, capture_output=True, timeout=WAIT)
    again = subprocess.run([sys.executable, str(CODE / "install.py"), "upgrade", str(place / PROJECT)], env=env, capture_output=True, text=True, timeout=120)
    listed = subprocess.run([*journal, "doc", "all"], cwd=place / PROJECT, env=env, capture_output=True, text=True, timeout=WAIT).stdout
    assert "Kept across upgrades" in listed, f"a project record survives an upgrade:\n{again.stdout}{again.stderr}"
    itself = upgrade_from(released(place), root)
    listed = subprocess.run([*journal, "doc", "all"], cwd=place / PROJECT, env=env, capture_output=True, text=True, timeout=WAIT).stdout
    assert ("Traceback" not in itself.stdout + itself.stderr, "Kept across upgrades" in listed, (root / "journal.pyz").resolve().name.startswith("journal-")) == (True, True, True), \
        f"an installed journal upgrades itself from a release, keeps its records, and runs from a versioned build:\n{itself.stdout}{itself.stderr}"


def test_an_upgrade_copies_a_changed_file_into_the_attic_before_replacing_it(tmp_path):
    import tarfile
    root = installed(tmp_path)
    changed = root / "src" / "journal.py"
    original = changed.read_bytes()
    changed.write_bytes(original + b"\n# changed by hand\n")
    env = {**os.environ, "HOME": str(tmp_path / "home"), "AGENT_JOURNAL_BOOTSTRAPPED": "1"}
    command = [sys.executable, str(CODE / "install.py"), "upgrade", str(root.parent)]
    held = subprocess.run(command, env=env, capture_output=True, text=True, timeout=120)
    assert "src/journal.py" in held.stdout and changed.read_bytes().endswith(b"# changed by hand\n")
    by_hand = subprocess.run([sys.executable, str(root / "journal.py"), "--root", str(root), "upgrade"], env=env,
                             capture_output=True, text=True, timeout=120)
    assert "src/journal.py" in by_hand.stdout and changed.read_bytes().endswith(b"# changed by hand\n")
    updated = subprocess.run([*command, "--yes"], env=env, capture_output=True, text=True, timeout=120)
    assert updated.returncode == 0 and changed.read_bytes() == original, updated.stdout + updated.stderr
    copies = list((root / "attic").glob("changed-files-*.tar.gz"))
    assert len(copies) == 1
    with tarfile.open(copies[0]) as archive:
        assert archive.extractfile(".journal/src/journal.py").read().endswith(b"# changed by hand\n")


def test_a_legacy_install_copies_managed_files_and_updates_without_holding(tmp_path):
    root = installed(tmp_path)
    (root / "managed-files.json").unlink()
    changed = root / "src" / "journal.py"
    original = changed.read_bytes()
    changed.write_bytes(original + b"\n# changed by hand\n")
    env = {**os.environ, "HOME": str(tmp_path / "home"), "AGENT_JOURNAL_BOOTSTRAPPED": "1"}
    command = [sys.executable, str(CODE / "install.py"), "upgrade", str(root.parent)]
    updated = subprocess.run(command, env=env, capture_output=True, text=True, timeout=120)
    assert updated.returncode == 0 and changed.read_bytes() == original, updated.stdout + updated.stderr
    copies = list((root / "attic").glob("before-update-*/"))
    assert len(copies) == 1 and (copies[0] / ".journal" / "src" / "journal.py").read_bytes().endswith(b"# changed by hand\n")
    assert (copies[0] / ".agents" / "skills" / "journal" / "SKILL.md").is_file(), "the legacy copy includes generated skills"
    assert f"copied to {copies[0].relative_to(root.parent)}" in updated.stdout and (root / "managed-files.json").is_file()
    changed.write_bytes(original + b"\n# another hand edit\n")
    held = subprocess.run(command, env=env, capture_output=True, text=True, timeout=120)
    assert "src/journal.py" in held.stdout and changed.read_bytes().endswith(b"# another hand edit\n"), \
        "after the first update, the checksum guard holds changed files"


@pytest.mark.parametrize("name", list(DRIVERS))
def test_every_agent_launches_from_an_installed_zip(tmp_path, name):
    launches(tmp_path, installed(tmp_path) / "journal.py", name)


def test_the_launcher_carries_its_running_agent_over_to_a_new_build(tmp_path):
    root = installed(tmp_path)
    repository = released(tmp_path)
    upgrade_from(repository, root)
    (repository / "src" / "channel.py").write_text((repository / "src" / "channel.py").read_text() + f"\nRELEASE = {os.urandom(4000).hex()!r}\n")
    subprocess.run(["git", "-c", "user.name=t", "-c", "user.email=t@t", "commit", "-qam", "a new build"], cwd=repository, capture_output=True, timeout=WAIT)
    moved = []

    def upgraded():
        upgrade_from(repository, root)
        newest, began = (root / "journal.pyz").resolve().name, time.time()
        while not moved and time.time() - began < WAIT:
            moved.extend(marker for marker in (root / "runtime" / "builds").glob("*") if marker.read_text() == newest)
            time.sleep(0.2)

    launches(tmp_path, root / "journal.py", "claude", during=upgraded)
    assert moved, "the launcher carried its running agent over to the new build"


def test_the_journal_starts_on_a_record_with_a_damaged_row(tmp_path):
    place = tmp_path
    root = place / ".journal"
    journal = [sys.executable, str(CODE / "journal.py"), "--root", str(root)]
    subprocess.run([*journal, "todo", "create", "a row"], cwd=place, capture_output=True, timeout=WAIT)
    (root / "environments" / "main" / "todo" / "002.md").write_text("")
    (root / "environments" / "main" / "todo" / "003.md").write_text('---\n{"n": 3, "title": "odd", "unknown_field": 1}\n---\nbody\n')
    ran = subprocess.run([*journal, "status"], cwd=place, capture_output=True, text=True, timeout=WAIT)
    assert (ran.returncode, "Traceback" in ran.stderr) == (0, False), f"a damaged row stopped the journal:\n{ran.stderr}"
    subprocess.run([*journal, "todo", "all"], cwd=place, capture_output=True, timeout=WAIT)
    notices = subprocess.run([*journal, "notice", "all"], cwd=place, capture_output=True, text=True, timeout=WAIT).stdout
    assert "could not be read" in notices, "a row that cannot be read is named in a notice, never dropped in silence"


def test_an_upgrade_keeps_a_build_a_live_session_runs_from(tmp_path):
    root = installed(tmp_path)
    good = (root / "journal.pyz").resolve()
    old = [root / f"journal-0.0.{i}-old000000{i}.pyz" for i in range(3)]
    for i, build in enumerate(old):
        build.write_bytes(good.read_bytes())
        os.utime(build, (i, i))
    hold_build(root, old[0])
    subprocess.run([sys.executable, str(CODE / "install.py"), "upgrade", str(root.parent)], env={**os.environ, "HOME": str(tmp_path / "home"), "AGENT_JOURNAL_BOOTSTRAPPED": "1"},
                   capture_output=True, timeout=120)
    kept = sorted(build.name for build in root.glob("journal-*.pyz") if build != old[0])
    assert old[0].is_file() and not old[1].is_file() and len(kept) <= 2, f"the build a live process runs from is kept; of the others only the two newest stay: {kept}"
    watched = root / "journal.pyz"
    before = code_stamp(watched)
    point(root, old[0])
    assert code_stamp(watched) != before, "the server watches journal.pyz itself, so a new build it points at restarts the server"


def heals(root: Path, good: Path):
    def healed() -> None:
        began = time.time()
        while (root / "journal.pyz").resolve() != good and time.time() - began < WAIT:
            time.sleep(0.2)
    return healed


def test_a_build_whose_supervisor_dies_on_start_goes_back_to_the_last_good_one(tmp_path):
    place, root = tmp_path, installed(tmp_path)
    good = (root / "journal.pyz").resolve()
    bad = root / "journal-99.0.0-broken0000.pyz"
    with zipfile.ZipFile(good) as source, zipfile.ZipFile(bad, "w") as target:
        for item in source.infolist():
            if not item.filename.startswith("runner/worker."):
                target.writestr(item, source.read(item))
        target.writestr("runner/worker.py", "raise SystemExit(1)\n")
    point(root, bad)
    launches(place, root / "journal.py", "codex", during=heals(root, good))
    assert ((root / "journal.pyz").resolve(), broken(root)) == (good, [bad.name]), "the journal went back to the build that works and remembers the broken one"


def test_a_build_whose_server_dies_on_start_goes_back_to_the_last_good_one(tmp_path):
    place, root = tmp_path, installed(tmp_path)
    good = (root / "journal.pyz").resolve()
    bad = root / "journal-99.0.0-broken0000.pyz"
    with zipfile.ZipFile(good) as source, zipfile.ZipFile(bad, "w") as target:
        for item in source.infolist():
            if not item.filename.startswith("serve."):
                target.writestr(item, source.read(item))
        target.writestr("serve.py", source.read("serve.py").decode().replace("def run(", "def run(*_, **__):\n    raise SystemExit(3)\n\n\ndef unused(", 1))
    point(root, bad)
    launches(place, root / "journal.py", "codex", during=heals(root, good))
    assert ((root / "journal.pyz").resolve(), broken(root)) == (good, [bad.name]), "the journal went back to the build that works and remembers the broken one"


def test_an_install_checks_the_hooks_it_wired_and_names_one_that_cannot_run(tmp_path):
    root = installed(tmp_path)
    env = {**os.environ, "HOME": str(tmp_path / "home"), "AGENT_JOURNAL_BOOTSTRAPPED": "1"}
    settings = root.parent / ".claude" / "settings.local.json"
    wired = json.loads(settings.read_text())
    wired["hooks"]["PreToolUse"].append({"hooks": [{"type": "command", "command": "my-own-lint"}]})
    settings.write_text(json.dumps(wired))
    again = subprocess.run([sys.executable, str(CODE / "install.py"), "upgrade", str(root.parent)], env=env, capture_output=True, text=True, timeout=120)
    assert "hooks checked: claude, codex" in again.stdout, again.stdout
    rewired = json.loads(settings.read_text())["hooks"]
    ours = {event: sum("/hook.sh" in hook["command"] for block in blocks for hook in block["hooks"]) for event, blocks in rewired.items()}
    assert set(ours.values()) == {1}, f"installing again keeps one journal hook per event: {ours}"
    assert any(hook["command"] == "my-own-lint" for block in rewired["PreToolUse"] for hook in block["hooks"]), "and the user's own hook stays"
    verified = subprocess.run([sys.executable, str(root / "journal.py"), "--root", str(root), "verify"], cwd=root.parent, env=env, capture_output=True, text=True, timeout=WAIT)
    assert (verified.returncode, "Traceback" in verified.stderr, "claude" in verified.stdout.lower()) == (0, False, True), verified.stdout + verified.stderr
    claude = PROVIDERS["claude"]()
    settings = root.parent / ".claude" / "settings.local.json"
    wired = json.loads(settings.read_text())
    for blocks in wired["hooks"].values():
        for block in blocks:
            for hook in block["hooks"]:
                hook["command"] = f"sh {root}/src/hook.sh claude {root}"
    settings.write_text(json.dumps(wired))
    assert "does not split" in claude.wiring_trouble(root.parent), "an unquoted hook on a path with a space is named, not run broken"


def test_a_session_for_another_journal_runs_that_journals_own_build(tmp_path):
    here, there = installed(tmp_path / "here"), installed(tmp_path / "there")
    program = (f"import sys; from pathlib import Path; sys.path.insert(0, {str(here / 'journal.pyz')!r}); from engine.package import entry_in, own_build; "
             f"print(entry_in(Path({str(there)!r}), 'supervisor')[1], own_build(Path({str(here)!r})), own_build(Path({str(there)!r})), sep='|')")
    launched, mine, theirs = subprocess.run([sys.executable, "-c", program], capture_output=True, text=True, timeout=WAIT).stdout.strip().split("|")
    assert launched == str(there / "journal.pyz"), "a journal launching a session for another starts it on that journal's build, never its own"
    assert (mine, theirs) == ("True", "False"), "a worker on another journal's build knows it, and leaves that journal's servers to its own sessions"


def test_a_killed_server_is_reaped_so_a_new_one_starts(tmp_path, monkeypatch):
    root = installed(tmp_path)
    monkeypatch.setenv("HOME", str(tmp_path / "home"))
    starter = subprocess.Popen([sys.executable, "-c", f"import sys, time; sys.path.insert(0, {str(CODE)!r}); from pathlib import Path; from engine import viewer; "
                                f"root = Path({str(root)!r}); print(viewer.launch(root, root.parent)[0], flush=True); time.sleep({WAIT})"],
                               stdout=subprocess.PIPE, text=True)
    try:
        assert starter.stdout.readline().strip(), "the server answers"
        killed = viewer.last(root).pid
        os.kill(killed, signal.SIGKILL)
        began = time.time()
        while alive(killed) and time.time() - began < WAIT / 3:
            time.sleep(0.1)
        assert not alive(killed), "the process that started the server reaps it, so it is not left a zombie that looks alive"
    finally:
        starter.kill()
        starter.wait(WAIT)
    url = viewer.launch(root, root.parent)[0]
    try:
        assert url, "a new server starts where the killed one was"
    finally:
        serving = viewer.identity(url, timeout=2) if url else None
        if serving and alive(serving.pid):
            os.kill(serving.pid, signal.SIGTERM)


def test_a_message_shown_while_the_server_is_down_reaches_the_chat_once_it_is_back(tmp_path):
    root = installed(tmp_path)
    env = {**os.environ, "HOME": str(tmp_path / "home"), "AGENT_JOURNAL_ACTIVE": "1", "JOURNAL_ENV": ""}
    journal = [sys.executable, str(root / "journal.py"), "--root", str(root)]
    wired = json.loads((root.parent / ".claude" / "settings.local.json").read_text())["hooks"]["SessionStart"][0]["hooks"][0]["command"]

    def hook(body: dict):
        return subprocess.run(["sh", "-c", wired], input=json.dumps(body), text=True, env=env, capture_output=True, timeout=WAIT)
    channel = json.loads((root.parent / ".mcp.json").read_text())["mcpServers"]["journal"]
    assert channel == {"command": sys.executable, "args": [str(root / "journal.py"), "-m", "channel", str(root)]}, \
        "the channel runs the interpreter that installed it, with a path that has a space in it kept whole"
    display = {"hook_event_name": "MessageDisplay", "session_id": "s1", "message_id": "m1", "index": 0, "final": True, "delta": "said while the server was down"}

    def serving():
        server = subprocess.Popen([*journal, "serve", "--port", "0"], cwd=root.parent, env=env, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        began = time.time()
        while time.time() - began < WAIT and not (root / "runtime" / "heartbeat").is_file():
            time.sleep(0.1)
        return server

    server = serving()
    try:
        hook({"hook_event_name": "SessionStart", "session_id": "s1", "cwd": str(root.parent), "source": "startup"})
    finally:
        server.terminate()
        server.wait(WAIT)
    (root / "runtime" / "heartbeat").unlink(missing_ok=True)
    hook(display)
    assert list((root / "runtime" / "unsent").glob("*.json")), "the display hook keeps what the server could not take"
    server = serving()
    try:
        began, listed = time.time(), ""
        while "said while the server was down" not in listed and time.time() - began < WAIT:
            time.sleep(0.2)
            listed = subprocess.run([*journal, "message", "all"], cwd=root.parent, env=env, capture_output=True, text=True, timeout=WAIT).stdout
    finally:
        server.terminate()
        server.wait(WAIT)
    assert "said while the server was down" in listed, "a message shown while the server was down reaches the chat once it is back"


def test_a_migration_that_fails_leaves_the_record_as_it_was(tmp_path, monkeypatch):
    root = tmp_path / ".journal"
    (root / "environments" / "main" / "todo").mkdir(parents=True)
    kept = root / "environments" / "main" / "todo" / "001.md"
    added = root / "environments" / "main" / "todo" / "002.md"
    events = root / "environments" / "main" / "events.jsonl"
    started = threading.Event()
    writers = []
    kept.write_text("the user's row")
    touched, broke = types.ModuleType("migrations.m9998_touch"), types.ModuleType("migrations.m9999_break")
    touched.run = lambda r: kept.write_text("changed halfway") or "touched"

    def breaking(r):
        def writing():
            started.set()
            append_text(events, "an event emitted while migrating\n")
            write_text(added, "written while migrating")
        writer = threading.Thread(target=writing)
        writers.append(writer)
        writer.start()
        assert started.wait(timeout=1), "the record write starts during the migration"
        assert writer.is_alive(), "a record write waits for the migration to finish"
        raise RuntimeError("the migration broke")
    broke.run = breaking
    monkeypatch.setitem(sys.modules, "migrations.m9998_touch", touched)
    monkeypatch.setitem(sys.modules, "migrations.m9999_break", broke)
    monkeypatch.setattr(migrations, "names", lambda: ["m9998_touch", "m9999_break"])
    try:
        migrations.run(root)
    except RuntimeError:
        pass
    writers[0].join(timeout=1)

    def backups() -> list:
        return list(root.glob(f".{migrations.BACKUP}-*"))
    assert (kept.read_text(), added.read_text(), events.read_text(), migrations.applied(root), backups()) == \
           ("the user's row", "written while migrating", "an event emitted while migrating\n", {}, []), \
        "a failed migration restores its backup before a waiting record write lands"
    monkeypatch.setattr(migrations, "names", lambda: ["m9998_touch"])
    assert migrations.run(root) == ["m9998_touch"] and not backups(), "a run that succeeds deletes its backup"


def test_an_installer_left_with_only_itself_fetches_the_package_and_finishes(tmp_path):
    code = tmp_path / ".journal" / "src"
    code.mkdir(parents=True)
    (code / "install.py").write_bytes((HERE / "install.py").read_bytes())
    ran = subprocess.run([sys.executable, str(code / "install.py"), "finish", str(tmp_path)], cwd=tmp_path, capture_output=True, text=True,
                         timeout=WAIT * 4, env={**os.environ, "AGENT_JOURNAL_REPO": str(HERE)})
    assert ran.returncode == 0, f"an older installer copies only install.py and runs it; it must heal:\n{ran.stderr[-2000:]}"
    assert (code / "engine").is_dir() and (tmp_path / ".journal" / "journal.pyz").is_file(), "the package is back and packed"


@contextmanager
def serving(record):
    Handler.root = record.root
    server = JournalServer(("127.0.0.1", 0), Handler)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    try:
        yield server.server_port
    finally:
        server.shutdown()
        server.server_close()


def asked(port: int, method: str, path: str, body: bytes = b"", kind: str = "application/json") -> tuple[int, bytes]:
    connection = http.client.HTTPConnection("127.0.0.1", port, timeout=WAIT)
    try:
        connection.request(method, path, body=body or None, headers={"Content-Type": kind} if body else {})
        reply = connection.getresponse()
        return reply.status, reply.read()
    finally:
        connection.close()


def test_the_server_answers_a_body_it_cannot_read_and_keeps_serving():
    record = fresh()
    with serving(record) as port:
        assert asked(port, "POST", f"/api/{record.env}/todo", b"{")[0] == 400, "a body that is not JSON is a 400, not a dropped connection"
        assert asked(port, "POST", "/api/run", b"todo\0all", "text/plain")[0] == 200, "a text/plain body reaches its route as raw bytes"
        assert asked(port, "GET", f"/api/{record.env}/todo")[0] == 200, "the next request is answered as before"


def test_the_event_stream_opens_carries_an_event_and_frees_its_watcher_on_disconnect():
    record = fresh()
    watching = len(bus._watchers)
    with serving(record) as port:
        connection = http.client.HTTPConnection("127.0.0.1", port, timeout=WAIT)
        connection.request("GET", f"/api/{record.env}/stream")
        reply = connection.getresponse()
        assert reply.fp.readline() == b": open\n", "the stream says it is open"
        reply.fp.readline()
        assert len(bus._watchers) == watching + 1, "a connected reader holds one watcher on the bus"
        Todos(record, actor=SYSTEM).create("an event for the stream")
        line = reply.fp.readline()
        assert line.startswith(b"id: "), "an event reaches the open stream"
        reply.close()
        connection.close()
        began = time.time()
        while len(bus._watchers) > watching and time.time() - began < WAIT:
            Todos(record, actor=SYSTEM).create("wakes the stream so it notices the disconnect")
            time.sleep(0.2)
        assert len(bus._watchers) == watching, "the watcher is released once the reader is gone"


def test_a_held_record_lock_lets_the_runtime_folder_write_and_times_out_every_other_write(tmp_path, monkeypatch):
    root = tmp_path / ".journal"
    monkeypatch.setattr(locks, "LOCK_WAIT", 0.3)
    outcomes = {}

    def writing(name: str, path: Path) -> None:
        try:
            write_text(path, "written")
            outcomes[name] = "written"
        except TimeoutError:
            outcomes[name] = "timed out"

    with locks.hold_record_writes(root):
        for name, path in (("runtime", root / "runtime" / "flag"), ("record", root / "environments" / "main" / "todo" / "001.md")):
            worker = threading.Thread(target=writing, args=(name, path))
            worker.start()
            worker.join(WAIT)
    assert outcomes == {"runtime": "written", "record": "timed out"}, "a migration holds record writes back until they time out, and never the runtime folder"
    writing("after", root / "environments" / "main" / "todo" / "001.md")
    assert outcomes["after"] == "written", "once the migration lets go the same write goes through"


def test_a_running_server_restarts_on_a_new_build_and_exits_when_asked_to_stop(tmp_path):
    root = installed(tmp_path)
    env = {**os.environ, "HOME": str(tmp_path / "home"), "AGENT_JOURNAL_ACTIVE": "1", "JOURNAL_ENV": ""}
    server = subprocess.Popen([sys.executable, str(root / "journal.py"), "--root", str(root), "serve", "--port", "0"], cwd=root.parent, env=env,
                              stdout=subprocess.PIPE, stderr=subprocess.DEVNULL, text=True)
    printed = []
    threading.Thread(target=lambda: printed.extend(iter(server.stdout.readline, "")), daemon=True).start()

    def printed_times(text: str, times: int) -> bool:
        return sum(text in line for line in printed) >= times

    def prints(text: str, meanwhile=lambda: None, times: int = 1) -> bool:
        began = time.time()
        while not printed_times(text, times) and time.time() - began < WAIT:
            meanwhile()
            time.sleep(0.5)
        return printed_times(text, times)

    touched = [0.0]

    def touch() -> None:
        if time.time() - touched[0] > 4:
            os.utime(root / "journal.pyz")
            touched[0] = time.time()

    try:
        assert prints("http://127.0.0.1:"), "the server prints where it is serving"
        assert prints("restarting on the same port", touch), "a new build of the code restarts the server on the port it had"
        assert (root / "runtime" / "restarting").is_file(), "the server marks its restart before it stops serving, so a hook meanwhile retries"
        assert prints("http://127.0.0.1:", times=2), "the restarted server serves again"
        repository = released(tmp_path)
        (repository / "src" / "channel.py").write_text((repository / "src" / "channel.py").read_text() + f"\nRELEASE = {os.urandom(8).hex()!r}\n")
        subprocess.run(["git", "-c", "user.name=t", "-c", "user.email=t@t", "commit", "-qam", "a new build"], cwd=repository, capture_output=True, timeout=WAIT)
        upgrade_from(repository, root)
        newest, url = (root / "journal.pyz").resolve().name, next(line.strip() for line in printed if line.startswith("http://127.0.0.1:"))
        began = time.time()
        while time.time() - began < WAIT and getattr(viewer.identity(url, 1.0), "build", "") != newest:
            time.sleep(0.5)
        assert viewer.identity(url, 1.0).build == newest, "after an upgrade the running server answers from the new build"
        ask(root)
        assert prints("journal: stopped") and server.wait(WAIT) == 0, "writing the stop flag ends the server and says it stopped"
    finally:
        if server.poll() is None:
            server.kill()
            server.wait(WAIT)


def test_healing_twice_goes_back_once_and_refuses_the_broken_build_for_a_while(tmp_path):
    root = tmp_path / ".journal"
    root.mkdir()
    good, bad = root / "journal-1.0.0-aaaaaaaaaa.pyz", root / "journal-2.0.0-bbbbbbbbbb.pyz"
    for build, age in ((good, 1), (bad, 2)):
        build.write_bytes(b"")
        os.utime(build, (age, age))
    point(root, bad)
    assert heal.refused(root, "2.0.0") is False, "a build nobody has failed on is not refused"
    first, second = heal.heal(root), heal.heal(root)
    assert ("went back to journal-1.0.0-aaaaaaaaaa.pyz" in first, second, (root / "journal.pyz").resolve().name) == (True, "", good.name), \
        "the first heal goes back to the last good build, and a second finds nothing to go back to"
    assert (heal.refused(root, "2.0.0"), heal.refused(root, "1.0.0")) == (True, False), "the build that would not start is refused, the one the journal went back to is not"
    assert heal.refused(root, "2") is False, "a version is matched whole, never by its first digits"


def supervised(place: Path, agent: str, worker: str, headless: bool = True) -> tuple[subprocess.CompletedProcess, Path]:
    root = place / ".journal"
    (place / "heals").write_text("")
    spec = {"root": str(root), "cwd": str(place), "env": "main", "agent": "claude", "worker": [sys.executable, "-c", worker], "args": [],
            "heal": [sys.executable, "-c", f"open({str(place / 'heals')!r}, 'a').write('x'); print('healed')"],
            "ended": [sys.executable, "-c", f"open({str(place / 'ended')!r}, 'w').write('x')"],
            "command": [sys.executable, "-c", agent], "environ": dict(os.environ), "launch": 0, "headless": headless}
    done = subprocess.run([sys.executable, str(CODE / "supervisor.py"), json.dumps(spec)], cwd=place, capture_output=True, text=True, timeout=WAIT, stdin=subprocess.DEVNULL)
    return done, next((root / "runtime" / "sessions").glob("claude-*"))


def test_a_supervisor_relays_the_agent_resizes_it_heals_a_crashing_worker_and_leaves_nothing_running(tmp_path):
    runs = tmp_path / "runs"
    worker = (f"import sys; from pathlib import Path; runs = Path({str(runs)!r}); n = len(runs.read_text()) if runs.is_file() else 0; runs.write_text('x' * (n + 1)); "
              "sys.exit(1 if n == 0 else 76)")
    done, session = supervised(tmp_path, "import time; print('hello from the agent', flush=True); time.sleep(60)", worker)
    pid = json.loads((session / "launched.json").read_text())["pid"]
    shape = json.loads((session / "screen.json").read_text())
    assert (done.returncode, len(runs.read_text()), (tmp_path / "heals").read_text(), "healed" in done.stdout) == (255, 2, "x", True), \
        f"a worker that crashes at once is healed and started again, and one that exits to stop ends the agent: {done.stdout}{done.stderr}"
    assert (b"hello from the agent" in (session / "printed").read_bytes(), (shape["rows"], shape["cols"])) == (True, (40, 120)), "what the agent prints is relayed and a headless agent has a fixed size"
    assert ((tmp_path / "ended").is_file(), subprocess.run(["kill", "-0", str(pid)], capture_output=True).returncode != 0) == (True, True), "the journal is told the agent ended and no agent process is left"


def test_feature_rows_are_seated_again_only_when_the_features_or_environments_change(monkeypatch):
    import features
    from controllers.types import Features
    from engine.record import Record
    record = fresh("main")
    features.load(record.root)
    assert Features(record, actor=SYSTEM).rows.summaries(), "a new journal's environment gets its feature rows"
    seated = []
    monkeypatch.setattr(features, "seat", seated.append)
    features.SEATED.clear()
    features.load(record.root)
    assert seated == [], "a process that starts on a journal whose features and environments are as seated seats nothing"
    Record(record.root, "other").home.mkdir(parents=True)
    features.SEATED.clear()
    features.load(record.root)
    assert seated == [record.root], "a new environment is seated"


def test_old_feature_names_are_renamed_in_settings_gates_and_triggers_in_one_pass():
    import features
    from engine.stored import read_json, write_json
    record = fresh("main")
    session = record.root / "runtime" / "sessions" / "claude-1"
    session.mkdir(parents=True)
    write_json(record.home / "settings.json", {"features": {"questions": False, "questions.hold": 5}})
    write_json(session / "gate-main.json", {"questions": {"why": "held"}})
    write_json(session / "trigger-questions.json", {"at": 1})
    features.RENAMED.clear()
    features.load(record.root)
    assert read_json(record.home / "settings.json", dict, {})["features"] == {"ask_questions": False, "ask_questions.hold": 5}, \
        "a switch and a setting under an old feature name move to its new name"
    assert (read_json(session / "gate-main.json", dict, {}), (session / "trigger-ask_questions.json").is_file()) == \
        ({"ask_questions": {"why": "held"}}, True), "a session's held writes and triggers follow the new name too"


def test_a_warm_up_that_fails_ends_the_server_so_a_broken_build_still_rolls_back(monkeypatch):
    import serve

    def broken(root, env):
        raise RuntimeError("a broken build")
    exits = []
    monkeypatch.setattr(serve, "warm_viewer", broken)
    monkeypatch.setattr(serve.os, "_exit", exits.append)
    serve.warmed(fresh().root)
    assert exits == [1], "warming runs beside the server, so a failure in it must end the process for the supervisor to roll back"


def test_one_engine_runs_per_environment_and_an_orphan_or_a_stale_build_ends(tmp_path, monkeypatch):
    from runner import engines
    root = tmp_path / ".journal"
    (runtime.folder(root)).mkdir(parents=True)
    first, second = engines.Engines(root, "e"), engines.Engines(root, "e")
    lock = runtime.folder(root) / "engines-e.lock"
    with lock.open("a") as one, lock.open("a") as two:
        assert first.owned(one) and not second.owned(two), "a second engine for the environment never owns it, so it never types"
    orphan = engines.Engines(root, "e")
    orphan.parent = -1
    assert not orphan.going(), "an engine whose parent is gone is an orphan"
    began = time.time()
    with lock.open("a") as held:
        engines.fcntl.flock(held, engines.fcntl.LOCK_EX)
        orphan.run(threading.Event())
    assert time.time() - began < 5, "an orphan ends even while another engine holds the environment"
    monkeypatch.setattr(engines, "ZIPPED", True)
    monkeypatch.setattr(engines, "build_file", lambda _root: Path("/elsewhere/other.pyz"))
    assert not engines.current(root) and not first.going(), "an engine on a replaced build ends"


def test_the_supervisor_runs_one_child_per_environment_and_ends_the_unwanted_and_the_dead(tmp_path, monkeypatch):
    from runner import engines
    root = tmp_path / ".journal"
    (runtime.folder(root)).mkdir(parents=True)
    stray = subprocess.Popen([sys.executable, "-c", f"x = {engines.CHILD!r} + {str(root)!r}; import time; time.sleep(60)"])
    kept = subprocess.Popen([sys.executable, "-c", f"x = {engines.CHILD!r} + {str(root)!r} + {str(engines.CODE)!r}; import time; time.sleep(60)"])
    try:
        time.sleep(1)
        assert {stray.pid, kept.pid} >= set(engines.leftovers(root)) and stray.pid in engines.leftovers(root) and kept.pid not in engines.leftovers(root), \
            "an engine left by an older build is found by its command line, one on this build is not"
        engines.Children(root)
        assert stray.wait(10) is not None and kept.poll() is None, "a new supervisor ends the leftovers of an older build and only those"
        spawned = []
        wants = {"a", "b"}
        monkeypatch.setattr(engines.Children, "wanted", lambda self: wants)
        monkeypatch.setattr(engines.Children, "spawn", lambda self, env: spawned.append(env) or subprocess.Popen(["sleep", "60"]))
        children = engines.Children(root)
        children.tick()
        children.tick()
        assert sorted(spawned) == ["a", "b"], "two ticks start one engine per environment"
        wants.discard("b")
        children.running["a"].kill()
        children.running["a"].wait(10)
        children.tick()
        assert sorted(spawned) == ["a", "a", "b"] and list(children.running) == ["a"], "an environment nobody wants loses its engine and a dead engine is started again"
        children.stop()
        assert not children.running
    finally:
        kept.kill()
        kept.wait(10)


def test_a_branch_links_to_its_web_page_only_on_a_known_host_and_a_compaction_ends_with_its_status(tmp_path):
    from agents.seat import status_after, web_remote
    from resources.types import COMPACTING, WORKING
    assert [web_remote(url) for url in ("git@github.com:owner/repo.git", "ssh://git@gitlab.com/owner/repo.git", "https://bitbucket.org/owner/repo/",
                                        "https://github.com/owner/repo.git", "http://github.com/owner/repo", "git@example.com:owner/repo.git", "", "/local/path")] == \
        ["https://github.com/owner/repo", "https://gitlab.com/owner/repo", "https://bitbucket.org/owner/repo", "https://github.com/owner/repo", "", "", "", ""], \
        "an ssh or https remote on github, gitlab or bitbucket is a web address, and any other is none"
    assert web_remote("ssh://git@github.com:22/owner/repo.git") == "https://github.com/owner/repo", "a port in an ssh remote is not part of the web path"
    assert (status_after(True, "idle"), status_after(False, COMPACTING), status_after(None, COMPACTING), status_after(False, "idle"), status_after(None, None)) == \
        (COMPACTING, WORKING, COMPACTING, "idle", ""), "compacting shows while it lasts, and working returns when it ends"
    from agents.seat import SeatReport
    from tests.kit import commit, git
    project = tmp_path / "project"
    project.mkdir()
    git(project, "init", "-q", "-b", "feature")
    git(project, "config", "user.email", "a@b.c")
    git(project, "config", "user.name", "a")
    commit(project, "a.txt", "a")
    git(project, "remote", "add", "origin", "git@github.com:owner/repo.git")
    marks = []
    last = types.SimpleNamespace(cwd=str(project), title="claude-1", status="idle", event="Stop", at=1.0, branch="", branch_url="")
    driver = types.SimpleNamespace(last_report=lambda: last)
    agent = types.SimpleNamespace(driver=driver, mark=lambda status, event, **given: marks.append(given))
    seat = SeatReport(types.SimpleNamespace(root=project / ".journal"), agent)
    assert seat.branch() == "feature" and marks == [{"branch": "feature", "branch_url": "https://github.com/owner/repo/tree/feature", "at": 1.0}], \
        "the branch the agent works on and its web page are put on the agent"
    assert seat.branch() == "feature" and len(marks) == 1, "looking again within moments reads nothing and says nothing more"


def test_a_second_journal_gets_a_free_viewer_port_and_a_journal_already_served_says_where(tmp_path, monkeypatch, capsys):
    import serve
    from engine import viewer
    from engine.viewer import Identity
    mine, theirs = tmp_path / "a" / ".journal", tmp_path / "b" / ".journal"
    monkeypatch.setattr(viewer, "PORTS", [8420, 8421, 8422])
    taken = {8420}
    monkeypatch.setattr(viewer, "free", lambda port: port not in taken)
    assert (viewer.free_from(8421), viewer.free_from(8422)) == (8421, 8422), "the first free port from the one asked for"
    taken.update({8421, 8422})
    assert viewer.free_from(8421) == 0, "none free is none"
    taken.clear()
    assert viewer.free_from(8422) == 8422 and viewer.free_from(8999) == 8420, "past the last port the search wraps to the first"
    serving = {8420: Identity(root=str(theirs)), 8421: Identity(root=str(mine))}
    monkeypatch.setattr(viewer, "identity", lambda url, timeout=0.05: serving.get(int(url.rsplit(":", 1)[1].rstrip("/"))))
    assert (viewer.other_journal_on(8420, mine), viewer.other_journal_on(8421, mine), viewer.other_journal_on(8422, mine)) == (True, False, False), \
        "a port is another journal's only when another root answers on it"
    taken.add(8420)
    assert viewer.available(mine, prefer=8420) == 8421, "a journal whose port went to another gets a free one"
    assert "another project's journal" in capsys.readouterr().err, "and says so"
    monkeypatch.setattr(viewer, "identity_at", lambda port: serving.get(port))
    viewer.PROBED[:] = [0.0, []]
    assert [port for port, _ in viewer.running_journals()] == [8420, 8421], "every journal answering on a viewer port is listed"
    monkeypatch.setattr(serve, "elsewhere", lambda root: "http://127.0.0.1:8421/")
    with pytest.raises(SystemExit) as stopped:
        serve.serve(mine)
    assert stopped.value.code == 0 and "already served at http://127.0.0.1:8421/" in capsys.readouterr().out, "a journal that is already served says where and starts nothing"


def old_curl(tmp_path: Path) -> Path:
    stub = tmp_path / "bin"
    stub.mkdir()
    (stub / "curl").write_text(f'#!/bin/sh\nfor a in "$@"; do [ "$a" = --url-query ] && {{ echo "curl: option --url-query: is unknown" >&2; exit 2; }}; done\nexec {shutil.which("curl")} "$@"\n')
    (stub / "curl").chmod(0o755)
    return stub


@contextmanager
def answering(seen: list):
    from http.server import BaseHTTPRequestHandler, HTTPServer

    class Reply(BaseHTTPRequestHandler):
        def do_POST(self):
            seen.append(self.path)
            self.rfile.read(int(self.headers.get("Content-Length") or 0))
            self.send_response(200)
            self.send_header("Content-Length", "2")
            self.end_headers()
            self.wfile.write(b"ok")

        def log_message(self, *_):
            pass

    server = HTTPServer(("127.0.0.1", 0), Reply)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    try:
        yield f"http://127.0.0.1:{server.server_port}/"
    finally:
        server.shutdown()


def test_the_hooks_and_the_command_reach_the_server_through_a_curl_older_than_7_87(tmp_path):
    from install import asks
    seen: list = []
    root = tmp_path / ".journal"
    (root / "runtime").mkdir(parents=True)
    env = {**os.environ, "PATH": f"{old_curl(tmp_path)}:{os.environ['PATH']}", "AGENT_JOURNAL_ACTIVE": "1", "JOURNAL_ENV": "main", "JOURNAL_ACTOR": "agent"}
    with answering(seen) as url:
        (root / "runtime" / "heartbeat").write_text(f"{int(time.time())} {url}\n")
        hook = subprocess.run(["sh", str(CODE / "hook.sh"), "claude", str(root)], input='{"hook_event_name": "Stop"}', env=env, capture_output=True, text=True, timeout=60)
        served = asks().split(") ;;")[0].split("case \"$1\" in ")[1].split("|")[0]
        shim = subprocess.run(["sh", "-c", f"root={root}\n{asks()}", "sh", served], env=env, capture_output=True, text=True, timeout=60)
    assert hook.returncode == 0 and not (root / "runtime" / "hook-failures.log").exists(), f"the hook was delivered: {hook.stderr}"
    assert any(path.startswith("/api/hook/claude?") and "root=" in path and "env=main" in path for path in seen), f"the hook carried its parameters in the query: {seen}"
    assert shim.stdout == "ok" and any(path.startswith("/api/run?") and "actor=agent" in path for path in seen), f"the command was delivered: {shim.stderr} {seen}"


def test_an_installer_run_by_a_python_older_than_3_10_says_what_is_needed(tmp_path):
    old = "/usr/bin/python3"
    if not Path(old).exists() or subprocess.run([old, "-c", "import sys; sys.exit(sys.version_info >= (3, 10))"], timeout=30).returncode:
        pytest.skip("no Python older than 3.10 here")
    stub = tmp_path / "bin"
    stub.mkdir()
    (stub / "python3").symlink_to(old)
    direct = subprocess.run([old, str(CODE / "install.py"), "upgrade", str(tmp_path)], capture_output=True, text=True, timeout=60)
    assert direct.returncode and "Python 3.10" in direct.stderr and "Traceback" not in direct.stderr, direct.stderr
    scripted = subprocess.run(["sh", str(HERE / "install.sh")], cwd=tmp_path, env={**os.environ, "PATH": f"{stub}:/usr/bin:/bin"}, capture_output=True, text=True, timeout=60)
    assert scripted.returncode and "Python 3.10" in scripted.stdout + scripted.stderr and not (tmp_path / ".journal").exists(), scripted.stdout + scripted.stderr


def test_install_sh_as_a_first_time_user_runs_it_installs_the_release_and_leaves_the_tests_behind(tmp_path):
    repo = tmp_path / "repo"
    shutil.copytree(HERE, repo, ignore=shutil.ignore_patterns(".git", ".venv", "node_modules", "__pycache__", ".journal", ".claude", "tests"), symlinks=False)
    git = {**os.environ, "GIT_AUTHOR_NAME": "t", "GIT_AUTHOR_EMAIL": "t@t", "GIT_COMMITTER_NAME": "t", "GIT_COMMITTER_EMAIL": "t@t"}
    for command in (["init", "-q"], ["add", "-A", "-f"], ["commit", "-q", "-m", "release"]):
        subprocess.run(["git", *command], cwd=repo, env=git, check=True, capture_output=True, timeout=120)
    project, home = tmp_path / "project", tmp_path / "home"
    for folder in (project / ".claude", home):
        folder.mkdir(parents=True)
    env = {**git, "HOME": str(home), "AGENT_JOURNAL_REPO": f"file://{repo}"}
    done = subprocess.run(["sh", str(HERE / "install.sh")], cwd=project, env=env, capture_output=True, text=True, timeout=300)
    release = (HERE / "VERSION").read_text().strip()
    assert done.returncode == 0, done.stdout + done.stderr
    assert (project / ".journal" / "src" / "VERSION").read_text().strip() == release, "the release's version arrives with the code"
    assert [p.name for p in (project / ".journal").glob("journal-*.pyz")] and all(p.name.startswith(f"journal-{release}-") for p in (project / ".journal").glob("journal-*.pyz")), \
        "the build is packed under the release's own version"
    assert not list((project / ".journal" / "src").rglob("test.py")), "no feature test is copied into a user's project"




def test_a_moved_or_upgraded_python_is_named_by_the_command_and_the_channel_check(tmp_path):
    root = installed(tmp_path)
    gone = tmp_path / "python-gone" / "bin" / "python3"
    for command in (root / "journal", tmp_path / "home" / ".local" / "bin" / "journal"):
        command.write_text(command.read_text().replace(sys.executable, str(gone)))
        ran = subprocess.run(["sh", str(command), "version"], cwd=root.parent, env={**os.environ, "HOME": str(tmp_path / "home")}, capture_output=True, text=True, timeout=60)
        assert (ran.returncode, "reinstall: re-run install.sh" in ran.stderr) == (1, True), f"{command}: {ran.stderr}"
    mcp = root.parent / ".mcp.json"
    config = json.loads(mcp.read_text())
    config["mcpServers"]["journal"]["command"] = str(gone)
    mcp.write_text(json.dumps(config))
    assert "reinstall: re-run install.sh" in PROVIDERS["claude"]().wiring_trouble(root.parent)


def test_a_hook_reaches_a_busy_server_whose_heartbeat_is_late_and_no_second_server_is_started(tmp_path, monkeypatch):
    seen: list = []
    root = tmp_path / ".journal"
    (root / "runtime").mkdir(parents=True)
    env = {**os.environ, "AGENT_JOURNAL_ACTIVE": "1", "JOURNAL_ENV": "main"}
    with answering(seen) as url:
        (root / "runtime" / "heartbeat").write_text(f"{int(time.time()) - 6} {url}\n")
        hook = subprocess.run(["sh", str(CODE / "hook.sh"), "claude", str(root)], input='{"hook_event_name": "Stop"}', env=env, capture_output=True, text=True, timeout=60)
        assert (hook.returncode, any(path.startswith("/api/hook/claude") for path in seen), (root / "runtime" / "hook-failures.log").exists()) == (0, True, False), \
            f"a heartbeat six seconds late is a busy server, not a dead one: {seen}"
        dead = tmp_path / "dead" / ".journal"
        (dead / "runtime").mkdir(parents=True)
        (dead / "runtime" / "heartbeat").write_text(f"{int(time.time()) - 6} http://127.0.0.1:1/\n")
        began = time.time()
        subprocess.run(["sh", str(CODE / "hook.sh"), "claude", str(dead)], input='{"hook_event_name": "Stop"}', env=env, capture_output=True, text=True, timeout=60)
        assert time.time() - began < 3 and "down" in (dead / "runtime" / "hook-failures.log").read_text() or "000" in (dead / "runtime" / "hook-failures.log").read_text(), "a dead server is still given up on at once"
    from http.server import BaseHTTPRequestHandler, HTTPServer

    class Slow(BaseHTTPRequestHandler):
        def do_GET(self):
            time.sleep(0.3)
            body = json.dumps({"root": str(root), "version": viewer.version(), "pid": slow.pid}).encode()
            self.send_response(200)
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)

        def log_message(self, *_):
            pass

    server = HTTPServer(("127.0.0.1", 0), Slow)
    slow = subprocess.Popen([sys.executable, "-c", "import time; time.sleep(60)", "serve", str(root)], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    server.pid = slow.pid
    threading.Thread(target=server.serve_forever, daemon=True).start()
    try:
        slow.__class__  # keep the stand-in process alive for the whole check
        Slow.pid = slow.pid
        slow_url = f"http://127.0.0.1:{server.server_port}/"
        write_text(viewer.marker(root), json.dumps({"url": slow_url, "at": time.time(), "port": server.server_port, "pid": slow.pid}))
        monkeypatch.setattr(viewer, "RESTARTING", 1.0)
        monkeypatch.setattr(viewer, "PORTS", [server.server_port])
        monkeypatch.setattr(viewer, "available", lambda *a, **k: pytest.fail("a second server was started"))
        assert viewer.launch(root, tmp_path) == (slow_url, None)
    finally:
        server.shutdown()
        slow.kill()
        slow.wait(timeout=10)


def test_a_server_that_starts_but_never_answers_is_stopped_and_counted_as_a_crash(tmp_path, monkeypatch):
    from runner.worker import crashing
    root = tmp_path / ".journal"
    (root / "runtime").mkdir(parents=True)
    monkeypatch.setattr(viewer, "COMING_UP", 1.0)
    monkeypatch.setattr(viewer, "PORTS", [59992])
    monkeypatch.setattr(viewer, "entry", lambda name: [sys.executable, "-c", "import time; time.sleep(600)"])
    exits = []
    for _ in range(3):
        url, code = viewer.launch(root, tmp_path)
        exits.append(code)
        assert (url, bool(code)) == ("", True), "a server that never answers fails the launch"
    assert crashing(exits), "three hung starts in a row roll the build back"
    assert "did not answer" in runtime.viewer_log(root).read_text(), "and the log says why in a line"


@pytest.mark.parametrize("present", [".claude", ".codex"])
def test_a_machine_with_only_one_agent_warms_up_without_ending_the_server(tmp_path, monkeypatch, present):
    import serve
    root = tmp_path / PROJECT / ".journal"
    root.mkdir(parents=True)
    (tmp_path / PROJECT / present).mkdir()
    monkeypatch.setenv("HOME", str(tmp_path / "home"))
    monkeypatch.setenv("PATH", "/usr/bin:/bin")
    monkeypatch.setattr(Path, "home", classmethod(lambda cls: tmp_path / "home"))
    exits = []
    monkeypatch.setattr(serve.os, "_exit", exits.append)
    serve.warmed(root)
    assert exits == [], f"warming a machine with only {present} must not end the server and make the supervisor roll back"


def test_a_plugin_service_runs_from_the_packed_build_and_stops_when_the_last_session_ends(tmp_path, free_port):
    root = installed(tmp_path)
    port = free_port()
    program = f"""
import json, os, sys, time
from pathlib import Path
sys.path.insert(0, {str(root / 'journal.pyz')!r})
from engine.services import Manager, service_spec, status_file
from engine.package import ZIPPED
root = Path({str(root)!r})
read, write = os.pipe()
os.set_inheritable(read, True)
service = service_spec(root, "demo.web", plugin="demo", service="web", port={port}, run=[sys.executable, "-m", "http.server", "{port}", "--bind", "127.0.0.1"])
Manager(root, read).one(service)
def state():
    f = status_file(root, "demo.web")
    return json.loads(f.read_text()).get("state") if f.is_file() else ""
def reached(wanted):
    until = time.time() + 20
    while time.time() < until and state() != wanted:
        time.sleep(0.2)
    return state()
ready = reached("ready")
os.close(write)
print(ZIPPED, ready, reached("stopped"))
"""
    ran = subprocess.run([sys.executable, "-c", program], capture_output=True, text=True, timeout=90)
    assert ran.stdout.split() == ["True", "ready", "stopped"], ran.stdout + ran.stderr


def menu_in_terminal(*typed) -> tuple[str, int]:
    import pty
    import select as waiting
    program = ("import sys, termios; sys.path.insert(0, %r); from commands.menu import pick\n"
               "def attrs():\n    flags = termios.tcgetattr(0)\n    flags[3] &= ~getattr(termios, 'PENDIN', 0)\n    return flags\n"
               "before = attrs()\n"
               "try:\n    chosen = pick('Start where?', ['one note'], ['first', 'second', 'third'], 0)\n"
               "except BaseException as stopped:\n    chosen = type(stopped).__name__ + ':' + str(stopped)\n"
               "print('RESULT', chosen, 'RESTORED', attrs() == before)\n") % str(CODE)
    import fcntl
    import termios
    master, slave = pty.openpty()
    child = subprocess.Popen([sys.executable, "-c", program], stdin=slave, stdout=slave, stderr=slave, start_new_session=True,
                             preexec_fn=lambda: fcntl.ioctl(0, termios.TIOCSCTTY, 0))
    os.close(slave)
    seen = b""
    try:
        for chunk in typed:
            until = time.time() + 5
            while b"to leave" not in seen and time.time() < until:
                if waiting.select([master], [], [], 0.1)[0]:
                    seen += os.read(master, 4096)
            for piece in chunk.split("|"):
                os.write(master, piece.encode())
                time.sleep(0.02)
            time.sleep(0.1)
        until = time.time() + 30
        while b"RESULT" not in seen and time.time() < until:
            if waiting.select([master], [], [], 0.2)[0]:
                try:
                    more = os.read(master, 4096)
                except OSError:
                    break
                if not more:
                    break
                seen += more
    finally:
        child.kill()
        child.wait(timeout=10)
        os.close(master)
    return seen.decode(errors="replace"), 0


@pytest.mark.parametrize("typed, expected", [
    (["\x1b[B", "\r"], "1"),
    (["\x1b|[B", "\x1b[|B", "\r"], "2"),
    (["\x1b[B\x1b[B\r"], "2"),
    (["3\r"], "2"),
    (["\x1b"], "SystemExit:journal: left without starting"),
    (["\x03"], "KeyboardInterrupt:"),
])
def test_the_start_menu_follows_the_keys_typed_in_a_real_terminal_and_gives_the_terminal_back(typed, expected):
    shown, _ = menu_in_terminal(*typed)
    assert f"RESULT {expected} RESTORED True" in shown.replace("\r", ""), shown


def test_a_start_menu_whose_input_ends_leaves_instead_of_spinning():
    from commands.menu import read_keys
    reading, writing = os.pipe()
    os.close(writing)
    with pytest.raises(SystemExit, match="input ended"):
        read_keys(reading)
    os.close(reading)


def test_a_record_made_by_version_2_60_0_upgrades_through_every_migration_and_the_journal_starts_on_it(tmp_path):
    import migrations
    place = tmp_path
    (place / PROJECT).mkdir(parents=True)
    with tarfile.open(HERE / "tests" / "fixtures" / "journal-2.60.0.tar.gz") as old:
        old.extractall(place / PROJECT, filter="data")
    for agent in (".claude", ".codex"):
        (place / PROJECT / agent).mkdir()
    env = {**os.environ, "HOME": str(place / "home"), "AGENT_JOURNAL_BOOTSTRAPPED": "1", "AGENT_JOURNAL_HOME": str(place / "home")}
    env.pop("JOURNAL_ENV", None)
    upgraded = subprocess.run([sys.executable, str(CODE / "install.py"), "upgrade", str(place / PROJECT)], env=env, capture_output=True, text=True, timeout=180)
    root = place / PROJECT / ".journal"
    assert (upgraded.returncode, "Traceback" in upgraded.stderr) == (0, False), upgraded.stdout + upgraded.stderr
    assert set(migrations.names()) <= set(migrations.applied(root)), f"every migration ran: {sorted(set(migrations.names()) - set(migrations.applied(root)))}"
    for words, expected in ((["status"], ""), (["doc", "all"], "Style guide"), (["todo", "all", "--completed"], "Write the first chapter"), (["rule", "all"], "Never ship on Friday")):
        ran = subprocess.run([sys.executable, str(root / "journal.py"), "--root", str(root), *words], cwd=place / PROJECT, env=env, capture_output=True, text=True, timeout=120)
        assert (ran.returncode, "Traceback" in ran.stderr, expected in ran.stdout) == (0, False, True), f"{words}: {ran.stdout[-400:]}{ran.stderr[-400:]}"
    launches(place, root / "journal.py", "claude")
