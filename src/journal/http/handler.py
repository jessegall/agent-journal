import json
import traceback
from urllib.parse import parse_qs, urlsplit

from journal.http.support.file_response import FileResponse
from journal.http.support.identity import Identity
from journal.http.support.multipart import Multipart
from journal.http.support.pooled_handler import PooledHandler
from journal.http.support.request import Request
from journal.support.response import Response
from journal.http.router import Router
from journal.http.static_files import StaticFiles
from journal.http.support.stream_response import StreamResponse


class Handler(PooledHandler):
    """Turns one HTTP exchange into a Request for the router and writes its Response back; nothing else lives here."""

    router: Router
    identity: Identity
    static: StaticFiles

    def do_GET(self) -> None:
        request = self._request()
        if not request.path.startswith(("/journal/", "/hooks/", "/cli")) and (found := self.static.serve(request.path)):
            return self._file(found)
        self._answer(self._dispatched(request))

    def do_POST(self) -> None:
        self._answer(self._dispatched(self._request()))

    def _dispatched(self, request: Request):
        try:
            return self.router.dispatch(request)
        except Exception as fault:
            traceback.print_exc()
            return Response(500, {"error": f"{type(fault).__name__}: {fault}"})

    def _answer(self, answer) -> None:
        if isinstance(answer, StreamResponse):
            return self._stream(answer)
        if isinstance(answer, FileResponse):
            return self._file(answer)
        self._reply(answer)

    def log_message(self, format, *args) -> None:
        return None

    def _request(self) -> Request:
        url = urlsplit(self.path)
        length = int(self.headers.get("Content-Length", 0))
        raw = self.rfile.read(length) if length else b""
        headers = {name.lower(): value for name, value in self.headers.items()}
        query = {k: v[-1] for k, v in parse_qs(url.query).items()}
        if headers.get("content-type", "") == "application/octet-stream":
            return Request(self.command, url.path, query, {"raw": raw}, {}, headers, self.identity.of(headers))
        if headers.get("content-type", "").startswith("multipart/form-data"):
            form = Multipart(headers["content-type"], raw)
            return Request(self.command, url.path, query, form.fields(), {}, headers, self.identity.of(headers), form.files())
        return Request(self.command, url.path, query, json.loads(raw) if raw else {}, {}, headers, self.identity.of(headers))

    def _file(self, file: FileResponse) -> None:
        self.send_response(file.status)
        self.send_header("Content-Type", file.kind)
        self.send_header("Content-Length", str(len(file.body)))
        self.send_header("Cache-Control", "no-cache")
        for name, value in file.headers().items():
            self.send_header(name, value)
        self.end_headers()
        self.wfile.write(file.body)

    def _stream(self, response: StreamResponse) -> None:
        self.send_response(response.status)
        self.send_header("Content-Type", response.kind)
        self.send_header("Cache-Control", "no-cache")
        self.send_header("Connection", "close")
        self.end_headers()
        try:
            for chunk in response.chunks:
                self.wfile.write(chunk)
                self.wfile.flush()
        except (BrokenPipeError, ConnectionResetError, OSError):
            return

    def _reply(self, response: Response) -> None:
        body = response.encoded()
        self.send_response(response.status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)
