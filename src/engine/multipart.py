import mmap
import tempfile
from contextlib import contextmanager
from dataclasses import dataclass
from email import policy
from email.message import Message
from email.parser import BytesParser
from typing import BinaryIO, Iterator

UPLOAD_LIMIT_MB = 100
UPLOAD_LIMIT = UPLOAD_LIMIT_MB * 1024 * 1024
CHUNK = 1024 * 1024
PARSER = BytesParser(policy=policy.default)
LINE = b"\r\n"
BLANK = b"\r\n\r\n"


@dataclass(frozen=True)
class Upload:
    name: str
    data: bytes | memoryview

    @classmethod
    def of(cls, raw: "bytes | mmap.mmap", body: memoryview, start: int, end: int) -> "Upload | None":
        """The file between two boundaries, or nothing when the part is not a file."""
        start += len(LINE) if followed_by(raw, LINE, start) else 0
        split = raw.find(BLANK, start, end)
        if split < 0:
            return None
        head = raw[start:split]
        encoded = b"content-transfer-encoding" in head.lower()
        stop = end - len(LINE) if end - len(LINE) >= start and followed_by(raw, LINE, end - len(LINE)) else end
        part = PARSER.parsebytes(head + BLANK + (raw[split + len(BLANK):stop] if encoded else b""))
        name = part.get_filename()
        if not name:
            return None
        return cls(name, part.get_payload(decode=True) if encoded else body[split + len(BLANK):stop])


def followed_by(raw: "bytes | mmap.mmap", text: bytes, at: int) -> bool:
    return raw[at:at + len(text)] == text


def boundary_of(content_type: str) -> bytes:
    header = Message()
    header["Content-Type"] = content_type
    return (header.get_boundary() or "").encode()


def uploads(content_type: str, raw: "bytes | mmap.mmap") -> list[Upload]:
    """The files a multipart body carries, found at its boundaries and handed over as views of the body, so a large file is never copied on the way."""
    delimiter = b"--" + boundary_of(content_type)
    body, found = memoryview(raw), []
    at = raw.find(delimiter)
    while at >= 0:
        start = at + len(delimiter)
        if followed_by(raw, b"--", start):
            break
        end = raw.find(delimiter, start)
        part = Upload.of(raw, body, start, len(raw) if end < 0 else end)
        if part:
            found.append(part)
        at = end
    return found


@contextmanager
def spooled_body(stream: BinaryIO, length: int) -> Iterator["mmap.mmap | bytes"]:
    """The body of a request as a view of a temporary file filled a chunk at a time, so a large upload is never held in memory whole."""
    if length == 0:
        yield b""
        return
    with tempfile.TemporaryFile() as spool:
        left = length
        while left > 0:
            chunk = stream.read(min(CHUNK, left))
            if not chunk:
                break
            spool.write(chunk)
            left -= len(chunk)
        spool.flush()
        if spool.tell() == 0:
            yield b""
            return
        with mmap.mmap(spool.fileno(), 0, access=mmap.ACCESS_READ) as view:
            yield view
