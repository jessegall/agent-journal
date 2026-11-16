from collections.abc import Sequence

from engine.agent_machine.contracts.event_effect import EventEffect
from engine.command.command import Command
from engine.driver.hook_event import HookEvent
from engine.enums.agent_role import AgentRole
from engine.enums.hook_event_name import HookEventName
from core.modules.tasks.support.block_review_round import BLOCK_REVIEW_KEY, BlockReviewRound


class BlockReviewEffect(EventEffect):
    """Records a round of the blocked tasks' reminder, so its third pass holds the agent."""

    key = BLOCK_REVIEW_KEY
    events = [HookEventName.POST_TOOL_USE]
    agent_types = [AgentRole.MAIN.value]

    def __init__(self, review: BlockReviewRound) -> None:
        self.review = review

    def effect_commands(self, event: HookEvent | None, agent_id: int) -> Sequence[Command[object]]:
        record = self.review.answer(event, agent_id).record if event is not None else None
        return [record] if record is not None else []
