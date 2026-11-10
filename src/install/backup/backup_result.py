from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class BackupResult:
    """A backup of the version 4 database: where it is, how many tables it was checked on, and whether it was
    made now or an earlier upgrade's was kept."""

    path: Path
    tables: int
    kept: bool
