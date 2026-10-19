import json
from dataclasses import asdict
from datetime import datetime, timezone
from http.cookies import SimpleCookie
from urllib.parse import parse_qs, urlsplit

from journal.config import Config
from journal.features.phone.support.pairing import Pairing
from journal.features.phone.support.phone_allow_list import PhoneAllowList
from journal.features.sharing.support.tunnel import Tunnel
from journal.http.controllers.journal import COLOR
from journal.http.phone.pair_request import PairRequest
from journal.http.phone.phone_icon import PhoneIcon
from journal.http.phone.phone_request import PhoneRequest
from journal.http.phone.phone_standing import PhoneStanding
from journal.http.sharing.share_pages import APP, APP_HEADERS, SharePages
from journal.http.router import Router
from journal.http.support.file_response import FileResponse
from journal.http.support.request import ENV_HEADER, Request
from journal.http.support.share_answer import ShareAnswer
from journal.repositories.environments import Environments
from journal.models.phone import Phone
from journal.repositories.phones import Phones
from journal.support.actor import Actor
from journal.support.refused import Refused

PAGE = "phone.html"
WORKER = "phone-sw.js"
ICONS = {"icon-180.png": 180, "icon-192.png": 192, "icon-512.png": 512}
PAGE_HEADERS = {"Content-Security-Policy": APP_HEADERS["Content-Security-Policy"] + "; manifest-src 'self'; worker-src 'self'"}
BACKGROUND = "#131416"
COOKIE = "__Host-phone"
HEADER = "X-Phone"
"""The header only the phone app sends, which a form on another site cannot set."""


