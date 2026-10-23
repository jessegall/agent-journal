from typing import TypeVar

from journal.models.fact import Fact
from journal.models.reminder import Reminder
from journal.models.rule import Rule
from journal.repositories.facts import Facts
from journal.repositories.repository import Repository
from journal.repositories.reminders import Reminders
from journal.repositories.rules import Rules
from journal.support.actor import Actor

R = TypeVar("R", Fact, Rule, Reminder)


class MemoryContext:
    """Which facts, rules and reminders are in the agent's context window: one is admitted when the journal hands it over, by the start block, the look or a read; every one is admitted at a session start, since the start block hands them all over, and a row made meanwhile starts out."""

    def __init__(self, facts: Facts, rules: Rules, reminders: Reminders) -> None:
        self.facts, self.rules, self.reminders = facts, rules, reminders

    def admit_all(self, actor: Actor) -> None:
        self.admitted(self.facts, self.facts.scoped(), actor)
        self.admitted(self.rules, self.rules.all(), actor)
        self.admitted(self.reminders, self.reminders.standing(), actor)

    @staticmethod
    def admitted(repository: Repository[R], rows: list[R], actor: Actor) -> None:
        for row in rows:
            if not row.presence:
                repository.save(row.with_(presence=True), actor)

    def admit(self, row, actor: Actor):
        repositories: dict[str, Facts | Rules | Reminders] = {"fact": self.facts, "rule": self.rules, "reminder": self.reminders}
        repository = repositories[row.table().rstrip("s")]
        return row if row.presence else repository.save(row.with_(presence=True), actor)
