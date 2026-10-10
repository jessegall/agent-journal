import os
import sys
import threading
import time
import zipfile
from bisect import bisect_left, insort
from dataclasses import dataclass, field, replace
from pathlib import Path
from typing import Callable, TypeVar
from resources.base import OWNER, PART_OF, Counter, Missing, Refused, Resource
from engine.stored import append_text, read_json, write_json, write_text
from engine import transaction
from engine.memo import MEMOS, Memo
from engine.numbers import rows

T = TypeVar("T")
DAMAGED = "damaged"
DRAFT_OF = "draft_of"
IDEMPOTENCY = "idempotency"

INDEX = "index.json"
CACHE = ".index"
CHANGES = "changes.log"
PACKED = "packed"
ARCHIVE = "zip"


def wholes(rows: list, part_of) -> list:
    return [row for row in rows if not part_of(row)]
SUMMARIES: dict[str, tuple] = {}
STANDING: dict[str, tuple] = {}
DERIVED: dict[tuple[str, str], tuple] = {}
COUNTED: dict[tuple[str, str], tuple] = {}
HELD: dict[str, Memo] = {}
ALL = 0   # a memo with no limit keeps every row
PACKS = Memo()
INDEXED: dict[str, dict] = {}
PENDING: dict[str, set[int]] = {}
INDEXED_AT: dict[str, dict[int, str]] = {}
STAMPED: dict[str, "Stamped"] = {}
STAMPED_OWN: dict[str, "Stamped"] = {}
PARSED = "journal.parsed"
STAMPS_FRESH = 60.0
STAMPS_RENEW = STAMPS_FRESH / 2
KEPT_TIMES = 10   # a request serves stamps this many times older than they should be renewed, since only the renewal walks a folder
WRITTEN: dict[str, float] = {}
FLUSH_ROWS, FLUSH_SECONDS = 200, 300.0
UNSAVED: dict[str, tuple["RowStore", Path, dict]] = {}
UNCOUNTED: dict[str, "RowStore"] = {}
SEEDS: dict[str, dict[str, tuple[int, ...]]] = {}
COUNTERS = "counters.json"
DEFER = threading.Event()
OPEN: dict[str, tuple] = {}
KEEP_OPEN = 16


def rolling(folder: str, limit: int | None) -> Memo:
    """The parsed rows a folder keeps in memory: at most `limit` of them, the one used longest ago going first, or all of them when a type holds all."""
    if folder not in HELD:
        HELD[folder] = Memo(ALL if limit is None else limit)
    return HELD[folder]


def forget_folder(home: Path) -> None:
    """Lets go of everything held for a folder and the folders under it (summaries, stamps, indexes, totals, parsed rows and open archives), as when an environment is removed or renamed."""
    prefix = str(home)

    def under(key: str) -> bool:
        return key == prefix or key.startswith(prefix + os.sep)
    for table in (SUMMARIES, STANDING, INDEXED, PENDING, INDEXED_AT, STAMPED, STAMPED_OWN, WATCHED.marks, WRITTEN, UNSAVED, UNCOUNTED, SEEDS, OPEN):
        for key in [key for key in table if under(key)]:
            opened_archive = table.pop(key)
            if table is OPEN:
                opened_archive[1].close()
    for table in (COUNTED, DERIVED):
        for key in [key for key in table if under(key[0])]:
            del table[key]
    for key in [key for key in HELD if under(key)]:
        memo = HELD.pop(key)
        if memo in MEMOS:
            MEMOS.remove(memo)
    PACKS.held = {key: held for key, held in PACKS.held.items() if not under(key)}


def file_stamp(path: Path) -> list[int] | None:
    try:
        found = path.stat()
    except OSError:
        return None
    return [found.st_mtime_ns, found.st_size]


def summed(weigh: Callable[[dict], tuple[int, ...]], width: int, rows: list[dict]) -> tuple[int, ...]:
    return tuple(sum(column) for column in zip(*map(weigh, rows))) or (0,) * width


def mtime(path: Path) -> int:
    try:
        return path.stat().st_mtime_ns
    except OSError:
        return 0


@dataclass
class Watched:
    """The marks of the folders and pack indexes a server holds, renewed by its watch loop once a tick, so a request reads them from memory; a process with no watch loop asks the disk."""
    marks: dict[str, int] = field(default_factory=dict)
    on: bool = False


WATCHED = Watched()


