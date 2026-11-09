from server.viewer.door import Door
from server.viewer.door_refusal import DoorRefusal
from server.viewer.door_request import DoorRequest

WRONG_HOST_REASON = "this listener answers only its own address"


class LocalDoor(Door):
    """The door of a journal on a person's own machine: a request must name the listener's own address."""

    def __init__(self, host: str) -> None:
        self.host = host

    def refusal(self, request: DoorRequest) -> DoorRefusal | None:
        return None if request.host == self.host else DoorRefusal(403, WRONG_HOST_REASON)

    @property
    def state_needs_login(self) -> bool:
        return False
