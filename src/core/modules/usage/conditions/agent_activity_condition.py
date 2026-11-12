from collections.abc import Mapping

from engine.database.statement import Statement
from engine.query.conditions.excluding import Excluding
from engine.query.conditions.among import Among
from engine.query.conditions.is_null import IsNull
from engine.query.conditions.any_of import AnyOf
from engine.query.conditions.all_of import AllOf


class AgentActivityCondition:
    def __init__(self, pending: Mapping[int, str]) -> None:
        self.pending = pending

    def statement(self) -> Statement:
        return self.active().statement()

    def active(self) -> AllOf:
        pending = tuple(self.pending)
        working = AnyOf([IsNull("ended_at"), Among("id", pending)]) if pending else IsNull("ended_at")
        return AllOf([working, IsNull("retired_at")])

    def idle(self) -> Statement:
        return AllOf([Excluding(self.active()), IsNull("retired_at")]).statement()
