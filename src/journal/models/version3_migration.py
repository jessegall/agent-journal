from typing import ClassVar
from dataclasses import dataclass

from journal.models.migration_state import MigrationState
from journal.models.model import Model


@dataclass(frozen=True)
class Version3Migration(Model):
    """Bringing the version 3 journal kept in .journal/version-3 across into this one, for the whole project."""

    shared: ClassVar[bool] = False

    state: MigrationState = MigrationState.OFFERED

    def postpone(self) -> "Version3Migration":
        return self.with_(state=MigrationState.LATER)

    def is_started(self) -> "Version3Migration":
        return self.with_(state=MigrationState.BUSY)

    def is_finished(self) -> "Version3Migration":
        return self.with_(state=MigrationState.FINISHED)
