import base64
import hashlib
import json
import secrets
from dataclasses import dataclass
from urllib.parse import urlsplit

from core.modules.phone.support.p256 import COORDINATE_BYTES, G, N, P256

TOKEN_LIFETIME_SECONDS = 12 * 3600


@dataclass(frozen=True)
class PushKeys:
    """The journal's own VAPID key pair: the secret number it signs with, whose public point a push service learns
    from each push, so it knows the pushes come from the journal the phone subscribed to."""

    secret: int

    @classmethod
    def made(cls) -> "PushKeys":
        return cls(secrets.randbelow(N - 1) + 1)

    @classmethod
    def stored(cls, text: str) -> "PushKeys":
        return cls(int(text, 16))

    @property
    def text(self) -> str:
        return format(self.secret, "x")

    @property
    def public(self) -> bytes:
        x, y = P256.finite_product(self.secret, G)
        return b"\x04" + x.to_bytes(COORDINATE_BYTES, "big") + y.to_bytes(COORDINATE_BYTES, "big")

    @property
    def public_text(self) -> str:
        return self.unpadded(self.public)

    def signed(self, message: bytes) -> bytes:
        digest = int.from_bytes(hashlib.sha256(message).digest(), "big")
        while True:
            nonce = secrets.randbelow(N - 1) + 1
            r = P256.finite_product(nonce, G)[0] % N
            s = pow(nonce, -1, N) * (digest + r * self.secret) % N
            if r and s:
                return r.to_bytes(COORDINATE_BYTES, "big") + s.to_bytes(COORDINATE_BYTES, "big")

    def token(self, endpoint: str, contact: str, time: float) -> str:
        parts = urlsplit(endpoint)
        head = self.unpadded(json.dumps({"typ": "JWT", "alg": "ES256"}).encode())
        claims = self.unpadded(json.dumps({"aud": f"{parts.scheme}://{parts.netloc}", "exp": int(time + TOKEN_LIFETIME_SECONDS), "sub": contact}).encode())
        message = f"{head}.{claims}"
        return f"{message}.{self.unpadded(self.signed(message.encode()))}"

    @staticmethod
    def unpadded(raw: bytes) -> str:
        return base64.urlsafe_b64encode(raw).rstrip(b"=").decode()
