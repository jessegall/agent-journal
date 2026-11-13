from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.enums.rule_priority import RulePriority
from engine.enums.hook_event_name import HookEventName
from engine.driver.rule_answer import RuleAnswer
from core.modules.sequences.support.sequence_nudges import SEQUENCE_UNFINISHED
from core.modules.sequences.support.sequence_stop_blockers import SequenceStopBlockers


class SequenceStopRule(DriverRule):
    """An agent with a running sequence may not stop, however often it asks, unless it is waiting."""

    name = "sequences.finish-before-stop"
    hook = HookEventName.STOP
    drivers = ["*"]
    exempt = True
    priority = RulePriority.STOP_OPEN_WORK
    single_action_refusal = "An agent with a running sequence may not stop, however often it asks, unless it is waiting"

    def __init__(self, work: SequenceStopBlockers) -> None:
        self.work = work

    def answer(self, hook: AgentHook) -> RuleAnswer:
        run = self.work.blocking_run(hook.agent_id)
        if run is None:
            return RuleAnswer.allowed("no running sequence holds the agent")
        return RuleAnswer.refused(SEQUENCE_UNFINISHED.nudge(sequence=run.sequence_id, step=run.step_number))
