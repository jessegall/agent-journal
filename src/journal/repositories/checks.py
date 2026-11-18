from datetime import datetime

from journal.db.query import Query
from journal.models.check import Check
from journal.repositories.repository import Repository
from journal.support.actor import Actor


class Checks(Repository[Check]):
    model = Check

    def all(self) -> list[Check]:
        return self.newest(self.listed_query())

    def verdicts(self) -> list[Check]:
        return self.newest(self.listed_query().with_columns("title", "last_passed", "last_stopped", "last_fault"))

    def listed_query(self) -> Query:
        return self.query().filter(wait_target=False, is_retired=False)

    def wait_rows(self) -> list[Check]:
        return self.all_matching(wait_target=True)

    def unresolved_waits(self) -> list[Check]:
        unpassed = self.query().filter_alternatives(self.query().filter_null("last_passed"), self.query().filter(last_passed=False))
        return self.selected(unpassed.filter(wait_target=True, is_retired=False).order("id"))

    def passed_waits(self, excluded: set[int]) -> list[Check]:
        return self.selected(self.query().filter(wait_target=True, is_retired=False, last_passed=True).filter_unlisted("id", sorted(excluded)).order("id"))

    def waits_among(self, ids: set[int]) -> list[Check]:
        return self.selected(self.query().filter(wait_target=True).filter_listed("id", sorted(ids)).order("id"))

    def resolved_waits_among(self, ids: set[int]) -> list[Check]:
        return self.selected(self.query().filter(wait_target=True).filter_listed("id", sorted(ids)).filter_alternatives(self.query().filter(last_passed=True), self.query().filter(is_retired=True)).order("id"))

    def due(self, time: datetime) -> list[Check]:
        return [check for check in self.rows() if check.needs_run(time)]

    def plugin_rows(self, plugin: str) -> list[Check]:
        return self.all_matching(creator=Actor.plugin(plugin).stamp, is_retired=False)

    def broken_waits(self) -> list[Check]:
        unpassed = self.query().filter_alternatives(self.query().filter_null("last_passed"), self.query().filter(last_passed=False))
        return self.selected(unpassed.filter(wait_target=True, is_retired=False).filter_unequal("last_fault", "").order("id"))
