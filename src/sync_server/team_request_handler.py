import json
from typing import Callable
from dataclasses import asdict
from http.server import BaseHTTPRequestHandler
from urllib.parse import parse_qsl, urlsplit

from sync_server.accept_request import AcceptRequest
from sync_server.admin_request import AdminRequest
from sync_server.blocks_request import BlocksRequest
from sync_server.file_answer import FileAnswer
from sync_server.file_place import FilePlace
from sync_server.lease_request import LeaseRequest
from sync_server.login_request import LoginRequest
from sync_server.protocol import MIGRATION_HEADER, PROTOCOL, PROTOCOL_HEADER, UNVERSIONED
from sync_server.push_request import PushRequest
from sync_server.refusal import Refusal
from sync_server.upload_request import UploadRequest

BEARER = "Bearer "
FILES_PATH = "/files/"
FORWARDED_HEADER = "X-Forwarded-For"


class TeamRequestHandler(BaseHTTPRequestHandler):
    """One request to the team server, answered in JSON: POST /login, /accept, /push, /blocks, /invite, /devices/revoke, /people/remove, /team/version and /upload, GET /pull?after=<sequence>&wait=<seconds>, /copy, /devices and /team, which alone needs no token; /files/<table>/<row>/<name>, read with GET and written with POST of its bytes, and /leases?name=<name>, which POST /leases/take and /leases/release change; a refusal is a 403 with its line, an unknown path a 404. Every request names the protocol its journal speaks and every answer the server's: a journal on an older protocol is answered 426 with the line to upgrade it, and a push or pull from a journal on an older migration than the team's is refused with it."""

    def do_GET(self) -> None:
        if self.is_outdated_client():
            return
        url = urlsplit(self.path)
        if url.path.startswith(FILES_PATH):
            self.file_answer(lambda: self.server.team.files.get(self.file_place(url.path)))
            return
        query = dict(parse_qsl(url.query))
        team = self.server.team
        routes = {"/pull": lambda: self.current(lambda: team.pulls.answer(self.token(), int(query.get("after", "0")), float(query.get("wait", "0")))), "/copy": lambda: team.copies.answer(self.token()), "/devices": lambda: team.admins.listed(self.token()), "/team": lambda: team.details.answer(), "/leases": lambda: self.lease_state(query.get("name", ""))}
        self.answered(routes.get(url.path))

    def do_POST(self) -> None:
        if self.is_outdated_client():
            return
        team = self.server.team
        if urlsplit(self.path).path.startswith(FILES_PATH):
            self.answered(lambda: FileAnswer(team.files.put(self.file_place(urlsplit(self.path).path), self.raw_body())))
            return
        routes = {
            "/login": lambda: self.login(self.login_request()),
            "/accept": lambda: team.logins.accepted(self.typed(AcceptRequest), self.address()),
            "/push": lambda: self.current(lambda: team.pushes.answer(self.token(), self.push_request(), team.clock.time())),
            "/blocks": lambda: team.blocks.answer(self.token(), self.typed(BlocksRequest).tables),
            "/invite": lambda: team.admins.invite(self.token(), self.typed(AdminRequest).email),
            "/devices/revoke": lambda: team.admins.revoke(self.token(), self.typed(AdminRequest).device_id),
            "/people/remove": lambda: team.admins.remove(self.token(), self.typed(AdminRequest).account_id),
            "/team/version": lambda: team.admins.pin(self.token(), self.typed(AdminRequest).version),
            "/upload": lambda: self.uploaded(self.typed(UploadRequest.parsed)),
            "/leases/take": lambda: team.leases.acquire(self.typed(LeaseRequest).name, team.devices.device(self.token()), team.devices.person(self.token()), team.clock.time()),
            "/leases/release": lambda: team.leases.release(self.typed(LeaseRequest).name, team.devices.device(self.token()), team.clock.time()),
        }
        self.answered(routes.get(urlsplit(self.path).path))

    def is_outdated_client(self) -> bool:
        client_protocol = int(self.headers.get(PROTOCOL_HEADER, UNVERSIONED))
        if client_protocol >= PROTOCOL:
            return False
        self.sent(426, {"error": f"this journal speaks protocol {client_protocol} and the team server {PROTOCOL}: upgrade the journal with journal update apply"})
        return True

    def current(self, route):
        self.server.team.details.require_migration(int(self.headers.get(MIGRATION_HEADER, UNVERSIONED)))
        return route()

    def end_headers(self) -> None:
        self.send_header(PROTOCOL_HEADER, str(PROTOCOL))
        super().end_headers()

    def login(self, request: LoginRequest):
        return self.server.team.logins.answer(request, self.address())

    def answered(self, route) -> None:
        if route is None:
            self.sent(404, {"error": f"no such path: {self.path}"})
            return
        try:
            self.sent(200, asdict(route()))
        except Refusal as refusal:
            self.sent(403, {"error": str(refusal)})

    def file_place(self, path: str) -> FilePlace:
        self.server.team.devices.device(self.token())
        return FilePlace.parsed(path.removeprefix(FILES_PATH))

    def file_answer(self, read) -> None:
        try:
            data = read()
        except Refusal as refusal:
            self.sent(404, {"error": str(refusal)})
            return
        self.send_response(200)
        self.send_header("Content-Type", "application/octet-stream")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def sent(self, status: int, body: dict) -> None:
        text = json.dumps(body).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(text)))
        self.end_headers()
        self.wfile.write(text)

    def lease_state(self, name: str):
        self.server.team.devices.device(self.token())
        return self.server.team.leases.state(name, self.server.team.clock.time())

    def uploaded(self, request: UploadRequest):
        return self.server.team.uploads.answer(self.token(), request)

    def login_request(self) -> LoginRequest:
        return self.typed(LoginRequest)

    def push_request(self) -> PushRequest:
        return self.typed(PushRequest.parsed)

    def typed(self, kind: Callable):
        try:
            return kind(**json.loads(self.raw_body() or b"{}"))
        except (TypeError, ValueError) as wrong:
            raise Refusal(f"the body of this request is not what {urlsplit(self.path).path} takes: {wrong}") from wrong

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
