import hashlib
import json
import mimetypes
import re
from urllib.parse import parse_qs, quote, urlsplit
from dataclasses import asdict, dataclass
from http.cookies import SimpleCookie

from engine.record import Record
from features.phone.controller import Phones, Stale
from engine.color import identity
from features.sharing.page import PICTURES, unshared
from features.sharing.preview import icon
from features.sharing.server import APP_DIR, APP_HEADERS, BODY_LIMIT
from resources.base import SYSTEM, Refused

APP_PAGE = "phone.html"
WORKER = "sw.js"
WORKER_FILE = "phone-sw.js"
MANIFEST = "manifest.webmanifest"
ICONS = {"icon-180.png": 180, "icon-192.png": 192, "icon-512.png": 512}
PAGE_HEADERS = {**APP_HEADERS, "Content-Security-Policy": APP_HEADERS["Content-Security-Policy"] + "; manifest-src 'self'"}
COOKIE = "__Host-phone"
HEADER = "X-Phone"
UPLOAD_LIMIT = 25 * 1024 * 1024
UPLOADED = "application/octet-stream"
LOCAL = ("127.0.0.1", "localhost")
BUILD = re.compile(r"assets/(phone-[\w-]+\.js)")


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


@dataclass(frozen=True)
class Chosen:
    n: int
    answer: str

    @classmethod
    def from_payload(cls, given: dict) -> "Chosen":
        return cls(n=int(given.get("n", 0)), answer=str(given.get("answer", "")))


@dataclass(frozen=True)
class Reacting:
    n: int
    face: str

    @classmethod
    def from_payload(cls, given: dict) -> "Reacting":
        return cls(n=int(given.get("n", 0)), face=str(given.get("face", "")))


@dataclass(frozen=True)
class Commenting:
    ref: str
    text: str

    @classmethod
    def from_payload(cls, given: dict) -> "Commenting":
        return cls(ref=str(given.get("ref", "")), text=str(given.get("text", "")))


@dataclass(frozen=True)
class Pressing:
    ref: str
    label: str

    @classmethod
    def from_payload(cls, given: dict) -> "Pressing":
        return cls(ref=str(given.get("ref", "")), label=str(given.get("label", "")))


@dataclass(frozen=True)
class Subscribing:
    endpoint: str

    @classmethod
    def from_payload(cls, given: dict) -> "Subscribing":
        return cls(endpoint=str(given.get("endpoint", "")))


@dataclass(frozen=True)
class Arranging:
    cards: list

    @classmethod
    def from_payload(cls, given: dict) -> "Arranging":
        listed = given.get("cards")
        return cls(cards=[str(card) for card in listed] if isinstance(listed, list) else [])


@dataclass(frozen=True)
class Starting:
    journal: str
    environment: str
    agent: str

    @classmethod
    def from_payload(cls, given: dict) -> "Starting":
        return cls(journal=str(given.get("journal", "")), environment=str(given.get("environment", "")), agent=str(given.get("agent", "claude")))


@dataclass(frozen=True)
class Moving:
    journal: str
    environment: str

    @classmethod
    def from_payload(cls, given: dict) -> "Moving":
        return cls(journal=str(given.get("journal", "")), environment=str(given.get("environment", "")))


@dataclass(frozen=True)
class Approval:
    n: int
    updated: float

    @classmethod
    def from_payload(cls, given: dict) -> "Approval":
        return cls(n=int(given.get("n", 0)), updated=float(given.get("updated", 0)))


def built() -> str:
    try:
        found = BUILD.search((APP_DIR / APP_PAGE).read_text())
    except OSError:
        return ""
    return found.group(1) if found else ""


def local(host: str) -> bool:
    return host.split(":", 1)[0] in LOCAL


