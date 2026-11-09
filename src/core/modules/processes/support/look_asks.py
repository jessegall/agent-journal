from dataclasses import dataclass

from core.modules.processes.support.output_folder import OutputFolder

LOOK_FILE = "look"


@dataclass(frozen=True)
class LookState:
    """The asks of a run that its agent has not answered, and the moment of the last ask or, when none is
    unanswered, of the last answer; zero for a run never asked."""

    unanswered: int
    at: float

    def is_due(self, now: float, hang_seconds: int, look_seconds: int) -> bool:
        return now - self.at >= (hang_seconds if self.unanswered else look_seconds)


class LookAsks:
    """The record, in a run's folder, of how often its agent was asked to look at the run and whether it
    answered: the agent answers by reading the run's output while it still runs, or by stopping it."""

    def __init__(self, folder: OutputFolder) -> None:
        self.folder = folder

    def state(self, process_id: int) -> LookState:
        recorded = self.folder.text(process_id, LOOK_FILE).split()
        return LookState(int(recorded[0]), float(recorded[1])) if len(recorded) == 2 else LookState(0, 0.0)

    def asked(self, process_id: int, now: float) -> None:
        self.folder.write(process_id, LOOK_FILE, f"{self.state(process_id).unanswered + 1} {now}")

    def answered(self, process_id: int, now: float) -> None:
        if self.state(process_id).unanswered:
            self.folder.write(process_id, LOOK_FILE, f"0 {now}")

    def forgotten(self, process_id: int) -> None:
        if self.state(process_id).at:
            self.folder.write(process_id, LOOK_FILE, "")
