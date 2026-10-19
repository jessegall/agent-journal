from pathlib import Path

from journal.features.migration.support.brought import Brought
from journal.features.migration.support.version_3_rows import Version3Rows
from journal.support.actor import Actor
from journal.repositories.environments import Environments
from journal.repositories.migrated_rows import MigratedRows


class BringEnvironments:
    """The version 3 environments still in use become environments of the same name; the rest stay in the backup."""

    def __init__(self, environments: Environments, ledger: MigratedRows) -> None:
        self.environments, self.ledger = environments, ledger

    def bring(self, folder: Path, by: Actor) -> Brought:
        rows = Version3Rows(folder)
        count, skipped = 0, []
        for row in rows.environments():
            source = f"project/environment/{row.n}"
            if not rows.is_in_use(row):
                skipped.append(f"environment {row.title}: not in use")
                continue
            if self.ledger.is_brought(source):
                continue
            self.ledger.record(source, self.environments.named(row.title), by)
            count += 1
        return Brought("environments", count, tuple(skipped))
