from typing import Protocol, runtime_checkable

from server.viewer.viewer_login import ViewerLogin


@runtime_checkable
class ViewerServer(Protocol):
    """What the viewer's request handler reads of the listener that runs it: the logins and its own address."""

    login: ViewerLogin
    host: str
