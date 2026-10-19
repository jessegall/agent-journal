from textwrap import dedent

from journal.features.migration.brought import Brought
from journal.features.migration.version_3_backup import Version3Backup
from journal.models.actor import Actor
from journal.models.version3_migration import Version3Migration
from journal.models.report import Report
from journal.repositories.version3_migrations import Version3Migrations
from journal.repositories.reports import Reports
from journal.repositories.scope import Scope


class Migrator:
    """Brings the kept version 3 journal across, kind by kind, and says what came in a report; a kind that fails ends the run as failed and leaves the offer open."""

    def __init__(self, backup: Version3Backup, migrations: Version3Migrations, reports: Reports, scope: Scope) -> None:
        self.backup, self.migrations, self.reports, self.scope = backup, migrations, reports, scope
        self.kinds: tuple = ()

    def begin(self, by: Actor) -> Version3Migration:
        return self.migrations.save(self.migrations.current().begun(), by)

    def run(self, migration: Version3Migration, by: Actor) -> Version3Migration:
        try:
            brought = [kind.bring(self.backup.folder, by) for kind in self.kinds]
        except Exception as fault:
            return self.migrations.save(migration.failed(str(fault)), by)
        self.reports.save(self.report(brought), by)
        return self.migrations.save(migration.done(), by)

    def report(self, brought: list[Brought]) -> Report:
        rows = "\n".join(one.line() for one in brought)
        skipped = "\n".join(f"- {one.kind}: {why}" for one in brought for why in one.skipped) or "Nothing."
        body = dedent("""\
            ## Brought across

            | Kind | Rows | Left behind |
            |---|---|---|
            {rows}

            ## Left behind

            {skipped}""").format(rows=rows, skipped=skipped)
        return Report(environment_id=self.scope.id, title="The version 3 journal brought across", abstract="What came across from .journal/version-3, kind by kind, and what was left behind and why", body=body)
