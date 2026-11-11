from dataclasses import dataclass

from engine.model.positioned import Positioned


@dataclass(frozen=True, kw_only=True)
class Phase(Positioned):
    """One step of a plan, at its place in the plan's order, with what is true when it is done. Only a phase
    flagged as a checkpoint takes a test command of its own; a command an older journal stored on another
    phase is kept."""

    model_name = "phase"
    cli_name = "phase"
    search_fields = ["title", "goal"]

    plan_id: int
    creator_id: int
    position: int
    title: str
    goal: str = ""
    checkpoint: bool = False
    test_command: str = ""

    def is_test_refused(self, previous: "Phase | None") -> bool:
        is_new_command = previous is None or previous.test_command != self.test_command
        return bool(self.test_command) and not self.checkpoint and is_new_command
