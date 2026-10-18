from dataclasses import dataclass
from datetime import datetime

from journal.models.model import Model
from journal.models.secret_field import SecretField
from journal.models.secret_kind import SecretKind
from journal.refused import Refused


@dataclass(frozen=True)
class Secret(Model):
    """A key or a login the agent may use without seeing it: its fields and the programs it may be given to. Its values live in a file in the home folder, never here."""

    title: str = ""
    brief: str = ""
    """How the secret is used, read by the agent: the commands it runs with it."""
    kind: SecretKind = SecretKind.CUSTOM
    fields: tuple = ()
    """Each field as {name, hidden, variable}."""
    filled: tuple[str, ...] = ()
    """The names of the fields that hold a value."""
    programs: tuple[str, ...] = ()
    proposed: tuple[str, ...] = ()
    helpers: bool = False
    """Whether subagents and workers may be given it as well as the main agent."""
    url: str = ""
    auto_login: bool = False
    asked_at: datetime | None = None
    used_at: datetime | None = None
    session_at: datetime | None = None
    session_expires: datetime | None = None
    logging_in_at: datetime | None = None
    deleted_at: datetime | None = None
    """Set when deleted: the values are kept thirty days for a restore."""

    def field(self, name: str) -> SecretField:
        found = next((SecretField.of(raw) for raw in self.fields if raw["name"] == name), None)
        if found is None:
            raise Refused(f"secret {self.id} has no field {name!r}; its fields are {', '.join(raw['name'] for raw in self.fields) or 'none yet'}")
        return found

    def waiting(self) -> bool:
        """A field without a value: the secret waits for the user."""
        return any(raw["name"] not in self.filled for raw in self.fields)

    def allowing(self, programs: tuple[str, ...] | None, proposed: tuple[str, ...] | None) -> "Secret":
        """The programs it goes to and the ones proposed for it, each kept when not given; a program allowed is no longer proposed."""
        allowed = self.programs if programs is None else programs
        asked = self.proposed if proposed is None else proposed
        return self.with_(programs=allowed, proposed=tuple(p for p in asked if p not in allowed))

    def login_ran_out_unasked(self, now: datetime) -> bool:
        """The saved login ran out, and the user was not yet asked to log in again since."""
        if self.session_expires is None or self.session_expires >= now:
            return False
        return self.asked_at is None or self.asked_at < self.session_expires

    def filled_in(self, name: str) -> "Secret":
        return self.with_(filled=tuple(dict.fromkeys((*self.filled, self.field(name).name))), asked_at=None)

    def deleted(self, at: datetime) -> "Secret":
        return self.with_(deleted_at=at)

    def restored(self) -> "Secret":
        return self.with_(deleted_at=None)
