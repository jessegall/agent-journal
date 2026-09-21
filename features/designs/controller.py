import time

import controllers.types as types_module
import resources.types as resources_module
from controllers.base import Controller
from controllers.types import Docs
from engine.stored import write_text
from features.designs.resource import Design
from resources.base import PART_OF, SECTION, Refused, check_abstract, check_title

STAMPED, REVISION, CHANGE = "stamped", "revision", "change"


class Designs(Controller):
    resource = Design

    def create(self, title: str, abstract: str = "", brief: str = "", **data):
        design = super().create(title, abstract, brief, revisions=[], **data)
        return self._revised(design, "written")

    def section(self, n: int, title: str, body: str):
        r = self.load(n)
        known = any(s[SECTION.title] == title for s in r.sections)
        r.sections = [{**s, SECTION.body: body} if s[SECTION.title] == title else s for s in r.sections] if known else [*r.sections, {SECTION.title: title, SECTION.body: body}]
        return self._revised(r, f"{'rewrote' if known else 'added'} {title}", section=title)

    def cut(self, n: int, title: str):
        r = self.load(n)
        if not any(s[SECTION.title] == title for s in r.sections):
            raise Refused(f"design {n} has no part named {title!r}")
        r.sections = [s for s in r.sections if s[SECTION.title] != title]
        return self._revised(r, f"cut {title}", section=title)

    def update(self, n: int, title: str | None = None, abstract: str | None = None, brief: str | None = None, outcome: str | None = None, **data):
        if title is None and abstract is None and brief is None:
            return super().update(n, outcome=outcome, **data)
        r = self.load(n)
        r.title = check_title(title) if title is not None else r.title
        r.abstract = check_abstract(abstract) if abstract is not None else r.abstract
        r.brief = brief if brief is not None else r.brief
        r.data.update(self._shaped(data))
        return self._revised(r, "reworded the top")

    def revisions(self, n: int) -> list[str]:
        docs = Docs(self.record, actor=self.actor)
        return [self._listed(docs.load(d)) for d in self.load(n).revisions]

    def revision(self, n: int, number: int):
        found = self.load(n).revisions
        if not 1 <= int(number) <= len(found):
            raise Refused(f"design {n} has revisions 1 to {len(found)}")
        return Docs(self.record, actor=self.actor).load(found[int(number) - 1])

    def _listed(self, doc) -> str:
        return f"{doc.data.get(REVISION):>3}  {time.strftime('%Y-%m-%d %H:%M', time.localtime(doc.created))}  {doc.seen[0]:<6} {doc.data.get(CHANGE, '')}"

    def _revised(self, r, change: str, **event):
        docs = Docs(self.record, actor=self.actor)
        with self.record.locked():
            k = (docs.numbers() or [0])[-1] + 1
            copy = docs.resource(n=k, title=r.title, abstract=r.abstract, brief=r.brief, sections=[dict(s) for s in r.sections], created=time.time(),
                                 seen=[self.actor], refs=[r.ref], data={PART_OF: r.ref, REVISION: len(r.revisions) + 1, CHANGE: change})
            write_text(docs.path(k), copy.dump())
            self.record.emit(docs.type, k, STAMPED, self.actor, quiet=True, fields=[REVISION])
            r.revisions = [*r.revisions, k]
            return self.save(r, "updated", revision=len(r.revisions), change=change, **event)


resources_module.register(Design)
types_module.register(Designs)
