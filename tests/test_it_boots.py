import json
import os
import subprocess
import sys
import time
import zipfile
from pathlib import Path

from engine.heal import broken
from engine.package import point
from engine.sessions import hold_build
from install import STUBS
from providers import DRIVERS
from scripts.boot_guard import WAIT, launches
from scripts.checks.imports import imports, missing

HERE = Path(__file__).resolve().parents[1]


def installed(place: Path) -> Path:
    (place / "project").mkdir()
    env = {**os.environ, "HOME": str(place / "home"), "AGENT_JOURNAL_BOOTSTRAPPED": "1"}
    subprocess.run([sys.executable, str(HERE / "install.py"), "upgrade", str(place / "project")], env=env, capture_output=True, timeout=120)
    return place / "project" / ".journal"


def test_every_import_in_the_package_resolves():
    assert [f"{path.name}:{node.lineno}" for path, node in imports() for alias in node.names if missing(node.module, alias.name)] == []


def test_every_agent_launches_under_the_journal_and_exits_cleanly(tmp_path):
    for name in DRIVERS:
        launches(tmp_path / name, HERE / "journal.py", name)


def test_every_agent_launches_from_an_installed_zip(tmp_path):
    place = tmp_path
    (place / "project").mkdir()
    env = {**os.environ, "HOME": str(place / "home"), "AGENT_JOURNAL_BOOTSTRAPPED": "1"}
    installed = subprocess.run([sys.executable, str(HERE / "install.py"), "upgrade", str(place / "project")], env=env, capture_output=True, text=True, timeout=120)
    root = place / "project" / ".journal"
    left = sorted(f.relative_to(root / "src").as_posix() for f in (root / "src").rglob("*.py"))
    assert ((root / "journal.pyz").is_file(), left) == (True, sorted(STUBS)), f"the Python is packed into one zip, a stub left at each old entry:\n{installed.stdout}{installed.stderr}"
    journal = [sys.executable, str(root / "journal.py"), "--root", str(root)]
    subprocess.run([*journal, "doc", "create", "Kept across upgrades"], cwd=place / "project", env=env, capture_output=True, timeout=WAIT)
    again = subprocess.run([sys.executable, str(HERE / "install.py"), "upgrade", str(place / "project")], env=env, capture_output=True, text=True, timeout=120)
    listed = subprocess.run([*journal, "doc", "all"], cwd=place / "project", env=env, capture_output=True, text=True, timeout=WAIT).stdout
    assert "Kept across upgrades" in listed, f"a project record survives an upgrade:\n{again.stdout}{again.stderr}"
    repository = place / "release"
    shipped = subprocess.run(["git", "ls-files", "-co", "--exclude-standard"], cwd=HERE, capture_output=True, text=True, timeout=WAIT).stdout.split()
    for name in shipped:
        if (HERE / name).is_file():
            (repository / name).parent.mkdir(parents=True, exist_ok=True)
            (repository / name).write_bytes((HERE / name).read_bytes())
    for step in (["init", "-q"], ["add", "-A"], ["-c", "user.name=t", "-c", "user.email=t@t", "commit", "-q", "-m", "release"]):
        subprocess.run(["git", *step], cwd=repository, capture_output=True, timeout=WAIT)
    itself = subprocess.run([*journal, "upgrade"], cwd=place / "project", env={**env, "AGENT_JOURNAL_REPO": str(repository), "AGENT_JOURNAL_BOOTSTRAPPED": ""},
                            capture_output=True, text=True, timeout=180)
    listed = subprocess.run([*journal, "doc", "all"], cwd=place / "project", env=env, capture_output=True, text=True, timeout=WAIT).stdout
    assert ("Traceback" not in itself.stdout + itself.stderr, "Kept across upgrades" in listed, (root / "journal.pyz").resolve().name.startswith("journal-")) == (True, True, True), \
        f"an installed journal upgrades itself from a release, keeps its records, and runs from a versioned build:\n{itself.stdout}{itself.stderr}"
    for name in DRIVERS:
        launches(place, root / "journal.py", name)
    (repository / "channel.py").write_text((repository / "channel.py").read_text() + f"\nRELEASE = {os.urandom(4000).hex()!r}\n")
    subprocess.run(["git", "-c", "user.name=t", "-c", "user.email=t@t", "commit", "-qam", "a new build"], cwd=repository, capture_output=True, timeout=WAIT)

    def upgraded():
        subprocess.run([*journal, "upgrade"], cwd=place / "project", env={**env, "AGENT_JOURNAL_REPO": str(repository), "AGENT_JOURNAL_BOOTSTRAPPED": ""},
                       capture_output=True, timeout=180)

    launches(place, root / "journal.py", "claude", during=upgraded)


