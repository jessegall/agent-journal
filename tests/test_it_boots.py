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
from engine.record import Record
from engine.sessions import Sessions, alive, hold_build
from engine.stop import ask
from engine.stored import append_text, write_text
from install import STUBS, fetch, version_in
from providers import DRIVERS, PROVIDERS
from resources.base import SYSTEM
from scripts.boot_guard import PROJECT, WAIT, cleared, ended, launches
from scripts.checks.imports import imports, missing
from serve import Handler, JournalServer
from tests import isolation
from tests.conftest import fresh, installed, installed_once

def shipped(copy: Path) -> None:
    """One copy of the files the checkout ships, taken once, so every version a test reads comes from the same moment."""
    checkout = Path(__file__).resolve().parents[1]
    names = subprocess.run(["git", "ls-files", "-co", "--exclude-standard"], cwd=checkout, capture_output=True, text=True, timeout=60).stdout.split()
    for name in names:
        if (checkout / name).is_file():
            (copy / name).parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(checkout / name, copy / name)


HERE = isolation.shared("shipped", shipped)
CODE = HERE / "src"


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


def release(repository: Path) -> None:
    shutil.copytree(HERE, repository, symlinks=True)
    for step in (["init", "-q"], ["add", "-A"], ["-c", "user.name=t", "-c", "user.email=t@t", "commit", "-q", "-m", "release"]):
        subprocess.run(["git", *step], cwd=repository, capture_output=True, timeout=WAIT)


def released(place: Path) -> Path:
    repository = place / "release"
    uncompressed = ["-c", "pack.window=0", "-c", "pack.compression=0"]
    subprocess.run(["git", "clone", "-q", "--local", *uncompressed, str(isolation.shared("release", release)), str(repository)], capture_output=True, timeout=WAIT, check=True)
    return repository


def upgrade_from(repository: Path, root: Path) -> subprocess.CompletedProcess:
    env = {**os.environ, "HOME": str(root.parents[1] / "home"), "AGENT_JOURNAL_REPO": str(repository), "AGENT_JOURNAL_BOOTSTRAPPED": ""}
    return subprocess.run([sys.executable, str(root / "journal.py"), "--root", str(root), "upgrade"], cwd=root.parent, env=env, capture_output=True, text=True, timeout=180)


def as_older_installer(root: Path) -> None:
    older = root / "journal-0.0.1-older00000.pyz"
    with zipfile.ZipFile((root / "journal.pyz").resolve()) as current, zipfile.ZipFile(older, "w", zipfile.ZIP_DEFLATED) as target:
        for item in current.infolist():
            if item.filename == "install.pyc":
                continue
            data = current.read(item)
            if item.filename == "install.py":
                data = data.decode().replace('"migrations", "overview", ', '"migrations", ').replace("trees = layout(source)", "trees = PACKAGE_TREES").encode()
            target.writestr(item, data)
    point(root, older)


def test_an_upgrade_from_an_older_installer_fills_in_a_folder_the_release_added(tmp_path):
    root = installed(tmp_path, CODE)
    as_older_installer(root)
    repository = released(tmp_path)
    subprocess.run(["git", "tag", f"v{(HERE / 'VERSION').read_text().strip()}"], cwd=repository, capture_output=True, timeout=WAIT)
    upgraded = upgrade_from(repository, root)
    with zipfile.ZipFile((root / "journal.pyz").resolve()) as packed:
        held = "overview/__init__.py" in packed.namelist()
    status = subprocess.run([sys.executable, str(root / "journal.py"), "--root", str(root), "status"], cwd=root.parent, env={**os.environ, "HOME": str(tmp_path / "home")}, capture_output=True, text=True, timeout=WAIT)
    assert (held, "failed" in upgraded.stdout, "ModuleNotFoundError" in status.stderr, status.returncode) == (True, False, False, 0), f"an older installer's upgrade still brings in every folder the release added:\n{upgraded.stdout}{upgraded.stderr}{status.stderr}"


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
    root = installed(tmp_path, CODE)
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


def test_a_fetch_from_inside_a_git_hook_leaves_the_pushing_repository_alone(tmp_path, monkeypatch):
    def git(where: Path, *args: str) -> str:
        return subprocess.run(["git", "-c", "user.name=t", "-c", "user.email=t@t", *args], cwd=where, capture_output=True, text=True, timeout=30, check=True).stdout.strip()
    for repository in ("pushing", "release"):
        (tmp_path / repository).mkdir()
        git(tmp_path / repository, "init", "-q")
        git(tmp_path / repository, "commit", "-q", "--allow-empty", "-m", repository)
    pushing = tmp_path / "pushing"
    head = git(pushing, "rev-parse", "HEAD")
    monkeypatch.setenv("GIT_DIR", str(pushing / ".git"))
    monkeypatch.setenv("GIT_INDEX_FILE", str(pushing / ".git" / "index"))
    fetched = fetch(tmp_path / "into", str(tmp_path / "release"))
    monkeypatch.delenv("GIT_DIR")
    monkeypatch.delenv("GIT_INDEX_FILE")
    assert (fetched, git(pushing, "config", "core.bare"), (pushing / ".git" / "shallow").exists(), git(pushing, "rev-parse", "HEAD")) == \
        ((git(tmp_path / "release", "rev-parse", "HEAD"), ""), "false", False, head), "a fetch run from a hook lands in its own folder and never touches the repository the hook runs in"


def test_a_legacy_install_copies_managed_files_and_updates_without_holding(tmp_path):
    root = installed(tmp_path, CODE)
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


def test_every_agent_launches_from_an_installed_zip(tmp_path):
    entry = installed(tmp_path, CODE) / "journal.py"
    for name in DRIVERS:
        launches(tmp_path, entry, name)


def test_the_launcher_carries_its_running_agent_over_to_a_new_build(tmp_path):
    root = installed(tmp_path, CODE)
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


def test_an_upgrade_leaves_a_helper_running_and_its_job_out_of_the_process_list(tmp_path):
    root = installed(tmp_path, CODE)
    repository = released(tmp_path)
    (tmp_path / "bin").mkdir()
    standin = tmp_path / "bin" / "claude"
    standin.write_text("#!/bin/sh\nwhile [ ! -f \"$0.quit\" ]; do sleep 0.1; done\n")
    standin.chmod(0o755)
    env = {**os.environ, "PATH": f"{tmp_path / 'bin'}{os.pathsep}{os.environ['PATH']}", "HOME": str(tmp_path / "home"), "AGENT_JOURNAL_HOME": str(tmp_path / "home")}
    env.pop("JOURNAL_ENV", None)
    phrase = f"stop the stuck build {os.getpid()}-{time.time_ns()}"
    launch = (f"import sys; sys.path.insert(0, {str(CODE)!r}); from pathlib import Path; from engine.record import Record; "
              f"from agents.terminal import prompted; from features.agent_sessions.launch import launched, prepared; "
              f"from resources.types import EnvironmentKind; record = Record(Path({str(root)!r}), 'main'); "
              f"prepared(record, 'main-ada', 'a helper', '', record.root.parent, EnvironmentKind.HELPER); "
              f"launched(record, 'main-ada', 'claude', prompted(record.root, 'main-ada', ['--model', 'opus'], {phrase!r}), record.root.parent)")

    def running() -> tuple[int, int]:
        listed = [line for line in subprocess.run(["ps", "-eo", "stat=,command="], capture_output=True, text=True, timeout=WAIT).stdout.splitlines()
                  if not line.lstrip().startswith("Z")]
        return sum(f"/bin/sh {standin}" in line for line in listed), sum("-m supervisor" in line and str(root) in line for line in listed)

    def settled(wanted: tuple[int, int]) -> tuple[int, int]:
        began = time.time()
        while running() != wanted and time.time() - began < WAIT:
            time.sleep(0.2)
        return running()

    try:
        subprocess.run([sys.executable, "-c", launch], cwd=root.parent, env=env, capture_output=True, timeout=WAIT, check=True)
        assert settled((1, 1)) == (1, 1), "the helper's agent and its supervisor start"
        (repository / "src" / "channel.py").write_text((repository / "src" / "channel.py").read_text() + f"\nRELEASE = {os.urandom(8).hex()!r}\n")
        subprocess.run(["git", "-c", "user.name=t", "-c", "user.email=t@t", "commit", "-qam", "a new build"], cwd=repository, capture_output=True, timeout=WAIT)
        upgrade_from(repository, root)
        time.sleep(5)
        assert running() == (1, 1), "an upgrade reloads the helper's worker and leaves its agent and supervisor running"
        matched = subprocess.run(["pgrep", "-f", phrase], capture_output=True, text=True, timeout=WAIT).stdout.split()
        assert not matched, "no phrase of the helper's job is on a command line, so pkill -f aimed at a build or a test never ends a helper"
    finally:
        (tmp_path / "bin" / "claude.quit").touch()
        subprocess.run([sys.executable, str(root / "journal.py"), "--root", str(root), "stop"], cwd=root.parent, env=env, capture_output=True, timeout=WAIT)
        cleared(tmp_path)


