from dataclasses import dataclass
from email import policy
from email.message import Message
from email.parser import BytesParser

PARSER = BytesParser(policy=policy.default)
LINE = b"\r\n"
BLANK = b"\r\n\r\n"


@dataclass(frozen=True)
class Upload:
    name: str
    data: bytes | memoryview

    @classmethod
    def of(cls, raw: bytes, body: memoryview, start: int, end: int) -> "Upload | None":
        """The file between two boundaries, or nothing when the part is not a file."""
        start += len(LINE) if raw.startswith(LINE, start) else 0
        split = raw.find(BLANK, start, end)
        if split < 0:
            return None
        head = raw[start:split]
        encoded = b"content-transfer-encoding" in head.lower()
        stop = end - len(LINE) if raw.endswith(LINE, start, end) else end
        part = PARSER.parsebytes(head + BLANK + (raw[split + len(BLANK):stop] if encoded else b""))
        name = part.get_filename()
        if not name:
            return None
        return cls(name, part.get_payload(decode=True) if encoded else body[split + len(BLANK):stop])


def boundary_of(content_type: str) -> bytes:
    header = Message()
    header["Content-Type"] = content_type
    return (header.get_boundary() or "").encode()


def uploads(content_type: str, raw: bytes) -> list[Upload]:
    """The files a multipart body carries, found at its boundaries and handed over as views of the body, so a large file is never copied on the way."""
    delimiter = b"--" + boundary_of(content_type)
    body, found = memoryview(raw), []
    at = raw.find(delimiter)
    while at >= 0:
        start = at + len(delimiter)
        if raw.startswith(b"--", start):
            break
        end = raw.find(delimiter, start)
        part = Upload.of(raw, body, start, len(raw) if end < 0 else end)
        if part:
            found.append(part)
        at = end
    return found
