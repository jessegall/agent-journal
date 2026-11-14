from engine.errors.refusal import Refusal

MOST_COMPLEXITY = 5


class TaskComplexity(int):
    """How hard a task is, from 1 to 5, set by whoever knows it; no score means nobody said."""

    def __new__(cls, value: str | int) -> "TaskComplexity":
        number = int(value)
        if not 1 <= number <= MOST_COMPLEXITY:
            raise Refusal(f"complexity is 1 to {MOST_COMPLEXITY}, not {number}",
                          "1 is a line or two, 5 is a design with risk")
        return super().__new__(cls, number)
