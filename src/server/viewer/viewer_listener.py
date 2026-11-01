import threading
import time
from http.server import ThreadingHTTPServer

from server.viewer.viewer_login import ViewerLogin
from server.viewer.viewer_request_handler import ViewerRequestHandler
from server.viewer.viewer_routes import ViewerRoutes

VIEWER_ADDRESS = "127.0.0.1"
STOP_LIMIT_SECONDS = 1.5
STOP_POLL_SECONDS = 0.05
PORT_WAIT_SECONDS = 10.0
PORT_POLL_SECONDS = 0.1


class ViewerListener(ThreadingHTTPServer):
    """The viewer's HTTP listener on 127.0.0.1, beside the journal's socket, on the port it had before a restart, waiting
    for the old server to let it go, or one the system picks when it stays taken; it answers only requests that carry the login cookie and name its
    own address as their host."""

    daemon_threads = True

    def __init__(self, login: ViewerLogin, routes: ViewerRoutes, remembered_port: int = 0, port_wait_seconds: float = PORT_WAIT_SECONDS) -> None:
        give_up_at = time.monotonic() + port_wait_seconds
        while True:
            try:
                super().__init__((VIEWER_ADDRESS, remembered_port), ViewerRequestHandler)
                break
            except OSError:
                if time.monotonic() >= give_up_at:
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
        self.server_close()
        self.thread.join(STOP_LIMIT_SECONDS)
