import hashlib
import hmac
import secrets

HASH_ROUNDS = 200_000
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
