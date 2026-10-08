import json
import math
import socket
import threading
from collections import Counter, defaultdict
from contextlib import suppress
from collections.abc import Callable
from dataclasses import asdict, dataclass, replace
from http.cookies import SimpleCookie
from urllib.parse import parse_qs, urlsplit
from urllib.request import urlopen

from commands.dispatch import rendered, resolve
from engine.disk import KEPT_FREE_BYTES, free_bytes, nearly_full
from engine.record import Record
from features.phone.controller import Phones
from engine.color import identity
from engine.fields import Loaded
from engine.viewer import lately_running
from features.hosted_journal.settings import FromRecord, FromVault
from features.hosted_journal.owner import MOST_EVERYWHERE, SHORTEST, Devices, KeptLogin, Logins, Owner, Standing, WrongTries, hashed
from features.hosted_journal.people import people_of
from features.hosted_journal.hosting import Ask, Hosting
from features.hosted_journal.pages import Notice, insecure_page, locked_page, login_page, setup_page, taken_down_page
from features.hosted_journal.phones import VaultGuard
from features.hosted_journal.vault import DiskFull, RefusalLog, Vault
from features.phone.allow_list import Action, GenericPath, Page, post, reach
from features.phone.desktop import Desktop, closed, encoded
from features.sharing.origins import origins_of
from features.trigger import DAY
from resources.base import OWNER_ID, USER, Refused

COOKIE = "__Host-journal"
DEVICE_COOKIE = "__Host-journal-device"
DEVICE_DAYS = 365


@dataclass(frozen=True)
class PhoneRequest(Loaded):
    """What the viewer sends when the owner connects, disconnects or answers a phone's Face ID request."""

    n: int = 0
    days: int = 7
    member: str = ""


@dataclass(frozen=True)
class PhonePath(Loaded):
    """The environment and phone a phone action's address names."""

    env: str = ""
    n: int = 0


PhoneAnswer = Callable[[Phones, PhoneRequest], object]
PHONE_OWNER_ACTIONS: dict[Action, PhoneAnswer] = {
    Action("phone", "connect"): lambda phones, asked: phones.connect(asked.days, asked.member),
    Action("phone", "disconnect"): lambda phones, asked: phones.complete(asked.n, "disconnected in the viewer"),
    Action("phone", "allow_passkey"): lambda phones, asked: phones.allow_passkey(asked.n),
    Action("phone", "refuse_passkey"): lambda phones, asked: phones.refuse_passkey(asked.n),
}
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
CONNECTED_WITHIN = 120
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


class TooLarge(Refused):
    @classmethod
    def sent(cls, what: str) -> "TooLarge":
        return cls(f"the {what} is too large")


@dataclass(frozen=True)
class Reached:
    """The journal's page or controller action a request would reach, and the values its path names."""

    target: Page | Action
    params: dict


@dataclass(frozen=True)
class TryPlace:
    key: str
    ceiling: float


@dataclass(frozen=True)
class LoginForm(Loaded):
    name: str = ""
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

    def origin(self) -> str:
        return self.origins.origin(self.handler)

    def same_origin(self) -> bool:
        return self.handler.headers.get("Origin") == self.origin()

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
            raise TooLarge.sent("form")
        return LoginForm.from_json({name: values[0] for name, values in parse_qs(self.handler.rfile.read(size).decode(errors="replace")).items()})

    def asked(self, kind):
        """The request's JSON body, read into the given Loaded type."""
        size = self.length()
        if size > FORM_LIMIT:
            raise TooLarge.sent("request")
        try:
            return kind.from_json(json.loads(self.handler.rfile.read(size) or b"{}"))
        except ValueError as unreadable:
            raise Refused("the request is not JSON") from unreadable

    def reached(self) -> Reached | None:
        """What the journal would answer this request with, or None when no route of the journal's answers it."""
        found = resolve(self.handler.command, urlsplit(encoded(self.url)).path)
        if found is None:
            return None
        return Reached(reach(found[0], GenericPath.from_json(found[1])), found[1])

    def project(self) -> str:
        return identity(self.record.root)["project"]

    def cookie(self, name: str, value: str, days: float) -> str:
        return f"{name}={value}; Max-Age={int(days * DAY)}; Path=/; Secure; HttpOnly; SameSite=Strict"

    def page(self, code: int, text: str, headers: dict | None = None) -> None:
        self.handler.send(code, text.encode(), {**PAGE_HEADERS, **(headers or {})})

    def json(self, code: int, body: dict, headers: dict | None = None) -> None:
        self.handler.send(code, json.dumps(body).encode(), {**VIEWER_HEADERS, "Content-Type": "application/json", **(headers or {})})

    def go(self, where: str, headers: dict | None = None) -> None:
        self.handler.send(303, b"", {**PAGE_HEADERS, "Location": where, **(headers or {})})

    def refuse(self, code: int, text: str) -> None:
        self._refused(code, {"error": text})

    def block(self, why: str) -> None:
        """Refuses what this login's person may not do here, saying why, so the viewer can show it on the control they pressed."""
        self._refused(403, {"error": why, "blocked": True})

    def _refused(self, code: int, body: dict) -> None:
        self.refusals.write(self.vault, place=self.place(), method=self.handler.command, path=self.url.path, code=code)
        self.handler.send(code, json.dumps(body).encode(), {**VIEWER_HEADERS, "Content-Type": "application/json"})


