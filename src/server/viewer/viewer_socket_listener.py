import os
import shutil
import socket
from engine.hosting.hosted_start_check import SOCKET_MODE
from pathlib import Path
from socketserver import UnixStreamServer
from urllib.parse import urlparse

from server.handover.handover_descriptors import QUEUED_CONNECTIONS
from server.viewer.hosted_closed_doors import HostedClosedDoors
from server.viewer.hosted_door import HostedDoor
from server.viewer.hosted_headers import HostedHeaders
from server.viewer.viewer_endpoint import ViewerEndpoint
from server.viewer.viewer_login import ViewerLogin
from server.viewer.viewer_routes import ViewerRoutes
from server.viewer.viewer_socket_request_handler import ViewerSocketRequestHandler



class ViewerSocketListener(ViewerEndpoint, UnixStreamServer):
    """The viewer's HTTP listener on a unix socket file, for the proxy of a hosted journal.
    The file belongs to a group, has mode 0660, and a stale file is removed before it is bound.
    It names the public origin's host, so the host check holds behind the proxy, and has no TCP port.
    A server that replaces another takes that server's listening socket with its waiting connections."""

    request_queue_size = QUEUED_CONNECTIONS

    def __init__(self, login: ViewerLogin, routes: ViewerRoutes, socket_path: Path, group: str, public_origin: str, proxy_uid: int,
                 inherited_socket: socket.socket | None = None) -> None:
        self.group, self.public_host, self.socket_path = group, urlparse(public_origin).netloc, socket_path
        super().__init__(str(socket_path), ViewerSocketRequestHandler, inherited_socket=inherited_socket)
        self.attach(login, routes, HostedDoor(public_origin, proxy_uid), HostedHeaders(public_origin), HostedClosedDoors())

    def server_bind(self) -> None:
        if self.inherited_socket is None:
            self.socket_path.unlink(missing_ok=True)
        super().server_bind()
        if self.inherited_socket is None:
            os.chmod(self.socket_path, SOCKET_MODE)
            shutil.chown(self.socket_path, group=self.group)

    @property
    def port(self) -> int:
        return 0

    @property
    def host(self) -> str:
        return self.public_host
