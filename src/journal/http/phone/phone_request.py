from dataclasses import dataclass


@dataclass(frozen=True)
class PhoneRequest:
    """A request under /p/ as the phone pages read it: its path, the phone's cookie, where it says it comes from, the app's own header, its media type and its body."""

    method: str
    path: str
    cookies: str = ""
    origin: str = ""
    app_header: str = ""
    content_type: str = ""
    body: bytes = b""

    @classmethod
    def of(cls, method: str, path: str, headers, body: bytes = b"") -> "PhoneRequest":
        return cls(method, path, headers.get("Cookie", ""), headers.get("Origin", ""), headers.get("X-Phone", ""), headers.get("Content-Type", ""), body)

    @property
    def rest(self) -> list[str]:
        return [part for part in self.path.split("?", 1)[0].split("/")[2:] if part]
