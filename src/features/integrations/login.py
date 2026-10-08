import base64
import hashlib
import http.server
import json
import secrets
import threading
import urllib.error
import urllib.parse
import urllib.request
import webbrowser
from dataclasses import dataclass, field
from typing import Callable, ClassVar

from engine.fields import Loaded
from features.integrations.client import OPENER, TIMEOUT
from resources.base import Refused

WELL_KNOWN = "/.well-known/oauth-authorization-server"
WAIT = 180.0
CALLBACK = "/callback"
OPEN_BROWSER = webbrowser.open


@dataclass(frozen=True)
class Endpoints(Loaded):
    """Where a service's own sign-in lives: the page to send you to, where the code is exchanged, and where this journal registers itself."""

    aliases: ClassVar[dict] = {"authorize": ("authorization_endpoint",), "token": ("token_endpoint",), "register": ("registration_endpoint",)}
    authorize: str = ""
    token: str = ""
    register: str = ""


@dataclass(frozen=True)
class Registered(Loaded):
    client_id: str = ""


@dataclass(frozen=True)
class Granted(Loaded):
    access_token: str = ""


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


def signed_in(origin: str, name: str, opener: Callable[[str], object] = OPEN_BROWSER) -> str:
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
    token = Granted.from_json(json.loads(fetched(endpoints.token, form.encode(), {"Content-Type": "application/x-www-form-urlencoded"}))).access_token
    if not token:
        raise Refused("the service gave no token")
    return f"Bearer {token}"
