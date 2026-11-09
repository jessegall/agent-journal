from server.socket_peer import socket_peer
from server.viewer.viewer_request_handler import ViewerRequestHandler


class ViewerSocketRequestHandler(ViewerRequestHandler):
    """Answers the viewer's requests on a unix socket: the client has no address, so the kernel's pid and uid of
    the connection name it."""

    def setup(self) -> None:
        super().setup()
        self.peer = socket_peer(self.connection)

    @property
    def peer_uid(self) -> int:
        return self.peer.uid

    def address_string(self) -> str:
        return f"pid {self.peer.pid} uid {self.peer.uid}"
