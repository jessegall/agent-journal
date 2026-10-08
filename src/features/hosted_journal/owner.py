import hashlib
import hmac
import secrets
from dataclasses import asdict, dataclass
from enum import Enum

from engine.fields import Loaded
from features.hosted_journal.vault import Vault
from features.trigger import DAY, MINUTE
from resources.base import Refused

PASSWORD = "owner.json"
SETUP = "setup.json"
LOGINS = "logins.json"
TRIES = "tries.json"
DEVICE_KEY = "device.json"
SHORTEST = 12
COST = 2 ** 17
EARLIER_COST = 2 ** 15
MEMORY = 256 * 1024 * 1024
SETUP_DAYS = 1
MOST_TRIES = 5
MOST_EVERYWHERE = 50
LOCKED_FOR = 15 * MINUTE
OWNER = "owner"


def hashed(secret: str) -> str:
    return hashlib.sha256(secret.encode()).hexdigest()


def stretched(password: str, salt: bytes, cost: int) -> str:
    return hashlib.scrypt(password.encode(), salt=salt, n=cost, r=8, p=1, maxmem=MEMORY).hex()


@dataclass(frozen=True)
class KeptPassword(Loaded):
    salt: str = ""
    hash: str = ""
    cost: int = EARLIER_COST

    @classmethod
    def made(cls, password: str) -> "KeptPassword":
        if len(password) < SHORTEST:
            raise Refused(f"the password needs at least {SHORTEST} characters")
        salt = secrets.token_bytes(16)
        return cls(salt.hex(), stretched(password, salt, COST), COST)

    def matches(self, given: str) -> bool:
        return bool(self.hash) and hmac.compare_digest(self.hash, stretched(given, bytes.fromhex(self.salt), self.cost))


@dataclass(frozen=True)
class KeptCode(Loaded):
    hash: str = ""
    until: float = 0.0

    @classmethod
    def made(cls, code: str, until: float) -> "KeptCode":
        return cls(hashed(code), until)

    def matches(self, given: str, now: float) -> bool:
        return bool(self.hash) and self.until > now and hmac.compare_digest(self.hash, hashed(given.strip()))


class Owner:
    """The owner's one password, and the one-time code that sets it the first time."""

    def __init__(self, vault: Vault) -> None:
        self.vault = vault

    def has_password(self) -> bool:
        return bool(KeptPassword.from_json(self.vault.read(PASSWORD)).hash)

    def matches(self, given: str) -> bool:
        return KeptPassword.from_json(self.vault.read(PASSWORD)).matches(given)

    def set_password(self, password: str) -> None:
        self.vault.write(PASSWORD, asdict(KeptPassword.made(password)))
        self.vault.remove(SETUP)

    def forget_password(self) -> None:
        self.vault.remove(PASSWORD)

    def make_setup_code(self) -> str:
        code = secrets.token_urlsafe(9)
        self.vault.write(SETUP, asdict(KeptCode.made(code, self.vault.clock() + SETUP_DAYS * DAY)))
        return code

    def setup_code_matches(self, given: str) -> bool:
        return KeptCode.from_json(self.vault.read(SETUP)).matches(given, self.vault.clock())


class Standing(Enum):
    OPEN = "open"
    RAN_OUT = "ran out"
    UNKNOWN = "unknown"


@dataclass(frozen=True)
class KeptLogin(Loaded):
    """A browser's login: when it was made and runs out, the browser it came from, and whose it is."""

    made: float = 0.0
    until: float = 0.0
    device: str = ""
    member: str = OWNER

    def standing(self, now: float) -> Standing:
        return Standing.OPEN if self.until > now else Standing.RAN_OUT

    def is_owners(self) -> bool:
        return self.member == OWNER


