import subprocess
import time
from pathlib import Path

COMMAND_SETTING = "journal.core.tools.graphify-command"
INSTALL_SETTING = "journal.core.tools.graphify-install-command"


class GraphifyRepo:
    """A git checkout with a stand-in for Graphify: a script that records each call with its folder and
    arguments, waits while a hold file exists, then writes a graph into graphify-out."""

    def __init__(self, base: Path, name: str = "checkout") -> None:
        self.folder = base / name
        self.calls = base / f"{name}-calls.log"
        self.hold = base / f"{name}-hold"
        self.script = base / f"{name}-graphify"
        self.folder.mkdir(parents=True)
        self.script.write_text(f'#!/bin/sh\necho "$PWD $*" >> "{self.calls}"\nwhile [ -e "{self.hold}" ]; do sleep 0.05; done\n'
                               "mkdir -p graphify-out\necho graph > graphify-out/graph.json\n")
        self.script.chmod(0o755)
        self.git("init", "-q")
        self.commit("first")

    def git(self, *words: str) -> None:
        subprocess.run(["git", "-C", str(self.folder), "-c", "user.name=Stand In", "-c", "user.email=none", *words], check=True, capture_output=True)

    def commit(self, message: str) -> None:
        (self.folder / "work.txt").write_text(message)
        self.git("add", "work.txt")
        self.git("commit", "-q", "-m", message)

    def call_count(self) -> int:
        return len(self.calls.read_text().splitlines()) if self.calls.is_file() else 0

    def hold_graphify(self) -> None:
        self.hold.write_text("")

    def release_graphify(self) -> None:
        self.hold.unlink(missing_ok=True)

    def wait_for_calls(self, count: int) -> None:
        self.wait(lambda: self.call_count() >= count)

    def head(self) -> str:
        return subprocess.run(["git", "-C", str(self.folder), "rev-parse", "HEAD"], check=True, capture_output=True, text=True).stdout.strip()

    def refreshed_for(self) -> str:
        stamp = self.folder / "graphify-out/.journal-refresh"
        return stamp.read_text().split()[0] if stamp.is_file() else ""

    def wait_for_refresh(self) -> None:
        self.wait(lambda: self.refreshed_for() == self.head() and not (self.folder / "graphify-out/.journal-running").is_file())

    def wait(self, ready) -> None:
        deadline = time.time() + 10
        while not ready() and time.time() < deadline:
            time.sleep(0.05)
        assert ready()
