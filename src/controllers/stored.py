import os
import time
import zipfile
from bisect import bisect_left
from dataclasses import dataclass
from pathlib import Path
from resources.base import LAZY, MEMORY, OWNER, PART_OF, Missing, Refused, Resource
from engine.stored import append_text, read_json, write_json, write_text
from engine.memo import Memo

DAMAGED = "damaged"
DRAFT_OF = "draft_of"

INDEX = "index.json"
CHANGES = "changes.log"
PACKED = "packed"
ARCHIVE = "zip"


def wholes(rows: list, part_of) -> list:
    return [row for row in rows if not part_of(row)]
SUMMARIES: dict[str, tuple] = {}
HELD = Memo()
PACKS = Memo()
INDEXED: dict[str, dict] = {}
STAMPED: dict[str, "Stamped"] = {}
STAMPS_FRESH = 60.0
WRITTEN: dict[str, float] = {}
FLUSH_ROWS, FLUSH_SECONDS = 200, 300.0
OPEN: dict[str, tuple] = {}


def mtime(path: Path) -> int:
    try:
        return path.stat().st_mtime_ns
    except OSError:
        return 0


def numbered(n: int) -> str:
    return f"{n:03d}"


def member(n: int) -> str:
    return f"{numbered(n)}.md"


def stamp_of(found: os.stat_result) -> str:
    return f"{found.st_mtime_ns}-{found.st_size}"


def is_part(row: dict) -> bool:
    return bool(row.get(PART_OF) or row.get(DRAFT_OF))


def opened(archive: Path) -> zipfile.ZipFile:
    stamp = mtime(archive)
    held = OPEN.get(str(archive))
    if not held or held[0] != stamp:
        if held:
            held[1].close()
        held = OPEN[str(archive)] = (stamp, zipfile.ZipFile(archive))
    return held[1]



