from collections.abc import Sequence
from dataclasses import dataclass

from engine.database.statement import Statement
from engine.query.conditions.among import Among
from engine.query.conditions.disjunction import Disjunction
from engine.query.conditions.has_value import HasValue


@dataclass(frozen=True)
class EndedAgents:
    """Agents explicitly retired, and agents whose stored type no installed module registers any more."""

    registered_types: Sequence[str]

    def statement(self) -> Statement:
        return Disjunction([HasValue("retired_at"), Among("role", self.registered_types, negated=True)]).statement()
