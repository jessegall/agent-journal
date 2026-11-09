from server.socket_peer import SocketPeer
from server.viewer.door_refusal import DoorRefusal

OWNER_ONLY_ROUTES = frozenset({"/viewer/key", "/stop", "/handover"})
OWNER_ONLY_REASON = "only the journal itself may do this"


class JournalDoor:
    """The check a request on the journal's own socket passes before its body is read; it answers the refusal, or none."""

    def refusal(self, route: str, peer: SocketPeer) -> DoorRefusal | None:
        raise NotImplementedError


class OpenJournalDoor(JournalDoor):
    """The door of a journal on a person's own machine: the socket is the person's, and every route answers."""

    def refusal(self, route: str, peer: SocketPeer) -> DoorRefusal | None:
        return None


class OwnerOnlyJournalDoor(JournalDoor):
    """The door of a hosted journal: a viewer key, a stop and a handover are for the journal's own user, and
    the agents that share the socket's group get through to the hook and the command line only."""

    def __init__(self, owner_uid: int) -> None:
        self.owner_uid = owner_uid

    def refusal(self, route: str, peer: SocketPeer) -> DoorRefusal | None:
        return DoorRefusal(403, OWNER_ONLY_REASON) if route in OWNER_ONLY_ROUTES and peer.uid != self.owner_uid else None
