import os
import shlex
import subprocess
from pathlib import Path

from core.base.journal_home import JournalHome
from server.server_files import ServerFiles, socket_path
from tests.stories.server.support.server_client import request_answer

ROOT = Path(__file__).resolve().parents[4]
BUILD_TIMEOUT_SECONDS = 180
RUN_TIMEOUT_SECONDS = 30


class ClientBinary:
    """The Go client built once into a story's folder and run against the real server on the story's journal;
    the server it starts is stopped when the story ends, and every run has a time limit."""

    def __init__(self, home: JournalHome, build_folder: Path) -> None:
        self.home, self.binary = home, build_folder / "journal-client"

    def __enter__(self) -> "ClientBinary":
        subprocess.run(["go", "build", "-o", str(self.binary), "."], cwd=ROOT / "tools" / "journal", check=True, timeout=BUILD_TIMEOUT_SECONDS,
                       capture_output=True)
        return self

    def __exit__(self, *details: object) -> None:
        self.run("server stop")

    def run(self, line: str) -> subprocess.CompletedProcess[str]:
        environment = {"PATH": os.environ.get("PATH", ""), "HOME": os.environ.get("HOME", ""), "JOURNAL_HOME": str(self.home.folder),
                       "JOURNAL_SOURCE": str(ROOT / "src"), "USER": "story"}
        return subprocess.run([str(self.binary), *shlex.split(line)], env=environment, capture_output=True, text=True, timeout=RUN_TIMEOUT_SECONDS)

    def expect_answer(self, line: str, expected_line: str) -> None:
        finished = self.run(line)
        assert finished.returncode == 0 and expected_line in finished.stdout.splitlines(), (finished.returncode, finished.stdout, finished.stderr)

    def server_pid(self) -> object:
        health = request_answer(socket_path(self.home), "GET", "/health").json()
        assert isinstance(health, dict)
        return health["pid"]

    def expect_server_pid(self, pid: object) -> None:
        assert self.server_pid() == pid

    def expect_no_server(self) -> None:
        files = ServerFiles(self.home)
        assert not socket_path(self.home).exists() and files.acquire_lock()
        files.release_lock()
