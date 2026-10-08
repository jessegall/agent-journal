import secrets
from dataclasses import asdict, dataclass, field, replace

from engine.fields import Loaded
from features.hosted_journal.owner import KeptCode, KeptPassword
from features.hosted_journal.vault import Vault
from features.trigger import DAY
from resources.base import Refused

MEMBERS = "members.json"
INVITE_DAYS = 7
NAME_LONGEST = 60


@dataclass(frozen=True)
class Member(Loaded):
    """A person the owner invited, known by an id that never changes, with the password they chose on joining."""

    id: str = ""
    name: str = ""
    invited: float = 0.0
    joined: float = 0.0
    code: KeptCode = field(default_factory=KeptCode)
    password: KeptPassword = field(default_factory=KeptPassword)

    def has_joined(self) -> bool:
        return bool(self.joined)

    def joining(self, password: KeptPassword, now: float) -> "Member":
        return replace(self, password=password, code=KeptCode(), joined=now)

    def kept(self) -> dict:
        return {key: value for key, value in asdict(self).items() if key != "id"}

    def summary(self) -> dict:
        return {"id": self.id, "name": self.name, "invited": self.invited, "joined": self.joined}


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

    def invite(self, name: str) -> Invite:
        named = " ".join(name.split())[:NAME_LONGEST]
        if not named:
            raise Refused("a member needs a name")
        code = secrets.token_urlsafe(16)
        with self.vault.held():
            if self.named(named) is not None:
                raise Refused(f"{named} is already a member")
            now = self.vault.clock()
            member = Member(f"m-{secrets.token_hex(6)}", named, now, code=KeptCode.made(code, now + INVITE_DAYS * DAY))
            self._keep(member)
        return Invite(member, code)

    def invited_by(self, code: str) -> Member | None:
        now = self.vault.clock()
        return next((member for member in self.all() if not member.has_joined() and member.code.matches(code, now)), None)

    def found(self, member: str) -> Member | None:
        return next((kept for kept in self.all() if kept.id == member), None)

    def named(self, name: str) -> Member | None:
        wanted = " ".join(name.split()).casefold()
        return next((member for member in self.all() if member.name.casefold() == wanted), None)

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

    def _keep(self, member: Member) -> None:
        self.vault.write(MEMBERS, {**self.vault.read(MEMBERS), member.id: member.kept()})
