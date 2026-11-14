from collections.abc import Mapping, Sequence
from typing import Protocol


class TaskConversation(Protocol):
    """The bounded conversation supplied with a task overview."""

    def lines(self) -> Sequence[str]: ...

    def json(self) -> Mapping[str, object]: ...
