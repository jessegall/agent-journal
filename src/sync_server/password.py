import hashlib
import hmac
import secrets

HASH_ROUNDS = 200_000


class Password:
    """A password kept only as a salted PBKDF2 hash, and checked against what someone sends; the team server and the journal's share links both use it."""

    @staticmethod
    def hashed(password: str) -> str:
        salt = secrets.token_hex(16)
        return f"{salt}${hashlib.pbkdf2_hmac('sha256', password.encode(), bytes.fromhex(salt), HASH_ROUNDS).hex()}"

    @staticmethod
    def matches(password: str, stored: str) -> bool:
        salt, _, digest = stored.partition("$")
        return hmac.compare_digest(hashlib.pbkdf2_hmac("sha256", password.encode(), bytes.fromhex(salt), HASH_ROUNDS).hex(), digest)
