import json
from collections.abc import Callable

from server.viewer.phone_module_error import PhoneModuleError
from server.viewer.share_link_session import ShareLinkSession
from core.base.text_digest import TextDigest


class ShareSessions:
    """The viewer's way to the sharing module: it finds the link a token belongs to, keeping nothing but which
    tokens gave their password, so a link opens again after a restart and ends the moment it is revoked."""

    def __init__(self, journal_output: Callable[[list[str]], str]) -> None:
        self.journal_output = journal_output
        self.environment_names: dict[int, str] = {}
        self.unlocked_tokens: set[str] = set()

    def link(self, token: str) -> ShareLinkSession | None:
        try:
            return ShareLinkSession.parsed(self.journal_output(["share", "session", TextDigest().hex_digest(token)]))
        except PhoneModuleError:
            return None

    def environment_name(self, environment_id: int) -> str:
        if environment_id not in self.environment_names:
            self.environment_names[environment_id] = str(json.loads(self.journal_output(["environment", "show", str(environment_id)]))["name"])
        return self.environment_names[environment_id]

    def unlock(self, token: str, password: str) -> bool:
        try:
            self.journal_output(["share", "unlock", TextDigest().hex_digest(token), f"--password={password}"])
        except PhoneModuleError:
            return False
        self.unlocked_tokens.add(token)
        return True

    def count_view(self, token: str) -> None:
        try:
            self.journal_output(["share", "viewed", TextDigest().hex_digest(token)])
        except PhoneModuleError:
            return

    def comments(self, link_id: int) -> list[object]:
        return list(json.loads(self.journal_output(["share", "comments", str(link_id)]))["rows"])

    def comment(self, link_id: int, name: str, text: str) -> None:
        self.journal_output(["share", "comment", str(link_id), f"--name={name}", f"--text={text}"])
