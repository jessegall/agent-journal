import json
import urllib.error
import urllib.request
from dataclasses import asdict
from typing import Protocol

from engine.machines import Lease
from engine.offline import Write
from engine.sync import Hello
from resources.base import Event, Refused

TIMEOUT = 5


class Transport(Protocol):
    """What this journal asks of the one on the server; everything else the connection does is decided here."""

    def hello(self) -> Hello: ...

    def handover(self, env: str, lease: Lease) -> None: ...

    def handback(self, env: str) -> Lease: ...

    def send(self, held: Write) -> bool: ...

    def events(self, scope: str, env: str, since: int) -> list[Event]: ...


class HttpTransport:
    """The journal on a server over its own address, answering as JSON under /api/sync."""

    def __init__(self, address: str, timeout: float = TIMEOUT) -> None:
        self.address = address.rstrip("/")
        self.timeout = timeout

    def ask(self, path: str, body: dict | None = None) -> str:
        data = None if body is None else json.dumps(body).encode()
        request = urllib.request.Request(f"{self.address}/api/sync/{path}", data=data, headers={"Content-Type": "application/json"})
        try:
            with urllib.request.urlopen(request, timeout=self.timeout) as answer:
                return answer.read().decode() or "{}"
        except urllib.error.HTTPError as error:
            taken_down = " (it has been taken down)" if error.code == 503 else ""
            raise Refused(f"the server refused {path}: {error.code}{taken_down}") from error

    def hello(self) -> Hello:
        return Hello.read(json.loads(self.ask("hello")))

    def handover(self, env: str, lease: Lease) -> None:
        self.ask("handover", {"env": env, **asdict(lease)})

    def handback(self, env: str) -> Lease:
        return Lease(**json.loads(self.ask("handback", {"env": env})))

    def send(self, held: Write) -> bool:
        try:
            return bool(json.loads(self.ask("write", asdict(held))).get("applied"))
        except (OSError, Refused):
            return False

    def events(self, scope: str, env: str, since: int) -> list[Event]:
        return [Event(**found) for found in json.loads(self.ask("events", {"scope": scope, "env": env, "since": since})).get("events", [])]
