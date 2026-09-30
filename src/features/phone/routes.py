import json
from dataclasses import dataclass
from http.cookies import SimpleCookie

from engine.record import Record
from features.phone.controller import Phones
from features.sharing.page import unshared
from features.sharing.server import APP_DIR, APP_HEADERS, BODY_LIMIT
from resources.base import SYSTEM, Refused

APP_PAGE = "phone.html"
COOKIE = "__Host-phone"
HEADER = "X-Phone"
LOCAL = ("127.0.0.1", "localhost")


@dataclass(frozen=True)
class Pairing:
    code: str
    device: str

    @classmethod
    def from_payload(cls, given: dict) -> "Pairing":
        return cls(code=str(given.get("code", "")), device=str(given.get("device", "")))


@dataclass(frozen=True)
class Said:
    brief: str
    idempotency: str
    about: str

    @classmethod
    def from_payload(cls, given: dict) -> "Said":
        return cls(brief=str(given.get("brief", "")), idempotency=str(given.get("idempotency", "")), about=str(given.get("about", "")))


def local(host: str) -> bool:
    return host.split(":", 1)[0] in LOCAL


class PhoneRoutes:
    def get(self, handler, rest: list[str]) -> None:
        if rest[:1] == ["assets"] and len(rest) == 2:
            return handler.asset(rest[1])
        if rest == ["state"]:
            phone = self.phone(handler)
            if phone is None:
                return None
            return self.json(handler, 200, {"phone": phone.title, "n": phone.n, "environment": phone.environment, "expires": phone.expires})
        page = APP_DIR / APP_PAGE
        if rest or not page.is_file():
            return handler.page(404, unshared())
        if not handler.path.split("?", 1)[0].endswith("/"):
            return handler.send(301, b"", {"Location": "/p/"})
        return handler.send(200, page.read_bytes(), {"Content-Type": "text/html; charset=utf-8", **APP_HEADERS})

    def post(self, handler, rest: list[str]) -> None:
        if not self.trusted(handler):
            return handler.answer(403, "refused")
        body = self.body(handler)
        if body is None:
            return handler.answer(413, "too large")
        if rest == ["pair"]:
            return self.pair(handler, Pairing.from_payload(body))
        phone = self.phone(handler)
        if phone is None:
            return None
        if rest == ["message"]:
            try:
                made = self.phones(handler)._say(phone, Said.from_payload(body))
            except Refused as refused:
                return handler.answer(422, str(refused))
            return self.json(handler, 201, {"n": made.n})
        return handler.answer(404, "no such action")

    def pair(self, handler, pairing: Pairing) -> None:
        paired = self.phones(handler)._pair(pairing.code, pairing.device)
        if paired is None:
            return handler.answer(410, "this code was used or has run out: make a new one on your computer")
        phone, key = paired
        cookie = f"{COOKIE}={key}; Max-Age={int(phone.days * 86400)}; Path=/; Secure; HttpOnly; SameSite=Strict"
        return self.json(handler, 200, {"phone": phone.title, "environment": phone.environment, "expires": phone.expires}, {"Set-Cookie": cookie})

    def phone(self, handler):
        kept = SimpleCookie(handler.headers.get("Cookie", "")).get(COOKIE)
        phone = self.phones(handler)._by_key(kept.value if kept else "")
        if phone is None:
            handler.answer(401, "this phone is not connected")
            return None
        if not phone.connected:
            handler.answer(410, "this phone was disconnected" if phone.completed else "this phone's connection has run out")
            return None
        return phone

    def trusted(self, handler) -> bool:
        host = handler.headers.get("Host", "")
        origin = f"{'http' if local(host) else 'https'}://{host}"
        return (handler.headers.get("Origin") == origin and handler.headers.get(HEADER) == "1"
                and handler.headers.get("Content-Type", "").startswith("application/json"))

    def body(self, handler) -> dict | None:
        length = handler.headers.get("Content-Length", "")
        size = int(length) if length.isdigit() else 0
        if not 0 < size <= BODY_LIMIT:
            return None
        try:
            given = json.loads(handler.rfile.read(size))
        except ValueError:
            return {}
        return given if isinstance(given, dict) else {}

    def phones(self, handler) -> Phones:
        return Phones(Record(handler.shares.record.root, handler.shares.record.env), actor=SYSTEM)

    def json(self, handler, code: int, body: dict, headers: dict | None = None) -> None:
        handler.send(code, json.dumps(body).encode(), {"Content-Type": "application/json", **APP_HEADERS, **(headers or {})})
