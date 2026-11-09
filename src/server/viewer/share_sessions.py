import json
import secrets
from collections.abc import Callable

from server.viewer.phone_module_error import PhoneModuleError
from server.viewer.share_link_session import ShareLinkSession
from core.base.clock import Clock
from core.base.text_digest import TextDigest

KEY_BYTES = 32


class ShareSessions:
    """The viewer's way to the sharing module: it finds the link a token belongs to, keeping nothing but the
    digests of the keys given to browsers that sent the password, so a link opens again after a restart and
    ends the moment it is revoked."""

    def __init__(self, journal_output: Callable[[list[str]], str], clock: Clock) -> None:
        self.journal_output, self.clock = journal_output, clock
        self.environment_names: dict[int, str] = {}
        self.unlock_keys: dict[str, str] = {}

    def is_locked(self, link: ShareLinkSession, token: str, key: str) -> bool:
        return link.locked and self.unlock_keys.get(TextDigest().hex_digest(key)) != token

    def is_open(self, link: ShareLinkSession) -> bool:
        return link.is_open(self.clock.timestamp())

    def link(self, token: str) -> ShareLinkSession | None:
        try:
            return ShareLinkSession.parsed(self.journal_output(["share", "session", TextDigest().hex_digest(token)]))
        except PhoneModuleError:
            return None

    def environment_name(self, environment_id: int) -> str:
        if environment_id not in self.environment_names:
            self.environment_names[environment_id] = str(json.loads(self.journal_output(["environment", "show", str(environment_id)]))["name"])
        return self.environment_names[environment_id]

    def unlock(self, token: str, password: str) -> str | None:
        try:
            self.journal_output(["share", "unlock", TextDigest().hex_digest(token), f"--password={password}"])
        except PhoneModuleError:
            return None
        key = secrets.token_urlsafe(KEY_BYTES)
        self.unlock_keys[TextDigest().hex_digest(key)] = token
        return key

    def count_view(self, token: str) -> None:
        try:
            self.journal_output(["share", "viewed", TextDigest().hex_digest(token)])
        except PhoneModuleError:
            return

    def comments(self, link_id: int) -> list[object]:
        return list(json.loads(self.journal_output(["share", "comments", str(link_id)]))["rows"])

    def comment(self, link_id: int, name: str, text: str) -> None:
        self.journal_output(["share", "comment", str(link_id), f"--name={name}", f"--text={text}"])
