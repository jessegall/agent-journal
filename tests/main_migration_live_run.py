# Checks main's code out into a temporary folder and runs it in a subprocess, so it is not in the default run: python3 -m pytest -q tests/main_migration_live_run.py
"""A journal's database made by the code on main is opened by this version: its migrations run once, every table reads, and the rows main wrote are still there."""
import json
import subprocess
import sys
from pathlib import Path

from journal.app import App
from journal.config import Config
from journal.repositories.messages import Messages
from journal.repositories.scope import Scope
from journal.repositories.tasks import Tasks

MAIN_JOURNAL = """
import sys
from pathlib import Path
from journal.app import App
from journal.config import Config
from journal.support.where import Where
app = App(Config(Path(sys.argv[1]), port=0))
app.runtime().boot()
for argv in (["task", "create", "written on main", "--brief", "b"], ["message", "send", "said on main"]):
    assert app.console().run(argv, Where()).code == 0, argv
"""


def test_a_database_made_on_main_opens_on_this_version(tmp_path):
    checkout = tmp_path / "main"
    subprocess.run(["git", "worktree", "add", "--detach", str(checkout), "main"], check=True, capture_output=True, timeout=60)
    try:
        root = tmp_path / "project"
        root.mkdir()
        made = subprocess.run([sys.executable, "-c", MAIN_JOURNAL, str(root)], cwd=checkout / "src", env={"PYTHONPATH": str(checkout / "src"), "PATH": "/usr/bin:/bin", "HOME": str(tmp_path)}, capture_output=True, text=True, timeout=120)
        assert made.returncode == 0, made.stderr[-2000:]
        app = App(Config(root, port=0))
        app.runtime().boot()
        with app.container.get(Scope).environment(1):
            assert [t.title for t in app.container.get(Tasks).all()] == ["written on main"]
            said = [m for m in app.container.get(Messages).all() if m.text == "said on main"]
            assert len(said) == 1 and said[0].agent_role.value == "main" and said[0] in app.container.get(Messages).recent(10), "main's message is in the main chat"
        json.dumps({"ok": True})
    finally:
        subprocess.run(["git", "worktree", "remove", "--force", str(checkout)], capture_output=True, timeout=60)
