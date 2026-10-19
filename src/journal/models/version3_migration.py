from dataclasses import dataclass

from journal.models.migration_state import MigrationState
from journal.models.model import Model


@dataclass(frozen=True)
class Version3Migration(Model):
    """Bringing the version 3 journal kept in .journal/version-3 across into this one, for the whole project."""

    state: MigrationState = MigrationState.OFFERED
    fault: str = ""
    """Why the last run failed, when it did."""

    def put_off(self) -> "Version3Migration":
        return self.with_(state=MigrationState.LATER)

    def begun(self) -> "Version3Migration":
        return self.with_(state=MigrationState.RUNNING)

    def done(self) -> "Version3Migration":
        return self.with_(state=MigrationState.DONE, fault="")

    def failed(self, fault: str) -> "Version3Migration":
        return self.with_(state=MigrationState.FAILED, fault=fault)
