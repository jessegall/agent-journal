from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType

APPROVAL_PENDING = NudgeDeclaration("approvals.asked", NudgeType.NOTICE, "Approval {approval} was sent to a user",
                                   plural_text="A user was asked for {count} approvals",
                                   id_field="approval", turn_limited=False)
APPROVAL_DECIDED = NudgeDeclaration("approvals.decided", NudgeType.NOTICE, "Approval {approval} is decided", turn_limited=False, wakes_agent=True)
APPROVAL_REVIEW = NudgeDeclaration("approvals.review", NudgeType.NOTICE, "Approval {approval} needs your review",
                                  plural_text="{count} approvals need your review",
                                  id_field="approval", turn_limited=False)
