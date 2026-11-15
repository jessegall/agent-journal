from collections.abc import Sequence

from engine.agent_machine.contracts.event_line_source import EventLineSource
from engine.driver.hook_event import HookEvent
from engine.driver.nudge import Nudge
from engine.enums.agent_role import AgentRole
from engine.enums.hook_event_name import HookEventName
from core.modules.tasks.support.block_review_round import BLOCK_REVIEW_KEY, BlockReviewRound


class BlockReviewLines(EventLineSource):
    """A line for each task the main agent blocked by hand whose review is due."""

    key = BLOCK_REVIEW_KEY
    events = [HookEventName.POST_TOOL_USE]
    agent_types = [AgentRole.MAIN.value]

    def __init__(self, review: BlockReviewRound) -> None:
        self.review = review

    def nudges(self, event: HookEvent | None, agent_id: int) -> Sequence[Nudge]:
        return self.review.answer(event, agent_id).notices if event is not None else []
