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

    def __init__(self, address: str) -> None:
        self.address = address.rstrip("/")

    def ask(self, path: str, body: dict | None = None) -> dict:
        data = None if body is None else json.dumps(body).encode()
        request = urllib.request.Request(f"{self.address}/api/sync/{path}", data=data, headers={"Content-Type": "application/json"})
        try:
            with urllib.request.urlopen(request, timeout=TIMEOUT) as answer:
                return json.loads(answer.read() or b"{}")
        except urllib.error.HTTPError as error:
            raise Refused(f"the server refused {path}: {error.code}") from error

    def hello(self) -> Hello:
        return Hello.read(self.ask("hello"))

    def handover(self, env: str, lease: Lease) -> None:
        self.ask("handover", {"env": env, **asdict(lease)})

    def handback(self, env: str) -> Lease:
        return Lease(**self.ask("handback", {"env": env}))

    def send(self, held: Write) -> bool:
        try:
            return bool(self.ask("write", asdict(held)).get("applied"))
        except (OSError, Refused):
            return False

    def events(self, scope: str, env: str, since: int) -> list[Event]:
        return [Event(**found) for found in self.ask("events", {"scope": scope, "env": env, "since": since}).get("events", [])]
