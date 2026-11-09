from enum import Enum


class RouteAudience(Enum):
    """Who may reach a route of a hosted journal: anyone, for files that hold code and no data; a session;
    nobody yet; or the journal's own user."""

    PUBLIC_FILES = "public files"
    SESSION = "a session"
    CLOSED_HOSTED = "closed on a hosted journal"
    JOURNAL_USER = "the journal's own user"
