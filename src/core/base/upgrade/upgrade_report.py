from dataclasses import dataclass, field


@dataclass
class UpgradeReport:
    """What the moves of an upgrade did, per module: rows moved, rows an earlier run moved, the rows of the version 4
    tables a module knowingly left, and the version 4 tables no module claims with their row counts."""

    moved: dict[str, int] = field(default_factory=lambda: {})
    repeated: dict[str, int] = field(default_factory=lambda: {})
    dropped: dict[str, int] = field(default_factory=lambda: {})
    unclaimed: dict[str, int] = field(default_factory=lambda: {})
