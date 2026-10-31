FOLDER = ".journal/processes"


class OutputFolder:
    """Where a process keeps its output files, relative to the project root."""

    @staticmethod
    def of(process_id: int) -> str:
        return f"{FOLDER}/{process_id}"
