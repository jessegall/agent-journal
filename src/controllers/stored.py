import os
import time
import zipfile
from dataclasses import dataclass
from pathlib import Path
from resources.base import LAZY, MEMORY, OWNER, PART_OF, Refused, Resource
from engine.stored import read_json, write_json, write_text
from controllers.marks import internal

DAMAGED = "damaged"
DRAFT_OF = "draft_of"

INDEX = "index.json"
PACKED = "packed"
ARCHIVE = "zip"


def wholes(rows: list, part_of) -> list:
    return [row for row in rows if not part_of(row)]
SUMMARIES: dict[str, tuple] = {}
HELD: dict[str, tuple] = {}
PACKS: dict[str, tuple] = {}
INDEXED: dict[str, dict] = {}
STAMPED: dict[str, "Stamped"] = {}
STAMPS_FRESH = 60.0
WRITTEN: dict[str, float] = {}
FLUSH_ROWS, FLUSH_SECONDS = 50, 30.0
OPEN: dict[str, tuple] = {}


def mtime(path: Path) -> int:
    try:
        return path.stat().st_mtime_ns
    except OSError:
        return 0


def member(n: int) -> str:
    return f"{n:03d}.md"


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

class Stored:
    @internal
    def path(self, n: int) -> Path:
        folder = self._folder()
        return folder / f"{n:03d}" / f"{self.type}.md" if self.resource.own_folder else folder / f"{n:03d}.md"

    def _folder(self) -> Path:
        return self.record.folder(self.type, self.resource.scope)

    def _write_file(self, r: Resource) -> None:
        p = self.path(r.n)
        if self.resource.own_folder:
            p.parent.mkdir(parents=True, exist_ok=True)
        write_text(p, r.dump())
        if self.resource.own_folder:
            os.utime(self._folder())

    @internal
    def numbers(self) -> list[int]:
        folder = self.record.folder(self.type, self.resource.scope)
        if folder.is_dir():
            self.summaries()
        return sorted(set(INDEXED.get(str(folder), {})) | set(self._packed()))

    @internal
    def summaries(self) -> list[dict]:
        folder = self.record.folder(self.type, self.resource.scope)
        moved = self._moved(folder)
        held = SUMMARIES.get(str(folder))
        if held and held[0] == moved:
            return held[1]
        loose, wrote = self._indexed(folder)
        return self._summarised(folder, self._moved(folder) if wrote else moved, loose)

    def _moved(self, folder: Path) -> tuple:
        return (folder.stat().st_mtime_ns, mtime(folder / PACKED / INDEX))

    def _summarised(self, folder: Path, moved: tuple, loose: list[dict]) -> list[dict]:
        seen = {row["n"] for row in loose}
        packed = [row for n, row in self._packed().items() if n not in seen]
        rows = wholes(sorted(loose + packed, key=lambda row: row["n"]), lambda row: row.get(PART_OF) or row.get(DRAFT_OF))
        SUMMARIES[str(folder)] = (moved, rows)
        return rows

    def _reindexed(self, n: int, before: tuple | None, r: Resource | None = None) -> None:
        folder = self.record.folder(self.type, self.resource.scope)
        held, known = SUMMARIES.get(str(folder)), INDEXED.get(str(folder))
        if not held or known is None or held[0] != before:
            return
        if r is None:
            known.pop(n, None)
        else:
            found = self.path(n).stat()
            known[n] = self._row(r, f"{found.st_mtime_ns}-{found.st_size}")
        self._summarised(folder, self._moved(folder), [known[m] for m in sorted(known) if not known[m].get(DAMAGED)])

    def _row(self, r: Resource, stamp: str) -> dict:
        return {"n": r.n, "title": r.title, "deleted": r.deleted, "completed": r.completed, "seen": r.seen, "refs": r.refs, "updated": r.updated,
                "files": len(r.files), PART_OF: r.data.get(PART_OF, ""), DRAFT_OF: r.data.get(DRAFT_OF, ""), OWNER: r.data.get(OWNER, ""),
                **{k: r.data.get(k) for k in self.resource.indexed}, "stamp": stamp}

    def _packed(self) -> dict[int, dict]:
        index = self.record.folder(self.type, self.resource.scope) / PACKED / INDEX
        stamp = mtime(index)
        if not stamp:
            return {}
        held = PACKS.get(str(index))
        if not held or held[0] != stamp:
            held = PACKS[str(index)] = (stamp, {int(n): row for n, row in (read_json(index) or {}).items()})
        return held[1]

    def _stamps(self, folder: Path) -> dict[int, str]:
        if not self.resource.own_folder:
            mark, now = os.stat(folder).st_mtime_ns, time.monotonic()
            held = STAMPED.get(str(folder))
            fresh = held and now - held.checked < STAMPS_FRESH
            if fresh and held.mark == mark:
                return held.stamps
            stamps, inodes = {}, {}
            for e in os.scandir(folder):
                if not (e.name.endswith(".md") and e.name[:-3].isdigit()):
                    continue
                n = int(e.name[:-3])
                inodes[n] = e.inode()
                if fresh and held.inodes.get(n) == inodes[n]:
                    stamps[n] = held.stamps[n]
                else:
                    found = e.stat()
                    stamps[n] = f"{found.st_mtime_ns}-{found.st_size}"
            STAMPED[str(folder)] = Stamped(mark, held.checked if fresh else now, stamps, inodes)
            return stamps
        stamps = {}
        for e in os.scandir(folder):
            if not e.is_dir() or not e.name.isdigit():
                continue
            try:
                found = os.stat(os.path.join(e.path, f"{self.type}.md"))
            except OSError:
                continue
            stamps[int(e.name)] = f"{found.st_mtime_ns}-{found.st_size}"
        return stamps

    def _indexed(self, folder: Path) -> tuple[list[dict], bool]:
        stamps = self._stamps(folder)
        known = INDEXED.get(str(folder)) or {int(n): row for n, row in (read_json(folder / INDEX) or {}).items()}
        rows = {}
        for n, stamp in stamps.items():
            if known.get(n, {}).get("stamp") == stamp and (known[n].get(DAMAGED) or all(k in known[n] for k in ("files", PART_OF, DRAFT_OF, OWNER, *self.resource.indexed))):
                rows[n] = known[n]
                continue
            try:
                r = self.load(n)
            except (Refused, OSError) as error:
                rows[n] = {"n": n, DAMAGED: True, "stamp": stamp}
                if self.resource.type != "notice":
                    from engine.watch import damaged
                    damaged(self.record, str(self.path(n)), str(error))
                continue
            rows[n] = self._row(r, stamp)
        changed = sum(1 for n, row in rows.items() if known.get(n) is not row) + len(known.keys() - rows.keys())
        due = changed >= FLUSH_ROWS or time.time() - WRITTEN.get(str(folder), 0.0) >= FLUSH_SECONDS or not (folder / INDEX).is_file()
        wrote = bool(changed) and due
        if wrote:
            write_json(folder / INDEX, rows)
            WRITTEN[str(folder)] = time.time()
        INDEXED[str(folder)] = rows
        return [rows[n] for n in sorted(rows) if not rows[n].get(DAMAGED)], wrote

    def _titled(self, title: str, standing: bool = False) -> Resource | None:
        found = next((row["n"] for row in self.summaries() if row["title"] == title and not row["deleted"] and not (standing and row["completed"])), None)
        return self.load(found) if found else None

    @internal
    def load(self, n: int) -> Resource:
        r = self._peek(n)
        return r.fork() if self.resource.loading == MEMORY else r

    def _peek(self, n: int) -> Resource:
        p = self.path(n)
        try:
            found = p.stat()
            stamp, where = (found.st_mtime_ns, found.st_size), str(p)
        except OSError as error:
            entry = self._packed().get(n)
            if not entry:
                raise Refused(f"no {self.type} {n}") from error
            archive = self._folder() / PACKED / entry[ARCHIVE]
            stamp, where = (mtime(archive), 0), f"{archive}:{n}"
        if self.resource.loading != MEMORY:
            return self._parsed(n)
        held = HELD.get(where)
        if not held or held[0] != stamp:
            held = HELD[where] = (stamp, self._parsed(n))
        return held[1]

    def _text(self, n: int) -> str:
        p = self.path(n)
        if p.is_file():
            return p.read_text()
        entry = self._packed().get(n)
        if not entry:
            raise Refused(f"no {self.type} {n}")
        archive = self._folder() / PACKED / entry[ARCHIVE]
        try:
            return opened(archive).read(member(n)).decode()
        except (OSError, KeyError, zipfile.BadZipFile) as error:
            raise Refused(f"{self.type} {n} is missing from {archive}") from error

    def _parsed(self, n: int) -> Resource:
        try:
            return self.resource.load(self._text(n))
        except (ValueError, TypeError) as error:
            raise Refused(f"{self.type} {n} is damaged: {self.path(n)}") from error

    def _exists(self, n: int) -> bool:
        return self.path(n).is_file() or n in self._packed()

    def _remove(self, n: int) -> None:
        folder = self._folder()
        before = self._moved(folder) if folder.is_dir() else None
        self.path(n).unlink(missing_ok=True)
        if self.resource.own_folder and folder.is_dir():
            os.utime(folder)
        packed = self._packed()
        if n in packed:
            write_json(folder / PACKED / INDEX, {k: row for k, row in packed.items() if k != n})
        self._reindexed(n, before)

    def _pack(self, before: float) -> int:
        folder = self.record.folder(self.type, self.resource.scope)
        chosen = [row for row in self._indexed(folder)[0] if (row["completed"] or row["deleted"]) and row["updated"] < before]
        months: dict[str, list[dict]] = {}
        for row in chosen:
            months.setdefault(time.strftime("%Y-%m", time.localtime(row["updated"])), []).append(row)
        with self.record.locked():
            for month, rows in months.items():
                self._packed_into(folder, f"{month}.zip", rows)
        return len(chosen)

    def _packed_into(self, folder: Path, name: str, rows: list[dict]) -> None:
        archive = folder / PACKED / name
        archive.parent.mkdir(parents=True, exist_ok=True)
        texts = {row["n"]: (folder / member(row["n"])).read_bytes() for row in rows}
        index = self._packed()
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
                p.unlink()

    def _warm(self) -> None:
        if self.resource.loading == LAZY:
            return
        for row in self.summaries():
            if self.resource.loading == MEMORY:
                self.load(row["n"])

    def _viewed(self) -> list[Resource]:
        return [self._peek(row["n"]) for row in self.summaries() if not row["deleted"]]

    def _every(self, deleted: bool = False) -> list[Resource]:
        memo = self.record.memo
        if memo is None or (self.type, deleted) not in memo:
            rows = [(self.load if memo is None else self._peek)(row["n"]) for row in self.summaries()]
            rows = wholes([r for r in rows if deleted or not r.deleted], lambda r: r.data.get(PART_OF))
            if memo is None:
                return rows
            memo[self.type, deleted] = rows
        return [r.fork() for r in memo[self.type, deleted]]

    def _standing(self, closed_since: float = 0, closed_last: int = 0) -> list[Resource]:
        rows = [row for row in self.summaries() if not row["deleted"]]
        closed = [row for row in rows if row["completed"] and closed_since and row["completed"] >= closed_since]
        kept = sorted(closed, key=lambda row: row["completed"])[-closed_last:] if closed_last else closed
        return self._ordered([self.load(row["n"]) for row in rows if not row["completed"]] + [self.load(row["n"]) for row in kept])

    def _ordered(self, rows: list[Resource]) -> list[Resource]:
        return rows
