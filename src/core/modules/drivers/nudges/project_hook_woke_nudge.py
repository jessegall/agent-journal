from engine.enums.line_delivery import LineDelivery
from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class ProjectHookWokeNudge(NudgeDeclaration):
    """The nudge drivers.project_hook_woke."""

    key = "drivers.project_hook_woke"
    type = NudgeType.NOTICE
    text = "project hook {hook} woke you: {text}"
    turn_limited = False
    wakes_agent = True
    delivery = LineDelivery.WAKE_HOOK
    full_text = True
