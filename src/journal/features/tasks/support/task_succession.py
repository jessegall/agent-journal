from typing import ClassVar

from journal.events.data_source import DataSource


class TaskSuccession(DataSource[int]):
    """The task that starts on its own once the one in hand closes, 0 when none; whatever runs tasks in order answers it, and tasks alone read 0."""

    name: ClassVar[str] = "task_succession"

    @classmethod
    def missing(cls) -> int:
        return 0
