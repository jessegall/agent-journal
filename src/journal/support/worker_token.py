import hashlib
import hmac
import secrets
from dataclasses import dataclass

TOKEN_BYTES = 32


@dataclass(frozen=True)
class WorkerToken:
    """The secret a worker's run carries to prove who it is: made new for each run, only its hash kept on the worker's row."""

    text: str

    @classmethod
    def random(cls) -> "WorkerToken":
        return cls(secrets.token_urlsafe(TOKEN_BYTES))

    @staticmethod
    def hashed(text: str) -> str:
        return hashlib.sha256(text.encode()).hexdigest()

    def digest(self) -> str:
        return self.hashed(self.text)

    @classmethod
    def is_proof(cls, text: str, digest: str) -> bool:
        return bool(text) and bool(digest) and hmac.compare_digest(cls.hashed(text), digest)
