from abc import ABC, abstractmethod
from collections.abc import Sequence

from engine.command.context import Context


class StepRequests(ABC):
    """Opens or joins each named agent's one open step request with a cause, in the write that changed its rows, so a
    request commits with the change (doc 1310 section 6.2). The drivers module binds it."""

    @abstractmethod
    def requested(self, agent_ids: Sequence[int], cause: str, context: Context) -> None: ...
