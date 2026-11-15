from engine.driver.nudge import Nudge
from engine.driver.hook_event import HookEvent
from engine.agent_machine.contracts.event_policy import EventPolicy
from engine.listener.rows.event_rows import EventRows
from core.modules.sequences.models.sequence import Sequence
from core.modules.sequences.models.support.sequence_guards import SequenceGuards
from core.modules.sequences.queries.sequence_run_query import SequenceRunQuery
from core.modules.sequences.nudges.step_refuses_command_nudge import StepRefusesCommandNudge


class StepCommandPolicy(EventPolicy):
    """A step refuses the journal commands it lists, also in a chain or inside a shell of their own."""

    key = "sequences.step-refused-command"
    rank = "sequences.policies"

    def __init__(self, runs: SequenceRunQuery, rows: EventRows) -> None:
        self.runs, self.rows = runs, rows

    def refusal(self, event: HookEvent, agent_id: int) -> Nudge | None:
        tool = event.tool
        run = self.runs.current(agent_id)
        if tool is None or tool.shell is None or run is None:
            return None
        sequence = self.rows.required(Sequence, run.sequence_id)
        if not tool.shell.runs_journal_command(*SequenceGuards.step_guard(sequence.step_guards, run.step_number).refused_commands):
            return None
        return StepRefusesCommandNudge.declared().nudge(sequence=sequence.id, step=run.step_number)
