import json
import math
import threading
from collections import Counter
from collections.abc import Callable
from dataclasses import dataclass
from http.cookies import SimpleCookie
from urllib.parse import parse_qs, parse_qsl, urlsplit
from urllib.request import urlopen

from commands.dispatch import dispatch, resolve
from engine.color import identity
from engine.fields import Loaded
from engine.viewer import lately_running
from features.hosted_journal.settings import FromRecord, FromVault
from features.hosted_journal.owner import MOST_EVERYWHERE, SHORTEST, Devices, Logins, Owner, Standing, WrongTries, hashed
from features.hosted_journal.pages import Notice, insecure_page, locked_page, login_page, setup_page
from features.hosted_journal.vault import DiskFull, RefusalLog, Vault
from features.phone.allow_list import Action, GenericPath, actions, post, reach
from features.phone.desktop import Desktop, closed, encoded
from features.sharing.origins import origins_of
from features.trigger import DAY
from resources.base import Refused

COOKIE = "__Host-journal"
DEVICE_COOKIE = "__Host-journal-device"
DEVICE_DAYS = 365
PHONE_OWNER_ACTIONS = frozenset(actions("phone", "connect disconnect allow_passkey refuse_passkey"))
NEVER_FROM_OUTSIDE = frozenset((post("/api/run"), post("/api/upgrade"), post("/api/stop"), post("/api/hook/{provider}"), post("/api/update"),
                                post("/api/journals/start"), post("/api/services/{id}")))
STREAM = "text/event-stream"
FORM_LIMIT = 8192
BODY_LIMIT = 1024 * 1024
UPLOAD_LIMIT = 25 * 1024 * 1024
MOST_STREAMS = 8
CHECKS_AT_ONCE = 3
REFUSALS_A_MINUTE = 60
READY_SECONDS = 3
VIEWER_HEADERS = {
    "Content-Security-Policy": "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
                               "font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob: https:; connect-src 'self'; "
                               "object-src 'none'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
    "Referrer-Policy": "same-origin",
    "X-Frame-Options": "DENY",
}
PAGE_HEADERS = {**VIEWER_HEADERS, "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; "
                                                             "form-action 'self'; frame-ancestors 'none'",
                "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store"}


@dataclass(frozen=True)
class TryPlace:
    key: str
    ceiling: float


@dataclass(frozen=True)
class LoginForm(Loaded):
    password: str = ""
    again: str = ""
    code: str = ""

    def chooses_password(self) -> bool:
        return self.password == self.again and len(self.password) >= SHORTEST


class Visit:
    """One request at the gateway: who sent it, from where, and the server's files it is checked against."""

    def __init__(self, handler, refusals: RefusalLog, settings: "FromRecord | FromVault") -> None:
        self.handler = handler
        self.refusals = refusals
        self.record = handler.shares.record
        self.vault = Vault(self.record.root)
        self.settings = settings.of(self.record)
        self.origins = origins_of(self.record)
        self.host = handler.headers.get("Host", "")
        self.url = urlsplit(handler.path)

    def on_this_machine(self) -> bool:
        return self.origins.on_this_machine(self.handler)

    def secure(self) -> bool:
        return self.on_this_machine() or self.origins.encrypted(self.handler)

    def addressed(self) -> bool:
        return self.on_this_machine() or not self.settings.address or urlsplit(f"//{self.host}").hostname == self.settings.address

    def same_origin(self) -> bool:
        return self.handler.headers.get("Origin") == self.origins.origin(self.handler)

    def place(self) -> str:
        return self.origins.place(self.handler)

    def try_place(self) -> "TryPlace":
        """Where this browser's login tries are counted: alone and past the ceiling when it carries a device cookie from a good login here."""
        device = Devices(self.vault).known(self.cookie_named(DEVICE_COOKIE))
        return TryPlace(f"device {device}", math.inf) if device else TryPlace(self.place(), MOST_EVERYWHERE)

    def cookie_named(self, name: str) -> str:
        kept = SimpleCookie(self.handler.headers.get("Cookie", "")).get(name)
        return kept.value if kept else ""

    def token(self) -> str:
        return self.cookie_named(COOKIE)

    def length(self) -> int:
        given = self.handler.headers.get("Content-Length", "")
        return int(given) if given.isdigit() else 0

    def form(self) -> "LoginForm":
        size = self.length()
        if size > FORM_LIMIT:
            raise Refused("the form is too large")
        return LoginForm.from_json({name: values[0] for name, values in parse_qs(self.handler.rfile.read(size).decode(errors="replace")).items()})

    def project(self) -> str:
        return identity(self.record.root)["project"]

    def cookie(self, name: str, value: str, days: float) -> str:
        return f"{name}={value}; Max-Age={int(days * DAY)}; Path=/; Secure; HttpOnly; SameSite=Strict"

    def page(self, code: int, text: str, headers: dict | None = None) -> None:
        self.handler.send(code, text.encode(), {**PAGE_HEADERS, **(headers or {})})

    def go(self, where: str, headers: dict | None = None) -> None:
        self.handler.send(303, b"", {**PAGE_HEADERS, "Location": where, **(headers or {})})

    def refuse(self, code: int, text: str) -> None:
        self.refusals.write(self.vault, place=self.place(), method=self.handler.command, path=self.url.path, code=code)
        self.handler.send(code, json.dumps({"error": text}).encode(), {**VIEWER_HEADERS, "Content-Type": "application/json"})


