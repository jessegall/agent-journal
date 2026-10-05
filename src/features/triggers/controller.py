import controllers.types as types_module
import resources.types as resources_module
from controllers.base import Controller
from features.triggers.resource import DOES, FIRED, FROM_USER, START, Trigger
from resources.base import SYSTEM, Refused, Resource


class Triggers(Controller):
    resource = Trigger

    def save(self, r: Resource, action: str, **event) -> Resource:
        if str(r.does) not in DOES:
            raise Refused(f"a trigger does one of {', '.join(DOES)}, not {r.does!r}")
        if not r.words:
            raise Refused('a trigger needs words to watch for: --set words="one,two"')
        return super().save(r, action, **event)

    def fired(self, n: int, about: str = "") -> None:
        self.record.emit("trigger", n, FIRED, SYSTEM, about=about)

    def watch_for(self, title: str, words: list[str]) -> Resource:
        row = next((t for t in self._every() if t.title == title and not t.deleted), None) or self.create(
            title, brief=f"Starts the sequence {title}", words=list(words), words_in=FROM_USER, does=START, system=True)
        return row if row.system else self.update(row.n, system=True)

    def unwatch(self, title: str, why: str) -> None:
        for row in self._every():
            if row.title == title and row.system and not row.deleted:
                self.delete(row.n, why=why)


resources_module.register(Trigger)
types_module.register(Triggers)
