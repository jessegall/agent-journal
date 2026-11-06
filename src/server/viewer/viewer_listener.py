import socket
import threading
import time
from http.server import HTTPServer

from server.handover_descriptors import QUEUED_CONNECTIONS
from server.tracked_requests import TrackedRequests
from server.viewer.viewer_login import ViewerLogin
from server.viewer.viewer_request_handler import ViewerRequestHandler
from server.viewer.viewer_routes import ViewerRoutes
from server.listener_thread import STOP_LIMIT_SECONDS

VIEWER_ADDRESS = "127.0.0.1"
STOP_POLL_SECONDS = 0.05
PORT_WAIT_SECONDS = 10.0
PORT_POLL_SECONDS = 0.1


class ViewerListener(TrackedRequests, HTTPServer):
    """The viewer's HTTP listener on 127.0.0.1, beside the journal's socket, on the port it had
    before a restart, waiting for the old server to let it go, or one the system picks when it
    stays taken; it answers only requests that carry the login cookie and name its own address
    as their host. A server that replaces another takes that server's listening socket, port and waiting
    connections with it. A stop waits for the requests that run; an event stream does not hold it, as its
    client connects again and reaches the next server."""

    request_queue_size = QUEUED_CONNECTIONS

    def __init__(self, login: ViewerLogin, routes: ViewerRoutes, last_port: int = 0, port_wait_seconds: float = PORT_WAIT_SECONDS,
                 inherited_socket: socket.socket | None = None) -> None:
        deadline = time.monotonic() + port_wait_seconds
        while True:
            try:
                super().__init__((VIEWER_ADDRESS, last_port), ViewerRequestHandler, inherited_socket=inherited_socket)
                break
            except OSError:
                if time.monotonic() >= deadline:
                    super().__init__((VIEWER_ADDRESS, 0), ViewerRequestHandler)
                    break
                time.sleep(PORT_POLL_SECONDS)
        self.login, self.routes = login, routes
        self.thread = threading.Thread(target=self.serve, name="viewer", daemon=True)

    @property
    def port(self) -> int:
        return self.server_address[1]

    @property
    def host(self) -> str:
        return f"{VIEWER_ADDRESS}:{self.port}"

    def serve(self) -> None:
        self.serve_forever(STOP_POLL_SECONDS)

    def start(self) -> None:
        self.thread.start()

    def stop(self) -> None:
        self.shutdown()
        self.drain(STOP_LIMIT_SECONDS)
        self.server_close()
        self.thread.join(STOP_LIMIT_SECONDS)
