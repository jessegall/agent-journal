from dataclasses import dataclass

from engine.database.statement import Statement
from engine.query.conditions.disjunction import Disjunction
from engine.query.conditions.json_list_empty import JsonListEmpty
from engine.query.conditions.json_list_contains import JsonListContains

TARGETS_COLUMN = "targets"


@dataclass(frozen=True)
class TemplateTarget:
    """Matches templates for a target, including those with no target restriction."""

    target: str

    def statement(self) -> Statement:
        return Disjunction([JsonListEmpty(TARGETS_COLUMN), JsonListContains(TARGETS_COLUMN, self.target)]).statement()
