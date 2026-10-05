import http.client
import json
import os
import subprocess
import sys
import threading
import time
import zipfile
from contextlib import contextmanager
from pathlib import Path

from engine.heal import broken
from engine.package import point
from controllers.types import Todos
from engine.sessions import hold_build
from install import STUBS
from providers import DRIVERS
from resources.base import SYSTEM
from scripts.boot_guard import PROJECT, WAIT, launches
from scripts.checks.imports import imports, missing
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


def test_every_agent_launches_under_the_journal_and_exits_cleanly(tmp_path):
    for name in DRIVERS:
        launches(tmp_path / name, CODE / "journal.py", name)


def test_a_restart_brings_the_agent_back_under_the_same_supervisor(tmp_path):
    from engine import runtime
    from agents.terminal import relaunch
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


def test_every_agent_launches_from_an_installed_zip(tmp_path):
    place = tmp_path
    (place / PROJECT).mkdir()
    env = {**os.environ, "HOME": str(place / "home"), "AGENT_JOURNAL_BOOTSTRAPPED": "1"}
    installed = subprocess.run([sys.executable, str(CODE / "install.py"), "upgrade", str(place / PROJECT)], env=env, capture_output=True, text=True, timeout=120)
    root = place / PROJECT / ".journal"
    left = sorted(f.relative_to(root / "src").as_posix() for f in (root / "src").rglob("*.py"))
    assert ((root / "journal.pyz").is_file(), left) == (True, sorted(STUBS)), f"the Python is packed into one zip, a stub left at each old entry:\n{installed.stdout}{installed.stderr}"
    from engine import runtime
    assert not runtime.upgrading(root), "an upgrade that has finished leaves no mark, so the supervisor may reload"
    (root / "runtime" / "upgrading").touch()
    assert runtime.upgrading(root), "while one is under way, the mark holds the supervisor's reload back"
    (root / "runtime" / "upgrading").unlink()
    journal = [sys.executable, str(root / "journal.py"), "--root", str(root)]
    subprocess.run([*journal, "doc", "create", "Kept across upgrades"], cwd=place / PROJECT, env=env, capture_output=True, timeout=WAIT)
    again = subprocess.run([sys.executable, str(CODE / "install.py"), "upgrade", str(place / PROJECT)], env=env, capture_output=True, text=True, timeout=120)
    listed = subprocess.run([*journal, "doc", "all"], cwd=place / PROJECT, env=env, capture_output=True, text=True, timeout=WAIT).stdout
    assert "Kept across upgrades" in listed, f"a project record survives an upgrade:\n{again.stdout}{again.stderr}"
    repository = place / "release"
    shipped = subprocess.run(["git", "ls-files", "-co", "--exclude-standard"], cwd=HERE, capture_output=True, text=True, timeout=WAIT).stdout.split()
    for name in shipped:
        if (HERE / name).is_file():
            (repository / name).parent.mkdir(parents=True, exist_ok=True)
            (repository / name).write_bytes((HERE / name).read_bytes())
    for step in (["init", "-q"], ["add", "-A"], ["-c", "user.name=t", "-c", "user.email=t@t", "commit", "-q", "-m", "release"]):
        subprocess.run(["git", *step], cwd=repository, capture_output=True, timeout=WAIT)
    itself = subprocess.run([*journal, "upgrade"], cwd=place / PROJECT, env={**env, "AGENT_JOURNAL_REPO": str(repository), "AGENT_JOURNAL_BOOTSTRAPPED": ""},
                            capture_output=True, text=True, timeout=180)
    listed = subprocess.run([*journal, "doc", "all"], cwd=place / PROJECT, env=env, capture_output=True, text=True, timeout=WAIT).stdout
    assert ("Traceback" not in itself.stdout + itself.stderr, "Kept across upgrades" in listed, (root / "journal.pyz").resolve().name.startswith("journal-")) == (True, True, True), \
        f"an installed journal upgrades itself from a release, keeps its records, and runs from a versioned build:\n{itself.stdout}{itself.stderr}"
    for name in DRIVERS:
        launches(place, root / "journal.py", name)
    (repository / "src" / "channel.py").write_text((repository / "src" / "channel.py").read_text() + f"\nRELEASE = {os.urandom(4000).hex()!r}\n")
    subprocess.run(["git", "-c", "user.name=t", "-c", "user.email=t@t", "commit", "-qam", "a new build"], cwd=repository, capture_output=True, timeout=WAIT)

    moved = []

    def upgraded():
        subprocess.run([*journal, "upgrade"], cwd=place / PROJECT, env={**env, "AGENT_JOURNAL_REPO": str(repository), "AGENT_JOURNAL_BOOTSTRAPPED": ""},
                       capture_output=True, timeout=180)
        newest, began = (root / "journal.pyz").resolve().name, time.time()
        while not moved and time.time() - began < WAIT:
            moved.extend(marker for marker in (root / "runtime" / "builds").glob("*") if marker.read_text() == newest)
            time.sleep(0.2)

    launches(place, root / "journal.py", "claude", during=upgraded)
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
    from engine.package import code_stamp
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
    from providers import PROVIDERS
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
    asked = (f"import sys; from pathlib import Path; sys.path.insert(0, {str(here / 'journal.pyz')!r}); from engine.package import entry_in, own_build; "
             f"print(entry_in(Path({str(there)!r}), 'supervisor')[1], own_build(Path({str(here)!r})), own_build(Path({str(there)!r})), sep='|')")
    launched, mine, theirs = subprocess.run([sys.executable, "-c", asked], capture_output=True, text=True, timeout=WAIT).stdout.strip().split("|")
    assert launched == str(there / "journal.pyz"), "a journal launching a session for another starts it on that journal's build, never its own"
    assert (mine, theirs) == ("True", "False"), "a worker on another journal's build knows it, and leaves that journal's servers to its own sessions"


