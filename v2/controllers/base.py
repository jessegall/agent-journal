import time
from pathlib import Path

from v2.engine.record import Record
from v2.resources.base import Refused, Resource, check_abstract, check_title


class Controller:
    resource = Resource
    dispatcher = "user"

    def __init__(self, record: Record, dispatcher: str | None = None):
        self.record = record
        if dispatcher:
            self.dispatcher = dispatcher

    @property
    def type(self) -> str:
        return self.resource.type

    def path(self, n: int) -> Path:
        return self.record.folder(self.type) / f"{n:03d}.md"

    def numbers(self) -> list[int]:
        return sorted(int(p.stem) for p in self.record.folder(self.type).glob("[0-9][0-9][0-9].md"))

    def load(self, n: int) -> Resource:
        p = self.path(n)
        if not p.is_file():
            raise Refused(f"no {self.type} {n}")
        return self.resource.load(p.read_text())

    def save(self, r: Resource, action: str, **event) -> Resource:
        r.updated = time.time()
        self.path(r.n).write_text(r.dump())
        self.record.emit(self.type, r.n, action, self.dispatcher, **event)
        return r

    def create(self, title: str, abstract: str = "", brief: str = "", **data) -> Resource:
        with self.record.locked():
            n = (self.numbers() or [0])[-1] + 1
            r = self.resource(n=n, title=check_title(title), abstract=check_abstract(abstract), brief=brief,
                              data=data, created=time.time(), seen=[self.dispatcher])
            return self.save(r, "created")

    def update(self, n: int, title: str | None = None, abstract: str | None = None, brief: str | None = None, **data) -> Resource:
        r = self.load(n)
        if title is not None:
            r.title = check_title(title)
        if abstract is not None:
            r.abstract = check_abstract(abstract)
        if brief is not None:
            r.brief = brief
        r.data.update(data)
        return self.save(r, "updated")

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

    def restore(self, n: int) -> Resource:
        r = self.load(n)
        r.deleted = 0.0
        return self.save(r, "updated", restored=True)

    def force_delete(self, n: int) -> None:
        self.load(n)
        self.path(n).unlink()
        self.record.emit(self.type, n, "deleted", self.dispatcher, force=True)

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
        r = self.load(n)
        r.comments.append({"at": time.time(), "by": self.dispatcher, "text": text.strip()})
        return self.save(r, "commented")

    def show(self, n: int) -> Resource:
        return self.see(n)

    def see(self, n: int) -> Resource:
        r = self.load(n)
        if self.dispatcher in r.seen:
            return r
        r.seen.append(self.dispatcher)
        return self.save(r, "updated", seen=self.dispatcher)

    def unseen(self, dispatcher: str | None = None) -> list[Resource]:
        who = dispatcher or self.dispatcher
        return [r for r in self.all() if who not in r.seen]

    def all(self, deleted: bool = False) -> list[Resource]:
        rows = [self.load(n) for n in self.numbers()]
        return rows if deleted else [r for r in rows if not r.deleted]

    def linked_to(self, ref: str) -> list[Resource]:
        return [r for r in self.all() if ref in r.refs]
