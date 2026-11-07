import hashlib
import re
from dataclasses import dataclass
from urllib.parse import parse_qs, urlsplit

IMMUTABLE = "public, max-age=31536000, immutable"
REVALIDATE = "no-cache"
HASHED_NAME = re.compile(r"-[A-Za-z0-9_]{8,}\.(?:js|css|woff2?)$")
VERSION_PARAMETER = "v"


@dataclass(frozen=True)
class ModuleFileCaching:
    """How long a browser keeps a file the viewer serves: forever for a hashed name or a versioned address,
    else until its tag changes."""

    cache_control: str
    etag: str

    @classmethod
    def built(cls, address: str, content: bytes) -> "ModuleFileCaching":
        parts = urlsplit(address)
        is_fixed = bool(HASHED_NAME.search(parts.path)) or VERSION_PARAMETER in parse_qs(parts.query)
        return cls(IMMUTABLE if is_fixed else REVALIDATE, f'"{hashlib.sha1(content).hexdigest()}"')

    def is_unchanged(self, presented_tag: str | None) -> bool:
        return presented_tag is not None and self.etag in [tag.strip() for tag in presented_tag.split(",")]
