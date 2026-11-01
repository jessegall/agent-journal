import re

from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.base.query.queries import Queries
from core.modules.sequences.models.sequence import Sequence
from core.modules.sequences.queries.sequence_run_query import SequenceRunQuery
from core.modules.sequences.support.sequence_guards import SequenceGuards
from core.modules.sequences.support.sequence_nudges import STEP_HOLDS_EDITS

STEP_SHOWN_CHARACTERS = 40


class StepGuardRule(DriverRule):
    """A step that holds file edits refuses a writing call, except journal lines and the commands the step allows."""

    name = "sequences.step-guard"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]

    def __init__(self, runs: SequenceRunQuery, queries: Queries) -> None:
        self.runs, self.queries = runs, queries

    def answer(self, hook: AgentHook) -> RuleAnswer:
        tool = hook.event.tool
        if tool is None or tool.is_journal_line or not tool.is_writing_files():
            return RuleAnswer.allowed()
        run = self.runs.current(hook.agent_id)
        if run is None:
            return RuleAnswer.allowed()
        sequence = self.queries.query(Sequence).find(run.sequence_id)
        guards = SequenceGuards.parsed(sequence.step_guards)
        guard = guards[run.step_number - 1] if run.step_number <= len(guards) else {}
        if guard.get("file_edits_allowed", True):
            return RuleAnswer.allowed()
        if tool.shell is not None and any(re.search(pattern, tool.shell.line) for pattern in guard.get("allowed_commands", [])):
            return RuleAnswer.allowed()
        return RuleAnswer.refused(STEP_HOLDS_EDITS.nudge(sequence=sequence.id, step=run.step_number, text=sequence.steps[run.step_number - 1][:STEP_SHOWN_CHARACTERS]))
