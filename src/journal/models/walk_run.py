from dataclasses import dataclass

from journal.models.walk_record import WalkRecord

ENGINE_MOVES = ("tasks.updated", "task_logs.created", "plans.updated", "questions.created", "workers.updated", "sequences.updated", "prompt_submitted", "session_started", "session_ended", "ticked")
"""The events at which the engine moves the agent itself before the workflows run, so a run there can say the journal's own move came first."""


@dataclass(frozen=True)
class WalkRun:
    """A walk as the page lists it: its record, its event and states by title, and whether a node failed in it."""

    record: WalkRecord
    trigger: str
    failed: bool
    started: str
    """The title of the state the walk found the agent in."""
    moved_to: str
    """The title of the state a step moved the agent to, when one did."""

    def change_words(self) -> str:
        """A state change in words: by the step that moved the agent, or the engine's own move at a row event, before the list ran."""
        if self.record.moved_to:
            return f"{self.started} to {self.moved_to}, by step {self.record.moved_by[-1]}" if self.record.moved_by else ""
        if self.record.trigger in ENGINE_MOVES and self.record.row:
            return f"{self.started}, after {self.trigger.lower()} {self.record.row}: the journal's own move came first"
        return ""
