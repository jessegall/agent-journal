import hashlib
from dataclasses import dataclass
from pathlib import Path
from typing import Callable

from engine.disk import replace
from engine.paths import contained
from resources.base import Refused

FETCH_LIMIT = 25 * 1024 * 1024


@dataclass(frozen=True)
class Attachment:
    """A file beside a row as a pull carries it: its name, size and digest, and not its bytes."""

    name: str
    size: int
    digest: str

    def stands_in(self, folder: Path) -> bool:
        found = Path(folder) / self.name
        return found.is_file() and found.stat().st_size == self.size and hashlib.sha1(found.read_bytes()).hexdigest() == self.digest


def described(folder: Path) -> list[Attachment]:
    return [Attachment(path.name, path.stat().st_size, hashlib.sha1(path.read_bytes()).hexdigest()) for path in sorted(Path(folder).iterdir()) if path.is_file()] if Path(folder).is_dir() else []


def fetch(attachment: Attachment, folder: Path, read: Callable[[], bytes], limit: int = FETCH_LIMIT) -> Path:
    """Fetches an attachment when someone opens it, once, and refuses one over the limit or one that arrives other than described."""
    if attachment.size > limit:
        raise Refused(f"{attachment.name} is {attachment.size // (1024 * 1024)} MB, over the {limit // (1024 * 1024)} MB a copy fetches; open it on the machine that holds it")
    target = contained(Path(folder), attachment.name)
    if attachment.stands_in(folder):
        return target
    data = read()
    if len(data) != attachment.size or hashlib.sha1(data).hexdigest() != attachment.digest:
        raise Refused(f"{attachment.name} did not arrive whole; it was not kept")
    target.parent.mkdir(parents=True, exist_ok=True)
    replace(target, data)
    return target
