from abc import ABC, abstractmethod

# the slice of the new driver that answers an agent's waits and wakes it through the one wake owner
WAITING_SLICE = "waiting"


class SliceAnswers(ABC):
    """Whether a slice of the new driver answers an agent now, so an old path of that slice stands down for it
    (doc 1310 section 13.2). The drivers module binds it."""

    @abstractmethod
    def answers(self, agent_id: int, slice_name: str) -> bool: ...
