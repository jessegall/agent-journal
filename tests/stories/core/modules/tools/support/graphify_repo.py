import subprocess
from pathlib import Path

from tests.stories.server.support.file_changes import FileChanges

WAIT_SECONDS = 10
COMMAND_SETTING = "journal.core.tools.graphify-command"
INSTALL_SETTING = "journal.core.tools.graphify-install-command"


class GraphifyRepo:
    """A git checkout with a stand-in for Graphify: a script that records each call with its folder and
    arguments, waits while a hold file exists, then writes a graph into graphify-out."""

    def __init__(self, base: Path, name: str = "checkout") -> None:
        self.folder = base / name
        self.calls = base / f"{name}-calls.log"
        self.claim = base / f"{name}-hold"
        self.script = base / f"{name}-graphify"
        self.folder.mkdir(parents=True)
        self.script.write_text(f'#!/bin/sh\necho "$PWD $*" >> "{self.calls}"\nwhile [ -e "{self.claim}" ]; do sleep 0.05; done\n'
                               "mkdir -p graphify-out\necho graph > graphify-out/graph.json\n")
        self.script.chmod(0o755)
        self.git("init", "-q")
        self.commit("first")

    def git(self, *text_parts: str) -> None:
        subprocess.run(["git", "-C", str(self.folder), "-c", "user.name=Stand In", "-c", "user.email=none", *text_parts], check=True, capture_output=True)

    def commit(self, message: str) -> None:
        (self.folder / "work.txt").write_text(message)
        self.git("add", "work.txt")
        self.git("commit", "-q", "-m", message)

    def call_count(self) -> int:
        return len(self.calls.read_text().splitlines()) if self.calls.is_file() else 0

    def block_graphify(self) -> None:
        self.claim.write_text("")

    def release_graphify(self) -> None:
        self.claim.unlink(missing_ok=True)

    def poll_calls(self, count: int) -> None:
        self.wait(self.calls.parent, lambda: self.call_count() >= count)

    def head(self) -> str:
        return subprocess.run(["git", "-C", str(self.folder), "rev-parse", "HEAD"], check=True, capture_output=True, text=True).stdout.strip()

    def refreshed(self) -> str:
        stamp = self.folder / "graphify-out/.journal-refresh"
        return stamp.read_text().split()[0] if stamp.is_file() else ""

    def poll_refresh(self) -> None:
        self.wait(self.folder / "graphify-out", lambda: self.refreshed() == self.head() and not (self.folder / "graphify-out/.journal-running").is_file())

    def wait(self, folder: Path, ready) -> None:
        folder.mkdir(exist_ok=True)
        with FileChanges(folder) as changes:
            while not ready():
                assert changes.wait(WAIT_SECONDS), folder
