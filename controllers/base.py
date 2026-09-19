import shutil
import time
from dataclasses import asdict
from pathlib import Path

from engine.record import Record
from resources.base import Refused, Resource, SECTION, check_abstract, check_title, titled
from resources.pictures import dimensions
from resources.shapes import Options, check, normalize_options

FACES = ("👍", "❤️", "🎉", "😄", "👀", "🙏", "👎", "💔", "😠")


class Controller:
    resource = Resource
    actor = "user"

    def __init__(self, record: Record, actor: str | None = None, session: str = "", agent: str = ""):
        self.record = record
        self.session = session
        self.agent = agent
        if actor:
            self.actor = actor

    @property
    def type(self) -> str:
        return self.resource.type

    def path(self, n: int) -> Path:
        return self.record.folder(self.type, self.resource.scope) / f"{n:03d}.md"

    def numbers(self) -> list[int]:
        return sorted(int(p.stem) for p in self.record.folder(self.type, self.resource.scope).glob("*.md") if p.stem.isdigit())

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
        return {k: check(k, fields[k], normalize_options(v) if k == Options.options else v) if k in fields else v for k, v in data.items()}

    def create(self, title: str, abstract: str = "", brief: str = "", **data) -> Resource:
        with self.record.locked():
            n = (self.numbers() or [0])[-1] + 1
            about, supersedes = data.pop("about", None), data.pop("supersedes", 0)
            r = self.resource(n=n, title=check_title(title), abstract=check_abstract(abstract), brief=brief,
                              data={**self._shaped(data), **({"agent": self.agent, "dispatcher": self.session} if self.agent else {})}, created=time.time(), seen=[self.actor], refs=[about] if about else [])
            r = self.save(r, "created")
            if supersedes:
                self.complete(int(supersedes), how=f"superseded by {self.type} {n}")
                r = self.link(n, f"{self.type}:{int(supersedes)}")
            return r

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
            if s[SECTION.title] == title:
                s[SECTION.body] = body
                break
        else:
            r.sections.append({SECTION.title: title, SECTION.body: body})
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
        from controllers.types import Comments, Reactions
        parent = self.load(n)
        made = Comments(self.record, actor=self.actor).create(titled(text), brief=text.strip(), about=parent.ref)
        self.save(self.load(n), "commented", comment=made.n)
        return made

    def comments(self, n: int) -> list[Resource]:
        from controllers.types import Comments, Reactions
        return Comments(self.record, actor=self.actor).linked_to(f"{self.type}:{n}")

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

    def move(self, n: int, env: str) -> Resource:
        from engine.record import Record
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
        return self.read(n)

    def read(self, n: int) -> Resource:
        return self.read_all([n])[0]

    def read_all(self, numbers: list[int]) -> list[Resource]:
        rows = []
        changed = []
        wanted = list(dict.fromkeys(int(n) for n in numbers))
        with self.record.locked():
            for n in wanted:
                r = self.load(n)
                rows.append(r)
                if self.actor in r.seen:
                    continue
                r.seen.append(self.actor)
                r.updated = time.time()
                self.path(r.n).write_text(r.dump())
                changed.append(r)
            if changed:
                self.record.emit(self.type, changed[0].n, "updated", self.actor, numbers=[r.n for r in changed], seen=self.actor)
        return rows

    def unread(self, actor: str | None = None) -> list[Resource]:
        who = actor or self.actor
        return [r for r in self.all() if who not in r.seen and not r.completed]

    def all(self, deleted: bool = False) -> list[Resource]:
        memo = self.record.memo
        if memo is None or (self.type, deleted) not in memo:
            rows = [self.load(n) for n in self.numbers()]
            rows = rows if deleted else [r for r in rows if not r.deleted]
            if memo is None:
                return rows
            memo[self.type, deleted] = rows
        return [r.fork() for r in memo[self.type, deleted]]

    def search(self, term: str) -> list[Resource]:
        want = term.lower()
        return [r for r in self.all() if want in r.title.lower() or want in r.brief.lower() or want in r.abstract.lower()
                or any(want in s[SECTION.title].lower() or want in s[SECTION.body].lower() for s in r.sections)
                or any(want in name.lower() or want in str(tags).lower() for name, tags in r.files.items())]

    def find(self, name: str) -> Resource:
        if str(name).isdigit():
            return self.load(int(name))
        hits = [r for r in self.all() if name.lower() in r.title.lower()]
        if len(hits) != 1:
            raise Refused(f"{'no' if not hits else len(hits)} {self.type}{'' if len(hits) == 1 else 's'} match {name!r}" + ("; say more of the title" if len(hits) > 1 else ""))
        return hits[0]

    def react(self, n: int, face: str) -> Resource | None:
        if face not in FACES:
            raise Refused(f"a reaction is one of {' '.join(FACES)}")
        from controllers.types import Comments, Reactions
        r = self.load(n)
        reactions = Reactions(self.record, actor=self.actor)
        for made in reactions.linked_to(r.ref):
            if made.face == face and self.actor in made.seen[:1]:
                reactions.force_delete(made.n)
                return None
        return reactions.create(face, face=face, about=r.ref)

    def linked_to(self, ref: str) -> list[Resource]:
        return [r for r in self.all() if ref in r.refs]
