import os
import signal


class ProcessGroup:
    """The group of processes the runner leads: the runner is its leader, so its pid is the group's number."""

    @staticmethod
    def stop(leader_pid: int | None) -> None:
        if leader_pid is None:
            return
        try:
            os.killpg(leader_pid, signal.SIGTERM)
        except (ProcessLookupError, PermissionError):
            return
