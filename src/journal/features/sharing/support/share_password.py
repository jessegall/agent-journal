import hashlib
import hmac
import secrets

HASH_ROUNDS = 200_000


class SharePassword:
    """A link's password, kept only as a salted hash, and checked against what a visitor sends."""

    @staticmethod
    def hashed(password: str) -> str:
        salt = secrets.token_hex(16)
        return f"{salt}${hashlib.pbkdf2_hmac('sha256', password.encode(), bytes.fromhex(salt), HASH_ROUNDS).hex()}"

    @staticmethod
    def matches(password: str, kept: str) -> bool:
        salt, _, digest = kept.partition("$")
        return hmac.compare_digest(hashlib.pbkdf2_hmac("sha256", password.encode(), bytes.fromhex(salt), HASH_ROUNDS).hex(), digest)
