import contextvars
import threading

from journal.features.migration.support.migrator import Migrator
from journal.support.version_3_backup import Version3Backup
from journal.http.support.request import Request
from journal.support.response import Response
from journal.repositories.version3_migrations import Version3Migrations


class MigrationController:
    """What the viewer needs to offer bringing a version 3 journal across: whether one is kept, and where its migration stands."""

    def __init__(self, backup: Version3Backup, migrations: Version3Migrations, migrator: Migrator) -> None:
        self.backup, self.migrations, self.migrator = backup, migrations, migrator

    def show(self, request: Request) -> Response:
        return Response.json({"kept": self.backup.is_kept(), "state": self.migrations.current().state.value})

    def later(self, request: Request) -> Response:
        return Response.json({"kept": self.backup.is_kept(), "state": self.backup.put_off(request.actor).state.value})

    def start(self, request: Request) -> Response:
        migration = self.migrator.begin(request.actor)
        context = contextvars.copy_context()
        threading.Thread(target=context.run, args=(self.migrator.run, migration, request.actor), name="migration", daemon=True).start()
        return Response.json({"kept": self.backup.is_kept(), "state": migration.state.value})
