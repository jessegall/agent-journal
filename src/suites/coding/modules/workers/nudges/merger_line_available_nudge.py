from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class MergerLineAvailableNudge(NudgeDeclaration):
    """The nudge workers.merger_line_available."""

    key = "workers.merger_line_available"
    type = NudgeType.STEERING
    text = "merger-line:{line}"
    turn_limited = False
    wakes_agent = True
    id_field = "line"
    plural_text = "merger-lines {line}"
