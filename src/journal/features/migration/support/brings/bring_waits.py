from pathlib import Path

from journal.features.migration.support.brought import Brought
from journal.features.migration.support.environment_kind import EnvironmentKind
from journal.features.migration.support.version_3_row import Version3Row
from journal.support.actor import Actor
from journal.models.environment import Environment
from journal.models.link import Link
from journal.support.ref import Ref
from journal.models.task import Task
from journal.support.refused import Refused
from journal.repositories.environments import Environments
from journal.repositories.links import Links
from journal.repositories.migrated_rows import MigratedRows
from journal.repositories.tasks import WAITS_ON, Tasks


class BringWaits(EnvironmentKind):
    """A to-do that came after others waits on them here, once all have come across; a wait version 3 let close a loop is dropped and named, and the task keeps the rest."""

    kind = "todo"
    title = "waits"

    def __init__(self, environments: Environments, ledger: MigratedRows, tasks: Tasks, links: Links) -> None:
        super().__init__(environments, ledger)
        self.tasks, self.links = tasks, links
        self.dropped: list[str] = []

    def bring(self, folder: Path, by: Actor) -> Brought:
        """The waits brought, and each one dropped for closing a loop named beside what stayed behind."""
        self.dropped = []
        brought = super().bring(folder, by)
        return Brought(brought.kind, brought.count, (*brought.skipped, *self.dropped))

    def source(self, environment: str, row: Version3Row) -> str:
        return f"environments/{environment}/todo/{row.n}/waits"

    def left_behind(self, row: Version3Row, into: Environment) -> str:
        if not row.listed("after"):
            return "waits on nothing"
        return "" if self.ledger.referred(into.name, f"todo:{row.n}") else "its to-do did not come across"

    def made(self, row: Version3Row, into: Environment, attached: Path, by: Actor) -> Task:
        task = self.tasks.find(self.ledger.referred(into.name, f"todo:{row.n}").id)
        for before in [found for n in row.listed("after") if (found := self.ledger.referred(into.name, f"todo:{n}"))]:
            try:
                self.links.save(Link(source=Ref.to(task), target=before, kind=WAITS_ON), by)
            except Refused as loop:
                self.dropped.append(f"task {task.id}: {loop}")
        return task