def test_the_journal_starts_on_a_record_with_a_damaged_row(tmp_path):
    place = tmp_path
    root = place / ".journal"
    journal = [sys.executable, str(HERE / "journal.py"), "--root", str(root)]
    subprocess.run([*journal, "todo", "create", "a row"], cwd=place, capture_output=True, timeout=WAIT)
    (root / "environments" / "main" / "todo" / "002.md").write_text("")
    (root / "environments" / "main" / "todo" / "003.md").write_text('---\n{"n": 3, "title": "odd", "unknown_field": 1}\n---\nbody\n')
    ran = subprocess.run([*journal, "status"], cwd=place, capture_output=True, text=True, timeout=WAIT)
    assert (ran.returncode, "Traceback" in ran.stderr) == (0, False), f"a damaged row stopped the journal:\n{ran.stderr}"


def test_an_upgrade_keeps_a_build_a_live_session_runs_from(tmp_path):
    root = installed(tmp_path)
    good = (root / "journal.pyz").resolve()
    old = [root / f"journal-0.0.{i}-old000000{i}.pyz" for i in range(3)]
    for i, build in enumerate(old):
        build.write_bytes(good.read_bytes())
        os.utime(build, (i, i))
    hold_build(root, old[0])
    subprocess.run([sys.executable, str(HERE / "install.py"), "upgrade", str(root.parent)], env={**os.environ, "HOME": str(tmp_path / "home"), "AGENT_JOURNAL_BOOTSTRAPPED": "1"},
                   capture_output=True, timeout=120)
    assert [build.is_file() for build in old] == [True, False, True], "the build a live process runs from is kept; the other old ones go"


def test_a_build_whose_supervisor_dies_on_start_goes_back_to_the_last_good_one(tmp_path):
    place, root = tmp_path, installed(tmp_path)
    good = (root / "journal.pyz").resolve()
    bad = root / "journal-99.0.0-broken0000.pyz"
    with zipfile.ZipFile(good) as source, zipfile.ZipFile(bad, "w") as target:
        for item in source.infolist():
            if not item.filename.startswith("engine/supervisor."):
                target.writestr(item, source.read(item))
        target.writestr("engine/supervisor.py", "raise SystemExit(1)\n")
    point(root, bad)
    launches(place, root / "journal.py", "codex")
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
    def healed():
        began = time.time()
        while (root / "journal.pyz").resolve() != good and time.time() - began < WAIT:
            time.sleep(0.2)

    launches(place, root / "journal.py", "codex", during=healed)
    assert ((root / "journal.pyz").resolve(), broken(root)) == (good, [bad.name]), "the journal went back to the build that works and remembers the broken one"


def test_a_message_shown_while_the_server_is_down_reaches_the_chat_once_it_is_back(tmp_path):
    root = installed(tmp_path)
    env = {**os.environ, "HOME": str(tmp_path / "home"), "AGENT_JOURNAL_ACTIVE": "1", "JOURNAL_ENV": ""}
    journal = [sys.executable, str(root / "journal.py"), "--root", str(root)]
    hook = lambda body: subprocess.run(["sh", str(root / "src" / "hook.sh"), "claude", str(root)], input=json.dumps(body), text=True, env=env, capture_output=True, timeout=WAIT)
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
    import types
    import migrations
    root = tmp_path / ".journal"
    (root / "environments" / "main" / "todo").mkdir(parents=True)
    kept = root / "environments" / "main" / "todo" / "001.md"
    kept.write_text("the user's row")
    touched, broke = types.ModuleType("migrations.m9998_touch"), types.ModuleType("migrations.m9999_break")
    touched.run = lambda r: kept.write_text("changed halfway") or "touched"

    def breaking(r):
        raise RuntimeError("the migration broke")
    broke.run = breaking
    monkeypatch.setitem(sys.modules, "migrations.m9998_touch", touched)
    monkeypatch.setitem(sys.modules, "migrations.m9999_break", broke)
    monkeypatch.setattr(migrations, "names", lambda: ["m9998_touch", "m9999_break"])
    try:
        migrations.run(root)
    except RuntimeError:
        pass
    left = lambda: list(root.glob(f".{migrations.BACKUP}-*"))
    assert (kept.read_text(), migrations.applied(root), left()) == ("the user's row", {}, []), \
        "a failed migration puts every file back, records nothing as applied, and clears its backup"
    monkeypatch.setattr(migrations, "names", lambda: ["m9998_touch"])
    assert migrations.run(root) == ["m9998_touch"] and not left(), "a run that succeeds deletes its backup"
