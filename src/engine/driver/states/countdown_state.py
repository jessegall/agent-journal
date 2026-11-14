from collections.abc import Mapping, Sequence
from typing import ClassVar

from engine.driver.agent_hook import AgentHook
from engine.driver.block_condition import BlockCondition
from engine.driver.block_until import BlockUntil
from engine.driver.count_down import CountDown
from engine.driver.interval import Interval
from engine.driver.nudge_declaration import NudgeDeclaration
from engine.driver.span import Span
from engine.driver.states.block_state import BlockState


class CountdownState(BlockState):
    """An abstract shape: a block state whose block counts a span down before it holds. The state's rule starts the
    block with start, which builds the block exactly as RuleAnswer.blocking_after does; the state is open while that
    block is, and its key is the refusal's."""

    span: ClassVar[Span]
    refusal: ClassVar[NudgeDeclaration]
    countdown: ClassVar[CountDown]
    strict: ClassVar[bool] = False

    def keys(self) -> Sequence[str]:
        return [self.refusal.key]

    @classmethod
    def start(cls, hook: AgentHook, condition: BlockCondition, refusal_fields: Mapping[str, object] | None = None, **countdown_fields: object) -> BlockUntil:
        return BlockUntil(hook.agent_id, cls.refusal.nudge(**(refusal_fields or {})), condition, Interval(cls.span), cls.countdown.nudge("{left}", **countdown_fields), strict=cls.strict)
