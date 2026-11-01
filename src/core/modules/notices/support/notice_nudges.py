from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType

LINK_PIN_REQUEST = NudgeDeclaration("notices.pin_the_link", NudgeType.INSTRUCTION, 'pin this link if the user will return to it: journal notice make "<what>" --link "{url}"', repeat_seconds=900)
UNPINNED_CLAIM = NudgeDeclaration("notices.pin_claimed_unmade", NudgeType.REMARK, 'you mentioned a pinned link but made none: journal notice make "<what>" --link "<url>"', repeat_seconds=300)

NOTICE_NUDGES = [LINK_PIN_REQUEST, UNPINNED_CLAIM]