def test_a_helper_launched_into_an_environment_runs_from_its_launch(tmp_path):
    root = installed(tmp_path, CODE)
    (tmp_path / "bin").mkdir()
    standin = tmp_path / "bin" / "claude"
    standin.write_text("#!/bin/sh\nwhile [ ! -f \"$0.quit\" ]; do sleep 0.1; done\n")
    standin.chmod(0o755)
    env = {**os.environ, "PATH": f"{tmp_path / 'bin'}{os.pathsep}{os.environ['PATH']}", "HOME": str(tmp_path / "home"), "AGENT_JOURNAL_HOME": str(tmp_path / "home")}
    env.pop("JOURNAL_ENV", None)
    head = (f"import sys; sys.path.insert(0, {str(CODE)!r}); from pathlib import Path; from engine.record import Record; "
            f"from features.agent_sessions.launch import launched, prepared, running_in; "
            f"from resources.types import EnvironmentKind; record = Record(Path({str(root)!r}), 'main'); ")
    launch = head + "prepared(record, 'main-ada', 'a helper', '', record.root.parent, EnvironmentKind.HELPER); launched(record, 'main-ada', 'claude', ['--model', 'opus'], record.root.parent)"
    asked = head + "print(running_in(record, 'main-ada'), running_in(record, 'main-bob'))"
    try:
        subprocess.run([sys.executable, "-c", launch], cwd=root.parent, env=env, capture_output=True, timeout=WAIT, check=True)
        answer = ""
        began = time.time()
        while not answer.startswith("claude-") and time.time() - began < WAIT:
            time.sleep(0.2)
            answer = subprocess.run([sys.executable, "-c", asked], cwd=root.parent, env=env, capture_output=True, text=True, timeout=WAIT).stdout
        assert answer.startswith("claude-") and answer.split(" ")[1].strip() == "", "the agent launched into an environment runs there, and nothing runs in another"
    finally:
        (tmp_path / "bin" / "claude.quit").touch()
        subprocess.run([sys.executable, str(root / "journal.py"), "--root", str(root), "stop"], cwd=root.parent, env=env, capture_output=True, timeout=WAIT)
        cleared(tmp_path)


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
    root = installed(tmp_path, CODE)
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


def test_an_upgrade_to_the_version_already_installed_fetches_nothing_and_keeps_the_build(tmp_path):
    root = installed(tmp_path, CODE)
    repository = released(tmp_path)
    subprocess.run(["git", "tag", f"v{version_in(root / 'src')}"], cwd=repository, capture_output=True, timeout=WAIT, check=True)
    build = (root / "journal.pyz").resolve()
    upgraded = upgrade_from(repository, root)
    assert ("package already at" in upgraded.stdout, "Traceback" in upgraded.stdout + upgraded.stderr, (root / "journal.pyz").resolve()) == (True, False, build), \
        f"an upgrade to the installed version fetches and packs nothing:\n{upgraded.stdout}{upgraded.stderr}"


def heals(root: Path, good: Path):
    def healed() -> None:
        began = time.time()
        while (root / "journal.pyz").resolve() != good and time.time() - began < WAIT:
            time.sleep(0.2)
    return healed


def test_a_build_whose_supervisor_dies_on_start_goes_back_to_the_last_good_one(tmp_path):
    place, root = tmp_path, installed(tmp_path, CODE)
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
    place, root = tmp_path, installed(tmp_path, CODE)
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
    root = installed(tmp_path, CODE)
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
    here, there = installed_once(), installed(tmp_path / "there", CODE)
    program = (f"import sys; from pathlib import Path; sys.path.insert(0, {str(here / 'journal.pyz')!r}); from engine.package import entry_in, own_build; "
             f"print(entry_in(Path({str(there)!r}), 'supervisor')[1], own_build(Path({str(here)!r})), own_build(Path({str(there)!r})), sep='|')")
    launched, mine, theirs = subprocess.run([sys.executable, "-c", program], capture_output=True, text=True, timeout=WAIT).stdout.strip().split("|")
    assert launched == str(there / "journal.pyz"), "a journal launching a session for another starts it on that journal's build, never its own"
    assert (mine, theirs) == ("True", "False"), "a worker on another journal's build knows it, and leaves that journal's servers to its own sessions"


def test_a_killed_server_is_reaped_so_a_new_one_starts(tmp_path, monkeypatch):
    root = installed(tmp_path, CODE)
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
    root = installed(tmp_path, CODE)
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
    unsent = lambda: sorted((root / "runtime" / "unsent").glob("*.json"))
    after = {"hook_event_name": "PostToolUse", "session_id": "s1", "cwd": str(root.parent), "tool_name": "Bash", "tool_input": {"command": "echo spooled"}, "tool_response": {"stdout": "spooled"}}
    kept_before = len(unsent())
    hook(after)
    hook({**after, "hook_event_name": "PreToolUse"})
    spooled = unsent()[kept_before:]
    assert sorted(json.loads(kept.read_text())["body"]["hook_event_name"] for kept in spooled) == ["PostToolUse", "PreToolUse"], \
        "an event that decides nothing is kept in the spool whole, and so is one that decides something, which is read late"
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
    from controllers.types import Agents
    from engine.record import Record
    from engine import runtime as runtime_folder
    from resources.base import SYSTEM
    assert not unsent() and Agents(Record(root, runtime_folder.env(root)), actor=SYSTEM).by_session("s1").data.get("tool") == "Bash", \
        "and so does an event the hook kept: the server replays it, and the spool is empty"


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
    synced_row = root / "environments" / "main" / "todo" / "003.md"
    kept.write_text("first")
    backup = migrations.backed_up(root)
    began = time.time()
    kept.write_text("changed after the copy began")
    synced_row.write_text("added after the copy began")
    (root / "environments" / "main" / "todo" / "002.md").unlink()
    migrations.synced(root, backup, began)
    held = backup / "environments" / "main" / "todo"
    assert (sorted(path.name for path in held.iterdir()), (held / "001.md").read_text()) == (["001.md", "003.md"], "changed after the copy began"), \
        "a backup made before the lock is brought up to date under it: changed and added rows are copied, removed ones dropped"
    shutil.rmtree(backup)
    monkeypatch.setattr(migrations, "names", lambda: ["m9998_touch", "m9997_more"])
    with locks.hold_record_writes(root):
        began = time.monotonic()
        assert (migrations.run(root, waiting=False), time.monotonic() - began < 1.0) == ([], True), "a server starting up while an upgrade migrates does not wait for its lock"


def test_an_installer_left_with_only_itself_fetches_the_package_and_finishes(tmp_path):
    code = tmp_path / ".journal" / "src"
    code.mkdir(parents=True)
    (code / "install.py").write_bytes((HERE / "install.py").read_bytes())
    ran = subprocess.run([sys.executable, str(code / "install.py"), "finish", str(tmp_path)], cwd=tmp_path, capture_output=True, text=True,
                         timeout=WAIT * 4, env={**os.environ, "AGENT_JOURNAL_REPO": str(released(tmp_path))})
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
    with locks.hold_record_writes(root):
        writers = [threading.Thread(target=writing, args=(f"together {n}", root / "environments" / "main" / "todo" / f"00{n}.md")) for n in range(4)]
        began = time.monotonic()
        for worker in writers:
            worker.start()
        for worker in writers:
            worker.join(WAIT)
        waited = time.monotonic() - began
    assert ([outcomes[f"together {n}"] for n in range(4)], waited < 1.0) == (["timed out"] * 4, True), \
        "writers held back together time out together, not one wait after another"
    writing("after", root / "environments" / "main" / "todo" / "001.md")
    assert outcomes["after"] == "written", "once the migration lets go the same write goes through"
    from controllers.faults import log_file, threw
    caught = []

    def engine_pass() -> None:
        try:
            write_text(root / "environments" / "main" / "todo" / "held-back.txt", "held back")
        except TimeoutError as error:
            caught.append(error)
            threw(root, "main", "the engine")

    with locks.hold_record_writes(root):
        worker = threading.Thread(target=engine_pass)
        worker.start()
        worker.join(WAIT)
    assert [type(error) for error in caught] == [locks.MigrationsRunning], "a write held back by a migration says so in its own exception"
    assert not log_file(root).exists(), "an engine pass that waited out an upgrade's migration is tried again quietly, never reported as an error"


