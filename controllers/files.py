import shutil
from pathlib import Path
from resources.base import Refused, Resource
from resources.pictures import dimensions




class Files:
    def folder(self, n: int) -> Path:
        self.load(n)
        f = self.record.folder(self.type, self.resource.scope) / f"{n:03d}"
        f.mkdir(exist_ok=True)
        return f

    def attach(self, n: int, path: str, what: str = "") -> Resource:
        source = Path(path)
        if not source.exists():
            raise Refused(f"no such file: {path}")
        target = self.folder(n) / source.name
        shutil.copytree(source, target, dirs_exist_ok=True) if source.is_dir() else shutil.copy2(source, target)
        r = self.load(n)
        r.files[source.name] = what
        size = dimensions(target) if target.is_file() else None
        if size:
            r.pictures[source.name] = list(size)
        return self.save(r, "updated", file=source.name, what=what)

    def tag(self, n: int, name: str, tags: str) -> Resource:
        r = self.load(n)
        if name not in r.files:
            raise Refused(f"{self.type} {n} has no file {name}")
        r.files[name] = tags.strip()
        return self.save(r, "updated", file=name, tags=tags.strip())

    def files(self, n: int) -> list[str]:
        return sorted(p.name for p in self.folder(n).iterdir())

    def paths(self, n: int) -> list[str]:
        return [str((self.folder(n) / name).resolve()) for name in self.files(n)]

    def detach(self, n: int, name: str, why: str = "") -> Resource:
        r = self.load(n)
        if name not in r.files:
            raise Refused(f"{self.type} {n} has no file {name}")
        struck = self.folder(n) / "struck"
        struck.mkdir(exist_ok=True)
        shutil.move(str(self.folder(n) / name), str(struck / name))
        r.files.pop(name)
        r.pictures.pop(name, None)
        return self.save(r, "updated", detached=name, why=why)

    def index(self, n: int) -> Resource:
        r = self.load(n)
        known = r.files
        for f in self.folder(n).iterdir():
            if f.is_file() and f.name not in known:
                known[f.name] = ""
        return self.save(r, "updated", indexed=sorted(known))

    def _attached(self) -> list[Resource]:
        return [self.load(row["n"]) for row in self.summaries() if row.get("files") and not row["deleted"]]
