from server.door.socket_peer import SocketPeer
from server.door.door_refusal import DoorRefusal


class JournalDoor:
    """The check a request on the journal's socket passes before its body is read: a refusal, or none."""

    def refusal(self, route: str, peer: SocketPeer) -> DoorRefusal | None:
        raise NotImplementedError
