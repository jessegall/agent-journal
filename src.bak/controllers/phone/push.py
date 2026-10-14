import base64
import hashlib
import json
import secrets
import time
import urllib.error
import urllib.request
from dataclasses import dataclass
from pathlib import Path
from urllib.parse import urlsplit

from engine.stored import read_json, write_json

P = 0xFFFFFFFF00000001000000000000000000000000FFFFFFFFFFFFFFFFFFFFFFFF
A = P - 3
B = 0x5AC635D8AA3A93E7B3EBBD55769886BC651D06B0CC53B0F63BCE3C3E27D2604B
N = 0xFFFFFFFF00000000FFFFFFFFFFFFFFFFBCE6FAADA7179E84F3B9CAC2FC632551
G = (0x6B17D1F2E12C4247F8BCE6E563A440F277037D812DEB33A0F4A13945D898C296, 0x4FE342E2FE1A7F9B8EE7EB4A7C0F9E162BCE33576B315ECECBB6406837BF51F5)
KEYS_FILE = "phone-push.json"
SERVICES = ("web.push.apple.com", "fcm.googleapis.com", "updates.push.services.mozilla.com")
WINDOWS = ".notify.windows.com"
VALID_FOR = 12 * 3600
SEND_SECONDS = 10


def added(one: tuple | None, other: tuple | None) -> tuple | None:
    if one is None:
        return other
    if other is None:
        return one
    if one[0] == other[0] and (one[1] + other[1]) % P == 0:
        return None
    if one == other:
        slope = (3 * one[0] * one[0] + A) * pow(2 * one[1], -1, P) % P
    else:
        slope = (other[1] - one[1]) * pow(other[0] - one[0], -1, P) % P
    x = (slope * slope - one[0] - other[0]) % P
    return x, (slope * (one[0] - x) - one[1]) % P


def times(scalar: int, point: tuple) -> tuple | None:
    found = None
    while scalar:
        if scalar & 1:
            found = added(found, point)
        point = added(point, point)
        scalar >>= 1
    return found


def unpadded(raw: bytes) -> str:
    return base64.urlsafe_b64encode(raw).rstrip(b"=").decode()


@dataclass(frozen=True)
class Keys:
    secret: int

    @classmethod
    def made(cls) -> "Keys":
        return cls(secrets.randbelow(N - 1) + 1)

    @classmethod
    def kept(cls, root: Path) -> "Keys":
        where = root / KEYS_FILE
        found = read_json(where, dict, {})
        if isinstance(found.get("secret"), str):
            return cls(int(found["secret"], 16))
        keys = cls.made()
        write_json(where, {"secret": format(keys.secret, "x")})
        where.chmod(0o600)
        return keys

    @property
    def public(self) -> bytes:
        x, y = times(self.secret, G)
        return b"\x04" + x.to_bytes(32, "big") + y.to_bytes(32, "big")

    def signed(self, message: bytes) -> bytes:
        digest = int.from_bytes(hashlib.sha256(message).digest(), "big")
        while True:
            k = secrets.randbelow(N - 1) + 1
            r = times(k, G)[0] % N
            s = pow(k, -1, N) * (digest + r * self.secret) % N
            if r and s:
                return r.to_bytes(32, "big") + s.to_bytes(32, "big")

    def token(self, endpoint: str, contact: str, now: float) -> str:
        parts = urlsplit(endpoint)
        head = unpadded(json.dumps({"typ": "JWT", "alg": "ES256"}).encode())
        claims = unpadded(json.dumps({"aud": f"{parts.scheme}://{parts.netloc}", "exp": int(now + VALID_FOR), "sub": contact}).encode())
        signed = f"{head}.{claims}"
        return f"{signed}.{unpadded(self.signed(signed.encode()))}"


def on_curve(public: bytes) -> bool:
    """Whether an uncompressed public key is a point of P-256."""
    if len(public) != 65 or public[0] != 4:
        return False
    x, y = int.from_bytes(public[1:33], "big"), int.from_bytes(public[33:], "big")
    return x < P and y < P and (y * y - x * x * x - A * x - B) % P == 0


def verified(public: bytes, message: bytes, signature: bytes) -> bool:
    r, s = int.from_bytes(signature[:32], "big"), int.from_bytes(signature[32:], "big")
    if not on_curve(public) or len(signature) != 64 or not (0 < r < N and 0 < s < N):
        return False
    point = (int.from_bytes(public[1:33], "big"), int.from_bytes(public[33:], "big"))
    digest = int.from_bytes(hashlib.sha256(message).digest(), "big")
    inverse = pow(s, -1, N)
    found = added(times(digest * inverse % N, G), times(r * inverse % N, point))
    return found is not None and found[0] % N == r


def allowed(endpoint: str) -> bool:
    parts = urlsplit(endpoint)
    host = parts.hostname or ""
    return parts.scheme == "https" and (host in SERVICES or host.endswith(WINDOWS))


def send(keys: Keys, endpoint: str, contact: str) -> bool:
    if not allowed(endpoint):
        return False
    headers = {"Authorization": f"vapid t={keys.token(endpoint, contact, time.time())}, k={unpadded(keys.public)}", "TTL": "3600",
               "Urgency": "high", "Content-Length": "0"}
    try:
        with urllib.request.urlopen(urllib.request.Request(endpoint, data=b"", headers=headers, method="POST"), timeout=SEND_SECONDS) as answer:
            return answer.status < 300
    except (urllib.error.URLError, OSError):
        return False