class PhonePages:
    """What the tunnel's listener answers under /p/, as version 3 did: the phone page, its files, its service worker, its manifest and its icons, so the page installs on a phone as an app; the pairing, which sets the phone's cookie; and the phone's own standing, read by that cookie alone."""

    def __init__(self, config: Config, pairing: Pairing, phones: Phones, tunnel: Tunnel, router: Router, environments: Environments, allow: PhoneAllowList) -> None:
        self.config, self.pairing, self.phones, self.tunnel = config, pairing, phones, tunnel
        self.router, self.environments, self.allow = router, environments, allow

    def get(self, request: PhoneRequest) -> ShareAnswer:
        rest = request.rest
        if not rest:
            return self.page(request.path.split("?", 1)[0])
        if rest == ["state"]:
            return self.state(request)
        if rest[0] == "api":
            return self.through(request)
        if rest[0] == "assets" and len(rest) == 2:
            return SharePages.asset(rest[1])
        if rest == ["sw.js"]:
            return self.worker()
        if rest == ["manifest.webmanifest"]:
            return self.manifest()
        if len(rest) == 1 and rest[0] in ICONS:
            return ShareAnswer(200, PhoneIcon(COLOR).png(ICONS[rest[0]]), "image/png", {"Cache-Control": "public, max-age=86400"})
        return SharePages.gone(404)

    @staticmethod
    def page(address: str) -> ShareAnswer:
        """The phone app; its address ends in a slash, so its files are found beside it."""
        if not address.endswith("/"):
            return ShareAnswer(301, headers={"Location": "/p/"})
        page = APP / PAGE
        if not page.is_file():
            return SharePages.gone(404)
        return ShareAnswer(200, page.read_bytes(), headers=PAGE_HEADERS)

    @staticmethod
    def worker() -> ShareAnswer:
        """The service worker, allowed to serve all of /p/ though it is fetched from inside it, and never kept stale."""
        found = APP / WORKER
        if not found.is_file():
            return SharePages.gone(404)
        return ShareAnswer(200, found.read_bytes(), "text/javascript", {"Service-Worker-Allowed": "/p/", "Cache-Control": "no-cache", **APP_HEADERS})

    def manifest(self) -> ShareAnswer:
        project = self.config.root.name
        body = {"name": f"{project} journal", "short_name": project, "start_url": "/p/", "scope": "/p/", "display": "standalone",
                "background_color": BACKGROUND, "theme_color": COLOR,
                "icons": [{"src": f"/p/{name}", "sizes": f"{side}x{side}", "type": "image/png"} for name, side in ICONS.items()]}
        return ShareAnswer(200, json.dumps(body).encode(), "application/manifest+json", {"Cache-Control": "no-store"})

    def post(self, request: PhoneRequest) -> ShareAnswer:
        """A write from the phone app: only from the tunnel's own address with the app's header and a JSON body, the pairing first of all."""
        given = self.given(request)
        if given is None:
            return self.json(403, {"error": "refused"})
        if request.rest == ["pair"]:
            return self.pair(PairRequest.from_payload(given))
        phone = self.phone(request)
        if not isinstance(phone, Phone):
            return phone
        if request.rest[:1] == ["api"]:
            return self.forward(request, phone, given)
        if request.rest == ["disconnect"]:
            self.pairing.disconnect(phone, Actor.phone(phone.id), datetime.now(timezone.utc))
            return self.json(200, {"disconnected": phone.id}, {"Set-Cookie": f"{COOKIE}=; Max-Age=0; Path=/; Secure; HttpOnly; SameSite=Strict"})
        return self.json(404, {"error": "no such action"})

    def given(self, request: PhoneRequest) -> dict | None:
        """The body of a write the phone app sent, as version 3 trusted one: from https at the tunnel's address, with the app's header, as JSON; none otherwise."""
        if request.origin != f"https://{self.tunnel.address()}" or request.app_header != "1" or not request.content_type.startswith("application/json"):
            return None
        try:
            loaded = json.loads(request.body or b"{}")
        except ValueError:
            return None
        return loaded if isinstance(loaded, dict) else None

    def pair(self, asked: PairRequest) -> ShareAnswer:
        now = datetime.now(timezone.utc)
        try:
            paired = self.pairing.pair(asked.code, asked.device, now)
        except Refused as refused:
            return self.json(410, {"error": str(refused)})
        lasts = int((paired.phone.expires_at - now).total_seconds())
        cookie = f"{COOKIE}={paired.key}; Max-Age={lasts}; Path=/; Secure; HttpOnly; SameSite=Strict"
        return self.json(200, asdict(self.standing(paired.phone)), {"Set-Cookie": cookie})

    def phone(self, request: PhoneRequest) -> Phone | ShareAnswer:
        """The phone the request's cookie names, before anything else is read: none is a 401, one that ended or ran out a 410."""
        kept = SimpleCookie(request.cookies).get(COOKIE)
        phone = self.phones.by_key(Pairing.hashed(kept.value)) if kept and kept.value else None
        if phone is None:
            return self.json(401, {"error": "this phone is not connected"})
        now = datetime.now(timezone.utc)
        if not phone.is_live(now):
            return self.json(410, {"error": "this phone was disconnected" if phone.ended_at else "this phone's connection has run out"})
        return self.phones.save(phone.seen(now), Actor.phone(phone.id)) if phone.is_due_a_sighting(now) else phone

    def through(self, request: PhoneRequest) -> ShareAnswer:
        phone = self.phone(request)
        return self.forward(request, phone, {}) if isinstance(phone, Phone) else phone

    def forward(self, request: PhoneRequest, phone: Phone, body: dict) -> ShareAnswer:
        """A call of the journal's own API, made as the phone in the environment it was paired in, if the allow list names it: version 4's controllers answer it, as the viewer's would."""
        url = urlsplit(request.path.removeprefix("/p/api"))
        query = {name: values[-1] for name, values in parse_qs(url.query).items()}
        environment = self.environments.find(phone.environment_id).name
        asked = Request(request.method, url.path, query, body, {}, {ENV_HEADER.lower(): environment}, Actor.phone(phone.id))
        route = self.router.matched(asked)
        if route is None or not self.allow.allows(route) or query.get("env", environment) != environment:
            return self.json(403, {"error": "a phone reaches only the pages its app uses, in its own environment"})
        answer = self.router.dispatch(asked)
        if isinstance(answer, FileResponse):
            return ShareAnswer(answer.status, answer.body, answer.kind, {"Cache-Control": "private, max-age=3600", **APP_HEADERS})
        return ShareAnswer(answer.status, answer.encoded(), "application/json", {"Cache-Control": "no-store", **APP_HEADERS})

    def state(self, request: PhoneRequest) -> ShareAnswer:
        phone = self.phone(request)
        return self.json(200, asdict(self.standing(phone))) if isinstance(phone, Phone) else phone

    def standing(self, phone: Phone) -> PhoneStanding:
        return PhoneStanding(phone.name, phone.id, phone.expires_at.isoformat(), self.config.root.name, COLOR)

    @staticmethod
    def json(status: int, body: dict, headers: dict | None = None) -> ShareAnswer:
        return ShareAnswer(status, json.dumps(body).encode(), "application/json", {"Cache-Control": "no-store", **APP_HEADERS, **(headers or {})})
