from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_wildcard import HookWildcard
from core.base.driver.rule_answer import RuleAnswer
from core.modules.sequences.commands.move_sequence_run.move_sequence_run import MoveSequenceRun, START
from core.modules.sequences.models.support.sequence_trigger_list import SequenceTriggerList
from core.modules.sequences.queries.sequence_query import SequenceQuery
from core.modules.sequences.queries.sequence_run_query import SequenceRunQuery
from core.modules.sequences.support.sequence_nudges import SEQUENCE_STARTED


class SequenceTriggerRule(DriverRule):
    """A prompt or a finished tool call that matches a sequence's trigger starts that sequence for the agent whose
    hook it is, on top of any run it has, unless that sequence already runs for that agent."""

    name = "sequences.triggers"
    hook = HookWildcard.ALL_HOOKS
    drivers = ["*"]

    def __init__(self, sequences: SequenceQuery, runs: SequenceRunQuery) -> None:
        self.sequences, self.runs = sequences, runs

    def answer(self, hook: AgentHook) -> RuleAnswer:
        triggered = [candidate for candidate in self.sequences.trigger_lists() if self.is_triggered(candidate, hook)]
        sequence = next((candidate for candidate in triggered if not self.runs.is_running(hook.agent_id, candidate.sequence_id)), None)
        if sequence is None:
            return RuleAnswer.allowed()
        return RuleAnswer.with_nudges(SEQUENCE_STARTED.nudge(sequence=sequence.sequence_id)).running(MoveSequenceRun(START, sequence.sequence_id))

    @staticmethod
    def is_triggered(candidate: SequenceTriggerList, hook: AgentHook) -> bool:
        return any(trigger.matches_hook(hook) for trigger in candidate.triggers)
