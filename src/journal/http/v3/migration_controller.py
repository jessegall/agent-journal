import contextvars
import threading

from journal.features.migration.migrator import Migrator
from journal.features.migration.version_3_backup import Version3Backup
from journal.http.request import Request
from journal.http.response import Response
from journal.repositories.version3_migrations import Version3Migrations


class MigrationController:
    """What the viewer needs to offer bringing a version 3 journal across: whether one is kept, and where its migration stands."""

    def __init__(self, backup: Version3Backup, migrations: Version3Migrations, migrator: Migrator) -> None:
        self.backup, self.migrations, self.migrator = backup, migrations, migrator

    def get(self, request: Request) -> Response:
        return Response.json({"kept": self.backup.is_kept(), "state": self.migrations.current().state.value})

    def later(self, request: Request) -> Response:
        """Not now: the offer leaves the pop-up and stays as a line on Home."""
        return Response.json({"kept": self.backup.is_kept(), "state": self.backup.put_off(request.actor).state.value})

    def start(self, request: Request) -> Response:
        """Bring it across: the run takes a thread of its own, in the request's scope, since thousands of rows must not hold up the hooks' deferred work."""
        migration = self.migrator.begin(request.actor)
        context = contextvars.copy_context()
        threading.Thread(target=context.run, args=(self.migrator.run, migration, request.actor), name="migration", daemon=True).start()
        return Response.json({"kept": self.backup.is_kept(), "state": migration.state.value})
