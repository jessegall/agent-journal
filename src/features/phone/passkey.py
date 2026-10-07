import base64
import binascii
import hashlib
import hmac
import json
from dataclasses import dataclass, field, replace
from typing import TypedDict

from engine.fields import Loaded
from features.phone.push import N, on_curve, verified
from resources.base import Refused

CREATE = "webauthn.create"
GET = "webauthn.get"
PRESENT, VERIFIED, ATTESTED = 0x01, 0x04, 0x40
ES256 = -7
EC2 = 2
P256 = 1
DEEPEST = 8
ASK_MS = 60000
CREDENTIAL = {"type": "public-key", "alg": ES256}


class Unverified(Refused):
    @classmethod
    def because(cls, what: str) -> "Unverified":
        return cls(f"Face ID or the passcode did not unlock this phone, so nothing ran: {what}")


def encoded(raw: bytes) -> str:
    return base64.urlsafe_b64encode(raw).rstrip(b"=").decode()


def decoded(text: str) -> bytes:
    try:
        return base64.urlsafe_b64decode(text + "=" * (-len(text) % 4))
    except (binascii.Error, ValueError) as error:
        raise Unverified.because("the phone's answer is not readable") from error


def requested(method: str, path: str, body: bytes) -> str:
    """The digest naming one request exactly: its method, its path with the query, and its body."""
    return hashlib.sha256(f"{method} {path}\n".encode() + body).hexdigest()


class Cbor:
    """A reader for the little CBOR an authenticator writes: numbers, strings, arrays, maps and the three simple values."""

    SIMPLE = {20: False, 21: True, 22: None}

    def __init__(self, raw: bytes) -> None:
        self.raw = raw
        self.at = 0

    def take(self, size: int) -> bytes:
        if self.at + size > len(self.raw):
            raise Unverified.because("the authenticator's answer is cut short")
        part = self.raw[self.at:self.at + size]
        self.at += size
        return part

    def size(self, extra: int) -> int:
        if extra < 24:
            return extra
        if extra > 27:
            raise Unverified.because("the authenticator's answer has a length it may not use")
        return int.from_bytes(self.take(1 << (extra - 24)), "big")

    def item(self, depth: int = 0):
        if depth > DEEPEST:
            raise Unverified.because("the authenticator's answer nests too deep")
        head = self.take(1)[0]
        major, extra = head >> 5, head & 0x1F
        if major == 7:
            if extra not in self.SIMPLE:
                raise Unverified.because("the authenticator's answer holds a value it may not use")
            return self.SIMPLE[extra]
        size = self.size(extra)
        readers = {0: lambda: size, 1: lambda: -1 - size, 2: lambda: self.take(size), 3: lambda: self.text(size),
                   4: lambda: [self.item(depth + 1) for _ in range(size)],
                   5: lambda: self.mapping(size, depth)}
        if major not in readers:
            raise Unverified.because("the authenticator's answer holds a tag or another kind of value it may not use")
        return readers[major]()

    def mapping(self, size: int, depth: int) -> dict:
        found = {}
        for _ in range(size):
            key = self.item(depth + 1)
            if not isinstance(key, (int, str, bytes)):
                raise Unverified.because("the authenticator's answer has a key it may not use")
            found[key] = self.item(depth + 1)
        return found

    def text(self, size: int) -> str:
        try:
            return self.take(size).decode()
        except UnicodeDecodeError as error:
            raise Unverified.because("the authenticator's answer holds broken text") from error


@dataclass(frozen=True)
class Relying:
    """The site a passkey belongs to: its id, and the one origin its answers may come from."""

    id: str
    origin: str

    def hashed(self) -> bytes:
        return hashlib.sha256(self.id.encode()).digest()


class Asked(TypedDict):
    challenge: str
    timeout: int
    userVerification: str


class Creating(Asked):
    rp: dict
    user: dict
    pubKeyCredParams: list
    authenticatorSelection: dict
    attestation: str


