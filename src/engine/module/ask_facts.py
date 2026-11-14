from abc import ABC, abstractmethod
from collections.abc import Sequence

from engine.module.ask_fact import AskFact


class AskFacts(ABC):
    """The facts a question carries up its stack about the helper that asked it, as labelled lines in order."""

    @abstractmethod
    def facts(self, asker_id: int, task_id: int | None) -> Sequence[AskFact]: ...
