PRIORITY_LEVELS = {"low": 100, "normal": 200, "high": 300, "critical": 400}
LEVEL_NAMES = {number: name for name, number in PRIORITY_LEVELS.items()}


class TaskPriority(int):
    """How soon a task should be taken up: a number with named levels, spaced so a level can go between two
    others; it is given by number or name, and a number that is a level reads by its name."""

    def __new__(cls, value: str | int) -> "TaskPriority":
        return super().__new__(cls, PRIORITY_LEVELS.get(str(value), value))

    def __str__(self) -> str:
        return LEVEL_NAMES.get(int(self), str(int(self)))


NORMAL_PRIORITY = TaskPriority(PRIORITY_LEVELS["normal"])
URGENT_PRIORITY = TaskPriority(PRIORITY_LEVELS["high"] + 1)
