
from core.modules.processes.support.output_folder import OutputFolder
from core.modules.processes.support.look_state import LookState

CHECK_FILE = "look"


class LookAsks:
    """The record, in a run's folder, of how often its agent was asked to look at the run and whether it
    answered: the agent answers by reading the run's output while it still runs, or by stopping it."""

    def __init__(self, folder: OutputFolder) -> None:
        self.folder = folder

    def state(self, process_id: int) -> LookState:
        stored = self.folder.text(process_id, CHECK_FILE).split()
        return LookState(int(stored[0]), float(stored[1])) if len(stored) == 2 else LookState(0, 0.0)

    def record_ask(self, process_id: int, clock_seconds: float) -> None:
        self.folder.write(process_id, CHECK_FILE, f"{self.state(process_id).unanswered + 1} {clock_seconds}")

    def record_answer(self, process_id: int, clock_seconds: float) -> None:
        if self.state(process_id).unanswered:
            self.folder.write(process_id, CHECK_FILE, f"0 {clock_seconds}")

    def clear(self, process_id: int) -> None:
        if self.state(process_id).request_seconds:
            self.folder.write(process_id, CHECK_FILE, "")
