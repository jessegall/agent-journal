import json
import re
from dataclasses import dataclass, field
from pathlib import Path
from typing import Callable, Iterator
from uuid import uuid4

from controllers.base import Sender
from controllers.types import CONTROLLERS, Environments
from engine import runtime
from engine.extension import Extension
from engine.fields import Loaded
from engine.record import Record
from resources.base import SYSTEM, USER, Missing

FEATURE_ROUTES = Extension()

JSON = "application/json"

PLAIN = "text/plain; charset=utf-8"

PHONE_ENVIRONMENT = "X-Phone-Environment"
PHONE_UNLOCKED = "X-Phone-Unlocked"
MEMBER = "X-Journal-Member"
SHARED = "X-Journal-Environments"
ROLE = "X-Journal-Role"
PHONE_MEMBER = "X-Phone-Member"


def sender_of(headers) -> Sender | None:
    """The member the login page named on a request it forwarded, or None for the owner's requests and every agent's."""
    member = headers.get(MEMBER)
    if member is None:
        return None
    return Sender(member, headers.get(ROLE, ""), frozenset(filter(None, headers.get(SHARED, "").split(","))))


@dataclass(frozen=True)
class Named(Loaded):
    env: str = ""


@dataclass
class Request:
    root: Path
    params: dict
    query: dict
    body: dict
    kept: Record | None = None

    def record(self) -> Record:
        if self.kept is None:
            self.kept = Record(self.root, self.params["env"], memo=True)
        return self.kept

    @property
    def checkout(self) -> Path:
        project = self.root.parent.resolve()
        place = Environments(self.record(), actor=SYSTEM).rows.by_title(self.params["env"])
        return place.checkout(project) if place else project

    def query_as(self, kind):
        return kind.from_json(self.query)

    def body_as(self, kind):
        return kind.from_json(self.body)

    def asked_lines(self) -> int:
        return int(self.query.get("lines") or 200)

    @property
    def env(self) -> str:
        named = Named.from_json(self.params).env or Named.from_json(self.query).env
        return named if named else runtime.env(self.root)

    def controller(self):
        type_ = self.params["type"]
        if type_ not in CONTROLLERS:
            raise Missing(f"no type {type_}")
        self.body.pop("actor", None)
        return CONTROLLERS[type_](self.record(), actor=USER)


@dataclass
class Reply:
    code: int = 200
    body: object = None
    kind: str = JSON
    chunks: Iterator[bytes] | None = None
    after: Callable[[], None] | None = None
    after_lane: str = field(default_factory=lambda: uuid4().hex)
    timed: bool = True
    named: str | None = None

    def bytes(self) -> bytes:
        if isinstance(self.body, bytes):
            return self.body
        return self.body.encode() if self.kind == PLAIN else json.dumps(self.body).encode()


@dataclass
class Route:
    method: str
    pattern: str
    handler: Callable[[Request], Reply]
    regex: re.Pattern = field(init=False)
    rank: tuple[bool, ...] = field(init=False)

    def __post_init__(self):
        self.regex = re.compile("^" + re.sub(r"{(\w+)}", r"(?P<\1>[^/]+)", self.pattern) + "$")
        self.rank = tuple(segment.startswith("{") for segment in self.pattern.split("/"))


def handles(method: str, pattern: str):
    def marked(fn):
        fn.route = Route(method, pattern, fn)
        return fn
    return marked
