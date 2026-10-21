from typing import ClassVar
from dataclasses import dataclass
from datetime import datetime

from journal.events.rows.secret_allowed import SecretAllowed
from journal.models.model import Model
from journal.support.secret_field import SecretField
from journal.models.secret_kind import SecretKind
from journal.support.refused import Refused


@dataclass(frozen=True)
class Secret(Model):
    """A key or a login the agent may use without seeing it: its fields and the programs it may be given to. Its values live in a file in the home folder, never here."""

    text_fields: ClassVar[tuple[str, ...]] = ("title", "brief")
    title: str = ""
    brief: str = ""
    kind: SecretKind = SecretKind.CUSTOM
    fields: tuple = ()
    filled: tuple[str, ...] = ()
    programs: tuple[str, ...] = ()
    proposed: tuple[str, ...] = ()
    helpers: bool = False
    url: str = ""
    auto_login: bool = False
    asked_at: datetime | None = None
    used_at: datetime | None = None
    session_at: datetime | None = None
    session_expires: datetime | None = None
    logging_in_at: datetime | None = None
    deleted_at: datetime | None = None

    def field(self, name: str) -> SecretField:
        found = next((SecretField.of(raw) for raw in self.fields if raw["name"] == name), None)
        if found is None:
            raise Refused(f"secret {self.id} has no field {name!r}; its fields are {', '.join(raw['name'] for raw in self.fields) or 'none yet'}")
        return found

    def waiting(self) -> bool:
        return any(raw["name"] not in self.filled for raw in self.fields)

    def allowing(self, programs: tuple[str, ...] | None, proposed: tuple[str, ...] | None) -> "Secret":
        allowed = self.programs if programs is None else programs
        new = tuple(p for p in allowed if p not in self.programs)
        if new:
            return self.with_(programs=allowed, proposed=tuple(p for p in (self.proposed if proposed is None else proposed) if p not in allowed)).with_event(SecretAllowed(secret_id=self.id, title=self.title, programs=new))
        asked = self.proposed if proposed is None else proposed
        return self.with_(programs=allowed, proposed=tuple(p for p in asked if p not in allowed))

    def login_ran_out_unasked(self, now: datetime) -> bool:
        if self.session_expires is None or self.session_expires >= now:
            return False
        return self.asked_at is None or self.asked_at < self.session_expires

    def filled_in(self, name: str) -> "Secret":
        return self.with_(filled=tuple(dict.fromkeys((*self.filled, self.field(name).name))), asked_at=None)

    def deleted(self, at: datetime) -> "Secret":
        return self.with_(deleted_at=at)

    def restored(self) -> "Secret":
        return self.with_(deleted_at=None)

    def title_words(self) -> str:
        return self.title

    def summary_line(self) -> str:
        return self.first_line(self.brief)
