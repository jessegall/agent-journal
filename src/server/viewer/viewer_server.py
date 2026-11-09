from typing import Protocol, runtime_checkable

from server.viewer.door import Door
from server.viewer.viewer_login import ViewerLogin
from server.viewer.viewer_routes import ViewerRoutes


@runtime_checkable
class ViewerServer(Protocol):
    """What the viewer's request handler reads of the listener that runs it: the logins, the routes and its
    own address, and how it says that a stop need not wait for its request."""

    login: ViewerLogin
    routes: ViewerRoutes
    host: str
    door: Door

    def untrack_request(self) -> None: ...
