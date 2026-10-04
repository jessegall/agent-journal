import importlib.util
import pickle
import pkgutil
import time
from functools import cache
from threading import Lock
from pathlib import Path
from typing import Callable

from engine.wording import digest
from providers.jsonl import complete_lines, last_lines, rows

FOLD_CACHE = Path.home() / ".cache" / "agent-journal" / "folds"
KEEP_EVERY = 10.0
KEEP_TRANSCRIPT_EVERY = 300.0
SEAM = 256
RECENT_BYTES = 1_000_000
RECENT_ROWS = 1000


@cache
def providers_mark() -> str:
    import providers
    sources = [importlib.util.find_spec(f"providers.{module.name}") for module in sorted(pkgutil.iter_modules(providers.__path__), key=lambda found: found.name)]
    return digest("\n".join(spec.loader.get_source(spec.name) or "" for spec in sources), 12)


def size_of(path: Path | None) -> int | None:
    try:
        return Path(path).stat().st_size
    except (OSError, TypeError):
        return None


class TranscriptCache:
    def __init__(self, folder: Path):
        self.folder = folder
        self.recents: dict[str, tuple[int, list]] = {}
        self.folds: dict[tuple, tuple] = {}
        self.transcripts: dict[str, tuple] = {}
        self.kept: dict[tuple, float] = {}
        self.locks: dict[tuple, Lock] = {}
        self.guard = Lock()

    def lock(self, key: tuple) -> Lock:
        with self.guard:
            return self.locks.setdefault(key, Lock())

    def file(self, key: tuple) -> Path:
        return self.folder / f"{digest('|'.join(key), 20)}.pickle"

    def stored(self, key: tuple) -> tuple | None:
        try:
            return pickle.loads(self.file(key).read_bytes())
        except (OSError, pickle.UnpicklingError, EOFError, AttributeError, ImportError, TypeError):
            return None

    def keep(self, key: tuple, offset: int, state, every: float) -> None:
        if time.monotonic() - self.kept.get(key, 0.0) < every:
            return
        self.kept[key] = time.monotonic()
        try:
            self.folder.mkdir(parents=True, exist_ok=True)
            self.file(key).write_bytes(pickle.dumps((offset, state)))
        except (OSError, pickle.PicklingError):
            return

    def recent(self, path: Path | None, row_of: Callable) -> list:
        size = size_of(path)
        if size is None:
            return []
        held = self.recents.get(str(path))
        if held and held[0] == size:
            return held[1]
        if held and held[0] < size <= held[0] + RECENT_BYTES:
            lines, end = complete_lines(path, held[0])
            found = held[1] + list(rows(lines, row_of))
        else:
            lines, end = last_lines(path, RECENT_BYTES)
            found = list(rows(lines, row_of))
        self.recents[str(path)] = (end, found[-RECENT_ROWS:])
        return self.recents[str(path)][1]

    def transcript(self, path: Path, extend: Callable[[list, list[bytes], int], list]) -> list:
        size = size_of(path)
        if size is None:
            return []
        key = ("transcript", str(path))
        kept = None if str(path) in self.transcripts else self.stored(key)
        held = self.transcripts.get(str(path)) or (kept and (kept[0], *kept[1]))
        offset, count, turns, seam = held if held and held[0] <= size else (0, 0, [], b"")
        if seam and self.before(path, offset, len(seam)) != seam:
            offset, count, turns, seam = 0, 0, [], b""
        lines, end = complete_lines(path, offset)
        if end > offset:
            turns = extend(turns, lines, count)
            count += len(lines)
            seam = self.before(path, end, SEAM)
            self.keep(key, end, (count, turns, seam), KEEP_TRANSCRIPT_EVERY)
        self.transcripts[str(path)] = (end, count, turns, seam)
        return turns

    def before(self, path: Path, offset: int, span: int) -> bytes:
        try:
            with Path(path).open("rb") as source:
                source.seek(max(0, offset - span))
                return source.read(min(span, offset))
        except OSError:
            return b""

    def folded(self, path: Path, fold, start, row_of: Callable):
        key = (str(path), fold.__name__, providers_mark(), *getattr(start, "__dataclass_fields__", ()))
        size = size_of(path)
        if size is None:
            return start()
        with self.lock(key):
            offset, state = self.folds.pop(key, None) or self.stored(key) or (0, start())
            if size < offset:
                offset, state = 0, start()
            if size > offset:
                lines, offset = complete_lines(path, offset)
                for found in rows(lines, row_of):
                    state = fold(state, found)
                self.keep(key, offset, state, KEEP_EVERY)
            self.folds[key] = (offset, state)
        return state


CACHE = TranscriptCache(FOLD_CACHE)
