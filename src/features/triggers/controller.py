import time

import controllers.types as types_module
import resources.types as resources_module
from controllers.base import Controller
from controllers.marks import action
from features.triggers.resource import DOES, FIRED, FROM_USER, START, Trigger
from features.triggers.summary import summary
from resources.base import SYSTEM, Refused, Resource


class Triggers(Controller):
    resource = Trigger

    def save(self, r: Resource, action: str, **event) -> Resource:
        if str(r.does) not in DOES:
            raise Refused(f"a trigger does one of {', '.join(DOES)}, not {r.does!r}")
        if not r.words:
            raise Refused('a trigger needs words to watch for: --set words="one,two"')
        if not r.system:
            r.brief = summary(r, self._starts(r.n))
        return super().save(r, action, **event)

    @action
    def delete(self, n: int, why: str = "") -> Resource:
        self._stop_starting(n)
        return super().delete(n, why)

    def _sequences(self):
        from features.sequences.controller import Sequences
        return Sequences(self.record, actor=SYSTEM)

    def _starting(self, n: int) -> list[Resource]:
        return [row for row in self._sequences().rows.standing() if row.data.get("starts_on") == f"trigger:{n}"]

    def _starts(self, n: int) -> list[str]:
        return [row.title for row in self._starting(n)]

    def _stop_starting(self, n: int) -> None:
        for row in self._starting(n):
            if not row.system:
                self._sequences().update(row.n, starts_on="")

    def fired(self, n: int, about: str = "") -> None:
        with self.record.locked(self.resource.scope):
            row = self.load(n)
            row.matched += 1
            row.matched_at = time.time()
            self.save(row, FIRED, about=about)

    def watch_for(self, title: str, words: list[str]) -> Resource:
        row = next((t for t in self.rows.every() if t.title == title and not t.deleted), None) or self.create(
            title, brief=f"Starts the sequence {title}", words=list(words), words_in=FROM_USER, does=START, system=True)
        return row if row.system else self.update(row.n, system=True)

    def unwatch(self, title: str, why: str) -> None:
        for row in self.rows.every():
            if row.title == title and row.system and not row.deleted:
                self.delete(row.n, why=why)


resources_module.register(Trigger)
types_module.register(Triggers)