def mark_of(path: Path) -> int:
    """The modification time of a folder or pack index: from the watch loop's last look in a server, from the disk anywhere else."""
    key = str(path)
    if WATCHED.on and key in WATCHED.marks:
        return WATCHED.marks[key]
    found = path.stat().st_mtime_ns if path.name != INDEX else mtime(path)
    if WATCHED.on:
        WATCHED.marks[key] = found
    return found


def remark(path: Path) -> None:
    """A write of this process changed the folder or index: its mark is looked at again at once, so the write is never read as stale."""
    if WATCHED.on:
        WATCHED.marks[str(path)] = mtime(path)


def watch_marks() -> None:
    """The watch loop's one look a tick at every mark this server holds, which is all the disk a warm read needs; a folder whose mark moved has its row stamps looked at again here, off every request."""
    WATCHED.on = True
    now = time.monotonic()
    for key in list(WATCHED.marks):
        WATCHED.marks[key] = mtime(Path(key))
        held = STAMPED.get(key)
        if held is not None and held.mark != WATCHED.marks[key]:
            try:
                RowStore.restat(Path(key), WATCHED.marks[key], held, now)
            except OSError:
                STAMPED.pop(key, None)


def restamp(path: Path, n: int) -> None:
    """A write of this process changed one row: its stamp is taken at once, so a read in a watched server never serves the row as it was."""
    held = STAMPED.get(str(path.parent))
    if not (WATCHED.on and held):
        return
    stamps, inodes = dict(held.stamps), dict(held.inodes)
    try:
        found = path.stat()
        stamps[n], inodes[n] = stamp_of(found), found.st_ino
    except OSError:
        stamps.pop(n, None)
        inodes.pop(n, None)
    STAMPED[str(path.parent)] = replace(held, stamps=stamps, inodes=inodes)


def forgotten(path: Path) -> None:
    """A rolled-back write put this file back: what is kept in memory of the row, and of the folder it lies in, is dropped, so the next read starts from the disk."""
    forget_folder(path.parent.parent if path.name == f"{path.parent.parent.name}.md" else path.parent)


transaction.UNDONE.append(forgotten)


def index_file(folder: Path) -> Path:
    """Where a folder keeps the index of its rows: in a folder of its own, so saving it never changes the modification time of the folder that holds the rows."""
    return folder / CACHE / INDEX


def numbered(n: int) -> str:
    return f"{n:03d}"


def member(n: int) -> str:
    return f"{numbered(n)}.md"


def stamp_of(found: os.stat_result) -> str:
    return f"{found.st_mtime_ns}-{found.st_size}"


def listed_order(row: dict) -> tuple[float, int]:
    return row.get("created", 0.0), row["n"]


def is_part(row: dict) -> bool:
    return bool(row.get(PART_OF) or row.get(DRAFT_OF))


def opened(archive: Path) -> zipfile.ZipFile:
    stamp = mtime(archive)
    held = OPEN.get(str(archive))
    if not held or held[0] != stamp:
        if held:
            held[1].close()
        else:
            evict_oldest()
        held = OPEN[str(archive)] = (stamp, zipfile.ZipFile(archive))
    return held[1]


def evict_oldest() -> None:
    if len(OPEN) >= KEEP_OPEN:
        OPEN.pop(next(iter(OPEN)))[1].close()


def close_all() -> None:
    for _, archive in OPEN.values():
        archive.close()
    OPEN.clear()


@dataclass(frozen=True)
class Moved:
    folder_stamp: int
    index_stamp: int
    rows: tuple[tuple[int, str], ...] = ()


@dataclass(frozen=True)
class Stamped:
    mark: int
    checked: float
    stamps: dict
    inodes: dict
    noted: int

def saved(folder: Path, rows: dict) -> None:
    """Writes a folder's row index to its place, and takes away the index an older version left beside the rows."""
    write_json(index_file(folder), rows)
    (folder / INDEX).unlink(missing_ok=True)


def flush_indexes() -> None:
    """Writes the row indexes that a read left to be saved later, and the index of a folder whose totals were counted from its rows, so no request waits on a write of its own."""
    for key in list(UNSAVED):
        store, folder, rows = UNSAVED.pop(key)
        store.save_index(folder, dict(rows))
        WRITTEN[key] = time.time()
        UNCOUNTED.pop(key, None)
    for key in list(UNCOUNTED):
        store = UNCOUNTED.pop(key)
        if key in INDEXED:
            store.save_index(Path(key), dict(INDEXED[key]))
            WRITTEN[key] = time.time()


