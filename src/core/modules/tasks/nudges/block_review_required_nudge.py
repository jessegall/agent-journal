from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class BlockReviewRequiredNudge(NudgeDeclaration):
    """The nudge tasks.block_review_hold."""

    key = "tasks.block_review_hold"
    type = NudgeType.REFUSAL
    text = "Review blocked tasks {tasks}: act on each, or skip block {block} with a reason"
