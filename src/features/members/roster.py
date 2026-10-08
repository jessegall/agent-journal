import secrets
from dataclasses import asdict, dataclass, field, replace
from enum import StrEnum

from engine.fields import Loaded
from features.hosted_journal.owner import KeptCode, KeptPassword
from features.hosted_journal.vault import Vault
from features.members.roles import Role
from features.trigger import DAY
from resources.base import Refused

MEMBERS = "members.json"
INVITE_DAYS = 7
NAME_LONGEST = 60


class Departure(StrEnum):
    """How a member stopped being one: they left, or the owner removed them."""

    LEFT = "left"
    REMOVED = "removed"


@dataclass(frozen=True)
class Member(Loaded):
    """A person the owner invited, known by an id that never changes, with the password they chose on joining."""

    id: str = ""
    name: str = ""
    role: Role = Role.WRITER
    environments: tuple[str, ...] = ()
    invited: float = 0.0
    joined: float = 0.0
    code: KeptCode = field(default_factory=KeptCode)
    password: KeptPassword = field(default_factory=KeptPassword)
    departed: Departure | None = None
    departed_at: float = 0.0

    def has_joined(self) -> bool:
        return bool(self.joined)

    def sees(self, environment: str) -> bool:
        return environment in self.environments

    def is_present(self) -> bool:
        return self.departed is None

    def departing(self, how: Departure, now: float) -> "Member":
        """The member gone, keeping their name for what they wrote, with no password or invite left to come back by."""
        return replace(self, departed=how, departed_at=now, code=KeptCode(), password=KeptPassword())

    def joining(self, password: KeptPassword, now: float) -> "Member":
        return replace(self, password=password, code=KeptCode(), joined=now)

    def kept(self) -> dict:
        return {key: value for key, value in asdict(self).items() if key != "id"}

    def summary(self) -> dict:
        return {"id": self.id, "name": self.name, "role": self.role, "environments": self.environments, "invited": self.invited, "joined": self.joined, "departed": self.departed}


@dataclass(frozen=True)
class Invite:
    member: Member
    code: str


class Roster:
    """The people the owner invited into this journal on a server, kept in the login page's vault."""

    def __init__(self, vault: Vault) -> None:
        self.vault = vault

    def all(self) -> tuple[Member, ...]:
        return tuple(Member.from_json({**kept, "id": key}) for key, kept in self.vault.read(MEMBERS).items())

    def invite(self, name: str, role: Role, environments: tuple[str, ...]) -> Invite:
        named = " ".join(name.split())[:NAME_LONGEST]
        if not named:
            raise Refused("a member needs a name")
        code = secrets.token_urlsafe(16)
        with self.vault.held():
            if self.named(named) is not None:
                raise Refused(f"{named} is already a member")
            now = self.vault.clock()
            member = Member(f"m-{secrets.token_hex(6)}", named, role, environments, now, code=KeptCode.made(code, now + INVITE_DAYS * DAY))
            self._keep(member)
        return Invite(member, code)

    def invited_by(self, code: str) -> Member | None:
        now = self.vault.clock()
        return next((member for member in self.all() if not member.has_joined() and member.code.matches(code, now)), None)

    def found(self, member: str) -> Member | None:
        return next((kept for kept in self.all() if kept.id == member), None)

    def present(self, member: str) -> Member | None:
        found = self.found(member)
        return found if found is not None and found.is_present() else None

    def named(self, name: str) -> Member | None:
        """The present member with this name; one who left keeps the name only on what they wrote."""
        wanted = " ".join(name.split()).casefold()
        return next((member for member in self.all() if member.is_present() and member.name.casefold() == wanted), None)

    def matching(self, name: str, password: str) -> str | None:
        """The id of the joined member with this name and password, or None."""
        member = self.named(name)
        if member is None or not member.password.matches(password):
            return None
        return member.id

    def join(self, code: str, password: str) -> Member | None:
        """The invited member the code names, joined with the chosen password and the code used up; None when the code names no one."""
        chosen = KeptPassword.made(password)
        with self.vault.held():
            member = self.invited_by(code)
            if member is None:
                return None
            joined = member.joining(chosen, self.vault.clock())
            self._keep(joined)
        return joined

    def assign(self, member: str, role: Role) -> Member:
        with self.vault.held():
            assigned = replace(self.required(member), role=role)
            self._keep(assigned)
        return assigned

    def share(self, member: str, environments: tuple[str, ...]) -> Member:
        with self.vault.held():
            shared = replace(self.required(member), environments=environments)
            self._keep(shared)
        return shared

    def depart(self, member: str, how: Departure) -> Member:
        with self.vault.held():
            departed = self.required(member).departing(how, self.vault.clock())
            self._keep(departed)
        return departed

    def required(self, member: str) -> Member:
        """The present member with this id; refused when there is none."""
        found = self.present(member)
        if found is None:
            raise Refused(f"there is no member {member}")
        return found

    def _keep(self, member: Member) -> None:
        self.vault.write(MEMBERS, {**self.vault.read(MEMBERS), member.id: member.kept()})
