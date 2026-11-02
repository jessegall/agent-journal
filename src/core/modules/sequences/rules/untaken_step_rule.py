from core.modules.sequences.support.sequence_nudges import STEP_WAITS
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.base.driver.tool_type import ToolType
from core.base.query.queries import Queries
from core.modules.sequences.queries.sequence_run_query import SequenceRunQuery

EDIT_TOOL_TYPES = (ToolType.EDIT, ToolType.NEW_FILE)


class UntakenStepRule(DriverRule):
    """An agent whose sequence step is not taken up yet edits no file until it runs journal sequence follow."""

    name = "sequences.untaken-step"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]

    def __init__(self, runs: SequenceRunQuery, queries: Queries) -> None:
        self.runs, self.queries = runs, queries

    def answer(self, hook: AgentHook) -> RuleAnswer:
        tool = hook.event.tool
        if tool is None or tool.category not in EDIT_TOOL_TYPES:
            return RuleAnswer.allowed()
        run = self.runs.current(hook.agent_id)
        if run is None or run.step_started:
            return RuleAnswer.allowed()
        return RuleAnswer.refused(STEP_WAITS.nudge(sequence=run.sequence_id, step=run.step_number))
