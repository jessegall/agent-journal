import json
import mimetypes
from dataclasses import asdict
from datetime import datetime, timezone
from http.cookies import SimpleCookie
from urllib.parse import parse_qs, urlsplit

from journal.config import Config
from journal.features.phone.support.pairing import Pairing
from journal.features.phone.support.phone_allow_list import PhoneAllowList
from journal.features.phone.support.phone_waits import PhoneWaits
from journal.features.phone.support.push_keys import PushKeys
from journal.features.phone.support.web_push import WebPush
from journal.features.sharing.support.tunnel import Tunnel
from journal.http.controllers.journal import COLOR
from journal.http.phone.pair_request import PairRequest
from journal.http.phone.phone_icon import PhoneIcon
from journal.http.phone.phone_request import PhoneRequest
from journal.http.phone.phone_snapshot import PhoneSnapshot
from journal.http.sharing.share_pages import APP, APP_HEADERS, SharePages
from journal.http.router import Router
from journal.http.support.file_response import FileResponse
from journal.http.support.request import ENV_HEADER, Request
from journal.http.support.share_answer import ShareAnswer
from journal.repositories.environments import Environments
from journal.models.phone import Phone
from journal.repositories.phones import Phones
from journal.support.share_place import SharePlace
from journal.support.actor import Actor
from journal.support.refused import Refused

PAGE = "phone.html"
WORKER = "phone-sw.js"
ICONS = {"icon-180.png": 180, "icon-192.png": 192, "icon-512.png": 512}
PAGE_HEADERS = {"Content-Security-Policy": APP_HEADERS["Content-Security-Policy"].replace("script-src 'self'", "script-src 'self' 'wasm-unsafe-eval'") + "; manifest-src 'self'; worker-src 'self' blob:"}
BACKGROUND = "#131416"
PUBLIC = ("voices", "announcements")
COOKIE = "__Host-phone"
HEADER = "X-Phone"
FILE_HEADERS = {"Content-Security-Policy": "sandbox", "X-Content-Type-Options": "nosniff"}