@dataclass(frozen=True)
class Stamped:
    mark: int
    checked: float
    stamps: dict
    inodes: dict
    noted: int

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
        p = self.path(r.n)
        if self.resource.own_folder:
            p.parent.mkdir(parents=True, exist_ok=True)
        else:
            self._note(r.n)
        write_text(p, r.dump())
        if self.resource.own_folder:
            os.utime(self.folder())

    def persist(self, r: Resource) -> None:
        folder = self.folder()
        before = self._moved(folder) if folder.is_dir() else None
        self.write_file(r)
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
        folder = self.folder()
        return sorted(set(self._stamps(folder)) | set(self.packed()))

    def summaries(self) -> list[dict]:
        folder = self.folder()
        moved = self._moved(folder)
        held = SUMMARIES.get(str(folder))
        if held and held[0] == moved:
            return held[1]
        loose = self._loose(folder)
        if held and held[0][1] == moved[1]:
            touched = self._differing(held[1], loose)
            if len(touched) < FLUSH_ROWS:
                return self._patched(folder, moved, held[1], loose, touched)
        return self._summarised(folder, moved, [loose[n] for n in sorted(loose) if not loose[n].get(DAMAGED)])

    def _differing(self, held: list[dict], loose: dict[int, dict]) -> set[int]:
        listed = {row["n"]: row for row in held}
        packed = self.packed()
        shown = {n: row for n, row in loose.items() if not (row.get(DAMAGED) or is_part(row))}
        return {n for n, row in shown.items() if listed.get(n) is not row} | {n for n in listed if n not in shown and n not in packed}

    def _patched(self, folder: Path, moved: tuple, held: list[dict], loose: dict[int, dict], touched: set[int]) -> list[dict]:
        rows = list(held)
        for n in sorted(touched):
            at = bisect_left(rows, n, key=lambda row: row["n"])
            if at < len(rows) and rows[at]["n"] == n:
                del rows[at]
            row = loose.get(n) or self.packed().get(n)
            if row and not row.get(DAMAGED) and not is_part(row):
                rows.insert(at, row)
        SUMMARIES[str(folder)] = (moved, rows)
        return rows

    def _moved(self, folder: Path) -> tuple:
        return (folder.stat().st_mtime_ns, mtime(folder / PACKED / INDEX))

    def _summarised(self, folder: Path, moved: tuple, loose: list[dict]) -> list[dict]:
        seen = {row["n"] for row in loose}
        packed = [row for n, row in self.packed().items() if n not in seen]
        rows = wholes(sorted(loose + packed, key=lambda row: row["n"]), is_part)
        SUMMARIES[str(folder)] = (moved, rows)
        return rows

    def reindexed(self, n: int, before: tuple | None, r: Resource | None = None) -> None:
        folder = self.folder()
        held, known = SUMMARIES.get(str(folder)), INDEXED.get(str(folder))
        if not held or known is None or held[0] != before:
            return
        rows = list(held[1])
        at = bisect_left(rows, n, key=lambda row: row["n"])
        if at < len(rows) and rows[at]["n"] == n:
            del rows[at]
        if r is None:
            known.pop(n, None)
        else:
            known[n] = self._row(r, stamp_of(self.path(n).stat()))
            if not is_part(known[n]):
                rows.insert(at, known[n])
        SUMMARIES[str(folder)] = (self._moved(folder), rows)

    def _row(self, r: Resource, stamp: str) -> dict:
        return {"n": r.n, "title": r.title, "deleted": r.deleted, "completed": r.completed, "seen": r.seen, "refs": r.refs, "updated": r.updated,
                "files": len(r.files), PART_OF: r.data.get(PART_OF, ""), DRAFT_OF: r.data.get(DRAFT_OF, ""), OWNER: r.data.get(OWNER, ""),
                **{k: r.data.get(k) for k in self.resource.indexed}, "stamp": stamp}

    def packed(self) -> dict[int, dict]:
        index = self.folder() / PACKED / INDEX
        stamp = mtime(index)
        if not stamp:
            return {}
        return PACKS.get(str(index), stamp, lambda: {int(n): row for n, row in read_json(index, dict, {}).items()})

    def _stamps(self, folder: Path) -> dict[int, str]:
        if not self.resource.own_folder:
            mark, now = os.stat(folder).st_mtime_ns, time.monotonic()
            held = STAMPED.get(str(folder))
            fresh = held and now - held.checked < STAMPS_FRESH
            if fresh and held.mark == mark:
                return held.stamps
            if fresh:
                changed, noted = self._noted(folder, held.noted)
                if changed:
                    return self._restamped(folder, mark, held, changed, noted)
            noted = self._noted_end(folder)
            stamps, inodes = {}, {}
            for e in os.scandir(folder):
                if not (e.name.endswith(".md") and e.name[:-3].isdigit()):
                    continue
                n = int(e.name[:-3])
                inodes[n] = e.inode()
                if fresh and held.inodes.get(n) == inodes[n]:
                    stamps[n] = held.stamps[n]
                else:
                    stamps[n] = stamp_of(e.stat())
            STAMPED[str(folder)] = Stamped(mark, held.checked if fresh else now, stamps, inodes, noted)
            return stamps
        stamps = {}
        for e in os.scandir(folder):
            if not e.is_dir() or not e.name.isdigit():
                continue
            try:
                found = os.stat(os.path.join(e.path, f"{self.type}.md"))
            except OSError:
                continue
            stamps[int(e.name)] = stamp_of(found)
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
        known = INDEXED.get(str(folder)) or {int(n): row for n, row in read_json(folder / INDEX, dict, {}).items()}
        needed = {"files", PART_OF, DRAFT_OF, OWNER, *self.resource.indexed}
        rows = {}
        for n, stamp in stamps.items():
            row = known.get(n)
            if row is not None and row.get("stamp") == stamp and (DAMAGED in row or needed <= row.keys()):
                rows[n] = row
                continue
            try:
                r = self.load(n)
            except (Refused, OSError) as error:
                rows[n] = {"n": n, DAMAGED: True, "stamp": stamp}
                self.on_damage(str(self.path(n)), str(error))
                continue
            rows[n] = self._row(r, stamp)
        changed = sum(1 for n, row in rows.items() if known.get(n) is not row) + len(known.keys() - rows.keys())
        due = changed >= FLUSH_ROWS or time.time() - WRITTEN.get(str(folder), 0.0) >= FLUSH_SECONDS or not (folder / INDEX).is_file()
        if changed and due:
            write_json(folder / INDEX, rows)
            WRITTEN[str(folder)] = time.time()
        INDEXED[str(folder)] = rows
        return rows

    def by_title(self, title: str, standing: bool = False) -> Resource | None:
        found = next((row["n"] for row in self.summaries() if row["title"] == title and not row["deleted"] and not (standing and row["completed"])), None)
        return self.load(found) if found else None

    def load(self, n: int | str) -> Resource:
        r = self.peek(int(n))
        return r.fork() if self.resource.loading == MEMORY else r

    def peek(self, n: int) -> Resource:
        p = self.path(n)
        try:
            found = p.stat()
            stamp, where = (found.st_mtime_ns, found.st_size), str(p)
        except OSError as error:
            entry = self.packed().get(n)
            if not entry:
                raise Missing(f"no {self.type} {n}") from error
            archive = self.folder() / PACKED / entry[ARCHIVE]
            stamp, where = (mtime(archive), 0), f"{archive}:{n}"
        if self.resource.loading != MEMORY:
            return self._parsed(n)
        return HELD.get(where, stamp, lambda: self._parsed(n))

    def text(self, n: int) -> str:
        p = self.path(n)
        if p.is_file():
            return p.read_text()
        entry = self.packed().get(n)
        if not entry:
            raise Refused(f"no {self.type} {n}")
        archive = self.folder() / PACKED / entry[ARCHIVE]
        try:
            return opened(archive).read(member(n)).decode()
        except (OSError, KeyError, zipfile.BadZipFile) as error:
            raise Refused(f"{self.type} {n} is missing from {archive}") from error

    def _parsed(self, n: int) -> Resource:
        try:
            return self.resource.load(self.text(n))
        except (ValueError, TypeError) as error:
            raise Refused(f"{self.type} {n} is damaged: {self.path(n)}") from error

    def exists(self, n: int) -> bool:
        return self.path(n).is_file() or n in self.packed()

    def remove(self, n: int) -> None:
        folder = self.folder()
        before = self._moved(folder) if folder.is_dir() else None
        HELD.forget(str(self.path(n)))
        self.path(n).unlink(missing_ok=True)
        if self.resource.own_folder and folder.is_dir():
            os.utime(folder)
        elif folder.is_dir():
            self._note(n)
        packed = self.packed()
        if n in packed:
            write_json(folder / PACKED / INDEX, {k: row for k, row in packed.items() if k != n})
        self.reindexed(n, before)

    def pack(self, before: float) -> int:
        folder = self.folder()
        chosen = [row for row in self._indexed(folder) if (row["completed"] or row["deleted"]) and row["updated"] < before]
        days: dict[str, list[dict]] = {}
        for row in chosen:
            days.setdefault(time.strftime("%Y-%m-%d", time.localtime(row["updated"])), []).append(row)
        with self.record.locked(self.resource.scope):
            for day, rows in days.items():
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
        for row in rows:
            p = folder / member(row["n"])
            if p.is_file() and p.read_bytes() == texts[row["n"]]:
                HELD.forget(str(p))
                p.unlink()

    def warm(self) -> None:
        rows = self.summaries()
        if self.resource.loading == LAZY:
            return
        for row in rows:
            if self.resource.loading == MEMORY:
                self.load(row["n"])

    def viewed(self) -> list[Resource]:
        return [self.peek(row["n"]) for row in self.summaries() if not row["deleted"]]

    def every(self, deleted: bool = False) -> list[Resource]:
        memo = self.record.memo
        if memo is None or (self.type, deleted) not in memo:
            rows = [self.peek(row["n"]) for row in self.summaries()]
            rows = wholes([r for r in rows if deleted or not r.deleted], lambda r: r.data.get(PART_OF))
            if memo is None:
                return self.order(rows)
            memo[self.type, deleted] = rows
        return self.order(list(memo[self.type, deleted]))

    def standing(self, closed_since: float = 0, closed_last: int = 0) -> list[Resource]:
        own = [r for r in self.kept(closed_since, closed_last) if (self.resource.hidden_listed or not r.hidden) and self.visible(r)]
        return [*own, *self.also()]

    def kept(self, closed_since: float = 0, closed_last: int = 0) -> list[Resource]:
        rows = [row for row in self.summaries() if not row["deleted"]]
        closed = [row for row in rows if row["completed"] and closed_since and row["completed"] >= closed_since]
        kept = sorted(closed, key=lambda row: row["completed"])[-closed_last:] if closed_last else closed
        return self.order([self.peek(row["n"]) for row in rows if not row["completed"]] + [self.peek(row["n"]) for row in kept])
