from server.door.journal_door import JournalDoor
from server.door.socket_peer import SocketPeer
from server.door.door_refusal import DoorRefusal

OWNER_ROUTES = frozenset({"/viewer/key", "/stop", "/handover"})
OWNER_REASON = "only the journal itself may do this"


class HostedJournalDoor(JournalDoor):
    """The door of a hosted journal: a viewer key, a stop and a handover are for the journal's own user, and
    the agents in the socket's group reach the hook and the command line. Only the journal's own user names
    a caller by its variables; an agent of the group is named by its chain of processes alone."""

    def __init__(self, owner_uid: int) -> None:
        self.owner_uid = owner_uid

    def refusal(self, route: str, peer: SocketPeer) -> DoorRefusal | None:
        return DoorRefusal(403, OWNER_REASON) if route in OWNER_ROUTES and peer.uid != self.owner_uid else None

    def trusts_variables(self, peer: SocketPeer) -> bool:
        return peer.uid == self.owner_uid
