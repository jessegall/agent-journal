from collections.abc import Callable
from urllib.parse import urlparse

from server.viewer.door import Door
from server.door.door_refusal import DoorRefusal
from server.viewer.door_request import DoorRequest

WRONG_HOST_REASON = "this listener answers only its own address"
FOREIGN_SITE_REASON = "this request did not come from this site"
# a browser names its origin and site on every change; a script names neither; "none" is an address typed in the bar
ACCEPTED_SITE_RELATIONS = ("", "same-origin", "none")


class LocalDoor(Door):
    """The door of a journal on a user's own machine: a request must name the listener's address or the
    address of the tunnel this server keeps open, and a change must come from that origin. A request that came
    through the tunnel is from outside, so it reads the server's state only with a login."""

    def __init__(self, host: str, tunnel_address: Callable[[], str | None]) -> None:
        self.host, self.tunnel_address = host, tunnel_address

    def refusal(self, request: DoorRequest) -> DoorRefusal | None:
        if request.host != self.host and not self.is_tunnel_request(request):
            return DoorRefusal(403, WRONG_HOST_REASON)
        if request.is_change and not self.is_from_viewer_origin(request):
            return DoorRefusal(403, FOREIGN_SITE_REASON)
        return None

    # another port of 127.0.0.1 is the same site to a browser and sends the login along: only the viewer's origin may change state
    def is_from_viewer_origin(self, request: DoorRequest) -> bool:
        viewer_origins = ("", f"http://{self.host}", self.tunnel_address() or "")
        return request.origin in viewer_origins and request.site_relation in ACCEPTED_SITE_RELATIONS

    def is_tunnel_request(self, request: DoorRequest) -> bool:
        address = self.tunnel_address()
        return address is not None and request.host == urlparse(address).netloc

    def state_needs_login(self, request: DoorRequest) -> bool:
        return request.host != self.host