class Gateway:
    """The only way into a journal on a server: the owner's login in front of the full viewer, forwarded to the journal on the server itself."""

    def __init__(self, settings: "FromRecord | FromVault", answered_here: frozenset[Action]) -> None:
        self.settings = settings
        self.answered_here = answered_here
        self.streams: Counter[str] = Counter()
        self.lock = threading.Lock()
        self.checking = threading.BoundedSemaphore(CHECKS_AT_ONCE)
        self.refusals = RefusalLog(REFUSALS_A_MINUTE)
        self.pages: dict[tuple[str, str], Callable[[Visit], None]] = {
            ("GET", "/login"): self.show_login, ("GET", "/setup"): lambda visit: visit.go("/login"), ("POST", "/login"): self.log_in,
            ("POST", "/setup"): self.set_up, ("POST", "/logout"): self.log_out, ("GET", "/ready"): self.ready,
        }

    def get(self, handler, rest: list[str]) -> None:
        self.serve(Visit(handler, self.refusals, self.settings))

    def post(self, handler, rest: list[str]) -> None:
        self.serve(Visit(handler, self.refusals, self.settings))

    def serve(self, visit: Visit) -> None:
        if not visit.secure():
            return visit.page(403, insecure_page(visit.project()))
        if not visit.addressed():
            return visit.refuse(421, "this journal answers only at its own address")
        try:
            return self.pages.get((visit.handler.command, visit.url.path), self.forward)(visit)
        except DiskFull as full:
            return visit.handler.answer(507, str(full))
        except Refused as refused:
            return visit.refuse(413, str(refused))

    def show_login(self, visit: Visit) -> None:
        place = visit.try_place()
        owner, wait = Owner(visit.vault), WrongTries(visit.vault).locked_for(place.key, place.ceiling)
        if Logins(visit.vault).standing(visit.token()) is Standing.OPEN:
            return visit.go("/")
        if wait:
            return visit.page(429, locked_page(visit.project(), wait))
        notice = Notice.named(parse_qs(visit.url.query).get("notice", [""])[0])
        return visit.page(200, login_page(visit.project(), notice) if owner.has_password() else setup_page(visit.project(), Notice.NONE))

    def tried(self, visit: Visit, matched: Callable[[], bool], wrong: Callable[[], str]) -> None:
        """A login or setup form: its try is counted first and refused while its place is locked out, with few password checks at once."""
        if not self.checking.acquire(blocking=False):
            return visit.refuse(429, "the server is checking other logins; try again in a moment")
        try:
            return self.checked(visit, matched, wrong)
        finally:
            self.checking.release()

    def checked(self, visit: Visit, matched: Callable[[], bool], wrong: Callable[[], str]) -> None:
        tries = WrongTries(visit.vault)
        tried = visit.try_place()
        place, ceiling = tried.key, tried.ceiling
        if wait := tries.counted(place, ceiling):
            visit.vault.audit("locked out", place=place)
            return visit.page(429, locked_page(visit.project(), wait))
        if not matched():
            visit.vault.audit("wrong try", place=place, path=visit.url.path)
            if wait := tries.locked_for(place, ceiling):
                return visit.page(429, locked_page(visit.project(), wait))
            return visit.page(401, wrong())
        tries.forget(place)
        days = float(visit.settings.days)
        token = Logins(visit.vault).open(days, visit.handler.headers.get("User-Agent", ""))
        visit.vault.audit("logged in", place=place, login=hashed(token)[:12])
        return visit.go("/", {"Set-Cookie": [visit.cookie(COOKIE, token, days), visit.cookie(DEVICE_COOKIE, Devices(visit.vault).issue(), DEVICE_DAYS)]})

    def log_in(self, visit: Visit) -> None:
        owner = Owner(visit.vault)
        if not visit.same_origin():
            return visit.refuse(403, "a login comes only from this journal's own page")
        if not owner.has_password():
            return visit.go("/login")
        form = visit.form()
        return self.tried(visit, lambda: owner.matches(form.password), lambda: login_page(visit.project(), Notice.WRONG))

    def set_up(self, visit: Visit) -> None:
        owner = Owner(visit.vault)
        if not visit.same_origin():
            return visit.refuse(403, "the setup comes only from this journal's own page")
        if owner.has_password():
            return visit.go("/login")
        form = visit.form()
        if not form.chooses_password():
            return visit.page(400, setup_page(visit.project(), Notice.SHORT))

        def chosen() -> bool:
            if not owner.setup_code_matches(form.code):
                return False
            owner.set_password(form.password)
            visit.vault.audit("owner password set", place=visit.place())
            return True
        return self.tried(visit, chosen, lambda: setup_page(visit.project(), Notice.WRONG_CODE))

    def log_out(self, visit: Visit) -> None:
        if not visit.same_origin():
            return visit.refuse(403, "logging out comes only from this journal's own page")
        token = visit.token()
        Logins(visit.vault).close(token)
        visit.vault.audit("logged out", place=visit.place(), login=hashed(token)[:12])
        return visit.go("/login?notice=logged-out", {"Set-Cookie": visit.cookie(COOKIE, "", 0)})

    def ready(self, visit: Visit) -> None:
        address = lately_running(visit.record.root)
        try:
            urlopen(f"{address.rstrip('/')}/api/identity", timeout=READY_SECONDS).read()
        except (OSError, ValueError):
            return visit.handler.send(503, b"the journal is not answering", {"Content-Type": "text/plain"})
        return visit.handler.send(200, b"ok", {"Content-Type": "text/plain"})

    def forward(self, visit: Visit) -> None:
        token = visit.token()
        standing = Logins(visit.vault).standing(token)
        if standing is not Standing.OPEN:
            return self.turned_away(visit, standing)
        if closed(visit.record, visit.handler.command, encoded(visit.url)):
            return visit.refuse(403, "the journal on a server never runs this for anyone who comes in from outside")
        if visit.handler.command == "POST" and not visit.same_origin():
            return visit.refuse(403, "a change comes only from this journal's own pages")
        size = visit.length()
        if size > (UPLOAD_LIMIT if visit.url.path.endswith("/upload") else BODY_LIMIT):
            return visit.refuse(413, "too large")
        if self.answers_here(visit):
            return self.answer_here(visit, visit.handler.rfile.read(size) if size else b"")
        if STREAM not in visit.handler.headers.get("Accept", ""):
            return Desktop(visit.handler, visit.handler.path, {}, VIEWER_HEADERS).forward(visit.handler.rfile.read(size) if size else b"")
        return self.streamed(visit, hashed(token))

    def answers_here(self, visit: Visit) -> bool:
        """Whether the login page itself answers this owner's request, as it does for connecting a phone when it keeps the phones' keys."""
        found = resolve(visit.handler.command, urlsplit(encoded(visit.url)).path)
        return found is not None and reach(found[0], GenericPath.from_json(found[1])) in self.answered_here

    def answer_here(self, visit: Visit, raw: bytes) -> None:
        try:
            body = json.loads(raw or b"{}")
        except ValueError:
            return visit.refuse(400, "the request body is not JSON")
        reply = dispatch(visit.handler.command, urlsplit(encoded(visit.url)).path, visit.record.root, dict(parse_qsl(visit.url.query)), body)
        visit.handler.send(reply.code, reply.bytes(), {**VIEWER_HEADERS, "Content-Type": reply.kind})
        if reply.after:
            reply.after()

    def streamed(self, visit: Visit, login: str) -> None:
        with self.lock:
            if self.streams[login] >= MOST_STREAMS:
                return visit.refuse(429, f"one login keeps at most {MOST_STREAMS} live streams open; close a tab")
            self.streams[login] += 1
        try:
            return Desktop(visit.handler, visit.handler.path, {}, VIEWER_HEADERS).forward(b"")
        finally:
            with self.lock:
                self.streams[login] -= 1

    def turned_away(self, visit: Visit, standing: Standing) -> None:
        notice = "?notice=ran-out" if standing is Standing.RAN_OUT else ""
        if not visit.url.path.startswith("/api/"):
            return visit.go(f"/login{notice}")
        body = {"error": "your login ran out; log in again" if standing is Standing.RAN_OUT else "log in first", "login": f"/login{notice}"}
        return visit.handler.send(401, json.dumps(body).encode(), {**VIEWER_HEADERS, "Content-Type": "application/json"})
