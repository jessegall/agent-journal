import importlib.util
import pickle
import pkgutil
import time
from copy import deepcopy
from functools import cache
from threading import Lock, Thread, get_ident
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
FOLD_WAIT = 0.2
FOLD_IN_PLACE_BYTES = 4_000_000
FOLD_TAIL_BYTES = 64_000_000


SHAPED_BY = ("engine.transcript",)


@cache
def code_mark() -> str:
    import providers
    names = [*(f"providers.{module.name}" for module in sorted(pkgutil.iter_modules(providers.__path__), key=lambda found: found.name)), *SHAPED_BY]
    sources = [importlib.util.find_spec(name) for name in names]
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
        return self.folder / code_mark() / f"{digest('|'.join(key), 20)}.pickle"

    def stored(self, key: tuple) -> tuple | None:
        try:
            return pickle.loads(self.file(key).read_bytes())
        except (OSError, pickle.UnpicklingError, EOFError, AttributeError, ImportError, TypeError):
            return None

    def keep(self, key: tuple, offset: int, state, every: float, behind: bool = False) -> None:
        if time.monotonic() - self.kept.get(key, 0.0) < every:
            return
        self.kept[key] = time.monotonic()
        if behind:
            Thread(target=self.write, args=(key, offset, state), daemon=True).start()
            return
        self.write(key, offset, state)

    def write(self, key: tuple, offset: int, state) -> None:
        target = self.file(key)
        try:
            target.parent.mkdir(parents=True, exist_ok=True)
            writing = target.with_suffix(f".{get_ident()}.tmp")
            writing.write_bytes(pickle.dumps((offset, state)))
            writing.replace(target)
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
        key = ("transcript", str(path), code_mark())
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
            self.keep(key, end, (count, list(turns), seam), KEEP_TRANSCRIPT_EVERY, behind=True)
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
        key = (str(path), fold.__name__, code_mark(), *getattr(start, "__dataclass_fields__", ()))
        size = size_of(path)
        if size is None:
            return start()
        offset, state = self.last(key, start)
        if size - offset > FOLD_IN_PLACE_BYTES:
            self.fold_behind(key, path, fold, start, row_of)
            return state
        lock = self.lock(key)
        if not lock.acquire(timeout=FOLD_WAIT):
            return state
        try:
            return self.fold_up(key, path, fold, start, row_of)
        finally:
            lock.release()

    def last(self, key: tuple, start) -> tuple:
        if key not in self.folds:
            self.folds[key] = self.stored(key) or (0, start())
        return self.folds[key]

    def fold_behind(self, key: tuple, path: Path, fold, start, row_of: Callable) -> None:
        lock = self.lock(key)
        if not lock.acquire(blocking=False):
            return

        def run() -> None:
            try:
                self.fold_up(key, path, fold, start, row_of)
            finally:
                lock.release()
        Thread(target=run, daemon=True).start()

    def fold_up(self, key: tuple, path: Path, fold, start, row_of: Callable):
        offset, state = self.last(key, start)
        size = size_of(path) or 0
        if size < offset:
            offset, state = 0, start()
        if size > offset:
            lines, offset = complete_lines(path, offset) if offset else last_lines(path, FOLD_TAIL_BYTES)
            state = deepcopy(state)
            for found in rows(lines, row_of):
                state = fold(state, found)
            self.keep(key, offset, state, KEEP_EVERY)
        self.folds[key] = (offset, state)
        return state


CACHE = TranscriptCache(FOLD_CACHE)
