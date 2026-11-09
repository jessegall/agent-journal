from dataclasses import dataclass
from enum import Enum

from server.hosted_journal_door import OWNER_ROUTES
from server.viewer.viewer_request_handler import (
    BUTTONS_ROUTE, DOCKS_ROUTE, EVENTS_ROUTE, FILES_ROUTE, KIT_ROUTE, LINE_ROUTE, LINES_ROUTE, LOGIN_LINK_ROUTE, MARKS_ROUTE, MESSAGE_FILES,
    MODULES_ROUTE, NOTICES_ROUTE, PAIRING_PAGE, PAIRING_ROUTE, PHONE_FILES, READ_LINES_ROUTE, READ_RECEIPTS_ROUTE, REPEATED_LINES_ROUTE,
    REQUEST_LOG_STATUS_ROUTE, SERVER_STATE_ROUTE, SESSION_ROUTE, SHARE_COMMENTS_ROUTE, SHARE_ROUTE, SHELL_ASSETS_ROUTE, SKILLS_ROUTE,
    STATES_ROUTE, VENDOR_ROUTE, VIEWER_ROOT, WAITING_ROUTE, WINDOW_ROUTE, WINDOWS_ROUTE)

GET = "GET"
POST = "POST"


class Audience(Enum):
    """Who may reach a route of a hosted journal: anyone, for files that hold code and no data; a logged-in
    session; nobody yet; or the journal's own user on its own socket."""

    PUBLIC_FILES = "public files"
    LOGGED_IN = "logged in"
    CLOSED_HOSTED = "closed on a hosted journal"
    JOURNAL_UID_ONLY = "the journal's own user"


@dataclass(frozen=True)
class ViewerRouteRule:
    """One route of the viewer, or the journal's own socket, and who may reach it. A prefix names every path below it."""

    path: str
    method: str
    audience: Audience
    is_prefix: bool = False

    @property
    def example_path(self) -> str:
        return f"{self.path}example" if self.is_prefix else self.path


def exact(method: str, audience: Audience, *paths: str) -> tuple[ViewerRouteRule, ...]:
    return tuple(ViewerRouteRule(path, method, audience) for path in paths)


def prefixes(method: str, audience: Audience, *paths: str) -> tuple[ViewerRouteRule, ...]:
    return tuple(ViewerRouteRule(path, method, audience, is_prefix=True) for path in paths)


# The module files come from the module folders of core and of the plugins, the kit, shell assets and vendor
# files from core's viewer module: all code, no data.
VIEWER_ROUTE_RULES = (
    *prefixes(GET, Audience.PUBLIC_FILES, MODULES_ROUTE, KIT_ROUTE, SHELL_ASSETS_ROUTE, VENDOR_ROUTE),
    *exact(GET, Audience.LOGGED_IN, WINDOW_ROUTE, WINDOWS_ROUTE, BUTTONS_ROUTE, MARKS_ROUTE, DOCKS_ROUTE, STATES_ROUTE, SESSION_ROUTE,
           SERVER_STATE_ROUTE, READ_LINES_ROUTE, REQUEST_LOG_STATUS_ROUTE, WAITING_ROUTE, SKILLS_ROUTE, EVENTS_ROUTE),
    *prefixes(GET, Audience.LOGGED_IN, MESSAGE_FILES, VIEWER_ROOT),
    *exact(POST, Audience.LOGGED_IN, LINE_ROUTE, LINES_ROUTE, REPEATED_LINES_ROUTE, READ_RECEIPTS_ROUTE, FILES_ROUTE),
    *exact(GET, Audience.CLOSED_HOSTED, PAIRING_PAGE, NOTICES_ROUTE, SHARE_COMMENTS_ROUTE, *(f"{VIEWER_ROOT}{name}" for name in PHONE_FILES)),
    *prefixes(GET, Audience.CLOSED_HOSTED, SHARE_ROUTE),
    *exact(POST, Audience.CLOSED_HOSTED, PAIRING_ROUTE, LOGIN_LINK_ROUTE, NOTICES_ROUTE, SHARE_COMMENTS_ROUTE),
    *exact(POST, Audience.JOURNAL_UID_ONLY, *sorted(OWNER_ROUTES)),
)
