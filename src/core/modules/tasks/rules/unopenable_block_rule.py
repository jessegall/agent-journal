from engine.driver.agent_hook import AgentHook
from engine.driver.block_until import BlockUntil
from engine.driver.driver_rule import DriverRule
from engine.driver.rule_answer import RuleAnswer
from engine.enums.agent_role import AgentRole
from engine.enums.hook_event_name import HookEventName
from core.modules.tasks.support.block_review_round import BLOCK_REVIEW_KEY, BlockReviewRound


class UnopenableBlockRule(DriverRule):
    """The old walk's answer for BlockReviewLines, BlockReviewEffect and BlockReviewNeeds, which own it, until the
    walk is deleted."""

    name = BLOCK_REVIEW_KEY
    hook = HookEventName.POST_TOOL_USE
    drivers = ["*"]
    roles = [AgentRole.MAIN]

    def __init__(self, review: BlockReviewRound) -> None:
        self.review = review

    def answer(self, hook: AgentHook) -> RuleAnswer:
        review = self.review.answer(hook.event, hook.agent_id)
        answer = RuleAnswer.with_nudges(*review.notices).running(*([review.record] if review.record is not None else []))
        if review.hold is None:
            return answer
        return answer.running(BlockUntil(hook.agent_id, review.hold[0], review.hold[1], is_skippable=True))
