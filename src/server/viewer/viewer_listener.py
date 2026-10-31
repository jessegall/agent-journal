import threading
from http.server import ThreadingHTTPServer

from server.viewer.viewer_login import ViewerLogin
from server.viewer.viewer_request_handler import ViewerRequestHandler
from server.viewer.viewer_routes import ViewerRoutes

VIEWER_ADDRESS = "127.0.0.1"
STOP_LIMIT_SECONDS = 10.0
STOP_POLL_SECONDS = 0.05


class ViewerListener(ThreadingHTTPServer):
    """The viewer's HTTP listener on 127.0.0.1, beside the journal's socket, on a port the system picks; it answers
    only requests that carry the login cookie and name its own address as their host."""

    daemon_threads = True

    def __init__(self, login: ViewerLogin, routes: ViewerRoutes) -> None:
        super().__init__((VIEWER_ADDRESS, 0), ViewerRequestHandler)
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
