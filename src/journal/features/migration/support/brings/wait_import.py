from pathlib import Path

from journal.features.migration.support.import_tally import ImportTally
from journal.features.migration.support.environment_kind import EnvironmentKind
from journal.features.migration.support.version_3_row import Version3Row
from journal.support.actor import Actor
from journal.models.environment import Environment
from journal.models.link import Link
from journal.support.ref import Ref
from journal.models.task import Task
from journal.support.rejection import Rejection
from journal.repositories.environments import Environments
from journal.repositories.links import Links
from journal.repositories.migrated_rows import MigratedRows
from journal.repositories.tasks import WAIT_LINK, Tasks


class WaitImport(EnvironmentKind):
    """A to-do that came after others waits on them here, once all have come across; a wait version 3 let close a loop is dropped and named, and the task keeps the rest."""

    kind = "todo"
    title = "waits"

    def __init__(self, environments: Environments, ledger: MigratedRows, tasks: Tasks, links: Links) -> None:
        super().__init__(environments, ledger)
        self.tasks, self.links = tasks, links
        self.dropped: list[str] = []

    def import_rows(self, folder: Path, actor: Actor) -> ImportTally:
        self.dropped = []
        brought = super().import_rows(folder, actor)
        return ImportTally(brought.kind, brought.count, (*brought.skipped, *self.dropped))

    def source(self, environment: str, row: Version3Row) -> str:
        return f"environments/{environment}/todo/{row.n}/waits"

    def skipped(self, row: Version3Row, into: Environment) -> str:
        if not row.listed("after"):
            return "waits on nothing"
        return "" if self.ledger.referred(into.name, f"todo:{row.n}") else "its to-do did not come across"

    def created(self, row: Version3Row, into: Environment, attached: Path, actor: Actor) -> Task:
        task = self.tasks.find(self.ledger.referred(into.name, f"todo:{row.n}").id)
        for before in [rows for n in row.listed("after") if (rows := self.ledger.referred(into.name, f"todo:{n}"))]:
            try:
                self.links.save(Link(source=Ref.build(task), target=before, kind=WAIT_LINK), actor)
            except Rejection as loop:
                self.dropped.append(f"task {task.id}: {loop}")
        return task
