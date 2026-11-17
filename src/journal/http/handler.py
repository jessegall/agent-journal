from urllib.parse import urlsplit

from journal.http.support.json_out import JsonOut
from journal.http.support.file_response import FileResponse
from journal.engine.lifecycle import Lifecycle
from journal.http.support.identity import Identity
from journal.http.support.pooled_handler import PooledHandler
from journal.http.support.request import Request
from journal.support.actor import Actor
from journal.http.support.request_faults import RequestFaults
from journal.support.fault_log import FaultLog
from journal.http.support.request_reading import RequestReading
from journal.support.response import Response
from journal.http.router import Router
from journal.http.static_files import StaticFiles
from journal.http.support.stream_response import StreamResponse


# the one question answered while the journal boots: which phase it is in
UNHELD_PATHS = ("/journal/health",)

CROSS_SITE_FETCHES = ("cross-site", "same-site")


class Handler(PooledHandler):
    """Turns one HTTP exchange into a Request for the router and writes its Response back, holding it while the journal boots and counting the requests that fail in a row; the health question is read without who asks it, so a journal that fails to read its callers can still say it is unwell."""

    router: Router
    identity: Identity
    static: StaticFiles
    lifecycle: Lifecycle
    faults: RequestFaults
    fault_log: FaultLog

    def do_GET(self) -> None:
        if urlsplit(self.path).path in UNHELD_PATHS:
            return self._answer(self._dispatched(self._unidentified_request()))
        request = self._counted_request()
        if not request.path.startswith(("/journal/", "/hooks/", "/cli")) and self.router.matched(request) is None and (rows := self.static.serve(request.path)):
            return self._file(rows)
        self._answer(self._dispatched(request))

    def do_POST(self) -> None:
        if self._is_cross_site():
            return self._answer(Response(403, {"error": "a write from another site is refused"}))
        request = self._counted_request()
        self._answer(self._dispatched(request))

    # a page on another site can make the browser post here with the user's login, so a write the browser marks as
    # coming from elsewhere is refused; the journal's own commands send no Origin and pass
    def _is_cross_site(self) -> bool:
        if self.headers.get("Sec-Fetch-Site", "") in CROSS_SITE_FETCHES:
            return True
        origin = self.headers.get("Origin", "")
        return bool(origin) and (origin == "null" or urlsplit(origin).netloc != self.headers.get("Host", ""))

    def _unidentified_request(self) -> Request:
        head = RequestReading.head(self.command, self.path, dict(self.headers.items()))
        return Request(head.method, urlsplit(self.path).path, {}, {}, {}, head.headers, Actor.system())

    def _counted_request(self) -> Request:
        try:
            return self._request()
        except Exception as fault:
            self.faults.failed(fault)
            self.fault_log.reported(f"request {self.command} {urlsplit(self.path).path}", fault)
            raise

    def _dispatched(self, request: Request):
        try:
            answer = self.router.route(request)
        except Exception as fault:
            self.fault_log.reported(f"request {request.method} {request.path}", fault)
            self.faults.failed(fault)
            return Response(500, {"error": f"{type(fault).__name__}: {fault}"})
        self.faults.answered()
        return answer

    def _answer(self, answer) -> None:
        if isinstance(answer, StreamResponse):
            return self._stream(answer)
        if isinstance(answer, FileResponse):
            return self._file(answer)
        self._reply(answer)

    def log_message(self, format, *args) -> None:
        return None

    def _request(self) -> Request:
        length = int(self.headers.get("Content-Length", 0))
        raw = self.rfile.read(length) if length else b""
        request = RequestReading.read(RequestReading.head(self.command, self.path, dict(self.headers.items())), raw, self.identity)
        if request.path in UNHELD_PATHS:
            return request
        boot_wait = self.lifecycle.boot_wait_seconds()
        return request.boot_delayed(boot_wait) if boot_wait else request

    def _file(self, file: FileResponse) -> None:
        self.send_response(file.status)
        self.send_header("Content-Type", file.content_type)
        self.send_header("Content-Length", str(len(file.body)))
        self.send_header("Cache-Control", "no-cache")
        for name, value in file.headers().items():
            self.send_header(name, value)
        self.end_headers()
        self.wfile.write(file.body)

    def _stream(self, response: StreamResponse) -> None:
        self.send_response(response.status)
        self.send_header("Content-Type", response.content_type)
        self.send_header("Cache-Control", "no-cache")
        self.send_header("Connection", "close")
        self.end_headers()
        try:
            for block in response.blocks:
                self.wfile.write(block)
                self.wfile.flush()
        except (BrokenPipeError, ConnectionResetError):
            return
        except Exception as fault:
            self.fault_log.reported(f"streamed answer {urlsplit(self.path).path}", fault)
            self.wfile.write(f"the journal failed while answering: {type(fault).__name__}: {fault}\n".encode())

    def _reply(self, response: Response) -> None:
        body = JsonOut.encoded(response.body)
        self.send_response(response.status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        for name, value in response.headers.items():
            self.send_header(name, value)
        self.end_headers()
        self.wfile.write(body)
