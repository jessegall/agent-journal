from pathlib import Path

from journal.features.migration.support.import_tally import ImportTally
from journal.features.migration.support.version_3_rows import Version3Rows
from journal.support.actor import Actor
from journal.repositories.environments import Environments
from journal.repositories.migrated_rows import MigratedRows


class EnvironmentImport:
    """The version 3 environments still in use become environments of the same name; the rest stay in the backup."""

    def __init__(self, environments: Environments, ledger: MigratedRows) -> None:
        self.environments, self.ledger = environments, ledger

    def import_rows(self, folder: Path, actor: Actor) -> ImportTally:
        rows = Version3Rows(folder)
        count, skipped = 0, []
        for row in rows.environments():
            source = f"project/environment/{row.n}"
            if not rows.is_used(row):
                skipped.append(f"environment {row.title}: not in use")
                continue
            if self.ledger.is_imported(source):
                continue
            self.ledger.record(source, self.environments.lookup(row.title), actor)
            count += 1
        return ImportTally("environments", count, tuple(skipped))
