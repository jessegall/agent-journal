import json
import urllib.error
import urllib.request
from dataclasses import asdict
from typing import Protocol

from engine import runtime
from engine.machines import Lease, this_machine
from engine.offline import Sent, Write
from engine.stored import write_text
from engine.sync import Hello
from resources.base import Event, Refused

TIMEOUT = 5
SERVER_KEY = "server-key"


class ServerRefused(Refused):
    """The server answered with an error status: a 5xx is passing, anything else is its answer for good."""

    def __init__(self, message: str, status: int) -> None:
        super().__init__(message)
        self.status = status

    @classmethod
    def of(cls, path: str, error: urllib.error.HTTPError) -> "ServerRefused":
        taken_down = " (it has been taken down)" if error.code == 503 else ""
        return cls(f"the server refused {path}: {error.code}{taken_down}", error.code)

    def outcome(self) -> Sent:
        return Sent.AWAY if self.status >= 500 else Sent.REFUSED


class Transport(Protocol):
    """What this journal asks of the one on the server; everything else the connection does is decided here."""

    def hello(self) -> Hello: ...

    def handover(self, env: str, lease: Lease) -> None: ...

    def handback(self, env: str) -> Lease: ...

    def holder(self, env: str) -> Lease: ...

    def send(self, held: Write) -> Sent: ...

    def events(self, scope: str, env: str, since: int) -> list[Event]: ...


class ServerKey:
    """The machine key this copy shows the server's login page, kept on this machine and never sent anywhere else."""

    def __init__(self, root) -> None:
        self.file = runtime.folder(root) / SERVER_KEY

    def keep(self, key: str) -> None:
        write_text(self.file, key)
        self.file.chmod(0o600)

    def read(self) -> str | None:
        return self.file.read_text().strip() if self.file.is_file() else None

    def is_kept(self) -> bool:
        return self.file.is_file()


class HttpTransport:
    """The journal on a server over its own address, answering as JSON under /api/sync, with this copy's machine key when it has one."""

    def __init__(self, address: str, key: str | None = None, timeout: float = TIMEOUT) -> None:
        self.address = address.rstrip("/")
        self.key = key
        self.timeout = timeout

    def headers(self) -> dict:
        if self.key is None:
            return {"Content-Type": "application/json"}
        return {"Content-Type": "application/json", "Authorization": f"Bearer {self.key}"}

    def ask(self, path: str, body: dict | None = None) -> str:
        data = None if body is None else json.dumps(body).encode()
        request = urllib.request.Request(f"{self.address}/api/sync/{path}", data=data, headers=self.headers())
        try:
            with urllib.request.urlopen(request, timeout=self.timeout) as answer:
                return answer.read().decode() or "{}"
        except urllib.error.HTTPError as error:
            raise ServerRefused.of(path, error) from error

    def hello(self) -> Hello:
        return Hello.read(json.loads(self.ask("hello")))

    def handover(self, env: str, lease: Lease) -> None:
        self.ask("handover", {"env": env, **asdict(lease)})

    def handback(self, env: str) -> Lease:
        return Lease(**json.loads(self.ask("handback", {"env": env, "machine": this_machine()})))

    def holder(self, env: str) -> Lease:
        return Lease(**json.loads(self.ask("holder", {"env": env})))

    def send(self, held: Write) -> Sent:
        """A write the server could not be reached for, or failed on, is tried again; one it refused is not."""
        try:
            self.ask("write", asdict(held))
        except ServerRefused as refusal:
            return refusal.outcome()
        except OSError:
            return Sent.AWAY
        return Sent.TAKEN

    def events(self, scope: str, env: str, since: int) -> list[Event]:
        return [Event(**found) for found in json.loads(self.ask("events", {"scope": scope, "env": env, "since": since})).get("events", [])]
