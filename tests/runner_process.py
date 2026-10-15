# Runs the runner script as a real process against a real server, so it is not in the default run: python3 -m pytest tests/runner_process.py
import json
import os
import subprocess
import time
from pathlib import Path
from urllib.request import Request, urlopen

from journal.app import App
from journal.config import Config
from journal.models.actor import Actor
from journal.models.setting import Setting
from journal.repositories.entries import Entries
from journal.repositories.settings import Settings

SRC = Path(__file__).resolve().parent.parent / "src"


def wrapped(command: str, cwd_file: Path) -> str:
    """The line Claude Code hands the runner: its own set-up, the command in an eval, and a pwd into its file."""
    return f"setopt NO_EXTENDED_GLOB 2>/dev/null || true && eval '{command.replace(chr(39), chr(39) + chr(34) + chr(39) + chr(34) + chr(39))}' < /dev/null && pwd -P >| {cwd_file}"


def test_the_runner_runs_a_chain_part_by_part_and_moves_a_long_one_to_the_background(tmp_path: Path):
    (tmp_path / ".journal").mkdir()
    (tmp_path / ".journal" / "src").symlink_to(SRC)
    app = App(Config(tmp_path, port=0))
    settings = app.container.get(Settings)
    settings.save(Setting(environment_id=0, key="features.skills", value=False), Actor.system())
    app.runtime().start()
    try:
        port = app.server().port
        (tmp_path / ".journal" / "port").write_text(str(port))
        urlopen(Request(f"http://127.0.0.1:{port}/hooks/claude", data=json.dumps({"hook_event_name": "SessionStart", "session_id": "s1"}).encode(), method="POST", headers={"Content-Type": "application/json"}), timeout=5).read()
        env = {**os.environ, "JOURNAL_ROOT": str(tmp_path), "JOURNAL_ENV": "main", "CLAUDECODE": "1", "SHELL": "/bin/zsh"}
        runner, cwd = str(tmp_path / ".journal" / "src" / "journal" / "hooks" / "run.sh"), tmp_path / "cwd"
        run = subprocess.run([runner, wrapped(f"cd {tmp_path} && echo one && false && echo three", cwd)], env=env, cwd=tmp_path, capture_output=True, text=True, timeout=20)
        assert run.stdout.strip() == "one" and run.returncode == 1 and not cwd.exists(), run.stderr
        run = subprocess.run([runner, wrapped("echo before; [ -f /nonexistent ] || exit 3; echo after", cwd)], env=env, cwd=tmp_path, capture_output=True, text=True, timeout=20)
        assert run.stdout.strip() == "before" and run.returncode == 3 and not cwd.exists(), run.stderr
        run = subprocess.run([runner, wrapped("echo first && exec echo replaced; echo never", cwd)], env=env, cwd=tmp_path, capture_output=True, text=True, timeout=20)
        assert run.stdout.split() == ["first", "replaced"] and run.returncode == 0 and "No such file" not in run.stderr, run.stderr
        settings.save(Setting(environment_id=0, key="shell.foreground", value=1), Actor.system())
        run = subprocess.run([runner, wrapped("echo fast && sleep 3 && echo slow", cwd)], env=env, cwd=tmp_path, capture_output=True, text=True, timeout=20)
        assert "fast" in run.stdout and "moved to the background: sleep 3" in run.stdout and run.returncode == 0, run.stderr
        entries = app.container.get(Entries)
        for _ in range(100):
            if entries.of_kind(1, "ended", 5):
                break
            time.sleep(0.1)
        assert entries.of_kind(1, "ended", 5)[0].data["status"] == 0
        assert [e.data["part"] for e in reversed(entries.of_kind(1, "ran", 20))][-3:] == ["echo fast", "sleep 3", "echo slow"]
        assert cwd.read_text().strip() == str(tmp_path.resolve())
    finally:
        app.runtime().stop()
