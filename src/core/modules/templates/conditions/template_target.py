from dataclasses import dataclass

from engine.database.statement import Statement
from engine.query.conditions.any_of import AnyOf
from engine.query.conditions.json_list_empty import JsonListEmpty
from engine.query.conditions.json_list_holds import JsonListHolds

TARGETS_COLUMN = "targets"


@dataclass(frozen=True)
class TemplateTarget:
    """Matches templates for a target, including those with no target restriction."""

    target: str

    def statement(self) -> Statement:
        return AnyOf([JsonListEmpty(TARGETS_COLUMN), JsonListHolds(TARGETS_COLUMN, self.target)]).statement()
