from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_wildcard import HookWildcard
from core.base.driver.rule_answer import RuleAnswer
from core.base.query.queries import Queries
from core.base.query.conditions.equal import Equal
from core.modules.sequences.commands.move_sequence_run.move_sequence_run import MoveSequenceRun, START
from core.modules.sequences.models.sequence import Sequence
from core.modules.sequences.queries.sequence_run_query import SequenceRunQuery
from core.modules.sequences.support.sequence_nudges import SEQUENCE_STARTED
from core.modules.sequences.support.sequence_triggers import SequenceTriggers

EMPTY_TRIGGERS = "[]"


class SequenceTriggerRule(DriverRule):
    """A prompt or a finished tool call that meets a sequence's trigger starts that sequence for the main
    agent, unless one is running."""

    name = "sequences.triggers"
    hook = HookWildcard.ALL_HOOKS
    drivers = ["*"]
    roles = [AgentRole.MAIN]

    def __init__(self, queries: Queries, runs: SequenceRunQuery) -> None:
        self.queries, self.runs = queries, runs

    def answer(self, hook: AgentHook) -> RuleAnswer:
        candidates = self.queries.query(Sequence).matching(Equal("triggers", EMPTY_TRIGGERS, negated=True))
        triggered = [sequence for sequence in candidates.all_rows() if self.is_triggered(sequence, hook)]
        if not triggered or self.runs.current(hook.agent_id) is not None:
            return RuleAnswer.allowed()
        sequence = triggered[0]
        return RuleAnswer.with_nudges(SEQUENCE_STARTED.nudge(sequence=sequence.id)).running(MoveSequenceRun(START, sequence.id))

    @staticmethod
    def is_triggered(sequence: Sequence, hook: AgentHook) -> bool:
        return any(trigger.matches_hook(hook) for trigger in SequenceTriggers.parsed(sequence.triggers))
