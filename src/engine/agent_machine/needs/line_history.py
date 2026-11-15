from abc import ABC, abstractmethod

from engine.time.timestamp import Timestamp


class LineHistory(ABC):
    """When a line source last gave an agent a line, under the key of the old rule it answers for: what a source
    that speaks once until something new happens reads. The drivers module binds it."""

    @abstractmethod
    def last_spoke(self, source_key: str, agent_id: int) -> Timestamp | None: ...
