from dataclasses import dataclass

from core.base.query.conditions.greater import Greater
from core.base.query.queries import Queries
from core.base.timestamp import Timestamp
from core.modules.drivers.models.enums.hook_answer import HookAnswer
from core.modules.drivers.models.hook_call import HookCall


@dataclass(frozen=True)
class WriteSpan:
    """A span of writes to files the agent was let make."""

    unit = "writes"

    count: int

    def has_passed(self, queries: Queries, agent_id: int, start: Timestamp, timestamp: Timestamp) -> bool:
        return queries.query(HookCall).filter(agent_id=agent_id, writes_files=True, answer=HookAnswer.ALLOWED).matching(Greater("created_at", start.text)).count() >= self.count
