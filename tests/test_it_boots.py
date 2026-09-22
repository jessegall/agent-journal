import os
import subprocess
import sys
import tempfile
from pathlib import Path

from install import STUBS
from providers import DRIVERS
from scripts.boot_guard import WAIT, launches
from scripts.checks.imports import imports, missing

HERE = Path(__file__).resolve().parents[1]


def test_every_import_in_the_package_resolves():
    assert [f"{path.name}:{node.lineno}" for path, node in imports() for alias in node.names if missing(node.module, alias.name)] == []


def test_every_agent_launches_under_the_journal_and_exits_cleanly():
    for name in DRIVERS:
        launches(Path(tempfile.mkdtemp(prefix="boot-")), HERE / "journal.py", name)


def test_every_agent_launches_from_an_installed_zip():
    place = Path(tempfile.mkdtemp(prefix="boot-"))
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


def test_the_journal_starts_on_a_record_with_a_damaged_row():
    place = Path(tempfile.mkdtemp(prefix="boot-"))
    root = place / ".journal"
    journal = [sys.executable, str(HERE / "journal.py"), "--root", str(root)]
    subprocess.run([*journal, "todo", "create", "a row"], cwd=place, capture_output=True, timeout=WAIT)
    (root / "environments" / "main" / "todo" / "002.md").write_text("")
    (root / "environments" / "main" / "todo" / "003.md").write_text('---\n{"n": 3, "title": "odd", "unknown_field": 1}\n---\nbody\n')
    ran = subprocess.run([*journal, "status"], cwd=place, capture_output=True, text=True, timeout=WAIT)
    assert (ran.returncode, "Traceback" in ran.stderr) == (0, False), f"a damaged row stopped the journal:\n{ran.stderr}"
