from collections.abc import Iterable


class TaskNumberList:
    """Task numbers as a message lists them: separated by commas."""

    @staticmethod
    def text(task_ids: Iterable[int]) -> str:
        return ", ".join(str(task_id) for task_id in task_ids)
