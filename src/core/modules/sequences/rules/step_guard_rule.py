from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.enums.hook_event_name import HookEventName
from engine.driver.rule_answer import RuleAnswer
from core.modules.sequences.queries.sequence_query import SequenceQuery
from core.modules.sequences.queries.sequence_run_query import SequenceRunQuery
from core.modules.sequences.support.sequence_nudges import STEP_EDIT_BAN


class StepGuardRule(DriverRule):
    """A step that holds file edits refuses a writing call, except journal lines and the commands the step
    allows."""

    name = "sequences.step-guard"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    single_action_refusal = "A step that holds file edits refuses a writing call, except journal lines and the commands the step allows"

    def __init__(self, runs: SequenceRunQuery, sequences: SequenceQuery) -> None:
        self.runs, self.sequences = runs, sequences

    def answer(self, hook: AgentHook) -> RuleAnswer:
        tool = hook.event.tool
        if tool is None or tool.is_journal_line or not tool.is_writing_files():
            return RuleAnswer.allowed()
        run = self.runs.current(hook.agent_id)
        if run is None:
            return RuleAnswer.allowed()
        guard = self.sequences.step_guard(run.sequence_id, run.step_number)
        if guard.file_edits_allowed:
            return RuleAnswer.allowed()
        if tool.shell is not None and any(tool.shell.has_part_matching(pattern) for pattern in guard.allowed_commands):
            return RuleAnswer.allowed()
        return RuleAnswer.refused(STEP_EDIT_BAN.nudge(sequence=run.sequence_id, step=run.step_number))
