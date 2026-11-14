from collections.abc import Mapping, Sequence

from server.viewer.closed_doors import ClosedDoors
from server.enums.closed_service import ClosedService
from server.viewer.viewer_request_handler import LOGIN_LINK_ROUTE, NOTICES_ROUTE, PAIRING_PAGE, PAIRING_ROUTE, PHONE_FILES, SHARE_COMMENTS_ROUTE, SHARE_ROUTE, VIEWER_ROOT

CLOSED_PATHS = frozenset({LOGIN_LINK_ROUTE, PAIRING_PAGE, PAIRING_ROUTE, NOTICES_ROUTE, SHARE_COMMENTS_ROUTE})
CLOSED_PREFIX = SHARE_ROUTE
CLOSED_PHONE_FILES = frozenset(f"{VIEWER_ROOT}{name}" for name in PHONE_FILES)
CLOSED_SERVICES = frozenset({ClosedService.TUNNEL, ClosedService.PLUGIN_SERVICES, ClosedService.PLUGIN_SCRIPTS})
LOGIN_KEY_PARAMETER = "key"


class HostedClosedDoors(ClosedDoors):
    """The doors a hosted journal keeps shut until a later phase opens them: login by link, phone pairing, share
    links, the tunnel, and plugin services and scripts. Opening one is deleting its line from the lists above."""

    def closes_route(self, path: str, query: Mapping[str, Sequence[str]]) -> bool:
        closes_login_link = path == "/" and LOGIN_KEY_PARAMETER in query
        return closes_login_link or path in CLOSED_PATHS or path in CLOSED_PHONE_FILES or path.startswith(CLOSED_PREFIX)

    def closes_service(self, service: ClosedService) -> bool:
        return service in CLOSED_SERVICES
