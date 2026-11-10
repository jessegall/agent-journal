from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType

APPROVAL_PENDING = NudgeDeclaration("approvals.asked", NudgeType.NOTICE, "A person was asked: approval {approval}",
                                   plural_text="A person was asked for {count} approvals",
                                   id_field="approval", turn_limited=False)
APPROVAL_DECIDED = NudgeDeclaration("approvals.decided", NudgeType.NOTICE, "approval {approval} was decided", turn_limited=False, wakes_agent=True)
APPROVAL_REVIEW = NudgeDeclaration("approvals.review", NudgeType.NOTICE, "approval {approval} needs your review",
                                  plural_text="{count} approvals need your review",
                                  id_field="approval", turn_limited=False)
