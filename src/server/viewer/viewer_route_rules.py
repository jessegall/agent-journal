from server.hosted_journal_door import OWNER_ROUTES
from server.viewer.route_audience import RouteAudience
from server.viewer.viewer_request_handler import (
    BUTTONS_ROUTE, DOCKS_ROUTE, EVENTS_ROUTE, FILES_ROUTE, KIT_ROUTE, LINE_ROUTE, LINES_ROUTE, LOGIN_LINK_ROUTE, MARKS_ROUTE, MESSAGE_FILES,
    MODULES_ROUTE, NOTICES_ROUTE, PAIRING_PAGE, PAIRING_ROUTE, PHONE_FILES, READ_LINES_ROUTE, READ_RECEIPTS_ROUTE, REPEATED_LINES_ROUTE,
    REQUEST_LOG_STATUS_ROUTE, SERVER_STATE_ROUTE, SESSION_ROUTE, SHARE_COMMENTS_ROUTE, SHARE_ROUTE, SHELL_ASSETS_ROUTE, SKILLS_ROUTE,
    STATES_ROUTE, VENDOR_ROUTE, VIEWER_ROOT, WAITING_ROUTE, WINDOW_ROUTE, WINDOWS_ROUTE)
from server.viewer.viewer_route_rule import ViewerRouteRule

GET = "GET"
POST = "POST"


def exact(method: str, audience: RouteAudience, *paths: str) -> tuple[ViewerRouteRule, ...]:
    return tuple(ViewerRouteRule(path, method, audience) for path in paths)


def prefixes(method: str, audience: RouteAudience, *paths: str) -> tuple[ViewerRouteRule, ...]:
    return tuple(ViewerRouteRule(path, method, audience, is_prefix=True) for path in paths)


# The module files come from the module folders of core and of the plugins, the kit, shell assets and vendor
# files from core's viewer module: all code, no data.
VIEWER_ROUTE_RULES = (
    *prefixes(GET, RouteAudience.PUBLIC_FILES, MODULES_ROUTE, KIT_ROUTE, SHELL_ASSETS_ROUTE, VENDOR_ROUTE),
    *exact(GET, RouteAudience.SESSION, WINDOW_ROUTE, WINDOWS_ROUTE, BUTTONS_ROUTE, MARKS_ROUTE, DOCKS_ROUTE, STATES_ROUTE, SESSION_ROUTE,
           SERVER_STATE_ROUTE, READ_LINES_ROUTE, REQUEST_LOG_STATUS_ROUTE, WAITING_ROUTE, SKILLS_ROUTE, EVENTS_ROUTE),
    *prefixes(GET, RouteAudience.SESSION, MESSAGE_FILES, VIEWER_ROOT),
    *exact(POST, RouteAudience.SESSION, LINE_ROUTE, LINES_ROUTE, REPEATED_LINES_ROUTE, READ_RECEIPTS_ROUTE, FILES_ROUTE),
    *exact(GET, RouteAudience.NOT_OPEN, PAIRING_PAGE, NOTICES_ROUTE, SHARE_COMMENTS_ROUTE, *(f"{VIEWER_ROOT}{name}" for name in PHONE_FILES)),
    *prefixes(GET, RouteAudience.NOT_OPEN, SHARE_ROUTE),
    *exact(POST, RouteAudience.NOT_OPEN, PAIRING_ROUTE, LOGIN_LINK_ROUTE, NOTICES_ROUTE, SHARE_COMMENTS_ROUTE),
    *exact(POST, RouteAudience.JOURNAL_USER, *sorted(OWNER_ROUTES)),
)
