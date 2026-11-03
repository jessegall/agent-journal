import socket
import threading
import time
from http.server import ThreadingHTTPServer

from server.handover_descriptors import QUEUED_CONNECTIONS
from server.viewer.viewer_login import ViewerLogin
from server.viewer.viewer_request_handler import ViewerRequestHandler
from server.viewer.viewer_routes import ViewerRoutes
from server.listener_thread import STOP_LIMIT_SECONDS

VIEWER_ADDRESS = "127.0.0.1"
STOP_POLL_SECONDS = 0.05
PORT_WAIT_SECONDS = 10.0
PORT_POLL_SECONDS = 0.1


class ViewerListener(ThreadingHTTPServer):
    """The viewer's HTTP listener on 127.0.0.1, beside the journal's socket, on the port it had
    before a restart, waiting for the old server to let it go, or one the system picks when it
    stays taken; it answers only requests that carry the login cookie and name its own address
    as their host. A server that replaces another takes that server's listening socket, port and waiting
    connections with it."""

    daemon_threads = True
    request_queue_size = QUEUED_CONNECTIONS

    def __init__(self, login: ViewerLogin, routes: ViewerRoutes, last_port: int = 0, port_wait_seconds: float = PORT_WAIT_SECONDS,
                 inherited_socket: socket.socket | None = None) -> None:
        if inherited_socket is None:
            self.bind_port(last_port, port_wait_seconds)
        else:
            super().__init__(inherited_socket.getsockname(), ViewerRequestHandler, bind_and_activate=False)
            self.socket.close()
            self.socket = inherited_socket
        self.login, self.routes = login, routes
        self.thread = threading.Thread(target=self.serve, name="viewer", daemon=True)

    def bind_port(self, last_port: int, port_wait_seconds: float) -> None:
        deadline = time.monotonic() + port_wait_seconds
        while True:
            try:
                super().__init__((VIEWER_ADDRESS, last_port), ViewerRequestHandler)
                return
            except OSError:
                if time.monotonic() >= deadline:
                    super().__init__((VIEWER_ADDRESS, 0), ViewerRequestHandler)
                    return
                time.sleep(PORT_POLL_SECONDS)

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
        self.server_close()
        self.thread.join(STOP_LIMIT_SECONDS)
