import hashlib
import hmac
import secrets
import threading
import time

HASH_ROUNDS = 200_000
MOST_WRONG = 5
LOCKED_FOR = 15 * 60
UNLOCKED: dict[int, str] = {}


def hashed(password: str) -> str:
    salt = secrets.token_hex(16)
    return f"{salt}${hashlib.pbkdf2_hmac('sha256', password.encode(), bytes.fromhex(salt), HASH_ROUNDS).hex()}"


def matches(password: str, kept: str) -> bool:
    salt, _, digest = kept.partition("$")
    return hmac.compare_digest(hashlib.pbkdf2_hmac("sha256", password.encode(), bytes.fromhex(salt), HASH_ROUNDS).hex(), digest)


def unlocked(share, password: str) -> bool:
    if not share.password:
        return True
    known = UNLOCKED.get(share.n)
    if known and hmac.compare_digest(known, password):
        return True
    if not matches(password, share.password):
        return False
    UNLOCKED[share.n] = password
    return True


class WrongPasswords:
    """Wrong passwords sent to shared links, counted per place they come from, so a link's password cannot be guessed without limit."""

    def __init__(self, clock=time.time) -> None:
        self.clock = clock
        self.lock = threading.Lock()
        self.tries: dict[str, list[float]] = {}

    def recent(self, place: str) -> list[float]:
        since = self.clock() - LOCKED_FOR
        return [at for at in self.tries.get(place, []) if at > since]

    def locked(self, place: str) -> bool:
        with self.lock:
            return len(self.recent(place)) >= MOST_WRONG

    def count(self, place: str) -> None:
        with self.lock:
            self.tries[place] = [*self.recent(place), self.clock()]
