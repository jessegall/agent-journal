from engine.driver.interval import Interval
from engine.driver.seconds import Seconds
from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType
from core.modules.drivers.models.support.tool_use_span import ToolUseSpan

PIN_REQUEST_TOOL_USES = 50

LINK_PIN_REQUEST = NudgeDeclaration("pins.pin_the_link", NudgeType.STEERING, 'pin this link if the user will return to it: {url}', interval=Interval(ToolUseSpan(PIN_REQUEST_TOOL_USES)))
UNPINNED_CLAIM = NudgeDeclaration("pins.pin_claimed_unmade", NudgeType.STEERING, 'you mentioned a pinned link but made none', interval=Interval(Seconds(300)))

BANG_BUTTON_REQUEST = NudgeDeclaration("pins.pin_the_bang_command", NudgeType.STEERING, 'a pin can hold a button that runs your ! command in your terminal', interval=Interval(Seconds(300)))

PIN_NUDGES = [LINK_PIN_REQUEST, UNPINNED_CLAIM, BANG_BUTTON_REQUEST]
