from collections.abc import Sequence

from engine.database.statement import Statement
from engine.query.conditions.condition import Condition


# The conditions joined by one SQL operator in brackets, or the given answer when there are none.
def joined_conditions(conditions: Sequence[Condition], operator: str, empty_statement: str) -> Statement:
    if not conditions:
        return Statement(empty_statement)
    joined = Statement.all_joined(tuple(condition.statement() for condition in conditions), f" {operator} ")
    return Statement(f"({joined.sql})", joined.parameters, joined.scan_reason)
