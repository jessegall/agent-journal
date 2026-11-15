from engine.database.database import Database
from engine.driver.hook_event import HookEvent
from engine.request.request_values import RequestValues
from core.modules.sequences.queries.sequence_query import SequenceQuery
from core.modules.sequences.queries.sequence_run_query import SequenceRunQuery


class HookTriggeredSequence:
    """The sequence a prompt or a finished tool call triggers for the agent whose hook it is, unless that sequence
    already runs for it: read once a hook, so the line that names it and the effect that starts it agree."""

    def __init__(self, sequences: SequenceQuery, runs: SequenceRunQuery, request_values: RequestValues, database: Database) -> None:
        self.sequences, self.runs, self.request_values, self.database = sequences, runs, request_values, database

    def sequence_id(self, event: HookEvent, agent_id: int) -> int | None:
        return self.request_values.read(f"sequences.triggered:{agent_id}:{event.firing}", self.database.change_mark, lambda: self.found(event, agent_id))

    def found(self, event: HookEvent, agent_id: int) -> int | None:
        triggered = [candidate for candidate in self.sequences.trigger_lists() if any(trigger.matches_hook(event) for trigger in candidate.triggers)]
        return next((candidate.sequence_id for candidate in triggered if not self.runs.is_running(agent_id, candidate.sequence_id)), None)
