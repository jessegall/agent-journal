import socket
import time
from http.server import HTTPServer

from server.handover.handover_descriptors import QUEUED_CONNECTIONS
from server.viewer.local_door import LocalDoor
from server.viewer.local_headers import LocalHeaders
from server.viewer.open_doors import OpenDoors
from server.viewer.viewer_endpoint import ViewerEndpoint
from server.viewer.viewer_login import ViewerLogin
from server.viewer.viewer_request_handler import ViewerRequestHandler
from server.viewer.viewer_routes import ViewerRoutes

VIEWER_ADDRESS = "127.0.0.1"
PORT_WAIT_SECONDS = 10.0
PORT_POLL_SECONDS = 0.1


class ViewerListener(ViewerEndpoint, HTTPServer):
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
        self.attach(login, routes, LocalDoor(self.host), LocalHeaders(), OpenDoors())

    @property
    def port(self) -> int:
        return self.server_address[1]

    @property
    def host(self) -> str:
        return f"{VIEWER_ADDRESS}:{self.port}"
