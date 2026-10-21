import hmac
import secrets


class PluginTokens:
    """The token each plugin's programs are given, so what they ask of the journal is stamped as the plugin and never as the user: made once per server run and kept only in its memory."""

    def __init__(self) -> None:
        self._issued: dict[str, str] = {}

    def build(self, name: str) -> str:
        return self._issued.setdefault(name, secrets.token_hex(24))

    def matches(self, name: str, token: str) -> bool:
        issued = self._issued.get(name, "")
        return bool(issued) and hmac.compare_digest(issued, token)
