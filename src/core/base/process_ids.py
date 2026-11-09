import os


class ProcessIds:
    """Answers whether a process with a given id is on this machine."""

    @staticmethod
    def exists(process_id: int) -> bool:
        try:
            os.kill(process_id, 0)
        except ProcessLookupError:
            return False
        except PermissionError:
            return True
        return True
