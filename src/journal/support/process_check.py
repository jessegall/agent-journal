import os


class ProcessCheck:
    """Whether a process of this machine still runs, by its id, or by its id as a file holds it."""

    @classmethod
    def is_running_text(cls, pid: str) -> bool:
        return pid.strip().isdigit() and cls.is_running(int(pid))

    @staticmethod
    def is_running(pid: int) -> bool:
        if pid <= 0:
            return False
        try:
            os.kill(pid, 0)
        except ProcessLookupError:
            return False
        except PermissionError:
            return True
        return True
