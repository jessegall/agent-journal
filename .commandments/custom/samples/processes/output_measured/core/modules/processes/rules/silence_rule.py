from engine.driver.driver_rule import DriverRule


class OutputFolder:
    def total_bytes(self, process_id: int) -> int:
        return process_id

    def part_bytes(self, process_id: int, position: int) -> int:
        return process_id + position

    def run_silent_seconds(self, process_id: int, timestamp: str) -> int:
        return len(timestamp) + process_id


class SilenceRule(DriverRule):
    name = "samples.silence"

    def __init__(self, folder: OutputFolder) -> None:
        self.folder = folder

    def answer(self, hook):
        # @sin architecture_processes_output_measured_outside_output_facts
        return self.folder.run_silent_seconds(hook.process_id, hook.timestamp)
