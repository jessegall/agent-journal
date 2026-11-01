import hashlib
import hmac
import secrets

SALT_BYTES = 16
COST = 2 ** 14
BLOCK_SIZE = 8
PARALLEL_COUNT = 1


class SharePassword:
    """The digest a link's password is kept by, salted and slow to guess, and the check against it."""

    @classmethod
    def digest(cls, password: str) -> str:
        salt = secrets.token_hex(SALT_BYTES)
        return f"{salt}:{cls.hashed(password, salt)}"

    @classmethod
    def matches(cls, password: str, digest: str) -> bool:
        salt, _, kept = digest.partition(":")
        return hmac.compare_digest(cls.hashed(password, salt), kept)

    @staticmethod
    def hashed(password: str, salt: str) -> str:
        return hashlib.scrypt(password.encode(), salt=salt.encode(), n=COST, r=BLOCK_SIZE, p=PARALLEL_COUNT).hex()
