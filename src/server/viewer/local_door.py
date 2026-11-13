from collections.abc import Callable
from urllib.parse import urlparse

from server.viewer.door import Door
from server.viewer.door_refusal import DoorRefusal
from server.viewer.door_request import DoorRequest

WRONG_HOST_REASON = "this listener answers only its own address"


class LocalDoor(Door):
    """The door of a journal on a user's own machine: a request must name the listener's own address, or
    the address of the tunnel this server holds open. A request that came through the tunnel is from
    outside, so it reads the server's state only with a login."""

    def __init__(self, host: str, tunnel_address: Callable[[], str | None]) -> None:
        self.host, self.tunnel_address = host, tunnel_address

    def refusal(self, request: DoorRequest) -> DoorRefusal | None:
        return None if request.host == self.host or self.is_tunnel_request(request) else DoorRefusal(403, WRONG_HOST_REASON)

    def is_tunnel_request(self, request: DoorRequest) -> bool:
        address = self.tunnel_address()
        return address is not None and request.host == urlparse(address).netloc

    def state_needs_login(self, request: DoorRequest) -> bool:
        return request.host != self.host
