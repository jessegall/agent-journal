import hashlib
import hmac
import secrets
from dataclasses import dataclass
from enum import Enum

from engine.fields import Loaded
from features.hosted_journal.vault import Vault
from features.trigger import DAY, MINUTE
from resources.base import Refused

PASSWORD = "owner.json"
SETUP = "setup.json"
LOGINS = "logins.json"
TRIES = "tries.json"
SHORTEST = 12
COST = {"n": 2 ** 15, "r": 8, "p": 1}
MEMORY = 64 * 1024 * 1024
SETUP_DAYS = 1
MOST_TRIES = 5
LOCKED_FOR = 15 * MINUTE


def hashed(secret: str) -> str:
    return hashlib.sha256(secret.encode()).hexdigest()


def stretched(password: str, salt: bytes) -> str:
    return hashlib.scrypt(password.encode(), salt=salt, maxmem=MEMORY, **COST).hex()


@dataclass(frozen=True)
class KeptPassword(Loaded):
    salt: str = ""
    hash: str = ""


@dataclass(frozen=True)
class KeptCode(Loaded):
    hash: str = ""
    until: float = 0.0


class Owner:
    """The owner's one password, and the one-time code that sets it the first time."""

    def __init__(self, vault: Vault) -> None:
        self.vault = vault

    def has_password(self) -> bool:
        return bool(KeptPassword.from_json(self.vault.read(PASSWORD)).hash)

    def matches(self, given: str) -> bool:
        kept = KeptPassword.from_json(self.vault.read(PASSWORD))
        return bool(kept.hash) and hmac.compare_digest(kept.hash, stretched(given, bytes.fromhex(kept.salt)))

    def set_password(self, password: str) -> None:
        if len(password) < SHORTEST:
            raise Refused(f"the password needs at least {SHORTEST} characters")
        salt = secrets.token_bytes(16)
        self.vault.write(PASSWORD, {"salt": salt.hex(), "hash": stretched(password, salt)})
        self.vault.remove(SETUP)

    def forget_password(self) -> None:
        self.vault.remove(PASSWORD)

    def make_setup_code(self) -> str:
        code = secrets.token_urlsafe(9)
        self.vault.write(SETUP, {"hash": hashed(code), "until": self.vault.clock() + SETUP_DAYS * DAY})
        return code

    def setup_code_matches(self, given: str) -> bool:
        kept = KeptCode.from_json(self.vault.read(SETUP))
        return bool(kept.hash) and kept.until > self.vault.clock() and hmac.compare_digest(kept.hash, hashed(given.strip()))


class Standing(Enum):
    OPEN = "open"
    RAN_OUT = "ran out"
    UNKNOWN = "unknown"


@dataclass(frozen=True)
class KeptLogin(Loaded):
    made: float = 0.0
    until: float = 0.0
    device: str = ""


class Logins:
    """The browsers logged in as the owner, each by a token kept only as its hash."""

    def __init__(self, vault: Vault) -> None:
        self.vault = vault

    def open(self, days: int, device: str) -> str:
        token = secrets.token_urlsafe(32)
        with self.vault.held():
            now = self.vault.clock()
            kept = {key: login for key, login in self.vault.read(LOGINS).items() if KeptLogin.from_json(login).until > now}
            self.vault.write(LOGINS, {**kept, hashed(token): {"made": now, "until": now + days * DAY, "device": device[:120]}})
        return token

    def standing(self, token: str) -> Standing:
        found = self.vault.read(LOGINS).get(hashed(token)) if token else None
        if found is None:
            return Standing.UNKNOWN
        return Standing.OPEN if KeptLogin.from_json(found).until > self.vault.clock() else Standing.RAN_OUT

    def close(self, token: str) -> None:
        with self.vault.held():
            kept = self.vault.read(LOGINS)
            kept.pop(hashed(token), None)
            self.vault.write(LOGINS, kept)

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

    def locked_for(self, place: str) -> float:
        """Seconds until this place may try again; zero while it may."""
        recent = self.recent(place)
        return max(0.0, recent[0] + LOCKED_FOR - self.vault.clock()) if len(recent) >= MOST_TRIES else 0.0

    def counted(self, place: str) -> float:
        """Counts a try before its password is checked, so guesses sent at once cannot slip past the limit; answers the seconds to wait when it is refused."""
        with self.vault.held():
            if wait := self.locked_for(place):
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
