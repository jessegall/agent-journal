from core.modules.sequences.support.sequence_nudges import STEP_WAITS
from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.hook_event_name import HookEventName
from engine.driver.rule_answer import RuleAnswer
from core.modules.sequences.queries.sequence_run_query import SequenceRunQuery
from core.modules.sequences.support.sequence_step_started import SequenceStepStarted


class UnstartedStepRule(DriverRule):
    """An agent whose sequence step is not taken up yet is blocked until it runs journal sequence follow.
    """

    name = "sequences.untaken-step"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]

    def __init__(self, runs: SequenceRunQuery) -> None:
        self.runs = runs

    def answer(self, hook: AgentHook) -> RuleAnswer:
        run = self.runs.current(hook.agent_id)
        if run is None or run.step_started:
            return RuleAnswer.allowed()
        return RuleAnswer.blocked(hook, STEP_WAITS.nudge(sequence=run.sequence_id, step=run.step_number), SequenceStepStarted([run.id, run.step_number]))
