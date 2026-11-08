import threading

from server.listener_thread import STOP_LIMIT_SECONDS
from server.tracked_requests import TrackedRequests
from server.viewer.viewer_login import ViewerLogin
from server.viewer.viewer_routes import ViewerRoutes

STOP_POLL_SECONDS = 0.05


class ViewerEndpoint(TrackedRequests):
    """What every viewer listener shares: the login and routes it answers with, the thread it serves on, and a
    stop that waits for the requests that run."""

    login: ViewerLogin
    routes: ViewerRoutes

    def attach(self, login: ViewerLogin, routes: ViewerRoutes) -> None:
        self.login, self.routes = login, routes
        self.thread = threading.Thread(target=self.serve, name="viewer", daemon=True)

    @property
    def port(self) -> int:
        raise NotImplementedError

    @property
    def host(self) -> str:
        raise NotImplementedError

    def serve(self) -> None:
        self.serve_forever(STOP_POLL_SECONDS)  # type: ignore[attr-defined]

    def start(self) -> None:
        self.thread.start()

    def stop(self) -> None:
        self.shutdown()  # type: ignore[attr-defined]
        self.drain(STOP_LIMIT_SECONDS)
        self.server_close()  # type: ignore[attr-defined]
        self.thread.join(STOP_LIMIT_SECONDS)
