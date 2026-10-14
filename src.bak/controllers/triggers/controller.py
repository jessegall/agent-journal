import time
from dataclasses import asdict, dataclass

from controllers.agents import Agents
from controllers.base import Controller, discarding
from controllers.marks import action
from framework import watched
from resources.triggers import DOES, FROM_USER, ONLY_WHEN, START, STARTED_BY, STATE_DOES, WHEN, Trigger, holding
from controllers.triggers.summary import summary
from resources.base import FIRED, SYSTEM, Refused, Resource


@dataclass(frozen=True)
class Matching:
    """What a fact matches at this moment, for someone deciding whether to save a trigger on it."""

    fact: str
    over: float
    matching: int
    capped: bool
    rows: tuple[str, ...]
    says: tuple[str, ...]

    @classmethod
    def of(cls, fact: str, over: float, found: list, text: str | None) -> "Matching":
        return cls(fact, over, len(found), len(found) >= watched.MOST_NAMED,
                   tuple(one.values.get("title", "") for one in found),
                   () if text is None else tuple(watched.filled(text, one.values) for one in found))


class Triggers(Controller):
    resource = Trigger

    @discarding
    def save(self, r: Resource, action: str, **event) -> Resource:
        if str(r.does) not in DOES:
            raise Refused(f"a trigger does one of {', '.join(DOES)}, not {r.does!r}")
        if not r.system:
            self._check_watched(r, action == "created" or bool({"fact", "when"} & set(event.get("fields", ()))))
            r.brief = summary(r, self._starts(r.n), self.record)
        return super().save(r, action, **event)

    def _derived(self, row: Resource) -> dict:
        """The sentence a trigger reads as is worked out from what the journal watches now, so a trigger sleeps the moment its feature is switched off and wakes the moment it is on."""
        return {} if row.system else {"brief": summary(row, self._starts(row.n), self.record)}

    def _check_watched(self, r: Resource, setting_fact: bool) -> None:
        if r.when not in WHEN:
            raise Refused(f"a trigger watches {' or '.join(WHEN)}, not {r.when!r}")
        if r.is_state:
            self._check_state(r, setting_fact)
        else:
            self._check_words(r)

    def _check_words(self, r: Resource) -> None:
        if not r.words:
            raise Refused('a trigger needs words to watch for: --set words="one,two"')

    def _check_state(self, r: Resource, setting_fact: bool) -> None:
        if setting_fact:
            self._check_wording(watched.FACTS.get(watched.Watched.of(r), self.record), r)
        if str(r.does) not in STATE_DOES:
            raise Refused(f"a trigger on the journal's state does one of {', '.join(STATE_DOES)}, not {r.does!r}; it has no call to deny and no words to post as you")
        if r.only_when not in ONLY_WHEN:
            raise Refused(f"only_when is one of {', '.join(ONLY_WHEN)}, not {r.only_when!r}")
        if min(r.over, r.timing, r.most) < 0:
            raise Refused("over, timing and most are not negative")

    def _check_wording(self, fact, r: Resource) -> None:
        """A wording may only name what this fact is given. An unknown placeholder is left as its own braces when the line is said, so without this it reaches the agent as {{percent}} for good and without a word."""
        unfillable = fact.unfillable(r.wording)
        if unfillable:
            named = ", ".join(f"{{{{{one}}}}}" for one in unfillable)
            offered = ", ".join(f"{{{{{one}}}}}" for one in fact.fills)
            raise Refused(f"{fact.name} never says {named}: it is given {offered}")

    @action
    def facts(self) -> list[str]:
        """The facts a trigger in this environment can watch, each with what it means."""
        return [f"{fact.name}: {fact.phrase.format(over='N')}, N in {fact.unit}" for fact in watched.FACTS.each(self.record)]

    @action
    def matching(self, fact: str, over: float = 0, text: str | None = None) -> dict:
        """What a trigger on this fact matches right now, and what it would say about each. It reads the fact through the finder a tick uses, rather than counting rows another way and hoping the two agree."""
        from framework.loaded import FEATURES
        from framework.parts import Context
        agent = self._read_against()
        found = watched.found(watched.Watched.parse(fact, over), Context.of(FEATURES["triggers"], self.record, agent), agent)
        return asdict(Matching.of(fact, over, found, text))

    def _read_against(self):
        """The agent row a fact is read against. A fact about the agent itself needs one, so a journal with no agent is refused rather than quietly matching nothing."""
        row = Agents(self.record, actor=SYSTEM).primary_to_read()
        if row is None:
            raise Refused("no agent is working here, so there is nothing to read a fact against yet")
        return row

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
        from framework.loaded import FEATURES
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