def renew_stamps() -> None:
    """Looks at every row file of the folders whose stamps near their expiry, so that no request pays for it."""
    now = time.monotonic()
    for key, held in list(STAMPED.items()):
        if now - held.checked < STAMPS_RENEW:
            continue
        try:
            RowStore.restat(Path(key), os.stat(key).st_mtime_ns, None, now)
        except OSError:
            STAMPED.pop(key, None)


class RowStore:
    def __init__(self, record, resource, order, visible, also, on_damage):
        self.record = record
        self.resource = resource
        self.type = resource.type
        self.order = order
        self.visible = visible
        self.also = also
        self.on_damage = on_damage

    def path(self, n: int) -> Path:
        return self.row_folder(n) / f"{self.type}.md" if self.resource.own_folder else self.folder() / member(n)

    def folder(self) -> Path:
        return self.record.folder(self.type, self.resource.scope)

    def row_folder(self, n: int) -> Path:
        return self.folder() / numbered(n)

    def write_file(self, r: Resource) -> None:
        self.record.fence(self.resource.scope)
        p = self.path(r.n)
        if self.resource.own_folder:
            p.parent.mkdir(parents=True, exist_ok=True)
        else:
            self._note(r.n)
        write_text(p, r.dump())
        if self.resource.own_folder:
            os.utime(self.folder())

    def draw_number(self) -> int:
        return self.record.numbers.draw(self._sequence(), self._floor)

    def next_number(self) -> int:
        return self.record.numbers.peek(self._sequence(), self._floor)

    def _sequence(self) -> str:
        return rows(self.record.scope_name(self.resource.scope), self.type)

    def _floor(self) -> int:
        return (self.numbers() or [0])[-1] + 1

    def persist(self, r: Resource) -> None:
        folder = self.folder()
        before = self._moved(folder) if folder.is_dir() else None
        self.write_file(r)
        remark(folder)
        restamp(self.path(r.n), r.n)
        self.reindexed(r.n, before, r)

    def _note(self, n: int) -> None:
        append_text(self.folder() / CHANGES, f"{n}\n")

    @staticmethod
    def _noted_end(folder: Path) -> int:
        try:
            return (folder / CHANGES).stat().st_size
        except OSError:
            return 0

    def _noted(self, folder: Path, since: int) -> tuple[set[int], int]:
        try:
            with (folder / CHANGES).open("rb") as changes:
                changes.seek(0, os.SEEK_END)
                end = changes.tell()
                if end <= since:
                    return set(), end
                changes.seek(since)
                read = changes.read(end - since).decode()
        except OSError:
            return set(), 0
        whole = read[:read.rfind("\n") + 1]
        return {int(line) for line in whole.splitlines() if line.isdigit()}, since + len(whole.encode())

    def numbers(self) -> list[int]:
        return self._scanned(lambda folder: sorted(set(self._stamps(folder)) | set(self.packed())))

    def summaries(self) -> list[dict]:
        return self._scanned(self._summaries)

    def _scanned(self, scan: Callable[[Path], T]) -> T:
        try:
            return scan(self.folder())
        except FileNotFoundError:
            return scan(self.record.remake_folder(self.type, self.resource.scope))

    def _summaries(self, folder: Path) -> list[dict]:
        moved = self._moved(folder)
        held = SUMMARIES.get(str(folder))
        if held and held[0] == moved:
            return held[1]
        loose = self._loose(folder)
        if held and held[0].index_stamp == moved.index_stamp:
            touched = PENDING.pop(str(folder), set())
            if len(touched) < FLUSH_ROWS:
                return self._patched(folder, moved, held[1], loose, touched)
        return self._summarised(folder, moved, [loose[n] for n in sorted(loose) if not loose[n].get(DAMAGED)])

    def derived(self, name: str, keys_of: Callable[[dict], list]) -> dict:
        """The summaries grouped by the keys `keys_of` names for each, kept in step with them: a change takes a row out of its groups and puts it in its new ones, so asking never walks the rows."""
        rows = self.summaries()
        key = (str(self.folder()), name)
        held = DERIVED.get(key)
        if held and held[0] is rows:
            return held[1]
        groups: dict = {}
        for row in rows:
            self._grouped(groups, keys_of, row)
        DERIVED[key] = (rows, groups, keys_of)
        return groups

    @staticmethod
    def _grouped(groups: dict, keys_of: Callable[[dict], list], row: dict) -> None:
        for group in keys_of(row):
            groups.setdefault(group, {})[row["n"]] = row

    def linking(self) -> dict[str, dict[int, dict]]:
        """The rows that name each ref."""
        return self.derived("refs", lambda row: row["refs"])

    def linked_to(self, ref: str) -> list[dict]:
        return sorted(self.linking().get(ref, {}).values(), key=listed_order)

    def by(self, field: str, value) -> list[dict]:
        """The summaries whose field is the value, oldest first; the field is one the summaries carry."""
        return sorted(self.derived(f"by:{field}", lambda row: [row.get(field)]).get(value, {}).values(), key=listed_order)

    def unread(self, actor: str) -> list[dict]:
        """The open summaries the actor has not seen, oldest first, from the index of what each row has been seen by."""
        group = self.derived(f"unread:{actor}", lambda row: [True] if not row["completed"] and not row["deleted"] and actor not in row["seen"] else [])
        return sorted(group.get(True, {}).values(), key=listed_order)

    def counted(self, name: str, weigh: Callable[[dict], tuple[int, ...]], width: int, rows: list[dict] | None = None) -> tuple[int, ...]:
        """Sums weigh over the summaries, kept in step with them: a change adds and takes away only the rows it touched."""
        rows = rows if rows is not None else self.summaries()
        key = (str(self.folder()), name)
        held = COUNTED.get(key)
        if held and held[0] is rows:
            return held[1]
        totals = summed(weigh, width, rows)
        COUNTED[key] = (rows, totals, weigh)
        return totals

    def counter(self, name: str) -> Counter:
        return next(counter for counter in self.resource.counters() if counter.name == name)

    def counts(self, name: str, rows: list[dict] | None = None) -> tuple[int, ...]:
        """A total the type declares, read from the totals kept with the rows: made from the rows once when none were saved, and saved with the index from then on."""
        counter, folder = self.counter(name), self.folder()
        rows = rows if rows is not None else self.summaries()
        counted = (str(folder), name) in COUNTED
        totals = self.counted(name, counter.weigh, counter.width, rows)
        if not counted:
            UNCOUNTED[str(folder)] = self
        return totals

    def save_index(self, folder: Path, rows: dict) -> None:
        """Writes the index with the totals of its rows beside it, bound to this very file, so a total is only believed while the index it was made with stands."""
        saved(folder, rows)
        stamp = file_stamp(index_file(folder))
        listed = self._listed(rows)
        totals = {counter.name: list(summed(counter.weigh, counter.width, listed)) for counter in self.resource.counters()}
        write_json(folder / CACHE / COUNTERS, {"index": stamp, "totals": totals})

    def _listed(self, rows: dict) -> list[dict]:
        """The summaries an index makes: its rows that are whole, with the packed rows it does not hold."""
        loose = [row for n, row in sorted(rows.items()) if not row.get(DAMAGED)]
        seen = {row["n"] for row in loose}
        return wholes(sorted(loose + [row for n, row in self.packed().items() if n not in seen], key=listed_order), is_part)

    def _seed(self, folder: Path, index_stamp: list[int]) -> None:
        """Takes the saved totals as the totals of a folder just loaded, when they were saved with the very index that was read and no row differs from it."""
        found = read_json(folder / CACHE / COUNTERS, dict, {})
        if found.get("index") != index_stamp:
            return
        saved_totals = found.get("totals") or {}
        seeds = {counter.name: tuple(saved_totals[counter.name]) for counter in self.resource.counters()
                 if len(saved_totals.get(counter.name) or ()) == counter.width}
        if len(seeds) == len(self.resource.counters()):
            SEEDS[str(folder)] = seeds

    def drifted(self) -> int:
        """Sets right every total that no longer equals a sum made from the rows, and says how many it set right: for rows changed without a word, as by a pull, a hand edit or an older build."""
        rows, found = self.summaries(), 0
        for counter in self.resource.counters():
            key = (str(self.folder()), counter.name)
            fresh = summed(counter.weigh, counter.width, rows)
            if key in COUNTED and COUNTED[key][1] != fresh:
                COUNTED[key] = (rows, fresh, counter.weigh)
                UNCOUNTED[str(self.folder())] = self
                found += 1
        return found

    def recount(self) -> None:
        """Forgets the totals of this folder, so they are made from the rows again and saved: for totals that drifted from their rows."""
        folder = str(self.folder())
        for key in [key for key in COUNTED if key[0] == folder]:
            del COUNTED[key]
        SEEDS.pop(folder, None)
        (self.folder() / CACHE / COUNTERS).unlink(missing_ok=True)
        UNCOUNTED[folder] = self

    def _carried(self, folder: Path, before: list[dict], rows: list[dict], changes: list[tuple[dict | None, dict | None]]) -> None:
        self._carried_index(folder, before, rows, changes)
        for key, held in [(key, held) for key, held in COUNTED.items() if key[0] == str(folder) and held[0] is before]:
            _, totals, weigh = held
            for gone, added in changes:
                totals = tuple(total - was + now for total, was, now in zip(totals, weigh(gone) if gone else (0,) * len(totals), weigh(added) if added else (0,) * len(totals)))
            COUNTED[key] = (rows, totals, weigh)

    def _carried_index(self, folder: Path, before: list[dict], rows: list[dict], changes: list[tuple[dict | None, dict | None]]) -> None:
        for key, (held, groups, keys_of) in [(key, held) for key, held in DERIVED.items() if key[0] == str(folder)]:
            if held is not before:
                continue
            for gone, added in changes:
                for group in keys_of(gone) if gone else ():
                    groups.get(group, {}).pop(gone["n"], None)
                if added:
                    self._grouped(groups, keys_of, added)
            DERIVED[key] = (rows, groups, keys_of)

    def standing_summaries(self) -> list[dict]:
        rows = self.summaries()
        held = STANDING.get(str(self.folder()))
        if held and held[0] is rows:
            return held[1]
        standing = [row for row in rows if not row["completed"] and not row["deleted"]]
        STANDING[str(self.folder())] = (rows, standing)
        return standing

    def _patched(self, folder: Path, moved: Moved, held: list[dict], loose: dict[int, dict], touched: set[int]) -> list[dict]:
        rows = list(held)
        listed = {row["n"]: row for row in held if row["n"] in touched}
        carried: list[tuple[dict | None, dict | None]] = []
        for n in sorted(touched):
            if n in listed:
                self._unlisted(rows, listed[n])
            row = loose.get(n) or self.packed().get(n)
            added = row if row and not row.get(DAMAGED) and not is_part(row) else None
            if added:
                insort(rows, added, key=listed_order)
            carried.append((listed.get(n), added))
        SUMMARIES[str(folder)] = (moved, rows)
        self._carried(folder, held, rows, carried)
        return rows

    def _moved(self, folder: Path) -> Moved:
        rows = tuple(sorted(self._stamps(folder).items())) if self.resource.own_folder else ()
        return Moved(mark_of(folder), mark_of(folder / PACKED / INDEX), rows)

    def _summarised(self, folder: Path, moved: Moved, loose: list[dict]) -> list[dict]:
        seen = {row["n"] for row in loose}
        packed = [row for n, row in self.packed().items() if n not in seen]
        rows = wholes(sorted(loose + packed, key=listed_order), is_part)
        SUMMARIES[str(folder)] = (moved, rows)
        PENDING.pop(str(folder), None)
        for name, totals in SEEDS.pop(str(folder), {}).items():
            COUNTED[str(folder), name] = (rows, totals, self.counter(name).weigh)
        return rows

    def reindexed(self, n: int, before: Moved | None, r: Resource | None = None) -> None:
        folder = self.folder()
        held, known = SUMMARIES.get(str(folder)), INDEXED.get(str(folder))
        if not held or known is None or held[0] != before:
            return
        rows = list(held[1])
        before_row = known.get(n) or self.packed().get(n)
        if before_row is not None:
            self._unlisted(rows, before_row)
        added = None
        if r is None:
            known.pop(n, None)
        else:
            known[n] = self._row(r, stamp_of(self.path(n).stat()))
            if not is_part(known[n]):
                added = known[n]
                insort(rows, added, key=listed_order)
        SUMMARIES[str(folder)] = (self._moved(folder), rows)
        self._carried(folder, held[1], rows, [(before_row, added)])

    @staticmethod
    def _unlisted(rows: list[dict], row: dict) -> None:
        at = bisect_left(rows, listed_order(row), key=listed_order)
        if at < len(rows) and rows[at]["n"] == row["n"]:
            del rows[at]

    def _row(self, r: Resource, stamp: str) -> dict:
        return {"n": r.n, "created": r.created, IDEMPOTENCY: r.data.get(IDEMPOTENCY, ""), "title": r.title, "deleted": r.deleted, "completed": r.completed, "seen": r.seen, "refs": r.refs, "updated": r.updated,
                "files": len(r.files), PART_OF: r.data.get(PART_OF, ""), DRAFT_OF: r.data.get(DRAFT_OF, ""), OWNER: r.data.get(OWNER, ""),
                **{k: r.data.get(k) for k in self.resource.indexed}, "stamp": stamp}

    def packed(self) -> dict[int, dict]:
        index = self.folder() / PACKED / INDEX
        stamp = mtime(index)
        if not stamp:
            return {}
        return PACKS.get(str(index), stamp, lambda: {int(n): {**row, "stamp": stamp} for n, row in read_json(index, dict, {}).items()})

    def _stamps(self, folder: Path) -> dict[int, str]:
        if not self.resource.own_folder:
            mark, now = mark_of(folder), time.monotonic()
            held = STAMPED.get(str(folder))
            kept = held and now - held.checked < STAMPS_FRESH * KEPT_TIMES
            if kept and held.mark == mark:
                return held.stamps
            if kept:
                changed, noted = self._noted(folder, held.noted)
                if changed:
                    return self._restamped(folder, mark, held, changed, noted)
            return self.restat(folder, mark, held if kept else None, now)
        mark, now = os.stat(folder).st_mtime_ns, time.monotonic()
        held = STAMPED_OWN.get(str(folder))
        if held and held.mark == mark and now - held.checked < STAMPS_FRESH:
            return held.stamps
        stamps = {}
        for e in os.scandir(folder):
            if not e.is_dir() or not e.name.isdigit():
                continue
            try:
                found = os.stat(os.path.join(e.path, f"{self.type}.md"))
            except OSError:
                continue
            stamps[int(e.name)] = stamp_of(found)
        STAMPED_OWN[str(folder)] = Stamped(mark, now, stamps, {}, 0)
        return stamps

    @staticmethod
    def restat(folder: Path, mark: int, trusted: "Stamped | None", now: float) -> dict[int, str]:
        """Stamps every row file of a folder, trusting the held stamp of a file whose inode is unchanged when `trusted` is given."""
        noted = RowStore._noted_end(folder)
        stamps, inodes = {}, {}
        for e in os.scandir(folder):
            if not (e.name.endswith(".md") and e.name[:-3].isdigit()):
                continue
            n = int(e.name[:-3])
            inodes[n] = e.inode()
            if trusted and trusted.inodes.get(n) == inodes[n]:
                stamps[n] = trusted.stamps[n]
            else:
                stamps[n] = stamp_of(e.stat())
        STAMPED[str(folder)] = Stamped(mark, trusted.checked if trusted else now, stamps, inodes, noted)
        return stamps

    def _restamped(self, folder: Path, mark: int, held: Stamped, changed: set[int], noted: int) -> dict[int, str]:
        stamps, inodes = dict(held.stamps), dict(held.inodes)
        for n in changed:
            try:
                found = self.path(n).stat()
            except OSError:
                stamps.pop(n, None)
                inodes.pop(n, None)
                continue
            stamps[n], inodes[n] = stamp_of(found), found.st_ino
        STAMPED[str(folder)] = Stamped(mark, held.checked, stamps, inodes, noted)
        return stamps

    def _indexed(self, folder: Path) -> list[dict]:
        rows = self._loose(folder)
        return [rows[n] for n in sorted(rows) if not rows[n].get(DAMAGED)]

    def _loose(self, folder: Path) -> dict[int, dict]:
        stamps = self._stamps(folder)
        held = INDEXED.get(str(folder))
        index_stamp = None if held else file_stamp(index_file(folder))
        known = held or {int(n): row for n, row in read_json(index_file(folder), dict, read_json(folder / INDEX, dict, {})).items()}
        needed = {"created", IDEMPOTENCY, "files", PART_OF, DRAFT_OF, OWNER, *self.resource.indexed}
        stale = self._stale(stamps, known, INDEXED_AT.get(str(folder)) if held else None, needed)
        gone = known.keys() - stamps.keys()
        rows = dict(known)
        for n in gone:
            del rows[n]
        for n in stale:
            try:
                r = self.load(n)
            except (Refused, OSError) as error:
                rows[n] = {"n": n, DAMAGED: True, "stamp": stamps[n]}
                self.on_damage(str(self.path(n)), str(error))
                continue
            rows[n] = self._row(r, stamps[n])
        changed = len(stale) + len(gone)
        if not held and not changed and index_stamp:
            self._seed(folder, index_stamp)
        due = changed >= FLUSH_ROWS or time.time() - WRITTEN.get(str(folder), 0.0) >= FLUSH_SECONDS or not index_file(folder).is_file()
        if changed and due and DEFER.is_set():
            UNSAVED[str(folder)] = (self, folder, rows)
        elif changed and due:
            self.save_index(folder, rows)
            WRITTEN[str(folder)] = time.time()
        if changed:
            PENDING.setdefault(str(folder), set()).update(gone, stale)
        INDEXED[str(folder)] = rows
        INDEXED_AT[str(folder)] = stamps
        return rows

    @staticmethod
    def _stale(stamps: dict[int, str], known: dict[int, dict], seen: dict[int, str] | None, needed: set[str]) -> list[int]:
        """The rows whose file differs from the row held for it; once a folder is held, only the stamps that differ from the last pass are looked at."""
        if seen is not None:
            return [n for n, _ in stamps.items() - seen.items()]
        return [n for n, stamp in stamps.items() if (row := known.get(n)) is None or row.get("stamp") != stamp or not (DAMAGED in row or needed <= row.keys())]

    def by_idempotency(self, key: str) -> Resource | None:
        found = next((row["n"] for row in self.summaries() if row[IDEMPOTENCY] == key), None)
        return self.load(found) if found else None

    def by_title(self, title: str, standing: bool = False) -> Resource | None:
        found = next((row["n"] for row in self.summaries() if row["title"] == title and not row["deleted"] and not (standing and row["completed"])), None)
        return self.load(found) if found else None

    def load(self, n: int | str) -> Resource:
        return self.peek(int(n)).fork()

    def peek(self, n: int) -> Resource:
        p = self.path(n)
        try:
            stamps = self._stamps(p.parent) if WATCHED.on and not self.resource.own_folder else {}
            if n in stamps:
                stamp, where = stamps[n], str(p)
            else:
                found = p.stat()
                stamp, where = (found.st_mtime_ns, found.st_size), str(p)
        except OSError as error:
            entry = self.packed().get(n)
            if not entry:
                raise Missing(f"no {self.type} {n}") from error
            archive = self.folder() / PACKED / entry[ARCHIVE]
            stamp, where = (mtime(archive), 0), f"{archive}:{n}"
        return self.rolling().get(where, stamp, lambda: self._parsed(n))

    def rolling(self) -> Memo:
        return rolling(str(self.folder()), self.resource.held)

    def discard(self, n: int) -> None:
        """Drops the row held in memory, so what the disk holds is the only truth of it again, as after a save that was refused."""
        self.rolling().forget(str(self.path(n)))
        entry = self.packed().get(n)
        if entry:
            self.rolling().forget(f"{self.folder() / PACKED / entry[ARCHIVE]}:{n}")

    def reparsed(self, n: int) -> Resource:
        """The row as the disk holds it now, read again and not kept, so it pushes out none of the rows the type keeps; a search of every row's text and a rollback read it so."""
        return self._parsed(n)

    def text(self, n: int) -> str:
        try:
            return self.path(n).read_text()
        except (FileNotFoundError, NotADirectoryError):
            pass
        entry = self.packed().get(n)
        if not entry:
            raise Refused(f"no {self.type} {n}")
        archive = self.folder() / PACKED / entry[ARCHIVE]
        try:
            return opened(archive).read(member(n)).decode()
        except (OSError, KeyError, zipfile.BadZipFile) as error:
            raise Refused(f"{self.type} {n} is missing from {archive}") from error

    def _parsed(self, n: int) -> Resource:
        sys.audit(PARSED, self.type, n)
        try:
            return self.resource.load(self.text(n))
        except (ValueError, TypeError) as error:
            raise Refused(f"{self.type} {n} is damaged: {self.path(n)}") from error

    def exists(self, n: int) -> bool:
        return self.path(n).is_file() or n in self.packed()

    def remove(self, n: int) -> None:
        self.record.fence(self.resource.scope)
        folder = self.folder()
        before = self._moved(folder) if folder.is_dir() else None
        self.rolling().forget(str(self.path(n)))
        self.path(n).unlink(missing_ok=True)
        restamp(self.path(n), n)
        if self.resource.own_folder and folder.is_dir():
            os.utime(folder)
        elif folder.is_dir():
            self._note(n)
        packed = self.packed()
        if n in packed:
            write_json(folder / PACKED / INDEX, {k: row for k, row in packed.items() if k != n})
            remark(folder / PACKED / INDEX)
        remark(folder)
        self.reindexed(n, before)

    def pack(self, before: float) -> int:
        folder = self.folder()
        chosen = [row for row in self._indexed(folder) if (row["completed"] or row["deleted"]) and row["updated"] < before and (folder / member(row["n"])).is_file()]
        days: dict[str, list[dict]] = {}
        for row in chosen:
            days.setdefault(time.strftime("%Y-%m-%d", time.localtime(row["updated"])), []).append(row)
        for day, rows in days.items():
            with self.record.locked(self.resource.scope):
                self._packed_into(folder, f"{day}.zip", rows)
        return len(chosen)

    def _packed_into(self, folder: Path, name: str, rows: list[dict]) -> None:
        archive = folder / PACKED / name
        archive.parent.mkdir(parents=True, exist_ok=True)
        texts = {row["n"]: (folder / member(row["n"])).read_bytes() for row in rows}
        index = self.packed()
        kept = {n for n, entry in index.items() if entry[ARCHIVE] == name and n not in texts}
        building = archive.with_suffix(".new")
        with zipfile.ZipFile(building, "w", zipfile.ZIP_DEFLATED) as out:
            for n in sorted(kept):
                out.writestr(member(n), opened(archive).read(member(n)))
            for n, text in texts.items():
                out.writestr(member(n), text)
        with zipfile.ZipFile(building) as check:
            if any(check.read(member(n)) != text for n, text in texts.items()):
                building.unlink()
                raise OSError(f"{building} did not read back as written")
        building.replace(archive)
        write_json(folder / PACKED / INDEX, {**index, **{row["n"]: {**{k: v for k, v in row.items() if k != "stamp"}, ARCHIVE: name} for row in rows}})
        remark(folder / PACKED / INDEX)
        for row in rows:
            p = folder / member(row["n"])
            if p.is_file() and p.read_bytes() == texts[row["n"]]:
                self.rolling().forget(str(p))
                p.unlink()

    def warm(self) -> None:
        """Reads the index of the rows; a type that is eager also parses its open rows, a few at a time so the others go on, and any other row is parsed when it is first asked for."""
        self.summaries()
        if not self.resource.eager:
            return
        for at, row in enumerate(self.standing_summaries()):
            try:
                self.peek(row["n"])
            except Missing:
                continue
            if at % 25 == 24:
                time.sleep(0.001)

    def _peeked(self, rows) -> list[Resource]:
        found = []
        for row in rows:
            try:
                found.append(self.peek(row["n"]))
            except Missing:
                continue
        return found

    def viewed(self) -> list[Resource]:
        return self._peeked(row for row in self.summaries() if not row["deleted"])

    def attached(self) -> list[Resource]:
        return self._peeked(row for row in self.summaries() if row["files"] and not row["deleted"])

    def every(self, deleted: bool = False) -> list[Resource]:
        memo = self.record.memo
        if memo is None or (self.type, deleted) not in memo:
            rows = self._peeked(self.summaries())
            rows = wholes([r for r in rows if deleted or not r.deleted], lambda r: r.data.get(PART_OF))
            if memo is None:
                return self.order(rows)
            memo[self.type, deleted] = rows
        return self.order(list(memo[self.type, deleted]))

    def standing(self, closed_since: float = 0, closed_last: int = 0) -> list[Resource]:
        own = [r for r in self.kept(closed_since, closed_last) if (self.resource.hidden_listed or not r.hidden) and self.visible(r)]
        return [*own, *self.also()]

    def kept(self, closed_since: float = 0, closed_last: int = 0) -> list[Resource]:
        """The rows still open, and the ones closed lately when asked for; inside one event they are listed once, every later ask is answered from that listing."""
        memo, key = self.record.memo, (self.type, "kept", closed_since, closed_last)
        if memo is not None and key in memo:
            return list(memo[key])
        standing = self._peeked(self.standing_summaries())
        if closed_since:
            closed = [row for row in self.summaries() if row["completed"] and not row["deleted"] and row["completed"] >= closed_since]
            kept = sorted(closed, key=lambda row: row["completed"])[-closed_last:] if closed_last else closed
            standing = standing + self._peeked(kept)
        listed = self.order(standing)
        if memo is not None:
            memo[key] = listed
        return list(listed)
