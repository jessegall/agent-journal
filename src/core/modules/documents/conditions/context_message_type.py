from dataclasses import dataclass

from engine.database.statement import Statement
from engine.query.conditions.condition import Condition
from engine.query.conditions.all_of import AllOf
from engine.query.conditions.among import Among
from engine.query.conditions.any_of import AnyOf
from engine.query.conditions.equal import Equal
from engine.query.conditions.subquery_match import SubqueryMatch

CONVERSATION_TYPES = ("user", "comment", "agent")


@dataclass(frozen=True)
class ContextMessageType:
    """Includes conversation messages and user-owned journal references without treating them as person speech."""

    users: Condition

    def statement(self) -> Statement:
        return AnyOf([Among("type", CONVERSATION_TYPES), AllOf([Equal("type", "journal"), SubqueryMatch("creator_id", self.users)])]).statement()
