from server.journal_door import JournalDoor
from server.socket_peer import SocketPeer
from server.viewer.door_refusal import DoorRefusal


class LocalJournalDoor(JournalDoor):
    """The door of a journal on a person's own machine: the socket is the person's, and every route answers."""

    def refusal(self, route: str, peer: SocketPeer) -> DoorRefusal | None:
        return None