class Logins:
    """The browsers logged in as the owner or a member, each by a token kept only as its hash."""

    def __init__(self, vault: Vault) -> None:
        self.vault = vault

    def open(self, days: int, device: str, member: str) -> str:
        token = secrets.token_urlsafe(32)
        with self.vault.held():
            now = self.vault.clock()
            kept = {key: login for key, login in self.vault.read(LOGINS).items() if KeptLogin.from_json(login).until > now}
            opened = KeptLogin(now, now + days * DAY, device[:120], member)
            self.vault.write(LOGINS, {**kept, hashed(token): asdict(opened)})
        return token

    def found(self, token: str) -> KeptLogin | None:
        kept = self.vault.read(LOGINS).get(hashed(token)) if token else None
        return None if kept is None else KeptLogin.from_json(kept)

    def standing(self, token: str) -> Standing:
        login = self.found(token)
        return Standing.UNKNOWN if login is None else login.standing(self.vault.clock())

    def close(self, token: str) -> None:
        with self.vault.held():
            kept = self.vault.read(LOGINS)
            kept.pop(hashed(token), None)
            self.vault.write(LOGINS, kept)

    def close_member(self, member: str) -> int:
        with self.vault.held():
            kept = self.vault.read(LOGINS)
            theirs = [key for key, login in kept.items() if KeptLogin.from_json(login).member == member]
            self.vault.write(LOGINS, {key: login for key, login in kept.items() if key not in theirs})
        return len(theirs)

    def close_all(self) -> int:
        with self.vault.held():
            count = len(self.vault.read(LOGINS))
            self.vault.write(LOGINS, {})
        return count


class WrongTries:
    """Wrong passwords and codes per place they come from, kept on disk so a restart forgets none."""

    def __init__(self, vault: Vault) -> None:
        self.vault = vault

    def recent(self, place: str) -> list[float]:
        since = self.vault.clock() - LOCKED_FOR
        return [at for at in self.vault.read(TRIES).get(place, []) if at > since]

    def locked_for(self, place: str, ceiling: float = MOST_EVERYWHERE) -> float:
        """Seconds until this place may try again, or every place under the ceiling once that many wrong tries came from all together; zero while it may."""
        now = self.vault.clock()
        everywhere = sorted(at for ats in self.vault.read(TRIES).values() for at in ats if at > now - LOCKED_FOR)
        recent = self.recent(place)
        starts = []
        if len(recent) >= MOST_TRIES:
            starts.append(recent[0])
        if len(everywhere) >= ceiling:
            starts.append(everywhere[-MOST_EVERYWHERE])
        return max((at + LOCKED_FOR - now for at in starts), default=0.0)

    def counted(self, place: str, ceiling: float = MOST_EVERYWHERE) -> float:
        """Counts a try before its password is checked, so guesses sent at once cannot slip past the limit; answers the seconds to wait when it is refused."""
        with self.vault.held():
            if wait := self.locked_for(place, ceiling):
                return wait
            since = self.vault.clock() - LOCKED_FOR
            kept = {key: [at for at in ats if at > since] for key, ats in self.vault.read(TRIES).items()}
            self.vault.write(TRIES, {**{key: ats for key, ats in kept.items() if ats}, place: [*self.recent(place), self.vault.clock()]})
        return 0.0

    def forget(self, place: str) -> None:
        with self.vault.held():
            kept = self.vault.read(TRIES)
            kept.pop(place, None)
            self.vault.write(TRIES, kept)

    def clear(self) -> int:
        with self.vault.held():
            count = sum(len(ats) for ats in self.vault.read(TRIES).values())
            self.vault.write(TRIES, {})
        return count


class Devices:
    """Browsers that logged in here before, known by a cookie only this server can sign, so a flood of wrong tries elsewhere never locks them out."""

    def __init__(self, vault: Vault) -> None:
        self.vault = vault

    def signed(self, device: str) -> str:
        with self.vault.held():
            kept = self.vault.read(DEVICE_KEY)
            if not kept.get("key"):
                kept = {"key": secrets.token_hex(32)}
                self.vault.write(DEVICE_KEY, kept)
        return hmac.new(bytes.fromhex(kept["key"]), device.encode(), hashlib.sha256).hexdigest()

    def issue(self) -> str:
        device = secrets.token_urlsafe(16)
        return f"{device}.{self.signed(device)}"

    def known(self, cookie: str) -> str | None:
        device, _, signature = cookie.partition(".")
        return device if device and signature and hmac.compare_digest(signature, self.signed(device)) else None