class PhoneRoutes:
    def get(self, handler, rest: list[str]) -> None:
        if rest[:1] == ["assets"] and len(rest) == 2:
            return handler.asset(rest[1])
        if rest[:1] == ["file"] and len(rest) == 4:
            return self.file(handler, rest)
        if rest == [WORKER]:
            return handler.send(200, (APP_DIR / WORKER_FILE).read_bytes(), {"Content-Type": "text/javascript", "Cache-Control": "no-cache",
                                                                          "Service-Worker-Allowed": "/p/", **APP_HEADERS})
        if rest[:1] in (["state"], ["feed"], ["bar"], ["places"], ["push-key"], ["source"], ["list"], ["row"]):
            return self.read(handler, rest)
        if rest == [MANIFEST]:
            return self.manifest(handler)
        if len(rest) == 1 and rest[0] in ICONS:
            color = identity(handler.shares.record.root)["color"]
            return handler.send(200, icon(color, ICONS[rest[0]]), {"Content-Type": "image/png", "Cache-Control": "public, max-age=86400"})
        page = APP_DIR / APP_PAGE
        if rest or not page.is_file():
            return handler.page(404, unshared())
        if not handler.path.split("?", 1)[0].endswith("/"):
            return handler.send(301, b"", {"Location": "/p/"})
        return handler.packed(200, page.read_bytes(), {"Content-Type": "text/html; charset=utf-8", **PAGE_HEADERS})

    def file(self, handler, rest: list[str]) -> None:
        phone = self.phone(handler)
        if phone is None:
            return None
        try:
            found = self.phones(handler)._file(phone, f"{rest[1]}:{rest[2]}", rest[3])
        except Refused as refused:
            return handler.answer(404, str(refused))
        kind = mimetypes.guess_type(found.name)[0] or "application/octet-stream"
        shown = found.suffix.lower() in PICTURES
        return handler.send(200, found.read_bytes(), {"Content-Type": kind, "Cache-Control": "private, max-age=3600",
                                                      "Content-Disposition": f"{'inline' if shown else 'attachment'}; filename*=UTF-8''{quote(found.name)}"})

    def read(self, handler, rest: list[str]) -> None:
        phone = self.phone(handler)
        if phone is None:
            return None
        if rest == ["list"]:
            kind = parse_qs(urlsplit(handler.path).query).get("type", [""])[0]
            try:
                return self.json(handler, 200, self.phones(handler)._list(phone, kind))
            except Refused as refused:
                return handler.answer(404, str(refused))
        if rest == ["source"]:
            asked = parse_qs(urlsplit(handler.path).query).get("q", [""])[0]
            try:
                return self.json(handler, 200, self.phones(handler)._source(phone, asked))
            except Refused as refused:
                return handler.answer(404, str(refused))
        if rest == ["push-key"]:
            return self.json(handler, 200, {"key": self.phones(handler)._push_key()})
        if rest == ["places"]:
            return self.json(handler, 200, {"places": [asdict(place) for place in self.phones(handler)._places()],
                                            "at": str(self.phones(handler)._home(phone).root.resolve())})
        if rest == ["state"]:
            known = identity(self.phones(handler)._home(phone).root)
            return self.json(handler, 200, {"phone": phone.title, "n": phone.n, "environment": phone.environment, "expires": phone.expires, "home": phone.home,
                                            "project": known["project"], "color": known["color"]})
        if rest == ["feed"]:
            before = parse_qs(urlsplit(handler.path).query).get("before", ["inf"])[0]
            try:
                return self.json(handler, 200, {**self.phones(handler)._feed(phone, float(before)), "build": built()})
            except ValueError:
                return handler.answer(400, "before is a time in seconds")
        if rest == ["bar"]:
            return self.json(handler, 200, self.phones(handler)._bar(phone))
        if len(rest) == 3:
            try:
                return self.json(handler, 200, self.phones(handler)._read(phone, f"{rest[1]}:{rest[2]}"))
            except Refused as refused:
                return handler.answer(404, str(refused))
        return handler.answer(404, "no such page")

    def manifest(self, handler) -> None:
        known = identity(handler.shares.record.root)
        body = {"name": f"{known['project']} journal", "short_name": known["project"], "start_url": "/p/", "scope": "/p/", "display": "standalone",
                "background_color": "#131416", "theme_color": known["color"],
                "icons": [{"src": f"/p/{name}", "sizes": f"{side}x{side}", "type": "image/png"} for name, side in ICONS.items()]}
        return handler.send(200, json.dumps(body).encode(), {"Content-Type": "application/manifest+json", "Cache-Control": "no-store"})

    def post(self, handler, rest: list[str]) -> None:
        if rest[:1] == ["attach"]:
            return self.attach(handler, rest[1:])
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
        acts = {"message": lambda phones: phones._say(phone, Said.from_payload(body)),
                "answer": lambda phones: phones._answer(phone, Chosen.from_payload(body)),
                "dismiss": lambda phones: phones._dismiss(phone, Chosen.from_payload(body).n),
                "react": lambda phones: phones._react(phone, Reacting.from_payload(body)),
                "approve": lambda phones: phones._approve(phone, Approval.from_payload(body)),
                "switch": lambda phones: phones._switch(phone, Moving.from_payload(body)),
                "start": lambda phones: phones._start(phone, Starting.from_payload(body)),
                "arrange": lambda phones: phones._arrange(phone, Arranging.from_payload(body).cards),
                "press": lambda phones: phones._press(phone, Pressing.from_payload(body)),
                "comment": lambda phones: phones._comment(phone, Commenting.from_payload(body)),
                "push": lambda phones: phones._subscribe(phone, Subscribing.from_payload(body).endpoint)}
        if rest[:1] != rest or rest[0] not in acts:
            return handler.answer(404, "no such action")
        try:
            made = acts[rest[0]](self.phones(handler))
        except Stale as stale:
            return handler.answer(409, str(stale))
        except (Refused, ValueError) as refused:
            return handler.answer(422, str(refused))
        return self.json(handler, 201, {"n": made.n})

    def attach(self, handler, rest: list[str]) -> None:
        if not self.trusted(handler, UPLOADED):
            return handler.answer(403, "refused")
        length = handler.headers.get("Content-Length", "")
        size = int(length) if length.isdigit() else 0
        if len(rest) != 2 or not rest[0].isdigit() or not 0 < size <= UPLOAD_LIMIT:
            return handler.answer(413, "a file goes to one of this phone's messages, up to 25 MB")
        phone = self.phone(handler)
        if phone is None:
            return None
        try:
            made = self.phones(handler)._attach(phone, int(rest[0]), rest[1], handler.rfile.read(size))
        except Refused as refused:
            return handler.answer(422, str(refused))
        return self.json(handler, 201, {"n": made.n, "files": sorted(made.files)})

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

    def trusted(self, handler, kind: str = "application/json") -> bool:
        host = handler.headers.get("Host", "")
        origin = f"{'http' if local(host) else 'https'}://{host}"
        return (handler.headers.get("Origin") == origin and handler.headers.get(HEADER) == "1"
                and handler.headers.get("Content-Type", "").startswith(kind))

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
        raw = json.dumps(body).encode()
        tag = f'"{hashlib.sha1(raw).hexdigest()}"'
        kept = {**APP_HEADERS, "ETag": tag, "Cache-Control": "private, no-cache"}
        if handler.command == "GET" and code == 200 and handler.headers.get("If-None-Match") == tag:
            return handler.send(304, b"", kept)
        handler.packed(code, raw, {"Content-Type": "application/json", **kept, **(headers or {})})
