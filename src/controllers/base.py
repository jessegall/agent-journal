import inspect
import shutil
import time
from dataclasses import asdict
from functools import cache, partial

from engine import bus
from engine.markers import plain
from engine.record import Record
from resources.base import PART_OF, PROJECT, SYSTEM, USER, Ref, Refused, Resource, SECTION, check_abstract, check_title
from resources.shapes import Options, check, normalize_options, typed
from controllers.discussion import TWICE_WITHIN, Discussed
from controllers.files import Files
from controllers.links import Links
from controllers import marks
from controllers.stored import RowStore
from engine.wording import noun

WORDS = ("title", "abstract", "brief")
LAST = 25
SEARCHABLE: dict[str, dict[int, tuple[float, str]]] = {}


def searchable(r: Resource) -> str:
    parts = [r.title, r.brief, r.abstract, *(f"{s[SECTION.title]} {s[SECTION.body]}" for s in r.sections),
             *(f"{name} {tags}" for name, tags in r.files.items())]
    return "\n".join(parts).lower()
COMMANDS: dict[str, dict] = {}


def networked(type_: str, name: str) -> bool:
    held = COMMANDS.get(type_, {}).get(name) or getattr(CONTROLLERS.get(type_), name, None)
    return bool(getattr(held, "network", False))
HANDLERS: dict[str, list] = {}
CONTROLLERS: dict[str, type] = {}


def checked_field(fields: dict, key: str, value):
    if key not in fields:
        return value
    return check(key, fields[key], normalize_options(value) if key == Options.options else value)


@cache
def actions(controller: type) -> tuple[str, ...]:
    return tuple(sorted(name for name, f in inspect.getmembers(controller, inspect.isfunction) if getattr(f, "action", False)))


def word_names(controller: type) -> set[str]:
    return {*actions(controller), *COMMANDS.get(controller.resource.type, {})}


def word_function(controller: type, name: str):
    return COMMANDS.get(controller.resource.type, {}).get(name) or getattr(controller, name)


def word_parameters(controller: type, name: str) -> list[inspect.Parameter]:
    return list(inspect.signature(word_function(controller, name)).parameters.values())[1:]


