from collections.abc import Sequence
from dataclasses import dataclass
from core.base.database.migration import Migration


@dataclass(frozen=True)
class ModuleMigrations:
    """The migrations of one module."""

    module: str
    migrations: Sequence[Migration]
