from dataclasses import asdict, dataclass
from enum import StrEnum
from typing import ClassVar

from engine.wording import slugged
from resources.base import PROJECT, UNLISTED, Refused, Resource, ResourceDetails
from resources.shapes import Field, Shape


@dataclass(frozen=True)
class SecretField:
    name: str
    hidden: bool
    variable: str

    @classmethod
    def from_json(cls, raw: dict) -> "SecretField":
        return cls(raw["name"], bool(raw.get("hidden", True)), raw["variable"])


class Kind(StrEnum):
    API_KEY = "api key"
    LOGIN = "login"
    CUSTOM = "custom"

    @classmethod
    def named(cls, given: str) -> "Kind":
        try:
            return cls(given.strip().lower())
        except ValueError as missing:
            raise Refused(f"a secret is one of {', '.join(kind.value for kind in cls)}, not {given!r}") from missing

    def fields(self, title: str) -> list[dict]:
        stem = slugged(title, "_").upper()
        names = {Kind.API_KEY: (("key", True),), Kind.LOGIN: (("username", False), ("password", True))}.get(self, ())
        return [asdict(SecretField(name, hidden, f"{stem}_{name.upper()}")) for name, hidden in names]


class Secret(Shape, Resource):
    details: ClassVar[ResourceDetails] = ResourceDetails(
        title="Secret",
        abstract="A key or login the agent may use without ever seeing it",
        help="Its values live in a file in your home folder, never in the journal. You fill them in under Settings, Secrets.",
    )
    data_fields: ClassVar[list[Field]] = [
        Field(default=Kind.CUSTOM.value, name="kind"),
        Field(default=list, name="secret_fields"),
        Field(default=list, name="programs"),
        Field(default=False, name="helpers"),
        Field(default=dict, name="filled", journal_only=True),
        Field(default=0.0, name="used", journal_only=True),
        Field(default="", name="asked"),
    ]
    type = "secret"
    icon = "key"
    scope = PROJECT
    listed_under = UNLISTED
    in_sidebar = False
    subagent_writable = False
    takes_comments = False

    def field(self, name: str) -> SecretField:
        found = next((SecretField.from_json(raw) for raw in self.secret_fields if raw["name"] == name), None)
        if found is None:
            raise Refused(f"secret {self.n} has no field {name!r}; its fields are {', '.join(raw['name'] for raw in self.secret_fields) or 'none yet'}")
        return found

    def is_waiting(self) -> bool:
        return any(raw["name"] not in self.filled for raw in self.secret_fields)
