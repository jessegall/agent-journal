import base64
import hashlib
import http.server
import json
import secrets
import threading
import time
import urllib.error
import urllib.parse
import urllib.request
import webbrowser
from dataclasses import asdict, dataclass, field
from typing import Callable, ClassVar

from resources.fields import Loaded
from features.integrations.client import OPENER, TIMEOUT
from resources.base import Refused

WELL_KNOWN = "/.well-known/oauth-authorization-server"
WAIT = 180.0
CALLBACK = "/callback"
RENEWAL_SUFFIX = "_RENEWAL"
RENEW_BEFORE = 120.0
OPEN_BROWSER = webbrowser.open


@dataclass(frozen=True)
class Endpoints(Loaded):
    """Where a service's own sign-in lives: the page to send you to, where the code is exchanged, and where this journal registers itself."""

    aliases: ClassVar[dict] = {"authorize": ("authorization_endpoint",), "token": ("token_endpoint",), "register": ("registration_endpoint",), "revocation": ("revocation_endpoint",)}
    authorize: str = ""
    token: str = ""
    register: str = ""
    revocation: str = ""


@dataclass(frozen=True)
class Registered(Loaded):
    client_id: str = ""


@dataclass(frozen=True)
class Granted(Loaded):
    access_token: str = ""
    refresh_token: str = ""
    expires_in: int = 0


@dataclass(frozen=True)
class Renewal(Loaded):
    """What renews a sign-in when its token runs out: the refresh token, the client it was granted to, where to exchange it, and when the token expires."""

    refresh_token: str = ""
    client_id: str = ""
    token_url: str = ""
    expires_at: float = 0.0

    @classmethod
    def of(cls, granted: Granted, client_id: str, token_url: str, kept: str = "") -> "Renewal":
        return cls(granted.refresh_token or kept, client_id, token_url, time.time() + granted.expires_in if granted.expires_in else 0.0)

    @classmethod
    def read(cls, text: str) -> "Renewal":
        return cls.from_json(json.loads(text)) if text else cls()

    def text(self) -> str:
        return json.dumps(asdict(self))

    def due(self) -> bool:
        return bool(self.refresh_token and self.expires_at and self.expires_at - time.time() < RENEW_BEFORE)

    def lapsed(self) -> bool:
        return bool(self.expires_at) and self.expires_at < time.time()


@dataclass(frozen=True)
class Signin:
    """A finished sign-in: the token as a bearer value, and what renews it."""

    bearer: str
    renewal: Renewal


@dataclass
class Returned:
    """What the sign-in page sent back to the journal's own address on this machine."""

    code: str = ""
    state: str = ""
    failure: str = ""
    seen: threading.Event = field(default_factory=threading.Event)


def fetched(url: str, data: bytes | None = None, headers: dict | None = None) -> str:
    request = urllib.request.Request(url, data=data, headers=headers or {})
    try:
        with OPENER.open(request, timeout=TIMEOUT) as answer:
            return answer.read().decode()
    except (urllib.error.URLError, OSError) as error:
        raise Refused(f"could not reach {urllib.parse.urlsplit(url).netloc}: {error}") from None


def encoded(raw: bytes) -> str:
    return base64.urlsafe_b64encode(raw).rstrip(b"=").decode()


def discovered(origin: str) -> Endpoints:
    found = Endpoints.from_json(json.loads(fetched(origin.rstrip("/") + WELL_KNOWN)))
    if not (found.authorize and found.token and found.register):
        raise Refused(f"{origin} does not offer a sign-in this journal can use")
    return found


def registered(endpoints: Endpoints, redirect: str, name: str) -> str:
    body = json.dumps({"client_name": name, "redirect_uris": [redirect], "grant_types": ["authorization_code"], "response_types": ["code"], "token_endpoint_auth_method": "none"})
    return Registered.from_json(json.loads(fetched(endpoints.register, body.encode(), {"Content-Type": "application/json"}))).client_id


def listening(returned: Returned) -> http.server.HTTPServer:
    class Callback(http.server.BaseHTTPRequestHandler):
        def do_GET(self):
            asked = urllib.parse.parse_qs(urllib.parse.urlsplit(self.path).query)
            returned.code, returned.state = asked.get("code", [""])[0], asked.get("state", [""])[0]
            returned.failure = asked.get("error", [""])[0]
            self.send_response(200)
            self.send_header("Content-Type", "text/plain")
            self.end_headers()
            self.wfile.write(b"You are signed in. You can close this window.")
            returned.seen.set()

        def log_message(self, *_):
            pass

    return http.server.HTTPServer(("127.0.0.1", 0), Callback)


def signed_in(origin: str, name: str, opener: Callable[[str], object] = OPEN_BROWSER) -> Signin:
    """The service's own sign-in for this journal: you sign in in your browser, the journal exchanges the code it gets back for a token and answers the token as a bearer value; nothing is typed or copied."""
    endpoints = discovered(origin)
    returned = Returned()
    server = listening(returned)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    try:
        redirect = f"http://127.0.0.1:{server.server_port}{CALLBACK}"
        client_id = registered(endpoints, redirect, name)
        verifier, state = secrets.token_urlsafe(64), secrets.token_urlsafe(16)
        query = urllib.parse.urlencode({"response_type": "code", "client_id": client_id, "redirect_uri": redirect, "state": state,
                                        "code_challenge": encoded(hashlib.sha256(verifier.encode()).digest()), "code_challenge_method": "S256"})
        opener(f"{endpoints.authorize}?{query}")
        if not returned.seen.wait(WAIT):
            raise Refused("no sign-in came back in three minutes")
    finally:
        server.shutdown()
    if returned.failure or not returned.code or returned.state != state:
        raise Refused(f"the sign-in did not finish: {returned.failure or 'it did not come back as asked'}")
    form = urllib.parse.urlencode({"grant_type": "authorization_code", "code": returned.code, "redirect_uri": redirect, "client_id": client_id, "code_verifier": verifier})
    granted = Granted.from_json(json.loads(fetched(endpoints.token, form.encode(), {"Content-Type": "application/x-www-form-urlencoded"})))
    if not granted.access_token:
        raise Refused("the service gave no token")
    return Signin(f"Bearer {granted.access_token}", Renewal.of(granted, client_id, endpoints.token))


def renewed(renewal: Renewal) -> Signin:
    """A new token for a sign-in whose token runs out, from its refresh token; the service may hand a new refresh token with it."""
    form = urllib.parse.urlencode({"grant_type": "refresh_token", "refresh_token": renewal.refresh_token, "client_id": renewal.client_id})
    granted = Granted.from_json(json.loads(fetched(renewal.token_url, form.encode(), {"Content-Type": "application/x-www-form-urlencoded"})))
    if not granted.access_token:
        raise Refused("the service did not renew the sign-in")
    return Signin(f"Bearer {granted.access_token}", Renewal.of(granted, renewal.client_id, renewal.token_url, kept=renewal.refresh_token))


def revoked(origin: str, bearer: str) -> None:
    """Asks the service to void a token it gave, where it offers that; the token is dropped here whatever it answers."""
    endpoints = discovered(origin)
    if not endpoints.revocation:
        return
    form = urllib.parse.urlencode({"token": bearer.removeprefix("Bearer ")})
    fetched(endpoints.revocation, form.encode(), {"Content-Type": "application/x-www-form-urlencoded"})
