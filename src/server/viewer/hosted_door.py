from urllib.parse import urlparse

from server.viewer.door import Door
from server.viewer.door_refusal import DoorRefusal
from server.viewer.door_request import DoorRequest
from server.viewer.local_door import WRONG_HOST_REASON

ANONYMOUS_BODY_BYTES = 64 * 1024
ORIGIN_SITE = "same-origin"


class HostedDoor(Door):
    """Refuses a hosted request before anything else reads it: a caller that is not the proxy, another host, a
    forged state change, or a large body from someone not logged in."""

    def __init__(self, public_origin: str, proxy_uid: int) -> None:
        self.origin, self.proxy_uid, self.host = public_origin, proxy_uid, urlparse(public_origin).netloc

    def refusal(self, request: DoorRequest) -> DoorRefusal | None:
        if request.peer_uid != self.proxy_uid:
            return DoorRefusal(403, "this socket answers only its proxy")
        if request.host != self.host:
            return DoorRefusal(403, WRONG_HOST_REASON)
        if request.is_change and not self.has_site_origin(request):
            return DoorRefusal(403, "this request did not come from this site")
        if not request.has_login and request.body_bytes > ANONYMOUS_BODY_BYTES:
            return DoorRefusal(413, "this request is too large")
        return None

    def has_site_origin(self, request: DoorRequest) -> bool:
        return request.origin == self.origin and request.site_relation == ORIGIN_SITE

    @property
    def state_needs_login(self) -> bool:
        return True
