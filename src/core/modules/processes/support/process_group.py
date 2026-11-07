import os
import signal

from core.base.leftover_process import LeftoverProcess


class ProcessGroup:
    """The group of processes the runner leads: the runner is its leader, so its pid is the group's number; a
    pid whose
    command no longer names the run's folder has gone to another program and is left alone; a dead leader's
    group can
    still hold its children, and they are stopped."""

    @staticmethod
    def stop(leader_pid: int | None, process_id: int) -> None:
        if leader_pid is None:
            return
        command = LeftoverProcess.command_line(leader_pid)
        if command and f"processes/{process_id}/" not in command:
            return
        try:
            os.killpg(leader_pid, signal.SIGTERM)
        except (ProcessLookupError, PermissionError):
            return
