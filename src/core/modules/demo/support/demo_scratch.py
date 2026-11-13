import json
import os
import subprocess
import sys
import tempfile
from pathlib import Path

from engine.file.code_copy import CodeCopy
from engine.journal.journal_home import JournalHome
from engine.errors.refusal import Refusal
from engine.seed.demo import DEMO_ENVIRONMENT
from engine.seed.demo_link import DemoLink
from engine.connection.unix_connection import UnixConnection
from core.modules.demo.support.demo_owner import DemoOwner
from core.modules.demo.support.demo_session import DemoSession
from engine.time.polled_wait import PolledWait

STEP_SECONDS = 120
SERVER_START_SECONDS = 30
HEALTH_POLL_SECONDS = 0.2
REQUEST_SECONDS = 10
PERSON = "Demo"
SOURCE = Path(__file__).resolve().parents[4]  # the src folder


class DemoScratch:
    """A scratch journal in a folder of its own with its own copy of the code: modules synced, the demo seeded
    by `journal demo seed`, and a server started on it; its viewer listens on a port the system picks, which
    is checked to be none of 8420 to 8429. A demo started for a process stops when that process ends."""

    def __init__(self, parent: Path | None = None, owner_pid: int | None = None) -> None:
        self.owner_pid = owner_pid
        self.folder = Path(tempfile.mkdtemp(prefix="journal-demo-", dir=parent))
        self.home = JournalHome(self.folder / ".journal")
        self.code = CodeCopy(SOURCE, self.home)

    def start(self, module_folder: Path | None = None) -> DemoSession:
        self.home.folder.mkdir(parents=True, exist_ok=True)
        if self.owner_pid is not None:
            DemoOwner(self.home.folder).keep(self.owner_pid)
        self.code.make()
        arguments = ["module", "sync"] if module_folder is None else ["module", "add", str(module_folder.resolve())]
        self.journal(arguments)
        self.journal(["demo", "seed"])
        server = subprocess.Popen([sys.executable, "-m", "server.server", "--home", str(self.home.folder)], cwd=self.folder, start_new_session=True,
                                  env={**os.environ, "PYTHONPATH": str(self.code.folder())}, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        port = self.viewer_port(server)
        if not DemoLink.is_allowed(port):
            server.terminate()
            raise Refusal(f"the demo's viewer came up on port {port}, which belongs to the journals the team runs", "start it again")
        return DemoSession(self.folder, server.pid, DemoLink.build(port, self.login_key(), DEMO_ENVIRONMENT))

    def journal(self, arguments: list[str]) -> None:
        outcome = subprocess.run([sys.executable, str(self.code.folder() / "engine" / "cli" / "journal.py"), *arguments], cwd=self.folder, capture_output=True, text=True, timeout=STEP_SECONDS,
                              env={**os.environ, "JOURNAL_HOME": str(self.home.folder), "USER": PERSON}, check=False)
        if outcome.returncode != 0:
            raise Refusal(f"journal {' '.join(arguments)} gave {outcome.returncode} in the demo's folder: {(outcome.stdout + outcome.stderr).strip()[:300]}", "start it again")

    def viewer_port(self, server: subprocess.Popen[bytes]) -> int:
        ports: list[int] = []
        if PolledWait(SERVER_START_SECONDS, HEALTH_POLL_SECONDS).poll(lambda: self.has_answered(server, ports)):
            return ports[0]
        server.terminate()
        raise Refusal(f"the demo's server did not answer within {SERVER_START_SECONDS} seconds", "start it again")

    def has_answered(self, server: subprocess.Popen[bytes], ports: list[int]) -> bool:
        if server.poll() is not None:
            raise Refusal("the demo's server stopped as it started", "start it again")
        try:
            ports.append(int(str(self.ask("GET", "/health")["viewer_port"])))
        except (OSError, KeyError, ValueError):
            return False
        return True

    def login_key(self) -> str:
        return str(self.ask("POST", "/viewer/key", {"variables": {"USER": PERSON}, "folder": str(self.folder)})["key"])

    def ask(self, method: str, path: str, body: dict[str, object] | None = None) -> dict[str, object]:
        connection = UnixConnection(str(self.home.socket("server")), REQUEST_SECONDS, "localhost")
        try:
            connection.request(method, path, json.dumps(body) if body is not None else None, {"Content-Type": "application/json"})
            answer: dict[str, object] = json.loads(connection.getresponse().read() or b"{}")
            return answer
        finally:
            connection.close()
