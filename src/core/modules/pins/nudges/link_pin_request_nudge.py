from engine.driver.nudge_declaration import NudgeDeclaration
from engine.driver.interval import Interval
from engine.enums.nudge_type import NudgeType
from core.modules.drivers.models.support.tool_use_span import ToolUseSpan

PIN_REQUEST_TOOL_USES = 50


class LinkPinRequestNudge(NudgeDeclaration):
    """The nudge pins.pin_the_link."""

    key = "pins.pin_the_link"
    type = NudgeType.STEERING
    text = "Pin this link if the user will come back to it: {url}"
    interval = Interval(ToolUseSpan(PIN_REQUEST_TOOL_USES))
