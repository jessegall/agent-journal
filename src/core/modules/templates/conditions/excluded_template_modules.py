from collections.abc import Sequence
from dataclasses import dataclass

from engine.database.statement import Statement
from engine.query.conditions.among import Among
from engine.query.conditions.excluding import Excluding


@dataclass(frozen=True)
class ExcludedTemplateModules:
    """Excludes templates supplied by modules that are inactive in the current environment."""

    modules: Sequence[str]

    def statement(self) -> Statement:
        return Excluding(Among("module", self.modules)).statement()
