from core.modules.sequences.support.sequence_nudges import STEP_WAITS
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.base.query.queries import Queries
from core.modules.sequences.queries.sequence_run_query import SequenceRunQuery
from core.base.driver.conditions.ran_command import RanCommand

FOLLOW_COMMAND = "journal sequence follow"


class UntakenStepRule(DriverRule):
    """An agent whose sequence step is not taken up yet is blocked until it runs journal sequence follow.
    """

    name = "sequences.untaken-step"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]

    def __init__(self, runs: SequenceRunQuery, queries: Queries) -> None:
        self.runs, self.queries = runs, queries

    def answer(self, hook: AgentHook) -> RuleAnswer:
        run = self.runs.current(hook.agent_id)
        if run is None or run.step_started:
            return RuleAnswer.allowed()
        return RuleAnswer.blocked(hook, STEP_WAITS.nudge(sequence=run.sequence_id, step=run.step_number), RanCommand(FOLLOW_COMMAND))
