from core.base.driver.interval import Interval
from core.base.driver.seconds import Seconds
from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType

LINK_PIN_REQUEST = NudgeDeclaration("notices.pin_the_link", NudgeType.INSTRUCTION, 'pin this link if the user will return to it: journal notice make "<what>" --link "{url}"', interval=Interval(Seconds(900)), required_command="")
UNPINNED_CLAIM = NudgeDeclaration("notices.pin_claimed_unmade", NudgeType.NUDGE, 'you mentioned a pinned link but made none: journal notice make "<what>" --link "<url>"', interval=Interval(Seconds(300)))

NOTICE_NUDGES = [LINK_PIN_REQUEST, UNPINNED_CLAIM]
