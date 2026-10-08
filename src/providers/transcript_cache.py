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
from providers.jsonl import Read, lines_after, lines_from, read_bytes, rows, tail_lines

FOLD_CACHE = Path.home() / ".cache" / "agent-journal" / "folds"
KEEP_EVERY = 10.0
KEEP_TRANSCRIPT_EVERY = 300.0
SEAM = 256
RECENT_BYTES = 1_000_000
RECENT_ROWS = 1000
FOLD_WAIT = 0.2
FOLD_IN_PLACE_BYTES = 4_000_000
STATES = "states"
CURSOR = "cursor"


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
        return self.folder / STATES / f"{digest('|'.join(key), 20)}.pickle"

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
        if held and 0 < held[0] < size <= held[0] + RECENT_BYTES:
            read = lines_after(path, held[0])
            found = held[1] + list(rows(read.lines, row_of))
        else:
            read = tail_lines(path, RECENT_BYTES)
            found = list(rows(read.lines, row_of))
        self.recents[str(path)] = (read.end, found[-RECENT_ROWS:])
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
        read = lines_from(path, offset)
        if not held:
            count = self.counted_before(path, read)
        if read.end > offset:
            turns = extend(turns, read.lines, count)
            count += len(read.lines)
            seam = self.before(path, read.end, SEAM)
            self.keep(key, read.end, (count, list(turns), seam), KEEP_TRANSCRIPT_EVERY, behind=True)
            self.keep((CURSOR, str(path)), read.end, count, KEEP_TRANSCRIPT_EVERY, behind=True)
        self.transcripts[str(path)] = (read.end, count, turns, seam)
        return turns

    def counted_before(self, path: Path, read: Read) -> int:
        """Lines before a fresh read, from the cursor an earlier build kept, so turns stay numbered from the first line."""
        kept = self.stored((CURSOR, str(path)))
        if not kept or not read.start <= kept[0] <= read.end:
            return 0
        at, within = read.start, 0
        for line in read.lines:
            if at >= kept[0]:
                break
            at, within = at + len(line) + 1, within + 1
        return max(0, kept[1] - within)

    def before(self, path: Path, offset: int, span: int) -> bytes:
        return read_bytes(path, max(0, offset - span), offset)

    @staticmethod
    def fold_key(path: Path, fold, start) -> tuple:
        return str(path), fold.__name__, code_mark(), *getattr(start, "__dataclass_fields__", ())

    def caught_up(self, path: Path, fold, start) -> bool:
        size = size_of(path)
        held = self.folds.get(self.fold_key(path, fold, start))
        return size is None or (held is not None and held[0] >= size)

    def folded(self, path: Path, fold, start, row_of: Callable):
        key = self.fold_key(path, fold, start)
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
            read = lines_from(path, offset)
            offset = read.end
            state = deepcopy(state)
            for found in rows(read.lines, row_of):
                state = fold(state, found)
            self.keep(key, offset, state, KEEP_EVERY)
        self.folds[key] = (offset, state)
        return state


CACHE = TranscriptCache(FOLD_CACHE)
