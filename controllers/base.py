import shutil
import time
from dataclasses import asdict
from functools import partial

from engine.markers import plain
from engine.record import Record
from resources.base import SYSTEM, USER, Refused, Resource, SECTION, check_abstract, check_title
from resources.shapes import Options, check, normalize_options, typed
from engine.stored import write_text
from controllers.files import Files
from controllers.links import Links
from controllers.marks import internal
from controllers.stored import Stored

WORDS = ("title", "abstract", "brief")
LAST = 25
TWICE_WITHIN = 10.0
COMMANDS: dict[str, dict] = {}
HANDLERS: dict[str, list] = {}
CONTROLLERS: dict[str, type] = {}
NAMED: dict[str, type] = {}


class Controller(Stored, Files, Links):
    resource = Resource
    actor = "user"

    def __init__(self, record: Record, actor: str | None = None, session: str = "", agent: str = "", force: str = ""):
        self.record = record
        self.session = session
        self.agent = agent
        self.force = force
        self.forced: list[str] = []
        if actor:
            self.actor = actor

    def _refuse(self, why: str) -> None:
        if not self.force:
            raise Refused(why)
        self.forced.append(why)

    @property
    def type(self) -> str:
        return self.resource.type

    def _note_force(self, r: Resource) -> None:
        if not self.forced:
            return
        r.data["forced"] = [*(r.data.get("forced") or []),
                            {"why": self.force, "past": list(self.forced), "who": self.actor, "at": time.time()}]
        self.forced = []

    def _guarded(self, r: Resource, action: str) -> None:
        allowed = self.resource.editors.get((r.seen or [""])[0])
        if allowed is None or self.actor in allowed or not self._exists(r.n):
            return
        stored = self.load(r.n)
        parts = [section[SECTION.title] for section in stored.sections]
        rewritten = any(getattr(stored, f) != getattr(r, f) for f in WORDS) or [section[SECTION.title] for section in r.sections][:len(parts)] != parts
        if action == "deleted" or rewritten:
            self._refuse(f"{self.type} {r.n} was written by the {stored.seen[0]}: answer it with journal {self.type} {self.resource.answer_command} {r.n} \"<text>\" instead of changing it")

    def _shipped(self, r: Resource, action: str) -> None:
        if self.actor == SYSTEM or not self._exists(r.n):
            return
        stored = self.load(r.n)
        if not stored.data.get("system"):
            return
        free = ("kept", *self.resource.progress)
        kept = lambda row: {k: v for k, v in row.data.items() if k not in free}
        if action in ("deleted", "completed") or any(getattr(stored, f) != getattr(r, f) for f in WORDS) or \
                stored.sections != r.sections or kept(stored) != kept(r):
            self._refuse(f"{self.type} {r.n} ships with the journal and cannot be changed or removed")

    @internal
    def save(self, r: Resource, action: str, **event) -> Resource:
        self._shipped(r, action)
        self._guarded(r, action)
        self._unmarked(r)
        self._note_force(r)
        if self.actor not in r.seen:
            r.seen.append(self.actor)
        r.updated = time.time()
        folder = self.path(r.n).parent
        before = self._moved(folder) if folder.is_dir() else None
        write_text(self.path(r.n), r.dump())
        self._reindexed(r.n, before, r)
        self.record.emit(self.type, r.n, action, self.actor, **event)
        return r

    def _unmarked(self, r: Resource) -> None:
        r.title, r.abstract, r.brief, r.outcome = plain(r.title), plain(r.abstract), plain(r.brief), plain(r.outcome)
        r.sections = [{**s, SECTION.body: plain(s.get(SECTION.body) or "")} for s in r.sections]

    def _finished(self, r: Resource) -> bool:
        return bool(r.completed)

    def _handled(self, action: str, /, **args):
        for fn in HANDLERS.get(f"{self.type}.{action}", []) + HANDLERS.get(action, []):
            taken = fn(self, **args)
            if taken is not None:
                return taken
        return None

    def _shaped(self, data: dict) -> dict:
        fields = self.resource.fields
        return {k: check(k, fields[k], normalize_options(v) if k == Options.options else v) if k in fields else v for k, v in data.items()}

    def _twin(self, title: str, brief: str, about) -> Resource | None:
        if not self.resource.deduplicates:
            return None
        since = time.time() - TWICE_WITHIN
        lately = [row["n"] for row in self.summaries() if not row["deleted"] and row["updated"] >= since]
        recent = (self.load(n) for n in reversed(lately[-20:]))
        return next((r for r in recent if r.created >= since and r.title == title and r.brief == brief
                     and r.seen[:1] == [self.actor] and (not about or about in r.refs)), None)

    def create(self, title: str, abstract: str = "", brief: str = "", **data) -> Resource:
        twin = self._twin(title, brief, data.get("about"))
        if twin is not None:
            return twin
        taken = self._handled("create", title=title, abstract=abstract, brief=brief, **data)
        if taken is not None:
            return taken
        for name in self.resource.required:
            if not data.get(name):
                self._refuse(f"a {self.type} needs {name}: --set {name}=\"<word>,<word>\"")
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
        taken = self._handled("update", n=n, title=title, abstract=abstract, brief=brief, outcome=outcome, **data)
        if taken is not None:
            return taken
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

    def stamp(self, n: int, **data) -> Resource:
        r = self.load(n)
        r.data.update(self._shaped(data))
        r.updated = time.time()
        write_text(self.path(r.n), r.dump())
        self.record.emit(self.type, r.n, "stamped", self.actor, quiet=True, fields=sorted(data))
        return r

    def set(self, n: int, key: str, value: str) -> Resource:
        return self.update(n, **{key: typed(value)})

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
        taken = self._handled("delete", n=n, why=why)
        if taken is not None:
            return taken
        r = self.load(n)
        r.deleted = time.time()
        return self.save(r, "deleted", why=why)

    def complete(self, n: int, how: str = "", **data) -> Resource:
        taken = self._handled("complete", n=n, how=how, **data)
        if taken is not None:
            return taken
        r = self.load(n)
        if r.completed:
            self._refuse(f"{self.type} {n} is already closed")
        r.completed = time.time()
        r.outcome = how
        r.data.update(self._shaped(data))
        if self.resource.lists_completed_unread and self.actor != USER:
            r.seen = [who for who in r.seen if who != USER]
        return self.save(r, "completed", how=how, **data)

    def reopen(self, n: int, why: str) -> Resource:
        r = self.load(n)
        if r.deleted:
            self._refuse(f"{self.type} {n} is archived; restore it before reopening it")
        if not r.completed:
            self._refuse(f"{self.type} {n} is not {self.named('complete')}")
        r.completed = 0.0
        r.outcome = ""
        return self.save(r, "reopened", why=why)

    @internal
    def named(self, method: str) -> str:
        return self.resource.command_names.get(method, method)

    @internal
    def method(self, name: str):
        for method, alias in self.resource.command_names.items():
            if alias == name:
                return getattr(self, method)
        if name in self.resource.command_names:
            self._refuse(f"a {self.type} calls that {self.resource.command_names[name]}")
        return self.action(name)

    @internal
    def action(self, name: str):
        command = COMMANDS.get(self.type, {}).get(name)
        if command:
            return partial(command, self)
        for method, alias in self.resource.command_names.items():
            if alias == name:
                return getattr(self, method)
        return getattr(self, name)

    def restore(self, n: int) -> Resource:
        r = self.load(n)
        r.deleted = 0.0
        return self.save(r, "updated", restored=True)

    def force_delete(self, n: int) -> None:
        self.load(n)
        self._remove(n)
        self.record.emit(self.type, n, "deleted", self.actor, force=True)

    def move(self, n: int, env: str) -> Resource:
        from engine.record import Record
        r = self.load(n)
        there = type(self)(Record(self.record.root, env), actor=self.actor)
        with there.record.locked():
            m = (there.numbers() or [0])[-1] + 1
            moved = self.resource(**{**asdict(r), "n": m})
            if any(self.folder(n).iterdir()):
                shutil.copytree(self.folder(n), there.folder(m), dirs_exist_ok=True)
            there.save(moved, "created", moved_from=f"{self.record.env}/{n}")
        self.delete(n, why=f"moved to {env} as {self.type} {m}")
        return moved

    def show(self, n: int) -> Resource:
        row = self.read(n)
        self._handled("show", row=row)
        return row

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
                write_text(self.path(r.n), r.dump())
                changed.append(r)
            if changed:
                self.record.emit(self.type, changed[0].n, "updated", self.actor, numbers=[r.n for r in changed], seen=self.actor)
        return rows

    def unread(self, actor: str | None = None) -> list[Resource]:
        who = actor or self.actor
        return [self.load(row["n"]) for row in self.summaries() if who not in row["seen"] and not row["completed"] and not row["deleted"]]

    def all(self, deleted: bool = False, completed: bool = False, last: int = LAST) -> list[Resource]:
        rows = self._every(deleted) if completed or deleted else self._standing()
        rows = rows if completed else [r for r in rows if not r.completed]
        return rows[-int(last):] if int(last) else rows

    @internal
    def mark(self, r: Resource) -> str:
        return ""

    def search(self, term: str) -> list[Resource]:
        want = term.lower()
        rows = (self._peek(row["n"]) for row in reversed(self.summaries()) if not row["deleted"])
        hits = (r for r in rows if want in r.title.lower() or want in r.brief.lower() or want in r.abstract.lower()
                or any(want in s[SECTION.title].lower() or want in s[SECTION.body].lower() for s in r.sections)
                or any(want in name.lower() or want in str(tags).lower() for name, tags in r.files.items()))
        return [r.fork() for r, _ in zip(hits, range(LAST))]

    def find(self, name: str) -> Resource:
        if str(name).isdigit():
            return self.load(int(name))
        hits = [r for r in self._every() if name.lower() in r.title.lower()]
        if len(hits) != 1:
            raise Refused(f"{'no' if not hits else len(hits)} {self.type}{'' if len(hits) == 1 else 's'} match {name!r}" + ("; say more of the title" if len(hits) > 1 else ""))
        return hits[0]


def register(*classes) -> None:
    CONTROLLERS.update({c.resource.type: c for c in classes})
    NAMED.update({c.__name__.lower(): c for c in classes})