class Getting(Asked):
    rpId: str
    allowCredentials: list


@dataclass(frozen=True)
class Challenge(Loaded):
    """A challenge the journal issued to one phone, for a passkey or for one request."""

    value: str
    kind: str
    until: float
    request: str = ""

    def check(self, client: bytes, kind: str, relying: Relying, now: float) -> None:
        if self.kind != kind or self.until < now:
            raise Unverified.because("ask again, the last request has run out")
        try:
            data = json.loads(client)
        except ValueError as error:
            raise Unverified.because("the phone's answer is not readable") from error
        if not isinstance(data, dict) or data.get("type") != kind or data.get("origin") != relying.origin or data.get("crossOrigin") is True:
            raise Unverified.because("the answer came from another page")
        if not hmac.compare_digest(str(data.get("challenge", "")), self.value):
            raise Unverified.because("the answer is for another request")


@dataclass(frozen=True)
class Unlock(Loaded):
    """A one-use unlock the journal issued to one phone: the fingerprint of its secret, the request it opens and until when."""

    key: str = ""
    request: str = ""
    until: float = 0.0

    def fits(self, fingerprint: str) -> bool:
        return bool(self.key) and hmac.compare_digest(self.key, fingerprint)

    def opens(self, request: str, now: float) -> bool:
        return hmac.compare_digest(self.request, request) and self.until > now


@dataclass(frozen=True)
class PendingPasskey(Loaded):
    """A passkey the phone made that is kept only once the user allows it on the computer: the passkey, the notice that asks, and until when."""

    passkey: dict = field(default_factory=dict)
    environment: str = ""
    notice: int = 0
    until: float = 0.0

    def waits(self, now: float) -> bool:
        return bool(self.passkey) and self.until > now


@dataclass(frozen=True)
class Authenticated:
    """The authenticator's own data: which site, whether the user was there and verified, its counter and what follows."""

    site: bytes
    flags: int
    count: int
    rest: bytes

    @classmethod
    def read(cls, raw: bytes) -> "Authenticated":
        if len(raw) < 37:
            raise Unverified.because("the authenticator's answer is cut short")
        return cls(raw[:32], raw[32], int.from_bytes(raw[33:37], "big"), raw[37:])

    def check(self, relying: Relying) -> None:
        if not hmac.compare_digest(self.site, relying.hashed()):
            raise Unverified.because("the passkey belongs to another site")
        if self.flags & (PRESENT | VERIFIED) != PRESENT | VERIFIED:
            raise Unverified.because("Face ID or the passcode was not used")


@dataclass(frozen=True)
class Passkey(Loaded):
    """The passkey a phone made: its credential id, its P-256 public key, the site it belongs to and its counter."""

    id: str = ""
    x: str = ""
    y: str = ""
    site: str = ""
    count: int = 0

    @property
    def public(self) -> bytes:
        return b"\x04" + bytes.fromhex(self.x) + bytes.fromhex(self.y)

    def belongs(self, relying: Relying) -> None:
        if relying.id != self.site:
            raise Unverified.because("this phone's passkey belongs to another address; connect the phone again")

    def asked(self, challenge: Challenge, relying: Relying) -> Getting:
        self.belongs(relying)
        return Getting(challenge=challenge.value, timeout=ASK_MS, userVerification="required", rpId=relying.id,
                       allowCredentials=[{"type": "public-key", "id": self.id}])

    def counted(self, count: int) -> "Passkey":
        if (count or self.count) and count <= self.count:
            raise Unverified.because("the passkey's counter went back, so it may be a copy")
        return replace(self, count=count)


