from engine.driver.agent_message import AgentMessage
from engine.driver.hook_event import HookEvent
from engine.agent_machine.contracts.event_policy import EventPolicy
from core.modules.sequences.queries.sequence_query import SequenceQuery
from core.modules.sequences.queries.sequence_run_query import SequenceRunQuery
from core.modules.sequences.nudges.step_edit_ban_message import StepEditBanMessage


class StepGuardPolicy(EventPolicy):
    """A step that holds file edits refuses a writing call, except journal lines and the commands the step
    allows."""

    key = "sequences.step-guard"
    rank = "sequences.policies"

    def __init__(self, runs: SequenceRunQuery, sequences: SequenceQuery) -> None:
        self.runs, self.sequences = runs, sequences

    def refusal(self, event: HookEvent, agent_id: int) -> AgentMessage | None:
        tool = event.tool
        if tool is None or tool.is_journal_line or not tool.is_writing_files():
            return None
        run = self.runs.current(agent_id)
        if run is None:
            return None
        guard = self.sequences.step_guard(run.sequence_id, run.step_number)
        if guard.file_edits_allowed:
            return None
        if tool.shell is not None and any(tool.shell.has_part_matching(pattern) for pattern in guard.allowed_commands):
            return None
        return StepEditBanMessage.declared().nudge(sequence=run.sequence_id, step=run.step_number)
