import json
from dataclasses import asdict
from http.server import BaseHTTPRequestHandler
from urllib.parse import parse_qsl, urlsplit

from sync_server.login_request import LoginRequest
from sync_server.push_request import PushRequest
from sync_server.refusal import Refusal

BEARER = "Bearer "
FORWARDED_HEADER = "X-Forwarded-For"


class TeamRequestHandler(BaseHTTPRequestHandler):
    """One request to the team server, answered in JSON: POST /login, POST /push, GET /pull?after=<sequence>&wait=<seconds> and GET /copy; a refusal is a 403 with its line, an unknown path a 404."""

    def do_GET(self) -> None:
        url = urlsplit(self.path)
        query = dict(parse_qsl(url.query))
        routes = {"/pull": lambda: self.server.team.pulls.answer(self.token(), int(query.get("after", "0")), float(query.get("wait", "0"))), "/copy": lambda: self.server.team.copies.answer(self.token())}
        self.answered(routes.get(url.path))

    def do_POST(self) -> None:
        routes = {"/login": lambda: self.login(self.login_request()), "/push": lambda: self.server.team.pushes.answer(self.token(), self.push_request(), self.server.team.clock.time())}
        self.answered(routes.get(urlsplit(self.path).path))

    def login(self, request: LoginRequest):
        return self.server.team.logins.answer(request.email, request.password, request.device_name, self.address())

    def answered(self, route) -> None:
        if route is None:
            self.sent(404, {"error": f"no such path: {self.path}"})
            return
        try:
            self.sent(200, asdict(route()))
        except Refusal as refusal:
            self.sent(403, {"error": str(refusal)})

    def sent(self, status: int, body: dict) -> None:
        text = json.dumps(body).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(text)))
        self.end_headers()
        self.wfile.write(text)

    def login_request(self) -> LoginRequest:
        return LoginRequest(**json.loads(self.raw_body() or b"{}"))

    def push_request(self) -> PushRequest:
        return PushRequest.parsed(**json.loads(self.raw_body() or b"{}"))

    def raw_body(self) -> bytes:
        return self.rfile.read(int(self.headers.get("Content-Length", "0")))

    def token(self) -> str:
        header = self.headers.get("Authorization", "")
        if not header.startswith(BEARER):
            raise Refusal("this request carries no device token: log in with journal team login")
        return header[len(BEARER):]

    def address(self) -> str:
        return self.headers.get(FORWARDED_HEADER, "").split(",")[0].strip() or self.client_address[0]

    def log_message(self, format: str, *values) -> None:
        return None
