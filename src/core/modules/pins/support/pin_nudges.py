from core.base.driver.interval import Interval
from core.base.driver.seconds import Seconds
from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType
from core.modules.drivers.models.support.tool_use_span import ToolUseSpan

PIN_REQUEST_TOOL_USES = 50

LINK_PIN_REQUEST = NudgeDeclaration("pins.pin_the_link", NudgeType.STEERING, 'pin this link if the user will return to it: journal pin make "<what>" --link "{url}"', interval=Interval(ToolUseSpan(PIN_REQUEST_TOOL_USES)))
UNPINNED_CLAIM = NudgeDeclaration("pins.pin_claimed_unmade", NudgeType.STEERING, 'you mentioned a pinned link but made none: journal pin make "<what>" --link "<url>"', interval=Interval(Seconds(300)))

BANG_BUTTON_REQUEST = NudgeDeclaration("pins.pin_the_bang_command", NudgeType.STEERING, 'a button runs your ! command in your terminal: journal pin make "<what>" --link "! <command>" --label "Run"', interval=Interval(Seconds(300)))

PIN_NUDGES = [LINK_PIN_REQUEST, UNPINNED_CLAIM, BANG_BUTTON_REQUEST]
