from typing import Protocol, runtime_checkable

from server.viewer.event_stream import EventStream
from server.viewer.line_route import LineRoute
from server.viewer.viewer_login import ViewerLogin


@runtime_checkable
class ViewerServer(Protocol):
    """What the viewer's request handler reads of the listener that runs it: the logins, the line route and its own
    address."""

    login: ViewerLogin
    line_route: LineRoute
    event_stream: EventStream
    host: str