class Controller(Files, Links, Discussed):
    resource = Resource
    actor = "user"

    def __init__(self, record: Record, actor: str | None = None, session: str = "", agent: str = "", force: str = ""):
        self.record = record
        self.rows = RowStore(record, self.resource, self._ordered, self._visible, self._also, self._damaged)
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
        allowed = self.resource.editors.get(r.author)
        if allowed is None or self.actor in allowed or not self.rows.exists(r.n):
            return
        stored = self.load(r.n)
        parts = [section[SECTION.title] for section in stored.sections]
        rewritten = any(getattr(stored, f) != getattr(r, f) for f in WORDS) or [section[SECTION.title] for section in r.sections][:len(parts)] != parts
        if action == "deleted" or rewritten:
            self._refuse(f"{self.type} {r.n} was written by the {stored.seen[0]}: answer it with journal {self.type} {self.resource.answer_command} {r.n} \"<text>\" instead of changing it")

    def _shipped(self, r: Resource, action: str) -> None:
        if self.actor == SYSTEM or not self.rows.exists(r.n):
            return
        stored = self.load(r.n)
        if not stored.data.get("system"):
            return
        free = ("kept", *self.resource.progress)
        kept = lambda row: {k: v for k, v in row.data.items() if k not in free}
        if action in ("deleted", "completed") or any(getattr(stored, f) != getattr(r, f) for f in WORDS) or \
                stored.sections != r.sections or kept(stored) != kept(r):
            self._refuse(f"{self.type} {r.n} ships with the journal and cannot be changed or removed")

    def save(self, r: Resource, action: str, **event) -> Resource:
        self._shipped(r, action)
        self._guarded(r, action)
        r.rewrite(plain)
        self._note_force(r)
        if self.actor not in r.seen:
            r.seen.append(self.actor)
        r.updated = time.time()
        self.rows.persist(r)
        self._emit(r.n, action, **event)
        return r

    def _emit(self, n: int, action: str, **event):
        return self.record.emit(self.type, n, action, self.actor, **event)

    def _retitle(self, n: int, title: str) -> Resource:
        return self.update(int(n), title=title.strip())

    def _finished(self, r: Resource) -> bool:
        return bool(r.completed)

    def _unfinished(self, n: int, ended: str) -> Resource:
        row = self.load(n)
        if row.completed:
            raise Refused(f"{self.type} {n} is {ended}")
        return row

    def _handled(self, action: str, /, **args):
        for fn in HANDLERS.get(f"{self.type}.{action}", []) + HANDLERS.get(action, []):
            taken = fn(self, **args)
            if taken is not None:
                return taken
        return None

    def _field_choices(self, r: Resource) -> dict:
        return {}

    def _shaped(self, data: dict) -> dict:
        fields = self.resource.fields
        return {k: checked_field(fields, k, v) for k, v in data.items()}

    def _given(self, data: dict) -> Resource:
        return self.resource(data=self._shaped(data))

    def _twin(self, title: str, brief: str, about, idempotency: str = "") -> Resource | None:
        if not self.resource.deduplicates:
            return None
        since = time.time() - TWICE_WITHIN
        lately = [row["n"] for row in self.rows.summaries() if not row["deleted"] and row["updated"] >= since]
        recent = (self.load(n) for n in reversed(lately[-20:]))
        return next((r for r in recent if r.created >= since and r.title == title and r.brief == brief
                     and r.author == self.actor and (not about or about in r.refs)
                     and (not idempotency or r.data.get("idempotency") == idempotency)), None)

    @marks.action
    def create(self, title: str, abstract: str = "", brief: str = "", **data) -> Resource:
        twin = self._twin(title, brief, data.get("about"), data.get("idempotency", ""))
        if twin is not None:
            return twin
        taken = self._handled("create", title=title, abstract=abstract, brief=brief, **data)
        if taken is not None:
            return taken
        for name in self.resource.required:
            if not data.get(name):
                self._refuse(f"a {self.type} needs {name}: --set {name}=\"<word>,<word>\"")
        with self.record.locked(self.resource.scope):
            n = (self.rows.numbers() or [0])[-1] + 1
            about, supersedes = data.pop("about", None), data.pop("supersedes", 0)
            fields = self._shaped(data)
            if self.agent:
                fields.update(agent=self.agent, dispatcher=self.session)
            if self.resource.scope == PROJECT:
                fields["environment"] = self.record.env
            r = self.resource(n=n, title=check_title(title), abstract=check_abstract(abstract), brief=brief,
                              data=fields, created=time.time(), seen=[self.actor], refs=[about] if about else [])
            r = self.save(r, "created")
            return self._supersede(int(supersedes), n) if supersedes else r

    def _supersede(self, old: int, new: int) -> Resource:
        self.complete(old, how=f"superseded by {self.type} {new}")
        return self.link(new, f"{self.type}:{old}")

    def _created_with_sections(self, title: str, abstract: str, brief: str, sections: list[tuple[str, str]], **data) -> Resource:
        made = self.create(title, abstract, brief, **data)
        for heading, body in sections:
            made = self.section(made.n, heading, body)
        return made

    def _carried(self, n: int, into: "Controller", how: str) -> Resource:
        r = self.load(n)
        made = into._created_with_sections(r.title, r.abstract, r.brief, [(s[SECTION.title], s[SECTION.body]) for s in r.sections], **r.data)
        self.complete(n, how=f"{how} {into.type} {made.n}")
        return made

    def _damaged(self, path: str, error: str) -> None:
        from controllers.faults import damaged
        damaged(self.record, path, error)

    def _stopping(self, n: int, **asked) -> Resource:
        return self.update(n, stopping={**asked, "at": time.time()})

    @marks.action
    def update(self, n: int, title: str | None = None, abstract: str | None = None, brief: str | None = None, outcome: str | None = None, **data) -> Resource:
        self._handled("update", n=n, title=title, abstract=abstract, brief=brief, outcome=outcome, **data)
        with self.record.locked(self.resource.scope):
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
            given = {"title": title, "abstract": abstract, "brief": brief, "outcome": outcome}
            return self.save(r, "updated", fields=[*(k for k, v in given.items() if v is not None), *data])

    @marks.action
    def stamp(self, n: int, **data) -> Resource:
        return self._changed(n, "stamped", data, quiet=True, fields=sorted(data))

    def appended(self, r: Resource, field: str, entry, keep: int, **data) -> Resource:
        return self.update(r.n, **{field: [*(r.data.get(field) or []), entry][-keep:]}, **data)

    def _changed(self, n: int, action: str, data: dict, **event) -> Resource:
        with self.record.locked(self.resource.scope):
            r = self.load(n)
            r.data.update(self._shaped(data))
            return self.save(r, action, **event)

    @marks.action
    def set(self, n: int, key: str, value: str) -> Resource:
        return self.update(n, **{key: typed(value)})

    def add_part(self, n: int, title: str, body: str) -> Resource:
        return self.section(n, title, body)

    @marks.action
    def section(self, n: int, title: str, body: str) -> Resource:
        with self.record.locked(self.resource.scope):
            r = self.load(n)
            for s in r.sections:
                if s[SECTION.title] == title:
                    s[SECTION.body] = body
                    break
            else:
                r.sections.append({SECTION.title: title, SECTION.body: body})
            return self.save(r, "updated", section=title)

    @marks.action
    def delete(self, n: int, why: str = "") -> Resource:
        self._handled("delete", n=n, why=why)
        with self.record.locked(self.resource.scope):
            r = self.load(n)
            r.deleted = time.time()
            return self.save(r, "deleted", why=why)

    @marks.action
    def complete(self, n: int, how: str = "", **data) -> Resource:
        self._handled("complete", n=n, how=how, **data)
        with self.record.locked(self.resource.scope):
            r = self.load(n)
            if r.completed:
                self._refuse(f"{self.type} {n} is already closed")
            r.completed = time.time()
            r.outcome = how
            r.data.update(self._shaped(data))
            if self.resource.lists_completed_unread and self.actor != USER:
                r.seen = [who for who in r.seen if who != USER]
            return self.save(r, "completed", how=how, **data)

    @marks.action
    def reopen(self, n: int, why: str) -> Resource:
        with self.record.locked(self.resource.scope):
            r = self.load(n)
            if r.deleted:
                self._refuse(f"{self.type} {n} is archived; restore it before reopening it")
            if not r.completed:
                self._refuse(f"{self.type} {n} is not {self.named('complete')}")
            r.completed = 0.0
            r.outcome = ""
            return self.save(r, "reopened", why=why)

    def named(self, method: str) -> str:
        return self.resource.command_names.get(method, method)

    def method(self, name: str):
        if name in self.resource.command_names and name not in self.resource.command_names.values():
            raise Refused(f"a {self.type} calls that {self.resource.command_names[name]}")
        return self.action(name)

    def action(self, name: str):
        if name.startswith("_") or name not in {*word_names(type(self)), *self.resource.command_names.values()}:
            raise Refused(f"{self.type} has no action {name!r}")
        command = COMMANDS.get(self.type, {}).get(name)
        if command:
            return bus.commanded(self.type, name, partial(command, self))
        method = next((method for method, alias in self.resource.command_names.items() if alias == name), name)
        return bus.commanded(self.type, method, getattr(self, method))

    @marks.action
    def restore(self, n: int) -> Resource:
        r = self.load(n)
        r.deleted = 0.0
        return self.save(r, "updated", restored=True)

    def _prune(self) -> None:
        prunable = sorted((r for r in self.rows.every(deleted=True) if self.resource.pruned_when.admits(r)), key=lambda r: r.created, reverse=True)
        for r in prunable[self.resource.kept:]:
            self.force_delete(r.n)

    @marks.action
    def force_delete(self, n: int) -> None:
        self.load(n)
        self.rows.remove(n)
        files = self.rows.row_folder(n)
        if files.is_dir():
            shutil.rmtree(files)
        self._emit(n, "deleted", force=True)

    @marks.action
    def move(self, n: int, env: str) -> Resource:
        r = self.load(n)
        self._shipped(r, "deleted")
        self._guarded(r, "deleted")
        there = type(self)(Record(self.record.root, env), actor=self.actor)
        with there.record.locked(self.resource.scope):
            m = (there.rows.numbers() or [0])[-1] + 1
            moved = self.resource(**{**asdict(r), "n": m})
            if any(self.folder(n).iterdir()):
                shutil.copytree(self.folder(n), there.rows.row_folder(m), dirs_exist_ok=True)
            there.save(moved, "created", moved_from=f"{self.record.env}/{n}")
        self.delete(n, why=f"moved to {env} as {self.type} {m}")
        return moved

    @marks.action
    def show(self, n: int) -> Resource:
        row = self.read(n)
        self._handled("show", row=row)
        return row

    @marks.action
    def read(self, n: int) -> Resource:
        return self.read_all([n])[0]

    @marks.action
    def read_all(self, numbers: list[int]) -> list[Resource]:
        rows = []
        changed = []
        wanted = list(dict.fromkeys(int(n) for n in numbers))
        with self.record.locked(self.resource.scope):
            for n in wanted:
                r = self.load(n)
                rows.append(r)
                if self.actor in r.seen:
                    continue
                r.seen.append(self.actor)
                r.updated = time.time()
                self.rows.persist(r)
                changed.append(r)
            if changed:
                self._emit(changed[0].n, "updated", numbers=[r.n for r in changed], seen=self.actor, by="read")
        return rows

    @marks.action
    def unread(self, actor: str | None = None) -> list[Resource]:
        who = actor or self.actor
        return [self.load(row["n"]) for row in self.rows.summaries() if who not in row["seen"] and not row["completed"] and not row["deleted"]]

    @marks.action
    def all(self, deleted: bool = False, completed: bool = False, last: int = LAST) -> list[Resource]:
        if not deleted and int(last) and type(self)._ordered is Controller._ordered:
            listed = [row["n"] for row in self.rows.summaries() if not row["deleted"] and (not row["completed"] or completed and not row.get(PART_OF))]
            return [self.rows.peek(n) for n in listed[-int(last):]]
        rows = self.rows.every(deleted) if completed or deleted else self.rows.standing()
        rows = rows if completed else [r for r in rows if not r.completed]
        return rows[-int(last):] if int(last) else rows

    def mark(self, r: Resource) -> str:
        return ""

    @marks.action
    def search(self, term: str) -> list[Resource]:
        want = term.lower()
        texts = self._texts()
        hits = (row["n"] for row in reversed(self.rows.summaries()) if not row["deleted"] and want in texts.get(row["n"], ""))
        return [self.rows.peek(n) for n, _ in zip(hits, range(LAST))]

    def load(self, n: int | str) -> Resource:
        return self.rows.load(n)

    def path(self, n: int):
        return self.rows.path(n)

    def _ordered(self, rows: list[Resource]) -> list[Resource]:
        return rows

    def _visible(self, row: Resource) -> bool:
        return True

    def _also(self) -> list[Resource]:
        return []

    def _warm(self) -> None:
        self.rows.warm()
        self._texts()

    def _texts(self) -> dict[int, str]:
        kept = SEARCHABLE.setdefault(str(self.rows.folder()), {})
        for row in self.rows.summaries():
            version = row["stamp"]
            if row["deleted"] or kept.get(row["n"], (None,))[0] == version:
                continue
            kept[row["n"]] = (version, searchable(self.rows.peek(row["n"])))
        return {n: text for n, (_, text) in kept.items()}

    @marks.action
    def find(self, name: str) -> Resource:
        if str(name).isdigit():
            return self.load(name)
        hits = [row["n"] for row in self.rows.summaries() if not row["deleted"] and name.lower() in row["title"].lower()]
        if len(hits) != 1:
            raise Refused(f"{'no' if not hits else len(hits)} {noun(len(hits), self.type)} match {name!r}" + ("; say more of the title" if len(hits) > 1 else ""))
        return self.load(hits[0])


def controller_of(record: Record, ref: "str | Ref", actor: str = SYSTEM) -> "Controller":
    ref = Ref.parse(ref)
    if ref.type not in CONTROLLERS:
        raise Refused(f"{str(ref)!r} is not a row: write it as type:number, like todo:785")
    return CONTROLLERS[ref.type](record, actor=actor)


def row_of(record: Record, ref: "str | Ref") -> Resource:
    return controller_of(record, ref).load(Ref.parse(ref).n)


def register(*classes) -> None:
    CONTROLLERS.update({c.resource.type: c for c in classes})
