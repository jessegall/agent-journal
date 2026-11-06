from collections.abc import Sequence


class TaskWaitAttempts:
    """Finds when the commands for task waits were last tried."""

    def last_runs(self, wait_ids: Sequence[int]) -> dict[int, str]:
        return {}
