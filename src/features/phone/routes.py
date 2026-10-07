import json
import mimetypes
import re
import time
from urllib.parse import parse_qs, quote, urlsplit
from dataclasses import asdict, dataclass
from typing import TypedDict
from http.cookies import SimpleCookie

from engine.record import Record
from engine.fields import Loaded
from features.phone.controller import Phones
from features.phone.desktop import Desktop
from features.phone.passkey import Assertion, Enrolment, Relying, requested
from features.phone.surface import PhoneSurface
from engine.color import identity
from features.sharing.controller import Shares
from features.sharing.page import disposition, unshared
from features.sharing.preview import icon
from features.sharing.server import APP_DIR, APP_HEADERS, BODY_LIMIT
from resources.base import SYSTEM, Refused, Stale
from features.trigger import DAY
from engine.wording import digest

APP_PAGE = "phone.html"
WORKER = "sw.js"
WORKER_FILE = "phone-sw.js"
MANIFEST = "manifest.webmanifest"
ICONS = {"icon-180.png": 180, "icon-192.png": 192, "icon-512.png": 512}
PAGE_HEADERS = {**APP_HEADERS, "Content-Security-Policy": APP_HEADERS["Content-Security-Policy"] + "; manifest-src 'self'"}
COOKIE = "__Host-phone"
HEADER = "X-Phone"
UNLOCK = "X-Phone-Unlock"
UPLOAD_LIMIT = 25 * 1024 * 1024
UPLOADED = "application/octet-stream"
LOCAL = ("127.0.0.1", "localhost")
BUILD = re.compile(r"assets/(phone-[\w-]+\.js)")


@dataclass(frozen=True)
class Pairing(Loaded):
    code: str = ""
    device: str = ""


@dataclass(frozen=True)
class MessageBody(Loaded):
    brief: str = ""
    idempotency: str = ""
    about: str = ""


@dataclass(frozen=True)
class Chosen(Loaded):
    n: int = 0
    answer: str = ""


@dataclass(frozen=True)
class Deciding(Loaded):
    n: int = 0
    act: str = ""
    how: str = ""


@dataclass(frozen=True)
class Reacting(Loaded):
    n: int = 0
    face: str = ""
    type: str = "message"


@dataclass(frozen=True)
class Switching(Loaded):
    on: bool = False


@dataclass(frozen=True)
class Numbered(Loaded):
    n: int = 0


@dataclass(frozen=True)
class Choosing(Loaded):
    mode: str = ""


@dataclass(frozen=True)
class Sharing(Loaded):
    ref: str = ""


@dataclass(frozen=True)
class Commenting(Loaded):
    ref: str = ""
    text: str = ""


@dataclass(frozen=True)
class Pressing(Loaded):
    ref: str = ""
    label: str = ""


@dataclass(frozen=True)
class Subscribing(Loaded):
    endpoint: str = ""


@dataclass(frozen=True)
class Arranging(Loaded):
    cards: tuple[str, ...] = ()


@dataclass(frozen=True)
class Starting(Loaded):
    journal: str = ""
    environment: str = ""
    agent: str = "claude"


@dataclass(frozen=True)
class Moving(Loaded):
    journal: str = ""
    environment: str = ""


@dataclass(frozen=True)
class Permitting(Loaded):
    helper: int | None = None
    allow: bool = False


@dataclass(frozen=True)
class Unlocking(Loaded):
    request: str = ""


@dataclass(frozen=True)
class Approval(Loaded):
    n: int = 0
    updated: float = 0.0


class Unasked(ValueError):
    pass


class Places(TypedDict):
    places: list[dict]
    at: str


class Connection(TypedDict):
    phone: str
    n: int
    environment: str
    expires: float
    home: list[str]
    project: str
    color: str
    passkey: bool
    passkey_asked: bool


def made(row) -> dict:
    return {"n": row.n}


def done(name: str, _ran) -> dict:
    return {"done": name}


def permitted(surface: PhoneSurface, asked: Permitting) -> dict:
    return done("allow" if asked.allow else "deny", surface.permit(asked.helper, asked.allow))


