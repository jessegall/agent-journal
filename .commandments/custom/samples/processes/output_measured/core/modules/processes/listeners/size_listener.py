from engine.listener.commit.commit_listener import CommitListener


class OutputFolder:
    def total_bytes(self, process_id: int) -> int:
        return process_id

    def part_bytes(self, process_id: int, position: int) -> int:
        return process_id + position

    def run_silent_seconds(self, process_id: int, timestamp: str) -> int:
        return len(timestamp) + process_id


class SizeListener(CommitListener):
    def __init__(self, folder: OutputFolder) -> None:
        self.folder = folder

    def handle(self, event):
        # @sin architecture_processes_output_measured_outside_output_facts
        return self.folder.total_bytes(event.process_id)
