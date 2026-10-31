import json
import os
import subprocess
import sys
import tempfile
import time
from dataclasses import dataclass
from pathlib import Path

from core.base.journal_home import JournalHome
from core.base.refusal import Refusal
from core.base.seed.demo import DEMO_ENVIRONMENT
from core.base.seed.demo_link import DemoLink
from core.modules.demo.support.unix_connection import UnixConnection

STEP_SECONDS = 120
SERVER_START_SECONDS = 30
REQUEST_SECONDS = 10
PERSON = "Demo"
SOURCE = Path(__file__).resolve().parents[4]  # the src folder


@dataclass(frozen=True)
class DemoSession:
    """A scratch journal with a server running: where it is, the server's pid and the link that logs a person
    in."""

    folder: Path
    pid: int
    link: str


class DemoScratch:
    """A scratch journal in a folder of its own: modules synced, the demo seeded by `journal demo seed`, and a
    server started on it; its viewer listens on a port the system picks, which is checked to be none of 8420
    to 8429."""

    def __init__(self, parent: Path | None = None) -> None:
        self.folder = Path(tempfile.mkdtemp(prefix="journal-demo-", dir=parent))
        self.home = JournalHome(self.folder / ".journal")

    def start(self) -> DemoSession:
        self.home.folder.mkdir(parents=True, exist_ok=True)
        self.journal(["module", "sync"])
        self.journal(["demo", "seed"])
        server = subprocess.Popen([sys.executable, "-m", "server.server", "--home", str(self.home.folder)], cwd=self.folder, start_new_session=True,
                                  env={**os.environ, "PYTHONPATH": str(SOURCE)}, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        port = self.viewer_port(server)
        if not DemoLink.is_allowed(port):
            server.terminate()
            raise Refusal(f"the demo's viewer came up on port {port}, which belongs to the journals the team runs", "start it again")
        return DemoSession(self.folder, server.pid, DemoLink.build(port, self.login_key(), DEMO_ENVIRONMENT))

    def journal(self, arguments: list[str]) -> None:
        outcome = subprocess.run([sys.executable, str(SOURCE / "core" / "journal.py"), *arguments], cwd=self.folder, capture_output=True, text=True, timeout=STEP_SECONDS,
                              env={**os.environ, "JOURNAL_HOME": str(self.home.folder), "USER": PERSON}, check=False)
        if outcome.returncode != 0:
            raise Refusal(f"journal {' '.join(arguments)} gave {outcome.returncode} in the demo's folder: {(outcome.stdout + outcome.stderr).strip()[:300]}", "start it again")

    def viewer_port(self, server: subprocess.Popen[bytes]) -> int:
        deadline = time.monotonic() + SERVER_START_SECONDS
        while time.monotonic() < deadline:
            if server.poll() is not None:
                raise Refusal("the demo's server stopped as it started", "start it again")
            try:
                return int(str(self.ask("GET", "/health")["viewer_port"]))
            except (OSError, KeyError, ValueError):
                time.sleep(0.2)
        server.terminate()
        raise Refusal(f"the demo's server did not answer within {SERVER_START_SECONDS} seconds", "start it again")

    def login_key(self) -> str:
        return str(self.ask("POST", "/viewer/key", {"variables": {"USER": PERSON}, "folder": str(self.folder)})["key"])

    def ask(self, method: str, path: str, body: dict[str, object] | None = None) -> dict[str, object]:
        connection = UnixConnection(str(self.home.socket("server")), REQUEST_SECONDS)
        try:
            connection.request(method, path, json.dumps(body) if body is not None else None, {"Content-Type": "application/json"})
            answer: dict[str, object] = json.loads(connection.getresponse().read() or b"{}")
            return answer
        finally:
            connection.close()