def read_body(phones: Phones, phone, rest: list[str], query: dict[str, list[str]]) -> dict:
    asked = {name: values[0] for name, values in query.items()}
    surface = PhoneSurface(phones, phone)
    if rest == ["list"]:
        return surface.listing(asked.get("type", ""))
    if rest == ["source"]:
        return surface.source(asked.get("q", ""))
    if rest == ["push-key"]:
        return {"key": phones._push_key()}
    if rest == ["places"]:
        return Places(places=[asdict(place) for place in phones._picked(phone)], at=str(surface.home.root.resolve()))
    if rest == ["state"]:
        known = identity(surface.home.root)
        return Connection(phone=phone.title, n=phone.n, environment=phone.environment, expires=phone.expires, home=phone.home,
                          project=known["project"], color=known["color"], passkey=bool(phone.passkey), passkey_asked=phone.waiting_passkey.waits(time.time()))
    if rest == ["feed"]:
        try:
            return {**surface.feed(float(asked.get("before", "inf"))), "build": built()}
        except ValueError as error:
            raise Unasked("before is a time in seconds") from error
    if rest == ["helper"]:
        if not asked.get("n", "").isdigit():
            raise Unasked("a helper number is required")
        return surface.helper(int(asked["n"]))
    if rest == ["bar"]:
        return surface.bar()
    if len(rest) == 3:
        return surface.read(f"{rest[1]}:{rest[2]}")
    raise Refused("no such page")


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
        if rest[:1] == ["api"]:
            return self.desktop(handler)
        if rest == [WORKER]:
            return handler.send(200, (APP_DIR / WORKER_FILE).read_bytes(), {"Content-Type": "text/javascript", "Cache-Control": "no-cache",
                                                                          "Service-Worker-Allowed": "/p/", **APP_HEADERS})
        if rest[:1] in (["state"], ["feed"], ["helper"], ["bar"], ["places"], ["push-key"], ["source"], ["list"], ["row"], ["export"]):
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
            found = PhoneSurface(self.phones(handler), phone).file(f"{rest[1]}:{rest[2]}", rest[3])
        except Refused as refused:
            return handler.answer(404, str(refused))
        kind = mimetypes.guess_type(found.name)[0] or "application/octet-stream"
        return handler.send(200, found.read_bytes(), {"Content-Type": kind, "Cache-Control": "private, max-age=3600", "Content-Disposition": disposition(found.name)})

    def read(self, handler, rest: list[str]) -> None:
        phone = self.phone(handler)
        if phone is None:
            return None
        phones = self.phones(handler)
        if rest[:1] == ["export"] and len(rest) == 3:
            try:
                exported = PhoneSurface(phones, phone).export(f"{rest[1]}:{rest[2]}")
            except Refused as refused:
                return handler.answer(404, str(refused))
            return handler.send(200, exported.body, {"Content-Type": exported.kind, "Content-Disposition": f"attachment; filename*=UTF-8''{quote(exported.name)}"})
        try:
            return self.json(handler, 200, read_body(phones, phone, rest, parse_qs(urlsplit(handler.path).query)))
        except Refused as refused:
            return handler.answer(404, str(refused))
        except Unasked as unasked:
            return handler.answer(400, str(unasked))

    def manifest(self, handler) -> None:
        known = identity(handler.shares.record.root)
        body = {"name": f"{known['project']} journal", "short_name": known["project"], "start_url": "/p/", "scope": "/p/", "display": "standalone",
                "background_color": "#131416", "theme_color": known["color"],
                "icons": [{"src": f"/p/{name}", "sizes": f"{side}x{side}", "type": "image/png"} for name, side in ICONS.items()]}
        return handler.send(200, json.dumps(body).encode(), {"Content-Type": "application/manifest+json", "Cache-Control": "no-store"})

    def post(self, handler, rest: list[str]) -> None:
        if not rest:
            return handler.answer(404, "no such action")
        if rest[:1] == ["attach"]:
            return self.attach(handler, rest[1:])
        if rest[:1] == ["api"]:
            return self.desktop(handler)
        if not self.trusted(handler):
            return handler.answer(403, "refused")
        body = self.body(handler)
        if body is None:
            return handler.answer(413, "too large")
        if rest == ["pair"]:
            return self.pair(handler, Pairing.from_json(body))
        phone = self.phone(handler)
        if phone is None:
            return None
        phones = self.phones(handler)
        acts = self.acts(handler, phones, phone, body)
        name = "/".join(rest)
        if name not in acts:
            return handler.answer(404, "no such action")
        try:
            reply = acts[name]()
        except Stale as stale:
            return handler.answer(409, str(stale))
        except (Refused, ValueError) as refused:
            return handler.answer(422, str(refused))
        return self.json(handler, 201, reply)

    def acts(self, handler, phones: Phones, phone, body: dict) -> dict:
        surface = PhoneSurface(phones, phone)
        return {"passkey/begin": lambda: phones._enrolling(phone, self.relying(handler)),
                "passkey": lambda: {"passkey": False, "allow_within": round(phones._enrol(phone, self.relying(handler), Enrolment.from_json(body)).until - time.time())},
                "unlock/begin": lambda: phones._unlocking(phone, self.relying(handler), Unlocking.from_json(body).request),
                "unlock": lambda: {"unlock": phones._unlock(phone, self.relying(handler), Assertion.from_json(body))},
                "pause": lambda: done("pause", surface.pause()),
                "resume": lambda: done("resume", surface.resume()),
                "stop": lambda: done("stop", surface.stop()),
                "auto": lambda: {"auto": surface.auto(Switching.from_json(body).on)},
                "helper/stop": lambda: done("stop", surface.stop_helper(Numbered.from_json(body).n)),
                "permit": lambda: permitted(surface, Permitting.from_json(body)),
                "mode": lambda: {"mode": surface.mode(Choosing.from_json(body).mode)},
                "share": lambda: {"link": surface.share(Sharing.from_json(body).ref)},
                "message": lambda: made(surface.say(MessageBody.from_json(body))),
                "answer": lambda: made(surface.answer(Chosen.from_json(body))),
                "dismiss": lambda: made(surface.dismiss(Chosen.from_json(body).n)),
                "suggestion": lambda: made(surface.suggestion(Deciding.from_json(body))),
                "react": lambda: made(surface.react(Reacting.from_json(body))),
                "approve": lambda: made(surface.approve(Approval.from_json(body))),
                "continue": lambda: made(surface.continue_plan(Approval.from_json(body))),
                "comment": lambda: made(surface.comment(Commenting.from_json(body))),
                "close": lambda: made(surface.close(Chosen.from_json(body).n)),
                "press": lambda: made(surface.press(Pressing.from_json(body))),
                "switch": lambda: made(phones._switch(phone, Moving.from_json(body))),
                "start": lambda: made(phones._start(phone, Starting.from_json(body))),
                "arrange": lambda: made(phones._arrange(phone, list(Arranging.from_json(body).cards))),
                "push": lambda: made(phones._subscribe(phone, Subscribing.from_json(body).endpoint))}

    def desktop(self, handler) -> None:
        if handler.command == "POST" and not self.trusted(handler, ""):
            return handler.answer(403, "refused")
        length = handler.headers.get("Content-Length", "")
        size = int(length) if length.isdigit() else 0
        if size > UPLOAD_LIMIT:
            return handler.answer(413, "too large")
        phone = self.phone(handler)
        if phone is None:
            return None
        body = handler.rfile.read(size) if size else b""
        unlocked = self.phones(handler)._spend(phone, handler.headers.get(UNLOCK, ""), requested(handler.command, handler.path, body))
        return Desktop(handler, phone.environment, unlocked).forward(body)

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
            attached = PhoneSurface(self.phones(handler), phone).attach(int(rest[0]), rest[1], handler.rfile.read(size))
        except Refused as refused:
            return handler.answer(422, str(refused))
        return self.json(handler, 201, {"n": attached.n, "files": sorted(attached.files)})

    def pair(self, handler, pairing: Pairing) -> None:
        paired = self.phones(handler)._pair(pairing.code, pairing.device)
        if paired is None:
            return handler.answer(410, "this code was used or has run out: make a new one on your computer")
        phone, key = paired
        cookie = f"{COOKIE}={key}; Max-Age={int(phone.days * DAY)}; Path=/; Secure; HttpOnly; SameSite=Strict"
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

    def relying(self, handler) -> Relying:
        """The site a passkey answers for: this computer under its own name, or else the tunnel address the journal knows, never one the request names."""
        host = handler.headers.get("Host", "")
        if local(host):
            return Relying(host.split(":", 1)[0], f"http://{host}")
        address = Shares(handler.shares.record, actor=SYSTEM)._address()
        return Relying(address, f"https://{address}")

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
        tag = f'"{digest(raw)}"'
        kept = {**APP_HEADERS, "ETag": tag, "Cache-Control": "private, no-cache"}
        if handler.command == "GET" and code == 200 and handler.headers.get("If-None-Match") == tag:
            return handler.send(304, b"", kept)
        handler.packed(code, raw, {"Content-Type": "application/json", **kept, **(headers or {})})
