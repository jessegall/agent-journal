import os
from pathlib import Path
from resources.base import LAZY, MEMORY, PART_OF, Refused, Resource
from engine.stored import read_json, write_json
from controllers.marks import internal

INDEX = "index.json"


def newest_parts(rows: list, part_of) -> list:
    newest = {part_of(row): row for row in rows if part_of(row)}
    return [row for row in rows if not part_of(row) or newest[part_of(row)] is row]
SUMMARIES: dict[str, tuple] = {}
HELD: dict[str, tuple] = {}


class Stored:
    @internal
    def path(self, n: int) -> Path:
        return self.record.folder(self.type, self.resource.scope) / f"{n:03d}.md"

    @internal
    def numbers(self) -> list[int]:
        return sorted(int(p.stem) for p in self.record.folder(self.type, self.resource.scope).glob("*.md") if p.stem.isdigit())

    @internal
    def summaries(self) -> list[dict]:
        folder = self.record.folder(self.type, self.resource.scope)
        moved = folder.stat().st_mtime_ns
        held = SUMMARIES.get(str(folder))
        if held and held[0] == moved:
            return held[1]
        rows = newest_parts(self._indexed(folder), lambda row: row.get(PART_OF))
        SUMMARIES[str(folder)] = (folder.stat().st_mtime_ns, rows)
        return rows

    def _indexed(self, folder: Path) -> list[dict]:
        stamps = {int(e.name[:-3]): f"{e.stat().st_mtime_ns}-{e.stat().st_size}" for e in os.scandir(folder) if e.name.endswith(".md") and e.name[:-3].isdigit()}
        known = {int(n): row for n, row in (read_json(folder / INDEX) or {}).items()}
        rows = {}
        for n, stamp in stamps.items():
            if known.get(n, {}).get("stamp") == stamp and all(k in known[n] for k in ("files", PART_OF, *self.resource.indexed)):
                rows[n] = known[n]
                continue
            try:
                r = self.load(n)
            except (Refused, OSError):
                continue
            rows[n] = {"n": n, "title": r.title, "deleted": r.deleted, "completed": r.completed, "seen": r.seen, "refs": r.refs, "updated": r.updated, "files": len(r.files), PART_OF: r.data.get(PART_OF, ""), **{k: r.data.get(k) for k in self.resource.indexed}, "stamp": stamp}
        if rows != known:
            write_json(folder / INDEX, rows)
        return [rows[n] for n in sorted(rows)]

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
        except OSError:
            raise Refused(f"no {self.type} {n}")
        if self.resource.loading != MEMORY:
            return self.resource.load(p.read_text())
        stamp = (found.st_mtime_ns, found.st_size)
        held = HELD.get(str(p))
        if not held or held[0] != stamp:
            held = HELD[str(p)] = (stamp, self.resource.load(p.read_text()))
        return held[1]

    def _warm(self) -> None:
        if self.resource.loading == LAZY:
            return
        for row in self.summaries():
            if self.resource.loading == MEMORY:
                self.load(row["n"])

    def _every(self, deleted: bool = False) -> list[Resource]:
        memo = self.record.memo
        if memo is None or (self.type, deleted) not in memo:
            rows = [self.load(n) for n in self.numbers()]
            rows = newest_parts([r for r in rows if deleted or not r.deleted], lambda r: r.data.get(PART_OF))
            if memo is None:
                return rows
            memo[self.type, deleted] = rows
        return [r.fork() for r in memo[self.type, deleted]]

    def _standing(self) -> list[Resource]:
        return self._ordered([self.load(row["n"]) for row in self.summaries() if not row["deleted"] and not row["completed"]])

    def _ordered(self, rows: list[Resource]) -> list[Resource]:
        return rows
