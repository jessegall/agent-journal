from journal.models.memory import Fact, Reminder, Rule
from journal.repositories.base import Repository, ScopedRepository


class Facts(ScopedRepository[Fact]):
    model = Fact


class Reminders(ScopedRepository[Reminder]):
    model = Reminder


class Rules(Repository[Rule]):
    model = Rule
