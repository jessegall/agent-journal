import os
import signal

from core.base.leftover_process import LeftoverProcess


class ProcessGroup:
    """The group of processes the runner leads: the runner is its leader, so its pid is the group's number; a pid whose
    command no longer names the run's folder has gone to another program and is left alone."""

    @staticmethod
    def stop(leader_pid: int | None, process_id: int) -> None:
        if leader_pid is None or f"processes/{process_id}/" not in LeftoverProcess.command_line(leader_pid):
            return
        try:
            os.killpg(leader_pid, signal.SIGTERM)
        except (ProcessLookupError, PermissionError):
            return
