import os
import shutil
import tempfile
from pathlib import Path
from resources.base import Refused, Resource
from resources.pictures import dimensions
from engine.paths import contained
from engine.stored import undoable

REVISIONS = "revisions"




class Files:
    def folder(self, n: int) -> Path:
        self.load(n)
        f = self._row_folder(n)
        f.mkdir(exist_ok=True)
        return f

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

    def tag(self, n: int, name: str, tags: str) -> Resource:
        r = self.load(n)
        if name not in r.files:
            raise Refused(f"{self.type} {n} has no file {name}")
        r.files[name] = tags.strip()
        return self.save(r, "updated", file=name, tags=tags.strip())

    def files(self, n: int) -> list[str]:
        return sorted(p.name for p in self.folder(n).iterdir() if p.name not in self._kept_beside())

    def _kept_beside(self) -> set[str]:
        return {f"{self.type}.md", REVISIONS} if self.resource.own_folder else set()

    def paths(self, n: int) -> list[str]:
        folder = self.folder(n)
        return [str(contained(folder, name).resolve()) for name in self.files(n)]

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

    def index(self, n: int) -> Resource:
        r = self.load(n)
        known = r.files
        for f in self.folder(n).iterdir():
            if f.is_file() and f.name not in known and f.name not in self._kept_beside():
                known[f.name] = ""
        return self.save(r, "updated", indexed=sorted(known))

    def _attached(self) -> list[Resource]:
        return [self.load(row["n"]) for row in self.summaries() if row.get("files") and not row["deleted"]]
