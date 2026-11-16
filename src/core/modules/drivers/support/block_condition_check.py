from collections.abc import Sequence

from engine.agent_machine.record.question import Question
from engine.container.container import Container
from engine.driver.agent_hook import AgentHook
from engine.driver.block_check import BlockCheck
from engine.driver.conditions.unregistered_condition import UnregisteredCondition
from engine.enums.condition_outcome import ConditionOutcome
from engine.log.error_log import ErrorLog
from engine.module.block_conditions import BlockConditions
from engine.time.clock import Clock
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.drivers.models.agent_block import AgentBlock
from core.modules.drivers.support.actor_loader import ActorLoader


class BlockConditionCheck:
    """Judges each open hold row's condition at a hook, typed (doc 1310 section 4.5): no target left is target
    missing, a true condition satisfied, else pending; a condition that cannot be judged, because it raises or
    its module is gone, is unavailable, which never passes and asks a person to repair the hold. A step
    outside a hook judges nothing, and its rows wait for the agent's next hook."""

    def __init__(self, conditions: BlockConditions, agents: AgentRows, loader: ActorLoader, clock: Clock, container: Container, errors: ErrorLog) -> None:
        self.conditions, self.agents, self.loader, self.clock, self.container, self.errors = conditions, agents, loader, clock, container, errors

    def outcomes(self, rows: Sequence[AgentBlock], question: Question, agent_id: int) -> dict[int, ConditionOutcome]:
        if question.event is None or not rows:
            return {}
        hook = AgentHook.of_actor(question.event, self.loader.loaded(self.agents.find(agent_id)), self.clock.timestamp())
        self.conditions.prepare([(row.condition_name, row.condition_text) for row in rows], self.container)
        # rows that ask the same condition from the same opening, such as one hold for each task of a delivery, are judged once
        judged: dict[tuple[str, str, str], ConditionOutcome] = {}
        outcomes: dict[int, ConditionOutcome] = {}
        for row in rows:
            asked = (row.condition_name, row.condition_text, row.creation_timestamp().text)
            if asked not in judged:
                judged[asked] = self.outcome(row, hook)
            outcomes[row.id] = judged[asked]
        return outcomes

    def outcome(self, row: AgentBlock, hook: AgentHook) -> ConditionOutcome:
        condition = self.conditions.built(row.condition_name, row.condition_text)
        if isinstance(condition, UnregisteredCondition):
            return ConditionOutcome.UNAVAILABLE
        try:
            if not condition.has_target(self.container):
                return ConditionOutcome.TARGET_MISSING
            return ConditionOutcome.SATISFIED if condition.is_true(BlockCheck(hook, row.creation_timestamp(), self.container)) else ConditionOutcome.PENDING
        # a condition that fails to judge never lets the hold pass: it is unavailable and logged
        except Exception as error:
            self.errors.reported(["block judgement", row.condition_name], error, hook.environment_id)
            return ConditionOutcome.UNAVAILABLE
