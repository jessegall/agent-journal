from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType

APPROVAL_PENDING = NudgeDeclaration("approvals.asked", NudgeType.NOTICE, "A person was asked: approval {approval}: journal approval show {approval}",
                                   plural_text="A person was asked for {count} approvals: journal approval list --state open",
                                   id_field="approval", turn_limited=False)
APPROVAL_DECIDED = NudgeDeclaration("approvals.decided", NudgeType.NOTICE, "approval {approval} was decided: journal approval show {approval}", turn_limited=False, wakes_agent=True)
