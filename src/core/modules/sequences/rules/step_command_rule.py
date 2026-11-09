from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.base.listener.event_rows import EventRows
from core.modules.sequences.models.sequence import Sequence
from core.modules.sequences.models.support.sequence_guards import SequenceGuards
from core.modules.sequences.queries.sequence_run_query import SequenceRunQuery
from core.modules.sequences.support.sequence_nudges import STEP_REFUSES_COMMAND


class StepCommandRule(DriverRule):
    """A step refuses the journal commands it lists, also in a chain or inside a shell of their own."""

    name = "sequences.step-refused-command"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]

    def __init__(self, runs: SequenceRunQuery, rows: EventRows) -> None:
        self.runs, self.rows = runs, rows

    def answer(self, hook: AgentHook) -> RuleAnswer:
        tool = hook.event.tool
        run = self.runs.current(hook.agent_id)
        if tool is None or tool.shell is None or run is None:
            return RuleAnswer.allowed()
        sequence = self.rows.required(Sequence, run.sequence_id)
        if not tool.shell.runs_journal_command(*SequenceGuards.step_guard(sequence.step_guards, run.step_number).refused_commands):
            return RuleAnswer.allowed()
        return RuleAnswer.refused(STEP_REFUSES_COMMAND.nudge(sequence=sequence.id, step=run.step_number))
