class OutputFolder:
    def total_bytes(self, process_id: int) -> int:
        return process_id

    def part_bytes(self, process_id: int, position: int) -> int:
        return process_id + position

    def run_silent_seconds(self, process_id: int, timestamp: str) -> int:
        return len(timestamp) + process_id


class MeasuredFacts:
    def __init__(self, folder: OutputFolder) -> None:
        self.folder = folder

    def size(self, process_id: int, position: int) -> int:
        # @righteous architecture_processes_output_measured_outside_output_facts
        return self.folder.part_bytes(process_id, position)
