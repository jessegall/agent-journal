from server.door.journal_door import JournalDoor
from server.door.socket_peer import SocketPeer
from server.viewer.door_refusal import DoorRefusal


class LocalJournalDoor(JournalDoor):
    """The door of a journal on a user's own machine: the socket is the user's, and every route answers."""

    def refusal(self, route: str, peer: SocketPeer) -> DoorRefusal | None:
        return None
