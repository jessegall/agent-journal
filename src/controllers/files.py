import mimetypes
import os
import shutil
import tempfile
from dataclasses import asdict, dataclass
from pathlib import Path
from resources.base import Refused, Resource
from resources.pictures import dimensions
from engine.paths import contained
from engine.record import Record
from engine.transaction import undoable
from controllers.marks import action

REVISIONS = "revisions"


@dataclass(frozen=True)
class HeldFile:
    ref: str
    type: str
    n: int
    env: str
    title: str
    name: str
    description: str
    size: int
    image: bool




class Files:
    @action
    def folder(self, n: int) -> Path:
        self.load(n)
        f = self.rows.row_folder(n)
        f.mkdir(exist_ok=True)
        return f

    @action
    def attach(self, n: int, path: str, description: str = "") -> Resource:
        source = Path(path)
        if not source.exists():
            raise Refused(f"no such file: {path}")
        with self.record.locked(self.resource.scope):
            folder = self.folder(n)
            target = contained(folder, source.name)
            r = self.load(n)
            r.files[source.name] = description
            self._shipped(r, "updated")
            self._guarded(r, "updated")
            with tempfile.TemporaryDirectory(dir=folder) as scratch:
                staging = Path(scratch) / "staging"
                staging.mkdir()
                staged = staging / source.name
                if source.is_dir():
                    shutil.copytree(source, staged)
                else:
                    shutil.copy2(source, staged)
                size = dimensions(staged) if staged.is_file() else None
                if size:
                    r.pictures[source.name] = list(size)
                with undoable():
                    saved = self.save(r, "updated", file=source.name, description=description)
                    previous = Path(scratch) / "previous"
                    if target.exists():
                        os.replace(target, previous)
                    try:
                        os.replace(staged, target)
                    except OSError:
                        if previous.exists():
                            os.replace(previous, target)
                        raise
                    return saved

    @action
    def tag(self, n: int, name: str, tags: str) -> Resource:
        r = self.load(n)
        if name not in r.files:
            raise Refused(f"{self.type} {n} has no file {name}")
        r.files[name] = tags.strip()
        return self.save(r, "updated", file=name, tags=tags.strip())

    @action
    def files(self, n: int) -> list[str]:
        return sorted(p.name for p in self.folder(n).iterdir() if p.name not in self._kept_beside())

    def _kept_beside(self) -> set[str]:
        return {f"{self.type}.md", REVISIONS} if self.resource.own_folder else set()

    def listed_files(self, rows: list) -> list[dict]:
        """The files attached to each of these rows, each with its size, read from the environment the row lives in."""
        held = []
        for row in rows:
            folder = Record(self.record.root, row.home_env or self.record.env).folder(row.type, row.scope).joinpath(f"{row.n:03d}")
            for name, description in sorted(row.files.items()):
                file = contained(folder, name)
                if file.is_file():
                    held.append(asdict(HeldFile(row.ref, row.type, row.n, row.home_env, row.title, name, description, file.stat().st_size,
                                                (mimetypes.guess_type(name)[0] or "").startswith("image/"))))
        return held

    @action
    def paths(self, n: int) -> list[str]:
        folder = self.folder(n)
        return [str(contained(folder, name).resolve()) for name in self.files(n)]

    @action
    def detach(self, n: int, name: str, why: str = "") -> Resource:
        with self.record.locked(self.resource.scope):
            r = self.load(n)
            if name not in r.files:
                raise Refused(f"{self.type} {n} has no file {name}")
            target = contained(self.folder(n), name)
            struck = contained(self.folder(n) / "struck", name)
            r.files.pop(name)
            r.pictures.pop(name, None)
            saved = self.save(r, "updated", detached=name, why=why)
            struck.parent.mkdir(exist_ok=True)
            shutil.move(str(target), str(struck))
            return saved

    @action
    def index(self, n: int) -> Resource:
        r = self.load(n)
        known = r.files
        for f in self.folder(n).iterdir():
            if f.is_file() and f.name not in known and f.name not in self._kept_beside():
                known[f.name] = ""
        return self.save(r, "updated", indexed=sorted(known))

    def _attached(self) -> list[Resource]:
        return [self.peek(row["n"]) for row in self.rows.summaries() if row.get("files") and not row["deleted"]]
