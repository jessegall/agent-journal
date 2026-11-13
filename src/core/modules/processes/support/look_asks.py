from dataclasses import dataclass

from core.modules.processes.support.output_folder import OutputFolder

LOOK_FILE = "look"


@dataclass(frozen=True)
class LookState:
    """The asks of a run that its agent has not answered, and the moment of the last ask or, when none is
    unanswered, of the last answer; zero for a run never asked."""

    unanswered: int
    ask_seconds: float

    def waited_enough(self, clock_seconds: float, hang_seconds: int, look_seconds: int) -> bool:
        return clock_seconds - self.ask_seconds >= (hang_seconds if self.unanswered else look_seconds)


class LookAsks:
    """The record, in a run's folder, of how often its agent was asked to look at the run and whether it
    answered: the agent answers by reading the run's output while it still runs, or by stopping it."""

    def __init__(self, folder: OutputFolder) -> None:
        self.folder = folder

    def state(self, process_id: int) -> LookState:
        stored = self.folder.text(process_id, LOOK_FILE).split()
        return LookState(int(stored[0]), float(stored[1])) if len(stored) == 2 else LookState(0, 0.0)

    def record_ask(self, process_id: int, clock_seconds: float) -> None:
        self.folder.write(process_id, LOOK_FILE, f"{self.state(process_id).unanswered + 1} {clock_seconds}")

    def record_answer(self, process_id: int, clock_seconds: float) -> None:
        if self.state(process_id).unanswered:
            self.folder.write(process_id, LOOK_FILE, f"0 {clock_seconds}")

    def clear(self, process_id: int) -> None:
        if self.state(process_id).ask_seconds:
            self.folder.write(process_id, LOOK_FILE, "")
