from collections.abc import Callable

from server.viewer.phone_module_error import PhoneModuleError
from server.viewer.share_link_session import ShareLinkSession
from core.base.text_digest import TextDigest


class ShareSessions:
    """The viewer's way to the sharing module: it finds the link a token belongs to, keeping nothing, so a
    link opens again after a restart and ends the moment it is revoked."""

    def __init__(self, journal_output: Callable[[list[str]], str]) -> None:
        self.journal_output = journal_output

    def link(self, token: str) -> ShareLinkSession | None:
        try:
            return ShareLinkSession.parsed(self.journal_output(["share", "session", TextDigest().digest(token)]))
        except PhoneModuleError:
            return None