def creating(challenge: Challenge, relying: Relying, user: bytes, name: str) -> Creating:
    return Creating(challenge=challenge.value, timeout=ASK_MS, userVerification="required", rp={"id": relying.id, "name": name},
                    user={"id": encoded(user), "name": name, "displayName": name}, pubKeyCredParams=[CREDENTIAL],
                    authenticatorSelection={"authenticatorAttachment": "platform", "userVerification": "required", "residentKey": "discouraged"},
                    attestation="none")


def signature(raw: bytes) -> bytes:
    """r and s of an ASN.1 DER ECDSA signature, as 64 bytes."""
    if len(raw) < 8 or raw[0] != 0x30 or raw[1] != len(raw) - 2:
        raise Unverified.because("the signature is not readable")
    r, rest = integer(raw[2:])
    s, rest = integer(rest)
    if rest or not (0 < r < N and 0 < s < N):
        raise Unverified.because("the signature is not readable")
    return r.to_bytes(32, "big") + s.to_bytes(32, "big")


def integer(raw: bytes) -> tuple[int, bytes]:
    if len(raw) < 3 or raw[0] != 0x02 or not 0 < raw[1] <= 33 or len(raw) < 2 + raw[1] or raw[2] & 0x80:
        raise Unverified.because("the signature is not readable")
    if raw[1] > 1 and raw[2] == 0 and raw[3] < 0x80:
        raise Unverified.because("the signature pads a number with a zero it does not need")
    return int.from_bytes(raw[2:2 + raw[1]], "big"), raw[2 + raw[1]:]


@dataclass(frozen=True)
class Enrolment(Loaded):
    """What the phone sends back after it made a passkey: the client data and the attestation, both as base64url."""

    client_data: str = ""
    attestation: str = ""

    def passkey(self, challenge: Challenge, relying: Relying, now: float) -> Passkey:
        client = decoded(self.client_data)
        challenge.check(client, CREATE, relying, now)
        attested = Cbor(decoded(self.attestation)).item()
        if not isinstance(attested, dict) or not isinstance(attested.get("authData"), bytes):
            raise Unverified.because("the authenticator's answer is not readable")
        made = Authenticated.read(attested["authData"])
        made.check(relying)
        if not made.flags & ATTESTED or len(made.rest) < 18:
            raise Unverified.because("no passkey came with the answer")
        size = int.from_bytes(made.rest[16:18], "big")
        credential = made.rest[18:18 + size]
        key = Cbor(made.rest[18 + size:]).item()
        if len(credential) != size or not size or not isinstance(key, dict):
            raise Unverified.because("the passkey is not readable")
        if (key.get(1), key.get(3), key.get(-1)) != (EC2, ES256, P256):
            raise Unverified.because("the passkey is not a P-256 key")
        x, y = key.get(-2), key.get(-3)
        if not (isinstance(x, bytes) and isinstance(y, bytes) and len(x) == len(y) == 32 and on_curve(b"\x04" + x + y)):
            raise Unverified.because("the passkey is not a P-256 key")
        return Passkey(encoded(credential), x.hex(), y.hex(), relying.id, made.count)


@dataclass(frozen=True)
class Assertion(Loaded):
    """What the phone sends back after Face ID or the passcode: the credential id, the client and authenticator data, and the signature."""

    id: str = ""
    client_data: str = ""
    authenticator_data: str = ""
    signature: str = ""

    def counted(self, passkey: Passkey, challenge: Challenge, relying: Relying, now: float) -> Passkey:
        """The passkey with its new counter, once the signature over this challenge checks out."""
        if not passkey.id or not hmac.compare_digest(self.id, passkey.id):
            raise Unverified.because("another passkey answered")
        passkey.belongs(relying)
        client = decoded(self.client_data)
        challenge.check(client, GET, relying, now)
        data = decoded(self.authenticator_data)
        made = Authenticated.read(data)
        made.check(relying)
        if not verified(passkey.public, data + hashlib.sha256(client).digest(), signature(decoded(self.signature))):
            raise Unverified.because("the signature does not match this phone's passkey")
        return passkey.counted(made.count)