def test_a_killed_server_is_reaped_so_a_new_one_starts(tmp_path, monkeypatch):
    import signal
    from engine import viewer
    from engine.sessions import alive
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
    url, started = viewer.launch(root, root.parent)
    try:
        assert url, "a new server starts where the killed one was"
    finally:
        if started and alive(started):
            os.kill(started, signal.SIGTERM)


def test_a_message_shown_while_the_server_is_down_reaches_the_chat_once_it_is_back(tmp_path):
    root = installed(tmp_path)
    env = {**os.environ, "HOME": str(tmp_path / "home"), "AGENT_JOURNAL_ACTIVE": "1", "JOURNAL_ENV": ""}
    journal = [sys.executable, str(root / "journal.py"), "--root", str(root)]
    wired = json.loads((root.parent / ".claude" / "settings.local.json").read_text())["hooks"]["SessionStart"][0]["hooks"][0]["command"]
    hook = lambda body: subprocess.run(["sh", "-c", wired], input=json.dumps(body), text=True, env=env, capture_output=True, timeout=WAIT)
    channel = json.loads((root.parent / ".mcp.json").read_text())["mcpServers"]["journal"]
    assert channel == {"command": sys.executable, "args": [str(root / "journal.py"), "-m", "channel", str(root)]}, \
        "the channel runs the interpreter that installed it, with a path that has a space in it kept whole"
    shown = {"hook_event_name": "MessageDisplay", "session_id": "s1", "message_id": "m1", "index": 0, "final": True, "delta": "said while the server was down"}

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
    hook(shown)
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
    import threading
    import types
    import migrations
    from engine.stored import append_text, write_text
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
    left = lambda: list(root.glob(f".{migrations.BACKUP}-*"))
    assert (kept.read_text(), added.read_text(), events.read_text(), migrations.applied(root), left()) == \
           ("the user's row", "written while migrating", "an event emitted while migrating\n", {}, []), \
        "a failed migration restores its backup before a waiting record write lands"
    monkeypatch.setattr(migrations, "names", lambda: ["m9998_touch"])
    assert migrations.run(root) == ["m9998_touch"] and not left(), "a run that succeeds deletes its backup"


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
    from serve import Handler, JournalServer
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


def test_an_upload_and_the_file_route_stay_inside_the_rows_folder():
    record = fresh()
    row = Todos(record, actor=SYSTEM).create("a row with files")
    edge = "xBOUNDARYx"
    parts = b"".join(f'--{edge}\r\nContent-Disposition: form-data; name="file"; filename="{name}"\r\n\r\n{text}\r\n'.encode() for name, text in (("a.txt", "one"), ("b.txt", "two")))
    with serving(record) as port:
        base = f"/api/{record.env}/todo/{row.n}"
        status, body = asked(port, "POST", f"{base}/upload", parts + f"--{edge}--\r\n".encode(), f"multipart/form-data; boundary={edge}")
        assert (status, json.loads(body)["files"]) == (200, ["a.txt", "b.txt"]), "a two-part upload answers both file names"
        assert asked(port, "GET", f"{base}/files/b.txt") == (200, b"two"), "an attached file is served back"
        assert asked(port, "GET", f"{base}/files/..%2Fx")[0] == 400, "a name that climbs out of the folder is refused"
        assert asked(port, "POST", f"{base}/detach", json.dumps({"name": "../x"}).encode())[0] == 400, "detaching a name outside the folder is refused"
        assert sorted(Todos(record, actor=SYSTEM).load(row.n).files) == ["a.txt", "b.txt"], "a refused call leaves the attached files as they were"


def test_the_event_stream_opens_carries_an_event_and_frees_its_watcher_on_disconnect():
    from engine import bus
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
    from engine import locks
    from engine.stored import write_text
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
