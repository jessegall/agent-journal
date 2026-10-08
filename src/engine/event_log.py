import json
import time
from contextlib import AbstractContextManager
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Callable

from engine import runtime
from engine.stored import append_text, write_text
from resources.base import Event

KEPT_EVENTS = 2000


@dataclass(frozen=True)
class Recent:
    file: int
    read: int
    events: list


RECENT: dict[str, Recent] = {}


def parsed(lines):
    for raw in lines:
        try:
            yield Event(**json.loads(raw))
        except (ValueError, TypeError):
            continue


class EventLog:
    def __init__(self, home: Path, locked: Callable[[], AbstractContextManager]):
        self.file = home / "events.jsonl"
        self.cursor_folder = runtime.folder(home)
        self.locked = locked

    def append(self, event: Event) -> None:
        append_text(self.file, json.dumps(asdict(event)) + "\n")

    def events(self, since: int = 0, last: int = 0) -> list[Event]:
        recent = self.recent()
        newer = [e for e in recent if e.id > since]
        if len(recent) < KEPT_EVENTS or (recent and recent[0].id <= since) or (last and len(newer) >= last):
            return newer[-last:] if last else newer
        return self.back(since, last)

    def recent(self) -> list[Event]:
        try:
            stat = self.file.stat()
        except OSError:
            return []
        size = stat.st_size
        held = RECENT.get(str(self.file))
        same = held is not None and held.file == stat.st_ino
        if same and held.read == size:
            return held.events
        if same and held.read < size:
            with self.file.open("rb") as fh:
                fh.seek(held.read)
                added = fh.read(size - held.read)
            whole = added[:added.rfind(b"\n") + 1]
            kept = (held.events + list(parsed(whole.split(b"\n"))))[-KEPT_EVENTS:]
            RECENT[str(self.file)] = Recent(stat.st_ino, held.read + len(whole), kept)
            return kept
        kept = self.back(0, KEPT_EVENTS)
        RECENT[str(self.file)] = Recent(stat.st_ino, size, kept)
        return kept

    def back(self, since: int = 0, last: int = 0) -> list[Event]:
        out = []
        for e in parsed(self.lines_back()):
            if e.id <= since or (last and len(out) == last):
                break
            out.append(e)
        return out[::-1]

    def lines_back(self, block: int = 65536):
        with self.file.open("rb") as fh:
            fh.seek(0, 2)
            at, rest = fh.tell(), b""
            while at > 0:
                step = min(block, at)
                at -= step
                fh.seek(at)
                lines = (fh.read(step) + rest).split(b"\n")
                rest = lines.pop(0)
                yield from (line for line in reversed(lines) if line.strip())
            if rest.strip():
                yield rest

    def started_at(self) -> float:
        if self.file.is_file():
            with self.file.open("rb") as fh:
                for event in parsed(fh):
                    return event.at
        return time.time()

    def last_id(self) -> int:
        got = self.events(last=1)
        return got[-1].id if got else 0

    def trim(self, keep: int, readers_since: float) -> int:
        if not self.file.is_file():
            return 0
        with self.locked():
            lines = self.file.read_text().splitlines(keepends=True)
            if len(lines) <= keep:
                return 0
            ids = [json.loads(line).get("id", 0) for line in lines]
            unread = min((self.cursor(f.name.removeprefix("cursor-")) for f in self.cursor_folder.glob("cursor-*")
                          if f.stat().st_mtime >= readers_since and self.cursor_text(f.name.removeprefix("cursor-")).isdigit()), default=ids[-1])
            floor = min(ids[-keep], unread + 1)
            kept = [line for line, n in zip(lines, ids) if n >= floor]
            write_text(self.file, "".join(kept))
            return len(lines) - len(kept)

    def cursor_file(self, name: str) -> Path:
        return self.cursor_folder / f"cursor-{name}"

    def cursor_text(self, name: str) -> str:
        try:
            return self.cursor_file(name).read_text().strip()
        except OSError:
            return ""

    def set_cursor_text(self, name: str, text: str) -> None:
        f = self.cursor_file(name)
        f.parent.mkdir(parents=True, exist_ok=True)
        write_text(f, text)

    def cursor(self, name: str) -> int:
        text = self.cursor_text(name)
        return int(text) if text else 0

    def set_cursor(self, name: str, n: int) -> None:
        self.set_cursor_text(name, str(n))
