from server.viewer.door_refusal import DoorRefusal
from server.viewer.door_request import DoorRequest


class Door:
    """The check every viewer request passes before anything reads it; it answers the refusal, or none."""

    def refusal(self, request: DoorRequest) -> DoorRefusal | None:
        raise NotImplementedError

    @property
    def state_needs_login(self) -> bool:
        raise NotImplementedError