class Gateway:
    """The only way into a journal on a server: the owner's login in front of the full viewer, forwarded to the journal on the server itself."""

    def __init__(self, settings: "FromRecord | FromVault", answered_here: dict[Action, PhoneAnswer]) -> None:
        self.settings = settings
        self.answered_here = answered_here
        self.streams: Counter[str] = Counter()
        self.listening: Counter[str] = Counter()
        self.live: defaultdict[str, set[socket.socket]] = defaultdict(set)
        self.last_seen: dict[str, float] = {}
        self.lock = threading.Lock()
        self.checking = threading.BoundedSemaphore(CHECKS_AT_ONCE)
        self.refusals = RefusalLog(REFUSALS_A_MINUTE)
        self.pages: dict[tuple[str, str], Callable[[Visit], None]] = {
            ("GET", "/login"): self.show_login, ("GET", "/setup"): lambda visit: visit.go("/login"), ("POST", "/login"): self.log_in,
            ("POST", "/setup"): self.set_up, ("POST", "/logout"): self.log_out, ("GET", "/ready"): self.ready,
        }
        self.owner_actions: dict[tuple[str, str], Callable[[Visit], None]] = {
            ("GET", "/api/hosting"): self.hosting_status, ("POST", "/api/hosting/upgrade"): self.upgrade,
            ("POST", "/api/hosting/take-down"): self.take_down,
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
        if Hosting(visit.vault).down():
            return visit.page(503, taken_down_page(visit.project()))
        try:
            asked = (visit.handler.command, visit.url.path)
            return {**people_of(visit.record).pages(self), **self.pages}.get(asked, self.forward)(visit)
        except DiskFull as full:
            return visit.handler.answer(507, str(full))
        except TooLarge as large:
            return visit.refuse(413, str(large))
        except Refused as refused:
            return visit.refuse(400, str(refused))

    def show_login(self, visit: Visit) -> None:
        place = visit.try_place()
        owner, wait = Owner(visit.vault), WrongTries(visit.vault).locked_for(place.key, place.ceiling)
        if Logins(visit.vault).standing(visit.token()) is Standing.OPEN:
            return visit.go("/")
        if wait:
            return visit.page(429, locked_page(visit.project(), wait))
        notice = Notice.named(parse_qs(visit.url.query).get("notice", [""])[0])
        if not owner.has_password():
            return visit.page(200, setup_page(visit.project(), Notice.NONE))
        return visit.page(200, login_page(visit.project(), notice, people_of(visit.record).below_login()))

    def tried(self, visit: Visit, matched: Callable[[], str | None], wrong: Callable[[], str]) -> None:
        """A login, setup or invite form, counted before it is checked; matched answers whom it proved to be, or None for no one."""
        if not self.checking.acquire(blocking=False):
            return visit.refuse(429, "the server is checking other logins; try again in a moment")
        try:
            return self.checked(visit, matched, wrong)
        finally:
            self.checking.release()

    def checked(self, visit: Visit, matched: Callable[[], str | None], wrong: Callable[[], str]) -> None:
        tries = WrongTries(visit.vault)
        tried = visit.try_place()
        place, ceiling = tried.key, tried.ceiling
        if wait := tries.counted(place, ceiling):
            visit.vault.audit("locked out", place=place)
            return visit.page(429, locked_page(visit.project(), wait))
        member = matched()
        if member is None:
            visit.vault.audit("wrong try", place=place, path=visit.url.path)
            if wait := tries.locked_for(place, ceiling):
                return visit.page(429, locked_page(visit.project(), wait))
            return visit.page(401, wrong())
        tries.forget(place)
        days = float(visit.settings.days)
        token = Logins(visit.vault).open(days, visit.handler.headers.get("User-Agent", ""), member)
        visit.vault.audit("logged in", place=place, login=hashed(token)[:12], member=member)
        return visit.go("/", {"Set-Cookie": [visit.cookie(COOKIE, token, days), visit.cookie(DEVICE_COOKIE, Devices(visit.vault).issue(), DEVICE_DAYS)]})

    def log_in(self, visit: Visit) -> None:
        owner = Owner(visit.vault)
        if not visit.same_origin():
            return visit.refuse(403, "a login comes only from this journal's own page")
        if not owner.has_password():
            return visit.go("/login")
        form = visit.form()
        below = people_of(visit.record).below_login()
        return self.tried(visit, lambda: OWNER_ID if owner.matches(form.password) else None, lambda: login_page(visit.project(), Notice.WRONG, below))

    def set_up(self, visit: Visit) -> None:
        owner = Owner(visit.vault)
        if not visit.same_origin():
            return visit.refuse(403, "the setup comes only from this journal's own page")
        if owner.has_password():
            return visit.go("/login")
        form = visit.form()
        if not form.chooses_password():
            return visit.page(400, setup_page(visit.project(), Notice.SHORT))

        def chosen() -> str | None:
            if not owner.setup_code_matches(form.code):
                return None
            owner.set_password(form.password)
            visit.vault.audit("owner password set", place=visit.place())
            return OWNER_ID
        return self.tried(visit, chosen, lambda: setup_page(visit.project(), Notice.WRONG_CODE))

    def log_out(self, visit: Visit) -> None:
        if not visit.same_origin():
            return visit.refuse(403, "logging out comes only from this journal's own page")
        token = visit.token()
        Logins(visit.vault).close(token)
        visit.vault.audit("logged out", place=visit.place(), login=hashed(token)[:12])
        return visit.go("/login?notice=logged-out", {"Set-Cookie": visit.cookie(COOKIE, "", 0)})

    def ready(self, visit: Visit) -> None:
        free = free_bytes(visit.record.root)
        if free < KEPT_FREE_BYTES:
            return visit.handler.send(503, nearly_full(free).encode(), {"Content-Type": "text/plain"})
        address = lately_running(visit.record.root)
        try:
            urlopen(f"{address.rstrip('/')}/api/identity", timeout=READY_SECONDS).read()
        except (OSError, ValueError):
            return visit.handler.send(503, b"the journal is not answering", {"Content-Type": "text/plain"})
        return visit.handler.send(200, b"ok", {"Content-Type": "text/plain"})

    def hosting_status(self, visit: Visit) -> None:
        return visit.json(200, asdict(Hosting(visit.vault).status()))

    def upgrade(self, visit: Visit) -> None:
        Hosting(visit.vault).ask(Ask.UPGRADE)
        return visit.json(202, {"asked": Ask.UPGRADE.value})

    def take_down(self, visit: Visit) -> None:
        """Ends every login and every phone's key before it asks the updater to stop the journal, so nothing is let in while it does."""
        Hosting(visit.vault).ask(Ask.TAKE_DOWN)
        ended = Logins(visit.vault).close_all()
        VaultGuard(visit.vault).drop_all()
        for record in Record.every(visit.record.root):
            phones = Phones(record, actor=USER)
            for phone in phones.connected():
                phones.complete(phone.n, "ended when the journal was taken down")
        visit.vault.audit("hosted journal taken down", place=visit.place(), logins_ended=ended)
        return visit.json(202, {"asked": Ask.TAKE_DOWN.value}, {"Set-Cookie": visit.cookie(COOKIE, "", 0)})

    def forward(self, visit: Visit) -> None:
        token = visit.token()
        login = Logins(visit.vault).found(token)
        if login is None:
            return self.turned_away(visit, Standing.UNKNOWN)
        if (standing := login.standing(visit.vault.clock())) is not Standing.OPEN:
            return self.turned_away(visit, standing)
        self.last_seen[login.member] = visit.vault.clock()
        if closed(visit.record, visit.handler.command, encoded(visit.url)):
            return visit.refuse(403, "the journal on a server never runs this for anyone who comes in from outside")
        if visit.handler.command == "POST" and not visit.same_origin():
            return visit.refuse(403, "a change comes only from this journal's own pages")
        size = visit.length()
        if size > (UPLOAD_LIMIT if visit.url.path.endswith("/upload") else BODY_LIMIT):
            return visit.refuse(413, "too large")
        asked = (visit.handler.command, visit.url.path)
        people = people_of(visit.record)
        owned = {**people.owner_actions(self), **self.owner_actions}
        if acted := people.actions(self).get(asked):
            return acted(visit, login)
        if not login.is_owners() and asked in owned:
            return visit.block("Only the owner can do this.")
        if not login.is_owners() and (refusal := people.refusal(visit, login)):
            return visit.block(refusal)
        if asked in owned:
            return owned[asked](visit)
        if phone := self.answered_by_phones(visit):
            return self.answer_here(visit, login, *phone, visit.handler.rfile.read(size) if size else b"")
        if STREAM not in visit.handler.headers.get("Accept", ""):
            return Desktop(visit.handler, visit.handler.path, people.marks(visit, login), VIEWER_HEADERS).forward(visit.handler.rfile.read(size) if size else b"")
        return self.streamed(visit, login, hashed(token), people.marks(visit, login))

    def end_logins_of(self, vault: Vault, member: str) -> int:
        """Ends every login of this member and cuts the live streams their browsers hold open, so nothing of theirs stays connected."""
        ended = Logins(vault).close_member(member)
        self.cut_streams_of(member)
        return ended

    def cut_streams_of(self, member: str) -> int:
        """Cuts the live streams a member's browsers hold open; a browser whose login still stands opens a new one, under what holds now."""
        with self.lock:
            streams = list(self.live.pop(member, ()))
        for stream in streams:
            # A stream that closed by itself in the meantime is already ended.
            with suppress(OSError):
                stream.shutdown(socket.SHUT_RDWR)
        return len(streams)

    def connected(self, now: float) -> frozenset[str]:
        """Who has the journal open: a live stream from their browser, or a request in the last two minutes."""
        with self.lock:
            listening = {member for member, open_streams in self.listening.items() if open_streams > 0}
        return frozenset((*listening, *(member for member, at in self.last_seen.items() if now - at < CONNECTED_WITHIN)))

    def answered_by_phones(self, visit: Visit) -> tuple[PhoneAnswer, PhonePath] | None:
        """The owner's phone action this request reaches, which the login page answers itself when it keeps the phones' keys."""
        reached = visit.reached()
        if reached is None or reached.target not in self.answered_here:
            return None
        return self.answered_here[reached.target], PhonePath.from_json(reached.params)

    def answer_here(self, visit: Visit, login: KeptLogin, answer: PhoneAnswer, path: PhonePath, raw: bytes) -> None:
        try:
            asked = replace(PhoneRequest.from_json(json.loads(raw or b"{}")), n=path.n, member=login.member)
            record = Record(visit.record.root, path.env)
            if path.n and Phones(record, actor=USER)._phone(path.n).member != asked.member:
                raise Refused("a phone is answered only by the one who connected it")
            body = rendered(answer(Phones(record, actor=USER), asked), record)
        except (ValueError, Refused) as refused:
            return visit.handler.send(400, json.dumps({"error": str(refused)}).encode(), {**VIEWER_HEADERS, "Content-Type": "application/json"})
        return visit.handler.send(200, json.dumps(body).encode(), {**VIEWER_HEADERS, "Content-Type": "application/json"})

    def streamed(self, visit: Visit, login: KeptLogin, token: str, marks: dict) -> None:
        with self.lock:
            if self.streams[token] >= MOST_STREAMS:
                return visit.refuse(429, f"one login keeps at most {MOST_STREAMS} live streams open; close a tab")
            self.streams[token] += 1
            self.listening[login.member] += 1
            self.live[login.member].add(visit.handler.connection)
        try:
            return Desktop(visit.handler, visit.handler.path, marks, VIEWER_HEADERS).forward(b"")
        finally:
            with self.lock:
                self.streams[token] -= 1
                self.listening[login.member] -= 1
                self.live[login.member].discard(visit.handler.connection)

    def turned_away(self, visit: Visit, standing: Standing) -> None:
        notice = "?notice=ran-out" if standing is Standing.RAN_OUT else ""
        if not visit.url.path.startswith("/api/"):
            return visit.go(f"/login{notice}")
        body = {"error": "your login ran out; log in again" if standing is Standing.RAN_OUT else "log in first", "login": f"/login{notice}"}
        return visit.handler.send(401, json.dumps(body).encode(), {**VIEWER_HEADERS, "Content-Type": "application/json"})
