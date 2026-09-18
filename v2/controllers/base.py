import shutil
import time
from dataclasses import asdict
from pathlib import Path

from v2.engine.record import Record
from v2.resources.base import TITLE_MAX, Refused, Resource, check_abstract, check_title
from v2.resources.shapes import check


class Controller:
    resource = Resource
    actor = "user"

    def __init__(self, record: Record, actor: str | None = None):
        self.record = record
        if actor:
            self.actor = actor

    @property
    def type(self) -> str:
        return self.resource.type

    def path(self, n: int) -> Path:
        return self.record.folder(self.type, self.resource.scope) / f"{n:03d}.md"

    def numbers(self) -> list[int]:
        return sorted(int(p.stem) for p in self.record.folder(self.type, self.resource.scope).glob("[0-9][0-9][0-9].md"))

    def load(self, n: int) -> Resource:
        p = self.path(n)
        if not p.is_file():
            raise Refused(f"no {self.type} {n}")
        return self.resource.load(p.read_text())

    def save(self, r: Resource, action: str, **event) -> Resource:
        if self.actor not in r.seen:
            r.seen.append(self.actor)                # whoever acts on it has seen it
        r.updated = time.time()
        self.path(r.n).write_text(r.dump())
        self.record.emit(self.type, r.n, action, self.actor, **event)
        return r

    def _shaped(self, data: dict) -> dict:
        fields = self.resource.fields
        return {k: check(k, fields[k], v) if k in fields else v for k, v in data.items()}

    def create(self, title: str, abstract: str = "", brief: str = "", **data) -> Resource:
        with self.record.locked():
            n = (self.numbers() or [0])[-1] + 1
            about, supersedes = data.pop("about", None), data.pop("supersedes", 0)
            r = self.resource(n=n, title=check_title(title), abstract=check_abstract(abstract), brief=brief,
                              data=self._shaped(data), created=time.time(), seen=[self.actor])
            self.save(r, "created")
            if supersedes:
                self.complete(int(supersedes), how=f"superseded by {self.type} {n}")
                r = self.link(n, f"{self.type}:{int(supersedes)}")
            return self.link(n, about) if about else r

    def update(self, n: int, title: str | None = None, abstract: str | None = None, brief: str | None = None, outcome: str | None = None, **data) -> Resource:
        r = self.load(n)
        if title is not None:
            r.title = check_title(title)
        if abstract is not None:
            r.abstract = check_abstract(abstract)
        if brief is not None:
            r.brief = brief
        if outcome is not None:
            r.outcome = outcome
        r.data.update(self._shaped(data))
        return self.save(r, "updated")

    def set(self, n: int, key: str, value: str) -> Resource:
        return self.update(n, **{key: value})

    def section(self, n: int, title: str, body: str) -> Resource:
        r = self.load(n)
        for s in r.sections:
            if s["title"] == title:
                s["body"] = body
                break
        else:
            r.sections.append({"title": title, "body": body})
        return self.save(r, "updated", section=title)

    def delete(self, n: int, why: str = "") -> Resource:
        r = self.load(n)
        r.deleted = time.time()
        return self.save(r, "deleted", why=why)

    def complete(self, n: int, how: str = "", **data) -> Resource:
        r = self.load(n)
        if r.completed:
            raise Refused(f"{self.type} {n} is already {self.named('complete')}")
        r.completed = time.time()
        r.outcome = how
        return self.save(r, "completed", how=how, **data)

    def named(self, method: str) -> str:
        return self.resource.names.get(method, method)

    def method(self, name: str):
        for method, alias in self.resource.names.items():
            if alias == name:
                return getattr(self, method)
        if name in self.resource.names:
            raise Refused(f"a {self.type} calls that {self.resource.names[name]}")
        return getattr(self, name)

    def restore(self, n: int) -> Resource:
        r = self.load(n)
        r.deleted = 0.0
        return self.save(r, "updated", restored=True)

    def force_delete(self, n: int) -> None:
        self.load(n)
        self.path(n).unlink()
        self.record.emit(self.type, n, "deleted", self.actor, force=True)

    def link(self, n: int, ref: str) -> Resource:
        r = self.load(n)
        if ref not in r.refs:
            r.refs.append(ref)
        return self.save(r, "linked", to=ref)

    def unlink(self, n: int, ref: str) -> Resource:
        r = self.load(n)
        r.refs = [x for x in r.refs if x != ref]
        return self.save(r, "linked", to=ref, off=True)

    def comment(self, n: int, text: str) -> Resource:
        from v2.controllers.types import CONTROLLERS
        parent = self.load(n)
        made = CONTROLLERS["comment"](self.record, actor=self.actor).create(text.strip()[:TITLE_MAX].replace(":", " -"), brief=text.strip(), about=parent.ref)
        self.save(parent, "commented", comment=made.n)
        return made

    def comments(self, n: int) -> list[Resource]:
        from v2.controllers.types import CONTROLLERS
        return CONTROLLERS["comment"](self.record, actor=self.actor).linked_to(f"{self.type}:{n}")

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
        r.data.setdefault("files", {})[source.name] = what
        return self.save(r, "updated", file=source.name, what=what)

    def files(self, n: int) -> list[str]:
        return sorted(p.name for p in self.folder(n).iterdir())

    def move(self, n: int, env: str) -> Resource:
        from v2.engine.record import Record
        r = self.load(n)
        there = type(self)(Record(self.record.root, env), actor=self.actor)
        with there.record.locked():
            m = (there.numbers() or [0])[-1] + 1
            moved = self.resource(**{**asdict(r), "n": m})
            there.path(m).write_text(moved.dump())
            if self.folder(n).iterdir():
                shutil.copytree(self.folder(n), there.folder(m), dirs_exist_ok=True)
            there.record.emit(self.type, m, "created", self.actor, moved_from=f"{self.record.env}/{n}")
        self.delete(n, why=f"moved to {env} as {self.type} {m}")
        return moved

    def show(self, n: int) -> Resource:
        return self.see(n)

    def see(self, n: int) -> Resource:
        r = self.load(n)
        if self.actor in r.seen:
            return r
        r.seen.append(self.actor)
        return self.save(r, "updated", seen=self.actor)

    def unseen(self, actor: str | None = None) -> list[Resource]:
        who = actor or self.actor
        return [r for r in self.all() if who not in r.seen]

    def all(self, deleted: bool = False) -> list[Resource]:
        rows = [self.load(n) for n in self.numbers()]
        return rows if deleted else [r for r in rows if not r.deleted]

    def search(self, term: str) -> list[Resource]:
        want = term.lower()
        return [r for r in self.all() if want in r.title.lower() or want in r.brief.lower() or want in r.abstract.lower()
                or any(want in s["title"].lower() or want in s["body"].lower() for s in r.sections)]

    def find(self, name: str) -> Resource:
        if str(name).isdigit():
            return self.load(int(name))
        hits = [r for r in self.all() if name.lower() in r.title.lower()]
        if len(hits) != 1:
            raise Refused(f"{'no' if not hits else len(hits)} {self.type}{'' if len(hits) == 1 else 's'} match {name!r}" + ("; say more of the title" if len(hits) > 1 else ""))
        return hits[0]

    def linked_to(self, ref: str) -> list[Resource]:
        return [r for r in self.all() if ref in r.refs]