class PhonePages:
    """What the tunnel's listener answers under /p/, as version 3 did: the phone page, its files, its service worker, its manifest and its icons, so the page installs on a phone as an app; the pairing, which sets the phone's cookie; and the phone's own snapshot, read by that cookie alone."""

    def __init__(self, config: Config, pairing: Pairing, phones: Phones, tunnel: Tunnel, router: Router, environments: Environments, allow: PhoneAllowList, push: WebPush, waits: PhoneWaits, place: SharePlace) -> None:
        self.config, self.pairing, self.phones, self.tunnel, self.place = config, pairing, phones, tunnel, place
        self.router, self.environments, self.allow, self.push, self.waits = router, environments, allow, push, waits

    def get(self, request: PhoneRequest) -> ShareAnswer:
        rest = request.rest
        if not rest:
            return self.page(request.path.split("?", 1)[0])
        if rest == ["state"]:
            return self.state(request)
        if rest == ["push-key"]:
            return self.json(200, {"key": PushKeys.unpadded(self.push.keys().public)})
        if rest == ["waiting"]:
            return self.waiting(request)
        if rest[0] == "journal":
            return self.through(request)
        if rest[0] == "assets" and len(rest) == 2:
            return SharePages.asset(rest[1])
        if rest[0] in PUBLIC:
            return self.public(rest)
        if rest == ["sw.js"]:
            return self.worker()
        if rest == ["manifest.webmanifest"]:
            return self.manifest()
        if len(rest) == 1 and rest[0] in ICONS:
            return ShareAnswer(200, PhoneIcon(COLOR).png(ICONS[rest[0]]), "image/png", {"Cache-Control": "public, max-age=86400"})
        return SharePages.gone(404)

    @staticmethod
    def page(address: str) -> ShareAnswer:
        if not address.endswith("/"):
            return ShareAnswer(301, headers={"Location": "/p/"})
        page = APP / PAGE
        if not page.is_file():
            return SharePages.gone(404)
        return ShareAnswer(200, page.read_bytes(), headers=PAGE_HEADERS)

    @staticmethod
    def public(rest: list[str]) -> ShareAnswer:
        root = (APP / rest[0]).resolve()
        found = (APP / "/".join(rest)).resolve()
        if root not in found.parents or not found.is_file():
            return SharePages.gone(404)
        kind = mimetypes.guess_type(found.name)[0] or "application/octet-stream"
        return ShareAnswer(200, found.read_bytes(), kind, {"Cache-Control": "public, max-age=3600", **APP_HEADERS})

    @staticmethod
    def worker() -> ShareAnswer:
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
        given = self.given(request)
        if given is None:
            return self.json(403, {"error": "refused"})
        if request.rest == ["pair"]:
            return self.pair(PairRequest.from_payload(given))
        phone = self.phone(request)
        if not isinstance(phone, Phone):
            return phone
        if request.rest[:1] == ["journal"]:
            return self.forward(request, phone, given)
        if request.rest == ["push"]:
            return self.subscribe(phone, str(given.get("endpoint", "")))
        if request.rest == ["disconnect"]:
            self.pairing.disconnect(phone, Actor.phone(phone.id), datetime.now(timezone.utc))
            return self.json(200, {"disconnected": phone.id}, {"Set-Cookie": f"{COOKIE}=; Max-Age=0; Path=/; Secure; HttpOnly; SameSite=Strict"})
        return self.json(404, {"error": "no such action"})

    def given(self, request: PhoneRequest) -> dict | None:
        if not self.is_trusted(request.origin) or request.app_header != "1" or not request.content_type.startswith("application/json"):
            return None
        try:
            loaded = json.loads(request.body or b"{}")
        except ValueError:
            return None
        return loaded if isinstance(loaded, dict) else None

    def is_trusted(self, origin: str) -> bool:
        port = self.place.kept().port
        return origin in (f"https://{self.tunnel.address()}", f"http://127.0.0.1:{port}", f"http://localhost:{port}")

    def pair(self, asked: PairRequest) -> ShareAnswer:
        now = datetime.now(timezone.utc)
        try:
            paired = self.pairing.pair(asked.code, asked.device, now)
        except Refused as refused:
            return self.json(410, {"error": str(refused)})
        lasts = int((paired.phone.expires_at - now).total_seconds())
        cookie = f"{COOKIE}={paired.key}; Max-Age={lasts}; Path=/; Secure; HttpOnly; SameSite=Strict"
        return self.json(200, asdict(self.snapshot(paired.phone)), {"Set-Cookie": cookie})

    def phone(self, request: PhoneRequest) -> Phone | ShareAnswer:
        kept = SimpleCookie(request.cookies).get(COOKIE)
        if not (kept and kept.value):
            return self.json(401, {"error": "this phone is not connected"})
        phone = self.phones.by_key(Pairing.hashed(kept.value))
        if phone is None:
            return self.json(401, {"error": "this phone was paired with an earlier version of the journal, or was forgotten: pair it again", "paired_before": True})
        now = datetime.now(timezone.utc)
        if not phone.is_live(now):
            return self.json(410, {"error": "this phone was disconnected" if phone.ended_at else "this phone's connection has run out"})
        return self.phones.save(phone.seen(now), Actor.phone(phone.id)) if phone.is_due_a_sighting(now) else phone

    def through(self, request: PhoneRequest) -> ShareAnswer:
        phone = self.phone(request)
        return self.forward(request, phone, {}) if isinstance(phone, Phone) else phone

    def forward(self, request: PhoneRequest, phone: Phone, body: dict) -> ShareAnswer:
        url = urlsplit(request.path.removeprefix("/p"))
        query = {name: values[-1] for name, values in parse_qs(url.query).items()}
        environment = self.environments.find(phone.environment_id).name
        asked = Request(request.method, url.path, query, body, {}, {ENV_HEADER.lower(): environment}, Actor.phone(phone.id))
        route = self.router.matched(asked)
        if route is None or not self.allow.allows(route) or query.get("env", environment) != environment:
            return self.json(403, {"error": "a phone reaches only the pages its app uses, in its own environment"})
        answer = self.router.dispatch(asked)
        if isinstance(answer, FileResponse):
            return ShareAnswer(answer.status, answer.body, answer.kind, {"Cache-Control": "private, max-age=3600", **APP_HEADERS, **FILE_HEADERS, **answer.headers()})
        return ShareAnswer(answer.status, answer.encoded(), "application/json", {"Cache-Control": "no-store", **APP_HEADERS})

    def waiting(self, request: PhoneRequest) -> ShareAnswer:
        phone = self.phone(request)
        return self.json(200, {"waiting": [{"ref": ref} for ref in self.waits.refs(phone)]}) if isinstance(phone, Phone) else phone

    def subscribe(self, phone: Phone, endpoint: str) -> ShareAnswer:
        if not self.push.is_allowed(endpoint):
            return self.json(422, {"error": "a phone's notifications come only through Apple's, Google's, Mozilla's or Microsoft's push service"})
        self.phones.save(phone.subscribed(endpoint, self.waits.refs(phone)), Actor.phone(phone.id))
        return self.json(201, {"subscribed": True})

    def state(self, request: PhoneRequest) -> ShareAnswer:
        phone = self.phone(request)
        return self.json(200, asdict(self.snapshot(phone))) if isinstance(phone, Phone) else phone

    def snapshot(self, phone: Phone) -> PhoneSnapshot:
        return PhoneSnapshot(phone.name, phone.id, phone.expires_at.isoformat(), self.environments.find(phone.environment_id).name, self.config.root.name, COLOR)

    @staticmethod
    def json(status: int, body: dict, headers: dict | None = None) -> ShareAnswer:
        return ShareAnswer(status, json.dumps(body).encode(), "application/json", {"Cache-Control": "no-store", **APP_HEADERS, **(headers or {})})
