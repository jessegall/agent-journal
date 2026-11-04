import json
import shlex
import socket
import subprocess
import time
import urllib.error
import urllib.request
from collections.abc import Mapping
from pathlib import Path

from tests.stories.server.support.go_build import GoBuild

READY_TIMEOUT_SECONDS = 30
RUN_TIMEOUT_SECONDS = 30
REQUEST_TIMEOUT_SECONDS = 10
HOST = "127.0.0.1"
PROTOCOL = "1"


class SharedServerBinary:
    """The Go shared server built once into a story's folder and run on a free local port with its own data folder,
    stopped when the story ends; every run has a time limit."""

    def __init__(self, build_folder: Path) -> None:
        self.binary, self.data = build_folder / "journal-shared", build_folder / "shared-data"
        self.port = self.free_port()
        self.process: subprocess.Popen[str] | None = None

    @property
    def address(self) -> str:
        return f"http://{HOST}:{self.port}"

    def __enter__(self) -> "SharedServerBinary":
        GoBuild.built("journal-shared", self.binary)
        self.data.mkdir(exist_ok=True)
        self.process = subprocess.Popen([str(self.binary), "serve", "--data", str(self.data), "--listen", f"{HOST}:{self.port}"], env=GoBuild.environment(),
                                        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, text=True)
        self.wait_until_ready()
        return self

    def __exit__(self, *details: object) -> None:
        if self.process is not None:
            self.process.terminate()
            self.process.wait(timeout=RUN_TIMEOUT_SECONDS)

    def run(self, line: str) -> str:
        finished = subprocess.run([str(self.binary), *shlex.split(line), "--data", str(self.data)], env=GoBuild.environment(), capture_output=True, text=True,
                                  timeout=RUN_TIMEOUT_SECONDS, check=True)
        return finished.stdout

    def new_user(self, name: str, role: str) -> str:
        return self.run(f"user add {name} --role {role}").splitlines()[1]

    def new_token(self, user_name: str) -> str:
        return self.run(f"token new {user_name}").splitlines()[1]

    def send(self, token: str, method: str, path: str, body: Mapping[str, object] | None = None, headers: Mapping[str, str] | None = None) -> tuple[int, dict[str, object]]:
        request = urllib.request.Request(self.address + path, data=None if body is None else json.dumps(body).encode(), method=method,
                                         headers={"Authorization": f"Bearer {token}", "Journal-Protocol": PROTOCOL, "Content-Type": "application/json", **(headers or {})})
        try:
            with urllib.request.urlopen(request, timeout=REQUEST_TIMEOUT_SECONDS) as answer:
                return answer.status, json.load(answer)
        except urllib.error.HTTPError as failure:
            return failure.code, json.load(failure)

    def server_key(self) -> str:
        with urllib.request.urlopen(self.address + "/info", timeout=REQUEST_TIMEOUT_SECONDS) as answer:
            return str(json.load(answer)["server_key"])

    def wait_until_ready(self) -> None:
        deadline = time.monotonic() + READY_TIMEOUT_SECONDS
        while time.monotonic() < deadline:
            try:
                self.server_key()
                return
            except OSError:
                time.sleep(0.1)
        raise TimeoutError(f"the shared server did not answer on {self.address}")

    @staticmethod
    def free_port() -> int:
        with socket.socket() as probe:
            probe.bind((HOST, 0))
            return int(probe.getsockname()[1])
