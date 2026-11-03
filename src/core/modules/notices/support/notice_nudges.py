from core.base.driver.interval import Interval
from core.base.driver.seconds import Seconds
from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType
from core.modules.drivers.support.tool_use_span import ToolUseSpan

PIN_REQUEST_TOOL_USES = 50

LINK_PIN_REQUEST = NudgeDeclaration("notices.pin_the_link", NudgeType.INSTRUCTION, 'pin this link if the user will return to it: journal notice make "<what>" --link "{url}"', interval=Interval(ToolUseSpan(PIN_REQUEST_TOOL_USES)), required_command="")
UNPINNED_CLAIM = NudgeDeclaration("notices.pin_claimed_unmade", NudgeType.NUDGE, 'you mentioned a pinned link but made none: journal notice make "<what>" --link "<url>"', interval=Interval(Seconds(300)))

BANG_BUTTON_REQUEST = NudgeDeclaration("notices.pin_the_bang_command", NudgeType.INSTRUCTION, 'a button runs your ! command in your terminal: journal notice make "<what>" --link "! <command>" --label "Run"', interval=Interval(Seconds(300)), required_command="")

NOTICE_NUDGES = [LINK_PIN_REQUEST, UNPINNED_CLAIM, BANG_BUTTON_REQUEST]
