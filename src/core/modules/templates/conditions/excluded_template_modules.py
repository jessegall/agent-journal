from collections.abc import Sequence
from dataclasses import dataclass

from core.base.database.statement import Statement
from engine.query.conditions.among import Among


@dataclass(frozen=True)
class ExcludedTemplateModules:
    """Excludes templates supplied by modules that are inactive in the current environment."""

    modules: Sequence[str]

    def statement(self) -> Statement:
        excluded = Among("module", self.modules).statement()
        return Statement(f"NOT ({excluded.sql})", excluded.parameters)