def test_a_running_server_restarts_on_a_new_build_and_exits_when_asked_to_stop(tmp_path):
    root = installed(tmp_path, CODE)
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

    marker, marked = root / "runtime" / "restarting", threading.Event()

    def watch_marker() -> None:
        while not marked.is_set():
            if marker.is_file():
                marked.set()
            time.sleep(0.01)
    threading.Thread(target=watch_marker, daemon=True).start()
    touched = [0.0]

    def touch() -> None:
        if time.time() - touched[0] > 4:
            os.utime(root / "journal.pyz")
            touched[0] = time.time()

    try:
        assert prints("http://127.0.0.1:"), "the server prints where it is serving"
        assert prints("restarting on the same port", touch), "a new build of the code restarts the server on the port it had"
        assert prints("http://127.0.0.1:", times=2), "the restarted server serves again"
        assert marked.wait(WAIT), "the server marks its restart before it stops serving, so a hook meanwhile retries"
        gone = time.time() + WAIT
        while marker.is_file() and time.time() < gone:
            time.sleep(0.1)
        assert not marker.is_file(), "and the new server takes the mark away once it answers, so a later crash is told"
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


def supervised(place: Path, agent: str, worker: str, headless: bool = True, ended: str = "") -> tuple[subprocess.CompletedProcess, Path]:
    root = place / ".journal"
    (place / "heals").write_text("")
    spec = {"root": str(root), "cwd": str(place), "env": "main", "agent": "claude", "worker": [sys.executable, "-c", worker], "args": [],
            "heal": [sys.executable, "-c", f"open({str(place / 'heals')!r}, 'a').write('x'); print('healed')"],
            "ended": [sys.executable, "-c", f"{ended}open({str(place / 'ended')!r}, 'w').write('x')"],
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
    deadline = time.time() + WAIT
    while not (tmp_path / "ended").is_file() and time.time() < deadline:
        time.sleep(0.05)
    assert ((tmp_path / "ended").is_file(), subprocess.run(["kill", "-0", str(pid)], capture_output=True).returncode != 0) == (True, True), "the journal is told the agent ended and no agent process is left"


def test_a_supervisor_does_not_wait_for_the_journal_to_clean_up_after_the_agent(tmp_path):
    began = time.time()
    done, session = supervised(tmp_path, "print('bye', flush=True)", "import sys; sys.exit(76)", ended="import time; time.sleep(30); ")
    assert time.time() - began < 20, f"quitting returns at once while the cleanup runs on by itself: {done.stdout}{done.stderr}"
    assert (session / "ended.log").is_file() and not (tmp_path / "ended").exists(), "the cleanup runs on its own and writes its log in the session's runtime folder"


def test_feature_rows_are_seated_again_only_when_the_features_or_environments_change(monkeypatch):
    import features
    from controllers.types import Features
    from engine.record import Record
    record = fresh("main")
    features.load(record.root)
    assert Features(record, actor=SYSTEM).rows.summaries(), "a new journal's environment gets its feature rows"
    seated = []
    monkeypatch.setattr(features, "seat", lambda root, homes: seated.append(homes))
    features.SEATED.clear()
    features.load(record.root)
    assert seated == [], "a process that starts on a journal whose features and environments are as seated seats nothing"
    Record(record.root, "other").home.mkdir(parents=True)
    features.SEATED.clear()
    features.load(record.root)
    assert seated == [("other",)], "a new environment alone is seated"


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
    serve.warmed(fresh().root, threading.Event())
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
    seat.branched_at = 0.0
    assert seat.branch() == "feature" and len(marks) == 1, "a HEAD that has not moved is not read again"
    transcript = tmp_path / "transcript.jsonl"
    transcript.write_text("{}\n")
    last.transcript, last.provider = str(transcript), "unknown"
    seat.crew()
    seat.crewed_at = 0.0
    seat.crew()
    assert len(marks) == 1, "a transcript no provider reads, or one that has not grown, puts nothing on the agent"


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
    from install import ASKS
    seen: list = []
    root = tmp_path / ".journal"
    (root / "runtime").mkdir(parents=True)
    env = {**os.environ, "PATH": f"{old_curl(tmp_path)}:{os.environ['PATH']}", "AGENT_JOURNAL_ACTIVE": "1", "JOURNAL_ENV": "main", "JOURNAL_ACTOR": "agent"}
    with answering(seen) as url:
        (root / "runtime" / "heartbeat").write_text(f"{int(time.time())} {url}\n")
        hook = subprocess.run(["sh", str(CODE / "hook.sh"), "claude", str(root)], input='{"hook_event_name": "Stop"}', env=env, capture_output=True, text=True, timeout=60)
        shim = subprocess.run(["sh", "-c", f"root={root}\n{ASKS}", "sh", "todo"], env=env, capture_output=True, text=True, timeout=60)
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
    root = installed(tmp_path, CODE)
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
        script = (CODE / "hook.sh").read_text()
        assert ("mktemp" in script, "rm -f" in script, "--data-binary @-" in script) == (False, False, True), \
            "a hook keeps the event in a variable and pipes it to curl, starting no process to hold it in a file"
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


def test_a_server_our_own_deadline_stopped_is_never_counted_as_a_crash(tmp_path, monkeypatch, free_port):
    from runner.worker import crashing
    root = tmp_path / ".journal"
    (root / "runtime").mkdir(parents=True)
    monkeypatch.setattr(viewer, "COMING_UP", 1.0)
    monkeypatch.setattr(viewer, "PORTS", [free_port()])
    monkeypatch.setattr(viewer, "entry", lambda name: [sys.executable, "-c", "import time; time.sleep(600)"])
    exits = []
    for _ in range(3):
        url, code = viewer.launch(root, tmp_path)
        exits.append(code)
        assert url == "", "a server that never answers fails the launch"
    assert not crashing(exits), "a slow start on a loaded machine never rolls a good build back; only a server that exits on its own counts"
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
    serve.warmed(root, threading.Event())
    assert exits == [], f"warming a machine with only {present} must not end the server and make the supervisor roll back"


def test_a_plugin_service_runs_from_the_packed_build_and_stops_when_the_last_session_ends(tmp_path, free_port):
    root = installed(tmp_path, CODE)
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


def test_stopping_the_journal_stops_the_agent_of_every_helper_and_leaves_its_environment_free(tmp_path):
    root = installed(tmp_path, CODE)
    bin_ = tmp_path / "bin"
    bin_.mkdir()
    stand_in = bin_ / "claude"
    stand_in.write_text(f'#!/bin/sh\necho $$ > "{bin_}/started-$JOURNAL_ENV"\nwhile [ ! -f "{bin_}/quit-$JOURNAL_ENV" ] && [ ! -f "{bin_}/quit-all" ]; do sleep 0.2; done\n')
    stand_in.chmod(0o755)
    home = {**os.environ, "HOME": str(tmp_path / "home"), "AGENT_JOURNAL_HOME": str(tmp_path / "home"), "PATH": f"{bin_}{os.pathsep}{os.environ['PATH']}"}
    home.pop("JOURNAL_ENV", None)
    journal = [sys.executable, str(root / "journal.py"), "--root", str(root)]

    def running(env: str) -> bool:
        return alive((bin_ / f"started-{env}").read_text().strip())

    def reached(name: str) -> bool:
        deadline = time.time() + WAIT
        while not (bin_ / name).exists() and time.time() < deadline:
            time.sleep(0.2)
        return (bin_ / name).exists()

    subprocess.run([*journal, "--env", "main", "todo", "create", "a long job"], cwd=tmp_path / PROJECT, env=home, capture_output=True, timeout=90)
    main = subprocess.Popen([*journal, "claude"], cwd=tmp_path / PROJECT, env=home, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
    try:
        assert reached("started-main"), "the dispatching session's agent runs"
        dispatched = subprocess.run([*journal, "--env", "main", "helper", "dispatch", "Hedy", "a long job", "--provider", "claude", "--model", "sonnet", "--todos", "1"],
                                    cwd=tmp_path / PROJECT, env=home, capture_output=True, text=True, timeout=90)
        assert reached("started-main-hedy"), f"the helper's agent runs: {dispatched.stdout}{dispatched.stderr}"
        (bin_ / "quit-main").touch()
        main.communicate(timeout=WAIT)
        assert running("main-hedy"), "the helper's agent keeps working after the session that dispatched it ends"
        subprocess.run([*journal, "stop"], cwd=tmp_path / PROJECT, env=home, capture_output=True, timeout=90)
        deadline = time.time() + WAIT
        while running("main-hedy") and time.time() < deadline:
            time.sleep(0.2)
        assert (running("main-hedy"), Sessions(root).holder("main-hedy"), Todos(Record(root, "main"), actor=SYSTEM).load(1).assigned) == (False, "", ""), \
            "stopping the journal stops the helper through its own stop: no agent runs, its environment is free and the to-do it held is given back"
    finally:
        (bin_ / "quit-all").touch()
        main.kill()
        main.communicate(timeout=WAIT)
        ended(tmp_path)


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
                             preexec_fn=lambda: (signal.signal(signal.SIGINT, signal.SIG_DFL), fcntl.ioctl(0, termios.TIOCSCTTY, 0)))
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


def test_the_engines_keep_ticking_through_a_fault_and_a_child_that_will_not_stop_is_killed(tmp_path, monkeypatch):
    from runner import engines
    root = tmp_path / ".journal"
    runtime.folder(root).mkdir(parents=True)
    stopping, faults, ticks = threading.Event(), [], []

    def tick():
        ticks.append(1)
        if len(ticks) == 1:
            raise RuntimeError("one bad tick")
        stopping.set()
    monkeypatch.setattr(engines, "TICK", 0)
    engines.keep_ticking(stopping, tick, lambda: faults.append(1))
    assert (len(ticks), faults) == (2, [1]), "a tick that throws is reported and the next tick still runs"

    seated = engines.Engines(root, "e")
    assert seated.seated("claude-9") is None, "a session whose provider has no driver gets no engine"
    started = []

    class Fake:
        def __init__(self, record, driver):
            self.driver = driver

        def start(self):
            started.append(self)

        def step(self):
            started.append("step")
    from engine.sessions import Sessions
    Sessions(root).bind("claude-9", "e", provider="claude")
    monkeypatch.setattr(engines, "Engine", Fake)
    monkeypatch.setattr(seated, "mine", lambda: ["claude-9", "claude-8"])
    monkeypatch.setitem(DRIVERS, "claude", lambda record, session: session)
    seated.tick()
    seated.tick()
    assert list(seated.held) == ["claude-9"] and started.count("step") == 2 and len([s for s in started if s != "step"]) == 1, \
        "a live session gets one engine, seated once and stepped on every tick, and one with no driver is left alone"
    ran = []
    monkeypatch.setattr(engines.Engines, "run", lambda self, event: ran.append((self.root, self.env)))
    engines.child(str(root), "e")
    assert ran == [(root, "e")], "the engine child runs the environment it was started for"

    monkeypatch.setattr(engines, "leftovers", lambda folder: [2 ** 22 + 12345])
    gone = engines.Children(root)
    assert gone.running == {}, "a leftover engine that is already gone is not an error"
    stubborn = subprocess.Popen([sys.executable, "-c", "import signal, time; signal.signal(signal.SIGTERM, signal.SIG_IGN); print('ready', flush=True); time.sleep(60)"], stdout=subprocess.PIPE, text=True)
    stubborn.stdout.readline()
    monkeypatch.setattr(engines, "ENDING", 0.2)
    gone.running["e"] = stubborn
    gone.end("e")
    assert stubborn.wait(10) == -9, "an engine that ignores the request to stop is killed"
    stubborn.stdout.close()
    Sessions(root).bind("claude-7", "", provider="claude")
    assert gone.healed(Sessions(root), "claude-7") is None, "a session with no seat on record gets no environment back"
    monkeypatch.setattr(engines, "claim", lambda path: None)
    stopping = threading.Event()
    monkeypatch.setattr(stopping, "wait", lambda seconds: stopping.set())
    engines.supervise(root, stopping)
    assert stopping.is_set(), "a supervisor that cannot hold the lock waits and tries again until it is told to stop"


def test_a_supervisor_in_a_real_terminal_relays_what_is_typed_and_gives_the_terminal_back_when_it_is_stopped(tmp_path):
    import pty
    import select
    import socket
    import termios
    from supervisor import Supervisor
    root = tmp_path / ".journal"
    agent = "import sys\nfor line in sys.stdin:\n    print('got', line.strip(), flush=True)"
    spec = {"root": str(root), "cwd": str(tmp_path), "env": "main", "agent": "claude", "worker": [sys.executable, "-c", "import time; time.sleep(60)"], "args": [],
            "heal": [sys.executable, "-c", "print('healed')"], "ended": [sys.executable, "-c", "pass"],
            "command": [sys.executable, "-c", agent], "environ": dict(os.environ), "launch": 0, "headless": False}
    master, slave = pty.openpty()
    before = termios.tcgetattr(slave)
    supervisor = subprocess.Popen([sys.executable, str(CODE / "supervisor.py"), json.dumps(spec)], cwd=tmp_path, stdin=slave, stdout=slave, stderr=slave, start_new_session=True)
    seen = b""

    def read_until(word: bytes) -> bool:
        nonlocal seen
        deadline = time.time() + WAIT
        while word not in seen and time.time() < deadline:
            if select.select([master], [], [], 0.2)[0]:
                seen += os.read(master, 4096)
        return word in seen
    try:
        session = None
        deadline = time.time() + WAIT
        while session is None and time.time() < deadline:
            session = next((root / "runtime" / "sessions").glob("claude-*"), None) if (root / "runtime" / "sessions").is_dir() else None
            time.sleep(0.05)
        os.write(master, b"typed at the keyboard\r")
        assert read_until(b"got typed at the keyboard"), "what the user types in the terminal reaches the agent and its answer comes back"
        seat = object.__new__(Supervisor)
        seat.root, seat.session = root, session.name
        inbox = socket.socket(socket.AF_UNIX, socket.SOCK_DGRAM)
        deadline = time.time() + WAIT
        while not seat.socket_path().exists() and time.time() < deadline:
            time.sleep(0.05)
        inbox.sendto(b"typed by the journal\r", str(seat.socket_path()))
        assert read_until(b"got typed by the journal"), "what the journal types into the inbox reaches the agent too"
        inbox.close()
        supervisor.send_signal(signal.SIGTERM)
        assert supervisor.wait(WAIT) == 143, "a terminated supervisor ends with the terminated status"
        after = termios.tcgetattr(slave)
        assert (after[3] & (termios.ECHO | termios.ICANON), after[:3]) == (before[3] & (termios.ECHO | termios.ICANON), before[:3]), "the terminal's own settings are given back when the supervisor ends"
        assert not seat.socket_path().exists(), "the inbox is removed when the supervisor ends"
    finally:
        supervisor.kill()
        os.close(master)
        os.close(slave)
    pid = json.loads((session / "launched.json").read_text())["pid"]
    assert subprocess.run(["kill", "-0", str(pid)], capture_output=True).returncode != 0, "no agent is left running"


def test_the_engine_starts_from_a_paused_agent_survives_a_failed_tick_and_relays_what_peers_and_typed_commands_leave(tmp_path, monkeypatch):
    from types import SimpleNamespace
    from controllers.types import Messages
    from engine import stored
    from runner import engine as engine_module
    from runner.engine import Engine, PEER
    from tests.kit import report
    record = fresh()
    report(record, "working", "PreToolUse")
    engine = Engine(record, DRIVERS["claude"](record, "claude-1"))
    driver = engine.agent.driver
    monkeypatch.setattr(engine_module.features, "load", lambda root: None)
    monkeypatch.setattr(driver, "last_report", lambda: SimpleNamespace(paused=5.0))
    engine.start()
    assert engine.paused, "an engine started for an agent that was paused keeps it paused"
    monkeypatch.undo()

    faults, steady = [], []
    monkeypatch.setattr(engine_module, "threw", lambda *args: faults.append(args[2]))
    monkeypatch.setattr(engine_module, "steady", lambda record: steady.append(1))
    monkeypatch.setattr(Engine, "tick", lambda self: (_ for _ in ()).throw(RuntimeError("a bad tick")))
    engine.clean = 3
    engine.step()
    assert (faults, engine.clean) == (["the engine"], 0), "a tick that throws is reported and the run of clean ticks starts over"
    monkeypatch.setattr(Engine, "tick", lambda self: "")
    engine.clean = engine_module.STEADY_AFTER - 1
    engine.step()
    assert steady == [1], "an engine that ticks cleanly for long enough tells the faults it is steady"
    monkeypatch.undo()

    monkeypatch.setattr(engine_module.features, "passed", lambda e, record: None)
    emitted = []
    monkeypatch.setattr(engine_module.bus, "emit", lambda e, record: emitted.append(e.id))
    engine.relayed = record.event_log.last_id()
    Todos(record, actor=SYSTEM).create("something for the bus")
    engine.relay()
    assert emitted and engine.relayed == record.event_log.last_id(), "an event no one handled is put on the bus once"
    monkeypatch.undo()

    transcript = tmp_path / "peers.jsonl"
    transcript.write_text("{}\n")
    row = SimpleNamespace(title="claude-1", provider="claude", transcript=str(transcript), n=1)
    turn = lambda at, direction, text: SimpleNamespace(at=at, text=text, peer=SimpleNamespace(direction=direction, address=f"address-{text}", name=f"peer-{text}"))
    turns = [turn(1.0, PEER, "hello")]
    provider = SimpleNamespace(last_turns=lambda path: turns, echoes_typed=False)
    monkeypatch.setattr(engine, "reading", lambda: engine_module.Reading(row, provider, transcript))
    engine.relay_peers()
    assert Messages(record, actor=SYSTEM).all() == [], "the first look at a transcript only marks where it stands"
    transcript.write_text("{}\n{}\n")
    engine.relay_peers()
    assert [m.n for m in Messages(record, actor=SYSTEM).all()] == [], "a turn from before the mark is not relayed again"
    turns += [turn(2.0, PEER, "from"), turn(3.0, "to", "back")]
    transcript.write_text("{}\n{}\n{}\n")
    engine.relay_peers()
    assert sorted(m.data.get("peer") or m.data.get("sent_to") for m in Messages(record, actor=SYSTEM).all()) == ["address-back", "peer-from"], \
        "what a peer sent arrives under its name and what the agent sent it leaves under its address"
    monkeypatch.undo()


def test_the_engine_reads_what_it_should_hold_back_what_it_cannot_decide_and_says_what_is_owed(tmp_path, monkeypatch):
    from types import SimpleNamespace
    from controllers.types import Agents, Nudges
    from engine.inputs import FORCE, queue
    from providers.base import TypedRun
    from resources.base import AGENT, USER, Event
    from runner import engine as engine_module
    from runner.engine import Engine
    from tests.kit import report
    record = fresh()
    report(record, "working", "PreToolUse")
    engine = Engine(record, DRIVERS["claude"](record, "claude-1"))
    driver = engine.agent.driver
    row = Agents(record, actor=SYSTEM).by_session("claude-1")

    note = Nudges(record).create("a nudge before the engine ran")
    event = next(e for e in record.event_log.events() if e.type == "nudge" and e.n == note.n)
    engine.passed_over(engine.agent, event)
    assert engine.agent.delivered_until() >= event.id and AGENT in Nudges(record).load(note.n).seen, "a nudge from before the engine started is read for the agent, not typed to it"

    monkeypatch.setattr(driver, "ASKS_ON_SCREEN", True, raising=False)
    monkeypatch.setattr(driver, "asked", lambda: None)
    before = Agents(record, actor=SYSTEM).load(row.n).data.get("asking")
    engine.screen_asks()
    assert Agents(record, actor=SYSTEM).load(row.n).data.get("asking") == before, "a screen that asks what the row already says changes nothing"
    monkeypatch.undo()

    echoed = []
    runs = [TypedRun(at=0.5, command="old"), TypedRun(at=1.0, command="ls"), TypedRun(at=2.0, command="pwd", output="/here"), TypedRun(at=time.time(), command="still running")]
    provider = SimpleNamespace(typed_runs=lambda path: runs, echoes_typed=True)
    engine.echoed_at = 0.75
    monkeypatch.setattr(engine, "reading", lambda: engine_module.Reading(row, provider, tmp_path))
    monkeypatch.setattr(engine_module.ran, "announce", lambda record, n, tool, command, *output, at=0.0: echoed.append((command, output)))
    engine.echoed()
    assert echoed == [("ls", ()), ("pwd", ("/here",))] and engine.echoed_at == 2.0, \
        "the commands typed in the terminal are shown once with their output, and one still running waits for it"
    monkeypatch.undo()

    monkeypatch.setattr(driver, "last_report", lambda: SimpleNamespace(paused=0, asking={"call": "x"}, title="claude-1", n=row.n, queued_commands=[], at=time.time()))
    monkeypatch.setattr(engine.agent, "state", lambda: "working")
    engine.paused, engine.held_at = True, time.time()
    assert engine.pausing() == "paused", "a paused agent that only just stopped is left to settle"
    engine.controlled_at = 0.0
    assert engine.control() == "", "a working agent that is asking the user is not given keys"

    queue(record.root, "claude-1", (), "stop", action=FORCE)
    stopped, napped = [], []
    monkeypatch.setattr(driver, "stop_turn", lambda: stopped.append(1))
    monkeypatch.setattr(driver, "at_prompt", lambda: False)
    monkeypatch.setattr(engine_module.time, "sleep", lambda seconds: napped.append(seconds))
    monkeypatch.setattr(engine_module, "SETTLE", 0.3)
    assert engine.forced().startswith("forced") and stopped and len(napped) == 2, "a stopped turn is waited on for a moment before the agent is told to carry on"
    monkeypatch.undo()

    ghost = Event(id=record.event_log.last_id() + 1, at=time.time(), type="ghost", n=1, action="created", actor=USER)
    record.event_log.append(ghost)
    monkeypatch.setattr(driver, "last_report", lambda: SimpleNamespace(title="claude-1", n=row.n, at=time.time(), asking={}))
    engine.deliver()
    assert engine.agent.delivered_until() >= record.event_log.last_id(), "an event of a type this build does not know is passed over, never typed"

    monkeypatch.setattr(engine.agent, "flush", lambda: "typed line")
    monkeypatch.setattr(driver, "sent_now", time.time() + 100, raising=False)
    cards = []
    monkeypatch.setattr(engine, "moved_on", lambda: cards.append(1))
    monkeypatch.setattr(engine, "noted", lambda line, tool="": None)
    assert engine.deliver().startswith("typed") and cards == [1], "a message that went in while a command runs is marked as having moved on"
    monkeypatch.undo()

    monkeypatch.setattr(engine.agent, "state", lambda: "idle")
    monkeypatch.setattr(engine, "owed", lambda: "")
    monkeypatch.setattr(driver, "last_report", lambda: None)
    engine.typed_at = 0.0
    assert engine.nudge() == "nothing owed", "an idle agent with nothing owed is left alone"


def test_the_chat_mirror_replays_what_was_left_unsent_and_sends_each_unfinished_turn_once(tmp_path, monkeypatch):
    from types import SimpleNamespace
    from engine.stored import write_json
    from engine.sessions import Sessions
    from runner import chat_mirror, spool
    from tests.kit import report
    record = fresh()
    report(record, "working", "PreToolUse")
    root = record.root
    folder = chat_mirror.unsent(root)
    folder.mkdir(parents=True)
    (folder / "1.json").write_text(json.dumps({"session_id": "claude-1", "hook_event_name": "MessageDisplay", "message_id": "a", "index": 0, "final": True, "delta": "replayed words"}))
    (folder / "2.json").write_text("not json")
    seen = []
    monkeypatch.setattr(chat_mirror, "shown", lambda root, chunk: seen.append(chunk.delta))
    spool.replay(root)
    assert seen == ["replayed words"] and not list(folder.glob("*.json")), "what was displayed while the journal was down is shown once it is up, and a file that is not readable is dropped"
    monkeypatch.undo()

    now = time.time()
    turn = lambda key, text, at: SimpleNamespace(key=key, text=text, at=at, has_agent_text=True)
    turns = []

    class Provider:
        def turns(self, path):
            return turns
    monkeypatch.setattr(chat_mirror, "PROVIDERS", {"fake": Provider})
    row = SimpleNamespace(provider="fake", transcript=str(tmp_path / "transcript.jsonl"))
    sent = []
    monkeypatch.setattr(chat_mirror, "send_to_chat", lambda root, session, text, key: sent.append(text))
    ledger = chat_mirror.DisplayedLedger(root, "claude-1")
    write_json(ledger.file, {chat_mirror.SENT: [chat_mirror.fingerprint("shown in pieces"), "transcript-key"], chat_mirror.MATCHED: [chat_mirror.fingerprint("streamed")]})
    turns += [turn("transcript-key", "kept", now), turn("k1", "shown in pieces", now), turn("k2", "streamed", now), turn("k3", "never shown", now)]
    chat_mirror.unfinished(root, "claude-1", row)
    held = json.loads(ledger.file.read_text())
    assert (sent, "k1" in held[chat_mirror.SENT], "k2" in held[chat_mirror.SENT]) == (["never shown"], True, True), \
        "a turn that was shown in pieces or streamed is not sent again, and one that never was is sent"

    sent.clear()
    write_json(ledger.file, {chat_mirror.SENT: ["transcript:5"]})
    written = ledger.file.stat().st_mtime
    turns[:] = [turn("transcript:1", "before the ledger", written - 10), turn("transcript:7", "after the ledger", written + 10)]
    chat_mirror.unfinished(root, "claude-1", row)
    assert sent == ["after the ledger"], "a ledger of transcript lines sends only the turns written after it"
    monkeypatch.undo()

    Sessions(root).bind("claude-1", record.env, provider="claude")
    assert chat_mirror.send_to_chat(root, "claude-1", "   ") is False, "a blank message is not sent"
    assert chat_mirror.send_to_chat(root, "nobody-1", "who is this") is False, "a message for a session with no agent row is not sent"
    assert chat_mirror.send_to_chat(root, "claude-1", "once only") and chat_mirror.send_to_chat(root, "claude-1", "once only"), "a message already sent counts as sent and is not sent twice"


def test_a_server_that_stops_answering_is_stopped_with_its_threads_kept(tmp_path, monkeypatch):
    from engine import viewer
    root = tmp_path / ".journal"
    (root / "runtime").mkdir(parents=True)
    (root / "runtime" / viewer.STUCK_THREADS).write_text("Thread 0x1: waiting on the record lock")
    stuck = subprocess.Popen(["sleep", "60"])
    monkeypatch.setattr(viewer, "running", lambda found: "http://127.0.0.1:1/")
    monkeypatch.setattr(viewer, "healthy", lambda url, env, timeout=0: False)
    monkeypatch.setattr(viewer, "last", lambda found: viewer.ViewerMark.from_json({"pid": stuck.pid}))
    watch = viewer.StuckServer(root, "main")
    other = viewer.StuckServer(root, "other")
    assert (watch.judging(), other.judging(), [other.restarted() for _ in range(viewer.MISSES_BEFORE_RESTART)]) == (True, False, [""] * viewer.MISSES_BEFORE_RESTART), \
        "one worker of the journal judges the server: the first holds the probing lock and the others never count a miss"
    quiet = [watch.restarted() for _ in range(viewer.MISSES_BEFORE_RESTART - 1)]
    assert quiet == [""] * (viewer.MISSES_BEFORE_RESTART - 1) and stuck.poll() is None, "a server that misses a few probes is not yet stuck"
    kept = watch.restarted()
    assert stuck.wait(timeout=10) is not None, "the last missed probe stops the server, so the worker starts a fresh one"
    assert "waiting on the record lock" in Path(kept).read_text(), "what each thread was doing is kept beside the runtime"


def test_the_live_sockets_are_found_once_for_the_journal_and_every_environment_reads_the_list(tmp_path, monkeypatch):
    from engine import typist
    from runner import engines
    root = tmp_path / ".journal"
    root.mkdir()
    asked = []
    monkeypatch.setattr(typist, "live", lambda found: asked.append(1) or ["claude-1", "claude-2"])
    assert (typist.publish_live(root), len(asked)) == (["claude-1", "claude-2"], 1), "the supervising process finds them and writes the list"
    assert (typist.listed(root), typist.listed(root), len(asked)) == (["claude-1", "claude-2"], ["claude-1", "claude-2"], 1), "every environment's process reads the list and connects to no socket"
    written = json.loads((typist.folder(root) / typist.LIVE_FILE).read_text())
    (typist.folder(root) / typist.LIVE_FILE).write_text(json.dumps({**written, "at": time.time() - typist.LISTED_FRESH - 1}))
    assert (typist.listed(root), len(asked)) == (["claude-1", "claude-2"], 2), "when the supervising process has not written lately they are found here after all"
    children = engines.Children(root)
    children.wanted()
    children.wanted()
    assert len(asked) == 3, "and the supervising process looks only every few seconds, not at every tick"


def test_one_watcher_writes_the_installed_build_and_every_other_process_reads_it(tmp_path, monkeypatch):
    from engine import package
    root = tmp_path / ".journal"
    (root / "runtime").mkdir(parents=True)
    walked = []
    monkeypatch.setattr(package, "installed_stamp", lambda found: walked.append(1) or (("src/a.py", len(walked)),))
    published = package.publish_stamp(root)
    assert (package.noticed_digest(root), len(walked)) == (published, 1), "what the watcher wrote is read from one small file, without walking the source tree again"
    marker = root / "runtime" / package.STAMP_FILE
    marker.write_text(json.dumps({"digest": published, "at": time.time() - package.STAMP_FRESH - 1}))
    assert (package.noticed_digest(root) != published, len(walked)) == (True, 2), "when the watcher has not written for a while, as when no server runs, the tree is walked after all"


def test_the_server_starts_on_the_free_threaded_interpreter_when_one_is_named(tmp_path, monkeypatch):
    from engine import package
    plain = package.server_entry("journal")
    assert plain[0] == sys.executable and plain[1:] == package.entry("journal")[1:], "with nothing named the server starts on the interpreter that asks"
    free = tmp_path / "python3.14t"
    free.write_text("")
    monkeypatch.setenv(package.SERVER_PYTHON, str(free))
    assert package.server_entry("journal")[0] == str(free), "a free-threaded interpreter named in JOURNAL_SERVER_PYTHON runs the server, so environments are answered on different cores"
    monkeypatch.setenv(package.SERVER_PYTHON, str(tmp_path / "gone"))
    assert package.server_entry("journal")[0] == sys.executable, "one that is not there is ignored"


def test_the_server_ends_when_interrupted_or_told_to_stop_restarts_on_new_code_and_answers_hook_failures(tmp_path, monkeypatch):
    import serve
    root = fresh().root
    printed, stopped, changed, executed = [], [], [], []

    def waited(found: list) -> None:
        deadline = time.time() + WAIT
        while not found and time.time() < deadline:
            time.sleep(0.01)

    class Quiet:
        server_address = ("127.0.0.1", 4242)
        server_port = 4242
        warm = threading.Event()

        def __init__(self, forever):
            self.forever = forever
            self.collector = types.SimpleNamespace(run=lambda halting: None)

        def serve_forever(self):
            self.forever()

        def server_close(self):
            printed.append("closed")

    def finish_with(found: list, after):
        def forever():
            waited(found)
            after(found[0])
        return Quiet(forever)
    for name in ("warmed", "replay", "warm", "warm_commands", "watch_runtime", "keep_services"):
        monkeypatch.setattr(serve, name, lambda *args: None)
    monkeypatch.setattr(serve, "watch_code", lambda root, package, server, event: changed.append(event))
    monkeypatch.setattr(serve, "watch_stop", lambda root, server, halting, began: stopped.append(halting))
    monkeypatch.setattr(serve.os, "execv", lambda program, command: executed.append(command))

    monkeypatch.setattr(serve, "serve", lambda root, port: Quiet(lambda: (_ for _ in ()).throw(KeyboardInterrupt())))
    serve.run(root, 0)
    assert printed == ["closed"] and not executed, "an interrupted server closes its socket and ends without restarting"

    stopped.clear()
    monkeypatch.setattr(serve, "serve", lambda root, port: finish_with(stopped, lambda halting: halting.set()))
    serve.run(root, 0)
    assert printed == ["closed", "closed"] and not executed, "a server that was asked to stop ends without restarting"

    changed.clear()
    monkeypatch.setattr(serve, "serve", lambda root, port: finish_with(changed, lambda event: event.set()))
    serve.run(root, 0)
    assert executed and executed[0][-2:] == ["--port", "4242"], "a server whose code changed starts again on the same port"
    monkeypatch.undo()

    answered, halting = [], threading.Event()
    monkeypatch.setattr(serve, "WATCH_SECONDS", 0.01)
    monkeypatch.setattr(serve.runtime, "refresh_flags", lambda root: None)
    monkeypatch.setattr(serve, "unanswered", lambda root: (answered.append(1), halting.set()))
    serve.runtime.hook_failures(root).parent.mkdir(parents=True, exist_ok=True)
    serve.runtime.hook_failures(root).write_text("1")
    serve.watch_runtime(root, halting)
    assert answered == [1], "hooks that failed while the server was down are answered once it watches again"
    program = subprocess.Popen([sys.executable, str(CODE / "serve.py"), str(tmp_path / ".journal"), "0"], stdout=subprocess.PIPE, text=True, cwd=tmp_path, stdin=subprocess.DEVNULL)
    try:
        address = program.stdout.readline()
        assert address.startswith("http://127.0.0.1:"), "the server run as a program names the address it serves"
        deadline = time.time() + WAIT
        while time.time() < deadline:
            try:
                connection = http.client.HTTPConnection("127.0.0.1", int(address.strip().rsplit(":", 1)[1].strip("/")), timeout=5)
                connection.request("GET", "/api/manifest")
                if connection.getresponse().status == 200:
                    break
            except OSError:
                time.sleep(0.1)
        program.send_signal(signal.SIGINT)
        assert program.wait(WAIT) == 0, "and ends cleanly when interrupted"
    finally:
        program.kill()
        program.stdout.close()


def test_a_damaged_ledger_is_refused_a_rolled_back_record_gets_its_files_back_and_a_subagent_that_asks_is_recorded(tmp_path, monkeypatch):
    from controllers.types import Agents
    from resources.base import Refused
    from runner.gate import ShellLine
    from runner.hooks import handle
    from tests.kit import report
    root = tmp_path / ".journal"
    root.mkdir()
    migrations.ledger(root).write_text("[1, 2]")
    with pytest.raises(Refused, match="damaged migrations ledger"):
        migrations.applied(root)
    migrations.ledger(root).write_text(json.dumps({name: {"result": ""} for name in migrations.names()}))
    assert migrations.run_locked(root) == ([], None), "a record that another process finished migrating while this one waited has nothing left to run"
    backup = tmp_path / "backup"
    backup.mkdir()
    (backup / "record.json").write_text('{"kept": true}')
    (root / "record.json").write_text('{"kept": false}')
    migrations.restored(root, backup)
    assert json.loads((root / "record.json").read_text()) == {"kept": True}, "a rolled back record gets its single files back as they were"

    assert ShellLine.of(("echo 'never closed",)).others == 1, "a shell line with a quote that never closes is still read as one command"

    record = fresh()
    report(record, "working", "PreToolUse", session="claude-1")
    row = Agents(record, actor=SYSTEM).by_session("claude-1")
    Agents(record, actor=SYSTEM).update(row.n, asking={"call": "earlier"})
    handle(PROVIDERS["claude"](), record.root, record.env, {"hook_event_name": "PostToolUse", "session_id": "claude-1", "agent_id": "sub-1", "tool_name": "Read", "tool_input": {}})
    assert not Agents(record, actor=SYSTEM).by_session("claude-1").asking, "a subagent that reports while the row says it is asking clears what it was asking"

    from engine import stop
    sleeper = subprocess.Popen(["sleep", "30"])
    try:
        monkeypatch.setattr(stop, "serving", lambda folder: sleeper.pid)
        monkeypatch.setattr(stop, "EVERY", 0.01)
        assert stop.gone(root, 0.1) is False, "a server that is still alive after the wait is not gone"
    finally:
        sleeper.kill()
        sleeper.wait(10)


def test_the_engines_small_helpers_give_an_empty_answer_when_a_program_a_folder_or_a_file_is_missing(tmp_path, monkeypatch):
    import fcntl
    from dataclasses import asdict
    from types import SimpleNamespace
    from engine import bus, keeper, package
    from engine.disk import Growth, last_lines
    from engine.inputs import take
    from engine.proc import git_objects, streamed
    from engine.reach import Guard, Reach, Unreached
    assert streamed(["no-such-program-anywhere"], tmp_path, 5, lambda text: None)[0] is None, "a program that cannot start has no exit status"
    assert (git_objects(tmp_path, []), git_objects(tmp_path / "missing", ["a" * 40]), git_objects(tmp_path, ["a" * 40])) == ({}, {}, {}), \
        "objects asked of nothing, of a folder that is not there or of a folder that is no repository are none"

    assert Guard.of(SimpleNamespace(reach=Reach.MAIN)).reach is Reach.MAIN
    for given in (object(), SimpleNamespace(reach="main")):
        with pytest.raises(Unreached, match="states no reach"):
            Guard.of(given)

    place = tmp_path / "code"
    (place / ".hidden").mkdir(parents=True)
    (place / ".hidden" / "skipped.py").write_text("")
    (place / "kept.py").write_text("")
    (place / "broken.py").symlink_to(place / "nothing.py")
    assert [Path(name).name for name, _ in package.code_stamp(place)] == ["kept.py"], "a hidden folder and a file that cannot be read are not part of the code's stamp"
    monkeypatch.setattr(package, "ZIPPED", True)
    assert package.entry("keeper")[-2:] == ["-m", "keeper"], "a packed journal starts a module through its archive"
    monkeypatch.undo()

    assert Growth().grew(tmp_path / "missing") is False, "a file that is not there has not grown"
    long = tmp_path / "long.log"
    long.write_bytes(b"".join(f"line {n}\n".encode() for n in range(60000)))
    tail = last_lines(long, 3)
    assert tail.splitlines() == ["line 59997", "line 59998", "line 59999"], "the end of a long log starts on a whole line"

    from engine import runtime
    runtime.inputs(tmp_path).mkdir(parents=True)
    (runtime.inputs(tmp_path) / "1.json").write_text("{not json")
    assert take(tmp_path, {"claude-1"}) is None and not list(runtime.inputs(tmp_path).glob("*.json")), "an input that cannot be read is dropped"

    lock = tmp_path / "service.lock"
    spec = keeper.ServiceSpec(id="a.web", plugin="a", service="web", run=["true"], lock=str(lock), log=str(tmp_path / "log"), status=str(tmp_path / "status"), spec=str(tmp_path / "spec"))
    with lock.open("a") as holding:
        fcntl.flock(holding, fcntl.LOCK_EX)
        monkeypatch.setattr(keeper, "LEASE_WAIT", 0.2)
        assert keeper.lease(spec) is None, "a service whose lock another keeper holds is not leased"
        (tmp_path / "spec").write_text(json.dumps(asdict(spec)))
        assert keeper.main(["-1", str(tmp_path / "spec")]) == keeper.TAKEN, "a second keeper for the same service steps aside"
    with pytest.raises(SystemExit, match="no service spec"):
        keeper.main(["-1", str(tmp_path / "nothing")])
    monkeypatch.undo()

    seen = []
    inner = bus.commanded("todo", "inner", lambda: seen.append(bus.command("todo")))
    bus.commanded("todo", "outer", lambda: inner())()
    assert seen == ["outer"], "a command run inside another is still the outer command"
    ran = []
    with bus.settled():
        bus.defer_once("same", lambda: ran.append("first"))
        bus.defer_once("same", lambda: ran.append("second"))
        assert ran == [], "work deferred while events are held waits"
    assert ran == ["first"], "work deferred twice under one key runs once"



def test_the_first_hooks_after_an_upgrade_answer_within_budget_on_a_long_transcript(tmp_path, monkeypatch):
    import features
    from commands.dispatch import dispatch
    from engine import whole_reads
    from features.dev_faults.reports import BUDGET
    from features.skill_loading.required import require
    from providers import jsonl, transcript_cache
    features.load()
    record = fresh()
    cache = transcript_cache.CACHE
    monkeypatch.setattr(cache, "folder", tmp_path / "folds")
    transcript = tmp_path / "claude-1.jsonl"
    said = lambda n: {"type": "user", "timestamp": "2026-10-08T10:00:00Z", "message": {"content": f"question {n} " + "x" * 1000}}
    answered = lambda n: {"type": "assistant", "timestamp": "2026-10-08T10:00:01Z", "message": {"content": [{"type": "text", "text": f"answer {n} " + "y" * 1000}]}}
    with transcript.open("w") as written:
        for n in range(15000):
            written.write(json.dumps(said(n)) + "\n" + json.dumps(answered(n)) + "\n")
    query = {"root": str(record.root), "env": record.env, "pid": "0"}
    hook = lambda event: {"hook_event_name": event, "session_id": "claude-1", "transcript_path": str(transcript), "tool_name": "Read",
                          "tool_input": {"file_path": "x.py"}, "cwd": str(record.root.parent)}
    for event in ("SessionStart", "UserPromptSubmit", "PreToolUse", "PostToolUse"):
        dispatch("POST", "/api/hook/claude", record.root, query, hook(event)).after()
    require(record, transcript.stem, {"journal": time.time()})
    monkeypatch.setattr(transcript_cache, "shape_mark", lambda: "the next release")
    for held in (cache.transcripts, cache.folds, cache.recents):
        held.clear()
    answering, spans, read = threading.current_thread(), [], jsonl.read_bytes

    def measured(path, start, stop=None) -> bytes:
        found = read(path, start, stop)
        if threading.current_thread() is answering:
            spans.append(len(found))
        return found
    monkeypatch.setattr(jsonl, "read_bytes", measured)
    before, working = whole_reads.count(), []
    for event in ("UserPromptSubmit", "PreToolUse", "PostToolUse", "PreToolUse"):
        began = time.thread_time()
        reply = dispatch("POST", "/api/hook/claude", record.root, query, hook(event))
        working.append((time.thread_time() - began) * 1000)
        reply.after()
    assert transcript.stat().st_size > 20_000_000 and max(working) <= BUDGET["hook"], \
        f"the first hooks after an upgrade answer within their budget on a long transcript; they worked {[round(ms) for ms in working]} ms"
    assert (max(spans, default=0) <= transcript_cache.RECENT_BYTES, whole_reads.count() - before) == (True, 0), \
        "and read only a bounded tail of it while they answer and after, never the whole transcript"


def test_a_chained_command_runs_through_the_rewrite_with_the_same_output_and_exit_status_and_each_part_reports(tmp_path):
    root = installed(tmp_path, CODE)
    project = root.parent
    env = {**os.environ, "HOME": str(tmp_path / "home"), "AGENT_JOURNAL_ACTIVE": "1", "JOURNAL_ENV": ""}
    journal = [sys.executable, str(root / "journal.py"), "--root", str(root)]
    wired = json.loads((project / ".claude" / "settings.local.json").read_text())["hooks"]["PreToolUse"][0]["hooks"][0]["command"]
    for args in (("init", "-q", "-b", "main"), ("-c", "user.name=t", "-c", "user.email=t@t", "commit", "-q", "--allow-empty", "-m", "start")):
        subprocess.run(["git", *args], cwd=project, capture_output=True, timeout=WAIT, check=True)
    server = subprocess.Popen([*journal, "serve", "--port", "0"], cwd=project, env=env, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    try:
        began = time.time()
        while time.time() - began < WAIT and not (root / "runtime" / "heartbeat").is_file():
            time.sleep(0.1)
        cases = ["echo a; echo b && false || echo c", "printf 'x\\ny\\n' | sort -r | head -1; echo done", "cd /tmp && pwd; ls /nonexistent-dir 2>&1 | head -1; echo $?",
                 "echo out; echo err >&2; exit 3", "git tag v1; echo tagged"]
        rewritten = 0
        for at, command in enumerate(cases):
            asked = {"hook_event_name": "PreToolUse", "session_id": "s1", "cwd": str(project), "permission_mode": "bypassPermissions", "tool_use_id": f"toolu_e2e{at}",
                     "tool_name": "Bash", "tool_input": {"command": command}}
            answer = subprocess.run(["sh", "-c", wired], input=json.dumps(asked), text=True, env=env, capture_output=True, timeout=WAIT).stdout
            stepped = json.loads(answer)["hookSpecificOutput"]["updatedInput"]["command"]
            rewritten += "journal_step" in stepped
            run = lambda text: subprocess.run(["sh", "-c", text], cwd=project, capture_output=True, text=True, timeout=WAIT)
            if "git tag" in command:
                subprocess.run(["git", "tag", "-d", "v1"], cwd=project, capture_output=True, timeout=WAIT)
            original = run(command)
            if "git tag" in command:
                subprocess.run(["git", "tag", "-d", "v1"], cwd=project, capture_output=True, timeout=WAIT)
            through = run(stepped)
            assert (through.stdout, through.stderr, through.returncode) == (original.stdout, original.stderr, original.returncode), f"{command!r} gives the same output and exit status through the rewrite"
        assert rewritten == len(cases), "every chained command was rewritten into steps"
        heredoc = {"hook_event_name": "PreToolUse", "session_id": "s1", "cwd": str(project), "permission_mode": "bypassPermissions", "tool_use_id": "toolu_e2eh",
                   "tool_name": "Bash", "tool_input": {"command": "cat <<EOF\nhello\nEOF\necho after"}}
        left = subprocess.run(["sh", "-c", wired], input=json.dumps(heredoc), text=True, env=env, capture_output=True, timeout=WAIT).stdout
        assert "updatedInput" not in left, "a command with a heredoc is left whole"
        from controllers.types import Agents
        from engine import runtime as runtime_folder
        from engine.record import Record
        from resources.base import SYSTEM
        began, marks = time.time(), []
        while "Tagged `v1`" not in marks and time.time() - began < WAIT:
            time.sleep(0.3)
            marks = [card.get("label") for card in Agents(Record(root, runtime_folder.env(root)), actor=SYSTEM).by_session("s1").data.get("cards") or []]
        assert "Tagged `v1`" in marks, "the part that tagged reported to the server and marked the chat once it had run"
    finally:
        server.terminate()
        server.wait(WAIT)


def test_the_server_reads_the_messages_and_comments_a_reply_asks_for_when_it_starts():
    from controllers.stored import SUMMARIES
    from controllers.types import Comments, Messages
    from serve import warm_replies
    from tests.conftest import fresh
    record = fresh()
    message = Messages(record, actor=SYSTEM).create("Is the fix in?")
    Comments(record, actor=SYSTEM).create("Yes", about=message.ref)
    SUMMARIES.clear()
    warm_replies(record.root)
    held = {Path(folder).name for folder in SUMMARIES}
    assert {"message", "comment"} <= held, "a start loads what a reply reads, so the first reply after it answers from memory"


def test_a_worktree_set_that_fails_partway_removes_what_it_made_and_a_retry_clears_a_half_made_one_of_the_same_name(tmp_path):
    import io

    from commands.cli import exit_code
    from engine.worktree import WorkspaceFolders, discarded, owns, present, worktrees, workspace

    def git(repo: Path, *words: str) -> None:
        subprocess.run(["git", "-c", "user.email=t@t", "-c", "user.name=t", *words], cwd=repo, check=True, timeout=30, capture_output=True)

    def made_repo(name: str) -> Path:
        repo = tmp_path / "project" / name
        repo.mkdir(parents=True)
        git(repo, "init", "-q", "-b", "main")
        (repo / "file.txt").write_text("one\n")
        git(repo, "add", "-A")
        git(repo, "commit", "-q", "-m", "first")
        return repo

    first, second, third = (made_repo(name) for name in ("first", "second", "third"))
    project, folders = tmp_path / "project", WorkspaceFolders(worktrees=((".claude", "worktrees"),))
    home = project / ".claude" / "worktrees"
    git(third, "worktree", "add", "-q", "-b", "worktree-ticket-9", str(tmp_path / "elsewhere"))
    with pytest.raises(SystemExit):
        workspace(project, home / "ticket-9", folders)
    assert [worktrees(repo) for repo in (first, second)] == [[], []] and not any(present(repo, "refs/heads/worktree-ticket-9") for repo in (first, second)) and not (home / "ticket-9").exists(), \
        "a start that fails at its third repository takes away the worktrees, branches and folder it made in the first two"
    git(third, "worktree", "remove", "--force", str(tmp_path / "elsewhere"))
    git(third, "branch", "-D", "worktree-ticket-9")

    git(second, "worktree", "add", "-q", "-b", "worktree-ticket-9", str(home / "ticket-9" / "second"))
    git(second, "worktree", "add", "-q", "-b", "worktree-ticket-8", str(home / "ticket-8" / "second"))
    half = home / "ticket-9" / "second"
    for entry in half.iterdir():
        if entry.name != ".git":
            entry.unlink()
    assert (owns(second, half), owns(second, home / "ticket-8" / "second")) == (True, True), \
        "two worktrees of one repository whose folders carry the same name are both its own, whichever was made last, and a half-made checkout is still one"
    discarded(second, half, "worktree-ticket-9", "ticket-9")
    assert (owns(second, half), owns(second, home / "ticket-8" / "second"), half.exists(), present(second, "refs/heads/worktree-ticket-9"), present(second, "refs/heads/worktree-ticket-8")) == (False, True, False, False, True), \
        "a retry removes the half-made worktree and its branch like any other, and leaves another ticket's worktree and branch alone"
    git(second, "worktree", "remove", "--force", str(home / "ticket-8" / "second"))
    git(second, "branch", "-D", "worktree-ticket-8")

    (home / "ticket-9" / "first").mkdir(parents=True)
    (home / "ticket-9" / "first" / "notes.txt").write_text("not a checkout\n")
    workspace(project, home / "ticket-9", folders)
    kept = list((home / "ticket-9").glob(".failed-*/first/notes.txt"))
    assert all(owns(repo, home / "ticket-9" / repo.name) for repo in (first, second, third)) and len(kept) == 1, \
        "a folder that no worktree owns is moved aside into the ticket's folder as .failed-<time>, nothing deleted, and every worktree is made"
    err = io.StringIO()
    assert (exit_code(SystemExit("journal: could not launch"), err), "could not launch" in err.getvalue(), exit_code(SystemExit(3), err), exit_code(SystemExit(), err)) == (1, True, 3, 0), \
        "a command that ends with a message answers 1 and says it; it is never parsed as a number"
