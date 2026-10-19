from dataclasses import dataclass

from journal.models.model import Model


@dataclass(frozen=True)
class MigratedRow(Model):
    """A version 3 row brought across, by where it lay in the backup and the row it became, so a second run never brings it twice."""

    source: str = ""
    """Where the row lay in .journal/version-3, such as environments/main/messages/120."""
    target: str = ""
    """The row it became, as a ref such as messages:4180."""
