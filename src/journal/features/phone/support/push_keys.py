import base64
import hashlib
import json
import os
import secrets
from dataclasses import dataclass
from pathlib import Path
from urllib.parse import urlsplit

from journal.features.phone.support.p256 import G, N, P256
from journal.support.private_folder import PrivateFolder

VALID_FOR = 12 * 3600


@dataclass(frozen=True)
class PushKeys:
    """The journal's own VAPID key pair, made once and kept in a file only its owner reads: it signs the token each push carries, so the push service knows the pushes come from the same journal the phone subscribed to."""

    secret: int

    @classmethod
    def kept(cls, path: Path) -> "PushKeys":
        if path.is_file():
            return cls(int(json.loads(path.read_text())["secret"], 16))
        keys = cls(secrets.randbelow(N - 1) + 1)
        PrivateFolder.made(path.parent)
        with os.fdopen(os.open(path, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600), "w") as kept:
            kept.write(json.dumps({"secret": format(keys.secret, "x")}))
        return keys

    @property
    def public(self) -> bytes:
        x, y = P256.times(self.secret, G)
        return b"\x04" + x.to_bytes(32, "big") + y.to_bytes(32, "big")

    def signed(self, message: bytes) -> bytes:
        digest = int.from_bytes(hashlib.sha256(message).digest(), "big")
        while True:
            k = secrets.randbelow(N - 1) + 1
            r = P256.times(k, G)[0] % N
            s = pow(k, -1, N) * (digest + r * self.secret) % N
            if r and s:
                return r.to_bytes(32, "big") + s.to_bytes(32, "big")

    def token(self, endpoint: str, contact: str, time: float) -> str:
        parts = urlsplit(endpoint)
        head = self.unpadded(json.dumps({"typ": "JWT", "alg": "ES256"}).encode())
        claims = self.unpadded(json.dumps({"aud": f"{parts.scheme}://{parts.netloc}", "exp": int(time + VALID_FOR), "sub": contact}).encode())
        signed = f"{head}.{claims}"
        return f"{signed}.{self.unpadded(self.signed(signed.encode()))}"

    @staticmethod
    def unpadded(raw: bytes) -> str:
        return base64.urlsafe_b64encode(raw).rstrip(b"=").decode()
