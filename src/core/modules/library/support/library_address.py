from dataclasses import dataclass
from urllib.parse import urlsplit

from engine.errors.refusal import Refusal

ADDRESS_SETTING = "journal.core.library.address"
DEFAULT_PORT = 8740
SCHEMES = ("http", "https")
BARE_SCHEME = "https"


@dataclass(frozen=True)
class LibraryAddress:
    """A shared server's address as a user writes it: an IP address or a name, with or without a port, or a URL."""

    text: str

    @property
    def base(self) -> str:
        trimmed = self.text.strip()
        is_bare = "://" not in trimmed
        parts = urlsplit(f"{BARE_SCHEME}://{trimmed}" if is_bare else trimmed)
        parts = parts._replace(path=parts.path.rstrip("/"))
        try:
            port = parts.port or (DEFAULT_PORT if is_bare else None)
        except ValueError:
            raise self.refusal() from None
        if parts.scheme not in SCHEMES or not parts.hostname or parts.query or parts.fragment:
            raise self.refusal()
        host = f"[{parts.hostname}]" if ":" in parts.hostname else parts.hostname
        return f"{parts.scheme}://{host}{f':{port}' if port else ''}{parts.path}"

    def refusal(self) -> Refusal:
        return Refusal(f"{self.text} is no server address", "write an IP address or a URL, such as 10.0.0.5 or https://library.example.com")
