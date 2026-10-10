import time

import controllers.types as types_module
import resources.types as resources_module
from controllers.base import Controller, discarding
from controllers.marks import action
from engine.extension import Extension
from features.triggers import watched
from features.triggers.resource import DOES, FIRED, FROM_USER, ONLY_WHEN, START, STATE_DOES, WHEN, Trigger
from features.triggers.summary import summary
from resources.base import SYSTEM, Refused, Resource


def holding(n: int) -> str:
    return f"hold.{n}"


STARTED_BY = Extension()


class Triggers(Controller):
    resource = Trigger

    @discarding
    def save(self, r: Resource, action: str, **event) -> Resource:
        if str(r.does) not in DOES:
            raise Refused(f"a trigger does one of {', '.join(DOES)}, not {r.does!r}")
        if not r.system:
            self._check_watched(r)
            r.brief = summary(r, self._starts(r.n))
        return super().save(r, action, **event)

    def _check_watched(self, r: Resource) -> None:
        if r.when not in WHEN:
            raise Refused(f"a trigger watches {' or '.join(WHEN)}, not {r.when!r}")
        if r.is_state:
            self._check_state(r)
        else:
            self._check_words(r)

    def _check_words(self, r: Resource) -> None:
        if not r.words:
            raise Refused('a trigger needs words to watch for: --set words="one,two"')

    def _check_state(self, r: Resource) -> None:
        if r.fact not in watched.FACTS:
            raise Refused(f"a trigger on the journal's state watches one of {', '.join(watched.FACTS)}, not {r.fact!r}")
        if str(r.does) not in STATE_DOES:
            raise Refused(f"a trigger on the journal's state does one of {', '.join(STATE_DOES)}, not {r.does!r}; it has no call to deny and no words to post as you")
        if r.only_when not in ONLY_WHEN:
            raise Refused(f"only_when is one of {', '.join(ONLY_WHEN)}, not {r.only_when!r}")
        if min(r.over, r.timing, r.most) < 0:
            raise Refused("over, timing and most are not negative")

    @action
    def delete(self, n: int, why: str = "") -> Resource:
        self._stop_starting(n)
        self._release(n)
        return super().delete(n, why)

    @action
    def complete(self, n: int, how: str = "", **data) -> Resource:
        self._release(n)
        return super().complete(n, how, **data)

    def _release(self, n: int) -> None:
        from features import FEATURES
        FEATURES["triggers"].release(self.record, holding(n))

    def _starting(self, n: int) -> list[tuple[Controller, Resource]]:
        return [(rows, row) for kind in STARTED_BY.each(self.record) for rows in (kind(self.record, actor=SYSTEM),)
                for row in rows.rows.standing() if row.data.get("starts_on") == f"trigger:{n}"]

    def _starts(self, n: int) -> list[str]:
        return [row.title for _, row in self._starting(n)]

    def _stop_starting(self, n: int) -> None:
        for rows, row in self._starting(n):
            if not row.system:
                rows.update(row.n, starts_on="")

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
