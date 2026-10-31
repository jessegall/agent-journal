from typing import Protocol, runtime_checkable

from server.viewer.viewer_login import ViewerLogin
from server.viewer.viewer_routes import ViewerRoutes


@runtime_checkable
class ViewerServer(Protocol):
    """What the viewer's request handler reads of the listener that runs it: the logins, the routes and its
    own address."""

    login: ViewerLogin
    routes: ViewerRoutes
    host: str
